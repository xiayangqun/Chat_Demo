# Chat Demo Redis 设计文档

## 1. 目标

后端接入 Redis，用于：

- 缓存热点数据，降低 MongoDB 重复查询。
- 保存短期在线和 typing 状态。
- 使用 Socket.IO Redis adapter 支持后端多实例广播。

Redis 不作为最终数据源。用户、会话、成员关系、消息和未读数的最终一致数据仍以 MongoDB 为准。

## 2. 技术建议

推荐依赖：

- `ioredis` 或 `redis`
- `@socket.io/redis-adapter`

推荐服务：

```text
Redis 7.x
```

## 2.1 本地开发 Redis 启动方式

本项目本地开发推荐使用 Docker 启动 Redis server。后端 Node.js 项目只需要安装 Redis 客户端依赖，例如 `ioredis` 或 `redis`，不需要全局安装 Redis Node 包。

启动 Redis：

```bash
docker run --name chat-demo-redis -p 6379:6379 -d redis:7
```

后端环境变量：

```env
REDIS_URL=redis://localhost:6379
```

查看容器状态：

```bash
docker ps --filter name=chat-demo-redis
```

停止 Redis：

```bash
docker stop chat-demo-redis
```

再次启动：

```bash
docker start chat-demo-redis
```

如果容器已经存在但没有运行，使用 `docker start chat-demo-redis`。如果需要完全重建容器，先执行：

```bash
docker rm -f chat-demo-redis
docker run --name chat-demo-redis -p 6379:6379 -d redis:7
```

## 3. 环境变量

| Name | Default | 说明 |
|---|---|---|
| `REDIS_URL` | `redis://localhost:6379` | Redis 连接地址 |
| `REDIS_KEY_PREFIX` | `chat-demo` | key 前缀 |
| `CACHE_TTL_SECONDS` | `300` | 通用缓存 TTL |
| `SOCKET_REDIS_ADAPTER_ENABLED` | `true` | 是否启用 Socket.IO Redis adapter |

## 4. Key 命名规范

所有 key 使用统一前缀：

```text
chat-demo:<domain>:<identifier>
```

不要使用裸 key，避免污染本地 Redis。

## 5. 缓存 Keys

### 5.1 当前用户缓存

```text
chat-demo:user:<userId>
```

Value：

- JSON string，内容为 User DTO。

TTL：

- 300 秒。

失效：

- 用户资料更新时删除。
- 本 Demo 暂不实现用户资料编辑，所以自然过期即可。

### 5.2 username 到 userId 映射

```text
chat-demo:user-id-by-username:<username>
```

Value：

- userId string。

TTL：

- 300 秒。

用途：

- 登录时减少 username 查询压力。

失效：

- 注册成功后可写入缓存。
- 用户名本 Demo 不允许修改。

### 5.3 Members 用户列表缓存

```text
chat-demo:users:list:<queryHash>:<limit>:<skip>
```

Value：

- JSON string，内容为 User DTO array。

TTL：

- 60 秒。

用途：

- Members 页面展示所有注册用户。
- 创建群聊选人。

失效：

- 新用户注册成功后删除 `chat-demo:users:list:*`。
- 如果实现成本需要控制，可以只依赖 60 秒 TTL，不做通配删除；但文档推荐实现 key tracking set。

推荐 tracking set：

```text
chat-demo:cache-index:users-list
```

每写入一个 users list cache key，就把 key 加入该 set。注册成功后遍历 set 删除。

### 5.4 当前用户会话列表缓存

```text
chat-demo:conversations:user:<userId>
```

Value：

- JSON string，内容为 Conversation DTO array。

TTL：

- 60 秒。

失效：

- 当前用户创建群聊后删除创建者 key。
- 被邀请进群后删除被邀请用户 key。
- 当前用户任一会话收到新消息后删除该用户 key。
- 标记已读后删除该用户 key。

说明：

- unreadCount 是用户视角字段，所以会话列表缓存必须按 userId 维度存。

### 5.5 会话详情缓存

```text
chat-demo:conversation:<conversationId>:user:<userId>
```

Value：

- JSON string，内容为 Conversation DTO。

TTL：

- 60 秒。

失效：

- 会话成员变化。
- 新消息更新 lastMessage。
- 当前用户 mark read。

### 5.6 会话成员缓存

```text
chat-demo:conversation-members:<conversationId>:<queryHash>:<limit>
```

Value：

- JSON string，内容为 User DTO array。

TTL：

- 120 秒。

用途：

- @ 提及候选用户。

失效：

- 创建群聊时写入成员后删除对应 conversationId 的成员缓存。
- 后续如果实现加人/退群，也必须删除。

### 5.7 最近消息缓存

```text
chat-demo:messages:<conversationId>:first:<first>:after:<cursorHash>
```

Value：

- JSON string，内容为 MessageConnection DTO。

TTL：

- 30 秒。

失效：

- 当前 conversation 有新消息时删除该 conversation 的 messages cache。

说明：

- 消息缓存 TTL 要短，避免聊天历史延迟明显。
- 后端发送消息成功后，优先依赖 Socket.IO 推送更新当前前端；缓存只服务刷新或重新进入。

### 5.8 在线用户状态

```text
chat-demo:presence:user:<userId>
```

Value：

- socket connection count 或 JSON 状态。

TTL：

- 60 秒，并由心跳刷新。

用途：

- 可选，不作为 MVP 必做。

### 5.9 typing 状态

```text
chat-demo:typing:<conversationId>:<userId>
```

Value：

- `1`

TTL：

- 5 秒。

用途：

- 防止 typing.stop 丢失后状态长时间残留。

## 6. Socket.IO Redis Adapter

当后端有多个 Node.js 实例时，单实例 room 无法跨进程广播。需要接入 Socket.IO Redis adapter。

设计：

```text
socketServer.ts
  create pubClient
  create subClient
  io.adapter(createAdapter(pubClient, subClient))
```

规则：

- `message.created` 仍然 emit 到 `conversation:{conversationId}`。
- `conversation.created` 和 `conversation.updated` 仍然 emit 到 `user:{userId}`。
- Redis adapter 负责跨实例传播 room 事件。

## 7. CacheService 设计

建议封装 `CacheService`，避免业务层直接拼 Redis key。

方法：

```ts
type CacheService = {
  getJson<T>(key: string): Promise<T | null>;
  setJson(key: string, value: unknown, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
  delMany(keys: string[]): Promise<void>;
  remember<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T>;
};
```

业务 key builder：

```ts
cacheKeys.user(userId)
cacheKeys.usersList(query, limit, skip)
cacheKeys.conversationsForUser(userId)
cacheKeys.conversationForUser(conversationId, userId)
cacheKeys.conversationMembers(conversationId, query, limit)
cacheKeys.messages(conversationId, first, after)
```

## 8. 失效策略

### 8.1 注册用户

注册成功后：

- 写入 `user:<userId>`。
- 写入 `user-id-by-username:<username>`。
- 删除 users list cache。

### 8.2 创建群聊

创建群聊成功后：

- 删除所有新成员的 `conversations:user:<userId>`。
- 删除新 conversation 的 members cache。
- 可选写入 `conversation:<conversationId>:user:<userId>`。

### 8.3 发送消息

发送消息成功后：

- 删除 conversation 的 messages cache。
- 删除所有成员的 conversations list cache。
- 删除所有成员的 conversation detail cache。

### 8.4 标记已读

标记已读成功后：

- 删除当前用户 conversations list cache。
- 删除当前用户 conversation detail cache。

## 9. 一致性原则

- MongoDB 是最终数据源。
- Redis 失败不能导致核心业务失败；缓存读写失败应记录日志并回退 MongoDB。
- 写操作必须先写 MongoDB，成功后再更新或删除 Redis。
- 对包含 unreadCount 的缓存必须按 userId 隔离。
- 不缓存 access token 本身；JWT 验证使用签名，必要时可缓存 user DTO。

## 10. 测试建议

单元测试：

- Cache key builder 输出稳定。
- CacheService `remember` miss 时调用 loader，hit 时不调用。
- 创建群聊后删除所有成员会话列表缓存。
- 发送消息后删除消息缓存和成员会话缓存。

集成测试：

- Redis 不可用时 GraphQL 查询仍然可从 MongoDB 返回。
- 多个 Socket.IO server 使用 Redis adapter 时，一个实例发送消息，另一个实例连接的 client 能收到事件。
