# OBS-01/02 独立设计审查 r001

Reviewer：/root/s02_goal_review。仅写本报告，未改设计、fixtures、源码、Goal或权限分母。

## 双结论

- Design Validity：PASS_WITH_BOUNDS_FOR_OBSERVATION_RESOLUTION_DESIGN。接受源码问题定位、001–011确定候选观察结果和OBS-02失活/恢复顺序；012作为明确开放问题保留，不是完整冻结oracle。
- Implementation Readiness：NOT_READY_FOR_FULL_PRODUCT_OBSERVATION_TARGET。直接硬阻断是QOBS-ASYNC-01的成功迟到响应策略尚未裁定，不能让Builder猜测。不是要求再次全域分析。

## 输入复验与核查

指定review card canonical SHA256 72fc5174acd207764e20a5e00d5ccba43e8d320b51e9a51b7b356a57728bf1fe 经lane_task_card validate通过；指定Context经context_bootstrap validate通过。卡全部base_context_refs摘要无漂移，Fixtures全部source_refs摘要无漂移。

实际读取 QuerySingleSelectObservationResolutionDesign-r001.md（SHA256 406bf05fccd60f18d820115bff80fad948fc93dd5ca57b60cb9a3ee1783ec571）及 QuerySingleSelectObservationResolutionFixtures-r001.json（SHA256 dc6886260ca836657fe05e800e3eeaac94c70d917e089d367317adf96473b93e），没有用设计自检代替独立检查。

独立递归解析12例及8对象；引用可解、无环，8个展开后canonical JSON SHA256全部匹配。002/003/004/005/011完整前后state一致；001/006只改变runtime投影、runtimeGeneration及相应计数，carrier不变；007保留用户root但清carrier并撤销token；008/009恢复完整selectedRoot、指针到0、carrier不可用且三个观察点均unavailable；010递增设计revision到3、准备期旧匹配、setter期间不可用、重绑后新匹配；012明确state=null/NOT_READY，未计作确定运行结果。状态是合同投影，不证明完整Store、真实网络/SQL次数或普通保存结果。

## 源码事实与既有AC

实际核查前缀 core/core-frontend/src：

- v-query/Select.vue:342–469 的then使用当前config与selectValue，响应不含单选值时清selectValue/defaultValue，回填map/defaultMap；finally清loading、可能按default回填并调用queryDataForId。不是仅更新options的无副作用回调。537–607的watch和745–761的init包含nextTick/debounce及运行值写入。
- v-query/Component.vue:306–321直接刷新props.element.propValue的list/oldList，不能靠新增WeakMap自动门控既有观察者。
- v-query/QueryConditionConfiguration.vue:1591–1629跨tick清空/重写propValue并排两类事件；QueryUtils.ts:5–17的reRenderAll确实可发query-data，不能只拦queryData。
- store/modules/data-visualization/snapshot.ts:97–175原先先移动指针，继而多setter、选中引用重绑及snapshotChange/条件snapshotChangeToView。设计的前置准备与恢复屏障是新增规则，不能称现存原子事务。

检查Goal.final.json及其CoverageMatrix指向的SP-004/Resume-r004/AcceptanceCriteria.md。AC的运行态枚举清理不写回设计配置可支持carrier保护；Q122–Q126规定有效存在性验证、初始化顺序和失败保留，Q128规定交互搜索失败保留。它们没有唯一决定：同raw/同designRevision/最新requestId不变，但请求后用户选择C，而成功响应不含C时，选择丢弃整响应、仅更新options或重新请求。现有清值实现是行为事实，也不是这项竞态的明确产品裁定。不能将初始化或失败场景规则直接套到本成功迟到场景。

## QOBS-ASYNC-01最小维护者决策

只需裁定这一具体场景：枚举请求发出后用户改选C，响应成功且不含C，身份和requestId仍匹配。请选择该响应应当丢弃、仅更新options并保留C、还是重新请求；同时明确loading何时结束、是否允许额外查询/请求，以及C不在新options时的展示/校验行为。设计carrier保持不变。若选择其他行为，应给出同样可观察结果。确定后只补012完整state及then/finally调度与计数，不需重做001–011或调查全部历史。

## 可隔离范围与准入target

001–011已提供可实施的否定门控/恢复语义：旧raw、旧epoch、过期requestId任务无写入；reader同步核对完整接受投影；缺sidecar在任何setter前失活；有效sidecar跨setter屏障。这些事实和设计无需等待012再重复审查，OBS-02也不要求迁移全部旧历史。

但本轮未授予任何激活产品target的execution admission：Select的最新请求路径与012共享，不能以“只实现旧任务门控”宣称OBS-01闭合；OBS-02必须依赖实际session/token/carrier发布设施，不能仅修改snapshot.ts便声称完整接入。准备下一张bounded卡时，明确仅新建普通单选，target应绑定实际新增session/carrier门控模块以及既有QueryConditionConfiguration.vue、Component.vue、Select.vue、dvMain.ts、snapshot.ts中对应入口，并附真实Vue/deferred请求与恢复观察测试的具体文件路径。这里的文件集合是接线边界，不是对整个文件任意修改授权。若要提前实施完全隔离的辅助模块，须单独冻结其API及验收，不以未激活设施替代产品进展。

012裁定并冻结后，绑定本报告与增量审查、最新Context、实际topology和准确target生成admission即可继续。无需新增全域设计。验证须使用真实Vue挂载和可控Promise/nextTick/then/finally调度，覆盖同ID替换、epoch变化、旧finally不关闭新loading、用户C早于响应、各恢复setter间reader，以及原undo/redo和事件次数；纯模型GREEN不能替代。

## 声明上限

本报告接受有界设计分析，保留一个明确产品策略阻断；未运行Vue/Store/网络/权限，12例不是产品GREEN。完整10项Goal AC、26项义务、16项产品义务和S01不变；真实权限BLOCKED / NOT_RUN。不得压缩成“OBS全部解决”“产品准入”或“Goal完成”。
