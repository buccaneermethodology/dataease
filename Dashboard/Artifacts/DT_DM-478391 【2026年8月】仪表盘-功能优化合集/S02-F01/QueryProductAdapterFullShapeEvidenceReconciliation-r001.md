# R4 全形态设计证据增量对账 r001

## 结论与范围

本记录将 FullShape Design Review r001 的 R4FS-001..005 与其后已完成的 SH-SELECT-TEXT 子切片证据逐项对照。结论是**局部证据有增量，五项 finding 均不能在 R4 全形态层面关闭**；不重开 FullShape Design Review，不改变 10 项 Goal AC、26 项 must-have、16 项产品义务及 `Scope Delta: none`。

本记录是控制面证据对账，不是新的产品设计冻结、Builder 准入或 Goal AC 验收。子切片的局部 harness / component GREEN 只支持其明确列出的输入和观察范围。其他查询形态、产品合法性、保存/恢复、身份权限与目标提交保持未验证。

## 当前权威与前置边界

- Authority Materials 主包仍是第 3/3 轮 `NEEDS_REVISION`（AM-09）；审后更正 r002 的 `PASS_WITH_BOUNDS` 只适用于更正记录。主包不再开启第 4 轮。
- S01 F01 Entry Packet 为 `CONDITIONAL`。真实多用户权限模块/隔离环境为 `BLOCKED / NOT_RUN`；只读用户拒绝、撤权及恢复未验证。
- 原始分母为 10 / 26 / 16，`Scope Delta: none`。16 项产品义务仍为 `NOT_RUN`。
- `ChartFilterPayloadDesign-r003` 已到第 3/3 轮 `NEEDS_REVISION`，不可重开或据此实施图表载荷 helper。

## R4FS finding 对账

| Finding | 后续证据 | 当前处置 | 未关闭原因与影响 |
|---|---|---|---|
| R4FS-001 合法 shape/axis 分母未定义 | `QueryProductAdapterSelectTextSourceLegalCombinations-r001` 与独立 Review r001 列出 41 个局部行：16 validator accepts、6 rejects、13 source observations、6 NOT_READY。各行 `product_legality=NOT_READY`。 | **局部补充；全形态仍 OPEN** | 41 行刻画的是 Select-Text 当前局部 validator/source 观察，不是产品可承载的完整合法组合；其他 6 种 shape 及跨轴交集仍未知。不能由这些行冻结全产品 shape 分母。 |
| R4FS-002 producer→config→consumer→save/load/history 来源链不完整 | `QueryProductAdapterSelectTextSourceTrace-r003` 和 `QueryProductAdapterSelectTextSourceTraceReview-r003` 完成有界源码追踪；另有 source handler / saved-owner 局部追踪与对应复核。 | **局部补充；全链仍 OPEN** | 已有部分创建、确认、运行 consumer 与保存 owner 静态定位；局部 AST/helper harness 不等于真实目标配置的保存、API 回读、重开或 history 全链。其他 shapes、完整嵌套闭包与历史缺省仍未证。 |
| R4FS-003 全形态 Cases 不可执行且 oracle 不完整 | SH-SELECT-TEXT 局部 22 项 validator harness、ST-SRC-001 CREATE、ST-SRC-002..005 handler、ST-SRC-006 handler、QOBS-ASYNC-01 组件状态交错均有各自的执行记录/独立验证。 | **选择器局部有执行证据；全形态仍 OPEN** | 局部 Case 身份及 oracle 不扩展到数值、文本搜索、时间、树、级联、参数或保存恢复。16 项产品义务仍 `NOT_RUN`，不能将局部 RED/GREEN 称作完整产品验收。 |
| R4FS-004 身份字段/条件动作未路径化 | 局部 source trace 与 Cases 已区分部分对象和阶段；QPC saved-owner 设计 r004 有界复核通过。 | **未解决；OPEN** | 全局字段矩阵仍包含跨对象 `id` 与混合阶段字段；尚无覆盖所有 shapes、阶段、owner 的完整路径化合同及互斥条件 oracle。局部设计不能证明全矩阵安全。 |
| R4FS-005 S01/权限等外部前置缺失 | 最新 Entry Packet 和权限环境状态由 Authority Current State Assessment r001 对账。 | **BLOCKED / NOT_RUN** | S01 F01 仍 `CONDITIONAL`，真实权限环境/账号未提供。产品 UI/Store/source-read/target-commit 与撤权、恢复、只读拒绝验收仍不得宣称完成。 |

## 证据边界复核

1. **组合候选审查**：41 项候选本身已独立审查为 `PASS WITH BOUNDS`；所有项目仍 `NOT_RUN`、`frozen_for_builder=false`、`product_legality=NOT_READY`。这表示局部结构可供有限后续设计使用，不等于合法组合通过。
2. **局部执行与验证**：Sessions r102–r110、r103 和 r105 明确记录局部数量、独立复核及 claim ceiling。相关报告只支持 validator/source-handler/异步局部状态，不覆盖产品 API、完整 Store 生命周期、保存恢复或权限。
3. **权威状态**：采用 Authority Current State Assessment r001 与更正 Review r002 的现态，不沿用 FullShape r001 中历史上的 S01 `NOT_AVAILABLE` 描述；S01 当前 `CONDITIONAL` 也不代表满足其终态前置。
4. **不得自动推广**：不修改 32 个 FullShape 原始 Cases 的 `NOT_READY` 状态，不关闭 R4FS finding，不提升 Goal AC / product obligation 状态。

## 可继续的下一步

按完整 R4 目标继续做**下一个可独立取证的 shape**，优先对 SH-SELECT-NUM 建立 producer、validator、运行 consumer 的最小静态来源图及合法组合候选；仅在建立新 Context/Card 并明确本地源码/fixture write scope 后开展。不能把 SH-SELECT-TEXT 结果复制成数值 shape 的 oracle。若本地只读源码不足以确定某一组合，保持 `NOT_READY` 并记录所缺 owner/fixture。

任何产品入口、目标配置写入、真实权限和 S01 F01 依赖仍按原 Goal 前置条件单独准入。该计划不改变完整 AC 分母或 `Scope Delta`。
