# Slice C3 富文本 Builder 报告 r001

- 记录时点：2026-10-27T06:31:15.994947+00:00（UTC）。
- Lane：`S02-MVP-C3-RICH-TEXT-BUILDER-r001`；角色：fixture 作者兼 C3 Builder。
- 结论：C3 真实 SFC prepared 实现候选已落地，聚焦协议见证完成，可移交非作者独立 Validation。本文及作者自检不构成独立 Validation、真实浏览器验收或 Goal 终态。
- Claim Ceiling：C3 真实 SFC prepared 实现候选及 TinyMCE 协议 double 故障见证；不证明实际 TinyMCE 资产、后端或保存重开。

## Authority、准入与写域

原始用户意图和完整图表类型分母以绑定 Goal/Scope authority 为准；此 lane 仅实施富文本 prepared init/content 就绪和局部副作用隔离。初始生产写入暂停已遵守，主协调 Agent 明确放行后才修改生产文件。

- Card canonical SHA-256：`347ba4998678bf490be958eb6f7e412f564ebb1ec5e2c82f438fe41a3bfeab52`。
- Context：`planning/ContextBootstrap-S02-MVP-C3-RICH-TEXT-BUILDER-r001.json`，原字节 SHA-256：`7876278c1ac1d75c5a37561ac5dc4899c4c8b37592a2bd3c962bdd8fdf072f9e`。
- Actual topology：`planning/Topology-actual-r445.json`，SHA-256：`c801e00db4d0b1200c256368ce3cc2c45a07e5163600f2904a4b52436af829ee`。
- 入场 19 项 required-read 摘要全部匹配。4 份 `planning/s02-mvp-c3-rich-text-builder-r001-admission-{0..3}.json` 已逐 target 实际运行 `execution_admission.py --root <workspace> --action builder --target <exact-path>`，全部 exit 0；落本文前对 admission-3 再验证 exit 0。
- 收尾摘要复查：18 项仍与入场原字节相同；唯一本 lane 授权生产文件是预期 delta（旧 `e542502bf21ebb65bffa6aa4fe778735bd632b5a1cde704ecb3bcfdadeec8b18` → 最终见下）。未将此授权 delta 隐藏成入场原 SHA 匹配。

本 lane 只写以下四个文件：

1. `core/core-frontend/src/custom-component/rich-text/DeRichTextView.vue`
2. `core/core-frontend/tests/filter-copy-mvp-richtext/check.mjs`
3. `core/core-frontend/tests/filter-copy-mvp-richtext/README.md`
4. 本报告 `MVP-20261027/evidence/SliceC3RichText-r001.md`

未写共享 helper、composable、wrapper、其它 renderer、冻结 Goal/Design/Cases/fixtures、旧证据、KB、Coverage 或 Session 终态。未安装依赖、构建、启动服务、访问数据库、暂存、提交或推送。共享工作区已有其它 lane/用户修改，未覆盖或归入本 lane。

## 最终实现

`DeRichTextView.vue` 接收可选 `pasteBinding`、`view`，有效 element/view 从共享 `binding.current.value` 读取，保留原 `calcData/renderChart` 并 expose `canPrepareFilterPaste()`、`prepareFilterPaste(input, binding, isCurrent): Promise<PasteReady>`。

严格消费共享稳定富文本 metadata：`kind: 'rich-text'`、`drillFilters: unknown[]`、`fields: ChartViewField[]`、`innerType: string`、`render: string`。冻结接口 `c34-interface-snapshot-r001.ts` 摘要 `d3ebbd6236bf832df6e3e9971841a9ee68300dfb9e31a015c1532b5dc46a3e9e` 未变化；当前共享接口仍有这些字段，本 lane 未改其类型或实现。

- 从首次 mount 识别 candidate phase，不运行旧 `viewInit` 的全局副作用；不自行 query、不写 Store/canonical curFields/element、不发公开业务事件。
- 等真实 Editor `init` 后执行本次字段映射、格式化与 assignment；先监听 `SetContent LoadContent`，再 `setContent`，兼容同步和异步 content 事件。
- ready 同时要求 `editor.getContent()` 与实际 body.innerHTML 的规范化内容一致、body connected 且布局非零、实例存活及操作 current。`nextTick` 不替代 init/content 就绪。
- 10 秒 timeout、Editor Error/SkinLoadError/PluginLoadError/LanguageLoadError、remove、unmount/dispose 均显式失败；初始化 waiters 与内部 content wait 一并拒绝，迟到事件不能提升 ready。用 `richEditor === editor` 防旧 Editor 的晚到 init/remove/error 串用当前实例。
- 内容规范化只用于等值比较：去 Tiny 编辑 metadata/bogus、规范 CSS 与 block 间缩进。未用它替代 Tiny 净化，原 assignment、placeholder、href、formatter 语义保留。
- candidate 与 readonly pasted-view 禁止 `appearanceStore.setCurrentFont`；legacy 和用户实际编辑保留原字体选择行为。publish 后不偷偷补全局字体写。
- 原全局 `document.querySelectorAll('p')` 收敛到当前 Editor body / 当前 richRoot 的段落；实例持有 1 秒 timer，回调检查 alive/isCurrent，dispose/unmount 清理。
- candidate 不注册公开同资源 `fieldSelect` channel；active 只轻量注册该 channel，不再 setContent 初始化。eventBus 与 useEmitt 两套总线分别沿用其职责。
- 编辑交互在 init 后提供轻量安装 closure：candidate 不装全局编辑监听，active 才注册；均有 alive/phase guard 且可解绑。安装异常 warning 降级，不让同步发布因安装监听失败。
- active/canEdit/watch/fieldSelect/setEdit/calcData/renderChart 均有对应 phase/liveness guard；同实例激活后继续从 canonical 读取。无 binding legacy 路径保留正常 query/字段替换，并有聚焦见证。

## RED 与 GREEN 的同身份见证

以下命令均在 `core/core-frontend` 使用已有依赖执行。

```sh
node tests/filter-copy-mvp-richtext/check.mjs --baseline --before
node tests/filter-copy-mvp-richtext/check.mjs
node tests/filter-copy-mvp-richtext/check.mjs --types
./node_modules/.bin/eslint src/custom-component/rich-text/DeRichTextView.vue tests/filter-copy-mvp-richtext/check.mjs
./node_modules/.bin/stylelint src/custom-component/rich-text/DeRichTextView.vue
```

基线 runner 按 `c234-before-r001/manifest.json` 读取、重算并编译 mount 完整旧 SFC（SHA `e542502bf21ebb65bffa6aa4fe778735bd632b5a1cde704ecb3bcfdadeec8b18`），真实执行旧 viewInit/assignment/timer/channel。最终 runner 再跑 RED：exit 1，3 个语义失败、0 execution errors：

| 分支 | 实际失败 fingerprint |
| --- | --- |
| `MVP-UI-10-TINY-FONT` | actual `FixtureFont`，expected `FixtureOldFont`：候选改全局字体 |
| `MVP-UI-10-TINY-PARAGRAPH` | actual p.onclick 为 `event.stopPropagation()`，expected `oldClick()`：候选改旧段落 |
| `MVP-UI-10-TINY-CHANNEL` | actual insertContent 次数 2，expected 0：候选公开 fieldSelect channel |

这不是缺少新方法、编译错误或 mock 缺方法导致的 RED。GREEN 复用上述三个稳定身份，并覆盖以下 16 个分支；最终 exit 0，16 PASS / 0 semantic failures / 0 execution errors。

| 稳定分支身份 | 检查点 |
| --- | --- |
| `MVP-UI-10-TINY-FONT` | candidate 不改旧全局字体 |
| `MVP-UI-10-TINY-PARAGRAPH` | candidate 不改旧/无关段落与 timer 清理 |
| `MVP-UI-10-TINY-CHANNEL` | candidate 公共 channel 隔离 |
| `MVP-UI-10-TINY-INIT-CONTENT` | init 前不 ready，init 后字段映射/内容就绪 |
| `MVP-UI-10-TINY-TIMEOUT-LATE` | timeout 与迟到 init 不提升 |
| `MVP-UI-10-TINY-ASYNC-SETCONTENT` | 异步 content 事件就绪 |
| `MVP-UI-10-TINY-CONTENT-ERROR` | 内容阶段失败 |
| `MVP-UI-10-TINY-INIT-ERROR` | 初始化/资产错误 |
| `MVP-UI-10-TINY-UNMOUNT-WAIT` | unmount 终止等待 |
| `MVP-UI-08-ADAPTER-RICH-COMPARE` | compare 字段映射及 formatter |
| `MVP-UI-11-TINY-CANONICAL` | 激活后同实例 canonical 内容更新 |
| `MVP-UI-10-TINY-ALREADY-INIT` | 已初始化 Editor 的 prepare |
| `MVP-UI-08-DTO-TINY-EMPTY` | 空态 metadata/data |
| `MVP-UI-10-TINY-CONTENT-MISMATCH` | getContent/body 不等值拒绝 |
| `MVP-UI-10-TINY-STALE-CONTENT` | 操作失效后的晚到 content 拒绝 |
| `MVP-UI-15-TINY-LEGACY` | 无 binding legacy query/内容正常 |

runner 使用完整真实 compiler-sfc（inlineTemplate）及真实 Vue custom renderer；TinyMCE Editor/事件/connected body、DOM 与 Store 是明确的协议 double。真实 SFC/assignment/字段映射/formatter/ready 控制流未替换。输入是已冻结 `UiC234ConcreteFixtures-r001.json` 的 tiny-normal/tiny-compare；`mappingColorCustom` 是 unexpected-call stub，本 fixture threshold=false，不称覆盖阈值映射。Tiny 多事件 `.on('SetContent LoadContent')` double 按实际 Tiny API 拆分空格事件。

DOM shim 不等于真实浏览器 HTML 净化、Tiny serializer 或像素渲染。上述 16 项是原冻结主子案的 variants，不新增或替换原 15 主 ID、25 子 ID，不重置审查预算，不声称全部 25 子案通过。

## 其它聚焦检查

| 实际检查 | 最终结果与上限 |
| --- | --- |
| `check.mjs --types` | exit 0；真实项目 tsconfig/声明环境下此 SFC compileScript 虚拟源诊断 multiset：before 1 / current 1 / added `[]`。不是全项目类型检查通过。最初新增 EventTarget.closest TS2339 已用有界 `Element | null` 修正后复验无新增 |
| 定向 ESLint（上列 SFC + runner） | exit 0，无输出 |
| 定向 stylelint（上列 SFC） | exit 0，仅 3 个规则 deprecated 提示 |
| compiler-sfc parse + compileScript、inlineTemplate | exit 0，完整当前 SFC 编译成功 |
| `git diff --check -- core/core-frontend/src/custom-component/rich-text/DeRichTextView.vue` | exit 0 |
| 局部格式化 | 已有 prettier 仅格式本生产文件和本测试/README；无安装、无全量格式化 |

未执行全量 TypeScript、完整构建、真实 TinyMCE skin/lang/plugin 资产加载、真实浏览器净化/格式/布局/交互、后端取数、保存重开、移动端或嵌入运行、全部 49 种图表验收。真实 UI 与独立 Validation 由主协调 Agent 另行组织，不能将本报告补写为这些验证通过。

## 最终字节与交接

| 文件 | SHA-256 |
| --- | --- |
| `core/core-frontend/src/custom-component/rich-text/DeRichTextView.vue` | `4122e4684425e211e09b3975ae3a4deba6d3d8031cabe25712b860c5ef465322` |
| `core/core-frontend/tests/filter-copy-mvp-richtext/check.mjs` | `12d290a096250c9f823ae3fd45cd6356433a72c795be982da0641da36031766d` |
| `core/core-frontend/tests/filter-copy-mvp-richtext/README.md` | `e97bc39ac8e593025e178ef63ac00fe6984ebaeb739564c2b2f4c20d0f657a89` |

本报告自身摘要由写后只读核验回传主协调 Agent，避免自指摘要。后续非作者独立 Validation 应绑定这三个最终字节、当前 shared/wrapper 实际接线和原始目标，验证浏览器真实 TinyMCE 资产/内容与同实例发布；本 lane 不写 Stop Gate、不关闭 Goal、不晋升 Session/KB/Coverage。
