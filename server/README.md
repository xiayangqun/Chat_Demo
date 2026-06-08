# Chat Demo 后端服务

## 项目简介

这是一个 Chat Demo 应用的后端服务，提供群组即时通讯的完整 API 支持。包括用户注册登录、群聊创建管理、消息发送与分页查询、引用回复、@提及通知，以及基于 Socket.IO + Protobuf 的实时消息推送。后端使用 Redis 缓存热点数据，使用 MongoDB 持久化存储。

## 技术栈

| 技术 | 用途 |
|---|---|
| **Node.js** (ES2022 + ESM) | 运行时 |
| **TypeScript** (NodeNext 模块) | 开发语言 |
| **Apollo Server 4** | GraphQL API 层 |
| **Express** | HTTP 服务器 |
| **Socket.IO** | 实时双向通信 |
| **MongoDB + Mongoose** | 数据持久化 |
| **Redis + ioredis** | 缓存与 Socket.IO 多实例广播 |
| **Protocol Buffers** (protobufjs) | 实时消息二进制编码 |
| **jsonwebtoken** | JWT 认证 |
| **bcrypt** | 密码哈希 |

## 目录结构

```
server/
├── .env                          # 环境变量配置
├── .env.example                  # 环境变量模板
├── package.json                  # 项目依赖和脚本
├── tsconfig.json                 # TypeScript 编译配置
├── proto/
│   └── chat_realtime.proto       # Protobuf 协议定义（实时消息结构）
├── src/
│   ├── index.ts                  # 应用入口：Express + Apollo + Socket.IO 启动
│   ├── config/
│   │   ├── env.ts                # 环境变量类型安全读取
│   │   ├── database.ts           # MongoDB 连接（Mongoose）
│   │   └── redis.ts              # Redis 连接（ioredis，优雅降级）
│   ├── graphql/
│   │   ├── schema.ts             # GraphQL Schema 定义（typeDefs）
│   │   ├── context.ts            # GraphQL Context 创建（从 JWT 提取用户 ID）
│   │   └── resolvers.ts          # 所有 Query 和 Mutation 的 Resolver 实现
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.service.ts   # 注册、登录、Token 验证
│   │   │   ├── jwt.ts            # JWT 签发和验证
│   │   │   └── password.ts       # bcrypt 密码哈希与比对
│   │   ├── users/
│   │   │   ├── user.model.ts     # 用户 Mongoose 模型
│   │   │   ├── user.service.ts   # 用户查询（列表、搜索、批量查询）
│   │   │   └── user.mapper.ts    # 用户文档 → DTO 转换
│   │   ├── conversations/
│   │   │   ├── conversation.model.ts          # 会话 Mongoose 模型
│   │   │   ├── conversationMember.model.ts    # 会话成员 Mongoose 模型
│   │   │   ├── conversation.service.ts        # 会话 CRUD、群聊创建、未读数管理
│   │   │   └── conversation.mapper.ts         # 会话文档 → DTO 转换
│   │   └── messages/
│   │       ├── message.model.ts       # 消息 Mongoose 模型
│   │       ├── message.service.ts     # 消息发送、分页查询、Hydration
│   │       ├── message.mapper.ts      # 消息文档 → DTO 转换
│   │       └── message.validation.ts  # 发送消息输入验证
│   ├── cache/
│   │   ├── cache.service.ts        # Redis 缓存服务（getJson/setJson/del/remember）
│   │   └── cacheKeys.ts            # 缓存 Key 命名规范和生成函数
│   ├── realtime/
│   │   ├── socketServer.ts         # Socket.IO 服务器初始化和 JWT 鉴权中间件
│   │   └── realtimeService.ts      # RealtimeService 类（Protobuf 编码 + 事件广播）
│   ├── seed/
│   │   └── seedDatabase.ts         # 种子数据脚本（12 用户、9 会话、种子消息）
│   └── generated/
│       └── chat_realtime.ts        # Protobuf 运行时类型和编解码函数（自动生成）
└── dist/                           # 编译输出
```

## 核心模块详解

### `config/` — 应用配置

- **env.ts**: 从 `process.env` 读取所有环境变量，提供类型安全的 `config` 对象。每个变量都有默认值，确保开发环境开箱即用。
- **database.ts**: 使用 Mongoose 连接 MongoDB。提供 `connectDatabase()` 和 `disconnectDatabase()` 方法，在应用启动和关闭时调用。
- **redis.ts**: 使用 ioredis 连接 Redis。连接失败时优雅降级（打印警告而不是退出进程），缓存层会检测 `isRedisAvailable()` 并跳过缓存操作。

### `graphql/` — GraphQL API 层

- **schema.ts**: 定义完整 GraphQL Schema，包含 `User`、`Conversation`、`Message`、`MessageConnection`（游标分页）等类型，以及 5 个 Query 和 5 个 Mutation。
- **context.ts**: 解析 HTTP 请求头中的 `Authorization: Bearer <token>`，通过 JWT 验证提取 `userId`，注入到每个 Resolver 的 Context 中。
- **resolvers.ts**: 所有 Query 和 Mutation 的实现。提供 `requireAuth()` 辅助函数统一处理未认证请求，DateTime 标量类型处理 ISO 8601 日期格式。

### `modules/auth/` — 认证模块

- **auth.service.ts**: 注册（用户名唯一性校验、格式验证、密码哈希、JWT 签发）和登录（用户名+密码验证、JWT 签发）的核心逻辑。注册验证规则：用户名 3-32 字符（字母数字下划线连字符）、显示名 1-40 字符、密码至少 6 字符。
- **jwt.ts**: 基于 `jsonwebtoken` 的 Token 签发和验证。Payload 包含 `{ sub: userId }`，过期时间由 `JWT_EXPIRES_IN` 环境变量控制（默认 7 天）。
- **password.ts**: 基于 bcrypt 的密码哈希（salt rounds = 10）和比对。

### `modules/users/` — 用户模块

- **user.model.ts**: Mongoose `users` 集合模型。字段：`username`（唯一、小写）、`passwordHash`、`name`、`avatarUrl`、`title`。索引：`username` 唯一索引、`name` 索引、`createdAt` 降序索引。
- **user.service.ts**: 用户查询服务。`getUserById()` 使用 `CacheService.remember` 缓存单个用户 DTO；`listUsers()` 支持按名称/用户名模糊搜索、分页、缓存；`getUsersByIds()` 批量查询（先查缓存，未命中再查 DB）；`searchConversationMembers()` 搜索会话成员（用于 @提及）。
- **user.mapper.ts**: 将 Mongoose 文档转换为 GraphQL 安全的 DTO，剥离 `passwordHash` 字段。

### `modules/conversations/` — 会话模块

- **conversation.model.ts**: Mongoose `conversations` 集合模型。字段：`name`、`type`（GROUP/DIRECT）、`avatarUrls`、`lastMessageId`、`createdByUserId`。索引：`updatedAt` 降序、`createdByUserId + createdAt` 复合索引。
- **conversationMember.model.ts**: Mongoose `conversation_members` 集合模型。字段：`conversationId`、`userId`、`role`（OWNER/MEMBER）、`unreadCount`、`lastReadAt`。唯一复合索引：`{ conversationId, userId }`。
- **conversation.service.ts**: 会话业务逻辑。`getConversationsForUser()` 查询用户的所有会话并批量加载成员数、最后消息和发送者；`getConversationById()` 带成员权限检查；`createGroupConversation()` 创建群聊（验证成员 ID、批量插入成员记录、发送实时事件、失效缓存）；`markConversationRead()` 清零未读数；`incrementUnreadForOtherMembers()` 发送消息时给其他成员增加未读数。
- **conversation.mapper.ts**: 将会话文档、成员记录、最后消息和发送者组装为 `ConversationDTO`。

### `modules/messages/` — 消息模块

- **message.model.ts**: Mongoose `messages` 集合模型。字段：`conversationId`、`senderId`、`type`（目前仅 TEXT）、`body`（最大 4000 字符）、`quoteMessageId`（引用回复）、`mentionUserIds`（@提及）。索引：`{ conversationId, createdAt, _id }` 复合索引支持游标分页。
- **message.service.ts**: 消息业务逻辑。`getMessages()` 使用游标分页（基于 `_id > after`），查询时验证成员身份，批量 Hydrate 消息（发送者、引用消息及发送者、@提及用户）；`sendMessage()` 创建消息、更新会话最后消息、增加其他成员未读数、广播实时事件、失效消息和会话缓存。
- **message.mapper.ts**: 将消息文档、发送者、引用消息和 @提及用户组装为 `MessageDTO`。
- **message.validation.ts**: `sendMessage` 输入验证：body 长度 1-4000、检查发送者是否会话成员、验证引用消息 ID 存在且属于同一会话、去重 @提及用户 ID。

### `realtime/` — 实时通信

- **socketServer.ts**: Socket.IO 服务器初始化。使用 JWT 鉴权中间件验证连接请求（`socket.handshake.auth.token`）。认证成功后自动加入 `user:{userId}` 房间。客户端可主动 `conversation.join` / `conversation.leave` 加入或离开会话房间。导出 `getRealtimeService()` 供业务模块使用。
- **realtimeService.ts**: 实时消息广播服务。提供 `emitToRoom()` 低层方法（Protobuf 编码 + 二进制 emit）和三个高层方法：`emitMessageCreated()` 广播新消息到会话房间、`emitConversationCreated()` 通知用户新会话、`emitConversationUpdated()` 通知用户会话更新（未读数、最后消息变更）。

### `cache/` — Redis 缓存

- **cache.service.ts**: 泛型缓存服务。`getJson<T>()` 读取并反序列化、`setJson()` 序列化写入（带 TTL）、`del()` / `delMany()` 删除（支持通配符模式匹配）、`remember()` 缓存穿透保护（先读缓存，未命中则调用 loader 并回写）。所有操作 try/catch 包裹，Redis 不可用时静默降级。
- **cacheKeys.ts**: 缓存 Key 生成函数。遵循 `{prefix}:{domain}:{identifier}` 命名规范，例如 `chat-demo:user:{userId}`、`chat-demo:conversations:user:{userId}`。提供 `*Pattern()` 方法用于批量失效。

### `seed/` — 种子数据

- **seedDatabase.ts**: 数据库初始化脚本。创建 12 个演示用户（密码统一为 `password123`）、9 个会话（6 个群聊 + 3 个私聊）、4 条种子消息（含一条引用回复）以及各会话的最后消息。支持两种运行方式：环境变量 `SEED_DATABASE=true` 配合 `npm run dev`，或直接 `npm run seed`。

### `generated/` — Protobuf 运行时

- **chat_realtime.ts**: 在应用启动时加载 `proto/chat_realtime.proto` 文件，生成 TypeScript 类型定义和枚举常量。提供 `encodeRealtimeEvent()` 和 `decodeRealtimeEvent()` 函数，负责在 Protobuf 二进制格式和 TypeScript 接口之间转换。自动处理 snake_case 和 camelCase 字段名转换。

## 快速启动

### 前置条件

- Node.js >= 18
- MongoDB（本地或 Docker）
- Redis（可选，用于缓存和多实例支持）

```bash
# 启动本地 Redis（Docker）
docker run --name chat-demo-redis -p 6379:6379 -d redis:7
```

### 安装和运行

```bash
# 1. 进入 server 目录
cd server

# 2. 安装依赖
npm install

# 3. 配置环境变量（可选，有默认值）
cp .env.example .env
# 编辑 .env 按需修改配置

# 4. 启动开发服务器
npm run dev

# 5. （可选）导入种子数据
npm run seed
```

启动后访问：

- GraphQL Playground: `http://localhost:4000/graphql`
- 健康检查: `http://localhost:4000/health`

### 可用脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 使用 tsx watch 模式启动开发服务器 |
| `npm run build` | TypeScript 编译到 dist/ |
| `npm start` | 运行编译后的生产版本 |
| `npm run seed` | 导入种子数据到数据库 |

## 环境变量

| 变量名 | 默认值 | 说明 |
|---|---|---|
| `PORT` | `4000` | 服务器监听端口 |
| `MONGODB_URI` | `mongodb://localhost:27017/chat-demo` | MongoDB 连接字符串 |
| `CLIENT_ORIGIN` | `http://localhost:5173` | 前端域名（CORS 白名单） |
| `REDIS_URL` | `redis://localhost:6379` | Redis 连接字符串 |
| `REDIS_KEY_PREFIX` | `chat-demo` | Redis 缓存 Key 前缀 |
| `CACHE_TTL_SECONDS` | `300` | 缓存默认过期时间（秒） |
| `SOCKET_REDIS_ADAPTER_ENABLED` | `true` | 是否启用 Socket.IO Redis Adapter |
| `JWT_SECRET` | `dev-secret-change-me` | JWT 签名密钥（生产环境务必修改） |
| `JWT_EXPIRES_IN` | `7d` | JWT 过期时间 |
| `SEED_DATABASE` | `false` | 启动时是否自动导入种子数据 |

## GraphQL API 概览

### Query

| Query | 参数 | 说明 |
|---|---|---|
| `me` | — | 获取当前登录用户信息 |
| `users` | `query: String`, `limit: Int`, `skip: Int` | 搜索已注册用户列表（支持按名称/用户名模糊搜索） |
| `conversations` | — | 获取当前用户的所有会话（含未读数和最后消息预览） |
| `conversation` | `id: ID!` | 获取单个会话详情（带成员权限检查） |
| `messages` | `conversationId: ID!`, `first: Int`, `after: String` | 游标分页查询会话消息 |
| `conversationMembers` | `conversationId: ID!`, `query: String`, `limit: Int` | 搜索会话成员（用于 @提及） |

### Mutation

| Mutation | 参数 | 说明 |
|---|---|---|
| `register` | `input: RegisterInput!` | 注册新用户，返回 JWT Token |
| `login` | `input: LoginInput!` | 登录，返回 JWT Token |
| `createGroupConversation` | `input: CreateGroupConversationInput!` | 创建群聊（自动加入创建者） |
| `sendMessage` | `input: SendMessageInput!` | 发送消息（支持引用回复和 @提及） |
| `markConversationRead` | `conversationId: ID!` | 标记会话为已读（清零未读数） |

## 实时通信

### 连接方式

客户端使用 Socket.IO 连接，在 `handshake.auth.token` 中传入 JWT Token：

```ts
const socket = io("http://localhost:4000", {
  auth: { token: "Bearer <jwt_token>" },
});
```

### Socket.IO 客户端事件

#### 客户端发送

| 事件 | Payload | 说明 |
|---|---|---|
| `conversation.join` | `{ conversationId: string }` | 加入会话房间接收实时消息 |
| `conversation.leave` | `{ conversationId: string }` | 离开会话房间 |

#### 服务端推送

| 事件 | 目标房间 | 说明 |
|---|---|---|
| `message.created` | `conversation:{conversationId}` | 新消息广播到会话房间的所有成员 |
| `conversation.created` | `user:{userId}` | 新会话通知（新成员被加入群聊时推送） |
| `conversation.updated` | `user:{userId}` | 会话更新通知（未读数变更、最后消息更新时推送） |

### Protobuf 编码机制

所有服务端推送的事件使用 Google Protocol Buffers 编码为二进制数据。编码流程：

1. 业务模块调用 `RealtimeService` 的高层方法（如 `emitMessageCreated`）
2. `RealtimeService` 调用 `encodeRealtimeEvent()` 将事件数据编码为 `Uint8Array`
3. Socket.IO 以二进制模式（`Buffer`）将数据推送到客户端
4. 客户端使用 `decodeRealtimeEvent()` 解码为 TypeScript 对象

Protobuf 协议定义位于 `proto/chat_realtime.proto`，运行时类型和编解码函数由 `src/generated/chat_realtime.ts` 加载和使用。

### 房间命名规范

- `user:{userId}` — 每个用户独有的通知房间
- `conversation:{conversationId}` — 每个会话的广播房间

## 数据模型

### `users` 集合

| 字段 | 类型 | 说明 |
|---|---|---|
| `_id` | ObjectId | 用户 ID |
| `username` | string (unique) | 用户名，小写，3-32 字符 |
| `passwordHash` | string | bcrypt 哈希密码 |
| `name` | string | 显示名称，1-40 字符 |
| `avatarUrl` | string? | 头像 URL |
| `title` | string? | 头衔/职位 |
| `createdAt` | Date | 创建时间 |
| `updatedAt` | Date | 更新时间 |

### `conversations` 集合

| 字段 | 类型 | 说明 |
|---|---|---|
| `_id` | ObjectId | 会话 ID |
| `name` | string | 会话名称 |
| `type` | "GROUP" \| "DIRECT" | 会话类型 |
| `avatarUrls` | string[] | 头像 URL 列表 |
| `lastMessageId` | ObjectId? | 最后一条消息 ID |
| `createdByUserId` | ObjectId | 创建者用户 ID |
| `createdAt` | Date | 创建时间 |
| `updatedAt` | Date | 更新时间 |

### `conversation_members` 集合

| 字段 | 类型 | 说明 |
|---|---|---|
| `_id` | ObjectId | 记录 ID |
| `conversationId` | ObjectId | 会话 ID |
| `userId` | ObjectId | 用户 ID |
| `role` | "OWNER" \| "MEMBER" | 成员角色 |
| `unreadCount` | number | 未读消息数 |
| `lastReadAt` | Date? | 最后阅读时间 |
| `createdAt` | Date | 创建时间 |
| `updatedAt` | Date | 更新时间 |

**唯一复合索引**: `{ conversationId: 1, userId: 1 }`

### `messages` 集合

| 字段 | 类型 | 说明 |
|---|---|---|
| `_id` | ObjectId | 消息 ID |
| `conversationId` | ObjectId | 所属会话 ID |
| `senderId` | ObjectId | 发送者 ID |
| `type` | "TEXT" | 消息类型 |
| `body` | string | 消息正文（最大 4000 字符） |
| `quoteMessageId` | ObjectId? | 引用消息 ID |
| `mentionUserIds` | ObjectId[] | @提及用户 ID 列表 |
| `createdAt` | Date | 创建时间 |
| `updatedAt` | Date | 更新时间 |
