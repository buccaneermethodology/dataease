# C1 矩阵热力图主数据判空修复说明

沿用已通过的 C1 原设计，不改准备成功再采用、失败保旧和合法空结果合同。新真实运行 r002/r003 在 getData/tableRow 有合法矩阵行时，strict G2 create 却把辅助 data=[] 当空态并采用“暂无数据”。normal renderer 实际消费 tableRow；后端 TableHeatmapHandler.buildResult 向 transChartData 传空指标是既有表示，不能因此改后端凑非空 data。

仅 G2 候选 create 分支按 type=t-heatmap 选择 tableRow，其余仍 data.data；非数组不按空数组处理，由实际 draw/ready 既有拒绝路径处理。G2Plot分支与C2、共享清理、service、DTO不改。冻结七反例包括真实矩阵、真空矩阵、辅助数据非空但矩阵空、missing/malformed矩阵及bar兼容。测试使用真实完整SFC与明确chart-library/DOM/Store替身；真实图层由同一fixture500→200重放并保存重开另证。

这是已批准设计内的实现修正，不新增设计审查或重开UIIntegration设计3/3；原C1实现1/3与tooltip2/3保持，修后仅余累计3/3最终独立验证。root作本次窄delta的设计说明及Builder，独立Validator最终核实原合同和全部增量；若第三轮仍阻断，不得第四轮或换名。

写集合仅G2 SFC、已有renderer runner与新BDD可读卡。原source/runner均先备份；Cases冻结后Builder不得改。预审依据原UiIntegrationDesignReview-r002与C1TooltipDeltaValidation-r002，均不是本修复的新独立通过结论。
