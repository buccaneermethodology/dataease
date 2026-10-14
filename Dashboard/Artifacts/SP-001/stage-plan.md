# SP-001：DataEase 初始 KB 建设

- Topic：源码匹配的初稿KB；Scope：Goal DE-KB-001全范围；Purpose：支撑后续开发理解与影响分析。
- 归属：DE-KNOW-BI01；状态：交付候选已齐；Goal验收与终态见reviews/final-review.md和stop-gate/receipt-final.json。
- 执行材料唯一根：Dashboard/Artifacts/SP-001/；知识交付根：kb/。

|阶段/Session|依赖|必需产物|验收门槛|状态|
|---|---|---|---|---|
|P0 / DE-EXEC-S009 基线与全仓盘点|无|Goal、原始意图、基线、inventory、能力分母、context、design|目录边界正确；来源分类不漏忽略文件；独立预审|交付候选|
|P1 / DE-EXEC-S010 最小知识生产链|P0|schema、生成/检查工具、图表链样例、固定反例|同输入同投影；失效来源/不确定材料拒绝；样例语义复核|交付候选|
|P2 / DE-EXEC-S011 全域与核心提取|P1|K00–K11映射、核心契约、关系、差异索引、F01–F18对账|完整核心分母；全部正式断言有原始证据|交付候选|
|P3 / DE-EXEC-S012 独立验证修复|P2|校验、逐项核心复核、逐域样本、修正与复验|无未解决阻断；结构与语义分开|交付候选|
|P4 / DE-EXEC-S013 冻结交付与收尾|P3|最终包、维护说明、覆盖清单、最终审阅、Stop Gate|Goal全部义务实际证据闭合|交付候选|

## 运行协议
Design由root协调；Builder按领域独立写候选提取材料或KB工具；Validation由未编写对应内容的独立agent执行；Closure由root绑定最终包。委派前验证lane card并渲染，接收者复验摘要。子任务无输出不得静默代替。一次SP是一项观察任务，重试/子agent不重复计数。
每阶段结束继续首个未满足依赖的工作；无关问题记录边界，不扩大为产品修复。任何范围缩减须用户明确批准。

## 候选状态与终态读取

表内候选表示阶段产物已齐备，不预判最终验收。P0–P4及FINAL的终态统一读取[最终结果](evidence/final-result.json)和[有效回执](stop-gate/receipt-final.json)，不在独立审阅后改写已冻结的计划正文。
