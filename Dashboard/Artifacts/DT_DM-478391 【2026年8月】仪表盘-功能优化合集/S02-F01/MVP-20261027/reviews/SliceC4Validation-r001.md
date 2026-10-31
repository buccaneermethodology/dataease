# C4 图片组与共同分派独立 Validation r001

结论：**PASS_WITH_BOUNDS**。当前 C4 实现交付物独立验证第 **1/3 轮**，未发现阻断级产品问题；有 1 项 P3 文档同步残余。允许推进 C4 的真实浏览器/后端/保存验收，不表示这些阶段已完成，不关闭 S02 或 MVP Goal。

- reviewed_at：2026-10-27T06:48:38.320169+00:00（UTC）。
- reviewer：`/root/g2_closeout_reviewer`，未编写 C4 生产源码或 C4 runner；曾编写冻结 C234 fixture，且为 C3 Builder，因此 C3 仅检查公共接口兼容，不计为 C3 独立 Validation。
- snapshot_id：`S02-MVP-C4-INDEPENDENT-VALIDATION-r001`；as_of_state：卡片绑定 `Topology-actual-r451.json` 及下列最终源码字节。
- Card canonical SHA：`f6c1fcbb9c1db376180fc3cc76fa0e66880dba1d2198b39d6f67778995a876d6`，实际 `lane_task_card.py validate --expected-card-sha256 ...` exit 0。
- Context 原字节 SHA：`239a07b0c2c819916e3a0bbfb079cfd4778bd9535294f26ad68bbd8c028f0216`；12 项 required-read 入场与落报告前均逐项匹配。下面生产与 runner 摘要与 Builder 报告冻结值一致，审查中未漂移。
- 本轮唯一写入：本报告。未修改源码、runner、fixture、冻结合同、旧报告、KB、Dashboard 状态；未安装、构建、启动应用、访问数据库或执行 Git 提交/推送。

## 本轮任务与原始目标

原始人类授权是开发环境显式三态权限桩下，全部受支持图表能进行基本多条件整树复制粘贴并走真实查询、正常保存、离开重开；同页面同编辑会话、内存与 30 分钟边界仍在。当前 Goal 的 22 项、原 26 身份/approved_deferred、49 内建类型、15 主 ID/25 子 ID 全部保留。C4 只负责真实图片组 Attr 入口、图片 prepared 消费及共同分派/query adapter，不以静态 OFF 分支或代表组件代替图片过滤正向或全类型验收。

已读原始用户范围 authority、Goal must-have ledger/完成规则、Design/Cases r002、第三轮设计审查、冻结 C234 fixture、C4 实施报告与 harness delta、C3 报告/接口，以及当前实现。检查完整图片/Attr 差异，并逐 hunk 比较 C1 final snapshot 与当前 wrapper/薄组件/helper/composable，保持旧 C1 报告的 as-of 结论不变。主要风险是图片尚未加载/解码即发布、静态图片假造查询 metadata、候选提前写共享状态、同 key 采用后读旧 clone，以及 adapter 把协议 double 绿扩大为真实库完成。

## 全部发现

### C4V-001 / P3 / non-blocking：当前 paste runner README 仍描述旧八组

- 位置：`core/core-frontend/tests/filter-copy-mvp-paste/README.md:11` 和 `:13`。
- 事实：README 仍写“覆盖八组”“八组”及“下层三个真实 SFC”；实际当前 runner 独立运行返回 13 组，C4HarnessDelta-r001 已正确记录新增 picture/rich/map gate/canonical rebind/missing prepare 共 5 组。
- 影响：从 README 单独进入的维护者会漏掉当前 C4 adapter 与新增故障回归；不会改变现有执行结果或导致产品发布提前成功。
- Root cause：runner 增域后，说明仍停留在 C1 时点。
- Disposition：交 Builder 同步当前 README；不回写旧 C1 冻结报告、不改案例身份/预算，也不要求新增运行验收。
- 同类残余：图片 README 与两份当前 C4 报告已准确声明四组/十三组和协议边界；未见其它同类计数误导。C3 报告是作者产物，未作为本轮独立通过对象。
- 修后预测：仅文案同步，无需重做本轮产品检查；当前 C4 有界结论已可继续真实 UI 验收。

Blocking findings：无。Questions requiring authority：无。Builder repair 必需项：无；C4V-001 为非阻断文档维护项。

## 独立执行结果

命令工作目录为 `core/core-frontend`，使用已安装依赖；原 runner 原字节未改。

| 独立执行 | 实际结果 | 证据上限 |
| --- | --- | --- |
| `node tests/filter-copy-mvp-picture/check.mjs --baseline` | exit 1；旧完整 SFC 编译/mount 成功后，fingerprint `PICTURE-METADATA-BEFORE-LOAD-DECODE`，expected writes=0 / actual=1、loaded=false / decoded=false；无 provider/编译执行错误 | 可信有界旧行为 RED |
| `node tests/filter-copy-mvp-picture/check.mjs` | exit 0，4 组 PASS | 真实图片 SFC prepared/condition mapping、真实 Attr setup；img/decode/Store/API/计时器 double |
| `node tests/filter-copy-mvp-paste/check.mjs` | exit 0，13 组 PASS | 实际 wrapper/composable/helper/事件控制流；下层 renderer ready 与 API/Store double |
| `node tests/filter-copy-mvp/check.mjs` | exit 0，14 组 PASS | 实际 A service/composable、production 编译分支关闭、Editor 编译；provider double |
| 定向 ESLint：9 个 C4 报告生产文件、picture/paste 两 runner | exit 0 | lint；无自动修复 |
| 定向 stylelint：wrapper、FilterPasteRenderer、图片 Attr/Component | exit 0，仅既有三条 deprecated rule 提示 | 样式检查 |
| 四 SFC 独立 parse + compileScript + compileTemplate，使用 bindingMetadata | exit 0，四个 PASS | Vue 编译；不是浏览器渲染 |
| C4 生产/runner 定向 `git diff --check` | exit 0 | 差异空白检查 |

另以 `node --input-type=module` 在内存执行不落盘的独立 probe：读取原 runner 字节，将其静态 import 等价改为动态 import、root 固定当前工作目录，然后仅在测试 double/调用端增补断言，未改生产控制流或持久 runner。

1. 图片缓存命中：img 构造为 complete=true/naturalWidth=64，decode promise resolve，全程不发送 load；真实 prepare 仍成功且 decodeCalls=1、监听先于 src。随后将共享 binding 设 active 并换成 canonical view/element 对象，Vue flush 后仍是同一个 img、decodeCalls=1、query 数不增加、共享写为 0。追加 probe 通过（该进程原 4 组 + 1 probe=5），不将其当冻结 Cases 新主子案。
2. receiver 拒绝：picture-on 分别设 dv.editMode=preview、showPosition=preview、curComponent.id=other，独立调用真实 receive；各 false、query/writes/snapshot=0、hasMvpPasteReceiver=false。追加 probe 通过（该进程原 13 组 + 1 probe=14），不等于真实多身份鉴权。

## 已检查无问题维度

| 维度 | 源码与运行交叉结论 |
| --- | --- |
| 真实 Attr 入口及纯目录 | Attr 直接复用同一 useChartFilterCopyMvp、内存 clipboard、Element/i18n；view 来自当前 canvasViewInfo。独立执行实际 setup，目录恰 1 次且 type=table-info，xAxis 保持、图表 query=0；源码未调用 onDatasetUpdate 或 snapshot/dirty。按钮三态、DEV 标识与禁用原因有实际模板落点，production disabled/unknown/deny 经 A runner 验证。可见性与真实交互尚未浏览器验 |
| 全分派与能力门 | 薄组件覆盖 g2/s2/indicator/l7/l7plot/rich-text/picture-group；map 仍派真实 G2 SFC。wrapper capture/query 前检查实际当前 public proxy.prepareFilterPaste，地图再核 canPrepare；缺端口与冷地图均 0 query，采用后 proxy 同样检查；plugin/unknown 拒绝并保留 legacy 分派 |
| queryPlan 与 exact clone | canonical view/element/context 均 clone；picture OFF 走 static-picture，query=0且不造 DTO/details/lastRequest/curFields；ON wire type=table-info/render=antv/resultCount=1，严格 B API 一次；验证返回 id/type/render 后 clone 恢复 picture-group/custom。rich 普通 1/custom、compare 保 77/all，chartExtRequest 的 user/resultCount/context 保留。共同 helper 与冻结 c34-interface 完全同字节 |
| 图片实际选择 | runner 执行原 initCurFields/conditionAdaptor 与从生产 TS AST 提取的完整 mappingColorCustom：6761→green，200/0→red，null→gray。字段映射、默认排序沿旧语义，未用常量假造选图 |
| ready 与失败 | 真实 SFC 先 load/error listener 再 patch src；检查 complete/naturalWidth/connected 和 decode。load 后 decode pending 不 ready、共享写=0；error/decode reject/timeout/unmount+late 均失败，listener/timer 清理，旧写入账本保持；合法 empty 不造图片事件。额外 cache probe 通过 |
| 候选副作用 | candidate 禁 calcData query、共享 setter、轮播/inner refresh、上传全局事件；本地 timer/nextTick 有 phase/liveness guard。薄 wrapper 的 forward 仅 active 可发；真实薄 SFC error boundary 拒绝“child render throw 后 prepare 假 ok”，迟到 handle dispose。C1 tooltip 修复与地图内部资源由其它 lane 负责，不在此重判通过 |
| 同 key/canonical 引用 | wrapper 用同 ShallowRef binding；active 同 key、下层 public proxy，不拿 library instance 充当端口。undo/redo 式 canonical view/element 对象替换的同步 watcher 即刻重绑，现 runner 通过；图片缓存 probe 又核激活后同 img，不二次 query/decode。不是完整真实 undo/redo 验收 |
| 发布清单与一次 snapshot | prepare 前 metadata setter=0；成功后 queried 分支 local/lastRequest 来自 prepared.request.chartExtRequest 的独立 clone、details 来自独立 response。picture 只有 queried 才写 fields；rich 按 metadata 写 fields/element 并在完成后通过独立 eventBus 通知；g2/s2/indicator旧分支各自限定 setter。snapshot(calcData,targetId)=1；publish 同步段无 query/draw，标记 finally 清理。仅保证准备失败保旧，不声称 Store 任意抛错的全局事务回滚 |
| stale/busy/会话 | deep/flush:sync 的输入与 context generation、identity/clip revision/TTL、target/unmount、普通刷新均作废；busy 第二次不 query。覆盖确认取消不 query；准备/查询失败不写 canonical，保留已发 query 记录；从 A 到真实 composable→emitter→wrapper 成功/拒绝分支已执行 |
| legacy 与未启用入口 | 无 binding 的 picture 原 calcData/renderChart/withInit 保留；原 native/plugin 模板及原默认 API 仍在；unsupported 类型采用后回 legacy 已跑。新 readonly/preview/非选中 probe 0 query；生产分支关闭入口/权限桩/目录请求由实际 production 编译 A runner 见证。不是全部旧产品回归 |

## 未检查原因、同类残余与准入预测

- 未执行真实浏览器 HTMLImageElement load/decode、可访问按钮交互、真实图片 URL/资产、像素/布局、后端 query/错误、保存离开重开、完整 undo/redo、移动/嵌入入口、真实权限身份、全 49 类型；本 lane 只有源码与组件/协议层授权，root 负责真实 UI。原有未验项保持 NOT_RUN/BLOCKED，不由此报告改为通过。
- C3 源码为本 reviewer 作者，本轮仅核公共 metadata/方法签名/adapter 兼容；rich adapter 两变体通过不构成真实 TinyMCE 独立通过。C2 地图库实现由 C2 Validator 验证，本轮只核 wrapper 分派/预热拒绝/metadata 边界。
- 未重跑全项目 TypeScript 或 build；已有报告记录基线 .vue.js/allowJs 问题，局部编译/lint不能替代类型全绿。未主动删产物、安装或扩大设置。
- 图片当前依赖 HTMLImageElement.decode；无 decode 能力会明确失败。此运行能力未在真实目标浏览器确认，因此不能给跨浏览器兼容通过结论。
- 未见其它 C4 产品阻断或同类候选共享写残余。C1 tooltip 问题的独立修复结论由其新冻结证据负责；不将本 C4 通过挪作该问题处置。

修后/后续准入预测：C4 在当前冻结字节与上述 claim ceiling 内可进入真实图片 ON 正向 query→可见选择→正常保存→离开重开；OFF 仅兼容分支。C4V-001 文案同步可独立处理。无需重启设计轮或修改冻结分母；若后续实现修复改变本报告绑定字节，按第 2/3 轮 delta 独立验证，不重置预算。最终 Goal 仍需 root 汇总其它 lane 和每 eligible type 的真实证据与最终状态绑定。

## Read Manifest（入场/写后摘要一致）

| 必读路径 | SHA-256 |
| --- | --- |
| `AGENTS.md` | `270940a30f462f2fb0c9a8cf2bbc1dd11750513d8f063ffc376e0e0a2640466e` |
| `.codex/skills/sge-governed-checkpoints/SKILL.md` | `c4d8463bc350c44ad600c92400f783c565b2e968720bfeed1df67a49112b8933` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `9368cbbd96fd81b44006d72ec9bcdd94b60fbb69812c3f31c65e366bf1956e53` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/MvpScopeAuthority-20261027.json` | `641dfa78e63b1d53e25c08ea5c71c4458c272399c749aa84f0dea63ab89023a4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationDesign-r002.md` | `ea2f947c370b554b8f9510d39924e1455c28705088bf4739df78c4725a034468` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiC234ConcreteFixtures-r001.json` | `cdec6ed17380d4cc62eba495c4edd785d12178fd4758a5cfb993dd530426f4d5` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/UiIntegrationDesignReview-r003-C234.md` | `5d4c26ebda1ba9847e19ea1d04caa82d26a54cee01685a167d8313aa3114f4b2` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceC4PictureAndDispatch-r001.md` | `9628f60bde60f9aeae1d797c2b397d7cef178b0402dfc853381af32ff6e7697e` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/C4HarnessDelta-r001.md` | `3c7e8195896f988aec8aa9004b1673512aaad6d7173bc991fd45b6b0cf6e00d6` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/evidence/SliceC3RichText-r001.md` | `d30f75f7851ba78484e53775d72be2e677168da8b2efa7a623186b703536d52b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/c34-interface-snapshot-r001.ts` | `d3ebbd6236bf832df6e3e9971841a9ee68300dfb9e31a015c1532b5dc46a3e9e` |

## 实际源码与 runner 字节（入场/收尾无漂移）

| 路径 | SHA-256 |
| --- | --- |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `7f5ce4037b3899b34b4546b53cf4f8278a09ec8fbd6501cd0b8202d42c07b5f1` |
| `core/core-frontend/src/views/chart/components/views/components/FilterPasteRenderer.vue` | `1c6708ef48bfa466c2d167fba010183792815f2dc7926ff9d163c19abb9fa985` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-paste.ts` | `d3ebbd6236bf832df6e3e9971841a9ee68300dfb9e31a015c1532b5dc46a3e9e` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `e31befa9b1888db6b87f8a28f9eed3f1c7a17d13aa394c1bdfcfddb054e2ca9e` |
| `core/core-frontend/src/custom-component/picture-group/Attr.vue` | `f270e42f10a25a84dfe1858596e583385793b2b69397fe1447547599246da9c5` |
| `core/core-frontend/src/custom-component/picture-group/Component.vue` | `acd9737cec09583f9a959e2782bbdab4fe503f4c4d35db07ca57e913f4a84f32` |
| `core/core-frontend/src/locales/zh-CN.ts` | `32af92a537d6cbc7e4155d084f0cc35b6afdfbe696a063a58ba787d876c11858` |
| `core/core-frontend/src/locales/en.ts` | `1809323f6282f08fc6c86fba5fae9659124db524f1da2fe9897c859e63a91a8e` |
| `core/core-frontend/src/locales/tw.ts` | `8827fff6250df55d81a5124aeadacde6a2560eeb8e582a7746a544032a8ef57b` |
| `core/core-frontend/tests/filter-copy-mvp-picture/check.mjs` | `0ca8d94665c6e0ab35b6be8274f0470786c9fb8e06a8384167becc540da1fb15` |
| `core/core-frontend/tests/filter-copy-mvp-picture/README.md` | `69466b0c2419c0bba2c73944fe6475e1c4ea053f791cfbd647887daea808ee56` |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `31ca929484c2f0d835156198166f545466a52f414d86e555c1db1e082117e416` |
| `core/core-frontend/tests/filter-copy-mvp/check.mjs` | `9409e6388d9989b2476f0b0f679cad5d60247741e82af2d5932d542b899a6989` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts` | `ca144eb978ba334c9ba71fc4c6c5d6cefcb4c025ecac15ff2a446f54e8c8cc79` |
| `core/core-frontend/tests/filter-copy-mvp-paste/README.md` | `a1e9e007b3841c3323a1c47c500a2f1c4c07fdbdabee995f38650e339f5aaf3a` |
| `core/core-frontend/src/custom-component/rich-text/DeRichTextView.vue` | `4122e4684425e211e09b3975ae3a4deba6d3d8031cabe25712b860c5ef465322` |

补充只读材料：c234-before-r001 与 c1-final-snapshot-r001 对应源码快照/manifest、当前 picture/paste README、B API getData 严格结果契约、snapshot record/普通 query 入口。上述历史快照均未回写。本报告本身摘要由落盘后只读重算并回传 root，不作自指绑定。
