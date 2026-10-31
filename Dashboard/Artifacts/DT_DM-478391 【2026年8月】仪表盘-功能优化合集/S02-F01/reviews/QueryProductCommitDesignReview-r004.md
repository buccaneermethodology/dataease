# QPC r004 独立设计审查

Design Freeze Validity：`NEEDS_REVISION`。

Implementation Entry Readiness：`NOT_READY`。不发放产品 UI/Store 准入，不允许来源配置暴露或目标提交。

## 检查证据

Card canonical SHA256 `d7d447022fba978d19e6e333f7b418a43a7cffbca73644137273af8fe2012436` 复验通过，validate/render 均 exit 0，已读取 renderer prompt；Context validate exit 0，required-read 摘要入口与收尾均无漂移。比较 r003/r004 全部 JSON 差异，并独立重算14例 initial/expected 共28个状态摘要，全部一致。

QPC-009 的 QTARGET 上游 raw SHA 校验通过，RFC6901 `/cases/0/expected/value/design` 展开后仅补 `mapValue:[]`，与嵌入 query_root_input 精确相等。承接此前已复核的 carrier/session/snapshot 源码，当前绑定源码未变化。本轮只进行了静态审查和 JSON 摘要/展开检查，没有构建、运行产品或真实权限验证。

## 既有发现处置

| Finding | 处置 |
|---|---|
| R2-01 | 保持关闭。carrier 输入转换明确，设计态去除运行字段，runtime 从该条件默认值生成，未继承目标旧Y。 |
| R2-02 | 文字合同保持关闭：提交后预览抑制不回滚、不声称零副作用；但QPC-012具体状态发生回退，见R4-03。 |
| R3-01 | 计数修订关闭。QPC-009/010/012的editGeneration为2，QPC-013为1；对应commit自增及dataPrepareState=true时cache内markDocumentEdited自增。 |
| R3-02 | 部分修复，仍未关闭。QPC-003 count/raw及根内第二查询已补；QPC-006 C/loading/invalid/requestCount 1→2已自洽；QPC-011从已提交dirty且请求已发的状态开始，响应失败保持版本/lastAck方向合理。QPC-004/009仍冲突，见R4-01/02。 |

## 当前阻断发现

### R4-01 / 高：QPC-004 的当前 revision 与拒绝后状态不一致

`/cases/3/input/revision_before_confirm=7`、`revision_after_confirm=8`，但 initial_state 和 expected_state 的 owner.revision 都为7、commitId都为commit-7。若初态在并发提交前，终态必须反映并发后的8；若观察从拒绝检查前开始，应以当前8为初终态，并把旧preparedRevision=7单独记录。粘贴零新增变化不能抹掉已经发生的外部变化。

最小修订：明确观察窗口及并发动作来源，区分 prepared revision 与 current revision，再冻结对应完整初终态。仅把0替换成7没有解决r003原始发现。

### R4-02 / 高：QPC-009 raw身份与预览终态仍有两种答案

`/cases/8/initial_state/owner/currentComponentRef`、rawTargetRef及注册trace已经统一raw-target-v0，但 `/cases/8/input/owner/currentComponentRef`、rawTargetRef仍是raw-target-v7；新增rawComponentRef=v0没有删除或解释旧身份。当前prepareConfirmation要求输入component===currentComponent，必须只保留一组明确身份绑定。

同例 `expected.previewEventDispatch` 仍要求 reRenderAll=1/queryData=1，但完整 `expected_state.effects` 在r004被改成二者都0；没有独立的同步发布后观察点标签解释。上一个版本该处为1，因此这是新引入的内部冲突。下游请求真实数量可以留给产品观测，但两个本地dispatch不能同时要求1和0。

最小修订：统一input/initial/trace的raw身份；选择明确的同步后或nextTick后观察窗口。如需要两者，分成两个明确状态而非复用一个expected_state。与chart-B映射无关的chart-1/chart-2计数模型仍不能充当真实fanout证据。

### R4-03 / 高：QPC-012 的失效输入没有体现在终态

`/cases/11/input/next_tick_owner_phase` 明确为unmanaged；r004 expected_state却从unmanaged改回open，currentComponentRef从null改回raw-target-v1、tokenGeneration从2改回1，且initial/expected摘要完全相同。这不符合明确指定的失效事件。当前session.invalidate将phase设为unmanaged、tokenGeneration加1、清currentComponent；它保留已经发布的root/selection及editGeneration。

最小修订：保持提交后初态editGeneration=2、tokenGeneration=1；以明确的invalidate动作得到终态unmanaged/currentComponent=null/tokenGeneration=2，随后dispatch=0。若实际要测试另一种门控失败，就改变输入并明确原因，不能在原失效输入下保留open。

## 非阻断文字项与边界

设计步骤6仍写cache调用“先尝试标记dirty”，实际markDocumentEdited也在dataPrepareState条件内部；transaction_state_contract.cache_and_generation_rule已写对，建议正文统一，避免误解。

QPC-006 additional_requests=1现在可解释为本例初终态之间的唯一核对；建议显式命名recheck_requests_during_transition=1及requests_after_terminal=0，保持用户要求结束后不再自动请求。

已保存画布缺owner问题继续明确开放。当前beginSession仅能从新建空画布上下文开始，不能从重开的序列化内容重建capability；同一创建会话首次保存后的延续与重新打开已有画布不同。QPC-014把既有资源记录为unmanaged方向正确，不关闭原Goal中的已保存画布覆盖。

snapshot cache函数调用、cacheTimes增量、物理history append、预览事件及下游请求已区分，不能以任一模型计数代替真实集成观察。QPP handle不自动提供当前主体、组织、raw owner或权限证明；读取来源前的授权与提交前撤权复验仍需可信producer绑定。

真实权限继续 `BLOCKED / NOT_RUN`。以上R4问题都是可本地修订的确定合同矛盾，不依赖权限环境；先修订再独立审查，不能把外部阻塞当作冻结这些矛盾的理由。即使本地设计通过，也不能据此激活UI/Store入口。

## 声明上限

保留10 Goal AC、14 F01＋Q066/Q067＝16产品义务、合计26 must-have，Scope Delta none，S01独立状态不变。仅写本报告，不修改候选、源码、测试或旧证据。不宣称产品复制粘贴、真实权限、物理历史、预览fanout、保存重开或Goal验收完成。
