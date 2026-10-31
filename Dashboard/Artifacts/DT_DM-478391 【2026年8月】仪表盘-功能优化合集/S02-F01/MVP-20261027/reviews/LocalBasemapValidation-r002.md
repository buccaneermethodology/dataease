# 本地测试底图恢复工具第二轮独立验证

- reviewed_at：2026-10-29T14:03:19.744755+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`。
- snapshot_id：`S02-LOCAL-BASEMAP-VALIDATION-r002`；as_of_state：r002工具和20例纯内存自检已落地，r001工具/首轮review/Runtime等冻结材料未改；本轮只进行源码、纯内存、匿名管道和模拟进程核验，无真实数据库写事务、dry-run/restore或UI操作。
- 本环境实现累计 **2/3轮**，余1轮；与bubble预算分离，设计审查预算不重开。
- 接收端及写前card canonical SHA `48e1bf75e7008bf053bd4baecc5a5860ed6f315b4a41061714627091de8e77f6`，validate exit0/PASS，Goal与8项base refs共9项摘要全部一致。
- 卡机器mode为full_baseline；完整读取其全部refs，复用首轮已核验且摘要不变的环境事实，并针对本次工具delta加测。不把本轮称为已提交machine delta snapshot/Delta Read Set协议。

## 裁决

**首轮LBV-F01：关闭。恢复工具当前限定合同：有界通过、保留发现（PASS_WITH_FINDINGS）。本轮新增阻断：0。环境事实沿用首轮证据上限，产品/MVP/Goal未验收。**

r002用显式check/GuardError替换全部assert，并在DB实例化前拒绝解释器优化模式，锁定读取和readback不再可被优化删除。DB读取有10秒响应deadline，关闭不再递归执行无期限ROLLBACK读取。归档20例独立复跑全部通过且与冻结输出逐字段相等，首轮真实阻断已有实质修复。

追加的管道/模拟进程检查也发现：COMMIT超时被明确标为unknown/no-retry；COMMIT遇EOF仍只给普通失败，极端close失败还可能盖掉原unknown错误。它们记录为本轮P2保留发现。当前工具没有自动重试，异常不会输出成功，也未宣称提交必定回滚，故不把错误说明可更完整自动升成新阻断。操作方必须把COMMIT发出后的未确认结果按未知处理，不得由普通failed推导“未提交”后盲目重试。

本轮不执行真实restore；有界通过不是授权提交，也不证明r002真实MySQL恢复演练已重新通过。原P1 12+P2 26=38义务、49内置类型、插件installed unknown、真实权限未验全部保持。

## 输入与完整差异

本轮完整读取r002卡/render prompt、r002工具、自检脚本与自检输出、首轮全部finding及处置、r002方案与设计审查、r001Runtime、Topology-r513；复核r001→r002工具完整diff，读取旧工具以确认原字节。没有变更产品或环境写域。

| 冻结输入 | SHA-256 |
|---|---|
| config_guard-r002.py | `a281a69885e74bdf798772563090ed67e7edd68d8f08e264d406c16c30f8828e` |
| check_guard-r002.py | `572318165217b976b8e3f0bea7be1001aa58ffc415a33f16b32fd85d821196fc` |
| LocalBasemapGuardRepair-r002.json | `98454dfc7b1a14f9ec0217beaf14dab44b133daa15cdd63fac528038219e4074` |
| 首轮独立报告 | `bab1aa0b896002a3649be04e2a18a6286da9262e878b966ac30355323d550e14` |
| 旧工具r001 | `79610a4257eb412bd2a6a7bd85e6af53ed316bf97f16afcde263c8cd84dc1c0e`，保持原字节 |

delta只包括显式守卫、GuardError公开脱敏reason、优化模式拒绝、select/os.read读取deadline、EOF/terminate/kill关闭。固定14键、EXPECTED、实例/私密快照、空before专用语义、DELETE范围及成功输出结构没有扩大。方案及已有底图环境配置无需因此重做；没有把首轮普通python3的成功记录误写为优化模式失败。

## 首轮全部发现处置

| 首轮项 | 本轮结论 | 依据与剩余边界 |
|---|---|---|
| LBV-F01 assert优化绕过 | **关闭** | AST中Assert计数0；显式check不可优化；真实-O与PYTHONOPTIMIZE都在DB前拒绝；仅compile optimize=1/2而sys.flags仍0的受控测试也保持锁与全部守卫。 |
| LBV-N01 演练/持锁证据层次 | **保留** | 本轮没有真实UI或写事务；r001Runtime仍为root执行记录，首轮独立当前DB/HTTP/截图事实不被提升为独立完整演练。 |
| LBV-N02 全局provider/flock/store | **保留** | 工具delta不修改后端CAS或store；flock仍仅协作写者，真实restore后仍需完整重载相关客户端。 |
| LBV-N03 空before专用/显式action/tmp | **保留且无新增问题** | 只接受before全空，默认省略action会拒绝；dry-run是写事务回滚而非只读命令；临时备份非永久保存。 |
| LBV-N04 有限等待/close | **主要路径关闭，保留下述细节** | 响应读取10秒deadline；close按EOF→wait2→terminate→wait2→kill→wait2，总等待不再依赖q(ROLLBACK)。极端关闭异常的原错误保留见LBV2-N01；deadline起点见LBV2-N02。 |

## 独立执行与补充检查

1. 从仓库根执行 `python3 <local-basemap-tools/check_guard-r002.py>`，exit0，**20 PASS / 0 FAIL**；结果与冻结`LocalBasemapGuardRepair-r002.json`逐字段相同。脚本只创建合成快照并使用FakeDB；两个实际解释器优化拒绝case在DB前退出，没有mysql操作。
2. 18个FakeDB case为6个行为×compile optimize0/1/2：正常dry-run、正常restore、错误identity、before摘要错误、after摘要错误、锁内row drift。正常分支均先LOCK_READ再Fake DELETE，dry-run无COMMIT，restore有Fake COMMIT；错误输入均在Fake DELETE前拒绝。
3. 实际解释器`-O`及`PYTHONOPTIMIZE=1`两个case均返回`OPTIMIZATION_MODE_REFUSED_BEFORE_DB`。它们不同于compile optimize测试：前者验证入口拒绝，后者验证显式check即使被优化编译也不会丢失。
4. 对实际DB.q方法使用匿名OS管道与StringIO stdin，不启动mysql。合法UTF8 JSON行+结束标记正常返回；无结束标记的EOF拒绝，半行EOF拒绝，坏JSON抛JSONDecodeError并无成功。没有输出任何私密值。
5. 对实际DB.q的selector超时分支做纯内存注入：普通SELECT→`DB_COMMAND_DEADLINE_EXCEEDED`；COMMIT→`COMMIT_OUTCOME_UNKNOWN_NO_RETRY`。对真实匿名管道EOF：普通SELECT和COMMIT均→`DB_COMMAND_FAILED_REDACTED`。没有真实等待10秒，也没有假称真实数据库网络故障。
6. 对实际DB.close注入模拟进程：正常退出仅stdin.close+wait2；需terminate时先wait2再terminate+wait2；需kill时再kill+wait2。未调用DB.q/ROLLBACK，无重试COMMIT；stderr流在所有路径关闭。三种正常关闭阶梯均保留先前unknown异常。模拟kill后wait仍超时则最终TimeoutExpired会盖掉原unknown，见下项。
7. 纯内存main场景模拟COMMIT已确认但随后readback出现漂移：工具抛`independent readback mismatch`，没有输出成功，Fake COMMIT已发生；未启动数据库进程。该case证明失败不能等价“必然没有提交”，支持保留明确的提交状态说明。

上述测试是独立Validator证据，不是Builder自报；但FakeDB的DELETE/COMMIT均只修改内存。环境HTTP/DB/截图事实是首轮观察，r002没有重查实时数据库或UI，不能用“输入SHA未变”代替外部状态持续未变。

## 本轮全部发现与残余

### LBV2-N01｜P2非阻断：COMMIT不确定结果的reason与清理异常保留仍不完整

**位置**：r002的DB.q EOF分支、DB.close最终wait、main提交后readback及finally。

- 发送COMMIT后如果在结束标记前EOF，q只报`DB_COMMAND_FAILED_REDACTED`。这与超时同样不能确认服务端最终提交结果，但没有unknown/no-retry标识。匿名管道测试已观察该输出，不是实际MySQL故障复现。
- 原本抛`COMMIT_OUTCOME_UNKNOWN_NO_RETRY`后，finally close若kill后的wait仍TimeoutExpired，新的TimeoutExpired盖掉原异常，顶层只剩类型名；模拟进程测试已复现此异常组合，不要求系统保证任何进程一定能在2秒内被杀死。
- 已确认COMMIT后readback失败会给普通失败但不带`committed=true`状态；失败本身没有谎称未提交，仍需操作方辨明，不能把失败当作安全重试许可。

**影响/边界**：目前没有自动重试、没有上述失败输出成功、没有输出`committed=false`或“已回滚”，因此不构成本轮新阻断。它是提交结果可观察性缺口，不能把超时处理通过写成“所有COMMIT不确定结果均已分类完毕”。

**建议**：在未来真实restore前，按“COMMIT已发送/已确认”记录状态；未确认的EOF、超时和其它传输异常统一明确unknown/no-retry；提交已确认但readback失败明确committed-but-unverified/no-retry；close异常保留主错误并附安全cleanup结果，不覆盖原提交状态。不要通过自动重试、重新执行恢复或声明回滚成功掩盖未知。可在剩余第3/3轮对上述已定位分支作最终delta，但本轮不为它机械重开设计或要求额外真实事务。

### LBV2-N02｜P3非阻断：10秒deadline只覆盖发送后的响应等待

q在stdin.write/flush之后才创建deadline；close的stdin.close也没有独立IO deadline。不能声称端到端所有IO绝对10秒内完成。当前固定查询/14个Long ID的SQL很小，且每次命令必须取得回应后才发送下一条，没有证据显示本场景会填满stdin pipe；本lane没有观察或人为制造真实阻塞，因此不以理论上的任意大输入扩大当前合同。

若未来扩大输出/SQL规模或容许更复杂客户端状态，应将写入/关闭纳入总预算；本轮维持小命令、一次失败即退出，不宣称全局调度/任意进程阻塞恢复能力。

### LBV2-N03｜P3非阻断：2MiB限制是当前未分行buffer上限

q对buffer长度做检查，但已解析行进入rows后不累计总响应字节。故不是整个查询累计响应≤2MiB的证明。固定14键及当前字段长度使本次恢复输入远低于该阈值；没有据此新增全局输出/内存框架要求，也不宣称任意DB响应内存严格有界。若后续文档需要总量上限，应累计读取总字节或限制行数，并保留当前固定范围。

以上为全部本轮发现：新增阻断0，未隐藏EOF/提交后读回/清理异常分支，也未把这些边界提升成当前环境失败。

## 已检查无问题维度

- 优化模式检查在argparse/DB创建前，所有原assert已显式化；private模式511/384/448常量分别仍为0777/0600/0700，位运算优先级正确。
- 锁定读取、事务内before空态、COMMIT/ROLLBACK后的新读取均实际执行，正常模式与优化编译不改变顺序；完整after原始行相等仍比仅比较pval更强。
- 错误identity/摘要/row drift仍fail-closed，14键/id静态写边界未扩大；旧工具保持原摘要，没有覆盖冻结证据。
- 新读取实现使用bytes拼接后按完整行UTF8解码，合法中文JSON可处理；selector在finally关闭；EOF/无结束标记/格式错误不会走成功输出。
- 关闭不再在失败finally中发送一个可能无期限阻塞的ROLLBACK命令；EOF关闭连接依赖服务端终止未提交事务，不是一次已经确认的rollback ack。必须与COMMIT不确定结果区分。
- 20例自检确为纯内存；没有把实际解释器优化拒绝case误当数据库安全操作。自检未覆盖DB.q/close，故本lane另做实际方法的匿名管道与模拟进程检查。
- 前轮底图环境正确配置事实保持其历史时点；本工具delta不增加地图类型通过数或减少原验收义务。

## 未检查与原因

本卡禁止真实DB写事务/dry-run/restore和UI，故没有重做r002 MySQL实际演练、COMMIT、数据库锁等待、真实断线/退出、网络阻塞或客户端重载。也没有只为复现超时而锁表、杀mysql进程或干扰其它任务。未重验当前外部DB/HTTP状态，原因是本轮聚焦工具delta且无迹象要求再次读取私密快照；首轮独立环境证据按历史观察引用。

未做flow/heat/symbolic图层、正常轴、双向copy/paste、query计数、500/200独立oracle及save-reopen；未做49类型/插件/真实权限/38义务整体或最终Goal closeout。未运行构建、安装、部署、改产品或共享Dashboard/KB；本lane唯一仓库输出为本报告。

## 准入预测与下一步

恢复工具的首轮阻断已关闭，可以把r002作为本次空前态、固定14键的有界候选工具；不能把r001真实回滚演练迁移成r002已实际演练，不能把有界通过当真实restore提交授权。使用前仍须有效私密备份/摘要/实例匹配和同一原始操作授权，提交失败未知时绝不盲目重试。

根Agent可继续不依赖工具残余的隔离地图UI工作。若按上文三种提交/清理结果补全r003，剩余第3/3轮应只核对应delta及首轮保留边界，不再扩大通用框架或重置预算。本次不要求重做已经冻结且无差异的底图资源/UI方案，亦不要求再次人类授权同一已有范围。
