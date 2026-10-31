# 查询过滤产品提交合同 r001 独立设计审查

## 双结论

- **Design Freeze Validity：NEEDS_REVISION（需要修订）**。已定位真实配置弹窗、整根发布和预览事件候选入口，边界说明正确，但事务 I/O、身份重建来源及失败观察仍不足以冻结可执行合同。
- **Implementation Entry Readiness：NOT_READY_FOR_BOUNDED_ADMISSION（尚不具备本切片有界实施准入条件）**。不是因为所有完整产品形态尚未实现，而是当前承诺的单条件事务已有下述具体缺口。本文不签发 admission。
- 完整分母保持10 Goal AC＋14 F01＋Q066/Q067＝26义务、16产品义务；无 Scope Delta。权限验收仍 BLOCKED / NOT_RUN；不关闭保存回显、跨标签、TTL/容量或父 Goal。

## 接收绑定与检查范围

接收端执行 SP-010 card validate/render 均 exit 0，canonical SHA `c4e41079139703b83da19cce5ca01a8e582720a087de6d4436506d23d758e793`；Context validate exit 0，raw SHA `cea01ceac14f702a915eeb006d07fdeab9e8eb23b81bf9d10a17d627b33410cf`；17项 required_read 摘要逐项复算一致。

审查 Design raw SHA `5bdf606bd906a5cf39a2807bf018225499ff59512aa0c420591d696f89e46b04`、Cases raw SHA `1f39af8fda9123e4e20ee7b923d662b1de98550a2092169933ca7c3c6a9594aa`；绑定 Goal.final、QTARGET r008及fixtures、QSL r003及fixtures与实际 Vue/Pinia 调用链。接收上下文拓扑为 r168，SHA `b1d9ed5226a4bbc846c4bdae3f48130de582123d84aa688a16e972943979ec79`，其时间戳异常说明保留，不据此推断执行先后。收尾所见最新拓扑在文末记录。

工作树已有大量其他改动，本轮未修改源码、测试、设计、fixtures或既有证据；只写本报告。未构建、启动应用或运行真实网络/数据库测试。追加读取 session owner、canvasUtils 和公开 SDK API 用于核对生命周期及鉴权边界，不读取/复制 XPack 专有实现。

## Findings

### QPCR-01 / P1：Cases 不是完整可执行事务 oracle，失败顺序仍有多解

**证据：** Design:29、31、33规定 exact-key 输入和固定结果；Cases:22使用未定义解析规则的 `$ref: complete-target-condition-from-r008`，QPC-001:38–50以 sameDataset/signatureMatches 布尔及 candidate/publishedRoot 字符串代替完整输入输出，缺 sourceRoot、targetRoot、expectedTargetSignature、actorContext 等。QPC-003/005/007各以 `or` 给多个失败阶段；失败结果普遍没有 reason。QTARGET实际case ID是 `TC-QTARGET-REBUILD-001` 等，而Cases引用仅列短号且无确定JSON pointer、摘要及展开规则。

**影响：** Builder可自行补全关键输入、选择失败分支并产生“绿色测试”；无法比较零副作用时完整根/引用、历史/预览状态，也不能复现首错优先级。引用完整条件并不能自动提供产品事务的完整状态。

**建议：** 给每个 QPC case 完整初态、exact-key输入、事件序列、完整终态与单一 stage/reason；允许内容寻址去重，但必须有确定展开器/规则与固定依赖摘要。拆分全部 or 分支并补双错优先级，明确确认前检查与确认后复验的阶段顺序（取消时不执行何种后续检查）。将根引用、selection、草稿、历史cursor/长度/cache、预览identity/count及查询计数纳入oracle。动态commitId可用明确不变量，不能用任意字符串代表完整结果。

### QPCR-02 / P1：同步整根发布与现有私有 owner/保存 overlay 的协调缺失

**证据：** Design:24/31只要求新完整根替换目标字段；`dvMain.ts:526–528` 的 setComponentData仅赋值，不更新私有owner。`query-single-select-session.ts:349–355`只登记一个顶层 VQuery；386–431提交会更换capsule/currentComponent/revision并门控，434–450 reader要求当前raw identity，560–563查询门控比较对象身份。`Component.vue:815–816`消费门控。`canvasUtils.ts:845–875`在open会话中找第一个VQuery并读取同一owner的design overlay。

**影响：** 原本处于open的受管组件若被新action直接深拷贝替换，owner仍持旧raw身份，queryData可直接拒绝，reader/capture也无法按承诺取得新设计。两个查询组件场景与现有单实例owner并非天然兼容；跨仪表盘、unmanaged及同画布支持谓词没有区分。设计“运行选中值保持原值”(31)与目标runtime从A初始化(39)也未区分目标/非目标范围。

**建议：** 冻结本切片支持的owner阶段、画布/查询组件数量、跨画布边界；指定唯一product action及具体文件/签名，明确其与owner的raw/capsule/token/revision、curComponent及配置草稿的更新或受控降级协议。决定新目标究竟发布design还是runtime、保存overlay存在哪里，并补open/unmanaged入口、预览门控、保存读取及撤销恢复的完整观测。不得把普通JSON重新认证为私有来源；也无需为本切片一次性支持所有未来shape。

### QPCR-03 / P1：一次快照与“所有失败零副作用”尚无可实现提交顺序

**证据：** Design:24承诺同步发布后恰一次快照/预览，又要求回调不抛错或同步回滚。`snapshot.ts:87–97` recordSnapshotCache只在dataPrepareState时增加cache计数/编辑代次；实际追加在215–247的recordSnapshot，受mobileInPc、snapshotDisableTime、dataPrepareState控制，并写wsCache。`QueryConditionConfiguration.vue:1649–1664`排nextTick后发事件；session owner:409–430发布或事件异常只失活并传播，未回滚。`Component.vue:881–884` queryData按映射图表逐项发事件，不能将一次UI调用等同一次网络查询。

**影响：** 直接沿现有缓存入口无法保证snapshotAppend=1；同步整根赋值不构成历史、selection、owner与异步查询的原子事务。已经发出的查询不能靠同步根回滚撤销；QPC成功计数及异常零副作用目前不可同时检验。

**建议：** 选定准确快照入口与前置门槛，区分缓存标记、实际历史append和预览调度/实际查询次数，给出固定顺序与异常点状态。将所有可拒绝的准备移到发布前；若承诺回滚，列出可回滚的完整状态与不可外发副作用的边界并给异常注入oracle。若仅保证提交后预览调度成功，应明确提交后网络失败语义及反馈，不能把已发布失败冒充写前拒绝。对多targetRefs按实际受影响图表定义计数，或明确收窄本次可准入输入条件并保留其余原义务。

### QPCR-04 / P1：目标默认值枚举有效性门槛丢失，不能由QTARGET成功替代

**证据：** QSL r003修订说明及defaultValue/defaultMapValue行明确：目标枚举缺默认值，保留无效候选，解决前阻止确认、目标及副作用不变。QTARGET r008算法仅检查JSON、QCARRIER、referencePlan和字段目录；其实现不请求/校验目标枚举。Design:22–24在适配准备成功后即可确认发布，输入:29也无枚举状态/版本或确认阻止状态；Cases无“目标缺A”完整轨迹。

**影响：** 源默认A在目标枚举缺失但字段ID存在时，可通过现有QTARGET并被提交，违背已冻结的写前默认有效性规则。此问题不同于运行时迟到响应缺用户新选C。

**建议：** 指定目标枚举验证的真实入口、依赖身份/版本及loading/失败/缺值状态，明确何时能确认，补缺A拒绝且完整目标不变的oracle。保留用户C裁定：初始迟到响应缺C仅追加一次核对；核对结束关loading，仍缺则保留无效选择，不额外重复请求。不得将该运行期策略套成允许无效默认配置提交。

### QPCR-05 / P2：产品级字段映射与候选绑定仍交给调用方猜测

**证据：** QTARGET r008明确要求 `{source, referencePlan, targetComponents}`，只验证给定计划，不从目录自行选目标；fixture001使用q-new、chart-B。Design:29仅接受preparedCandidate，未规定referencePlan/目录如何从真实画布提取、新conditionID在哪个命名域去重、如何绑定候选到source/target版本。所称“完整输出之一”亦未固定design/runtime分支；来源/目标VQuery ID和checkedFields内图表ID属于不同身份域。

**影响：** 同数据集不足以决定源chart-A要映射到哪个目标图表；准备后图表/字段变动或调用方替换candidate仍可能提交。单条件与源ID不同也不证明在目标画布全局唯一。

**建议：** 冻结计划生成来源与算法（可选一个既有确定映射路径，不新增人工字段映射产品功能），给完整目标目录和不可变ID示例，规定命名域/冲突拒绝/适配依赖签名。由真实rebuild函数产生不可替换准备句柄，或提交前以绑定输入复验实际候选，不能信任“来自重建器”的文字标签。明确非目标状态保留和目标runtime重置各自范围。

### QPCR-06 / P1：真实授权契约未绑定，当前不能放行产品UI激活

**证据：** Design:9/29/45承认权限实现和隔离环境未就绪，authorization仍是未定义结构的“本次API结果”，Cases:43/68为文字。公开 `DataVisualizationApi.java` 已有findById的read与updateCanvas/checkCanvasChange的manage注解，saveCanvas使用父目录manage；这些是独立操作契约，并非本合同当前身份＋源数据访问＋目标编辑的已验证授权票据。设计未指定调用哪个可只读服务、主体/组织/资源/操作字段及请求期间撤权的处理。

**影响：** 不能证明授权可在不写数据的前提下每次重验，也不能保证只读用户在打开/复制源配置之前不获得敏感配置；仅粘贴时检查目标编辑权不足以覆盖Goal的不可查看/复制要求。不得调用保存API探测编辑权，或把目录/按钮/mock成功当真实授权。

**建议：** 指定并核对公开只读授权API（或现有公开受保护读取操作的精确组合）与真实主体/组织/目标绑定、失效/撤权/不可用处理；明确查看、复制、确认三处门控。若现有契约无法表达，精确外部blocker为维护者提供可用授权公开契约及合法访问路径；若表达成立而仅环境缺失，则单独保留真实验收NOT_RUN，不自动阻断已冻结的纯准备工作。本文没有全仓证明“API不存在”，当前判定是本提交合同尚未绑定可用契约，且派发记录明确真实环境不可用。

## 最小修正顺序与准入边界

1. 先修 QPCR-01/05：展开一条真实成功事务及每种失败的完整状态，冻结计划来源、ID域、候选句柄、signature和确定首错。无需重写QTARGET/QCARRIER算法。
2. 修 QPCR-02/03：选定一个当前owner可兼容的产品入口及快照/预览时序，明确发布后异常与写前拒绝；给出可由源码实现的步骤而非“必须证明原子”。
3. 修 QPCR-04：接入可判定的默认枚举确认门槛，保留C裁定，不制造新待决用户问题。
4. 产品UI激活前解除 QPCR-06 的公开契约依赖；真实环境验收独立跟踪。在此之前，后续可另提无活动入口、无网络写、无来源认证的detached事务准备测试切片，但需要完整oracle和单独审查/card/admission，本报告不自动批准它。

这些均是有限、可修正的设计事项；只有真实权限公开能力/隔离身份环境的供应依赖需要外部条件，不能靠重复文档或mock消除。空目标/多条件等留在原分母，不以当前支持域拒绝永久关闭。本文没有新增完整schema、服务器CAS或额外审计体系作为阻断条件。

允许压缩结论：**产品提交r001已找到候选入口，但事务oracle、owner协调、快照异常、默认枚举门槛及授权绑定尚未冻结，不具备UI/Store激活准入。** 不得压缩为“过滤粘贴已支持”或“只差真实权限验收”。

复核收尾最新拓扑：`Topology-actual-r168.json`，raw SHA `b1d9ed5226a4bbc846c4bdae3f48130de582123d84aa688a16e972943979ec79`。其内容为：

```json
{
  "recorded_at": "2026-10-20T10:13:11Z",
  "parent_snapshot_ref": "Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r167.json",
  "phase": "QSLR2-01/02 targeted repairs r003 independently reviewed PASS; full product schema/commit contract and Builder admission remain open",
  "execution": [
    {
      "lane": "design_delta_review",
      "identity": "/root/s02_query_schema_review",
      "task_id": "S02-QUERY-ADAPTER-FIELD-LIFECYCLE-DESIGN-REVIEW-r003",
      "state": "completed_bounded_review",
      "scope": "reviewed only QSLR2-01/02 repairs, card/context/input digests and the user-authorized late-C policy; no source/product edit"
    }
  ],
  "outputs": [
    {
      "path": "Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySchemaLifecycleMatrix-r003.md",
      "sha256": "8ed2bb9dfd5598161067a4c4e8d31ab15adece5213967385bc060ab4defb95f9"
    },
    {
      "path": "Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/QuerySchemaLifecycleMatrixFixtures-r003.json",
      "sha256": "0d7828db13a90770b516e866ec57c7bde54d21ba56a2a01c56488f72289cd69b"
    },
    {
      "path": "Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/reviews/QuerySchemaLifecycleMatrixDesignReview-r003.md",
      "sha256": "3adfd23e039b866ae485337ba2474c63dc533b3af63004b8b8a9c65adea47175"
    }
  ],
  "goal_denominator": {
    "goal_ac": 10,
    "must_have": 26,
    "product_obligations": 16,
    "scope_delta": "none"
  },
  "blockers": [
    "DG-01 real permission implementation and isolated multi-user environment unavailable; permission acceptance BLOCKED/NOT_RUN",
    "QSLR-02 precise unlanded product shape and actual target commit entry remain open"
  ],
  "next_action": "freeze one unlanded source-supported product invocation/commit shape with full input/output, field actions, identity mapping, success/reject oracle and no-side-effect assertions; independent design review, then target-bound Builder card/context/admission",
  "chronology_note": "Topology r167 carries recorded_at 2026-10-20T11:25:00+00:00, later than the local UTC clock observed at r168 creation (2026-10-20T10:13:11Z). The parent relation follows evidence dependency; the timestamp discrepancy is preserved, not normalized."
}

```
