# Chat Demo 产品设计文档

## 1. 项目背景

本项目是一个demo，需要在 React.js、Node.js、TypeScript、MongoDB、GraphQL 技术栈下实现一个基础实时聊天 Demo。项目应展示候选人对前后端架构、实时消息、数据模型、接口设计、UI 还原和工程可维护性的理解。

当前仓库包含 `figma-design` 文件夹，设计稿主题是一个名为 `Gradual Community` 的社区聊天界面。设计重点不是完整社区产品，而是聊天模块中的会话列表、消息区、发送消息、引用回复、@ 提及和未读数。

## 2. 产品目标

1. 实现一个可运行的 Web Chat Demo，用户可以进入聊天页面、切换会话、查看历史消息、发送消息并实时收到新消息。
2. UI 尽量贴近 Figma：深色主题、左侧社区导航、中间会话列表、右侧聊天详情区。
3. 展示基础实时能力：消息通过 Socket.IO 在同一会话内广播，GraphQL 负责查询和变更。
4. 将可选能力中的未读数、引用回复、@ 提及纳入产品设计，作为推荐实现范围。
5. 实现轻量用户认证：用户名/密码注册、登录、退出登录；不实现邮箱验证、找回密码、复杂权限、文件上传、富文本编辑器、生产级通知系统。
6. 实时消息传递使用 Google Protocol Buffers 编码，后端接入 Redis 缓存。

## 3. 目标用户

### 3.1 Demo 使用者

面试官或评审者。评审者会关注：

- 页面是否接近设计稿。
- 聊天流程是否完整。
- 前后端是否真正联通。
- 数据模型是否合理。
- GraphQL 和 Socket.IO 职责是否清晰。
- TypeScript 类型是否完整。

### 3.2 产品内用户

模拟 `Gradual Community` 社区成员。用户需要：

- 快速看到有哪些聊天会话。
- 在 Members 中看到数据库里所有已注册用户，而不是好友列表。
- 看见每个会话的最后一条消息和未读数。
- 进入指定会话查看消息历史。
- 从注册用户列表中选择多人创建群聊。
- 发送普通文本消息。
- 引用某条消息回复。
- 输入 `@` 后选择成员并发送提及消息。

## 4. 产品范围

### 4.1 必做范围

- 聊天主页面。
- 会话列表。
- Members 用户列表，展示所有已注册用户。
- 创建群聊。
- 消息历史展示。
- 文本消息发送。
- Socket.IO 实时推送消息。
- Socket.IO 服务端推送消息使用 Protobuf 二进制 payload。
- 后端 Redis 缓存热点数据，并支持 Socket.IO 多实例广播。
- 用户注册、登录、退出登录。
- GraphQL 查询会话、消息、成员，发送消息。
- MongoDB 持久化用户、会话、成员关系、消息。

### 4.2 推荐实现范围

- 未读数：会话列表红色 badge 展示未读数。
- 引用回复：用户点击消息旁引用按钮后，输入框上方出现被引用消息预览，发送后消息中展示引用摘要。
- @ 提及：输入 `@` 或 `@关键字` 时出现成员候选下拉，选中后插入 mention token；消息持久化 mentions。

### 4.3 暂不实现范围

- 邮箱验证、找回密码、第三方登录。
- 复杂角色权限和后台管理。
- 多社区切换。
- 好友关系系统；Members 只展示所有注册用户，不表达好友关系。
- 文件真实上传。
- 图片消息渲染。
- 消息编辑、删除、撤回。
- 已读回执到每条消息级别。
- 推送通知。
- 移动端完整独立设计。

## 5. 核心用户故事

1. 作为访客，我可以输入用户名和密码注册账号。
2. 作为已注册用户，我可以输入用户名和密码登录聊天 Demo。
3. 作为社区成员，我登录后可以看到聊天模块，并默认打开一个会话。
4. 作为社区成员，我可以在左侧会话列表看到每个会话的标题、头像、最后消息摘要、最后消息时间和未读数。
5. 作为社区成员，我点击会话后可以进入该会话，看到最近消息，并且该会话未读数被清零。
6. 作为社区成员，我可以在输入框输入文本并发送，消息会出现在当前聊天区。
7. 作为社区成员，如果另一个浏览器窗口也在同一会话，发送消息后两个窗口都能实时看到。
8. 作为社区成员，我可以进入 Members 页面，看到数据库里所有已注册用户。
9. 作为社区成员，我可以从 Members 或 Chat 页面发起创建群聊，选择多个注册用户，输入群名称后创建群聊。
10. 作为新群聊成员，我可以在会话列表中看到新群聊，并进入聊天。
11. 作为社区成员，我可以悬停在别人的消息上，点击引用按钮，把这条消息作为引用上下文回复。
12. 作为社区成员，我输入 `@` 可以看到当前会话成员下拉，选择成员后发送提及消息。
13. 作为被提及者，相关会话未读数增加，并且消息内容中的提及文本有高亮样式。
14. 作为登录用户，我可以退出登录并回到登录页。

## 6. 信息架构

页面分为四个主要区域：

1. 全局顶部栏：搜索、时区、通知、帮助、当前用户头像。
2. 左侧社区导航栏：社区品牌、模块入口、Chat 当前选中态、底部 Powered by Gradual。
3. Chat 页面：会话列表栏、搜索会话、会话条目、未读 badge、选中态、创建群聊入口。
4. 聊天详情区：会话标题、成员数、消息流、消息输入器、引用预览、提及下拉。
5. Members 页面：所有注册用户列表、搜索用户、从用户创建群聊入口。

## 7. 页面和状态

### 7.1 默认聊天页面

- 默认选中 `Share Your Story` 会话。
- 左侧 Chat 导航高亮。
- 中间会话列表中 `Share your story` 条目高亮。
- 右侧消息区展示当前会话历史消息。
- 底部输入框可输入消息。

### 7.2 空状态

如果没有会话：

- 会话列表显示空状态文案：`No conversations yet`。
- 聊天详情区显示空状态：`Select a conversation to start chatting`。

如果某会话没有消息：

- 消息流中间显示：`No messages yet`。
- 输入器仍可用。

### 7.3 加载状态

- 会话列表首次加载显示 skeleton 条目。
- 消息列表首次加载显示 4 到 6 条 message skeleton。
- 发送消息时，输入框不清空失败内容；可以显示 pending 状态。

### 7.4 错误状态

- GraphQL 查询失败：显示局部错误提示和 `Retry` 按钮。
- 发送失败：消息输入区上方显示 `Message failed to send. Try again.`。
- Socket 断开：聊天标题下方或输入框上方显示 `Reconnecting...`，重连成功后自动消失。

## 8. 核心流程

### 8.1 打开页面

1. 前端检查 localStorage 中是否存在 access token。
2. 如果没有 token，显示登录/注册页面。
3. 如果有 token，通过 GraphQL `me` 查询当前用户。
4. `me` 成功后查询当前用户会话列表。
5. 默认选中第一个有消息的会话，优先选中 `Share Your Story`。
6. 查询该会话消息和成员。
7. 使用 access token 建立 Socket.IO 连接。
8. 加入当前会话 room。

### 8.2 切换会话

1. 用户点击会话条目。
2. 前端更新路由或本地 selectedConversationId。
3. Socket 离开旧 room，加入新 room。
4. 查询新会话消息。
5. 调用 `markConversationRead` mutation，把该会话未读数清零。

### 8.3 查看 Members 用户列表

1. 用户点击左侧导航 `Members`。
2. 前端切换到 Members 页面。
3. 前端通过 GraphQL `users` 查询所有已注册用户。
4. Members 列表展示头像、展示名、username、职位或 subtitle。
5. 搜索框按展示名或 username 过滤。
6. Members 页面不展示好友状态，不提供添加好友动作。

### 8.4 创建群聊

1. 用户从 Chat 会话列表顶部点击创建群聊按钮，或在 Members 页面选择用户后点击创建群聊。
2. 前端打开 `CreateGroupConversationModal`。
3. 用户输入群聊名称。
4. 用户从所有注册用户中选择至少 1 个其他用户。
5. 当前登录用户自动加入群聊，不需要在选择列表中再次选择自己。
6. 前端调用 GraphQL `createGroupConversation` mutation。
7. 后端创建 `conversations` 记录，类型为 `GROUP`。
8. 后端为创建者和被选用户创建 `conversation_members` 记录。
9. 创建成功后，新群聊出现在所有成员的会话列表中。
10. 创建者前端自动选中新群聊并进入聊天详情。
11. 被邀请成员如果在线，会收到 Socket.IO `conversation.created` 事件并刷新会话列表。

### 8.5 发送普通消息

1. 用户在输入框输入文本。
2. 点击发送按钮或按 Enter 发送。
3. 前端校验去掉首尾空格后不为空。
4. 调用 GraphQL `sendMessage` mutation。
5. 后端写入 MongoDB。
6. 后端通过 Socket.IO 向 conversation room 广播 `message.created`。
7. 前端收到事件后更新消息列表和会话列表最后消息。

### 8.6 引用回复

1. 用户悬停消息。
2. 消息右侧出现操作浮层，包含引用按钮。
3. 点击引用按钮后，输入区上方显示引用预览。
4. 引用预览展示原作者名和原消息前 80 个字符。
5. 用户输入回复内容并发送。
6. 后端消息记录保存 `quoteMessageId`。
7. 查询消息时后端解析 `quoteMessage` 摘要给前端。
8. 发送后清空引用状态。

### 8.7 @ 提及

1. 用户在输入框输入 `@` 或 `@Dar`。
2. 前端在光标附近或输入框上方显示成员候选下拉。
3. 候选项展示头像、姓名、职位或 subtitle。
4. 用户点击候选项或按 Enter 选中。
5. 输入框插入显示文本，例如 `@Darrell Steward`。
6. 前端记录 mention token：`{ userId, displayName, startIndex, endIndex }`。
7. 发送消息时将 mention userIds 一并提交。
8. 消息渲染时高亮 `@Darrell Steward`。

### 8.8 未读数

1. 用户不在某会话时，该会话收到新消息。
2. 后端更新该用户在该会话的 `unreadCount`。
3. Socket 广播会话更新事件给相关用户。
4. 前端会话列表 badge 更新。
5. 用户进入该会话后调用已读 mutation，badge 清零。

## 9. 业务规则

### 9.1 会话规则

- 会话可以是群聊或单聊，本 Demo 以群聊为主。
- 每个会话必须至少有一个成员。
- 会话标题展示 `conversation.name`。
- 成员数来自 conversation members 数量。
- 群聊创建时必须有群名称，群名称 1 到 60 个字符。
- 群聊创建者自动成为 `OWNER`。
- 群聊至少包含创建者和 1 个其他注册用户。
- 被选用户必须来自数据库里的注册用户列表。
- 会话列表只展示当前用户参与的会话，不展示所有群聊。
- Members 页面展示所有注册用户，不受会话成员关系限制。

### 9.2 消息规则

- 消息内容最大 4000 字符。
- Demo 仅支持 `TEXT` 消息类型。
- 消息发送成功后不可编辑、不可删除。
- 同一会话内消息按 `createdAt` 升序展示。
- 当前用户消息右对齐，使用绿色气泡。
- 他人消息左对齐，使用深灰气泡。

### 9.3 引用规则

- 只能引用当前会话内存在的消息。
- 如果引用消息不存在或不属于当前会话，发送失败。
- 引用摘要最多展示 80 个字符，超过显示省略号。

### 9.4 提及规则

- 只能提及当前会话成员。
- 同一条消息可以提及多个成员。
- 同一成员重复提及时后端去重。
- 提及信息用于渲染和后续扩展通知。

### 9.5 Members 列表规则

- Members 页面展示数据库里所有已注册用户。
- Members 不是好友列表，不展示好友、关注、申请状态。
- 当前登录用户也可以显示在列表中，但创建群聊选择用户时默认禁用或隐藏当前用户。
- 用户搜索支持展示名和 username。
- 点击某个用户可以查看基础信息；Demo 不要求实现个人主页。

### 9.6 未读规则

- 当前用户自己发送的消息不增加自己的未读数。
- 如果用户当前已打开会话，可以不增加未读数；为了简化，后端以 `markConversationRead` 为准，前端收到当前会话消息后立即调用或本地置零。
- 未读数上限显示为 `99+`。

## 10. 角色和身份

Demo 需要实现简单认证，使用用户名和密码即可。

### 10.1 注册

- 用户输入 `username`、`displayName`、`password`。
- `username` 必须唯一，推荐 3 到 32 个字符，只允许字母、数字、下划线和短横线。
- `displayName` 用于聊天中的展示名，推荐 1 到 40 个字符。
- `password` 最少 6 个字符。
- 注册成功后后端返回 access token 和当前用户，前端自动进入聊天页。
- 新注册用户应自动加入 Demo 默认会话，保证注册后有聊天内容可看。

### 10.2 登录

- 用户输入 `username` 和 `password`。
- 登录成功后后端返回 access token 和当前用户。
- 前端将 access token 保存到 localStorage。
- 之后 GraphQL 请求使用 `Authorization: Bearer <token>`。
- Socket.IO 连接使用 `auth.token`。

### 10.3 退出登录

- 用户点击顶部头像菜单中的 `Log out`。
- 前端清除 localStorage token。
- 前端断开 Socket.IO 连接。
- 页面回到登录页。

### 10.4 当前用户

- 当前用户由 access token 解析得到。
- 后端不再接受前端直接传 `currentUserId` 作为身份来源。
- 种子数据仍包含 Jenny White 等用户，并为这些用户设置默认密码，方便评审登录。

## 11. 种子数据建议

### 11.1 用户

- Jenny White：种子用户，默认密码 `password123`，头像可用占位图片。
- Devon Lane：普通成员。
- Darrell Steward：CTO@Apple，用于 @ 提及下拉。
- Jerry：Announcements 最后消息作者。
- Allen：Share your story 最后消息作者。
- Tim、Courtney Henry、Albert Flores、Darlene Robertson、Eric、Grace、Lynne。

### 11.2 会话

- Announcements：未读 3，最后消息 `Jerry: [File] Design Guideline.pdf`。
- Share Your Story：未读 6，默认选中，最后消息 `Allen: [Photo]`。
- General：最后消息 `Tim: If you want to learn more ...`。
- Courtney Henry：最后消息 `So, what's your plan this weekend?`。
- Albert Flores：最后消息 `What's the progress on that task?`。
- Darlene Robertson：最后消息 `Yeah! You're right.`。
- Design product：最后消息 `Eric: Yeah I know`。
- Product team：最后消息 `Grace: @Lynne have time to huddle?`。
- 用户创建的新群聊：会话名由用户输入，初始无消息，lastMessage 为空，所有成员 unreadCount 为 0。

### 11.3 默认消息

在 `Share Your Story` 中准备：

- Jenny White 发送绿色右侧消息：`If you want to learn from community builders & spur ideas from how others run virtual events, check out Vanilla Forums (11/17 - 11/18/20) for free.`
- Devon Lane 发送左侧消息：`Check out Vanilla Forums (11/17 - 11/18/20) for free.`
- Jenny White 发送引用回复：`Many thanks!`，引用 Devon Lane 的消息。
- Jenny White 发送普通回复：`I will take a look in case it's useful for us.`

## 12. 成功标准

### 12.1 功能成功标准

- 未登录时打开页面能看到登录/注册入口。
- 用户可以注册新账号，注册后自动进入聊天页并看到默认会话。
- 用户可以用种子账号或新账号登录，登录后能看到与 Figma 接近的聊天界面。
- 用户可以退出登录并回到登录页。
- 能切换会话并加载对应消息。
- Members 页面能展示所有注册用户，而不是好友列表。
- 能选择注册用户创建群聊；创建后群聊出现在所有成员会话列表中。
- 能发送消息，消息持久化到 MongoDB。
- 两个浏览器窗口打开同一会话时，任一窗口发送消息，另一个窗口实时出现。
- 引用回复可选中、预览、发送、展示。
- @ 提及可搜索、选择、发送、展示高亮。
- 会话未读数能展示并在进入会话后清零。

### 12.2 工程成功标准

- 前后端均使用 TypeScript。
- GraphQL schema 类型清晰。
- Socket.IO 事件契约有文档。
- Protobuf 实时协议有文档和 `.proto` 文件。
- Redis 缓存 key、TTL、失效策略有文档。
- MongoDB 模型支持核心功能。
- 密码哈希保存，身份通过 access token 传递。
- 前端组件边界清晰。
- 后端模块边界清晰。
- 至少有基础单元测试或集成测试设计。

## 13. 非功能要求

### 13.1 性能

- 首屏会话列表和首个会话消息在本地开发环境 1 秒内显示。
- 消息列表使用普通滚动即可；如果种子数据超过 200 条，再考虑虚拟列表。
- GraphQL 消息查询支持分页。

### 13.2 可维护性

- GraphQL 类型、前端 TypeScript 类型、MongoDB 模型字段命名保持一致。
- Socket.IO 服务端事件 payload 使用 Protobuf；Protobuf message 与 GraphQL 返回实体语义保持一致。
- Redis 只作为缓存和实时扩展组件，MongoDB 仍是最终数据源。
- 引用回复和 mentions 作为消息模型的一部分，而不是前端临时状态。

### 13.3 可访问性

- 所有按钮有 `aria-label`。
- 输入框支持键盘发送。
- 提及下拉支持上下键和 Enter 选择。
- 颜色对比度应满足深色主题可读性。

## 14. 路线图

### 14.1 第一阶段：MVP

- 静态页面布局。
- 登录/注册和 Members 注册用户列表。
- 创建群聊。
- 查询会话和消息。
- 发送文本消息。
- Socket.IO 实时消息。

### 14.2 第二阶段：增强功能

- 未读数。
- 引用回复。
- @ 提及。
- 加载、错误、断线重连状态。

### 14.3 第三阶段：测试和 polish

- 前端组件测试。
- 后端 resolver 测试。
- Socket.IO 集成测试。
- 响应式适配。
