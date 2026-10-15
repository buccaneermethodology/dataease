# Design v001：需求真源与阅读投影

## 真源形态

新增 `kb/requirements/DT_DM-478391.v1.json`，采用独立于源码核实型 `kb/data/*.json` 的 `dataease_requirement_baseline_v1` 契约。这样不会把用户确认的需求误标为静态源码已验证知识。JSON 以功能为单位组织 TSP、决策条目、验收条件、未决项及流程图，并保存全局边界、来源优先级、摘要与变更日志。

## 生成与校验

新增标准库 Python 工具，只从需求 JSON 生成 `kb/generated/dashboard-requirements-DT_DM-478391-v1.md`。验证包括结构、唯一功能 ID、来源路径/摘要、已确认决策范围声明和投影字节一致。原始文档不参与 Markdown 渲染，防止其旧要求覆盖真源。

## 来源与冲突规则

主文档的 Q01–Q156 决策在本版为权威；原始 Markdown 和其架构图只登记 provenance。主文档明示的待证、原文待裁、Q157、跨功能冲突审查未执行等边界保留为开放状态。新决策通过新的 JSON revision/change_log 记录 supersedes，不覆写历史版本。

## 交付面与风险

KB README 添加单一阅读入口。产品代码、现有 `kb/data` schema、源码 KB renderer 均不改。主要风险是结构抽取可能漏项或错误归类；通过 Q 编号覆盖检查、源摘要、功能数和逐项对照降低风险。所有完成声明限于本规范性需求 KB。

## 拓扑限制

系统当前禁止委派子 Agent，因此不能用自检替代独立 Validation。最终审阅若无法由可用独立 reviewer 执行，应如实标记缺口并保留候选状态。

