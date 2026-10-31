# 符号地图新实例精确schema授权差异独立审查 r003

- reviewed_at：2026-10-30T05:22:09.981687+00:00；reviewer/source：`/root/local_basemap_reviewer`；snapshot_id：`S02-SYMBOLIC-FRESH-RUNTIME-REVIEW-r003`。
- 同一环境设计最终 **第3/3轮**，只审GrantDelta-r003及其与r002相容性；不重置其他预算、不追加第四轮。
- 接收端卡canonical SHA `f00ee3ee2e20f39d7cb7dcf205ae5f3553b5a2a4c886a7693588085f80b92a3f`，已依次validate、render，均exit0/PASS，并按生成prompt执行。Goal+4 base refs共5项摘要一致，写报告前复验未漂移。
- as_of_state：首次新child因应用账号无新schema权限退出，记录显示已reap；**GRANT尚未执行、再次启动和UI尚未发生**。本lane只读本轮材料，只新增本报告；未连DB、未执行授权、未读取密码/私密配置/认证hash、未改变环境或源码。

## 裁决

**Design Freeze Validity：PASS WITH FINDINGS（限定schema授权设计通过，保留执行前置）。Implementation Entry Readiness：PASS（限精确授权delta和既有r002的分阶段执行）。Overall Verdict：PASS（本轮授权方案有界通过）。新增blocking=0，新增产品源码修复要求=0。**

既有账号对本任务新schema取得数据库级权限，可以解除本次已观察到的启动连接权限缺口；该语句不创建账号、不修改密码、不授全局权限或GRANT OPTION、不变更原dataeasev3授权。用户已授权设置测试账号的依据由root及Delta原文承载，本报告不重复要求同一许可，也不将review当作已经执行授权或真实权限验收。

可以在绑定本轮delta/审查/实际目标的精确admission下执行授权，并按r002继续新PID启动→三类实际连接核验→真实UI。r002其他隔离与失败停止条件保持；不能把旧副本准备admission当作本次MySQL权限元数据写入的准入。

## MySQL对象、转义与账号检查

审阅的固定语句是：

```sql
GRANT ALL PRIVILEGES ON `s02\_symbolic\_20261029`.* TO 'dataease_dev'@'127.0.0.1';
```

root在本轮提供的无秘密只读实测为：**MySQL 8.4.11，@@partial_revokes=0，应用连接不选库时CURRENT_USER()=dataease_dev@127.0.0.1**。本lane未自行查询服务器；这些事实应在实际执行阶段与既定3307实例身份一起核对，不引用客户端报错中的host来替代实际认证账号。

在partial_revokes=0的数据库授权模式下，反引号中下划线仍需按权限模式转义；本句两个下划线均有反斜杠，且没有未转义%/_，资源域对应固定`s02_symbolic_20261029`。本lane额外做了纯离线模式结构检查：固定名称匹配，替换下划线为X、增加前后缀及原dataeasev3均不匹配。该检查只证明语句的模式结构，不是服务器GRANT执行测试。

账号User/Host和schema均固定字面量，没有把外部字符串拼入SQL。数据库级ALL PRIVILEGES与`*.*`全局授权不同，不包含本句没有指定的WITH GRANT OPTION；也没有CREATE/ALTER USER或IDENTIFIED BY。它是**资源域最小化**的本地副本授权，本报告没有证明每一个privilege bit都属于理论最小集合，也不声称账号既有其他权限/角色不存在。

## 全部执行前置与非阻断发现

### SFR-R3-N1｜P2：保全精确授权基线，不能把数据库级ALL写成账号全局权限不变

Delta已要求唯一账号、任务schema所有权、当前新库授权为空及事后SCHEMA_PRIVILEGES精确读回。执行时应记录该账号/Host、server版本与partial_revokes、库所有权manifest，以及该schema模式的授权前后元数据；仅取User/Host或GRANTEE/TABLE_SCHEMA/PRIVILEGE_TYPE/IS_GRANTABLE等必要字段，不读认证hash或输出密码。模式/账号/所有权/新库授权基线有漂移则停止，不扩大账号Host或schema匹配条件。

事后要确认**指定escaped schema模式**的预期数据库权限和IS_GRANTABLE均NO，并用实际应用凭据SELECT DATABASE()核访问新库成立；不能只凭GRANT返回成功。共享应用账号确实增加了新库权限，因此正确表述为“原服务进程/配置未动，原库授权不变，既有账号新增本任务库权限”，不能写“账号权限完全未变”或“零副作用”。MySQL权限元数据会发生有意写入，业务fixture表不是本授权步骤的写对象。

**处置**：执行前置，非设计blocker。当前没有实际GRANT结果，不能预填权限读回通过。

### SFR-R3-N2｜P2：GRANT不是普通业务事务，unknown结果必须靠读回判断

Delta的unknown/no-blind-retry规则正确。GRANT属于权限DDL/隐式提交边界，不能用ROLLBACK恢复授权；也不能因客户端超时就推断未授予。出现连接断开或结果未知时，先只读检查准确账号/模式和实际应用访问：若与预期相同，记录为已生效而不重授；若未确认，停该写入口诊断，不扩大权限或夹带密码重置。

新schema和授权按计划保留供后续开发，不自动REVOKE，与r002保留owned副本相容。这不是恢复到授权前态的承诺。未来如需清理，只能以已保存的授权前基线及任务所有权为依据，精确处理本次增加的schema条目；不自动撤销旧库、全局或其他角色权限。后续清理不属于当前授权delta。

**处置**：非阻断语义澄清；不要求现在执行REVOKE，也不因保留已有授权意图而再次询问用户。

### SFR-R3-N3｜P2：重启保全完整attempt，实际连接工具准备不等于已核验

首次失败证据记录child PID43384、returncode1、child_reaped=true，elapsed约5.909秒；term/kill未发送符合自然退出路径。该记录不应改成“启动后成功”，也不因第二次成功覆盖。r003将首次identity/result/log原字节移入私密attempt-r001再用同字节watchdog创建新Popen/PID，方向正确；归档清单还应涵盖本attempt会复用的mutable stop/result/identity槽位，避免误读旧terminal状态或遗留stop标记。保留原摘要与新私密位置映射，不把移动后路径变化写成内容变化。

重启仍使用已核jar/配置/read-model和owned clone，不能重新盲跑r002的“库原不存在/四行删除”流程，更不能沿用旧PID43384当作新进程身份。新Popen身份和实际服务地址通过后，才能继续UI；原8100/7070只读核对，不杀旧服务。

root补充已准备使用新clone刚生成DS/engine配置、生产Mysql.getJdbc和真实DriverManager连接执行DATABASE/@@port/CURRENT_USER的工具，尚未运行。本lane没有把未绑定工具源码当作已审实现或成功证据；实际运行必须仍验证Spring metadata、fixture datasource、engine三个最终目标均loopback:3307/新schema，密码/AES只在内存，未知或指向原库就停新进程。授权成功本身不能替代这三类目标核验。

**处置**：执行前置，非新增设计blocker；不要求额外设计轮次。

## 已检查无问题维度

- 本轮只增加既有准确账号的固定新schema权限；不需要解密旧额外数据源，不引入新账号、永久token、密码修改、全局权限、原库授权或WITH GRANT OPTION。
- MySQL版本/partial_revokes和实际CURRENT_USER由root已只读取得，与计划采用的转义/Host一致；离线检查没有发现通配扩域。执行仍须真实读回，不能把离线结构检查当数据库证明。
- r002因无新库权限失败后确实按记录退出并reap，而不是为绕过失败悄悄连接旧库；r003明确是失败后新授权delta，原失败证据保留。
- 授权动作不改变新库业务内容，下一阶段正常启动的Demo/engine/RSA/迁移写入仍属于r002已冻结的独立启动delta，不混为GRANT的一部分。
- 仍要求新Java私密user.home/同文件双read-model、独立jcache/font/null等路径、真实watchdog、唯一新context、真实8110上游无fallback；本轮没有借权限不足删除这些条件。
- 新schema/原库/旧服务边界未扩大，grant保留与owned clone保留一致；不把数据库账号权限开通称为DataEase真实多用户/行列权限验收。
- 38项、49类型原分母、原ubo与C2预算/稳定画面残余不变，没有新增或缩减产品AC；这是一项局部环境恢复差异。

## 分阶段准入预测与本轮预算

1. **精确授权**：核3307服务器/实际账号/owned新schema/空授权基线，绑定独立精确grant准入；执行固定escaped schema语句、读回非grantable权限并实际应用凭据连库。当前是方案准入，实施结果未观察。
2. **新attempt启动**：保全首次失败原字节及位置映射，不重复副本转换；新PID/同jar配置/watchdog运行，核三类实际连接全为clone。权限不足若重现，按真实指纹诊断，不改密码/Host或扩大授权猜测。
3. **真实symbolic验证**：只在目标核验完成后，用正常新context和真实HTTP补details同组匹配/aggregate oracle及保存重开；不因实例起来就关闭原产品验收缺口。
4. **停止/留存**：仍只停止新child/关闭新context，核原服务；新库、私密材料及授权按已声明开发用途保留，不自动drop/revoke未知对象。

本轮已用完同一环境计划 **3/3** 审查预算；本次有界通过允许按冻结步骤推进，不需要第四轮“确认通过”。若实际执行失败，应保留指纹并在现有合同内诊断、推进独立工作；不得通过换名称/重置预算绕过审查，或由本报告预批新的权限范围。

## 未检查、同类残余与阅读清单

未检查：实时DB/实际授权基线和权限行、配置凭据、grant实施、private attempt文件实际归档、watchdog当前代码与重新启动、目标核验工具实现/运行、真实UI/HTTP和新实例健康。原因是本轮只读授权delta，未授权本lane执行环境动作。首次child清理和原服务未动来自冻结Failure-r001记录，MySQL/账号事实来自root本轮只读补充，均没有冒充本lane实时DB/进程独立检查。

同类残余：共享账号的其他既有权限/角色没有完整审计；本轮只审新增固定schema条目，不宣称账号被全面最小权限化。r002路径、dump、clone、启动任务及网络真实性仍按原执行证据核验；真实权限、其他图表、旧ubo/C2、完整MVP/Goal终态不在本delta证明范围。

完整读取卡与实际render prompt、GrantDelta-r003、绑定r002计划/审查、Failure-r001，复核Goal范围和五项摘要；沿用本lane前两轮已核的配置/正常重建/任务/真实转发边界，不为只有授权delta而重启无关全仓审计。写前输出路径原不存在，五项绑定输入未漂移；只新增本报告，无密码、配置值、认证hash或秘密日志输出。
