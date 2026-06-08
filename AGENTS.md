# AGENTS.md

## 项目设计文档

在实现或修改这个 Chat Demo 之前，必须先阅读当前目录下的设计文档：

- `product_design.md`：产品范围、用户故事、Members 行为、群聊创建流程、成功标准。
- `frontend_design.md`：React 前端架构、组件要求、布局细节、Members 页面、创建群聊弹窗。
- `backend_design.md`：Node.js、GraphQL、Socket.IO、认证、服务模块、后端行为。
- `api_definition.md`：GraphQL schema、query/mutation 契约、Socket.IO 事件契约。
- `database_design.md`：MongoDB collections、字段、索引、validators、关系、数据库初始化说明。
- `realtime_protocol_design.md`：Google Protocol Buffers 实时消息协议设计，Socket.IO 二进制事件约定。
- `redis_design.md`：Redis 缓存、Socket.IO Redis adapter、缓存 key、失效策略。

## 数据库初始化脚本

数据库初始化脚本：

- `scripts/init-database.sh`
- `scripts/init-database.mongosh.js`

运行方式：

```bash
./scripts/init-database.sh
```

或指定数据库地址：

```bash
MONGODB_URI="mongodb://localhost:27017/chat-demo" ./scripts/init-database.sh
```

## 关键规则：数据库结构必须同步脚本

如果后续任何修改涉及 MongoDB collection 名称、字段、必填字段、validator、索引、枚举值或数据关系假设，必须在同一次修改中同步更新：

- `database_design.md`
- `scripts/init-database.mongosh.js`

不能让数据库设计文档和初始化脚本脱节。`scripts/init-database.mongosh.js` 是创建数据库结构的可执行来源，所有数据库结构相关变更都必须反映在该脚本中。

## 关键规则：实时协议必须同步 Protobuf

实时消息传递使用 Google Protocol Buffers。后续如果修改 Socket.IO 实时事件 payload 字段、事件类型、枚举值或数据结构，必须同步更新：

- `realtime_protocol_design.md`
- `proto/chat_realtime.proto`
- `api_definition.md` 中的 Socket.IO 事件说明
- 前端和后端设计文档中的实时消息处理说明

修改 `proto/chat_realtime.proto` 后，必须运行 `npm run generate-proto`（在 server/ 或 client/ 目录下）重新生成静态编解码模块。不要手动编辑以下自动生成的文件：

- `proto/generated/chat_realtime.{js,d.ts}`
- `server/src/generated/chat_realtime_pb.{js,d.ts}`
- `client/src/generated/chat_realtime_pb.{js,d.ts}`

`server/src/generated/chat_realtime.ts` 和 `client/src/generated/chat_realtime.ts` 是手动维护的封装层，如果新增消息类型或枚举值，也需要同步更新。

GraphQL 仍然使用标准 JSON/GraphQL 请求响应；Protobuf 只用于 Socket.IO 实时事件的二进制 payload。

## 关键规则：Redis 设计必须同步

后端接入 Redis 缓存。后续如果修改缓存 key、TTL、缓存失效策略、Socket.IO Redis adapter、会话列表缓存、用户缓存、成员缓存或未读数缓存策略，必须同步更新：

- `redis_design.md`
- `backend_design.md`

本地开发 Redis server 使用 Docker 容器：

```bash
docker run --name chat-demo-redis -p 6379:6379 -d redis:7
```

后端通过 `REDIS_URL=redis://localhost:6379` 连接该容器。Node.js 项目只需要安装 Redis 客户端依赖，不需要全局安装 Redis Node 包。

## 当前产品假设

- Members 展示数据库里所有已注册用户，不是好友列表。
- 群聊通过选择已注册用户并输入群聊名称创建。
- 当前登录用户会自动加入自己创建的群聊。
- 聊天成员关系存储在 `conversation_members`。
- 项目不设计 friends collection，也不设计好友关系模型。
- Socket.IO 实时事件使用 Protobuf 二进制 payload。
- Redis 用于缓存热点数据，并用于 Socket.IO 多实例广播扩展。
