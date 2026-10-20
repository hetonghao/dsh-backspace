# Backspace 插件扩展 Resources

## Knowledge

### 本仓库自身（最高信任度：这是唯一的事实来源）

- [docs/architecture.md](../docs/architecture.md) — 仓库自带的架构说明。**先读这个。** 用 for：确认 `shared/` 是唯一源码、三条路径都是生成物、原生集成改了 Harness 哪几处。
- [docs/dsh-plugin.md](../docs/dsh-plugin.md) — DSH 插件安装与 profile 机制。用 for：理解 `cordis.patch.yml`、`dsh.client` 字段、Host 路由怎么被注册。
- [scripts/build-runtime.mjs](../scripts/build-runtime.mjs) — 生成管线的**真相**。比任何文档都准。用 for：确认某个文件到底是从哪复制来的。
- [scripts/build-dsh-bundle.mjs](../scripts/build-dsh-bundle.mjs) — `plugin/client.js` 的生成逻辑与内置 adapter。用 for：新增配置项时改哪里。
- [harness-plugin/README.md](../harness-plugin/README.md) — 源码注入路径（与 npm 插件路径不同）的说明与兼容基线。
- [CHANGELOG.md](../CHANGELOG.md) — 1.2.3 / 1.2.5 两次「玻璃统一」修复的来龙去脉，是壳层 CSS 脆弱性的证据链。

### DeepSeek Harness 官方

- [DeepSeek Harness 仓库](https://github.com/deepseek-ai/deepseek-harness)
  插件宿主本体。用 for：查 slot 契约、profile、插件管理器行为。
- [插件管理器文档（中文，dsh-v0.2.1-alpha.2）](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.1-alpha.2/packages/client/ui-plugin-manager/README.zh.md)
  用 for：确认「添加插件」对话框的包名/镜像行为、为何要求精确版本。
- [Cordis](https://github.com/cordiverse/cordis)
  DSH 的 DI/插件容器（`inject` / `apply` / `ctx.effect` 全部来自它）。用 for：理解 `ctx.effect` 的清理语义、`inject` 的服务依赖声明。

### Web 平台能力（决定「能不能做成壁纸/视频」）

- [MDN: WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
  用 for：判断一个动态背景方案在目标浏览器是否可行、降级路径怎么写。
- [MDN: color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
  用 for：理解现有「玻璃不透明度」和「对话面板独立背景」的合成原理——扩展新背景时大概率还要用它保持主题一致性。
- [MDN: 媒体容器格式](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Containers)
  用 for：视频壁纸选 MP4/H.264 还是 WebM，以及浏览器支持边界。
- [three.js WebGPURenderer 文档](https://threejs.org/docs/#api/en/renderers/WebGPURenderer)
  与 [TSL 节点文档](https://threejs.org/docs/#api/en/nodes/TSL)
  用 for：新增程序化背景（非视频）时的现成积木。
- [Three.js Shading Language Wiki](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language)
  用 for：TSL 语法与节点组合方式，写新着色器时查。

### 法律与许可

- [MIT 许可证原文（OSI）](https://opensource.org/license/mit)
  用 for：确认署名义务的确切措辞——**保留版权声明与许可声明**是硬性条件。
- [SPDX License List](https://spdx.org/licenses/)
  用 for：给自己的衍生作品选许可、写 `license` 字段。

## Wisdom (Communities)

- [three.js 官方论坛](https://discourse.threejs.org/)
  高信号，核心贡献者常驻。用 for：WebGPU/TSL 具体渲染问题、性能取舍。
- [DeepSeek Harness Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions)
  用 for：插件 API 变更、`ERR_PNPM_MISSING_TARBALL_INTEGRITY` 这类安装器问题的官方回复（`docs/dsh-plugin.md` 里引用的 #8294 就在这）。
- [GitHub topic: dsh-plugin](https://github.com/topics/dsh-plugin)
  同类插件集合。用 for：抄别人的 slot 用法、看社区惯例；也是发布后的曝光入口。
- r/threejs、WebGPU 相关 Discord
  用 for：非官方但活跃的排错互助。优先级低于官方论坛。

## Gaps

- **Harness 没有公开的「插件 slot 完整清单」文档。** 目前只能靠读 `dsh-client-ui-*` 包里的
  `children: { ... kind: 'single' | 'list' | 'keyed' }` 声明来反推（本课程
  `reference/harness-slots.html` 就是这么做出来的）。这是未来最大的不确定性来源。
- 没有找到官方的「主题 token 契约」文档；现有实现靠 `--dsw-*` 变量名约定 + 实测。
- 视频壁纸在 Harness 壳层下的性能基线没有公开数据，需要自己测。
