# 教学工作笔记

## 学习者画像

- 仓库所有者，已经能独立完成「改开关 → 加测试 → 发包 → 装进桌面版」的完整闭环。
- 技术底子够：读得懂生成管线、CSS 层叠、Cordis DI。不需要科普式讲解。
- 明确说关心**结构性判断**：扩展该走哪条路、脱离上游要走哪几步。

## 偏好

- 交流与文档用中文。
- 要图。第一课起每篇都要有能独立看懂的架构图。
- 验证过的结论 > 记忆中的结论。凡是能看到活代码/实测的，一律实测后再写。

## 已确认的范围决定（2026-10-19）

- 教学材料放 `learning/` 子目录，不污染仓库根目录；`npm files` 白名单不含 `learning/`，不会进发布包。
- 「脱离上游」只教不动手：LICENSE 版权行是法律义务，必须先讲明白再让学习者自己决定。

## 已核实的事实（写课程时可直接引用）

实测于 2026-10-19，仓库 HEAD `136184a`：

- 上游 `d-dev0101/open-sea-skin` 的 `main` = `634583f`；本 fork **已包含**上游全部提交（`upstream ahead = 0`），本地领先 4 个提交。即：**当时是同步的，不存在落后的历史修复**。
- GitHub 上本仓库 `fork: true`，`parent/network = d-dev0101/open-sea-skin`。这是「fork 网络」标记，不是 git remote，删 remote 不会消除它。
- `dsh-backspace` 在 npm 上**返回 404，从未发布过**。但 `docs/dsh-plugin.md`、`README.md` 都写着让用户 `dsh plugin add dsh-backspace@1.2.5`。**这是文档缺陷**，课程里要点出来（也说明「独立发展」第一件实事是把发布链路打通）。
- 行归属统计（`git blame`，HEAD）：
  - `shared/skin-core.js`：`dd` 388 / `HTH` 263 / `代` 52 / `Max-Null` 46（共 749 行）——**这是唯一大量有你原创代码的文件**。
  - `shared/ocean.js`：`dd` 612 / `Max-Null` 18 / `HTH` 6 / `代` 1（637 行）——渲染器几乎全是上游的。
  - `shared/styles.css`：`dd` 366 / `HTH` 1（367 行）——样式表基本原封未动。
  - `plugin/index.js`：`代` 74 / `HTH` 5——Host 路由是上游写的。
  - 全仓库（含文档、vendor、生成物）：18759 行中 HTH 占 1928 行，约 10%。
  - **含义**：现在绝大部分代码仍是上游著作权。声称「不再署名」在当前代码比例下站不住；要么继续保留署名，要么用新实现替换到有实质占比。
- 安装的 Harness `0.2.1` 里 **没有 `shell.background` slot**。layout 只声明了
  `sidebar / main / rightbar / shell.bottom / shell.overlay / shell.leading`。
  这正是 `harness-plugin/` 必须打源码补丁的原因——第三方 npm 插件**无法**凭空注册一个宿主不存在的 slot。
- 但第三方 npm 插件**可以**注册已存在的 slot。实测已安装的 `dsh-model-visibility`
  就注册了 `settings.section`（`ctx.slots.inject("settings.section", ...)`），
  `dsh-rewind-plugin` 注册了 `plugins.bundle.config`。**这条结论对「配置管理」扩展最关键。**
- 第三方插件用到的 slot 名（从已安装插件反推）：`settings.section`（5 次）、
  `plugins.bundle.config`（2 次）、`sidebar.right.pane.tab`、`sidebar.panellist`、
  `shell.overlay`、`plugins.row.config`、`main`、`conversation.input.selector.context`、
  `conversation.input.dock`。
- 浏览器实测（Chrome for Testing，Playwright）：
  - 同源 iframe **可以** `fetch()` 父页面创建的 `blob:` URL → 返回 200 且内容一致。
    意味着「用户在宿主页选一个本地视频 → 子 iframe 播放」是可行的，不必把字节塞进 localStorage。
  - 4MB `ArrayBuffer` 经 `postMessage` 耗时 **1ms**（结构化克隆，同进程）。
  - `localStorage.setItem` 写 6MB 字符串 → **`QuotaExceededError`**。所以大资源**不能**走现有 localStorage adapter。
  - IndexedDB 存 3MB `Blob`（`video/mp4`）→ 读回仍是 `Blob`、`size`/`type` 正确、`URL.createObjectURL` 可用。**大资源应存 IndexedDB。**
- 本地 Harness Web（`127.0.0.1:62628`）返回 `401`，没有可读的 CSP 头；不要基于猜测写 CSP 结论。

### 玻璃 token 消费方实测（Harness 0.2.1，2026-10-20）

解包 `dsh-web-frontend/dist/assets` 后统计每个 token 被多少条 CSS 规则消费：

| token | 规则数 | 消费元素 |
|---|---|---|
| `bg-base` | 7 | 工作区、编辑器、背板 |
| `bg-layer-1` | 4 | **悬停预览卡**、输入框外壳、选中指示器 |
| `bg-layer-2` | 3 | **弹窗**、**浮动窗**、胶囊按钮 |
| `bg-layer-3` | 4 | 标签、按钮、输入框 |
| `bg-module-platform` | 2 | 标签页、中性标签 |
| `bg-overlay` | **0** | **当前前端完全无人使用** |
| `bg-multi-select` | 0 | 当前无人使用 |
| `specific-menu` | 1 | 媒体预览滚区 |

两个反直觉结论，已写进第 6 课：

1. `bg-layer-1` 不只是"卡片"，它同时画预览卡 / 输入框外壳 / 选中指示器，
   所以不能整体调暗，只能按语义保持不透明。
2. `bg-overlay` 是零消费的——插件为它精细计算透明度（`light + 0.10`，上限 0.96）
   在当前版本**毫无效果**。不要假设覆盖的 token 一定有用。

修复后的分层（`ELEVATED_ALPHA = 0.97`，沿用设置弹窗既有值）：
`bg-base` 跟随玻璃；`layer-1` / `layer-2` 固定 0.97；`layer-3` 及小控件跟随玻璃。

修复前实测：玻璃 72% 浅色 → 预览卡 0.72；深色 → 0.60；玻璃 40% 深色 → 0.40。
修复后三种情况统一 0.97。

## 待验证 / 未确认

- 视频壁纸在 Harness 壳层下的实际帧率与解码开销（需真机测）。
- `settings.section` 之外，`settings.general.item` 是否也允许第三方注册（原生集成里用过，但那是源码注入路径，不是 npm 路径）。
- Harness 未来是否会把 `shell.background` 做进公开 slot（若做进，源码补丁路径可废）。
