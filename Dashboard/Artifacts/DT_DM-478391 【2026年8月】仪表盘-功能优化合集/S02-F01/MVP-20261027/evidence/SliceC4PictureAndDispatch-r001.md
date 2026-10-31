# C4 图片组与共同分派实施证据 r001

记录时间：2026-10-27T06:17:33.309381+00:00。本记录是 Builder 实施候选与聚焦自检交接，不是独立 Validation、真实浏览器验收或 Goal 完成。原 Goal 22 项、49 内建类型与后续复杂责任的分母不变，Scope Delta: none。

## 准入与写入边界

主卡 `planning/s02-mvp-c4-picture-dispatch-builder-r001-card.json` canonical SHA：`635a787691bb0abd98fe30d06910a76c77cbf1caeafc58069e414e61f2388a6d`；绑定 Topology r440。接收端实际复验 card、ContextBootstrap 与 13 个逐 target admission，均 exit 0。恢复后再次复验通过。依据 UiIntegrationDesign-r002、UiIntegrationCases-r002、第三轮 C234 review 与 UiC234ConcreteFixtures-r001；fixture SHA：`cdec6ed17380d4cc62eba495c4edd785d12178fd4758a5cfb993dd530426f4d5`。

仅本卡内生产、图片 runner/README 与此报告；paste runner 另有 r443 增域及 C4HarnessDelta-r001 记录。未修改 G2/S2/indicator/rich-text SFC、冻结合同/fixture/旧 C1 报告、SDK/XPack、依赖或运行参数；本卡允许的 mvp-chart-filter-copy.ts 本轮没有新增修改。已有大量未提交改动保留，未暂存或提交。生产最后一次小修已通知 root，随后重新冻结。

## 实际实现

- 图片 Attr 使用同一个 useChartFilterCopyMvp、内存 clipboard、三态权限桩、默认 unknown、禁用原因与 DEV 诊断；真实按钮 testid 为 chart-filter-copy/chart-filter-paste。目录调用 getFieldByDQ 的 type=table-info，不调用原 onDatasetUpdate，不清轴、不 dirty、不发图表 query。
- 图片 Component 从 setup 读取可选 pasteBinding 的 view/element/phase。candidate 隔离 query、共享 setters、轮播、inner refresh 与全局上传事件。queried 输入恢复 picture-group/custom 后复用实际 initCurFields、conditionAdaptor、mappingColorCustom；静态输入复用原 withInit 首图，不伪造 DTO/fields。
- 真实模板 img 初始不挂 candidate src，先挂 load/error，再由 Vue patch src。ready 检查 complete、naturalWidth>0、connected 与 decode resolve；缓存命中同样检查。10 秒 timeout、error、decode reject、卸载或过时均失败并清理 listener/timer。合法 empty 不造图片事件；激活保留同节点并恢复正常可选计时器。
- 共享 PreparedMetadata 新增 rich-text（fields/innerType/render）与 picture-group（queried 与可选 fields）；PreparedQuery 保持 queried 的 response/request 与 static-picture.local 分支。FilterPasteRendererPublic 添加可选 canPrepareFilterPaste，binding 仍为同一个 ShallowRef。
- wrapper/薄组件支持 g2/s2/indicator/l7/l7plot/rich-text/picture-group；地图派到 G2 SFC，capture/query 前必须通过 active public proxy 的 canPrepareFilterPaste 基础设施门；不在 candidate 冷初始化。缺实际 public proxy.prepareFilterPaste 一律 preparation_unavailable、0 query，兼容 legacy 节点与采用后的薄节点，不检查 library instance。
- picture threshold OFF 为 static-picture，0 query、不写假的 details/lastRequest/fields；ON 克隆 wire request 为 table-info/antv/resultCount=1，严格 API B getData 一次，响应还原 picture-group/custom 后准备。rich 无 compare 为 resultCount=1/resultMode=custom，有 compare 保原值；地图 metadata 仍 kind=g2。
- 只有准备成功且复验通过才发布：完整 wire ChartObj 留在 PreparedQuery.request，local/lastRequest 仅独立 clone 其 chartExtRequest；rich 发布 curFields、element.propValue.innerType/render，再经独立 utils/eventBus 发 initCurFields，不混用 request/reply mitt。图片仅 queried 发布 fields。沿用同 key、同 node、下层真实 public proxy、一次 snapshotcache(calcData)、不二次 query/draw。
- 本轮回归发现 canonical view/element 被 undo/redo 式对象替换后，active binding 仍指旧对象；已有 flush:sync watcher 内对非内部 publish 重绑 active binding，保留 key/实例。该具体 bug 的 RED 为 C4-CANONICAL-REFERENCE-REBIND，修后同例 GREEN。

## 可信 RED 与当前 GREEN

`node tests/filter-copy-mvp-picture/check.mjs --baseline` 实际加载 manifest 绑定的旧完整图片 SFC，成功编译并由 Vue custom renderer mount。旧 calcData 在图片 loaded=false/decoded=false 时写共享 metadata：expected=0、actual=1；指纹 `MVP-UI-10-PICTURE / PICTURE-METADATA-BEFORE-LOAD-DECODE`，预期 exit 1。不是缺方法或编译错误。当前分支复用同 ID 的“load/decode 前 pending 且零共享写入”谓词；这是有界见证，不等于整个 MVP-UI-10 产品例验收。

恢复阶段为“缺方法先 query”新增真实 wrapper 回归：默认节点缺 public proxy.prepareFilterPaste 时 expected query=0、actual=1，指纹 `C4-MISSING-PREPARE-QUERIED`，exit 1；补前置 guard 后默认/采用后两阶段均 0 query、0新增 metadata/snapshot，现 runner exit 0。

本轮实际检查：

| 命令/检查 | 实际结果 | 证明上限 |
| --- | --- | --- |
| node tests/filter-copy-mvp-picture/check.mjs --baseline | exit 1，指定 metadata-before-load/decode RED | 旧 SFC 的有界语义反例 |
| node tests/filter-copy-mvp-picture/check.mjs | exit 0，4 组 | 完整实际图片 SFC + Attr setup；图片 host/decode/计时器/API/Store double |
| node tests/filter-copy-mvp-paste/check.mjs | exit 0，13 组 | 实际 wrapper/composable/emitter；renderer ready/API/Store double，详见增域报告 |
| node tests/filter-copy-mvp/check.mjs | exit 0，14 组 | A service/composable/Editor 回归；不把旧“无 receiver”场景当真实粘贴成功 |
| 定向 ESLint：9 个本轮生产文件、两个 runner | exit 0 | lint |
| 定向 stylelint：wrapper、薄组件、Attr、图片 Component | exit 0；仅既有 deprecated rule 提示 | 样式语法 |
| 4 个实际 SFC 的 compileScript + compileTemplate | 无 errors，exit 0 | Vue 编译 |
| TypeScript Program：两个 helper + models/types 声明，原 tsconfig options，筛 helper diagnostics | isolated_helpers_diagnostics=0，exit 0 | helper 局部类型；非全前端 types |
| 定向 git diff --check | exit 0 | 差异空白检查 |

图片四组具体覆盖 6761→green、200/0→red、null→gray（真实 conditionAdaptor/default 规则），load 后 decode 前 pending、监听先于 src、OFF/empty、error/decode reject/timeout/unmount+late，以及真实 Attr setup 的纯目录与不改轴。mappingColorCustom 通过生产 TS AST 取完整原函数执行，没有重写分支。

## 当前源码绑定

以下 SHA 为本报告时点文件字节；wrapper/locale 含前序 A/C1 等共享内容，不把整个文件归为本 lane 独有。

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

## 未验证与下一步

全量 TypeScript 先前受既有 .vue.js/allowJs TS6504 阻断；未为通过检查扩大 allowJs、删产物或安装依赖，本轮只复验局部 helper。未在本 lane 操作真实浏览器图片资产/HTMLImageElement 解码、地图 SDK、TinyMCE、后端成功/拒绝、数据库、实际 49 类型、权限身份或保存重开。root 的真实 UI/CSV/保存证据由 root 单独记录，不能归作本 lane 实跑。

C2/C3 renderer 能力由各自 lane 交付，公共 adapter 的 double GREEN 不证明其真实库 ready。当前只能交接 C4 实施候选；下一步由独立 Validator 绑定上述 landed bytes 并检查原合同，由 root 完成真实图片 asset/query/保存离开重开及其他未验入口。原 C1 as-of 报告不回写。
