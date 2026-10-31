# 已保存画布 owner r002 独立复审

Design Freeze Validity：`NEEDS_REVISION`。

Detached Helper Implementation Readiness：`NOT_READY`。本轮不签发helper、权限或产品UI/Store准入。

## 入口与范围

读取本轮rendered prompt，复验card canonical SHA256 `396342093873bac07f86d9c40270e84f4019dddda8054c941e4dada21e560b13`，validate/render均exit0。Context raw摘要与card绑定一致，Context validate exit0；13项required-read摘要入口与收尾一致。完整读取r002设计与27例、承接r001审查及已核对源码路径，并读取Topology-r191的流程偏差保留及r002设计准入说明。没有把r001流程偏差追认为产品授权。

检查只涉及静态语义与引用路径，不运行产品、构建或权限测试。27例逐项检查了begin顺序、注册错误、对象图、失效及reload预期。以下问题独立于真实权限环境，可直接修订本地合同。

## SCO-01..03 disposition

| 原发现 | 本轮处置 |
|---|---|
| SCO-01 | 部分关闭。getter/opaque handle/===/clone DSL与proxy归一方向明确，身份不再由标签自证；但具体接口与fixture列表来源不一致，见SCO2-02。 |
| SCO-02 | 关闭于当前切片边界。常规加载发布后回调、onInitReady仅postMessage、恢复缓存不走该路径、copy/create/template分流及producer未定义均明确；恢复缓存明确未支持且保留父Goal，不把ready字符串当真实加载证明。 |
| SCO-03 | 部分关闭。新增重复begin、重复ID、非Query、保留已有注册、root/canvas替换、失活幂等和reload模型。但仍有确定oracle矛盾及validate/模式失效规则缺口，见以下发现。 |

## 最小阻断发现

### SCO2-01 / 高：SCPO2-010没有root替换动作，预期却要求ROOT_REPLACED

本例context.root始终引用objects.r；begin后唯一动作是register(targetId=q,targetRaw=objects.clone)，没有setCurrentContext.root。objects.r.components还是空数组。依既定顺序，root引用未变，目标不存在应为NO_QUERY_TARGET、owner保持open/generation0，而不是invalidated/ROOT_REPLACED/generation1。

最小修订：若测试root clone替换，begin之后明确将current context.root切到clone，再validate/register；若测试外来target raw，则提供真实q节点并期望STALE_COMPONENT_IDENTITY。标题、动作和oracle必须选择同一场景。

### SCO2-02 / 高：LiveContext.topLevelComponents与fixture.root.components之间没有冻结映射

设计接口要求context.topLevelComponents数组，注册算法按该列表查找；27例context均没有这个字段，节点实际放在objects.r.components。runner_contract只说明ref解析和context组装，没有规定将root.components投影到topLevelComponents。生产root又实际是componentData数组，不等于fixture的对象包装。实现者无法唯一决定读取哪个表、何时刷新以及如何证明列表属于所绑定root。

最小修订：统一接口与用例。可以显式提供topLevelComponents并规定它是getter的调用方事实、helper只检查所给事实；也可从root本身直接遍历。若runner负责投影，冻结准确转换和无默认规则。并明确同一root内组件替换/删除/重复ID发生后，registration token如何失效，不能仅验证root===就把旧目标引用继续当当前成员。

### SCO2-03 / 高：模式/身份变化失效未进入register固定顺序，validate契约仍未定义完整

设计“失效与授权边界”承诺template/copy mode或route resource变化使owner失效，但register固定顺序仅检查loadState、resourceId/canvasInstance、root，未明确重新检查operation/copyMode/isTemplate以及routeResourceId/dvInfoId一致性。保持resourceId、canvas、root不变，只切copyMode=true，按所列算法仍可注册；只改routeResourceId也存在相同歧义。

接口列validate(owner):OwnerValidity，但未定义OwnerValidity结构及它是否复用register的上下文前置检查、错误优先级、目标注册成员复验。018/019/027要求validate产生副作用失活，算法尚未完整写明。

最小修订：抽出begin后所有操作共享的current-context复验顺序，规定哪些变更终结owner、具体错误及generation只加一次；定义validate返回形状与已失活/外来handle行为，加入mode变化、仅route/dvInfo变化和root不换但已注册target移除/替换用例。真实auth事件依旧外部BLOCKED，不要求虚构权限provider。

## 其它精确性建议

SCPO2-025的replaceFactoryContext需要明确是更新同一factory getter还是创建新factory；epoch_count=2应有确定计数域，old handle如何指定也需在runner DSL约定。setCurrentContext是浅合并还是替换应写明，否则018/019/027局部patch可能清空其它必填字段而先触发不同错误。

类型层operation不含restore-cache、resourceId不含number，而024/007故意提供非法输入合理，但公共方法/runner应声明测试未信任输入的边界，而非靠类型断言悄悄跳过验证。RegistrationResult、OwnerValidity、OwnerError以及成功token校验/可观察状态接口应在实现准入前冻结。

## 成立边界与下一步

copy优先于template/ID、template优先于operation、target重复ID优先于type/raw、普通拒绝保留注册、显式重复invalidate只加一次generation的方向已清楚。多Query按指定目标注册与既有创建型单Query owner分离合理；这不证明现有创建行为已回归通过。

修订SCO2-01..03及runner精确语义后重新独立审查，再考虑detached helper合同/RED/路径级准入。当前不批准源码或测试改动。QPC r005的产品入口仍NOT_READY_FOR_PRODUCT_UI_STORE，已保存画布真实producer及提交语义仍开放。owner只证明相对于调用方锚点的一致性，不证明真实Store来源或权限。

完整分母保留10 Goal AC、14 F01＋Q066/Q067＝16产品义务、合计26 must-have，Scope Delta none，S01独立；真实权限 `BLOCKED / NOT_RUN`。仅本报告落盘，不修改候选、源码、测试或其他状态；不宣称真实权限、复制粘贴、提交、预览、保存或Goal完成。
