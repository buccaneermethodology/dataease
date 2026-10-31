# 查询适配器增量设计 r004

候选，不解除DG-03，不授予Builder或权限/运行验收。只新增本文件及QueryAdapterFixtures-r004.json；写前均不存在。card canonical摘要678299325f14233ab1c422de4244f0743056d367fd15e903f73fff5cc5fa42c7复验通过。继承r003已接受部分，针对独立审查r002的最小缺口补证，旧文件不改。

## QAR2-01：指定编辑来源与新增载体合同

当前可定位入口为QueryConditionConfiguration编辑配置面板；1676–1684从props.queryElement.propValue深拷贝到conditions，1591–1629确认回写。该副本不天然未污染。Component.vue:310–322的oldList也会随propValue引用更新，不能充当不可变设计真源。

建议新增QueryDesignSnapshotStore，明确这是尚未实现的载体，不要求先有运行结果才能设计。键为documentId/componentId/editRevision。canvasUtils.ts:643解析原始componentData时保留不可变原字节；646 historyAdaptor后、667 setComponentData前保存适配后的设计快照。原字节和适配版本分别记录，以免历史恢复过程覆盖来源。必须再核实该读取接口返回授权编辑配置以及此处尚无更早外参注入；未证前不能宣称该hook已经安全。

正常未保存配置由面板候选副本持有，确认成功才发布到载体并递增editRevision；运行选择、外参注入及用户查询重置不更新载体。新增/删除、撤销/重做必须同步设计版本，关闭文档/登出销毁。复制按钮读取载体或同版本未提交面板候选，明确“复制未保存编辑”来源，不能读取运行Store推断默认。

canvasUtils.ts:843–864保存时拟在待序列化副本中用载体的propValue/cascade覆盖对应查询设计配置，保存流程及后端schema保持原有；不把optionFilter注入运行值持久化为新默认。已有历史污染不可凭字段名逆推，应读取可信旧版本或让用户在编辑器恢复真实配置；这是修复来源问题，不能以永久拒绝替代正常成功路径。跨版本兼容与撤销载体同步仍需实施测试。本方案会触及保存拼装接缝，必须独立预审影响面。

## QAR2-02：拆开四条时序

| 路径 | 源码及准确行为 | 粘贴适配器约束 |
|---|---|---|
| Component挂载 | Component.vue:330–338仅cascade.selectValue→current；593–601注册事件/updateQueryCriteria，特定mobileInPc查询 | 不能声称每次挂载都执行resetData的日期求值 |
| 用户重置 | Component.vue:658–747清空propValue再nextTick恢复默认/动态日期；1033按钮调用 | 不得在prepare调用；纯规则提取可借鉴，副作用不可复用 |
| 编辑确认 | QueryConditionConfiguration.vue:1591–1629校验、回填cascade默认，清空再恢复propValue、快照、事件 | 新粘贴使用独立commit，不直接调用confirmClick |
| 查询消费/控件初始化 | Tree.vue:134–143按defaultValueCheck写select；91–105区分配置/运行；useFilter.ts:525–586按参数Arr/End拆端点 | 默认初始化是控件路径，不与父组件onBeforeMount混称；需要验证整体调用次序 |

r003 E09归因因此在本修订明确纠正，旧审查与旧设计保持历史。日期动态结果仍不可从resetData存在推断首次粘贴运行结果；本轮没有完整时间子组件/时区oracle，不编造固定日期。

新补证：treeCheckedList并非普通运行选择，它是树各层图表绑定表。QueryConditionConfiguration.vue:1992–2019生成并切换其checkedFields/Map；2318–2347在旧配置缺表时，oldTreeLoad=false按每层field id重建，true保留原Map。JSON给两种精确恢复/目标重绑定结果。该表须完整复制并typed重绑键，不能剥离。Tree.vue:121–130监听treeFieldList变化会清default/select并取枚举，说明单次Store替换还需处理此watch，不能仅验证最终对象相等。

参数：QueryConditionConfiguration.vue:599–633构造parametersArr并读取type[1]；1730–1755由getSqlParams补元数据。useFilter.ts:525–586消费端点参数对象。完整参数定义应从目标当前API对象按ID取全量，不凭源fixture的id-only对象伪造。其完整schema/type值域仍未证明，JSON明确标合成占位，尚不能作为完整参数可消费oracle。维护者最小输入是一个脱敏getSqlParams真实响应及对应已保存配置，或允许继续读取其开源生成实现；不需要权限模块即可继续静态调查。

## QAR2-03：完整绑定输入与发布接缝

JSON组合了source/target文档、revision、组件conditions/cascade、目标样式、显式chart-A→chart-B绑定及完整候选输出；“完整”限本设计绑定和状态机分母，不冒充宿主可直接挂载的全字段运行实例。目标组件目录由现有QueryConditionConfiguration.vue:1730–1755取得字段及componentId；跨仪表盘对应关系不能仅靠同数据集确定。建议粘贴准备界面在既有目标组件目录中显式选择唯一绑定，以目标ID确认；这是待审UI契约，不宣称已有入口，不使用名称回退。同文档原ID仍存在时也须验证目标范围及字段身份。

条件ID和node ID重生；复合datasetId按三段typed转换，独立fieldId保留/校验。同D1例node.fieldId为空及后继placeholder取现有QueryCascade.vue:151–165语义；placeholder文字应由当前i18n派生，JSON中文字仅语义示意。default/map以及cascade select/current由可信默认重建，目标style保留。

Store接缝：dvMain.ts:521–523 setComponentData一次替换数组根；317–324 aceSetCurComponent先splice后push，**不使用后者作为原子粘贴**。拟在prepare预建包含嵌套目标的完整新数组根，提交同步区做revision比较及一次setComponentData；curComponent等引用应在同一协调器中按ID重新定位。同步watch可能观察引用切换，必须在候选实现增加commitId/发布门控，使查询、快照消费者在提交完成后统一消费；当前无此机制的证据。

snapshot.ts:87–95 recordSnapshotCache只是计数/标记，不保证立即成功持久快照；196–220 recordSnapshot还涉及缓存写入，可能在配置发布后失败。不能把二者当同一原子事务。提案使用commitId标识一次配置发布与待执行副作用，完整成功要求一次快照确认及一次逻辑预览；否则明确COMMITTED_DEGRADED并保留新编辑配置，不自动回滚已被观察的状态。失败矩阵如下，均为设计契约而非已实现能力。

| 事件 | 状态 | 可观察结果 | 责任 |
|---|---|---|---|
| prepare_parse_error | UNCOMMITTED | 原目标/预览/P0/快照不变，0过滤请求 | 适配器返回结构诊断 |
| cancel | UNCOMMITTED | 完全不发布，0过滤请求 | 控制器丢弃候选 |
| target_revision_changed | STALE | 目标保持其当前新版，不回滚覆盖别人编辑 | 控制器重新prepare并重新确认 |
| auth_recheck_failed | UNCOMMITTED | 不发布，旧目标不变 | 控制器报权限失败；真实验收待环境 |
| store_replace_throws_before_write | UNCOMMITTED | 旧根对象保持，0通知/快照 | 提交协调器记录错误 |
| store_replace_observed_then_throw | INDETERMINATE | 不可声称零副作用；禁止成功提示/自动重放 | 提交协调器读取commitId判断已发布与否，记录故障；实现须消除此接缝后准入 |
| published_snapshot_error | COMMITTED_DEGRADED | 新配置保留，P0不变，不能声称完整粘贴成功；不自动回滚已观察状态 | 快照适配器按commitId修复一次快照；未修复前阻止后续同目标粘贴 |
| published_notify_error | COMMITTED_DEGRADED | 新配置保留，显示预览未完成，不能成功提示 | 通知outbox按commitId重试同一逻辑刷新，不再提交配置/快照 |
| preview_network_error | COMMITTED_PREVIEW_FAILED | 新编辑配置保留，旧预览带错误标记，P0不变 | 查询层显式重试，不能当校验拒绝 |
| all_ack | COMMITTED | 新配置+一次快照+一次逻辑预览，正常保存前P0不变 | 显示过滤条件已应用 |

取消/prepare失败/确认后版本漂移属于发布前，必须零副作用；发布后快照/通知失败不能错误报告“粘贴拒绝且目标未变”。在COMMITTED_DEGRADED恢复前不显示成功提示，通知重试只重试副作用，不重新覆盖配置；目标仍可按既有编辑流程修复，P0在正常保存前不变。配置替换已被观察又抛错的INDETERMINATE不是可接受常态，必须有commitId判定/故障注入测试证明可收敛后才能准入。

## 未解决项与验证边界

本轮明确了候选载体而非无限等待不存在快照，纠正挂载/重置归因，证明树逐层绑定及历史分支，并把提交异常定义到状态/责任。仍缺完整日期首次消费与时区oracle、完整参数schema、真实宿主全配置fixture及Store/watch门控验证。真实权限仍阻塞。不能把这些不足转换为已完成Q066/Q067，也不能长期删除复杂形态。

已执行card摘要验证、JSON解析、组合fixture typed引用/目标样式/默认值及树映射自检；产品运行、权限、日期/参数求值均NOT_RUN。完整设计冻结由独立审查判断，本lane不自报关闭。
