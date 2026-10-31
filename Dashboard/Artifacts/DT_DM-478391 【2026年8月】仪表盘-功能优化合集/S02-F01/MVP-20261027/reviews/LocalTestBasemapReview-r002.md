# 本地测试底图环境方案独立审查 r002

- 审阅时间：2026-10-29T13:15:52.040904+00:00；reviewer：`/root/local_basemap_reviewer`；Session：`DE-EXEC-S038`。
- 本环境方案审查累计 **2/3** 轮。首份 r002 卡 schema 错误未派发，不另计一轮；与其他交付物的轮次分离。
- 接收端调用项目本地 `lane_task_card.py validate`，canonical SHA `d48f1806f1ddec4715ecf71e81b58fc222ac172867e2565c51e4bf779d746dbc`，exit 0 / PASS。Goal 与 5 项 base refs 共 6 项输入 SHA-256 均一致，写报告前复验未漂移。
- 本 lane 只读方案、源码及治理材料，仅新增本报告；未读取凭据、数据库值、浏览器/profile，未请求配置 API，未修改产品或环境。使用项目本地 SGE Semantic Review recipe，同时检查边界与实施入口。
- 用户已批准“允许准备并配置本地测试底图”；无须为同一范围再次取得授权。P1 12 + P2 26 = **38** 项义务、**49** 个内置类型完整保留。本审查不宣布任何原 AC、地图类型或 Goal 通过。

## 双裁决与分阶段准入

**Design Freeze Validity：PASS WITH FINDINGS（设计边界通过，保留执行条件）。Implementation Entry Readiness：分阶段；文件/恢复工具准备 PASS，实际配置保存 WEAK（须先落实下列操作前置）。Overall Verdict：PASS WITH P1 FOLLOW-UP（设计可推进，保存前仍须完成 P1 操作条件）。**

r001 B1/B2 已在设计层修正：全 14 键原始行私密保全与守卫事务恢复，能够表达 UI/API 不能表达的缺失行恢复。当前可以准备不可变 fixture 和专用恢复工具；不能将本裁决写成“工具可用、已配置成功、已恢复成功”。工具/快照/实例身份/实际 UI 预览等仍是实际保存的前置。

根 Agent 已明确本树当前只有 root 为环境 Builder，本 reviewer 和 Bubble Validator 均禁止 DB/UI 写入；拟在配置窗口持有本机 0700 目录下的排他 flock，暂停本树其他环境写，fresh 14 键比较后由唯一测试客户端保存，立即 capture-after 再释放。这是本机隔离实例可执行的操作前置，可在现有授权内落实。排他 flock 只协调遵守它的本机写者，**不等于后端 CAS，不保证排除未知/非协作客户端**。不因尚未观察到的外部写者要求新增人类确认；也不据此声称全局并发保护已经实现。

7070 当前未运行而 8100 仍运行是根 Agent 提供的环境状态，本 lane 未运行端口检查。它不阻止文件与工具准备；HTTP/UI 阶段必须等实际能力恢复，不预填成功。

## r001 全部发现的处置

| 原编号 | 本轮处置 | 证据上限与剩余条件 |
|---|---|---|
| LBM-R1-B1 | **设计层关闭** | r002:10–13 不再承诺 UI 精确恢复空态；固定键、原始 before/after、守卫事务、默认 dry-run、显式 apply 与独立读回替代。实际恢复工具尚未执行，本裁决不证明其可运行。 |
| LBM-R1-B2 | **设计层关闭** | r002:10–12 覆盖 13 custom 字段及全局 mapType，保存存在/缺失及 id/pkey/pval/type/sort，秘密仅私密备份；不再用 queryOnlineMap/normalize 投影证明原始空态。计划“14 键当前缺失”是 root 已有只读观察，本 reviewer 未独立查 DB；保存前必须重新保全。 |
| LBM-R1-N1 | **范围修正完成；操作条件待执行** | r002:16 明确整个隔离实例的 active provider 会切换，并非三个画布私有。保存窗口的并发保护见本轮 F1；不能把最后一次读取称为数据库原子比较后写入。 |
| LBM-R1-N2 | **设计处置完成** | r002:11、17 限制前态只出路径、摘要、布尔与身份，完整原值不进仓库；新无秘密 fixture 截图才可落盘。执行日志、异常和私密 after 同样应遵守。 |
| LBM-R1-N3 | **执行条件保留** | r002:12、17 要求实际网格、无资源错误再保存；仍不可用 canSave/HTTP200 代替渲染成功。未执行 UI，状态未观察。 |
| LBM-R1-N4 | **设计处置完成，适用域保留** | 仅 7070 本地同源路径与不可变版本文件；不扩大到 8100 页面、base path、分享、嵌入或生产。实际 HTTP/缓存验证未执行。 |
| LBM-R1-N5 | **关闭** | 本卡 task_id 为 local-basemap-review-r002，rebaseline_ref 为 r511；r511 标识 basemap_design_review_r002、独立 reviewer 与 2/3。执行 admission 仍需绑定真实环境目标，不能拿本审查卡代替 write admission。 |
| LBM-R1-N6 | **证据边界保留** | 静态读写范围已复核；没有把当前源码等同正在运行 jar 的完整行为。正常 UI/API 与原始行读回仍是执行必需，未声称已验证部署一致性。 |

## 全部本轮发现

### LBM-R2-F1｜P1 必须跟进：正常 UI 保存的比较窗口要由本机操作排他约束

**依据**：r002:11 保存前“重读并比较”与 :12 正常 UI 保存不是同一事务。`OnlineMap.vue:289–301` 发普通保存请求；`SysParameterManage.java:118–149,263–274` 按 pkey 查找后无条件写入，没有 expected-version/before-digest 参数。恢复工具的 after 守卫仅保护恢复阶段。

**最小反例**：fresh 比较后另一协作写者改动 custom 字段，随后 UI POST 覆盖它；最终值正好仍是本次 payload，after 快照不能证明中间没有被覆盖。不能把保存前读取或恢复事务的 SERIALIZABLE 移植成保存阶段已经具备的保证。

**处置**：根 Agent 上述本树单一 Builder、其他 lane 禁写、排他 flock、唯一 UI 客户端、立即 after 保全的操作前置，足以在本次已知本机协作拓扑下继续，不要求修改产品或新增人类授权。实际执行记录应绑定持锁起止、写者范围、fresh 比较和 after 摘要；若发现其他配置写者/异常漂移，就停保存或停止后续验收并按既有守卫处置。不要持有会阻塞该 UI 保存的同一 14 键数据库行/间隙锁等待 UI POST，这会让自己的保存等待或超时。

**状态**：操作方案已明确，实际窗口尚未建立，保存前必须落实。此项是 r001 N1 的具体落实，不新增产品并发能力要求，也不因操作前置未执行就阻断文件准备。

### LBM-R2-F2｜P2 执行澄清：数据库恢复后应使用完整页面重载刷新 store

**依据**：`OnlineMap.vue:307–324` 的 initLoad 只更新 mapEditor；只有保存成功回调 :299 调 mapStore.setKey。`map.ts:24–27` 会置 mapKeyLoaded=true，L7 `l7.ts:156–160` 及 BasicStyleSelector:343–345 在 loaded 后不再主动查询。

因此“离开再重开在线地图”能够读回表单，却不自动证明所有已有页面的 mapStore 已刷新。正常保存成功的同一客户端会 setKey，本轮保存流程不因此被阻断；恢复 dry-run 没有提交，也无须伪造 store 变化。如果未来真正 apply 恢复，需完整重载相关测试客户端并重新正常读取，然后区分 DB、表单和图表三层。不同既有客户端仍可能保有旧 store。

**状态**：非阻断执行澄清；不要求改产品 store。禁止把 DB before 相等直接提升为其他客户端画面已恢复。

本轮没有其余设计阻断。恢复工具尚未落地、当前 UI 尚不可用属于明确的阶段前置，不另外计作“设计必然失败”。

## 已检查无问题的维度

1. **真实写集合**：源码 custom 保存写 11 个 CUSTOM_MAP_FIELDS、清空 custom key/securityCode，再写 map.mapType，共 14 键；没有写 gaode/qq/tianditu 供应商凭据。全局 provider 的影响与其他供应商秘密保全是不同维度。
2. **原始形态**：CoreSysSetting 的持久列为 id/pkey/pval/type/sort；计划覆盖全部列与缺失状态。保留 ID 精度、字符串字节与空/缺失语义，不借 JPA 非空合并切面恢复。事务范围拒绝重复 pkey，避免把当前非唯一 pkey 当唯一约束。
3. **恢复算法**：先校验库/端口身份与 before/after 摘要，再锁定固定键范围核对当前全部行，漂移回滚；只按 before/after 差异删除本次新行、更新或重建原行；同事务校验目标 before 后 dry-run 回滚或显式 apply 提交、独立读回。对当前计划所述 before 全空，恢复仅撤销本次新增行。此算法设计满足精确恢复目标，不是整库回滚。
4. **保密与写域**：随机私密目录 0700/文件 0600、秘密不出仓库、缺备份或摘要漂移拒绝恢复、范围外键不操作，符合本机测试配置恢复边界。UTF8 hex literal 避免把原值作为 SQL 代码拼接；它不是加密，工具也不能把 hex 形式原值打进执行日志。
5. **底图接入**：customTile+vector 是现有正常路径。OnlineMapCustom fetch JSON 后创建 MapLibre；common_antv.getMapScene 的 custom 分支调用 getCustomOnlineMapScene，没有要求假 key 或替换 L7。站内 URL 与 zoom 0–18 被现有校验接受。
6. **数据与资源边界**：内联自生成 GeoJSON、background+line、有限经纬度、5 度采点、无外部 fonts/sprites/tiles/key，可以设计为不依赖商业底图资源；不是地理精度 oracle。不可变文件策略适配 custom-online-map 的按 styleUrl Promise 缓存。
7. **步骤与声明**：静态 JSON → HTTP 字节 → 实际网格 → 正常保存/重开与 DB 核验 → 恢复 dry-run → 三地图正常 UI/双向粘贴/query/oracle/save-reopen 的层次清楚。环境完成也不会自动关闭 49 类型分母、38 义务、真实权限或 Goal。
8. **治理放置**：本计划与审查属于 Dashboard 执行证据，没有冒充产品 KB、权限合同或 maintained renderer 能力；没有要求把局部恢复工具泛化为全局配置平台或新增 DSL/God Object。

## 最小实施阶梯与保存前核验

| 阶段/缺口 | 最小动作 | 所需可观察证据 | 不可声明 |
|---|---|---|---|
| A 本地资源 | 按精确 admission 准备唯一 fixture；已存在时仅复用一致字节 | 新增/复用基线、JSON 检查、SHA；7070 恢复后 HTTP 字节 | 实际地图渲染或配置成功 |
| B 精确撤销能力 | 准备固定 14 键、默认 dry-run 的本机专用工具，核实例与私密 before/after 规则 | 工具静态检查；事务引擎/隔离实际支持、精确字符串/整数/缺失状态、权限与日志边界在执行前核验 | 精确恢复已执行 |
| C 正常配置 | 本环境 context/topology/admission、私密 before、F1 排他窗口、实际无错误预览齐备后正常 UI 保存，立即保存私密 after | 键/字段与无秘密 payload 一致；其余列为新增默认或原列精确保留；正常读回 | 防止任何未知客户端并发，或地图产品 AC 通过 |
| D 可撤销性演练 | after 守卫与事务中恢复校验，再 ROLLBACK，独立确认仍为 after | 真正执行的 dry-run 和回滚后读回；异常 fail closed | 已 COMMIT 恢复、灾难恢复、永久备份 |
| E 产品验证 | 返回隔离 S02 dashboard，flow/heat/symbolic 各自正常轴、双向 copy/paste、1 逻辑 query、500/200 独立 oracle、显式 save-reopen | 各类型真实图层、数据及正常保存重开证据，再独立验收 | 全部 49 类型/38 义务或真实权限已通过 |

A/B 可以并行于 UI 能力恢复的独立工作。保存须先具备恢复工具与 before 备份，不能保存后才设计撤销方式。恢复工具的实例身份、固定键 allowlist、按 id+精确 pkey 限定写入、SQL 字符串二进制一致比较及事务引擎均须落实；不能只靠默认 collation 的等值比较冒充逐字节验证。若 after 不符或守卫失败，不放宽匹配、不循环覆盖，保护证据并诊断。此处是对计划既有“精确恢复”的落实，不扩大到其他库或供应商。

该局部方案不需要一个新大 Session 或新的治理对象；在当前 DE-EXEC-S038 中保存 A–D 的环境证据，再继续 E 与既定独立验收。若工具实现实质偏离已审的键范围、事务语义、写目标或秘密边界，应新版本并按影响复核；仅补实际执行证据与本报告已明确的操作条件，无须为同一设计机械增加第四轮或重复人类授权。

## 同类残余、误读测试与语义定位

- **把“配置 ready/设计通过”压缩成“地图已通过”**：属于 S3/L5 过度声明；状态应写“本地底图方案设计通过，配置及地图运行待实测”。工具/fixture 落地、HTTP200、事务 dry-run 各保留层次。
- **把“isolated/排他锁”压缩成“仅三个图表受影响/数据库 CAS”**：属于 S4/L3 歧义；固定是实例全局 provider，flock 只协调已知本机写者，源码没有条件更新协议。同类窗口也存在其他正常配置 UI，但本轮只落实这 14 键，不改造其他设置。
- **把“恢复相等/表单读回”压缩成“所有客户端已恢复”**：属于 S3/L3；真正 apply 后按 F2 完整重载再读 mapStore，未知旧客户端保持未观察。其他缓存配置存在同类风险，本轮不扩产品修复范围。
- **把“14 键空的旧观察”压缩成“当前仍空/备份可省略”**：属于 S5/L5；必须重新取原始 before；输入报告或截图不替代私密原字节备份。/private/tmp 可清理，缺备份时严格拒绝恢复。

当前设计可以在上述明确边界内冻结。Builder 能直接从 A/B 开始；C 的运行准入由实际前置证据决定，不是对未来成功的预判。尚缺的都是可执行环境步骤或产品运行证据，没有发现需改变用户原始范围的 Scope Delta。

## 阅读清单、未检查及原因

**正向阅读清单**：根 AGENTS；本地 SGE kernel、semantic-review recipe、Protocol v2、baseline-and-closeout；绑定 Goal.final.json、r002 Plan、r001 Review、SysParameterManage、CoreSysSetting、Topology-r511；扩读 r001 Plan、TSP、SupportedCharts.counts、OnlineMap.vue、OnlineMapCustom.vue、onlineMap.ts、custom-online-map.ts、map store、sysParameter 前端 API、CoreSysSettingRepository、common_antv 的 custom getMapScene、L7 与 BasicStyleSelector 的 mapKey 加载入口。代码行号以本次工作树为准，HEAD 为 `1e84e7438462e5d6fc371358da3bdad7d24a5c1a`；工作区已有大量其他任务修改，没有覆盖或暂存。

**未检查**：实时数据库/凭据/实际 server identity、事务引擎和索引、原始 14 键空否、工具实现和 dry-run/apply、HTTP、浏览器登录及网格、运行 jar 与全部源码等价、其他客户端、三地图数据/图层/query/save-reopen、其他 46 类型/插件/分享嵌入/真实权限。原因是本 lane 明确只读方案/源码，只写报告。审阅期间发现 fixture 路径已存在，仅核存在性，未把它当作本卡绑定输入或完成其验证；根 Agent 的并行准备不使本设计输入失效。

没有输出密码、URL 原值、Token、秘密 SQL 或数据库记录；未伪造测试通过、独立运行验收、最终 receipt 或注册表程序校验。

## 准入预测

预计无需改 DataEase 产品代码，即可按已授权的本机资源与正常 UI 路径完成环境准备；这是设计可执行性判断。F1 操作排他条件和 B/C 前置齐备后，可进入正常配置保存，无须再次请求同一授权；若实际前置失败，停受影响入口并继续独立工作。完成 A–D 最多称“本地测试底图可用、已观察正常配置与事务回滚演练”，三地图与完整 Goal 必须由 E 及后续独立验证另行给出实际结论。
