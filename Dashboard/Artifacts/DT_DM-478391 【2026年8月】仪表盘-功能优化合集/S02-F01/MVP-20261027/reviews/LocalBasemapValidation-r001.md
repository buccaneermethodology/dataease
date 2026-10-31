# 本地测试底图环境实现独立验证 r001

- reviewed_at：2026-10-29T13:44:06.944721+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`。
- snapshot_id：`S02-LOCAL-BASEMAP-VALIDATION-r001`；as_of_state：root已完成正常UI配置并提供预览/重开截图及恢复回滚演练记录；本lane已完成静态审阅、有限私密备份比较、独立HTTP和数据库只读核验，未操作UI或运行恢复事务。
- 本环境实现验证 **第1/3轮**；与bubble实现预算完全分开，环境设计审查仍是2/3。
- 接收端和写前lane card canonical SHA `26c770e68900e4e0bd2e2cb01d3ee2678765ec9884546002c30af65d0e2ecdda`，validate exit0/PASS；Goal及7项base refs摘要均一致。

## 裁决与证据上限

**环境资源与当前配置：有界通过（PASS_WITH_BOUNDS）。精确恢复工具准入：阻断（BLOCKED，LBV-F01）。总体交付：部分成立、需修复工具后复验（PARTIAL / NEEDS_REPAIR）。**

当前同源网格fixture确实可读，两张冻结截图均可见正常配置界面和网格，私密before/after形态与14键合同相符，独立只读数据库查询确认当前状态逐字段等于after。它们支持继续把该底图作为隔离功能测试基础设施；没有发现需要立即撤销当前正确配置的理由。

root明确本次只运行普通python3、没有-O/PYTHONOPTIMIZE；本报告未发现本次演练曾跳过assert。恢复工具另有可执行反例：Python优化模式会移除全部assert，连带移除锁定守卫查询和最终校验，却仍执行DELETE并输出成功布尔。修复前不能宣称精确恢复工具在其可接受启动方式下已经可靠fail-closed，也不应进入真实restore COMMIT。此项不否认root记录的普通模式dry-run已发生，但该记录不足以覆盖优化模式反例。

本轮没有独立重跑UI保存/重开或真实恢复事务；图片可支持“截图时看到网格”，不能单独证明导航过程、网络零错误或事务运行。Runtime JSON是Builder执行记录，经过静态和部分独立事实交叉核验，仍不可称独立复现全部A–D步骤。环境结果不提升任何49类型、38义务、真实权限、完整MVP或Goal验收状态。

## 读取与输入冻结

本轮复用已读根AGENTS和项目内SGE kernel，重新读取validation recipe；完整读取本卡及rendered prompt、r002方案与独立设计审查、Runtime/Preservation、helper全源、fixture结构、两张截图、Toplogy-r512和文件/配置admission。沿源码核对SysParameterManage、CoreSysSetting、OnlineMap/OnlineMapCustom、map store、custom-online-map控制流。Goal的38项完整ledger与P1/P2规则延续本lane前一任务已确认基线，本卡Goal SHA保持一致，没有重新改变完成合同。

| 输入 | 已核验摘要/状态 |
|---|---|
| r002方案 | `c1ff2276cfecd71a8be5ff4ef9c5bfcd22133533bf9692b8431734c71360ca16` |
| r002设计审查 | `4c47c7928d1751d81d92d491ba0f48e99670051dad65c61aed2408aab9e5ba6f` |
| Runtime | `e56b920802ad4bf95e6d990ee3df720ea4e2ae18b20967347d95919e64670402` |
| Preservation | `fbf87b6e9646cbe4d2c5fb65acf42ae9edbdef0289057e8d226d61353fbdaa65` |
| helper | `79610a4257eb412bd2a6a7bd85e6af53ed316bf97f16afcde263c8cd84dc1c0e` |
| fixture | `00d1393ba45e7af468cb882b134c664209df9ba14b788b94a904bd1f4037cdcd` |
| preview截图 | `88ce1f0aad4342312b89a8bdfa8e2144a1bf2413dcbddc1ebcaa8731dfee7f35` |
| reopened截图 | `ed5f4e9dad55872bd97abe1691126d6aab3b41d8367f26ca82443eb5bbd899ee` |

截图分别为`evidence/LocalBasemap-preview-r001.png`和`evidence/LocalBasemap-reopened-r001.png`。截图显示自定义地图、矢量Style JSON、本地版本URL、0–18缩放及“仅用于功能验证”说明，右侧均为清晰网格；未见覆盖在其上的错误提示。截图不是浏览器错误事件日志或导航回放。

私密目录/备份按卡限定读取并只输出摘要、数量、权限和相等布尔，未打印原始行/值、主机字段、凭据文件或其他供应商秘密。所有只读输出均未新增到仓库；本lane唯一持久输出为本报告。

## 独立实际核验结果

1. **文件/HTTP**：本机7070对同源fixture GET返回200，响应字节与冻结fixture完全相等。初始沙箱socket/HTTP连接不可达；获准以同一只读范围执行后成功，不构成产品失败，也没有扩大到UI或写事务。
2. **fixture**：MapLibre Style v8，1个内联GeoJSON source，background+line两个layer；37条经线、17条纬线，共54 feature/2462坐标；全部LineString、有限数值，经度[-180,180]/纬度[-80,80]，相邻经度变化最大5度。没有http/https/mapbox资源、glyphs、sprite或tiles引用，metadata明确test-only。无需商业底图密钥，也不包含行政地理oracle。
3. **有限私密备份**：目录0700、before/after文件0600，文件均非symlink；两个文件摘要分别匹配冻结记录。before行数0，after行数14；两者固定key列表和实例identity一致。after的14键pval整体等于工具EXPECTED，id/pkey/pval/type/sort完整，type/sort符合该次新增默认值；未输出这些原值。
4. **独立只读DB**：仅通过helper现有连接参数读取身份与14键，不读取凭据内容；独立进程查询确认identity等于after、全部原始行与after逐字段相等、14行且无重复pkey。未执行`START TRANSACTION`、DELETE、restore或dry-run；连接close发送的ROLLBACK没有对应写事务。
5. **工具静态语义**：普通模式仅支持before全缺失，固定14键；before/after SHA、目录/文件模式、identity、完整after行相等均有检查；DELETE限定固定键和after id集合；SERIALIZABLE+FOR UPDATE后才删，事务内空态校验，再按action回滚/提交并读回。私密完整值不进入SQL日志，stdout只输出安全摘要布尔。异常正常通过finally关闭连接并ROLLBACK，stderr被私密临时流吸收。
6. **纯内存负例**：用当前helper源分别`compile(..., optimize=0/1)`，只替换DB为内存FakeDB，借助已有私密快照进行比较；没有启动真实数据库子进程，没有真实事务或写入，也没有修改helper。普通模式的错误identity、after漂移、错误摘要均在DELETE前拒绝；优化模式均继续发出Fake DELETE且不执行LOCK_READ。正常dry-run/restore的Fake分支分别回滚/提交；该模拟仅核工具控制流，不冒充数据库实际演练。

## 全部发现

### LBV-F01｜P1：assert使优化模式绕过精确恢复守卫及锁定读取

**位置**：`local-basemap-tools/config_guard-r001.py:16,30,39–54`，尤其52行`assert db.rows(lock=True)==after['rows']`、54行事务内/提交后readback都在assert表达式内部。

**触发**：启动时使用Python合法的`-O`/`-OO`或环境`PYTHONOPTIMIZE=1`。该工具没有在建立DB连接前拒绝优化模式。Python编译直接删除assert整句；不仅比较消失，检查表达式内的`db.rows(lock=True)`也完全不运行。

**独立反例结果**：

| 纯内存case | 普通模式 | optimize=1 |
|---|---|---|
| 正常dry-run | LOCK_READ→Fake DELETE→ROLLBACK | 无LOCK_READ仍Fake DELETE→ROLLBACK |
| 正常restore | LOCK_READ→Fake DELETE→COMMIT | 无LOCK_READ仍Fake DELETE→COMMIT |
| 错误实例identity | AssertionError，无DELETE | 完成并Fake DELETE |
| 当前行漂移 | 取得LOCK_READ后AssertionError，无DELETE | 无LOCK_READ，完成并Fake DELETE |
| 错误after摘要 | AssertionError，无DELETE | 无LOCK_READ，完成并Fake DELETE |

**影响**：实际restore可以在未核实例/摘要/当前值、没有受保护读取的情况下删除固定14键中匹配id的行。删除范围仍受静态WHERE和id限定，不是任意库任意行，但合同要求“漂移严格拒绝”的核心保证失效。最后固定输出的guard_matches/transaction_restore_matches_before/independent_readback_matches仍为True，会把未执行的检查写成通过。

**修复建议**：把安全前置、锁定读取及readback改为不可被优化移除的显式条件/异常；至少在任何DB连接/副作用前显式拒绝优化模式，并将有副作用的锁定读取放到assert之外。补充无真实DB写入的错误identity/摘要/漂移与优化模式负例，再按新helper摘要提交增量验证。不能只在说明中提醒“不要-O”，或仅把成功输出改字眼。

**处置/准入影响**：未由Validator修复。阻断恢复工具有界通过和真实restore提交准入；当前正确底图与只读环境证据可保留，独立地图功能验证无需因此全部停滞。下一修复使用本交付物第2/3轮，不新增或重置设计预算。

### LBV-N01｜P2证据上限：恢复演练与排他窗口仍主要来自Builder记录

Runtime记录了持锁时间、fresh-before、正常POST成功、事务恢复前态后ROLLBACK、独立after读回；本lane没有获准重跑这些写步骤，也不擅自执行。当前独立after相等与静态正常模式流程为这些记录提供交叉支持，但不能重建过去锁窗口，也不能由图片确认POST或事务全部过程。报告只有结构化结果、未附逐SQL原始执行记录或独立事务执行者证据；因此只表述“root记录演练，当前after独立核实”，不表述“Validator独立完成回滚演练”。

该证据限制不等于认定root没有执行；也不要求为重现而立即恢复配置。root后续归档现有安全日志时保持脱敏，不通过打印原始SQL/快照补证。

### LBV-N02｜P2既有残余：全局provider与flock、客户端缓存边界

map.mapType为实例全局设置，影响该隔离实例后续读取的在线地图客户端；本地flock仅协调遵守该锁的已知写者。正常UI保存没有before/version条件更新，fresh读后至POST之间不是数据库CAS；未观察到非协作写者不等于排除它们。没有改造全局并发协议，本轮不扩为产品修复。

源码保存成功会setKey更新同一客户端store，离开重开表单仅更新mapEditor；未来真实restore提交之后必须完整重载相关测试客户端。已有其它客户端可能保有旧配置，DB相等不能证明它们画面恢复。当前演练未提交，所以配置仍为本地网格而非恢复空态。

### LBV-N03｜P3操作澄清：工具是本次空前态专用，且缺action时拒绝

r002包含通用更新/重建before行描述，但当前工具明确只接受before全空、恢复仅删本次新增14行；这与本次实际before0和Preservation“仅支持本次全缺失before”一致，不将其称通用配置恢复。未来before非空必须新审，不得放宽断言直接复用。

argparse要求显式action，省略时退出且不连接DB；并非自动执行dry-run。显式`dry-run`做实际事务删除后ROLLBACK，显式`restore`才COMMIT。此差异fail-closed，不单独阻断，但操作说明应明确，不能把dry-run当只读命令。私密tmp可能被清理；只有文件仍在且摘要/权限一致才具备恢复输入，不是永久备份。

### LBV-N04｜P2非阻断：DB命令等待和关闭缺少端到端deadline

**位置**：helper:20–34。`DB.q`在stdout.readline上阻塞等待随机结束标记，没有命令deadline；`DB.close`先调用同一q发送ROLLBACK，之后才执行`wait(timeout=10)`。因此该10秒仅约束最后进程wait，不约束rollback/readline本身。活着但不再输出的mysql进程/阻塞数据库响应会令脚本和清理路径持续等待；错误分支也可能卡在finally，无法及时给出可定位失败。

这是源码可见的有限等待缺口，**本lane没有观察到真实DB挂起，也没有人为锁表或制造连接故障**，不据此推翻当前普通模式的成功记录。可以在r002做局部有限超时、异常时关闭/终止客户端及等待退出，并明确“未取得确认的COMMIT”属于结果未知，不能自动重试删除或输出成功。不要把所有超时都压成恢复成功；不需要引入通用数据库任务框架。该项为非阻断运行恢复性改进，核心准入阻断仍仅LBV-F01。

## 已检查无问题及同类残余

- 11个custom业务字段、2个custom空凭据字段及全局mapType合为14键，与后端真实保存集合一致；未把queryOnlineMap投影当原始备份。数据库id以字符串保留，Python整数无JS精度问题，完整原始列作相等比较。
- SQL字符串只有常量allowlist，DELETE使用int转换的id；不将私密pval插入SQL或公开日志。普通模式大小写/排序规则导致多匹配行时，会在精确原始行比较阶段暴露为漂移；没有仅凭默认collation等值宣称逐字节恢复。
- 原before全缺失，使当前工具不需要执行UPDATE/重建/UTF8值literal；没有用不必要的通用迁移逻辑扩大范围。
- 目录/文件权限、摘要、非symlink及预期payload均独立核验通过；未读取无关数据库或供应商密钥。工具的凭据文件仅由mysql按既有参数使用，没有读取或打印其内容。
- Fixture只新增测试静态资源，没有修改地图产品接线、第三方库或配置UI；新路径版本固定，适合现有按URL缓存，不能把旧缓存行为推广到其它URL/部署base path。
- 系统表没有pkey唯一索引，固定范围FOR UPDATE可能因扫描在短窗口影响更广配置写；设计/Preservation已说明，不夸称只锁14行。真实事务引擎当前为root记录的InnoDB，本lane未修改引擎或隔离级别。
- 同类assert风险也覆盖backup/check-before/capture-after的权限、空前态、摘要与payload验证；LBV-F01修复应一次处理或统一拒绝优化模式，不能只修最后一处比较。stdout固定True只能在实际完成不可省略校验后输出。
- 未发现除LBV-F01之外的新实现阻断；LBV-N04为有源码依据但未现场触发的有限等待缺口。没有在首个问题处停止检查，完整检查了fixture/HTTP/截图/原始备份/当前DB/恢复正常与失败分支/全局影响和声明边界。

## 未检查及原因

未重跑UI保存、离开重开、实际MapLibre交互、浏览器网络错误采集、持锁窗口、dry-run或restore写事务：本卡明确禁止这些动作，root现有证据按其层次使用。未真正COMMIT恢复；root原记录亦明确committed=false，不能称恢复已经完成。

未操作S02业务仪表板、flow/heat/symbolic合法轴与双向copy/paste、query次数/500与200独立oracle、显式保存离开重开；这些是环境就绪后下一工作，不由底图配置代替。未检查生产地理精度、商业服务、跨origin/base path、分享/嵌入/移动端、真实多用户权限、完整49类型/插件或38条最终验收。

未执行构建、安装、部署、产品修改或共享Dashboard/KB更新；纯fixture/helper审阅没有理由触发这些副作用。没有把脚本加载或纯内存模拟称为真实数据库事务验证，没有运行未授权的恢复动作。

## 修复后准入预测与下一步

LBV-F01用最小修复关闭并经第2/3轮针对性delta验证后，预计可给专用恢复工具有界通过；应保持当前before/after冻结值不变，工具改版绑定新摘要和negative结果。是否需再次演练由修复影响决定，不得由本lane擅自执行真实写事务。

当前独立HTTP与DB只读事实已支持保留本地网格，继续隔离功能测试所需的正常地图工作。flow/heat/symbolic各自正常数据轴、双向复制粘贴、每次1逻辑query、独立oracle与显式save-reopen仍须真实运行后独立验收。原P1 12+P2 26=38义务、49内置类型和installed插件unknown均保留；本环境不使任何完整AC通过，不终止Goal。
