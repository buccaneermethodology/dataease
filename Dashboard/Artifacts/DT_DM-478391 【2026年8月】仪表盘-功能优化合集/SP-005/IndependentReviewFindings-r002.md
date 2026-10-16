# S01 依赖修复与既有透视证据独立复核

## 身份、范围和时点

reviewer/source：独立子代理 `/root/final_validation`；reviewed_at：2026-10-16T01:59:26.472517+00:00。
snapshot_id：S01-DEPENDENCY-REPAIR-003；as_of_state：依赖合并完成候选、第二批清理及新增F05归档暂停，Scope协议及最终Dashboard/Gate尚待闭合。

repair-review-card.json canonical SHA-256 `edf6f8027ddd2281fc7a210db8949e09962f1879cc8e38227b454641833f7da1` 已独立validate及render；repair-review-admission.json按builder与本报告精确target复验成功。本轮只新增本报告，没有启动服务、清理对象、修改产品或新增F05归档。旧独立报告保持原字节。本报告是修复复核，不是最终Dashboard/Goal终态审查。

## 独立检查结果

冻结inventory共16项，逐项重算当前文件及bytes_ref，摘要无漂移。r002/r003均14项，逐项issue_id、ac_ids、question_ids、original_detail均未变化。A/B/C的六/六/二项investigation_result分别逐字包含于对应来源报告，合并未改变来源语义；ISS-AC-08另以runtime_delta明示后续透视运行补充，未改写B报告当时边界。A报告20项、B报告30项代码/产物摘要独立复算无漂移。首轮临时摘要提取正则误跨行导致路径过长，改为单行匹配后完整重算成功；此错误未写入产物或改变输入。

实际源码抽核：chart.ts 1403–1437列出table-info、table-normal、table-pivot、t-heatmap四种内建表型；ExportTaskFileTarget.java 57–70的Files.size、1024进位及严格大于1MiB显示分支符合A报告；两个ExportCenter管理器确有各自Running_Task字段、登记/取消调用点不同。普通/透视表axisConfig定位与B报告一致。源码抽核和摘要核验不等于全部新产品行为运行验收。

读取S02–S09入口包r003追加段，已列热力表、两个Map、文件/任务TTL拆分、1800秒等号、MB原始字节口径和复制后改类型回归；未把调查发现写成实施批准。当前171 AC、19 fixture分母继承首轮且未在修复中削减；不因95个显式gap或新功能尚未实现要求本轮执行全部产品AC。

## 逐项依赖合并复核

| 依赖 | 新证据与处置 | 复核 |
|---|---|---|
| ISS-AC-01 | 原组件复制无专用TTL，1800秒等号由S02契约冻结 | 接受，未擅选比较式 |
| ISS-AC-02 | 文件按原始bytes测量、显示按1024；新容量阈值与UTF-8口径留设计 | 接受，不把Mb显示等同业务MiB裁定 |
| ISS-AC-03 | 已知本机环境与未采性能维度分开，具体计时方案待切片冻结 | 接受，不声称2秒/3秒通过 |
| ISS-AC-04 | 四种内建表型、PNG容器截图、XLSX；图片安全容量需环境实验 | 接受，不遗漏热力表，不泛化不可见插件 |
| ISS-AC-05 | 同步/异步、线程上下文、分页、重试及两个Map风险明确 | 接受，取消真实生效仍需运行 |
| ISS-AC-06 | 默认种子30天与每日调度、文件/任务共同清理、审计未知分开 | 接受，不当作当前部署配置 |
| ISS-AC-07 | 1000截断、blank、换行输入及Provider语义细化 | 接受，类型/请求容量保留具体后续 |
| ISS-AC-08 | 规则优先级、失效字段、历史规则缺口与透视补测分开 | 接受，完整矩阵仍未验收 |
| ISS-AC-09 | 五区域局部limit缺省、批量载荷及一次撤销见证已吸收 | 接受，已纠正“撤销未运行” |
| ISS-AC-10 | 递归保护、NULL呈现与普通JDBC超时路径明确 | 接受，不泛化安全或跨源保护 |
| ISS-AC-11 | 产品收益基线缺失，责任和配对测量方法明确 | 接受，不冒用治理成本测量 |
| ISS-AC-12 | 复制菜单/Store及改类型真实入口已定位，组合回归未执行 | 接受，不冒充专用过滤复制 |
| ISS-AC-14 | 四组槽位及当前连接链缺10条约束明确 | 接受，不截断历史配置或自造已有规则 |
| ISS-AC-15 | D07/D08逐项存在、局部未找到及未知分开 | 接受，不因未知新增已排除能力 |

## Finding处置

### F-01：关闭本轮调查处置缺口

原severity=P1；disposition=CLOSED_FOR_INVESTIGATION（调查层已关闭）。r003已从统一open/next改成具体事实、边界、责任及触发步骤，并忠实保留原依赖。这满足AC-S01-06的依赖逐项处理要求；不是关闭14项后续产品实现/验收依赖。后续切片必须消费r003，不能继续以旧r002作为当前结论。

### F-02：最小透视渲染缺口关闭

原severity=P1；disposition=CLOSED_WITH_BOUNDS（有边界关闭）。独立查看B2c-F05-pivot-rule-render.png：图表标明透视表，规则面板为amount大于固定值100，自身红背景；华东300、华南300命中，华北50不命中。B2c-F05-pivot-reopened-recovery.png仍显示同一看板和相同红/白分布。B2c-F05-repair-case.json已固定输入与预期；EnvironmentRecovery-r001记载从原保存对象重开、数据源校验后刷新，未重新设置条件。

这些既有证据足够校准原F-02要求的最小透视条件绘制及保存重开链。无需为关闭该finding强迫新增归档或重跑。未证明跨字段、全部属性、全部布局/汇总scope、历史>20条或冲突规则，仍属S06后续验收。截图不能单独重演保存事件；本结论综合冻结case、两张图及有明确恢复步骤的运行记录，不宣称独立再次运行。

### F-03：终态协议继续开放，但不预设必须goal_patch例外

severity=P1（仅终态治理）；disposition=OPEN_PENDING_FINAL_BINDING。真实scope批准已在首轮核实；最新暂停原文亦独立读取cleanup-pause-source.json指向rollout第4979行，role=user，与记录一致。两次均不是缺少业务授权。

追加静态检查stop_gate.py和loop_state_v1.schema.json：现有机制允许scope_deltas及approval_receipts，未见要求每个Markdown Goal差异必须先由goal_patch处理。故不能仅因自然语言无goal_patch机器token，就断言必须请用户给协议例外。推荐先使用现有状态/来源绑定路径：保留原Goal及可信root字节，将两次真实用户消息、受影响must-have/范围、暂停残留及本独立审查绑定到最终包，核对原completion predicate是否仍可忠实表达变更后的结论，再执行原Gate。

能力边界：scope_deltas的approved状态检查本身不构成独立来源语义证明；approval_receipts相关校验不自动验证每个scope差异的业务含义。不得为得到绿色结果只改approved标签、伪造平台receipt或删剩余分母。只有实际发现原root/谓词无法表达已授权范围且没有现有合规路径时，才提出具体一次性协议例外；本复核不授权改脚本或重签原root。尚无本轮最终state/receipt，因此F-03不能在这里提前关闭。

## 暂停对收尾的影响

ScopeDelta-r002的用户指令是暂停第二批测试对象清理与新增透视补测归档，同时继续依赖复核、Scope协议、Dashboard及Gate；不是暂停整个S01。第二批资源ID、owner表及5行sum=650的残留清单已记录，当前服务保留。只允许称第一批已清理，第二批必须标为PAUSED/NOT_DONE（暂停/未完成），不能沿用首轮零残留结论。

在最终状态面忠实绑定该人类指定暂停、明确恢复责任且不删除原分母的前提下，这些暂停项不再阻止其余已授权调查与有条件收尾工作。不得将有条件收尾表述为原无条件范围全部完成。清理恢复须待用户恢复指令，并重查服务/归属状态；新增归档也保持暂停。本复核不要求为此再次批准同一业务范围。

## 当前双判定与AC状态

Technical Investigation Validity = VALID_WITH_CONDITIONS（技术调查有条件有效）：F-01/F-02已关闭，保留真实权限/真设备延期、产品AC未整体验收、第二批清理暂停及历史保全限制。此结论覆盖调查与本轮修复，不能替代最终状态面审查。

S02 Implementation Entry Readiness = CONDITIONAL（有条件）：可进入独立设计准备，先冻结1800秒等号、序列化字节口径、身份/登出、整树原子验证、复制后改类型回归；尚未获得实施授权。S06由首轮F-02造成的技术阻塞解除，回到CONDITIONAL。S03仍因App/真设备依赖为BLOCKED，其余切片保持CONDITIONAL；整体不能提升为READY。

AC-S01-01/02/03/05/07继承首轮有边界通过；04的F05最小运行缺口已补；06的14依赖逐项处置通过；08按最新暂停范围有条件成立，第二批清理不计通过；09的F-01/F-02独立修复复核完成，F-03待最终绑定；10仍PENDING（待最终状态面、Scope绑定及有效Gate）。

下一步由Closure准备真实的最终Dashboard/Closeout/残留与范围对账快照，绑定独立结论和来源，执行原Stop Gate并只读读回。最终候选变化仍须按受影响范围复核；本报告不预判GOAL_COMPLETE或final_allowed=true。

Closeout language verdict: PASS（中文报告，英文判定附中文边界解释）。
