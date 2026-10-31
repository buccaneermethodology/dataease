# SP-001 P1 独立预审 v1

- 审阅者：`/root/pre_review`，未编写本轮 schema、工具或样例。
- 审阅时间：2026-10-14T02:26:04.878269+00:00
- 快照：SP001-object-contract-v1；卡摘要 `779d5b52b9fcdc81e2a47fb17206c8a66b2435b7e181235938677987dfe3318c`，接收端 validate 实际 pass。
- 输入：卡绑定 Goal、context-v2、能力分母 v1、对象合同 v1、schema v1、固定正反例、候选 kb.py；补读实际 ChartDataServer 样例行区间。
- 写入范围：仅本报告（原先不存在）。未修改工具、schema、固定案例、产品或正式 kb；测试通过 runpy 和内存数据适配器调用实际函数，禁写 pycache，没有生成临时产物。

## 独立结论

|判断|结论|说明|
|---|---|---|
|Design Freeze Validity|PASS WITH FINDINGS（设计边界通过，存在实现偏差）|目录隔离、来源准入意图与静态证据上限清楚；合同可作为修正工具的依据。|
|Implementation Entry Readiness|FAIL（正式最小 KB 入口暂不通过）|实际校验器不验证合同规定的仓库身份与 revision 绑定，可把当前文件证据包装为任意仓库/虚构提交。|
|Overall Verdict|BLOCKED（仅正式知识准入阻断）|修复 P1-R01 并复验即可重审入口；候选提取及范围对账可以继续，不要求本轮完成全域。|

## 阻断项 P1-R01：来源仓库与提交身份可伪造且通过准入

严重度 P1；分类 S6 authority 混淆 / L5 验证面。

对象合同第1条规定 metadata.source_repo/revision 对全部来源有效，第5条规定 source_repo 固定当前主仓库身份并区分上游。schema 对 repo 只要求非空字符串，对 revision 只要求40位十六进制。kb.py 的 validate 只验证当前工作树文件摘要，不检查这两个字段的授权值或版本证据。

实际复现：从未修改的 positive.json 深拷贝，分别只改一个 metadata 字段，其余来源路径、行号、digest和断言全部保持原样，再调用实际 validate(repo, data, schema)：

|变异|预期|实际|
|---|---|---|
|source_repo = https://invalid.example/unrelated|拒绝不匹配来源身份|pass，仍返回1文档/1事实/1能力/1关系|
|source_revision = 0000000000000000000000000000000000000000|拒绝无效/不匹配提交|pass，同上|

影响：render 会把伪造 revision 显示为“源码基线”。摘要匹配当前文件不能证明该文件属于声明的仓库与提交，因而破坏本 Goal 的绑定源码基线要求。这不是要求运行正确性或无限安全加固，而是已冻结准入合同未实现。

修复建议：由受控基线提供 expected source_repo/revision，校验所有文档；不要从待验文档自身推导期望值。明确当前工作树与冻结 revision 的关系：如允许有意纳入本地差异，保留独立的工作树摘要绑定与差异证据，不暗示其全部来自提交。新增错仓库、虚构 revision、文档间不一致基线的固定反例；重跑原案例和新反例，保留本轮失败证据。修复代码/合同按版本冻结后再申请最小正式链准入。

## 已执行测试与证据上限

运行方式：`python3 -B`，`runpy.run_path(.../extraction/tools/kb.py, run_name='review_import')` 加载实际候选工具；内存 Data.glob/File.read_text 仅替代案例磁盘容器，schema 与源码均从真实仓库读取。直接调用实际 validate、projections、impact。没有以自写实现替代被测逻辑。

|检查|实际结果|
|---|---|
|固定 positive.json|validate pass；1文档、1事实、1能力、1关系、1来源文件|
|dashboard、reference|均失败，准确 fingerprint SOURCE_NOT_ALLOWED|
|stale|失败，准确 fingerprint STALE_SOURCE|
|unknown|失败，准确 fingerprint SCHEMA|
|duplicate|失败，准确 fingerprint DUPLICATE_ID|
|dangling|失败，准确 fingerprint DANGLING_REF|
|output|失败，准确 fingerprint OUTPUT_PATH|
|同一输入调用 projections 两次|返回路径与内容完全相同|
|impact 指定 ChartDataServer.java|direct_facts=[SAMPLE-001]；affected_objects=[SAMPLE-001,SAMPLE-C01]；affected_relations=[SAMPLE-R01]|
|独立语义核对样例|源码89–103行确实包含 TEMPLATE 分支和解码→calcData→字段编码→数据编码流程；样例断言准确|

本轮验证的是实际函数逻辑及样例静态语义；没有执行 CLI render 的磁盘写入，也没有运行 check-render 的文件漂移检查。纯函数相同输出不能写成已验证磁盘投影完整流程；正式最小链建立后应补上实际生成、check-render 与受控漂移检查。样例 depth=navigation、limits 明确只覆盖路由切片，允许作为最小链样例；不能计为核心图表链完整语义验收。

## 前轮发现处理

- PR01：F01–F18 已具名并附候选路径，新增 F19–F23 明示 pending_source_review，六类核心轴与 K00–K11 保留；满足开始有界提取所需的分母识别。当前表仍未逐项关联核心轴/K域，也没有逐项全景来源定位，作为后续覆盖 ledger 必修项保留；不把 candidate_paths 或 pending 状态当已证实。此缺口不单独阻断 P1 图表切片。
- PR02：对象 schema、准入说明与七个固定反例已补齐，工具实际执行得到预期失败；关系端点、唯一ID和引用具备检查。仓库/版本绑定偏差为本轮新定位的 P1-R01。源行存在不等于断言真实，仍需独立语义复核。
- PR03：context-v2 的 topology.reason 已改为本任务的分域候选提取、独立复核与正式准入职责，旧版保留，修复成立。

## 非阻断项与下一步

1. P1-R02（P2）：卡 topology.task_id 仍为 SP001-PRE-REVIEW，而 card_id 已是 SP001-P1-REVIEW。卡验证通过不证明身份字段语义一致；下轮卡使用本轮唯一任务身份，便于生命周期绑定，不改本轮历史卡。
2. 对象合同把 implemented 解释为“静态实现或接口声明”，投影显示“静态实现/接口”；当前样例是实际实现，没有误导。后续 SDK 接口事实必须明确措辞为接口声明并保留可见性边界，不从枚举值推出能力已实现。
3. 正式链最小动作：修复基线准入→独立复验→只落一条路由切片→实际生成/漂移检查→再扩展全域。工具测试通过不替代后续核心逐项语义验证。
4. 单行误读防护：本报告“设计通过”不代表实施入口通过；“七反例通过”不代表完整准入合同通过；“样例准确”不代表图表权限、异常及全部 Handler 已核实。

无需修改产品、访问数据库、安装依赖或询问新的业务授权。修复仅涉及现有 KB 工具合同实现与受控反例，不扩大用户范围。
