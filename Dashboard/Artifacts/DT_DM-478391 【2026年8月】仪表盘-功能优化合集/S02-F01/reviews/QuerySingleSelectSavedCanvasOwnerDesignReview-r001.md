# 已保存画布 owner r001 独立设计审查

Design Freeze Validity：`NEEDS_REVISION`。

Detached Helper Implementation Readiness：`NOT_READY`。方向可继续设计，但尚不足以冻结可独立验证的身份helper输入/输出；不签发任何UI/Store、读取配置、权限或提交准入。

## 入口与检查

已读取渲染提示，card canonical SHA256 `28adc966a7e8b14ff566ef65d1379725b980bf0eeee6b0297a3672f4b21d7207` validate/render均exit0。Context raw SHA256 `58b52a1db81497d681bed09700039e69dba21843ec5ee1aba05da9a8f681a50b`核对一致，Context validate exit0；12项required-read摘要入口和收尾无漂移。

逐项读取14个case及设计，复核dashboard/index.vue初始化、恢复、copy/create/template路径、dvMain的root赋值及toRaw注册、DeCanvas的现有新增注册。为核实回调语义扩读canvasUtils.ts:662与1464。没有运行应用、构建或测试；仅写本报告。Topology-r189披露的“设计先于revision-specific admission”流程偏差保留，不因本审查追认实现准入。

## 阻断发现

### SCO-01 / 高：身份能力还停留在可伪造标签，未定义detached helper信任入口

SCPO-001/007用root_origin字符串和root_identity字符串区分live与JSON clone；009/010用target_raw_member布尔值代替真实引用成员检查。设计要求WeakMap/闭包/raw identity，但未定义由谁将可信当前root、canvas-instance token及resource版本注入helper，也没有工厂、begin/register方法的精确参数或对象构造步骤。若helper接受这些标签作为证明，clone只需宣称live就能通过；若helper自己比较引用，当前fixtures没有实际root和target引用构造图可供唯一执行。

最小修订：冻结detached factory/方法契约，通过注入的current-context getter或闭包拥有的对象锚点检查===；给runner定义对象图/引用构造DSL，clone必须生成不同对象而不是换字符串。产品producer可继续未绑定，helper只验证调用方提供的锚点一致性，不能宣称已认证真实Store来源。明确Vue proxy/raw在哪一侧归一，根与目标必须使用一致口径。

### SCO-02 / 中：初始化分流尚缺可执行映射，外部ready消息不能充当身份来源

`dashboard/index.vue:206`在initCanvasData成功回调内置dataInitState=true，copy也走同一回调并调用onInitReady。`canvasUtils.ts:662`先发布componentData和dvInfo再调用该回调；但`:1464`的onInitReady只是window.parent.postMessage通知，不是可回收的加载回执或身份能力。

缓存恢复`dashboard/index.vue:189`选择使用缓存时直接snapshotPublish/dataInitState=true，不调用initLocalCanvasData/onInitReady。普通已有资源加载以resourceId分支进入，并不要求route opt字面等于edit；copy由opt===copy识别，create/template另行分支。设计的operation=edit是新归一状态，尚无从实际opt/editMode、恢复选择及最终root到它的确定映射。

最小修订：给出各路径的可信“最后一次root发布完成”观察点和operation归一表，明确onInitReady仅通知；detached helper仅收归一后的上下文，实际接线仍阻塞。缓存恢复未支持可明确标为本切片未接入并保留父Goal，但不能让ready字符串自动代表完成恢复。

### SCO-03 / 中：14例没有覆盖已声明的关键状态转移，拒绝后状态未冻结

设计承诺重复ID、root替换、canvas卸载/重载、mode变化失效，以及清registered target/tokenGeneration递增；fixtures没有重复ID、root换实例、非VQuery、重复begin、已注册后失败/失效的精确初终态。SCPO-011/013仅给epoch_reusable=false或epoch-2，未规定计数/工厂寿命和旧handle验证入口；SCPO-010拒绝未规定既有registration保留还是清除。SCPO-006同时operation=copy和copy_mode=true，错误优先级未定义；SCPO-014“unchanged”不能作为具体回归oracle。

最小修订：补齐方法返回类型、错误优先级、owner状态机与token/registration初终态；增加上述必要反例，或明确不属于本helper并保留后续义务。create原路径可以保持独立并绑定现有测试/源码摘要作为回归边界，不要声称14例已证明“byte-for-byte behaviorally unchanged”。

## 有界成立部分与后续

允许一个loaded-resource owner按目标注册多个顶层VQuery的方向合理；当前dvMain.registerPendingQuerySingleSelect只计数并调用创建型owner的单Query注册，不能直接复用为多Query身份验证。新增独立detached helper可避免改变旧创建路径，但必须完成SCO-01/03合同后再作目标级准入。

权限分离成立：owner最多证明相对于可信锚点的资源/实例绑定，不证明查看、编辑、数据集权限。真实subject/org变化仅能由外部可信事件通知invalidate；SCPO-012明确外部阻塞，不把模拟事件当真实撤权测试。readDesign/commit/snapshot/preview/query/save均保持关闭。

当前已保存画布缺owner的产品问题仍未解决；本候选不覆盖模板、copy-as-new、嵌套查询或真实授权，不把这些从原Goal移除。先修订本地身份与状态合同，无需等待权限环境；即使detached helper以后通过，实际加载producer和产品接线仍需另审。

10 Goal AC、14 F01＋Q066/Q067＝16产品义务、合计26 must-have，Scope Delta none，S01独立状态保持；真实权限 `BLOCKED / NOT_RUN`。本报告不是产品实现、权限通过、保存重开或Goal完成证据。
