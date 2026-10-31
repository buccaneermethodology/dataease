# 单选查询 detached 端到端重建组合设计 r001

状态：待独立设计审查。本切片把已通过有界独立验证的 QPIPE-001 引用计划与 QPAYLOAD-001 VQuery 目标载体组合，产生可供后续流程评估的完整 design/runtime 候选。它不连接产品入口、Store、权限、用户确认、保存或网络。

## 固定接口

新增 `prepareSingleSelectQueryEndToEnd(input: unknown)`，输入严格包含 `propValue`、`cascade`、`maps`、`sourceComponents`、`targetComponents`、`target`、`expectedTargetId` 七键。函数先把查询引用所需字段原样交给真实 `prepareQueryReferencePipeline`；失败时仅返回 `{ok:false,stage:'REFERENCE_PIPELINE',cause:{stage,reason}}`。成功后把原始 `propValue/cascade` 组成 QTARGET source，将真实 plan 与 `targetComponents` 组成 rebuildInput，再调用真实 `prepareSingleSelectQueryPayload`。成功只返回其完整 `designPayload/runtimePayload`，失败保持 QPAYLOAD 原返回值，不返回 partial。

调用顺序固定为 QPIPE →（成功时）QPAYLOAD → QTARGET。QPIPE 对 QPROJ/QMAP/QPREP 的既有顺序与错误不重排；QPAYLOAD 对 QTARGET 的真实调用及stage/reason包装原样保留。不重算映射、闭包、目录、载荷容器或默认运行态，不捕获内部异常伪装业务拒绝。输入必须是普通 JSON；顶层仅做必要字段读取，不增加第二套复杂校验器。

## 有界支持域与完整性

仅限当前 QTARGET 支持的普通文本单选、单条件、空 cascade/chains。多个条件、树、参数、跨数据集级联和其他形态沿真实底层合同失败，不在此层转换或永久排除其 Goal 义务。`target` 是单个 VQuery 根，`target.id` 与计划内 chart/component ID 属不同身份域。目标目录只是调用者提供的离线资料，不证明可信、实时性或权限。

组合必须保持调用者输入不变。成功结果需等于“QPIPE真实计划 + QPAYLOAD真实两槽重建”的逐步组合；完整目标根保留QPayload合同允许的其他目标字段，只有 `propValue/cascade` 被完整替换。design/runtime 与输入及彼此之间均不得共享可变对象。所有失败均不含 `value`。

## 冻结用例与验证

Fixtures r001 固定 8 个 identity：普通文本单选默认 A/运行 B 的完整成功；同输入无默认成功；QPIPE 空源短路；QPIPE 无唯一目标短路；合法plan但VQuery目标ID不匹配；QTARGET目录缺目标字段；输入不变及输出深隔离；完整流程多错优先级/调用计数。测试必须导入真实 QPIPE、QPAYLOAD 和底层生产模块；spy只记录真实调用并透传，不得stub返回。不得因上游包的 partial 证据扩大本切片声明；报告上限仅为此组合函数的冻结向量通过。

仅在独立设计审查接受后，新增组合模块、同目录测试与执行证据；不修改任何上游模块、既有合同/fixtures、UI/Store、权限或保存链。Builder 必须先验证专属卡、Context 和精确 action-target admission，再留存可信 RED、同identity GREEN、定向ESLint和diff check；RED缺失时如实保留限制。

## 声明边界

本组合不代表产品copy/paste已接入，不验证真实源/目标目录授权、只读用户访问限制、权限撤销/恢复、保存重开、预览或完整10项Goal AC及16项产品义务。Goal原分母不变；真实权限继续 `BLOCKED / NOT_RUN`。
