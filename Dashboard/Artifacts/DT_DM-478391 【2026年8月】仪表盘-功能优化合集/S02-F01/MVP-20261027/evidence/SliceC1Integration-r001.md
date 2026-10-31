# C1 共同接线实施与聚焦自检 r001

记录时间：2026-10-27 05:29 UTC。状态：C1 Builder 实施候选已落盘，生产文件已冻结供 root 浏览器与独立 Validation；不声明真实图库 ready、后端数据正确、保存重开或 49 类型完成。

## 绑定与准入

Card canonical SHA `d9cd74990bdec698b306dfdf521b5f795360aeffeb90f96a2c2c623110d340ae`；Context `ContextBootstrap-S02-MVP-C1-INTEGRATION-BUILDER-r001.json` 校验 exit 0，25 个 required-read 实际 SHA 全匹配；11 个逐 target execution admission 均复验 exit 0，Topology r433。消费 UiIntegrationDesign-r002、ExecutionClarifications-r001 及第二轮独立审查：UIR-009 按 request.chartExtRequest 独立投影，UIR-010 按真实 A 身份/新 copy 联动事件，不伪造原始 token 逐轴独立。

本 lane 没有写 G2/S2/indicator 三个 SFC，它们由另一 Builder 负责；没有改 API B、冻结 Goal/Design/Cases/Review/fixture、旧 query helper、S01 或数据。没有安装、全量构建、启动服务、改运行参数、提交或推送。另有精确补卡准入的 A harness/B README 适配见 `C1HarnessAdaptation-r001.md`；A 原独立报告和 before 快照不回写。

## 真实调用与采用路径

1. 真实 Editor 的现 composable 保留 A flag/权限三态、完整树与目录、身份/session/TTL；通过全部 guard、非空目标确认后设置 busy，调用专用 `paste-chart-filter-${id}` request/reply。事件复用现 mitt，不写共享 Store 请求队列；只有当前编辑画布/当前目标且已接 C1 library 的 receiver 注册。取消 0 query，重复点击不取消第一次且不发第二次 query。未接 C2–C4 为明确 preparation_unavailable，49 分母未删。
2. 真实 wrapper 从 canonical view/element 与纯 filter(false,false) 捕获完整上下文：user/filter/linkage/outer/web/drill/resultCount/mode；不提前写 lastRequest 或 report window。view/element/scale/font/commonParams/disabled 及外部 context 用 flush:sync generation 检出变化后改回。普通 query/render 在触发/执行前使 paste 失效，真实 unmount/切目标/identity/new copy/TTL 均不可发布迟到结果。
3. clone candidate 只换完整 customFilter；S2 general pageSize 按现 pageInfo，非 general 删除 pageSize；stock-line 继续交 API B 原适配。严格 `getData(candidate,{reportOutcome:true})` 一次，采用 B.value DTO，不再猜 code/再解 envelope；匹配响应 id/type/render。calParams 预合并保留现 truthy 行为，0/false/空串不借本任务修正。
4. 通过 queried DTO 才创建一个隐藏但非零布局候选，同唯一 key/suffix；薄 FilterPasteRenderer 从第一次 mount 就传 pasteBinding。所有 view/element 父 props 与共享 shallowRef 同步；ready 调真实下层 prepareFilterPaste，不调用 calcData。薄父组件 onErrorCaptured 捕获子自身 render 错误；即使子随后报 ok，也返回失败并 dispose 迟到 handle；有限 timeout/error/unmount 结案。
5. ready 后重核 operation/原 target 引用/deep 快照/config/context/A token/clipRevision/TTL/权限。同步发布段仅本 operation 的内部写获短标记，finally 清除，不跨 await。完整树 clone 写 canonical；同 binding.current 切 active+canonical 引用；local chartExtRequest 与 lastRequest 各 clone **prepared.request.chartExtRequest**；按具体 metadata setter 分支落详情、钻取，以及 G2 origin 或 S2 pure/page/library instance；indicator 不新增这些附加写。最后同 key/node/handle 成为 active，chartComponent 指**真实下层 SFC public proxy**，不指 handle.instance；只记一次 recordSnapshotCache('calcData',targetId)，无第二 query/draw。
6. 旧节点按已有 unmount/幂等 dispose 清理。后续 child public proxy 更换会同步更新 wrapper；当前 canonical 后续普通换成未接图库时恢复旧原生分派，不能留空白。采用后的轴/样式/过滤/分页/undo-redo 的真实行为仍交完整验收，单纯 binding 相等不作为其运行证明。

旧 wrapper 的 query-data 在 nextTick 内用 useEmitt 注册会触发无 active instance 的 onBeforeUnmount 警告，无法保证解绑；实际 setup mount 测到后在同准入文件最小修复为显式 emitter.on、真实 unmount 同名 off，且 unmount 后的迟到 nextTick 不注册。没有建立通用事件治理框架。

## 实际检查与证据上限

- 改 wrapper 前实际运行 `node tests/filter-copy-mvp-paste/check.mjs --baseline`：exit 1，真实完整 SFC 先成功编译；AST 提取未改写的旧 calcData 执行体，在受控 renderer throw 前 lastRequest 写入 expected 0 / actual 1，指纹 `C1-OLD-ENTRY-PUBLISHES-BEFORE-READY`，execution_errors=0。这是旧入口语义观察，不是缺方法/编译失败，也不是完整冻结 MVP-UI 案例、真实后端故障或同函数 RED→GREEN；普通旧入口仍保留，新粘贴走专用链。
- `node tests/filter-copy-mvp-paste/check.mjs`：exit 0，8 组。完整真实 wrapper script 经 compiler-sfc 编译并由真实 Vue custom renderer mount，实际 composable、A service、C1 helper/emitter 与薄 SFC；API/Store/route/身份/权限/下层 renderer ports 为明确 doubles。无 wrapper 控制流复制。覆盖失败保旧、G2/S2/indicator metadata、query=1、ready前零写、same key/canonical/public proxy、深配置改回/context/真实A联动/new copy/TTL/unmount/普通刷新 discard、busy 第二 query 0、后续 proxy 更换/未接图库回原分派；实际 composable→emitter→wrapper 成功/业务失败/取消；真实薄 SFC 父错误边界捕获子 render throw，拒绝其返回的 ok 并销毁迟到 handle。own undefined 与缺键实际 isEqual 比较为 false；calParams truthy/falsy 保留语义实测。
- `node tests/filter-copy-mvp/check.mjs`：当前 C1 下回归 14/14、exit 0；环境没有 receiver，因此原 A 的明确不可用断言仍成立，不把这 14 组提升为真实粘贴验收。
- `node tests/filter-copy-mvp-api/check.mjs`：9/9、exit 0，真实 API 与 decoder、envelope/network 为 double；B 源码 SHA 仍 `9f160c78f24bf50be80c9510529682267530dcc28d203478074af4add865c74b`，未改。
- 七个 C1 生产文件定向 ESLint（helper/wrapper/薄SFC/composable/三locale），以及两个 runner 定向 ESLint，不带 --fix：exit 0。wrapper 与薄 SFC script/template 编译无错误。
- `stylelint src/views/chart/components/views/index.vue src/views/chart/components/views/components/FilterPasteRenderer.vue`，不带 --fix：最终 exit 0，只剩配置 deprecated 提示。root 真实冷重载曾发现本次新模板 prettier 5 处导致 Vite 500，已局部格式并复验 ESLint 0；之后真实冷重载又发现 inline style 的 position 应在 overflow 前，定向检查还发现 min-height 应在 overflow 前，最终仅交换本次属性顺序为 flex/position/min-height/overflow 后 stylelint 0。该真实问题归属本次新增块，未归为基线、未动全局布局或基线样式。
- 按当前 tsconfig options，以实际两 helper + global/model .d.ts 建 TypeScript Program：`isolated_helpers_diagnostics=0`，exit 0。不能代替完整 SFC/项目类型通过；全量 ts:check 先前的三处 .vue.js/allowJs TS6504 阻断未靠删产物/放宽设置绕过，本轮不重跑同一阻断。
- 本 lane 跟踪改动的定向 git diff --check：exit 0；未跟踪新文件通过对应编译/lint。独立全 diff/最终状态绑定另行完成。

这些检查没有真实后端/图库/DOM/save/reopen，8 组也不等于冻结 25 子案全部通过。真实三个 renderer 的具体 draw/render/layout/DOM ready、root 第一条 bar→line/table/indicator、独立 SQL oracle、每 type query/画面/保存/重开、C2–C4 和49范围都保持未由本报告验收。root 后续浏览器观察与其它 Builder 的 native SFC 检查不得重记为本 lane 自测。

## 稳定接口交接

`mvp-chart-filter-paste.ts` 已向 root/renderer Builder 消息同步：PasteInputs/PasteBinding、PreparedQuery、PreparedFilterPaste/PasteReady。handle.key=本候选 suffixId；binding 为同一个 shallowRef 包装；instance 仅库实例。metadata：g2 的 drillFilters/originData/publishOrigin，s2 的 drillFilters/pageInfo/publishPure，indicator 仅 drillFilters。薄 SFC expose component=实际下层 public proxy、prepareFilterPaste。PreparedQuery.request 为完整查询 ChartObj；只有其 chartExtRequest 投影进入两个 request-context 位置。

C1 receiver timeout 15秒、薄候选12秒；C2地图30秒预算须后续精确扩展，不把当前 C1 预算冒充地图完成设计。没有把 ViewMap/Tiny/picture 的字段声明当已接入。

## 本 lane 实际源码摘要

| 路径 | SHA-256 |
| --- | --- |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `f08ff2f6800eba2d07b2c8f4f161fce4c09f4bb7e9f6fabf73ad7ebac6f98e9d` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-paste.ts` | `b27d772ab4db73e50522561afa19f95deb74b1e1b1e02d98bd5814de05614331` |
| `core/core-frontend/src/views/chart/components/views/components/FilterPasteRenderer.vue` | `be1677c8b16ad3486aba08ebf5b6da19e169108b2caa774b27fc577ba9c11c78` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `fa77449b9888f7b4763c326aa05c115bd44a04a205703b5f5987b81f90a42cf1` |
| `core/core-frontend/src/locales/zh-CN.ts` | `0d84476059c64593f09cc9a21ec948978c0ffb89de5f1a4de010b94f8aef0aa6` |
| `core/core-frontend/src/locales/en.ts` | `9268f06433a52661d0239ac83fff84965390f9f95058446bf21be91d3b604289` |
| `core/core-frontend/src/locales/tw.ts` | `1076aa0aaf227de06ee2ffa2ae3b208254b5d02b053e0b346e65729e662ccff2` |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `ce2204514462fe08ccc8500e0cdd80c30c93c2314040d13e21d1af76ccc01a5c` |
| `core/core-frontend/tests/filter-copy-mvp-paste/README.md` | `a1e9e007b3841c3323a1c47c500a2f1c4c07fdbdabee995f38650e339f5aaf3a` |
