# 关键架构事实（均已实测，非文档推断）

课程中确立的、后续会反复引用的事实基线。任何一条若被新版本推翻，应新写记录并标记 superseded。

- 唯一源码是 `shared/`；`extension/`、`native-dist/`、`plugin/client.js` 全是生成物。
  `plugin/index.js` 是例外——手写的 Host 路由，与 `client.js` 同目录但来源不同。
- 控制器接缝只有两个注入能力：`assetUrl(path)` 和 `storage.{get,set,listen?}`。
  这是"新增背景类型可自动跑通三条路径"的前提。
- 已安装 Harness 0.2.1 的根 slot 只有 6 个，**没有 `shell.background`**；
  这正是 `harness-plugin/` 必须改源码的原因。
- 但第三方 npm 插件**可以**注册已存在的 slot：`dsh-model-visibility` 就在用
  `settings.section`。**配置管理不需要动 Harness。**
- 两套配置机制字段已漂移：`chatCustom`/`chatOpacity` 只存在于 bundle 路径，
  `quality` 只存在于源码注入路径。

## Evidence

通过 git blame 逐行统计、解包 app.asar 读 slot 声明、以及 grep 已安装第三方插件
三方交叉验证。浏览器实测了 blob URL 跨同源 iframe 可读、localStorage 6MB 抛
`QuotaExceededError`、IndexedDB 可存取 3MB Blob。

## Implications

第 4、5 课可直接基于这些结论设计，不必重新验证。但 `shell.background` 这条
要标记为"随时间可能变化"——若 Harness 未来公开该 slot，第 3 课的源码注入路径即可废弃。
