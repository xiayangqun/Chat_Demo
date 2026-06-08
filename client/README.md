# Chat Demo 前端应用

## 项目简介

这是一个实时聊天演示应用的前端代码库。应用采用暗色主题和三栏布局（侧边导航 + 会话列表 + 聊天面板），支持登录/注册、一对一私聊、群聊、消息实时推送、@提及和引用回复等功能。

---

## 技术栈

| 技术 | 用途 |
|---|---|
| **React 19** | UI 框架 |
| **TypeScript** | 类型安全 |
| **Vite 8** | 构建工具 |
| **Apollo Client** | GraphQL 客户端（查询/变更/缓存） |
| **Socket.IO** | 实时消息推送 |
| **Protocol Buffers (protobufjs)** | 实时事件二进制编解码 |
| **React Router 7** | 客户端路由 |
| **Tailwind CSS 4** | 样式框架 |
| **Lucide React** | 图标库 |

---

## 目录结构

```
client/src/
├── App.tsx                              # 根组件
│                                        #   BrowserRouter 包裹全局路由
│                                        #   ApolloProvider 提供 GraphQL 客户端
│                                        #   AuthGate 鉴权守卫
│                                        #   认证通过后渲染 AppShell
│
├── main.tsx                             # 应用入口
│                                        #   createRoot 渲染 App 到 #root
│                                        #   导入 index.css 和 globals.css
│
├── app/
│   └── providers/
│       ├── ApolloProvider.tsx           # Apollo Client 初始化
│       │                                   httpLink → GraphQL 端点
│       │                                   authLink → 注入 Bearer token
│       │                                   errorLink → UNAUTHENTICATED 自动登出
│       │                                   InMemoryCache 归一化缓存
│       │
│       └── SocketProvider.tsx           # Socket.IO 客户端 Context
│                                           useMemo 创建 socket 实例
│                                           传入 auth.token 完成连接鉴权
│                                           connect/disconnect 日志
│
├── features/
│   ├── auth/                            # 认证功能模块
│   │   ├── components/
│   │   │   ├── AuthForm.tsx             # 登录/注册表单
│   │   │   │                               用户名(3-32字符)
│   │   │   │                               显示名(注册时必填,1-40字符)
│   │   │   │                               密码(至少6字符)
│   │   │   │                               客户端校验 + 服务端错误展示
│   │   │   │                               提交时 loading 态
│   │   │   │
│   │   │   ├── AuthGate.tsx             # 路由守卫 / 认证上下文
│   │   │   │                               检查 localStorage access_token
│   │   │   │                               发起 GET_CURRENT_USER 查询
│   │   │   │                               无 token → 渲染 AuthPage
│   │   │   │                               有 token 但 loading → 加载中
│   │   │   │                               认证通过 → 提供 AuthContext + 渲染子组件
│   │   │   │                               handleAuthSuccess 保存 token 并 refetch
│   │   │   │                               logout 清除 token + resetStore
│   │   │   │
│   │   │   └── AuthPage.tsx             # 登录/注册页面容器
│   │   │                                   Logo + 品牌名 "Gradual Community"
│   │   │                                   Log in / Sign up 切换标签
│   │   │                                   调用 LOGIN_MUTATION / REGISTER_MUTATION
│   │   │
│   │   ├── graphql/
│   │   │   ├── auth.mutations.ts        # LOGIN_MUTATION, REGISTER_MUTATION
│   │   │   └── auth.queries.ts          # GET_CURRENT_USER
│   │   │
│   │   └── hooks/
│   │       └── useAuth.ts               # 认证逻辑 Hook
│   │                                       useQuery 获取当前用户
│   │                                       提供 user, loading, error, logout, handleAuthSuccess
│   │
│   └── chat/                            # 聊天功能模块
│       ├── components/
│       │   ├── AppShell.tsx             # 应用布局壳
│       │   │                               左: SidebarNav (固定 56px 宽)
│       │   │                               右: 纵向排列 GlobalTopBar + MainWorkspace
│       │   │                               从 AuthContext 读取 user 和 logout
│       │   │
│       │   ├── GlobalTopBar.tsx         # 全局顶部导航栏
│       │   │                               搜索框 (仅 UI，尚未实现搜索功能)
│       │   │                               时区显示 (UTC -05:00 Chicago)
│       │   │                               通知/帮助图标按钮
│       │   │                               用户头像 + 下拉菜单 (登出)
│       │   │                               click outside 关闭下拉
│       │   │
│       │   ├── SidebarNav.tsx           # 左侧导航栏
│       │   │                               顶部品牌标识 "Gradual Community"
│       │   │                               Engage 组: Forum(禁用), Chat, Matches(禁用)
│       │   │                               People 组: Members, Contributors(禁用)
│       │   │                               选中态高亮 (bg-white/10 + accent)
│       │   │                               底部 "Powered by Gradual" 标签
│       │   │                               禁用项显示为灰色不可点击
│       │   │
│       │   ├── MainWorkspace.tsx        # 主工作区路由入口
│       │   │                               Route / → ChatWorkspace
│       │   │                               Route /members → MembersPage
│       │   │
│       │   ├── ChatWorkspace.tsx        # 聊天工作区
│       │   │                               左: ConversationListPanel (340px 宽)
│       │   │                               右: ChatPanel (剩余宽度)
│       │   │                               useConversationSelection 管理选中会话
│       │   │                               未选择会话时显示占位提示
│       │   │                               加载所有用户供 @提及使用
│       │   │
│       │   ├── ConversationListPanel.tsx # 会话列表面板
│       │   │                               顶部搜索框 + 创建群聊按钮
│       │   │                               GraphQL GET_CONVERSATIONS 查询
│       │   │                               loading 态: 骨架屏 (5 个占位项)
│       │   │                               error 态: 错误提示
│       │   │                               空态: "No conversations yet"
│       │   │                               渲染 ConversationListItem 列表
│       │   │                               集成 CreateGroupConversationModal
│       │   │
│       │   ├── ConversationListItem.tsx  # 会话列表条目
│       │   │                               头像 (首字母缩略图或图片)
│       │   │                               会话名称 + 时间戳 (相对时间)
│       │   │                               最后消息预览 (发送者: 内容)
│       │   │                               未读数徽章 (红色圆形, 99+ 截断)
│       │   │                               选中态高亮 (bg-active-row)
│       │   │
│       │   ├── ChatPanel.tsx            # 聊天面板
│       │   │                               组合 ChatHeader + MessageList + MessageComposer
│       │   │                               GraphQL GET_MESSAGES 分页查询 (每条 50 条)
│       │   │                               SEND_MESSAGE_MUTATION 发送消息
│       │   │                               管理引用回复状态 (quotedMessage)
│       │   │
│       │   ├── ChatHeader.tsx           # 聊天头部
│       │   │                               左侧: 会话名称
│       │   │                               右侧: 成员数标签 (带 Users 图标)
│       │   │
│       │   ├── MessageList.tsx          # 消息列表
│       │   │                               自动滚动到底部 (scrollIntoView)
│       │   │                               空态: "No messages yet"
│       │   │                               消息底部对齐
│       │   │                               调用 MessageItem 渲染每条消息
│       │   │
│       │   ├── MessageItem.tsx          # 单条消息
│       │   │                               我的消息: 右对齐, cyan 气泡 (myBubble)
│       │   │                               他人的消息: 左对齐, 灰色气泡 (otherBubble)
│       │   │                               引用回复区块 (左侧 accent 竖线)
│       │   │                               @提及高亮 (accent 颜色)
│       │   │                               发送者头像 + 名称 + 时间
│       │   │
│       │   ├── MessageComposer.tsx       # 消息输入框
│       │   │                               Enter 发送, Shift+Enter 换行
│       │   │                               工具栏 (Bold/Italic/Strikethrough/List/Emoji/File/Mention)
│       │   │                               当前仅 UI，功能待实现 (disabled)
│       │   │                               字数统计 (4000 字符上限)
│       │   │                               @提及集成 (MentionDropdown)
│       │   │                               引用回复预览 (QuotePreview)
│       │   │                               自动调整文本框高度 (min 40px, max 200px)
│       │   │
│       │   ├── QuotePreview.tsx          # 引用回复预览
│       │   │                               显示被引用消息的作者和内容截断
│       │   │                               左侧 accent 竖线标识
│       │   │                               关闭按钮清除引用
│       │   │
│       │   ├── MentionDropdown.tsx       # @提及下拉选择
│       │   │                               键盘导航 (ArrowUp/ArrowDown/Enter/Escape)
│       │   │                               选中项自动滚动可见
│       │   │                               用户头像 + 名称 + 职称
│       │   │                               click outside 关闭
│       │   │
│       │   ├── MembersPage.tsx           # 成员页面
│       │   │                               标题 "Members" + "Create group chat" 按钮
│       │   │                               搜索框过滤成员
│       │   │                               排除当前登录用户
│       │   │                               多选模式 (复选框)
│       │   │                               选中 2+ 人后可创建群聊 (当前为占位)
│       │   │                               loading 态骨架屏
│       │   │
│       │   ├── UserListItem.tsx          # 用户条目
│       │   │                               头像 (首字母或图片)
│       │   │                               显示名 + @用户名 + 职称
│       │   │                               选中态复选框
│       │   │                               disabled 态半透明
│       │   │
│       │   └── CreateGroupConversationModal.tsx  # 创建群聊弹窗
│       │                                          弹窗标题 "New Group Chat"
│       │                                          群组名称输入 (最大 60 字符, 校验)
│       │                                          成员搜索 + 多选
│       │                                          已选成员标签 (可移除)
│       │                                          Escape 关闭 / 点击背景关闭
│       │                                          CREATE_GROUP_CONVERSATION_MUTATION
│       │                                          乐观更新 GET_CONVERSATIONS 缓存
│       │                                          创建成功后跳转到 /
│       │
│       ├── graphql/
│       │   ├── chat.mutations.ts         # SEND_MESSAGE_MUTATION
│       │   │                                CREATE_GROUP_CONVERSATION_MUTATION
│       │   │                                MARK_CONVERSATION_READ
│       │   │
│       │   └── chat.queries.ts           # GET_CONVERSATIONS
│       │                                    GET_MESSAGES (分页: nodes + pageInfo)
│       │                                    GET_USERS (可选 query/limit/skip)
│       │
│       ├── hooks/
│       │   ├── useChatSocket.ts          # Socket.IO 事件监听 + Apollo Cache 同步
│       │   │                                message.created → 写入 Message 缓存
│       │   │                                conversation.created → 写入并置顶会话
│       │   │                                conversation.updated → 更新未读数/最后消息
│       │   │                                去重 (readFragment + readField 检测)
│       │   │                                排序 conversations 按 updatedAt 降序
│       │   │                                暴露 joinConversation / leaveConversation
│       │   │
│       │   ├── useConversationSelection.ts  # 会话选择 + markRead
│       │   │                                   选中会话 → 清空本地未读数
│       │   │                                   发起 MARK_CONVERSATION_READ 变更
│       │   │                                   乐观响应立即更新
│       │   │
│       │   └── useMentions.ts           # @提及检测 + 候选列表
│       │                                   监听 @ 符号触发
│       │                                   限制在词首或空白后
│       │                                   候选列表最多 5 个
│       │                                   选中后记录 userId (去重)
│       │                                   键盘导航 ArrowUp/ArrowDown/Escape
│       │
│       └── utils/
│           └── mapRealtimeEvent.ts       # Protobuf DTO → GraphQL 类型转换
│                                           mapProtoMessageToGql
│                                           mapProtoConversationToGql
│                                           枚举映射 (数字→字符串)
│                                           __typename 注入 (Apollo 缓存要求)
│
├── generated/
│   └── chat_realtime.ts                 # Protobuf 运行时类型定义
│                                           inline proto 定义 (protobufjs 解析)
│                                           枚举常量: RealtimeEventType, ConversationType, MessageType
│                                           TypeScript 接口: Message, Conversation, RealtimeEvent 等
│                                           导出 loadProto() 供解码使用
│
└── shared/
    ├── hooks/
    │   └── useSocket.ts                 # Socket Context Hook
    │                                       从 SocketProvider 读取 socket 实例
    │                                       不在 Provider 内使用时抛出错误
    │
    ├── styles/
    │   └── tokens.ts                    # 设计 Token (见下方设计 Token 章节)
    │                                       颜色、字体族、圆角半径
    │                                       导出 tokens as const 类型
    │
    └── utils/
        └── protobuf.ts                  # Protobuf 解码封装
                                           decodeRealtimeEvent (通用)
                                           decodeMessageCreated
                                           decodeConversationCreated
                                           decodeConversationUpdated
                                           camelCase 转换 + 数字枚举
```

---

## 核心模块详解

### `app/providers/` — 全局 Provider

- **ApolloProvider.tsx**: 初始化 Apollo Client。使用 `httpLink` 连接 GraphQL 端点（默认 `http://localhost:5173`，通过 `VITE_GRAPHQL_URL` 环境变量配置）。`authLink` 从 `localStorage` 读取 `access_token` 并注入 `Authorization: Bearer <token>` 请求头。`errorLink` 监听 `UNAUTHENTICATED` 错误码并自动清除 token。

- **SocketProvider.tsx**: 创建 Socket.IO 客户端实例，连接地址通过 `VITE_SOCKET_URL` 配置（默认 `http://localhost:4000`）。连接时通过 `auth.token` 携带 JWT 完成鉴权。在 unmount 时自动断开连接。

### `features/auth/` — 认证模块

- **AuthGate**: 路由守卫组件。检查 `localStorage` 中是否存在 `access_token`，存在则执行 `GET_CURRENT_USER` 查询验证 token 有效性。认证通过后提供 `AuthContext`（包含 `user`、`logout`、`handleAuthSuccess`），未认证则渲染 `AuthPage`。

- **AuthPage**: 登录/注册页面容器。包含品牌 Logo、Log in / Sign up 切换标签。调用 `LOGIN_MUTATION` 或 `REGISTER_MUTATION`，成功后通过回调保存 token。

- **AuthForm**: 表单组件。用户名 3-32 字符，显示名 1-40 字符（仅注册），密码至少 6 字符。支持客户端校验和服务端错误展示。

- **useAuth**: 认证 Hook，封装 `GET_CURRENT_USER` 查询，提供 `user`、`loading`、`error`、`logout`、`handleAuthSuccess`。

### `features/chat/components/` — 聊天 UI 组件

- **AppShell**: 应用整体布局壳。左侧 `SidebarNav`（固定宽度），右侧上 `GlobalTopBar` + 下 `MainWorkspace`。

- **GlobalTopBar**: 顶部栏，包含搜索框（仅 UI）、时区显示、通知/帮助按钮、用户头像下拉菜单（含登出）。

- **SidebarNav**: 左侧导航栏。分为 Engage（Forum、Chat、Matches）和 People（Members、Contributors）两组。Chat 和 Members 可点击，其余为禁用占位。

- **MainWorkspace**: 路由入口，`/` 指向 ChatWorkspace，`/members` 指向 MembersPage。

- **ChatWorkspace**: 聊天主区域。左列 `ConversationListPanel`（340px），右列 `ChatPanel`（弹性填充）。通过 `useConversationSelection` 管理当前选中的会话。

- **ConversationListPanel**: 会话列表。搜索框 + 创建群聊按钮。GraphQL 查询获取会话列表，支持 loading 骨架屏、error 和空态展示。

- **ConversationListItem**: 单个会话条目。显示头像、名称、最后消息预览、相对时间和未读数徽章（99+ 截断）。

- **ChatPanel**: 聊天面板。组合 `ChatHeader` + `MessageList` + `MessageComposer`。查询消息列表并处理发送消息。

- **ChatHeader**: 聊天头部，显示会话名称和成员数。

- **MessageList**: 消息列表，自动滚动到底部，消息底部对齐。

- **MessageItem**: 单条消息。我发的消息右对齐 cyan 气泡，他人消息左对齐灰色气泡。支持引用回复区块和 @提及高亮。

- **MessageComposer**: 消息输入框。Enter 发送、Shift+Enter 换行。工具栏按钮当前为禁用占位。支持 @提及、引用回复、字数统计（4000 字符上限）、自动调整高度。

- **QuotePreview**: 引用回复预览条，显示被引用消息的作者和内容，带关闭按钮。

- **MentionDropdown**: @提及下拉列表，支持键盘导航，最多显示 5 个候选。

- **MembersPage**: 成员页面。列出所有注册用户（排除当前用户），支持搜索过滤和多选创建群聊。

- **UserListItem**: 用户条目组件，支持选中状态和复选框。

- **CreateGroupConversationModal**: 创建群聊弹窗。输入群组名称、搜索并选择成员，提交 CREATE_GROUP_CONVERSATION_MUTATION 并乐观更新缓存。

### `features/chat/graphql/` — GraphQL 操作

- **chat.queries.ts**: `GET_CONVERSATIONS`（获取会话列表）、`GET_MESSAGES`（分页获取消息）、`GET_USERS`（获取用户列表，支持搜索过滤）。
- **chat.mutations.ts**: `SEND_MESSAGE_MUTATION`（发送消息）、`CREATE_GROUP_CONVERSATION_MUTATION`（创建群聊）、`MARK_CONVERSATION_READ`（标记已读）。

### `features/chat/hooks/` — 自定义 Hooks

- **useChatSocket**: 核心实时通信 Hook。监听 `message.created`、`conversation.created`、`conversation.updated` 三个 Socket.IO 事件，接收到 Protobuf 二进制数据后解码，然后更新 Apollo Cache（写入 fragment、追加 nodes、重新排序）。暴露 `joinConversation` 和 `leaveConversation` 用于房间管理。

- **useConversationSelection**: 会话选择状态管理。选中会话时清空本地未读数并触发 `MARK_CONVERSATION_READ` 变更（含乐观响应）。

- **useMentions**: @提及逻辑 Hook。监听文本输入中的 @ 符号，管理候选列表状态、键盘导航、选中记录去重。

### `features/chat/utils/` — 工具函数

- **mapRealtimeEvent.ts**: Protobuf 数据到 GraphQL 兼容类型的转换器，将数字枚举映射为字符串枚举，注入 `__typename` 满足 Apollo 缓存要求。

### `generated/` — Protobuf 运行时

- **chat_realtime.ts**: 包含内联 proto 定义（`protobufjs.parse` 解析），导出 TypeScript 接口（`Message`、`Conversation`、`RealtimeEvent` 等）和枚举常量。运行时无需 proto 文件即可解码二进制数据。

### `shared/` — 共享模块

- **useSocket**: 从 `SocketContext` 获取 socket 实例的 Hook。
- **tokens.ts**: 设计 Token 定义（见下方）。
- **protobuf.ts**: Protobuf 二进制解码封装函数。

---

## 快速启动

```bash
# 1. 进入 client 目录
cd client

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 应用默认运行在 http://localhost:5173
```

### 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `VITE_GRAPHQL_URL` | `http://localhost:5173` | GraphQL 端点地址 |
| `VITE_SOCKET_URL` | `http://localhost:4000` | Socket.IO 服务地址 |

---

## 路由结构

| 路径 | 组件 | 说明 |
|---|---|---|
| `/` | ChatWorkspace | 聊天主页面，显示会话列表和聊天面板 |
| `/members` | MembersPage | 成员列表页面，支持搜索和多选 |

路由定义在 `MainWorkspace.tsx` 中，使用 React Router `<Routes>` / `<Route>`。

---

## 状态管理

应用采用 **Apollo Client 归一化缓存** + **Socket.IO 实时更新** 的双层状态架构：

- **Apollo Cache** 作为数据主干。GraphQL 查询结果自动写入归一化缓存，组件通过 `useQuery` 订阅缓存变化。变更操作（发送消息、创建群聊、标记已读）通过 `useMutation` 触发，并附带 `optimisticResponse` 或手动 `update` 实现乐观 UI。

- **Socket.IO 实时事件**在 `useChatSocket` 中统一处理。接收到服务端推送的 Protobuf 二进制事件后，解码并通过 `cache.writeFragment`、`cache.modify` 写入 Apollo Cache，触发关联组件自动重渲染。`useConversationSelection` 管理本地会话选择状态和 markRead 乐观更新。

---

## 设计 Token

设计 Token 定义在 `shared/styles/tokens.ts` 中，是整个应用视觉基石的单一数据源。

### 颜色

| Token | 值 | 用途 |
|---|---|---|
| `color.appBg` | `#0C0E13` | 应用背景色（最外层） |
| `color.panel` | `#1D1C21` | 面板背景色（侧边栏、会话列表等） |
| `color.chatBg` | `#26252D` | 聊天区域背景色 |
| `color.activeRow` | `#26252D` | 选中行/悬停行背景色 |
| `color.border` | `#454350` | 边框色 |
| `color.textPrimary` | `#FFFFFF` | 主文字色 |
| `color.textSecondary` | `#C9C7D0` | 次文字色 |
| `color.textMuted` | `#7B798F` | 弱文字色 |
| `color.textDim` | `#929699` | 更弱的文字色（时间戳等） |
| `color.accent` | `#04B17D` | 主题色/强调色 |
| `color.accentHover` | `#03A070` | 主题色悬停态 |
| `color.myBubble` | `#7DEBF5` | 自己发送的消息气泡色 |
| `color.otherBubble` | `#454350` | 他人消息气泡色 |
| `color.unread` | `#FD3338` | 未读数徽章色 |
| `color.inputBg` | `#26252D` | 输入框背景色 |
| `color.dropdown` | `#35333D` | 下拉菜单背景色 |
| `color.userStatus.online` | `#04B17D` | 在线状态指示色 |
| `color.userStatus.away` | `#FFA726` | 离开状态指示色 |
| `color.userStatus.dnd` | `#FD3338` | 勿扰状态指示色 |

### 字体

| Token | 值 | 用途 |
|---|---|---|
| `font.family.body` | Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif | 正文字体 |
| `font.family.code` | SF Mono, Fira Code, Fira Mono, Menlo, monospace | 等宽字体 |

### 圆角

| Token | 值 |
|---|---|
| `radius.sm` | 4px |
| `radius.md` | 8px |
| `radius.lg` | 12px |
| `radius.xl` | 16px |
| `radius.full` | 9999px |

---

## 实时通信

应用使用 **Socket.IO** 实现实时消息推送，采用 **Protocol Buffers** 对事件 payload 进行二进制编码。

### 事件监听

客户端在 `useChatSocket` 中注册以下事件监听器：

| 事件名称 | payload (Protobuf) | 处理逻辑 |
|---|---|---|
| `message.created` | `RealtimeEvent → messageCreated → Message` | 解码后写入 Apollo Message 缓存，追加到对应会话的消息列表，重新排序会话列表 |
| `conversation.created` | `RealtimeEvent → conversationCreated → Conversation` | 解码后写入 Apollo Conversation 缓存，置顶到会话列表首位 |
| `conversation.updated` | `RealtimeEvent → conversationUpdated → Conversation` | 解码后更新会话的 lastMessage、unreadCount、updatedAt，重新排序会话列表 |

### 数据流

```
Socket.IO 二进制数据 (Uint8Array)
  → protobufjs.decode (chat.realtime.v1.RealtimeEvent)
  → mapRealtimeEvent.ts (枚举转换 + __typename 注入)
  → Apollo Cache (writeFragment / cache.modify)
  → React 组件自动重渲染 (useQuery 订阅)
```

### 房间管理

`useChatSocket` 还提供 `joinConversation` 和 `leaveConversation` 方法，用于加入/离开特定会话的房间，以便接收该会话的实时更新。

### 消息发送

消息发送不走 Socket.IO，通过 **GraphQL Mutation** (`SEND_MESSAGE_MUTATION`) 提交，服务端保存后通过 Socket.IO 广播给该会话的在线成员。
