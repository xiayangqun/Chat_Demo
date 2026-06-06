# Chat Demo 前端设计文档

## 1. 技术栈

- React.js
- TypeScript
- GraphQL Client：Apollo Client 推荐
- Realtime：Socket.IO Client
- Realtime Payload：Google Protocol Buffers
- Styling：CSS Modules、Tailwind CSS 或 styled-components 均可；推荐 Tailwind CSS 便于快速还原 Figma
- Icons：lucide-react 推荐
- Build Tool：Vite 推荐
- Test：Vitest + React Testing Library

## 2. 前端目标

实现一个带轻量登录/注册的深色主题聊天页面，使另一个 AI 不依赖视觉模型也能按文字描述还原 Figma。登录后页面核心是三栏布局：左侧社区导航、中间会话列表、右侧聊天详情。

实时 Socket.IO 服务端推送事件使用 Protobuf 二进制 payload。前端需要从 `proto/chat_realtime.proto` 生成 TypeScript 类型，并在 socket hook 中统一 decode。

## 3. 视觉基准

设计稿尺寸为 1440 x 916。图片实际导出为 2880 x 1832，可视为 2x 屏幕。

### 3.1 主色

使用以下设计 token：

| Token | Value | 用途 |
|---|---:|---|
| `color.appBg` | `#0C0E13` | 页面最外层背景 |
| `color.panel` | `#1D1C21` | 会话列表普通背景 |
| `color.chatBg` | `#26252D` | 聊天详情背景 |
| `color.activeRow` | `#26252D` | 选中会话行 |
| `color.border` | `#454350` | 分割线、描边 |
| `color.textPrimary` | `#FFFFFF` | 主要文本 |
| `color.textSecondary` | `#C9C7D0` | 次级文本 |
| `color.textMuted` | `#7B798F` | 弱文本 |
| `color.textDim` | `#929699` | 时间、辅助 |
| `color.accent` | `#04B17D` | Chat 高亮、品牌绿 |
| `color.myBubble` | `#7DEBF5` 或 `#80D8C3` | 当前用户气泡，按截图偏薄荷绿 |
| `color.otherBubble` | `#454350` | 他人消息气泡 |
| `color.unread` | `#FD3338` | 未读红点 |
| `color.inputBg` | `#26252D` | 输入器背景 |
| `color.dropdown` | `#35333D` | 提及下拉背景 |

### 3.2 字体

- 全局字体：Inter，fallback 为 `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`。
- 页面主要标题：18px, weight 600。
- 会话标题：16px, weight 500。
- 正文消息：16px, weight 500，行高约 1.55。
- 时间和摘要：13px 到 14px，weight 500。
- 小标签：11px 到 12px。

### 3.3 圆角

- 头像：圆形。
- 导航圆形 icon 容器：44px 到 52px 圆形。
- 消息气泡：6px 到 8px。
- 搜索框：8px。
- 成员数按钮：24px 胶囊圆角。
- 提及下拉：6px。

## 4. 总体布局

页面用固定高度 `100vh`，禁止 body 出现整体滚动，滚动只发生在会话列表和消息区。

### 4.1 桌面布局尺寸

以 1440px 宽为基准：

- 顶层 app：`display: grid`。
- 左侧社区导航：宽 `224px`。
- 主内容区：宽度剩余，顶部从 y=70 左右开始，距离右侧 30px。
- 会话列表栏：宽 `340px`。
- 聊天详情区：剩余宽度，最小 640px。
- 顶部全局栏：高度约 `72px`，横跨页面右上区域，左侧品牌在导航内。

建议实现结构：

```text
App
  AuthGate
    AuthPage
    AppShell
      GlobalTopBar
      SidebarNav
      MainWorkspace
        ChatWorkspace
          ConversationListPanel
          ChatPanel
            ChatHeader
            MessageList
            MessageComposer
        MembersPage
        CreateGroupConversationModal
```

### 4.2 响应式

面试 Demo 可以优先桌面，但仍需基础适配：

- `>= 1024px`：三栏完整展示。
- `768px - 1023px`：左侧导航压缩为 80px，只显示图标；会话栏宽 300px。
- `< 768px`：默认展示会话列表，点击会话后进入聊天页；提供返回按钮。此移动端可作为简化实现，不要求完全还原 Figma。

## 5. 组件设计

### 5.1 `AuthGate`

职责：

- 从 localStorage 读取 access token。
- 有 token 时调用 GraphQL `me` 校验 token。
- token 有效时渲染 `AppShell`。
- token 缺失或失效时渲染 `AuthPage`。
- 登录或注册成功后保存 token 并进入聊天页。
- 退出登录时清除 token、断开 Socket.IO、回到登录页。

状态：

- `accessToken`
- `currentUser`
- `authChecking`
- `authError`

### 5.2 `AuthPage`

职责：

- 提供登录和注册两个模式。
- 调用 GraphQL `login` 和 `register` mutation。
- 显示表单错误和接口错误。

视觉：

- 背景使用 `#0C0E13`。
- 页面中央放一个宽 360px 到 420px 的认证面板。
- 面板背景 `#1D1C21`，边框 `#454350`，圆角 8px。
- 顶部展示圆形绿色 logo 和 `Gradual Community`。
- 使用两个 tab 或 segmented control：`Log in`、`Sign up`。
- 输入框高度 44px，背景 `#26252D`，边框 `#454350`，文字白色。
- 主按钮背景 `#04B17D`，文字深色或白色。
- 错误文案使用红色 `#FD3338`，放在对应输入框下方或表单底部。

登录表单：

- `username`
- `password`

注册表单：

- `username`
- `displayName`
- `password`

表单规则：

- username 必填，3 到 32 个字符。
- displayName 注册时必填，1 到 40 个字符。
- password 必填，至少 6 个字符。
- 提交中禁用按钮并显示 loading 文案。

### 5.3 `AppShell`

职责：

- 组织页面整体布局。
- 接收已认证当前用户。
- 初始化 GraphQL Provider 和 Socket Provider。
- 渲染顶部栏、左侧导航和聊天工作区。

Props：无。

状态：

- `currentUser`：由 `AuthGate` 的 `me` 查询得到。
- `accessToken`：由 `AuthGate` 注入 provider。

### 5.4 `GlobalTopBar`

位置：

- 页面顶部右侧，从主内容区域上方开始。
- 高度约 72px。

内容从左到右：

1. 搜索框：宽 144px，高 38px，背景 `#1D1F26`，图标搜索，placeholder `Search`。
2. 时区信息：地球图标 + `UTC -05:00 Chicago`。
3. 通知铃铛图标。
4. 帮助圆圈图标。
5. 当前用户头像，直径 36px。

交互：

- 搜索框暂不需要实际全局搜索。
- 图标按钮 hover 时颜色变亮。
- 点击当前用户头像显示小菜单，至少包含 `Log out`。

### 5.5 `SidebarNav`

宽度：

- 桌面 224px。
- 背景 `#0C0E13`。

顶部品牌：

- 左上角圆形绿色 logo，直径 40px 到 44px。
- 右侧文字 `Gradual Community`，白色，16px 到 18px，weight 600。

分组：

- `Engage` 小标题，灰色 14px。
- 菜单：Forum、Chat、Matches。
- 分割线。
- `People` 小标题。
- 菜单：Members、Contributors。

菜单项结构：

- 左侧圆形 icon 容器，直径 44px。
- 右侧 label，18px 到 20px。
- Chat 当前选中：
  - icon 容器为白色圆形，内部有绿色聊天图形。
  - label 使用 `#04B17D`。
  - icon 右上角红色 badge `25`。
- Members 选中：
  - 当当前页面为 Members 时，Members label 使用 `#04B17D`。
  - Members icon 容器变亮，但不显示未读 badge。

交互：

- 点击 Chat 显示聊天工作区。
- 点击 Members 显示所有注册用户列表。
- Forum、Matches、Contributors 可保持不可用或 no-op，但视觉保留。

底部：

- 左下角 `Powered by Gradual` 小 badge，宽约 120px，高 34px，边框 `#454350`。

### 5.6 `ConversationListPanel`

位置：

- 主内容区左栏。
- 宽 340px。
- 背景 `#1D1C21`。
- 高度从 y=70 到页面底部，约 826px。

组成：

1. 顶部操作区：高 64px，底部分割线。
2. 会话列表：可滚动。

顶部操作区：

- 左侧搜索图标。
- placeholder `Search`。
- 无边框，文字灰紫色。
- 内边距左 24px。
- 右侧放一个图标按钮，图标为 `MessageSquarePlus` 或 `UsersRound + Plus`，`aria-label="Create group conversation"`。
- 点击创建按钮打开 `CreateGroupConversationModal`。

会话条目高度：

- 群聊条目约 76px。
- 单聊条目约 76px。

会话条目结构：

- 左侧头像，直径 40px。
- 群聊头像可用 2x2 拼图形式：4 个小圆角图片重叠在 40px 区域。
- 标题在第一行，16px，白色或浅灰。
- 右上角时间，13px，灰色，例如 `20:34`。
- 第二行消息摘要，14px，`#7B798F`，单行省略。
- 未读 badge：红色圆形，18px，白字，放在头像右上方。

选中态：

- 背景 `#26252D`。
- 标题更亮。

示例列表：

```text
Announcements        20:34
Jerry: [File] Design Guideline.pdf    unread 3

Share your story     20:34
Allen: [Photo]                         unread 6

General              20:34
Tim: If you want to learn more ...
```

### 5.7 `ChatPanel`

位置：

- 右侧聊天区域。
- 背景 `#26252D`。
- 由 Header、MessageList、Composer 三块组成。

布局：

- `display: grid`。
- 行：`88px 1fr auto`。
- ChatHeader 固定顶部。
- MessageList 占剩余高度并滚动。
- Composer 固定底部，高度根据引用预览或工具栏变化。

### 5.8 `ChatHeader`

高度：

- 约 72px 到 88px。
- 底部分割线 `#454350`。

左侧：

- 会话标题，`Share Your Story`，18px，weight 600，白色。

右侧：

- 成员数胶囊按钮，宽约 104px，高 44px。
- 边框 `#7B798F`。
- 图标为 users。
- 文本为 `4`。

### 5.9 `MessageList`

职责：

- 渲染消息历史。
- 接收 Socket.IO 新消息后追加。
- 自动滚动到底部，但用户手动向上滚动时不要强制打断。
- 支持消息 hover 操作。

布局：

- 内边距顶部 24px，左右 24px 到 48px，底部 24px。
- 消息之间垂直间距 28px 到 36px。

当前用户消息：

- 右对齐。
- 元信息在气泡上方右侧：`Jenny White   20:34`。
- 头像在最右侧，直径 40px。
- 气泡在头像左侧。
- 气泡最大宽度 520px。
- 背景薄荷绿，文字接近黑色 `#0C0E13`。
- 内边距 16px 18px。

他人消息：

- 左对齐。
- 头像在最左侧，直径 40px。
- 元信息在气泡上方左侧：`Devon Lane   20:34`。
- 气泡背景 `#454350`。
- 文字白色或浅灰。
- 最大宽度 520px。

引用后的展示：

- 如果某消息有 `quoteMessage`：
  - 在消息气泡下方或上方展示一个引用摘要条。
  - 摘要条背景比聊天背景略亮，例如 `#35333D`。
  - 左侧有 2px 绿色竖线。
  - 文本格式：`Devon Lane: Check out Vanilla Forums (11/17 - 11/...`
  - 摘要条最大宽度与消息气泡一致，高度约 36px。

Hover 操作：

- 当鼠标悬停在消息气泡上：
  - 在气泡右侧或左侧显示一个小操作浮层。
  - 浮层宽约 88px，高 44px。
  - 背景透明或深色描边。
  - 包含引用图标和删除图标；Demo 中删除按钮可以禁用或隐藏，只实现引用。
  - 引用按钮 `aria-label="Quote message"`。

### 5.10 `MessageComposer`

职责：

- 输入消息。
- 发送普通消息、引用回复、提及消息。
- 展示引用预览。
- 展示提及候选下拉。

基础状态：

- 底部输入区域高度约 100px。
- 顶部分割线 `#454350`。
- 背景 `#26252D`。
- 输入框是无边框多行 textarea 或 contenteditable。
- placeholder 可为空，设计稿中主要显示光标。

发送方式：

- Enter：发送。
- Shift + Enter：换行。
- 可额外提供发送图标按钮，放在右下角；Figma 未明显显示发送按钮，但实现时推荐加一个小图标按钮保证可发现性。

工具栏状态：

- 在 `Quote_1-860.png` 中，输入器顶部有工具栏：
  - Bold `B`
  - Italic `I`
  - Strike
  - 分割线
  - 有序列表
  - 无序列表
  - 分割线
  - Emoji
  - 文件夹
  - @
- Demo 不需要实现富文本功能，但需要把这些按钮作为 disabled 或 no-op UI 展示，保持视觉接近。

引用输入状态：

- 当用户选择引用后：
  - 输入框上方出现引用预览卡片。
  - 预览卡片宽约 360px，高 36px。
  - 背景 `#35333D`。
  - 左侧绿色竖线。
  - 文本为 `Devon Lane: Check out Vanilla Forums (11/17 - 11/...`
  - 右侧有圆形关闭按钮 `x`。

提及输入状态：

- 当输入 `@Darr` 时：
  - 在输入区域上方显示下拉卡片。
  - 卡片宽约 260px，高单项 64px。
  - 背景 `#35333D`。
  - 每个候选项显示头像、姓名、subtitle。
  - 示例：`Darrell Steward`，subtitle `CTO@Apple`。
  - 当前选中项背景略亮。

### 5.11 `MentionDropdown`

Props：

- `query: string`
- `members: ConversationMember[]`
- `activeIndex: number`
- `onSelect(user)`
- `onClose()`

行为：

- query 为空时展示前 5 个成员。
- query 非空时按 name 包含关系过滤，不区分大小写。
- ArrowDown / ArrowUp 切换 activeIndex。
- Enter 选中。
- Escape 关闭。
- 点击外部关闭。

### 5.12 `QuotePreview`

Props：

- `message: Message`
- `onClear()`

显示：

- 作者名。
- 消息摘要，最多 80 字符。
- 关闭按钮。

### 5.13 `MembersPage`

职责：

- 展示数据库中所有已注册用户。
- 支持按展示名或 username 搜索。
- 支持勾选多个用户并创建群聊。
- 明确不展示好友状态，不提供添加好友动作。

布局：

- 使用与聊天主区一致的深色背景 `#26252D`。
- 页面顶部高度约 72px，标题为 `Members`。
- 标题右侧显示总人数，例如 `12 members`。
- 顶部下方是搜索框和创建群聊按钮。
- 内容区使用列表或紧凑网格。推荐列表，便于实现和扫描。

用户条目：

- 高度 64px。
- 左侧头像 40px。
- 第一行展示 `name`，白色，16px。
- 第二行展示 `@username` 和 `title`，灰色，13px。
- 右侧显示 checkbox。当前用户条目 checkbox 禁用并显示 `You` 小标签。
- hover 背景略亮。

空状态：

- 没有用户时显示 `No registered users yet`。
- 搜索无结果时显示 `No users found`。

交互：

- 勾选 1 个或多个其他用户后，创建群聊按钮可用。
- 点击创建群聊按钮打开 `CreateGroupConversationModal`，并预填已选择用户。
- Members 页面不要把用户称为 friends。

### 5.14 `CreateGroupConversationModal`

职责：

- 创建群聊。
- 输入群聊名称。
- 从所有注册用户中选择成员。

视觉：

- 居中 modal，宽 480px 到 560px。
- 背景 `#1D1C21`，边框 `#454350`，圆角 8px。
- 标题 `Create group chat`。
- 第一项为群名称输入框，placeholder `Group name`。
- 第二项为用户搜索框，placeholder `Search members`。
- 下方是可滚动用户列表，最多显示 6 到 8 行。
- 底部右侧按钮：`Cancel`、`Create`。

规则：

- 群名称必填，trim 后 1 到 60 字符。
- 至少选择 1 个其他用户。
- 当前用户自动加入群聊，不在选择结果里重复显示。
- 创建中禁用按钮。
- 创建成功后关闭 modal，跳转到新群聊。
- 创建失败时在 modal 底部显示错误。

## 6. 前端状态管理

推荐使用 Apollo Client cache 作为服务端数据状态来源，本地 UI 状态用 React hooks。

### 6.1 服务端状态

- `currentUser`
- `users`
- `conversations`
- `messages`
- `conversationMembers`

通过 GraphQL 查询和 mutation 管理。

### 6.2 本地 UI 状态

- `selectedConversationId`
- `activeSection`
- `accessToken`
- `authMode`
- `memberSearchQuery`
- `selectedUserIdsForGroup`
- `createGroupModalOpen`
- `composerText`
- `quoteMessage`
- `mentionQuery`
- `mentionDropdownOpen`
- `socketConnected`
- `isUserNearBottom`

## 7. GraphQL 操作设计

前端应定义以下 GraphQL documents：

- `GetCurrentUser`
- `Login`
- `Register`
- `GetUsers`
- `GetConversations`
- `GetConversation`
- `GetMessages`
- `CreateGroupConversation`
- `SendMessage`
- `MarkConversationRead`
- `SearchConversationMembers`

具体字段以 `api_definition.md` 为准。

## 8. Socket.IO 前端设计

### 8.1 连接

Socket URL：

- 开发环境：`http://localhost:4000`

连接参数：

- `auth.token`

连接时机：

- 登录成功并拿到 access token 后连接。
- token 变化时重建连接。

### 8.2 Room 管理

切换会话时：

1. 如果存在旧会话，emit `conversation.leave`。
2. emit `conversation.join` 加入新会话。

### 8.3 监听事件

- `message.created`：追加消息或更新已有 optimistic 消息。
- `conversation.created`：新群聊创建后，把新会话插入会话列表。
- `conversation.updated`：更新会话最后消息和未读数。
- `typing.updated`：可选，不作为必做。
- `socket.connect` / `socket.disconnect`：更新连接状态。

### 8.4 Protobuf 解码

服务端推送事件 payload 类型为 `Uint8Array`。

处理规则：

- 使用 `proto/chat_realtime.proto` 生成的 `RealtimeEvent.decode(payload)` 解码。
- `message.created` 必须解码出 `MESSAGE_CREATED`。
- `conversation.created` 必须解码出 `CONVERSATION_CREATED`。
- `conversation.updated` 必须解码出 `CONVERSATION_UPDATED`。
- 解码失败时记录错误并丢弃该事件，不让页面崩溃。
- 组件不直接处理 protobuf；`useChatSocket` 将 protobuf DTO 转为前端 `Message`、`Conversation` 类型后再更新 Apollo cache。

## 9. 交互细节

### 9.1 发送消息

按钮或 Enter 触发后：

- trim 内容。
- 如果为空，不发送。
- 发送中禁用发送按钮。
- 成功后清空输入、引用、mention query。
- 失败后保留输入并显示错误。

### 9.2 自动滚动

- 如果用户在消息列表底部 120px 范围内，新消息到达自动滚到底。
- 如果用户正在查看历史，新消息不强制滚动，可以显示 `New messages` 浮动按钮。

### 9.3 时间显示

- 会话列表使用 `HH:mm`。
- 消息元信息使用 `HH:mm`。
- Demo 种子数据可固定为 `20:34`，真实数据使用用户本地时区格式化。

### 9.4 文本截断

- 会话摘要单行截断。
- 引用摘要单行截断。
- 长消息按最大宽度换行，不撑破气泡。

## 10. 前端文件结构建议

```text
src/
  app/
    App.tsx
    providers/
      ApolloProvider.tsx
      SocketProvider.tsx
    generated/
      chat_realtime.ts
  features/
    auth/
      components/
        AuthGate.tsx
        AuthPage.tsx
        AuthForm.tsx
      graphql/
        auth.mutations.ts
        auth.queries.ts
      hooks/
        useAuth.ts
      types.ts
    chat/
      components/
        ChatWorkspace.tsx
        SidebarNav.tsx
        GlobalTopBar.tsx
        MainWorkspace.tsx
        MembersPage.tsx
        UserListItem.tsx
        CreateGroupConversationModal.tsx
        ConversationListPanel.tsx
        ConversationListItem.tsx
        ChatPanel.tsx
        ChatHeader.tsx
        MessageList.tsx
        MessageItem.tsx
        MessageComposer.tsx
        MentionDropdown.tsx
        QuotePreview.tsx
      graphql/
        chat.queries.ts
        chat.mutations.ts
      hooks/
        useChatSocket.ts
        useConversationSelection.ts
        useMentions.ts
        useAutoScroll.ts
      types.ts
      utils/
        mapRealtimeEvent.ts
        formatMessageTime.ts
        truncate.ts
  shared/
    components/
      Avatar.tsx
      IconButton.tsx
      Badge.tsx
      Skeleton.tsx
    styles/
      tokens.ts
      globals.css
```

## 11. 类型设计

```ts
type User = {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string | null;
  title?: string | null;
};

type AuthPayload = {
  token: string;
  user: User;
};

type Conversation = {
  id: string;
  name: string;
  type: 'GROUP' | 'DIRECT';
  avatarUrls: string[];
  memberCount: number;
  unreadCount: number;
  lastMessage?: MessagePreview | null;
  updatedAt: string;
};

type CreateGroupConversationInput = {
  name: string;
  memberUserIds: string[];
};

type Message = {
  id: string;
  conversationId: string;
  sender: User;
  body: string;
  type: 'TEXT';
  createdAt: string;
  quoteMessage?: MessageQuote | null;
  mentions: User[];
};

type MessageQuote = {
  id: string;
  body: string;
  sender: User;
  createdAt: string;
};
```

## 12. 测试设计

### 12.1 组件测试

- `ConversationListItem`：未读 badge、选中态、摘要截断。
- `AuthPage`：登录/注册模式切换、表单校验、提交 loading、错误展示。
- `MembersPage`：展示所有注册用户、搜索过滤、当前用户禁选。
- `CreateGroupConversationModal`：群名称校验、成员选择、提交状态和错误展示。
- `MessageItem`：当前用户右对齐、他人左对齐、引用摘要展示。
- `MentionDropdown`：过滤、键盘选择、点击选择。
- `MessageComposer`：Enter 发送、Shift+Enter 换行、引用预览清除。
- `useChatSocket`：能 decode protobuf `RealtimeEvent` 并分发到正确 cache 更新逻辑。

### 12.2 集成测试

- 未登录时展示登录/注册页。
- 登录成功后保存 token 并展示会话列表和默认会话消息。
- 点击 Members 后展示所有注册用户，且不出现好友相关文案。
- 选择用户创建群聊后，新群聊进入会话列表并自动选中。
- 输入消息并点击发送后调用 mutation。
- 收到 `message.created` 后消息追加。
- 收到 protobuf binary `message.created` 后能正确 decode 并追加消息。
- 点击引用按钮后 composer 出现引用预览。

## 13. 实现注意事项

- 不要把全部聊天页面写在一个大组件中。
- 不要让 Socket.IO 直接修改大量本地 state；优先写入 Apollo cache 或触发对应 query 更新。
- 不要在 UI 组件中直接 decode protobuf；decode 只放在 socket hook 或 realtime mapper 中。
- 不要在前端伪造最终消息 ID；可以使用 optimistic id，但后端返回后必须替换。
- Mention token 如果用 textarea 实现，start/end index 在中文和 emoji 下可能复杂；Demo 可只提交 selected mentioned userIds，并在渲染时按 `@displayName` 高亮。
- 头像资源可使用在线占位图或本地 seed URLs，不需要和 Figma 头像 100% 一致。
