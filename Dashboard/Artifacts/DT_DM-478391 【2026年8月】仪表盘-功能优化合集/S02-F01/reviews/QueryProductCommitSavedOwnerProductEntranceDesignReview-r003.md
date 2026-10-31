# QPC saved-owner 产品入口分层设计增量 r003 独立语义复核

本报告为当前增量交付物第 **2/3** 轮；不重开 Store Trace 的3/3终轮，不改写此前报告。

## 双结论

**Design Freeze Validity：`NEEDS_REVISION`。** r002 两项原问题的针对性修改成立：提交后效果不再被宣称回滚，blank 与 template 来源已准确分开。但新增的写前拒绝 oracle 把“来源读取前拒绝”和“已授权读取后的目标提交前拒绝”混在一起，导致所有目标拒绝均要求从未读取来源配置，仍不能冻结该行。

**Implementation Entry Readiness：`NOT_READY_FOR_PRODUCT_UI_STORE / SOURCE_READ / TARGET_COMMIT`。** 保持原 10 项 Goal AC、26 项 must-have、16 项产品义务及 `Scope Delta: none`；本报告不证明运行、权限或 Goal 验收。

## 基线与方法

- Review card canonical digest：`48f24c558e2cafbef8a3274a9f4ad679c88c244860b67702484aa6b39f34c896`，实算匹配父任务最终绑定。
- Review Context SHA-256：`3e4a571321672814c739bbf56d4fdd2609fc58b08c061b239dce66a03a831589`，实算匹配；22/22 required-read 摘要在写前全部匹配。
- 当前候选 SHA-256：`239acb99091d3cb78025c3a3de9debd0341836e998a8a2463d1e0437c3efc27d`。
- 对照 r002 设计及独立 Review、r001 的读源/准备/提交分层、QPC r006 及 Review、Store Trace r003 及 Review。源码证据沿用本代理前轮直接读取的相同字节基线，并由本轮摘要复验确认；本轮不重复运行产品或权限测试。

## 原 findings 处置

| Finding | 本轮判定 | 依据 |
|---|---|---|
| `QPC-ENTRANCE-R002-01` | 原提交后回滚混淆已纠正；新写前读源混淆另列下项 | 第27–30行拆成写前、提交过程、提交后、成功。第29行明确 nextTick 抑制及预览/查询失败不代表已提交状态回滚，并逐项记录 root/selection、owner、cache、dirty/history、preview、query 和保存。第28行把提交中途异常恢复留为合同与运行证据缺口，没有编造现有原子回滚。该拆分符合 r006 Review 的效果边界。 |
| `QPC-ENTRANCE-R002-02` | `RESOLVED_FOR_DESIGN` | 第13行明确 template 与 blank 均初始化，但只有 template 装入 component/style/view/appData，与 dashboard/index.vue:299–313 的条件分支一致。没有因此宣称两者可继承 saved-edit owner。 |

## 一次列全新 Findings

| ID | 严重度 / 状态 | 依据与影响 | 所需修订 |
|---|---|---|---|
| `QPC-ENTRANCE-R003-01` | `BLOCKER`，设计需修订 | 第27行对“任何目标提交前”的 owner、主体/授权、目标身份或配置校验失败一律要求“无来源配置读取”。第26行却明确源读取前和目标提交前是两次独立授权点；r001“复制准备”也先确认源权限再读完整规则树，之后做兼容检查。合法反例：源读取授权通过并读取了规则树，随后目标字段缺失、owner过期或目标编辑授权被撤销，于是目标提交被正确拒绝。此时必须无目标副作用，却不可能把已发生的合法读取变成未读。配置校验本身也可能需要已读配置。当前 oracle 会将正确拒绝判错，或诱导伪造未读源证据。 | 再拆来源读取前拒绝与合法读源后的目标提交前拒绝。前者在源权限未通过时保证不读配置；后者如实记录先前合法读取及其授权时间点，保证不产生目标/selection、owner editGeneration、snapshot/cache/dirty/history、目标预览和下游查询、save/version等提交效果。若拒绝后禁止继续读取或查询，应定义“拒绝后新增”的观察窗口，不能抹除已经发生的授权读取；将读源/准备所需请求与目标提交派发的查询分开。保留拒绝/主体变化时的生命周期失效，不把安全失效 generation 与文档编辑 editGeneration 混同。 |

未发现其他需要本轮修订的新问题。提交中途异常的完整恢复合同仍是明确开放项：它限制后续产品实施，不要求当前有界入口设计一次实现全部恢复逻辑，也不能据此省略后续合同、RED和独立验证。

## 保持成立的边界与下一步

正常加载和缓存发布仍是多 setter 静态路径；不可观察中间态、迟到响应门控、Vue raw/proxy一致性和真实 saved-owner Store producer 均未由这些源码证明。候选把 load generation、root/target身份、owner生命周期、QSSDH gate、主体/组织和授权分离；observation-request 与 legacy 分支限制准确保留。Trace r003 的 NQPC-TRACE-006/007 仍为原报告的非阻断追溯限制，不提升其声明上限。

S01 F01 保持 CONDITIONAL：可读 Packet 不代表条件已经解除，产品进入仍须逐条核验与切片相关的条件并绑定独立审查/终态摘要，不增加其他功能无差别完成门槛。真实权限仍为 BLOCKED / NOT_RUN；standalone/admin/mock、detached GREEN或本次设计 review 均不能替代权限验收。Authority Materials 主包仍 NEEDS_REVISION，审后更正不翻转主包结论。

下一步仅在该设计交付物剩余轮次内澄清 R003-01，按新字节基线独立复审。产品接线继续不准入，原全部验收义务保持开放。本轮唯一写入为本报告；未修改候选、Goal、Cases、源码、权限配置，未运行应用、构建、数据库或产品/权限测试。
