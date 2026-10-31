# G2 所有权工程收尾独立对账 r001

## 裁定与审阅时点

**`PASS_WITH_BOUNDS_FOR_ENGINEERING_CLOSEOUT`：有界工程收尾通过；父 Goal 必须继续。** 本结论仅接受已返回实例 helper、普通 line 实际 SFC 接线及其证据/声明一致性。没有发现阻断该工程单元的新增缺陷；有一项非阻断台账导航残余，见 CR-001。产品 Copy/Paste 界面 MVP、完整 stage/query/Store、真实权限、保存重开和 S02 Goal 均未获验收。

- Reviewer/source：`/root/g2_closeout_reviewer`，本报告唯一独立来源。我没有编写被审源码、测试器、Design、旧 Validation、closeout、Sessions、快照或 root 浏览器记录；本轮只写本文件。
- `reviewed_at`：2026-10-27 01:27 UTC；`snapshot_id`：`g2-ownership-final-snapshot-r001`。这是对冻结包的 post-closeout reconciliation，不预判本报告之后的 Gate。
- canonical Card `9c494615c5817042c82f120282caaac9d1dae37403dc72cb1f73463b2c707428` 接收端复验 pass；Context `ef82b7235d5f488c541690be0288dd5d4734805081b594b13e70bfb13ac211ef` 校验退出 0，30 项 required-read 摘要全部匹配。Topology r398 的 `89b6f459…` 是同一卡片原字节摘要，与 canonical 摘要口径不同，已独立重算，不判为 drift。

## 全量核对矩阵

| 检查域 | 实际结果与证据上限 |
|---|---|
| 原始意图与完整分母 | 核对[UserIntent](../planning/UserIntent.md)、[先 MVP 授权](../planning/MvpFirstAuthority-20261025.json)、[当前 Goal](../Goal.final.json)。ledger 实数为 26：10 项 Goal AC、16 项产品义务，全部 pending。调整仅实施顺序，未删权限、复杂场景或完成谓词。 |
| Design 与原残余 | [所有权终审 r003](G2StageLifecycleOwnershipDesignReview-r003.md)允许在 runner/RED/独立验证及精确 admission 满足后实施，无需第 4 轮。旧[产品接线 r003](ChartFilterCopyProductIntegrationDesignReview-r003.md)和[事务合同 r003](ChartPasteTransactionalPreviewDesignReview-r003.md)仍 NEEDS_REVISION；本单元没有翻转它们。 |
| 完整实现快照与差异 | [manifest](../planning/g2-ownership-final-snapshot-r001/manifest.json)9 项逐一重算当前文件、after 副本和存在的 before 副本，全部匹配；重建[完整 patch](../planning/g2-ownership-final-snapshot-r001/implementation.patch)与冻结文件逐字节相等（106247 字符）。1 项 tracked 修改、8 项 untracked 新增，未遗漏新增内容；SFC 写前字节可读。范围是本单元完整差异，不是整个 dirty 工作区归属认定。 |
| helper 与修复 | 当前 helper `7ff0a6d2…`对应[独立 Validation r002](G2OwnershipHelperValidation-r002.md)。本 reviewer 实际重跑原 23 例及重入 10 例，分别 23/23、10/10，exit 0、0 assertion failure、0 execution error。r002/r003 的 helper cases 内容完全相等。HV-001 同 key 重入释放已闭合；未把无限自重入回调硬化扩为当前 blocker。 |
| 实际 SFC | 当前组件 `f3bf70c9…`、runner `4cf0933a…`与[组件独立 Validation](G2OwnershipComponentValidation-r001.md)一致。本 reviewer 重跑实际编译 SFC 的 C01–C06 为 6/6，R013 为 8/8，0 failure/error；编译 bundle `a60921e9…`一致。G2/API/Store/DOM 等为显式 doubles，结论限生命周期控制流。 |
| 生产行为边界 | 检查 helper、SFC 对写前基线的全部变更：ready 后发布、version/scope/instance guards、cleanup 错误出口、卸载 observer finally、line/legacy 分支及显式空数组。没有把 calcData 或 L7 实现改为 stage；没有自动增加产品成功、保存或权限能力。定向 `git diff --check` exit 0。 |
| root 浏览器证据 | [15 步原始 JSON](../planning/evidence/G2OWN-BrowserObservation-r001.json)的源文件摘要全部匹配；读取逐步累计计数及两张冻结图像。[ready](../planning/g2-ownership-final-snapshot-r001/browser-ready.jpg)显示真实双系列折线；[tooltip](../planning/g2-ownership-final-snapshot-r001/browser-tooltip.jpg)可见 4月/36/23。最终 11 创建/11 销毁、canvas 0。它仍是 root 观察，未被改称独立完整验收。 |
| 最终状态面 | 实际[closeout](../G2OwnershipEngineeringCloseout-r001.md)和[Sessions r147](../Sessions.md#r147普通-line-所有权工程结果与最终依赖绑定)均保持 doing/有界通过/Goal 未完成，明确 G2OWN-027、source READ 与权限未运行，不夹带产品 MVP 完成声明。历史表头导航问题见 CR-001。 |
| BDD/KB/拓扑 | unit/seam runner 与手工浏览器夹具没有接入维护型产品验收 gate；接受本单元 BDD no-op 理由，若后续提升为 non-unit 产品 gate 则须重新判断。未生成新稳定产品规则，KB 不变合理。独立 Builder、既有 Validator、本最终 reviewer 与 root 手工观察角色分离；不声称有不存在的 Session registry 程序校验。 |

上述运行均在 `core/core-frontend` 使用已安装依赖：`node tests/g2-render-ownership/check.mjs --mode green`、`node tests/g2-render-ownership/reentrant-replace-check.mjs`、`node tests/g2-render-ownership/component-check.mjs --mode green`。不改源码、runner、Cases 或原始日志；没有安装、构建整包、启动数据库或调用权限服务。

## 独立浏览器抽样重放

本 lane 的浏览器视域没有父 lane 所述旧 tab，因此在同一 `http://127.0.0.1:7093/` 新建隐藏观察页，使用 CUA 可见按钮执行并逐次读取实际页面 DOM；没有调用页面私有状态或相信 root 汇总。

| 动作后 | 实际可见状态 |
|---|---|
| 渲染 O | O-1 ready/published，created=1、destroyed=0、canvas=1。 |
| 延迟 N | O-1 disposed/destroyed=1；N-2 waiting:N、render 已结束、afterRender 未结束；activeId=null，created=2、destroyed=1。 |
| 卸载 | mounted=false、generation=3；N 尚在等待且 canvas=1，未谎称物理取消进行中的 Promise。 |
| 释放 N | N-2 stale，afterRender 后逆序 cleanup、真实 destroy 各一次；没有 publish；activeId=null、created=2、destroyed=2、canvas/slot=0、pendingN=[]、cleanupErrors/runtimeErrors=[]，页面运行错误为“无”。 |

这条独立重放支持 helper 与真实 G2 的迟到卸载行为。root 的 legend/tooltip/resize 全序列本轮仅做原始记录/图像核对，没有逐项独立重演；未将抽样提升为完整 DataEase renderer 或产品浏览器验收。

## 全部发现、残余及未检查

**CR-001 / P2 / NON_BLOCKING_FOR_THIS_UNIT：Sessions 开头“现态”总表/DAG保留旧的统一产品准入门槛。** [Sessions](../Sessions.md)第 15–40 行仍将 S01 独立终态与真实权限环境并列为全部 S02.4 产品 Builder 的统一前置，并称该边未开放；当前 Goal `sections.entry`及后附 r144/r147 已允许绑定 S01 CONDITIONAL/逐条不依赖映射后先推进界面 MVP。旧表不能继续被当作全 Goal 停工依据。该残余不否定冻结所有权工程，也没有发生本轮缩减验收；后续执行记录应明确以当前 Goal/后附授权为路由，待下一次合法状态面更新时修正总表投影，不能改写历史授权或重置预算。

**其他新增合同内阻断：无。** G2OWN-R012 的 runner 通道修复已由独立报告与当前执行结果承接；R013 的 missing/null/non-array 经实际 SFC 边界测试可区分，真实后端输入分布仍未证明。旧 helper identity 绑定 `d31e…`的 GREEN 仍是历史，当前结论使用 `7ff0…`独立重跑，不追认旧日志。

同类剩余义务全部继续开放：G2OWN-027 返回句柄前 partial allocation；CFPI-001/002/003/004/005/006/007/009/010/011；CTPR-R3-001/002/003；AM-09、S01 既有组件复制/改类型回归及其条件。helper 的 empty 结果仅处理活动普通 line，不能关闭 stage empty commit/abort 合同；画面成功不能代替 Store/事件一致性。

未检查：真实产品 Copy→Paste→预览→显式保存→离开重开、真实 line renderer/所有 adapter 的完整浏览器组合、stage host 交接/原子 publish、跨标签会话与真实可信时间、其它图表和查询组件、真实身份/撤权/组织隔离、完整前端类型检查及多 Profile 构建。原因分别是当前工程合同尚未实现这些入口、真实权限能力未提供或本 lane 非整包验证；没有将它们标为通过。浏览器夹具 tsc 的已知依赖声明不兼容失败继续保留，未升级依赖掩盖。

## 必须继续的下一入口与准入预测

**权限缺失和旧 3/3 预算都不构成停止全部必要 MVP 工作的理由。当前存在已授权且可安全推进的非权限前置，下一步不能仅写“等维护者”。**

精确 next action：在 S02.1 先冻结“普通 line allocation 异常安全与 Carousel 构造/清理 owner”的独立设计，承接 G2OWN-027：逐个登记 new Chart、line hooks、Carousel constructor/init/start 的资源取得与失败释放，原异常和 cleanup 错误分通道；加入 constructor 在登记 cache 前失败及后续安装失败的可信 fault-injection oracle。独立设计审查、可信 RED 与精确 admission 满足即由独立 Builder 实施。不接成功 Copy、不改活动过滤树、权限或自动保存，复用当前 helper。随后继续 string host→独立容器映射、显式 empty stage、双 host、active/stage queue/resize/unmount 与 adopt/abort 合同和验证；再处理 query/Store 隔离。这些必要 MVP 前置不需要 source READ 成功 oracle。

源码依据：

- [line.ts:102](../../../../../core/core-frontend/src/views/chart/components/js/panel/charts/g2/line/line.ts#L102)在无行数据时返回 undefined；[138–151 行](../../../../../core/core-frontend/src/views/chart/components/js/panel/charts/g2/line/line.ts#L138)先 new Chart、绑定 legend/事件、启动 Carousel 再返回，没有异常回收边界。当前 helper 只在 create 返回后取得实例，不能补偿此段 partial allocation。
- [SFC:830](../../../../../core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue#L830)的 create 仍直接调用实际 drawChart；[869/887 行](../../../../../core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue#L869)的 installer 在 disposer 返回前也未由 scope 拥有。当前 `myChart/activeG2Scope`是活动单实例，尚无 stage host API。
- [G2TooltipCarousel.ts:91](../../../../../core/core-frontend/src/views/chart/components/js/G2TooltipCarousel.ts#L91)先 `init()`（134 行）再 `instanceCache.set`（135 行）；`init→addEventListeners`（447–486 行）已注册 DOM 事件/IntersectionObserver。`destroyByContainer`（432 行）只查 cache，因此只在线 drawChart 外 catch 后调用它，不能覆盖 constructor 在 init/observe 后、cache.set 前抛错的资源。须在构造侧拥有未登记实例的清理能力。
- 下一依赖随后是 CFPI-011 的响应准备/原子发布：[calcData:548](../../../../../core/core-frontend/src/views/chart/components/views/components/ChartComponentG2Plot.vue#L548)在 render 之前写 chartData、drill 与 details/origin Store 并发出 chart-data-change（563、594–599 行）。不能在旧活动树上直接调用它冒充 staged preview。须逐项冻结成功 commit 等价副作用和 abort 零副作用，再接产品事务边界。

这是旧终审明确允许拆出的必要工程依赖，实际输出和验收面不同；不修改或重开旧产品/事务/所有权 Design r003，不以新名称重复同一合同的第 4 轮。若该独立 stage owner 再暴露未知，可继续精确源码设计与证据准备，不能伪造 Builder READY。

必须等待外部能力的动作仍明确限于[必要能力记录](../planning/RequiredCapability-MvpSourceRead-r001.json)：真实成功 Copy 的 source READ 判定、source/target/dataset 权限与受限用户/撤权/组织隔离验收，以及据此声明产品 MVP/完整 Goal 通过。维护者需提供授权权限实现来源或真实多用户隔离实例及安全凭据定位；已有账号设置授权持续有效，不重复征求。standalone/admin/mock 不能替代这些证据。

父 Goal 继续进行；本报告可绑定工程结果 wrapper/后续 state，然后按预先固定 authority 运行新 Stop Gate 并只读回验。不得把本有界通过写成 `GOAL_COMPLETE`、产品 MVP 已验收或 S10 就绪。
