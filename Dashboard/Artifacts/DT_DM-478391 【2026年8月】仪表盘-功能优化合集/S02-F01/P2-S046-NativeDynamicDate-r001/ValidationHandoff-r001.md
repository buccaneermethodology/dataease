# S046 原生动态日期候选设计验证交接 r001

- snapshot：`S046-NATIVE-DYNAMIC-DATE-DESIGN-r001`。
- 本件是设计交接，**不是独立审查报告或产品验收**。新设计审查已用 **0/3**；Builder **NOT_ADMITTED（尚未准入）**。
- 本轮允许且仅交付本目录 `SourceTrace-r001.json`、`Cases-r001.json`、`Design-r001.md`、本件四项。未修改产品、旧合同/报告/Goal/共享状态；未运行测试、UI/HTTP/DB、构建或安装。摘要和结构校验属于设计材料自检。
- 原始 DesignTask/Goal 为 authority；本件不替换原条款、不启动 Builder。父 Agent 负责后续实际拓扑、正式独立审查卡、准入及治理吸收；本 lane 不另写 Goal/Session/Gate/测量记录。

## 冻结交付索引

| 文件 | SHA256 | 内容与证据上限 |
| --- | --- | --- |
| SourceTrace-r001.json | `68c45c8a716376ebdb593baf8f83f4b27e223eb15356a541625c76733cad8ae4` | 27条静态事实、41个源文件、精确路径/行范围/文件摘要、调用者清单、B01–B06；没有运行行为结论 |
| Cases-r001.json | `c2c1884a2e680964801751cb6f0c6fa2809846ca0ebe5c8028ff72b9dc475b97` | 63候选未执行＋18 blocked案例/案例族，执行数0；原case identity、shape、前提、oracle、unknown与证据上限 |
| Design-r001.md | `583fca11389959817109ef2c18125d4c7bd3bce9cfb1945f52bf59fc9d7a7bf9` | 有限核心、候选写域、SD-NDD-01/02、分层验证、最短正常源观察；不表示正式合同冻结或实施接纳 |
| ValidationHandoff-r001.md | 由父 Agent 在收件时另行复算绑定，避免自引用摘要 | 本件索引、已核/未核与下一准入条件 |

接收卡 canonical SHA：`b3c65823fba2012bd947872a3b11958856e342bda0e83b0ddf7b37ac52a241c1`。接收端 `lane_task_card.py validate` 与 `context_bootstrap.py validate` 均 exit0；卡25项 refs、Context24项 refs及 SourceTrace41源文件已逐项重新计算，均无漂移。Cases→SourceTrace、Design首部→SourceTrace/Cases摘要一致；81个case ID无重复，63项状态为 `candidate_not_run`，18项为 `blocked_oracle`，executed=0。以上仅为可复算自检，不充当独立验证。

三件内容在本次交接后不再自行改写；如独立审查发现问题，应按原预算记录轮次并绑定明确修订，不能覆盖历史报告或自行开始第四轮。旧 Authority Materials / Chart Payload 等已耗尽整包不因本新设计重开。

## 原始分母与释放依赖

P1实际独立有界接纳12AC、49指定基本配置；完整产品类型仍 **0/49**，P2原26项仍 **pending**，完整38项不减。真实权限为 **BLOCKED_NOT_RUN（未运行，来源阻塞）**，插件 installed 未知；DEV权限桩、standalone或本设计均不代验真实鉴权。

本切片对应 AC-F01-Q012/Q015、AC-S02-02/03/04。原 `TC-Q012-01`、`TC-Q012-02/03/04`、`TC-Q015-01` 的义务继续保留；Cases中的原身份字符串依绑定原材料保留，审查不得仅凭候选名称计数关闭原case。原FX-COPY静态T的{2,3,5}与旧P0的{5}适用边界保留；未定义的动态date列与clock不能套用该静态结果。

## 已核维度与全部当前差异

当前无自检发现的引用漂移、计数冲突或候选/运行证据混用；这不表示独立审查无问题。以下源事实和候选差异均须纳入首轮审查：

1. **真实入口与调用者**：Editor→FilterTree→chart RowAuth/AuthTree/FilterFiled→TimeDialog→DynamicTimeForViewFilter/time-format；getData/Axios→API DTO→ChartDataManage/CustomWhere2Str/Utils；updateCanvas→saveChartViewFromVisualization→ChartViewManege保存/重开。并列query组件、电子表格、同环比/普通表后端调用者已区分，未借同名字段扩充chart schema。
2. **六字段及枚举**：完整保留 relativeToCurrent/timeGranularity/timeNum/relativeToCurrentType/around/arbitraryTime。实际f=前/减、b=后/加；TimeDialog默认b的注释反写，预览自身默认f不能静默统一。chart无monthEnd/week/range。
3. **数字与线格式**：UI timeNum仅min0，无precision/max，DTO Integer；0/1仅见证，不是allowlist或上限。arbitraryTime在弹窗是Date，确认truthy值转locale串，后端custom datetime只substring(11,19)，无ISO/时区解析。未知域不补默认或擅定UTC/舍入。
4. **字段生命周期**：leaf.timeType与dynamic.timeGranularity独立；动态切换可保留旧value，比较不应要求value非空；null/not_null不调用fixValue，合法dynamicDate+{}不能误拒。timeValue为展示字段且不在Java DTO，内存完整性与持久化规则投影分别判定。
5. **当前guard差异**：MVP显式拒绝dynamicDate及非null dynamicSetting，普通非空value检查还会误拒合法动态叶。只删除一个拒绝条件不构成完整修复。现有cloneDeep/freeze及prepare/adopt可复用。
6. **请求绑定差异 F27 / SD-NDD-01**：现receiver只核clip/session，未核完整request.candidateTree与clip.tree；建议query前复用sameMvpPasteInput。触发依据为原Q012/Q015完整结构与整次拒绝，影响为views/index.vue新增必读/候选写域；不是service-only。未验面是内存故障入口及零新query，且不等于serialized/OS decoder或原三类serialized异常覆盖。
7. **文案差异 F26 / SD-NDD-02**：既有unsupported_tree文案不同于原Q012精确提示。建议沿现有reason/key对齐三语言文案；影响所有复用该reason的基本/动态拒绝展示，尚未实际UI验证。不新建错误体系，不把建议升为新增must-have。
8. **canonical与query副本**：后端可能扩展同环比临时树并物化临时叶，采用对象应为原request.candidateTree，不能从response.customFilter带回临时求值树、轴或样式。
9. **独立oracle**：Calendar/SimpleDateFormat使用运行默认clock/zone，日期解析、范围端点及跨源epoch精度需独立绑定；仅浏览器预览或source/target同结果不足以证明计算正确。当前无动态fixture精确IDs运行证据。

同类残余包括非datetime以外custom datetime、数字coercion、DTO/save/reopen、serialized envelope、真实权限及原P2其它责任。它们没有被本候选排除或关闭。容量源事实属于父 Agent 另行有界任务，本交接不吸收其候选规则；后续共享service写域由父 Agent 串行准入并重绑。

## 全部未验面及原因

| ID | 保留未知/未验面 | 当前为何不能判定 | 最短补证与责任 |
| --- | --- | --- | --- |
| B01 | custom datetime arbitraryTime真实Date/ISO/locale/wire域 | 只有源代码，未观察正常UI及请求；不能按样例串假定普适格式 | 父 Agent 另准入P-NDD-WIRE正常源观察；无原生导入入口则ISO/Date导入仍未观察 |
| B02 | server clock/zone、epoch单位、DST、确切ID | 本轮禁止运行；源码未固定运行环境及所有数据源精度 | 环境owner提供非敏感运行证据，独立验收者绑定请求时间窗、日期列和边界行，独立列ID |
| B03 | fraction/清空/负数UI钳制/大数/Integer越界/数值字符串 | UI和DTO约束不同，未观察coercion | 新准入下正常UI尝试0/1/1.5/清空/Integer边界，记录模型→确认→JSON→响应，不注入Store |
| B04 | 实际DTO/save/reopen与display投影 | 仅静态持久化链，不足以证明MVC与重开形状 | 专用可恢复fixture另准入正常保存，采raw save/find/新query与回显；规则和display分层 |
| B05 | 原FX-COPY动态date值、anchor及ID映射 | 原静态fixture未定义动态日期逐行值 | fixture owner另冻结date扩展及独立ID集合，不从回包倒算预期 |
| B06 | 原三类serialized变体最终envelope/decoder/真实reader | 当前仅内存clip/candidateTree，没有已定位serialized入口 | 后续既定payload责任单元绑定正式contract/reader后验证原三变体；本lane不新建入口或重开耗尽包 |

Cases中三项内存畸形反例只为 representation-level partial projection；原TC-Q012-02/03/04仍因B06 pending。12个custom datetime案例仍blocked，不宣布永久不支持。63个候选也没有独立运行query oracle通过。

## 给独立审查者的一次查全范围

首轮请以四件最终摘要及原DesignTask/Goal/P1ReleasedDependency建立完整baseline，最多三轮，不以“还能更严”无限扩大阻断。至少检查：

- F01–F27是否由绑定源码支持，完整调用者与六字段生命周期、默认/非活动值/空值/DTO/运行解释是否相互一致；逐条检查反写注释和query并列机制未被借用。
- 63候选＋18blocked的原AC/case映射、输入shape/值域、前提、expected/oracle、执行状态、未知及证据上限；0/1是否仅见证，custom datetime及原serialized义务是否完整保留。
- 深拷贝、own undefined/null/展示字段、旧value及timeType独立性、null算子、group占位、未知结构整次拒绝是否可实施；独立query oracle是否避免复用product计算来判自己。
- SD-NDD-01/02的触发→原依据→影响→建议→未验面是否足够，是否应纳入本切片的精确写域；完整内存绑定与serialized decoder不可混称。
- 真实service→Vue生成/receiver→实际UI/query→save/reopen的分层、失败保旧/原子采用、query已发后的真实计数、原clip/预览/保存版本保全是否可观察；P1基本行为回归及权限上限是否保留。
- 当前证据只到设计层；全部原分母、审查预算、Builder未准入、未知不关闭、产品/旧合同未改及容量共享写域串行约束是否清楚。

请报告全部发现、已检查无问题维度、未检查及原因、同类残余、修复后准入预测。静态摘要通过不替代语义审查；发现输入漂移应先交父 Agent 重绑Context/Card。审查结论按已可证核心与未知项分别给出，不能直接关闭完整动态日期、Q012/Q015或P2原26。

## 最短下一源观察 P-NDD-WIRE（仅建议，未执行）

父 Agent 可另建精确运行卡，使用已保存专用fixture，保全旧树/类型/保存快照；正常日期过滤UI生成datetime/custom规则，选单位/方向/0或1及00:00:00、13:14:15代表值。记录TimeDialog确认前后、FilterTree确认后的rule descriptor/type/ownKeys/undefinedPaths、value/timeType/timeValue与非敏感浏览器locale/TZ；Date的epoch/ISO仅作为实际对象事实，不当线格式策略。

正常“更新图表数据”，只投影允许target的getData业务路径/状态/businessCode、customFilter、可见原始行ID和请求前后时点；保留arbitraryTime原串及[11,19)位段。禁止全网录制、登录、凭据、auth headers、cookies、storage及认证body；不注入Store/Date，不安装/重启，不改产品。

首probe不save；正常退出并拒绝草稿恢复后读回原已保存fixture。该probe不包含B04保存授权，不证明全组合或权限。失败原迹保留，不为取证修产品或以重试覆盖首错。若无服务器clock/zone非敏感证据则B02仍阻塞，交环境owner，不新增API或猜时区。

## 准入预测与交接动作

目前仅可提交独立设计审查，**不能Builder**。12种preset、非datetime custom单位×方向、空值算子及整树保持有静态基础；若审查认可有限核心，父 Agent 仍需按其结论冻结明确Cases/写域并生成正式实施admission。B01–B06按各自条件补证，未解决部分保持blocked，不能用默认策略替代。

未来候选写域仅为mvp-chart-filter-copy.ts、views/index.vue、zh-CN/en/tw既有key、新动态日期测试目录及BDD reader card；不改TimeDialog、后端日期算法、DTO、权限、renderer/Store/query框架，不新开serialized/OS入口。源事实/共享service变化须先重绑卡与Context。

本lane四件候选交付在收件后冻结，不自行继续写域。下一动作由父 Agent 发起首轮独立设计审查及另行有界源观察；本交接不声称实现、独立验收或完整Goal完成。
