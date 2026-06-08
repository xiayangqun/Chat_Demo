# Chat Demo 接口定义文档

## 1. 接口总览

本项目使用两类接口：

1. GraphQL：查询数据和执行写操作。
2. Socket.IO：推送实时事件。

原则：

- 消息发送只通过 GraphQL `sendMessage` mutation。
- Socket.IO 不直接创建数据，只广播后端已经持久化的事件。
- Socket.IO 服务端推送事件 payload 使用 Google Protocol Buffers 二进制编码。
- GraphQL 仍然使用标准 JSON/GraphQL 请求响应。
- Protobuf 协议定义见 `proto/chat_realtime.proto` 和 `realtime_protocol_design.md`。

## 2. HTTP 和 Socket 地址

开发环境：

- GraphQL Endpoint：`http://localhost:4000/graphql`
- Socket.IO Endpoint：`http://localhost:4000`
- Health Check：`GET http://localhost:4000/health`

请求头：

```http
Authorization: Bearer <access-token>
```

认证说明：

- `register` 和 `login` mutation 不需要 Authorization。
- 除 `register` 和 `login` 外，其它 GraphQL query/mutation 都需要 Authorization。
- access token 由 `register` 或 `login` 返回。

## 3. GraphQL Scalar

```graphql
scalar DateTime
```

DateTime 使用 ISO 8601 字符串，例如：

```text
2026-06-06T12:00:00.000Z
```

## 4. GraphQL Enums

```graphql
enum ConversationType {
  GROUP
  DIRECT
}

enum ConversationRole {
  OWNER
  MEMBER
}

enum MessageType {
  TEXT
}
```

## 5. GraphQL Object Types

### 5.1 User

```graphql
type User {
  id: ID!
  username: String!
  name: String!
  avatarUrl: String
  title: String
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

说明：

- `title` 用于提及下拉的副标题，例如 `CTO@Apple`。
- `username` 用于登录，不用于聊天气泡主展示。

### 5.2 AuthPayload

```graphql
type AuthPayload {
  token: String!
  user: User!
}
```

说明：

- `token` 是 JWT access token。
- 前端保存 token 后，在 GraphQL 请求头传 `Authorization: Bearer <token>`。

### 5.3 Conversation

```graphql
type Conversation {
  id: ID!
  name: String!
  type: ConversationType!
  avatarUrls: [String!]!
  memberCount: Int!
  members: [User!]!
  unreadCount: Int!
  mentionCount: Int!
  lastMessage: MessagePreview
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

说明：

- `unreadCount` 是当前请求用户视角的未读数。
- `mentionCount` 是当前请求用户被 @ 的未读数（标记已读后归零）。
- `avatarUrls` 可以为空数组，前端使用默认头像。

### 5.4 ConversationMember

```graphql
type ConversationMember {
  id: ID!
  conversationId: ID!
  user: User!
  role: ConversationRole!
  unreadCount: Int!
  mentionCount: Int!
  lastReadAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### 5.5 MessagePreview

```graphql
type MessagePreview {
  id: ID!
  conversationId: ID!
  sender: User!
  body: String!
  type: MessageType!
  createdAt: DateTime!
}
```

说明：

- 用于会话列表最后消息。
- 不需要包含 quote 和 mentions。

### 5.6 MessageQuote

```graphql
type MessageQuote {
  id: ID!
  sender: User!
  body: String!
  type: MessageType!
  createdAt: DateTime!
}
```

说明：

- 用于消息内引用摘要。

### 5.7 Message

```graphql
type Message {
  id: ID!
  conversationId: ID!
  sender: User!
  type: MessageType!
  body: String!
  quoteMessage: MessageQuote
  mentions: [User!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

## 6. Pagination Types

```graphql
type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

type MessageEdge {
  cursor: String!
  node: Message!
}

type MessageConnection {
  edges: [MessageEdge!]!
  nodes: [Message!]!
  pageInfo: PageInfo!
}
```

说明：

- `nodes` 方便前端直接渲染。
- `edges` 保留标准 cursor pagination 结构。

## 7. Input Types

### 7.1 RegisterInput

```graphql
input RegisterInput {
  username: String!
  displayName: String!
  password: String!
}
```

字段说明：

- `username`：登录用户名，trim 后转小写保存，必须唯一。
- `displayName`：聊天展示名，对应 User.name。
- `password`：明文密码只在请求中出现，后端必须哈希保存。

### 7.2 LoginInput

```graphql
input LoginInput {
  username: String!
  password: String!
}
```

### 7.3 CreateGroupConversationInput

```graphql
input CreateGroupConversationInput {
  name: String!
  memberUserIds: [ID!]!
}
```

字段说明：

- `name`：群聊名称，trim 后 1 到 60 个字符。
- `memberUserIds`：要加入群聊的其他注册用户 ID，不包含当前用户也可以；后端会自动加入当前用户。

### 7.4 SendMessageInput

```graphql
input SendMessageInput {
  conversationId: ID!
  body: String!
  quoteMessageId: ID
  mentionUserIds: [ID!] = []
  clientMutationId: String
}
```

字段说明：

- `conversationId`：目标会话。
- `body`：消息文本，后端 trim 后保存。
- `quoteMessageId`：引用消息 ID。
- `mentionUserIds`：被提及用户 ID，后端去重和校验。
- `clientMutationId`：前端 optimistic UI 可传，后端原样返回。

### 7.5 SendMessagePayload

```graphql
type SendMessagePayload {
  message: Message!
  conversation: Conversation!
  clientMutationId: String
}
```

## 8. Query Definition

```graphql
type Query {
  me: User!
  users(query: String = "", limit: Int = 50, skip: Int = 0): [User!]!
  conversations: [Conversation!]!
  conversation(id: ID!): Conversation!
  messages(conversationId: ID!, first: Int = 30, after: String): MessageConnection!
  conversationMembers(conversationId: ID!, query: String = "", limit: Int = 10): [User!]!
}
```

### 8.1 `me`

用途：

- 获取当前用户。

示例：

```graphql
query Me {
  me {
    id
    username
    name
    avatarUrl
    title
  }
}
```

### 8.2 `users`

用途：

- 获取数据库里所有已注册用户，用于 Members 页面和创建群聊选人。
- 这不是好友列表，不返回好友关系字段。

参数：

- `query`：可选，按 `name` 或 `username` 模糊搜索。
- `limit`：默认 50，最大 100。
- `skip`：默认 0。

示例：

```graphql
query Users($query: String) {
  users(query: $query, limit: 50) {
    id
    username
    name
    avatarUrl
    title
  }
}
```

### 8.3 `conversations`

用途：

- 获取当前用户会话列表，按更新时间倒序。

示例：

```graphql
query Conversations {
  conversations {
    id
    name
    type
    avatarUrls
    memberCount
    unreadCount
    updatedAt
    lastMessage {
      id
      body
      createdAt
      sender {
        id
        name
      }
    }
  }
}
```

### 8.4 `conversation`

用途：

- 获取单个会话详情。

错误：

- 非成员访问返回 `FORBIDDEN`。
- 不存在返回 `NOT_FOUND`。

### 8.5 `messages`

用途：

- 获取某会话消息历史。

参数：

- `first` 默认 30，最大 50。
- `after` 可选 cursor。

返回排序：

- `nodes` 按 `createdAt` 升序。

示例：

```graphql
query Messages($conversationId: ID!, $first: Int, $after: String) {
  messages(conversationId: $conversationId, first: $first, after: $after) {
    nodes {
      id
      conversationId
      body
      createdAt
      sender {
        id
        name
        avatarUrl
      }
      quoteMessage {
        id
        body
        sender {
          id
          name
        }
      }
      mentions {
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### 8.6 `conversationMembers`

用途：

- @ 提及时查询成员候选。

示例：

```graphql
query ConversationMembers($conversationId: ID!, $query: String) {
  conversationMembers(conversationId: $conversationId, query: $query, limit: 5) {
    id
    name
    avatarUrl
    title
  }
}
```

## 9. Mutation Definition

```graphql
type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  createGroupConversation(input: CreateGroupConversationInput!): Conversation!
  sendMessage(input: SendMessageInput!): SendMessagePayload!
  markConversationRead(conversationId: ID!): Conversation!
}
```

### 9.1 `register`

用途：

- 创建用户并返回 access token。

校验：

- `username` 必填，3 到 32 个字符，只允许字母、数字、下划线和短横线。
- `username` 必须唯一。
- `displayName` 必填，1 到 40 个字符。
- `password` 至少 6 个字符。

示例：

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      username
      name
      avatarUrl
    }
  }
}
```

变量示例：

```json
{
  "input": {
    "username": "jenny",
    "displayName": "Jenny White",
    "password": "password123"
  }
}
```

### 9.2 `login`

用途：

- 使用用户名和密码登录并返回 access token。

示例：

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      username
      name
      avatarUrl
    }
  }
}
```

变量示例：

```json
{
  "input": {
    "username": "jenny",
    "password": "password123"
  }
}
```

### 9.3 `createGroupConversation`

用途：

- 从所有注册用户中选择成员并创建群聊。

校验：

- 当前用户必须已登录。
- `name.trim()` 必须为 1 到 60 个字符。
- `memberUserIds` 至少包含 1 个其他注册用户。
- `memberUserIds` 中如果包含当前用户，后端应去重。
- 所有 memberUserIds 必须对应已注册用户。

示例：

```graphql
mutation CreateGroupConversation($input: CreateGroupConversationInput!) {
  createGroupConversation(input: $input) {
    id
    name
    type
    avatarUrls
    memberCount
    unreadCount
    createdAt
    updatedAt
  }
}
```

变量示例：

```json
{
  "input": {
    "name": "Design Review",
    "memberUserIds": [
      "665f00000000000000000092",
      "665f00000000000000000093"
    ]
  }
}
```

### 9.4 `sendMessage`

用途：

- 发送文本消息。

校验：

- 当前用户必须是 conversation member。
- `body.trim()` 不能为空。
- `body` 最大 4000 字符。
- `quoteMessageId` 如果存在，必须属于同一 conversation。
- `mentionUserIds` 如果存在，所有用户必须是同一 conversation 成员。

示例：

```graphql
mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    clientMutationId
    message {
      id
      conversationId
      body
      createdAt
      sender {
        id
        name
        avatarUrl
      }
      quoteMessage {
        id
        body
        sender {
          id
          name
        }
      }
      mentions {
        id
        name
      }
    }
    conversation {
      id
      unreadCount
      updatedAt
      lastMessage {
        id
        body
        createdAt
      }
    }
  }
}
```

变量示例：

```json
{
  "input": {
    "conversationId": "665f00000000000000000001",
    "body": "Many thanks!",
    "quoteMessageId": "665f00000000000000000020",
    "mentionUserIds": [],
    "clientMutationId": "local-1717650000000"
  }
}
```

### 9.5 `markConversationRead`

用途：

- 当前用户进入会话后清零未读数。

示例：

```graphql
mutation MarkConversationRead($conversationId: ID!) {
  markConversationRead(conversationId: $conversationId) {
    id
    unreadCount
    updatedAt
  }
}
```

## 10. GraphQL 错误格式

Apollo 推荐错误响应：

```json
{
  "errors": [
    {
      "message": "Message body cannot be empty.",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

错误 code：

- `UNAUTHENTICATED`
- `FORBIDDEN`
- `NOT_FOUND`
- `BAD_USER_INPUT`
- `INTERNAL_SERVER_ERROR`

## 11. Socket.IO Client Auth

连接：

```ts
io("http://localhost:4000", {
  auth: {
    token: accessToken
  }
});
```

服务端行为：

- 校验 token 并解析 userId。
- 加入 `user:{userId}` room。

## 12. Socket.IO Client Events

### 12.1 `conversation.join`

客户端发送：

```json
{
  "conversationId": "665f00000000000000000001"
}
```

Ack 成功：

```json
{
  "ok": true
}
```

Ack 失败：

```json
{
  "ok": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not a member of this conversation."
  }
}
```

### 12.2 `conversation.leave`

客户端发送：

```json
{
  "conversationId": "665f00000000000000000001"
}
```

Ack：

```json
{
  "ok": true
}
```

### 12.3 `typing.start`

可选。

```json
{
  "conversationId": "665f00000000000000000001"
}
```

### 12.4 `typing.stop`

可选。

```json
{
  "conversationId": "665f00000000000000000001"
}
```

## 13. Socket.IO Server Events

服务端推送事件的 payload 均为 Protobuf `RealtimeEvent` 二进制数据，不是 JSON object。

统一 decode 方式：

```ts
const event = RealtimeEvent.decode(payload);
```

协议文件：

```text
proto/chat_realtime.proto
```

### 13.1 `message.created`

发送给：

- `conversation:{conversationId}`

Payload：

```protobuf
RealtimeEvent {
  type: MESSAGE_CREATED
  message_created: MessageCreatedPayload
}
```

前端处理：

- 如果 message.conversationId 是当前会话，追加到 MessageList。
- 如果消息 ID 已存在，替换而不是重复追加。
- 更新当前会话 lastMessage 可等待 `conversation.updated`，也可以本地同步。

### 13.2 `conversation.created`

发送给：

- 新群聊每个成员的 `user:{userId}`。

Payload：

```protobuf
RealtimeEvent {
  type: CONVERSATION_CREATED
  conversation_created: ConversationCreatedPayload
}
```

前端处理：

- 如果会话列表中不存在该 conversation.id，插入列表顶部。
- 如果创建者收到该事件且刚完成 mutation，避免重复插入。
- 被邀请用户在线时可以立即看到新群聊。

### 13.3 `conversation.updated`

发送给：

- `user:{userId}`

Payload：

```protobuf
RealtimeEvent {
  type: CONVERSATION_UPDATED
  conversation_updated: ConversationUpdatedPayload
}
```

前端处理：

- 按 conversation.id 更新会话列表条目。
- 重新按 updatedAt 倒序排序。
- 如果当前会话已打开且 unreadCount 非 0，可调用 `markConversationRead` 或本地置零后同步。

### 13.4 `typing.updated`

可选。

Payload：

```protobuf
RealtimeEvent {
  type: TYPING_UPDATED
  typing_updated: TypingUpdatedPayload
}
```

## 14. 前后端事件时序

### 14.1 打开会话

```text
Frontend -> GraphQL: login 或 register
Frontend: 保存 access token
Frontend -> GraphQL: me
Frontend -> GraphQL: conversations
Frontend -> GraphQL: messages(conversationId)
Frontend -> Socket.IO: connect(auth.token)
Frontend -> Socket.IO: conversation.join(conversationId)
Frontend -> GraphQL: markConversationRead(conversationId)
```

### 14.2 发送消息

```text
Frontend -> GraphQL: sendMessage(input)
Backend -> MongoDB: create message
Backend -> MongoDB: update conversation lastMessage
Backend -> MongoDB: increment unread for other members
Backend -> Protobuf: encode RealtimeEvent MESSAGE_CREATED
Backend -> Socket.IO: emit message.created binary payload to conversation room
Backend -> Protobuf: encode RealtimeEvent CONVERSATION_UPDATED
Backend -> Socket.IO: emit conversation.updated binary payload to member user rooms
Backend -> Frontend: GraphQL sendMessage payload
```

### 14.3 切换会话

```text
Frontend -> Socket.IO: conversation.leave(oldConversationId)
Frontend -> Socket.IO: conversation.join(newConversationId)
Frontend -> GraphQL: messages(newConversationId)
Frontend -> GraphQL: markConversationRead(newConversationId)
```

### 14.4 创建群聊

```text
Frontend -> GraphQL: users(query)
Frontend: 选择成员并输入群聊名称
Frontend -> GraphQL: createGroupConversation(input)
Backend -> MongoDB: create conversation
Backend -> MongoDB: create conversation_members for creator and selected users
Backend -> Protobuf: encode RealtimeEvent CONVERSATION_CREATED
Backend -> Socket.IO: emit conversation.created binary payload to member user rooms
Backend -> Frontend: GraphQL conversation payload
Frontend: insert conversation into list and select it
```

## 15. 接口兼容性要求

- 所有 ID 在 GraphQL 和 Socket payload 中均为 string。
- 所有时间均为 ISO string。
- GraphQL 和 Protobuf 中的 `Message` 字段语义保持一致；命名可按 GraphQL camelCase、Protobuf snake_case 分别遵循各自规范。
- 前端不依赖 MongoDB `_id` 字段名，只使用 `id`。
- 后端不信任前端传入的 mention 文本，只信任 `mentionUserIds`。
- Socket.IO 服务端推送事件 payload 必须使用 `proto/chat_realtime.proto` 中的 `RealtimeEvent` 编码。
