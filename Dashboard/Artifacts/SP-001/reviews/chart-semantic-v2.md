# Chart 候选独立静态复核 v2

- reviewed_at: 2026-10-14T02:37:24.169232+00:00
- snapshot_id: SP001-chart-candidate-review-v2
- as_of_state: integrated-v2领域候选，尚非最终KB/全Goal收尾。
- reviewed_path: Dashboard/Artifacts/SP-001/extraction/integrated-v2/chart.json
- reviewed_sha256: 2bde2427ef10eb2ed5b0fbffed836b786731feb7fc74b5896ec5194f3ddec0fe
- reviewer: access_extract（未编写chart候选或本次整合修正）
- verdict: PASS_WITH_BOUNDS（本领域既定静态语义审阅通过，可进入正式静态知识整合；不等于全KB或运行验收）。

## 复核范围

复验chart-semantic-card-v2摘要通过，读取渲染prompt、上一轮报告及semantic-repairs-v1。卡声明full_baseline；本次逐项比较原chart/candidate.json与integrated-v2/chart.json全部字段，依据上一轮33/47关键事实、21/34来源文件的独立亲读基线，并复验所有事实来源摘要仍匹配当前文件。没有因只看修复摘要而忽略整合其他变化。

实际差异仅为两项触发/关系修正、CHART-040证据延长和正式知识包装字段（doc_type/version/status/output_path/metadata）。47条事实ID与内容保留；5项能力及3核心、2导航深度保留；70条关系变为68条，减少的恰为已判错两条。未发现未批准范围缩减。

## 上轮阻断关闭

| 项目 | 复核结果 | 判定 |
| --- | --- | --- |
| C1 错误入口关系 | F05 trigger只保留CHART-026/030；F06只保留CHART-027/030；R030/R048消失，其他关系不变。与已亲读dashboard入口206–225、dataV入口316–334以及223–237一致。共享后端事实均保留。 | 已关闭 |
| C2 CHART-040证据不足 | dvRestore引用从785–822延至785–956，覆盖上一轮额外亲读的825–858跳转、861–896联动、900–918外部参数目标、922–937详情；本轮再读941–956，确认外部参数主记录保存及阈值恢复入口。摘要匹配。 | 已关闭 |

C2所涉文件为 `core/core-backend/src/main/java/io/dataease/visualization/manage/CoreVisualizationManage.java`。此次是补证，未改事实语义或产品实现。原提取read-log保留历史范围，本报告作为独立补读证据，不能将原read-log误认为已覆盖扩展区间。

## 整合差异及证据绑定

metadata.source_revision与当前git HEAD均为24ffb4c08a7532af26e8cd3966e5e42726a40af4；source_repo指向当前origin对应的buccaneermethodology/dataease工作副本，已核对remote，不能把它替换理解为维护者规定的上游产品主仓身份。全部47事实引用的文件SHA256重新核对无漂移；这是结构/来源绑定检查，语义结论仍来自亲读。

status=static_verified只在本报告所限定的静态知识意义下成立。新增output_path指向kb/generated/chart.md仅为投影路径，本轮没有验证该最终文件或渲染工具。

## 逐能力与残余边界

F04主取数/权限/SQL/默认Handler/渲染与代表性测试资产基线仍成立；F05/F06各自入口与共享保存、发布、消费链在C1/C2修复后可整合；F07模板、F18地图/AI保持导航深度。既有运行、全Handler/Provider穷举、并发原子性、完整UI/移动端与企业实现边界没有被包装字段消除。

本轮未运行构建、测试、产品或数据库。没有要求Goal以外的运行证明，也没有把仍需其他领域整合的权限实现判为已运行通过。最终KB、Dashboard、完整diff、生成结果及收尾状态绑定仍须最终独立审阅。本报告不宣称Goal完成。
