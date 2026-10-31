# SH-SELECT-TEXT 来源候选修订证据 r001

- Finding：`F-ST-SRC-001`（独立复核 r002，P2）。
- 处置：新建 `QueryProductAdapterSelectTextSourceTrace-r002.md`，保留 r001 原件；修正 `options.ts` 扩展属性精确范围为 `80-137`、字段行为位于 `:135`，并分离 `infoFormat` 初值、扩展属性定义和配置页 `parameterCompletion`/`setToDefault` 应用路径。
- 限制：没有修改产品源码；ST-SRC-001..007 状态保持 `DESIGN_ONLY/NOT_RUN` 或 `NOT_READY/NOT_RUN`；不定义完整合法组合/schema，不证明保存恢复，不准入产品 Builder。10 Goal AC、26 must-have、16 product obligations 和 `Scope Delta: none` 保持。

- 治理顺序偏差：候选 r002 与本记录在 Context/Admission 校验前已写入；随后验证通过不构成追认。此偏差单独进入 Topology，后续 Builder 写入必须先完成 admission 校验。
