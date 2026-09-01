# dsh-deepseek-balance 仓库与 Agent 维护规范（AGENTS.md）

> 本文件是本插件的**代码架构与维护硬性规范**。
> 所有 AI Agent 与人类贡献者在修改、重构或新增功能时，**必须严格遵守以下规则**。

---

## 1. 零单文件膨胀原则（Strict File Size Limits）

1. **单文件行数上限**：
   - 任何单个源码文件严禁超过 **300 行**。
   - 现有较大文件（如 `client.js`）后续迭代时**必须按组件拆分，禁止在单个文件末尾追加代码**。
2. **前后端职责与模块化目录建议**：
   - **后端入口 (`index.js`)**：保持极简（< 150 行），仅负责 Cordis 插件生命周期注入、RPC 频道绑定与事件驱动。
   - **后端解析与查询 (`parse.js` / `lib/balance.js`)**：专职负责 DeepSeek API 余额与用量数据解析、缓存与请求。
   - **前端入口 (`client.js`)**：仅做 Slot 注册与生命周期装配（< 100 行）。
   - **前端子组件 (`client/components/`)**：
     - `BalanceChip.js`：输入框底部/旁侧的常驻余额小胶囊。
     - `BalancePopover.js`：点击展开的详细余额浮窗/气泡卡片。
     - `UsageView.js`：用量明细与刷新状态组件。

---

## 2. 凭据安全与数据流铁律

1. **Key 不出 Host**：
   - DeepSeek API Key 必须仅保存在 Host 后端（从环境变量或 DSH 凭据库读取）。
   - **严禁将未脱敏的 API Key 返回给前端 Web**，前端仅接收已解析的数值（CNY / USD / 额度百分比）。
2. **事件驱动与防刷机制**：
   - 余额查询应具备防抖与智能刷新机制，避免在用户高频交互时过度请求 DeepSeek 接口。

---

## 3. 原生 ESM 与修改后自检

1. **零构建原生 ESM**：所有模块引用必须显式带 `.js` 扩展名。
2. **修改后门禁自检**：
   修改任何代码后，必须在插件根目录下运行以下命令：
   ```bash
   node --test test/*.test.js
   find . -name "*.js" -not -path "*/.*" -not -path "*/node_modules/*" -exec node --check {} +
   ```
