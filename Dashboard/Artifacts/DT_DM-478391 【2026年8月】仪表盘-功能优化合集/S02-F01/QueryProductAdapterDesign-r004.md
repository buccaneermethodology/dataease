# 查询产品适配器合同调查与候选 r004

**完整产品适配器仍为 NOT_READY。** 本文完成全Goal义务映射、源码可见形态/逐字段责任矩阵与事务协议候选，不声称已冻结完整schema或已具备产品Builder准入。r003普通多选切片及所有已审窄合同保持原样；其PASS_WITH_BOUNDS不能合并推导全产品通过。

接收端lane card摘要bc2e30e2c78093723f3d5f23f16487ae128b58e97f9e4f2397823a63b0e03470验证pass，ContextBootstrap与render执行成功。源码HEAD 1e84e7438462e5d6fc371358da3bdad7d24a5c1a，已有工作区修改保留；仅新增本文件与QueryProductAdapterFixtures-r004.json，写前均不存在。Goal、S01、权限、旧冻结文件、代码及测试均未改。本轮不是权限或运行验收。

## 原始分母与状态冲突

Goal.final.json全部26项（10项Goal AC、14项F01和Q066/Q067）逐项原文映射在JSON的goal_mapping。图表→图表仍由原图表适配设计负责，图表↔查询拒绝；本轮没有把这些义务排除。跨标签TTL/身份、容量/空源、权限保密、保存/预览/正常撤销和S10移交均保留，不由查询纯模块替代。

需要正面解决的语义冲突：QuerySchemaDiscovery-r002禁止复制源运行快照，r007 design carrier不允许运行字段写回；但新显式默认COPY子合同只复制源JSON、全部值透传，而QPAD多选与QSINGLE无默认会清值。这些各自成立的窄域不是统一产品extract。产品层不能按displayType任意选不同清理策略；也不能直接把整个源JSON塞入carrier。**R4-01未决前不得把任何窄重建器注册为正式产品完整适配器。** 保留默认规则/运行值的区分必须由源创建、确认、首次查询和保存消费者共同给证据，而不是名称含Value就清空。

## 可见形态总表

这里只声明当前入口可见分支的调查覆盖，不把它叫作历史全部版本穷尽。每个NOT_READY都继续留在Goal，不是最终UNSUPPORTED_SHAPE。

| 形态 | 判别/轴 | 当前证据上限 | 缺口 |
|---|---|---|---|
| text-select | 0；单/多选×无默认/显式默认/首项默认×手工/字段选项 | 局部QPAD/QSINGLE/COPY可复用仅限各合同；首项及产品提取未完 | R4-01,R4-02 |
| numeric-select | 2/5；数值下拉、字段/参数、单/多选 | 没有完整数值/空值/参数schema oracle | R4-02,R4-04 |
| text-search | 8；conditionType 0/1/2及F/S运算和值 | 默认与运行F/S字段可识别，单/双条件全operator输出未冻结 | R4-01,R4-02 |
| numeric-range | 22；默认/运行start/end，0合法，空边界与参数双端 | 校验会写numValue，不可直接用于prepare；类型/null/范围完整oracle待证 | R4-02,R4-04 |
| fixed-time | 1/7 fixed；单日期/范围×year/month/date/datetime及range粒度 | Date与JSON字符串恢复、范围限制和参数格式需精确schema | R4-02,R4-05 |
| dynamic-time | 1/7 dynamic；today/custom/相对日月年、双端和快捷范围 | 只保规则不固化结果；首次consumer改对象需要runtime隔离 | R4-01,R4-05 |
| time-restriction | timeRange/setTimeRange；intervalType/dynamicWindow/maximumSingleQuery/regularOrTrends与相对窗口 | 限制规则与默认日期分属两组；不能当普通展示字段删除 | R4-02,R4-05 |
| tree | 9；1–5层、单/多选、默认/运行、optionFilter、路径编码 | 两层非空oracle和QTR关系已有，完整对象/特殊值仍未冻结 | R4-01,R4-03 |
| parameters | cross-cutting；SqlVariableDetails标量/时间双端/数值双端；字段与参数混合 | 非新displayType；所有parameters族与各Map需整份重绑 | R4-04 |
| cascade | cross-cutting；同dataset/跨dataset独立fieldId、树参与、多链闭包及环 | QCR同dataset六键不是所有持久形态，完整跨dataset未冻结 | R4-03,R4-06 |
| external-options | cross-cutting；optionFilter/remote值/首项默认/自定义sortList | 来源与保存归属未知；外部筛选不应自动转设计条件 | R4-01,R4-02 |
| history-nesting | cross-cutting；旧缺省/额外字段/Group/DeTabs/multiplexing/移动与嵌入 | 局部层级遍历不证明任意嵌套兼容，旧carrier缺口保持 | R4-02,R4-06,R4-08 |

类型依据为QueryConditionConfiguration.vue:2939–2993的实际选项；ConditionDefaultConfiguration.vue:28–39分派Time/DynamicTime/Tree/Select。不能仅按options.ts初始化对象推断完整形态。数值2/5、文本8、范围22必须显式进入覆盖；参数、级联、timeRange、外参是交叉轴，不是额外displayType。

## 逐字段矩阵阅读规则

JSON field_matrix逐项列出所有本轮已见条件键、field/dataset嵌套键、timeRange每键、14个参数DTO字段、级联6键及树层关系。action是提案，不是实施授权：NOT_READY行即使标RESET/REMOVE也不得执行；它表示待冻结的责任类别。动态字段并集之外的未知键不得静默丢弃，历史缺省必须版本化适配。源码中config.value的value是Vue ref解包，不据正则误增一个持久value字段。

| 类别 | 关键字段 | 产品责任与精确限制 |
|---|---|---|
| 身份 | condition.id、node.id | REBIND新ID；条件/node唯一性域分开；目标组件自身ID不替换；不能全局字符串替换 |
| 活引用 | checkedFields/Map、treeCheckedList、MapArr/Start/End及Num、parametersArr | REBIND组件键；dataset/field/parameter ID保持精确；普通/树/双端分别建闭包；活动引用不能删后假成功 |
| 默认规则 | defaultValueCheck/defaultValueFirstItem、defaultCondition*、defaultNum*、time* | KEEP规则；first-item和动态计算结果另属runtime；必要值/类型未冻结则NOT_READY |
| 值载体 | defaultValue/defaultMapValue/selectValue/mapValue、conditionValue*、numValue*、node.select/current | 默认与运行有交叠，按形态与来源阶段区分；无统一清空/透传算法，R4-01 |
| 元数据 | field、dataset.fields、treeFieldList、parametersList | 身份不能按name推断；编辑路径清fields后重取权限服务，缓存不等于设计真源；精确白名单R4-02 |
| 树 | treeDatasetId/treeFieldList/treeCheckedList/oldTreeLoad | 保留层序和真实路径编码；QTR只处理层关系，不证明树全对象 |
| 展示/排序 | name/visible/showError、sort/sortId/sortList、placeholder/queryConditionWidth | Goal排除外层样式，但条件展示/枚举排序是否属完整规则需确定，不能套全对象复制 |
| 外参 | optionFilter/remote值 | optionFilter缺省与[]不等价；来源和carrier归属待证，不贸然删除或持久化 |
| 未识别 | 缺版本、未知键、未覆盖合法shape | 阻止本候选提交，记录NOT_READY适配缺口；不是永久产品拒绝 |

关键证据：options.ts:6–136给初始/attributes；QueryConditionConfiguration.vue:1836–1908创建额外引用表并重取dataset.fields；599–636生成参数双端DTO列表。SqlVariableDetails.java:10–30提供14字段，ID/table/group字符串序列化，不能凭字符串包含|DE|把参数当普通字段。useFilter.ts:516–604分别生成双端过滤，端点顺序不可丢。QueryCascade.vue:141–148新节点初始只有id/datasetId/fieldId/placeholder，43–62确认另清selectValue；因此窄域六键exact-match不是通用历史策略。

## 完整转换责任链候选

1. 授权层先确认可读取源配置；没有源编辑/数据资格时不得暴露配置或复制。内部envelope时效/身份/容量由DG-02和既有有限比较合同管，不从字段目录推授权。
2. source extractor读取当前可信设计carrier与sourceRevision；载入历史JSON时先版本化迁移。逐形态解析完整自过滤/级联/参数/树，不取样式、查询返回结果或远程options缓存。不调用当前会写状态的UI validate：它在1261后会setTreeDefaultBatch并写numValueStart/End。
3. 构造类型化引用图：query condition、cascade node、目标chart、dataset、field、parameter及树层/双端角色分别命名。全量检查活动引用和直接/间接环；不在缺边时继续。生成新conditionMap/nodeMap；同源全次复制一致复用，跨次必须独立。
4. 普通域可消费QPROJ→QMAP→QPREP的QPIPE精确合同。QMAP先按完整源引用字段集合选同dataset唯一目标，再QPREP闭包/环；树层QTR只在完整映射后处理。参数/跨dataset级联不能硬塞QPIPE窄模型，须独立类型分支扩展且重新审查。
5. 每形态重建完整不可变design candidate。只使用其已冻结KEEP/REBIND/RESET/REMOVE表；当前缺表的shape返回设计NOT_READY，不产部分目标。目标完整支持、参数类型/范围/字段目录和引用签名同时固定。
6. prepare输出不可变CandidateHandle（拟含source/envelope摘要、actor generation、targetId、queryRevision、target binding signature、directory signature、design候选摘要及确认需求）；不发事件、不改Store、不记录快照、不调用时间/枚举计算。完整候选结构及hash规范尚未冻结，不把此字段列表称为实现schema。
7. 用户确认旧配置覆盖；取消立即无副作用。revalidate重新取当前身份、数据权、目标编辑权、源内容时效、queryRevision与目标结构/绑定签名。任何await返回后检查candidate仍当前；不能缓存prepare时授权代替逐次复验。仅样式变化不使查询候选失效，但删除/绑定/查询设计变化须重新prepare/确认。
8. commit同步捕获最新根并局部overlay目标design，不回放prepare旧根；同步区段不await、不触发可改Store回调。唯一aggregate发布点同时绑定revision/commitId/design与效果计划；实际Pinia落点尚未确定，不能声称一段JS内多个赋值就是原子。失败发生在发布前时root/carrier/history保持。
9. 发布后hydrate独立runtime副本，再执行一次逻辑snapshot/preview及成功反馈；多目标图表必要网络请求不等于重复预览。effect以commitId去重；旧hydrate/请求结果不能覆盖新commit。预览失败不逆向改源或重复快照，重试同commit的预览。当前UI Watch/nextTick是否能被门控未证明。

现有confirmClick:1591–1629先清propValue、后续nextTick写cascade/propValue，再nextTick发重绘/查询，不能直接用作粘贴commit。useFilter.ts:398–450动态首次查询会修改item.defaultValue/selectValue，必须只接收runtime副本而非冻结carrier；冻结对象直接传入同样不构成修复。

## 失败优先级与零副作用

产品层提案顺序是：访问资格/不泄露配置 → envelope格式/版本/大小与身份时效 → source schema/shape完整性 → dataset/field/parameter可证明性 → 引用映射闭包与环 → 整体目标承载 → 用户确认 → 重新授权/版本/绑定复验 → 同步发布。具体公开错误码尚NOT_READY，不能自行把权限错误暴露成详细字段信息。当前QPIPE内部QPROJ→QMAP→QPREP及各子模块reason原样保留；包装只增加stage，不抢先重排子模块优先级。

格式/结构异常按原Goal提示“过滤条件不匹配，请重新复制”；确认取消、权限撤回、未知字段/闭包/环失败均不改目标、不发成功提示、不触发查询/快照。未知合法shape属于内部设计阻断而非最终永久业务unsupported；Builder不能拿此当支持完整产品的借口。

JSON transaction_model_cases给6个失败/取消零变化及1个成功效果记账的精确抽象输入输出；digest是符号标签而非伪造真实hash。它们只冻结候选协议模型，不是完整Vue对象或真实权限oracle。

## 保存与既有undo/redo

保持已接受r007：captureSave同步深拷贝最新全根和同revision carrier，按唯一组件ID及Group/DeTabs路径仅overlay查询design，保留粘贴后的样式/文本等普通编辑。不能重插已删目标或用旧根修补冲突。保存完成仅在query revision与当前完整持久payload摘要均一致时清dirty，迟回包不能丢新编辑；不自动保存，失败仍保原服务器版本。

有效undo/redo恢复该历史完整根及同历史carrier，移动指针一次，产生新查询revision/commitId，仅预览、不追加快照；no-op不改revision/指针/效果；预览失败只重试同commitId。不得套保存overlay保留最新样式来改变既有全根撤销语义。snapshot.ts:97–135当前本身是多setter，新增carrier/发布协调仍待实现；无carrier旧历史兼容继续R4-08，不删除旧记录或禁用撤销来规避。

## 精确oracle与缺口

JSON bounded_exact_fixtures按原文件SHA保留普通多选、无默认单选、默认源JSON复制、树层重绑、QPIPE各自精确输入输出；不改原case identity，不把它们标成新完整产品case。tree_consumer_exact_oracle保持两层真实-de-路径到一个复合isTree filter的源码合成输出；save_history_bounded_oracle保持r007候选。12个full_shape_diagnostic_inputs只有待调查完整载体，expected=null明确未冻结；其中字段组合可能不合法，不能作为成功或拒绝验收。这样的区分防止“每个形态都有JSON”冒充每个形态有oracle。

### R4-01：产品提取与运行态边界（NOT_READY）

已接受窄模块有清空与透传两类行为；r007 carrier排除运行值，而显式默认COPY只保源JSON，不是产品extract。

最小下一取证：按查询复制入口逐字段固定design carrier来源；对源运行选择变化/动态firstLoad回写/保存重开建立不同值的端到端oracle。 对应AC-F01-Q012,AC-F04-Q066,AC-F04-Q067。

### R4-02：全形态schema与历史缺省（NOT_READY）

options并集不是完整schema；QueryCascade新节点只有四键；参数编辑创建空Map；undefined保存缺键；嵌套字段元数据尚非完整白名单。

最小下一取证：对0/2/5/8/22/1/7/9与optionValueSource各分支列实际创建/确认/序列化/恢复对象；版本化迁移而非调用会写状态的parameterCompletion。 对应AC-F01-Q012,AC-S02-06。

### R4-03：树与跨数据集级联（NOT_READY）

QTR只重绑层关系；两层路径oracle未覆盖混合深度/分隔符/空值/optionFilter=[]；QPREP同dataset域不覆盖QueryCascade的跨datasetfieldId。

最小下一取证：冻结树编码完整边界、1–5层与混合深度输出；追踪cascade-utils跨dataset连接字段与关闭环策略，不把合法跨数据集级联永久禁止。 对应AC-F04-Q066,AC-F04-Q067。

### R4-04：参数与双端引用（NOT_READY）

parametersArr及六个range Map绑定componentId和参数ID；QPIPE普通fieldId模型不包含双端参数。

最小下一取证：从SqlVariableDetails完整DTO和参数配置分支构造标量/时间双端/数值双端完整对象；核对|DE|身份、类型/范围/端点方向、字段与参数混合、重复目标冲突和searchQuery完整输出。 对应AC-F04-Q066,AC-F01-Q006。

### R4-05：动态日期与限制规则（NOT_READY）

useFilter首次查询直接回写default/select；timeRange限制又经dayjs/Date计算。规则可识别但完整时区与JSON恢复oracle缺失。

最小下一取证：固定时区/时钟/粒度并覆盖today/custom/range、DST/月末/闰日；design对象不可被searchQuery改写，runtime拷贝水合后再查询。 对应AC-F01-Q012,AC-F01-Q014。

### R4-06：目录及引用闭包（NOT_READY）

com-info是UI目录，不含完整字段/参数及权限证据；QMAP唯一候选不能覆盖所有真实嵌套目标/重名/多目标关系。

最小下一取证：从当前文档/受权字段服务生成签名目录；穷举Group/DeTabs/multiplexing入口与绑定变化；所有活动引用完整保留；字段与参数分型。 对应AC-F01-Q006,AC-F04-Q066。

### R4-07：单次发布与效果协调（NOT_READY）

confirmClick多nextTick且先清空；validate也改num值/树默认；Pinia多setter无原子保证。

最小下一取证：指定唯一publish aggregate/action和全部query watch门控；同步替换前无外部回调；注入prepare/权限等待/发布前/预览异常，证明零partial和一次逻辑预览。 对应AC-F01-Q007,AC-F01-Q014。

### R4-08：保存与旧历史carrier（NOT_READY）

r007已有候选overlay/undo语义，但旧历史无carrier、未协调编辑冲突和嵌套定位未实现验证。

最小下一取证：保留r007裁定；枚举保存/加载/undo/redo入口；旧历史重建规则与保存失败/迟回包/普通样式编辑完整oracle。 对应AC-F01-Q014,AC-S02-08。

### R4-09：非功能外部前置（NOT_READY）

DG-01真实权限、DG-02可信时钟和跨标签失效仍非纯模块能力。

最小下一取证：控制面维持原阻塞；只读配置保密、每次复制粘贴撤权及身份代际真实验证；不mock、不改S01。 对应AC-F01-Q005,AC-F01-Q008,AC-F01-Q009,AC-F01-ORIG-01。

## 交付验证与准入上限

已执行卡canonical digest、Context校验和prompt消费；JSON解析、26义务逐项映射、字段路径唯一、12形态与9缺口关联检查。未执行Vue、浏览器、searchQuery原函数、后端、SQL、权限或产品测试；没有程序化Session registry验证，也没有新增依赖。共享台账由父流程独立处理，本lane不关闭DG-03、不变更Goal或权限状态。

可进入独立Semantic Review的是本调查/协议候选及缺口清单；完整产品Builder仍不得准入。下一步优先R4-01固定统一extract/carrier/runtime与R4-02具体shape schema，再分别冻结R4-03/04/05完整oracle，最后R4-06/07/08结合真实入口。任何进一步实现仍需对应独立审查和精确新卡/admission。
