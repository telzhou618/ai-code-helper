# AGENTS.md

> 本文件供 AI 编程助手阅读。如果你刚接触这个项目，请先阅读本文档以了解项目背景、技术栈和开发规范。

---

## 项目概述

本项目是一个基于 **React + TypeScript + Tailwind CSS** 开发的智能客服前端应用。项目通过 Create React App (CRA) 初始化，主要功能包括：

- 左侧会话列表管理与新建会话
- 右侧聊天界面，支持用户与 AI 助手进行多轮对话
- 对接后端 SSE 流式接口，实时展示 AI 回复
- AI 消息支持 Markdown 渲染（含代码高亮、表格、列表等）
- 用户可对 AI 回复进行点赞/点踩反馈

原型需求参考根目录下的 `需求.md` 与 `原型图.png`。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19.2.4 |
| 语言 | TypeScript 4.9.5 |
| 构建工具 | react-scripts 5.0.1 (CRA) |
| 样式 | Tailwind CSS 3.4.19 + PostCSS + Autoprefixer |
| 图标 | lucide-react |
| Markdown 渲染 | react-markdown + remark-gfm |
| 测试 | Jest + React Testing Library (随 CRA 内置) |

---

## 项目结构

```
public/                 # 静态资源（index.html、图标、manifest 等）
src/
  components/           # React 组件
    index.ts            # 统一导出（barrel）
    Sidebar.tsx         # 左侧会话列表 + 新建会话按钮
    Header.tsx          # 顶部导航栏（标题、用户信息、退出）
    ChatArea.tsx        # 聊天消息滚动区域
    ChatMessage.tsx     # 单条消息（支持 Markdown、反馈、加载动画）
    ChatInput.tsx       # 底部输入框（含联网搜索开关、发送按钮）
    Footer.tsx          # 底部版权信息
  hooks/                # 自定义 Hooks
    useChat.ts          # 聊天逻辑：消息状态、SSE 请求、反馈、自动滚动
    useSessions.ts      # 会话管理：会话列表、当前会话、新建会话
  types/                # TypeScript 类型定义
    index.ts            # Message、Session、FeedbackType
  utils/                # 工具函数
    date.ts             # 相对时间格式化、ID 生成、memoryId 生成
  App.tsx               # 根组件，组合所有模块
  index.tsx             # 应用入口
  index.css             # Tailwind 指令注入 + 基础样式
  App.css               # CRA 默认样式（当前几乎未使用）
  App.test.tsx          # 默认测试（目前为 CRA 模板用例，已过时）
  setupTests.ts         # 测试环境初始化
  reportWebVitals.ts    # 性能监控
```

---

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm start

# 运行测试（交互式 watch 模式）
npm test

# 构建生产包（输出到 build/ 目录）
npm run build

# 弹出 CRA 配置（不可逆，谨慎使用）
npm run eject
```

---

## 代码组织与规范

### 1. 组件风格
- 全部使用函数组件，类型声明为 `React.FC<Props>`。
- Props 接口以 `组件名 + Props` 命名（如 `ChatMessageProps`）。
- 组件内部使用 JSDoc 风格的中文注释说明职责。

### 2. 状态管理
- 不使用 Redux / Zustand 等外部状态库。
- 状态逻辑按职责拆分为自定义 Hooks（`useChat`、`useSessions`），放在 `src/hooks/` 下。

### 3. 类型定义
- 所有业务类型集中放在 `src/types/index.ts`。
- 导出方式：`export interface Message { ... }`。

### 4. 样式规范
- 统一使用 Tailwind CSS 原子类进行布局与样式控制。
- 颜色主题以蓝/灰为主：`bg-blue-600`、`text-gray-800`、`border-gray-200` 等。
- 极少使用自定义 CSS（`App.css` 基本废弃）。

### 5. 导出规范
- `src/components/index.ts` 采用 barrel export，统一暴露各组件：
  ```ts
  export { Sidebar } from './Sidebar';
  ```

---

## 后端接口说明

### SSE 聊天接口
- **地址**：`http://localhost:8081/api/ai/chat`
- **方法**：GET（通过 `EventSource` 消费 SSE）
- **参数**：
  - `memoryId`（string）：会话标识，新建会话时随机生成
  - `message`（string）：用户发送的消息内容
- **示例**：
  ```
  http://localhost:8081/api/ai/chat?memoryId=24525399&message=你好
  ```
- **注意**：前端代码中该地址为硬编码，没有环境变量配置。若后端地址变更，需要修改 `src/hooks/useChat.ts` 中的 `url`。

### 其他功能
- 会话历史、用户信息、退出登录等功能目前**没有真实接口**，使用假数据或占位逻辑（`TODO` 注释标记）。

---

## 测试说明

- 测试框架由 CRA 内置，基于 **Jest** 和 **React Testing Library**。
- 现有测试文件：`src/App.test.tsx`，但内容仍是 CRA 模板示例（断言查找 "learn react"），**当前已不通过**，需要更新。
- 项目中尚无针对 `useChat`、`useSessions` 或 UI 组件的单元测试。
- 运行测试：
  ```bash
  npm test
  ```

---

## 安全与注意事项

1. **硬编码后端地址**：`http://localhost:8081` 直接写死在 `useChat.ts` 中，生产环境部署前务必改为可配置形式（如环境变量）。
2. **CORS 问题**：由于直接请求 `localhost:8081`，若后端未开启 CORS，浏览器会拦截请求。
3. **无身份认证**：目前接口调用未携带 Token 或 Cookie，若后端增加鉴权，需要补充请求头逻辑（注意 `EventSource` 不支持自定义 headers，可能需要改用 `fetch` + ReadableStream 方案）。
4. **输入安全**：用户输入仅经过 `encodeURIComponent` 处理，Markdown 渲染由 `react-markdown` 负责，默认已做 XSS 过滤。
5. **外部链接**：AI 回复中的链接已设置 `target="_blank" rel="noopener noreferrer"`，符合安全规范。

---

## 开发建议

- 新增组件时，优先在 `src/components/` 创建，并在 `src/components/index.ts` 中导出。
- 新增业务类型时，优先补充到 `src/types/index.ts`。
- 若需要新增工具函数，放到 `src/utils/` 下，并补充 JSDoc 中文注释。
- 修改接口地址或增加环境变量时，同步更新本 `AGENTS.md` 文档。
