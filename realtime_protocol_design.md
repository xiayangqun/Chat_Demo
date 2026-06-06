# Chat Demo 实时消息协议设计文档

## 1. 目标

实时消息传递使用 Google Protocol Buffers。该协议只用于 Socket.IO 实时事件的 payload 编码，不替代 GraphQL。

职责划分：

- GraphQL：认证、查询、发送消息、创建群聊、标记已读。
- Socket.IO：连接、加入 room、离开 room、实时推送事件。
- Protocol Buffers：编码 Socket.IO 服务端推送事件 payload。

## 2. 协议文件

协议文件路径：

```text
proto/chat_realtime.proto
```

如果后续修改实时事件字段、枚举、消息结构或事件类型，必须同步修改：

- `proto/chat_realtime.proto`
- `realtime_protocol_design.md`
- `api_definition.md`
- `frontend_design.md`
- `backend_design.md`

## 3. Socket.IO 与 Protobuf 的关系

Socket.IO 仍然负责事件名和传输通道，Protobuf 负责事件 payload。

示例：

```ts
socket.emit("conversation.join", { conversationId });

socket.on("message.created", (payload: Uint8Array) => {
  const event = RealtimeEvent.decode(payload);
});
```

说明：

- 客户端发送的控制事件，例如 `conversation.join`、`conversation.leave`，可以继续使用 JSON，因为它们 payload 很小，且不属于核心消息传递内容。
- 服务端推送的实时数据事件必须使用 Protobuf 二进制 payload。
- 所有服务端实时事件统一编码为 `RealtimeEvent` envelope。

## 4. 事件 Envelope

所有服务端推送事件统一使用：

```protobuf
message RealtimeEvent {
  string event_id = 1;
  RealtimeEventType type = 2;
  string emitted_at = 3;
  oneof payload {
    MessageCreatedPayload message_created = 10;
    ConversationCreatedPayload conversation_created = 11;
    ConversationUpdatedPayload conversation_updated = 12;
    TypingUpdatedPayload typing_updated = 13;
  }
}
```

字段说明：

- `event_id`：后端生成的事件 ID，用于前端去重。
- `type`：事件类型。
- `emitted_at`：ISO 8601 字符串。
- `payload`：按事件类型填充。

## 5. 事件类型

### 5.1 `MESSAGE_CREATED`

Socket.IO 事件名：

```text
message.created
```

发送范围：

- `conversation:{conversationId}` room。

Protobuf payload：

```protobuf
MessageCreatedPayload {
  Message message = 1;
}
```

前端行为：

- decode payload。
- 如果消息 ID 已存在，不重复插入。
- 如果当前打开该 conversation，追加消息。
- 更新对应 conversation 的 lastMessage 可等待 `conversation.updated`，也可本地同步。

### 5.2 `CONVERSATION_CREATED`

Socket.IO 事件名：

```text
conversation.created
```

发送范围：

- 新群聊所有成员的 `user:{userId}` room。

Protobuf payload：

```protobuf
ConversationCreatedPayload {
  Conversation conversation = 1;
}
```

前端行为：

- 如果会话列表中不存在该 conversation，插入列表顶部。
- 如果当前用户是创建者，创建 mutation 返回和 socket 事件可能都到达，必须用 conversation.id 去重。

### 5.3 `CONVERSATION_UPDATED`

Socket.IO 事件名：

```text
conversation.updated
```

发送范围：

- 会话所有成员的 `user:{userId}` room。

Protobuf payload：

```protobuf
ConversationUpdatedPayload {
  Conversation conversation = 1;
}
```

前端行为：

- 更新会话列表中的 lastMessage、updatedAt、unreadCount。
- 因 unreadCount 是当前用户视角数据，所以后端需要为不同用户分别编码并发送 payload。

### 5.4 `TYPING_UPDATED`

Socket.IO 事件名：

```text
typing.updated
```

可选事件，不作为 MVP 必做。

发送范围：

- `conversation:{conversationId}` room，排除触发用户自身。

## 6. TypeScript 生成建议

前后端都应从同一个 proto 文件生成 TypeScript 类型。

推荐库：

- `protobufjs`
- 或 `ts-proto`

推荐命令示例：

```bash
npx protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=src/generated \
  proto/chat_realtime.proto
```

实际命令可由实现阶段根据项目工具链调整。

## 7. 前端编解码设计

前端 Socket hook 应集中处理 decode：

```text
useChatSocket
  socket.on("message.created", decodeRealtimeEvent)
  socket.on("conversation.created", decodeRealtimeEvent)
  socket.on("conversation.updated", decodeRealtimeEvent)
```

不要在每个组件中直接 decode protobuf。组件只接收已经转换为前端类型的数据。

## 8. 后端编解码设计

后端 RealtimeService 负责 encode：

```text
RealtimeService
  buildRealtimeEvent(type, payload)
  encodeRealtimeEvent(event): Uint8Array
  emitToConversation(...)
  emitToUser(...)
```

Resolver 和 service 不直接调用 protobuf encode，避免业务逻辑和传输编码耦合。

## 9. 兼容性规则

- 不要删除已有字段编号。
- 不要复用已删除字段编号。
- 新字段必须使用新的 field number。
- 可选字段新增时保持默认值安全。
- enum 新值只能追加，不要重排已有值。
- GraphQL 的实体字段名和 Protobuf message 字段语义应保持一致。

