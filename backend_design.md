# Chat Demo 后端设计文档

## 1. 技术栈

- Node.js
- TypeScript
- GraphQL：Apollo Server 推荐
- Realtime：Socket.IO
- Realtime Payload：Google Protocol Buffers
- MongoDB
- Redis：缓存热点数据，Socket.IO Redis adapter
- ODM：Mongoose 推荐
- Auth：bcrypt 或 argon2 做密码哈希，jsonwebtoken 或 jose 签发 JWT
- Test：Vitest 或 Jest

## 2. 后端目标

后端负责提供：

- GraphQL 查询和变更。
- MongoDB 数据持久化。
- Socket.IO 实时消息广播。
- Protobuf 实时 payload 编码。
- Redis 缓存与多实例实时广播支持。
- Demo 种子数据。
- 清晰的模块边界，方便另一个 AI 直接实现。

## 3. 架构概览

推荐采用单体 Node.js 服务：

```text
HTTP Server
  Apollo GraphQL Server
  Socket.IO Server
  Express health route
  Redis Client
  Socket.IO Redis Adapter

Application Services
  AuthService
  UserService
  ConversationService
  MessageService
  RealtimeService
  CacheService

Data Layer
  UserModel
  ConversationModel
  ConversationMemberModel
  MessageModel
```

GraphQL 用于请求/响应式操作，Socket.IO 用于事件广播。发送消息仍通过 GraphQL mutation 完成，后端 mutation 成功写库后调用 RealtimeService 广播。Socket.IO 服务端推送事件的 payload 使用 Google Protocol Buffers 编码。Redis 用于热点数据缓存，并通过 Socket.IO Redis adapter 支持多实例广播。

## 4. 运行配置

环境变量：

| Name | Default | 说明 |
|---|---|---|
| `PORT` | `4000` | API 和 Socket.IO 端口 |
| `MONGODB_URI` | `mongodb://localhost:27017/chat-demo` | MongoDB 地址 |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS 允许源 |
| `REDIS_URL` | `redis://localhost:6379` | Redis 连接地址 |
| `REDIS_KEY_PREFIX` | `chat-demo` | Redis key 前缀 |
| `CACHE_TTL_SECONDS` | `300` | 通用缓存 TTL |
| `SOCKET_REDIS_ADAPTER_ENABLED` | `true` | 是否启用 Socket.IO Redis adapter |
| `JWT_SECRET` | `dev-secret-change-me` | JWT 签名密钥，生产必须替换 |
| `JWT_EXPIRES_IN` | `7d` | access token 过期时间 |
| `SEED_DATABASE` | `false` | 是否启动时写入种子数据 |

本地开发推荐用 Docker 启动 Redis server：

```bash
docker run --name chat-demo-redis -p 6379:6379 -d redis:7
```

Node.js 后端只需要安装 Redis 客户端依赖和 Socket.IO adapter，不需要全局安装 Redis Node 包：

```bash
npm install ioredis @socket.io/redis-adapter
```

## 5. MongoDB 数据模型

### 5.1 User

集合：`users`

字段：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `_id` | ObjectId | 是 | 用户 ID |
| `username` | string | 是 | 登录用户名，唯一 |
| `passwordHash` | string | 是 | bcrypt 哈希后的密码 |
| `name` | string | 是 | 展示名 |
| `avatarUrl` | string | 否 | 头像 |
| `title` | string | 否 | 职位或副标题，例如 `CTO@Apple` |
| `createdAt` | Date | 是 | 创建时间 |
| `updatedAt` | Date | 是 | 更新时间 |

索引：

- `{ username: 1 }` 唯一索引，用于登录和注册去重。
- `name` text 或普通索引，用于 mention 搜索。

### 5.2 Conversation

集合：`conversations`

字段：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `_id` | ObjectId | 是 | 会话 ID |
| `name` | string | 是 | 会话名 |
| `type` | enum `GROUP` / `DIRECT` | 是 | 会话类型 |
| `avatarUrls` | string[] | 否 | 群聊拼图头像或单聊头像 |
| `lastMessageId` | ObjectId | 否 | 最后一条消息 |
| `createdByUserId` | ObjectId | 否 | 群聊创建者 |
| `createdAt` | Date | 是 | 创建时间 |
| `updatedAt` | Date | 是 | 排序用更新时间 |

索引：

- `{ updatedAt: -1 }`

### 5.3 ConversationMember

集合：`conversation_members`

字段：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `_id` | ObjectId | 是 | 记录 ID |
| `conversationId` | ObjectId | 是 | 会话 ID |
| `userId` | ObjectId | 是 | 用户 ID |
| `role` | enum `OWNER` / `MEMBER` | 是 | Demo 可统一 MEMBER |
| `unreadCount` | number | 是 | 当前用户该会话未读数 |
| `lastReadAt` | Date | 否 | 最近已读时间 |
| `createdAt` | Date | 是 | 加入时间 |
| `updatedAt` | Date | 是 | 更新时间 |

索引：

- `{ conversationId: 1, userId: 1 }` 唯一索引。
- `{ userId: 1, updatedAt: -1 }` 用于查询我的会话。

### 5.4 Message

集合：`messages`

字段：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `_id` | ObjectId | 是 | 消息 ID |
| `conversationId` | ObjectId | 是 | 所属会话 |
| `senderId` | ObjectId | 是 | 发送人 |
| `type` | enum `TEXT` | 是 | Demo 只支持 TEXT |
| `body` | string | 是 | 文本内容 |
| `quoteMessageId` | ObjectId | 否 | 被引用消息 |
| `mentionUserIds` | ObjectId[] | 否 | 被提及用户 |
| `createdAt` | Date | 是 | 发送时间 |
| `updatedAt` | Date | 是 | 更新时间 |

索引：

- `{ conversationId: 1, createdAt: -1 }` 用于分页查询。
- `{ mentionUserIds: 1 }` 可选，用于后续提及查询。

## 6. 服务模块设计

### 6.1 `AuthService`

职责：

- 注册用户。
- 校验用户名和密码。
- 签发和验证 JWT access token。
- 为新注册用户加入 Demo 默认会话。

方法：

- `register(input): Promise<AuthPayloadDTO>`
- `login(input): Promise<AuthPayloadDTO>`
- `verifyToken(token): Promise<{ userId: string }>`
- `hashPassword(password): Promise<string>`
- `comparePassword(password, passwordHash): Promise<boolean>`

规则：

- username trim 后转小写保存，必须唯一。
- password 不以明文保存，只保存 bcrypt hash。
- 注册成功后自动创建用户与默认 conversations 的 membership。
- token payload 至少包含 `sub`，值为 userId。

### 6.2 `UserService`

职责：

- 获取当前用户。
- 查询所有已注册用户，用于 Members 页面和创建群聊选人。
- 按 ID 批量查询用户。
- 在会话成员中搜索可提及用户。

方法：

- `getUserById(userId): Promise<User>`
- `listUsers(query, limit, skip): Promise<User[]>`
- `getUsersByIds(userIds): Promise<User[]>`
- `searchConversationMembers(conversationId, query, limit): Promise<User[]>`

规则：

- Members 页面使用 `listUsers` 返回所有注册用户，不表达好友关系。
- mention 搜索只返回当前会话成员。
- query 为空时返回最近加入或固定排序的前 N 个成员。

### 6.3 `ConversationService`

职责：

- 查询当前用户会话列表。
- 查询会话详情和成员数。
- 创建群聊。
- 标记会话已读。
- 更新会话最后消息。

方法：

- `getConversationsForUser(userId): Promise<ConversationDTO[]>`
- `getConversationById(conversationId, userId): Promise<ConversationDTO>`
- `createGroupConversation(input, creatorUserId): Promise<ConversationDTO>`
- `markConversationRead(conversationId, userId): Promise<ConversationDTO>`
- `incrementUnreadForOtherMembers(conversationId, senderId): Promise<void>`
- `setLastMessage(conversationId, messageId): Promise<void>`

规则：

- 查询会话前必须确认用户是成员。
- 创建群聊时 name trim 后必须为 1 到 60 字符。
- 创建群聊时 memberUserIds 至少包含 1 个其他注册用户。
- 创建者自动加入 conversation_members，role 为 `OWNER`。
- 被选用户加入 conversation_members，role 为 `MEMBER`，unreadCount 初始为 0。
- 创建成功后向所有成员 user room 广播 `conversation.created`。
- `markConversationRead` 只修改当前用户的 member 记录。
- 会话列表按 `conversation.updatedAt` 倒序。

### 6.4 `MessageService`

职责：

- 查询消息分页。
- 发送消息。
- 校验引用消息和 mentions。
- 组装 GraphQL Message DTO。

方法：

- `getMessages(conversationId, userId, pagination): Promise<MessageConnection>`
- `sendMessage(input, senderId): Promise<MessageDTO>`
- `hydrateMessage(message): Promise<MessageDTO>`

发送消息步骤：

1. 校验 sender 是 conversation 成员。
2. 校验 body trim 后非空且长度不超过 4000。
3. 如果有 `quoteMessageId`，确认该消息存在且属于同一 conversation。
4. 如果有 `mentionUserIds`，去重并确认每个用户都是 conversation 成员。
5. 创建 Message。
6. 更新 Conversation.lastMessageId 和 updatedAt。
7. 给除发送人外的成员增加 unreadCount。
8. hydrate message，返回完整 sender、quote、mentions。
9. 调用 RealtimeService 广播 message 和 conversation 更新。

### 6.5 `RealtimeService`

职责：

- 管理 Socket.IO server 实例。
- 接入 Socket.IO Redis adapter。
- 统一广播事件。
- 生成 room name。
- 使用 `proto/chat_realtime.proto` 生成的类型编码服务端推送 payload。

方法：

- `conversationRoom(conversationId): string`
- `userRoom(userId): string`
- `encodeRealtimeEvent(type, payload): Uint8Array`
- `emitMessageCreated(message): void`
- `emitConversationCreated(userId, conversation): void`
- `emitConversationUpdated(userId, conversation): void`

Room：

- 会话 room：`conversation:{conversationId}`
- 用户 room：`user:{userId}`

事件广播：

- `message.created` 发给 conversation room，payload 为 Protobuf 二进制。
- `conversation.created` 发给新群聊每个成员的 user room，payload 为 Protobuf 二进制。
- `conversation.updated` 发给每个 conversation member 的 user room，payload 为 Protobuf 二进制；因为 unreadCount 不同，需要按用户分别编码。

### 6.6 `CacheService`

职责：

- 封装 Redis 读写。
- 统一 Redis key 生成。
- 为 users、conversations、conversation members、messages 提供缓存。
- 在 Redis 异常时回退 MongoDB，不让缓存故障影响核心功能。

方法：

- `getJson<T>(key): Promise<T | null>`
- `setJson(key, value, ttlSeconds): Promise<void>`
- `del(key): Promise<void>`
- `remember<T>(key, ttlSeconds, loader): Promise<T>`

规则：

- MongoDB 是最终数据源。
- 写操作先写 MongoDB，成功后删除或刷新 Redis 缓存。
- 包含 unreadCount 的缓存必须按 userId 维度隔离。
- 详细缓存 key 和失效策略见 `redis_design.md`。

## 7. GraphQL 设计

GraphQL schema 详细字段见 `api_definition.md`。后端 resolver 按以下职责实现。

### 7.1 Query Resolvers

- `me`：返回 access token 对应的当前用户。
- `users(query, limit, skip)`：返回所有已注册用户，用于 Members 页面和创建群聊选人。
- `conversations`：返回当前用户会话列表。
- `conversation(id)`：返回单个会话详情。
- `messages(conversationId, first, after)`：返回消息分页。
- `conversationMembers(conversationId, query, limit)`：返回可提及成员。

### 7.2 Mutation Resolvers

- `sendMessage(input)`：发送消息并广播。
- `createGroupConversation(input)`：创建群聊、创建成员关系并广播。
- `markConversationRead(conversationId)`：清零当前用户未读数并广播 conversation.updated 给当前用户。
- `register(input)`：创建用户、加入默认会话、返回 access token 和当前用户。
- `login(input)`：校验用户名密码、返回 access token 和当前用户。

### 7.3 Context

Context 从 HTTP Authorization header 读取 JWT：

1. 读取 `Authorization: Bearer <token>`。
2. 调用 `AuthService.verifyToken(token)`。
3. 将 token payload 中的 `sub` 作为 `userId`。
4. 对 `login` 和 `register` mutation 允许匿名访问。
5. 除 `login` 和 `register` 外，其他 query/mutation 没有有效 token 时返回 `UNAUTHENTICATED`。

Context 结构：

```ts
type GraphQLContext = {
  userId?: string;
  services: {
    authService: AuthService;
    userService: UserService;
    conversationService: ConversationService;
    messageService: MessageService;
  };
};
```

## 8. Socket.IO 设计

### 8.1 连接鉴权

客户端连接时传：

```text
auth: { token: string }
```

服务端：

- 校验 token 有效并解析 userId。
- 连接成功后加入 `user:{userId}` room。
- 如果 token 缺失、过期或对应用户不存在，拒绝连接。

### 8.2 客户端事件

#### `conversation.join`

Payload：

```json
{ "conversationId": "..." }
```

行为：

- 校验 socket user 是该 conversation 成员。
- 加入 `conversation:{conversationId}` room。

#### `conversation.leave`

Payload：

```json
{ "conversationId": "..." }
```

行为：

- 离开 `conversation:{conversationId}` room。

#### `typing.start` / `typing.stop`

可选，不作为 MVP 必做。

### 8.3 服务端事件

#### `message.created`

发送给：

- `conversation:{conversationId}` room。

用途：

- 当前打开该会话的客户端追加消息。

#### `conversation.updated`

发送给：

- `user:{userId}` room。

用途：

- 更新会话列表的最后消息、更新时间、未读数。

## 9. 分页设计

消息查询使用 cursor pagination。

请求：

- `first`：默认 30，最大 50。
- `after`：上一页最后一条消息 cursor。

排序：

- 数据库查询按 `createdAt desc` 取旧消息。
- 返回给前端时按 `createdAt asc` 排列，便于渲染。

Cursor：

- 可用 base64 编码的 `createdAt + _id`。
- 简化 Demo 可直接使用 message `_id`，但文档推荐 createdAt cursor。

## 10. 错误处理

统一抛 GraphQL Error，并设置 code：

| Code | 场景 |
|---|---|
| `UNAUTHENTICATED` | token 缺失、无效、过期，或登录凭证错误 |
| `FORBIDDEN` | 用户不是会话成员 |
| `NOT_FOUND` | 会话、消息或用户不存在 |
| `BAD_USER_INPUT` | 输入为空、过长、mention 非法 |
| `INTERNAL_SERVER_ERROR` | 未预期错误 |

Socket.IO 错误：

- join 非法时通过 ack 返回 `{ ok: false, error: { code, message } }`。
- 连接鉴权失败时 `next(new Error("UNAUTHENTICATED"))`。

Protobuf 错误：

- 服务端推送事件 encode 失败时记录日志，不发送半成品事件。
- 前端 decode 失败时丢弃该事件并记录错误，不应导致页面崩溃。

## 11. 种子数据设计

数据库 collections、validators 和 indexes 的一键初始化脚本见：

```text
scripts/init-database.sh
scripts/init-database.mongosh.js
```

运行方式：

```bash
./scripts/init-database.sh
```

数据库结构详见 `database_design.md`。

提供 `seedDatabase()`：

- 清空 demo collections。
- 创建用户。
- 为种子用户写入 bcrypt passwordHash，默认明文密码统一为 `password123`。
- 创建 conversations。
- 创建 conversation_members。
- 创建 messages。
- 设置 lastMessageId。
- 设置 unreadCount。

种子数据应与产品文档一致。

运行方式：

- `SEED_DATABASE=true npm run dev` 启动时自动 seed。
- 或提供 `npm run seed`。

## 12. 后端文件结构建议

```text
src/
  index.ts
  config/
    env.ts
    database.ts
    redis.ts
  graphql/
    schema.ts
    resolvers.ts
    context.ts
  realtime/
    socketServer.ts
    realtimeService.ts
    protobuf.ts
  cache/
    cache.service.ts
    cacheKeys.ts
  modules/
    auth/
      auth.service.ts
      password.ts
      jwt.ts
    users/
      user.model.ts
      user.service.ts
      user.mapper.ts
    conversations/
      conversation.model.ts
      conversationMember.model.ts
      conversation.service.ts
      conversation.mapper.ts
    messages/
      message.model.ts
      message.service.ts
      message.mapper.ts
      message.validation.ts
  seed/
    seedDatabase.ts
  tests/
    auth.service.test.ts
    message.service.test.ts
    conversation.service.test.ts
    graphql.test.ts
    cache.service.test.ts
    realtime.protobuf.test.ts
```

## 13. 测试设计

### 13.1 单元测试

`MessageService.sendMessage`：

- body 为空时报错。
- 非成员发送时报错。
- quoteMessageId 不属于当前会话时报错。
- mentionUserIds 包含非成员时报错。
- 成功发送后创建 message、更新 lastMessage、增加其他成员 unread。

`ConversationService.markConversationRead`：

- 清零当前用户 unreadCount。
- 不影响其他用户 unreadCount。

`AuthService`：

- 注册时 username 重复返回错误。
- 注册时 passwordHash 不等于明文 password。
- 登录密码错误返回 `UNAUTHENTICATED`。
- token 可解析出正确 userId。

`CacheService`：

- cache hit 时不访问 MongoDB loader。
- cache miss 时调用 loader 并写入 Redis。
- Redis 失败时回退 loader。

`RealtimeService`：

- `message.created` 能编码为 `RealtimeEvent` protobuf。
- protobuf decode 后字段与 GraphQL Message DTO 语义一致。

### 13.2 集成测试

GraphQL：

- `register` 返回 token 和 user，并自动加入默认会话。
- `login` 返回 token 和 user。
- 未携带 token 调用 `conversations` 返回 `UNAUTHENTICATED`。
- `users` 返回所有注册用户，不需要 conversation membership。
- `createGroupConversation` 创建 conversation 和 conversation_members。
- `conversations` 返回 unreadCount 和 lastMessage。
- `messages` 返回 sender、quoteMessage、mentions。
- `sendMessage` 返回完整 message。

Socket.IO：

- 未携带 token 或 token 无效时连接失败。
- 创建群聊时，被选成员收到 `conversation.created`。
- 两个 client 加入同一会话。
- client A 调用 GraphQL sendMessage。
- client B 收到 `message.created`。
- client B 收到的 `message.created` payload 可以用 `proto/chat_realtime.proto` 正确 decode。
- 多个后端实例启用 Redis adapter 时，跨实例 client 能收到广播。
- 不在该会话 room 的 client 不收到 `message.created`，但收到自己的 `conversation.updated`。

## 14. 安全和边界

虽然是 Demo，仍应避免明显问题：

- 所有 ObjectId 输入必须校验格式。
- 密码必须使用 bcrypt 或 argon2 哈希保存，禁止明文保存。
- JWT secret 不能在生产环境使用默认值。
- GraphQL 除 `login`、`register` 外都需要认证。
- GraphQL query 限制分页上限。
- Redis 不可用时核心 GraphQL query 和 mutation 仍应工作。
- Socket.IO 实时 payload 使用 Protobuf，禁止在服务端实时推送事件中混用 JSON payload。
- 消息 body trim 后保存，保留内部换行。
- 前端渲染消息文本时不要使用未净化 HTML；默认按纯文本渲染。
- CORS 只允许 `CLIENT_ORIGIN`。
