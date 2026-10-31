# DG-02 候选 r003 独立增量语义审查 r002

## 双结论

- **Design Freeze Validity：NOT_READY（完整协议不能冻结）**。r003 的源码作用域和 Entry Packet 表述已修正，可接受为有界设计准备；身份/权限/并发与可信时间仍未形成可执行协议。
- **Implementation Entry Readiness：BLOCKED（共享存储及产品 Builder 不准入）**。真实权限环境仍 BLOCKED / NOT_RUN；Entry Packet 存在且 S02/F01 为 CONDITIONAL，不等于条件已满足。

仅关闭两项文档事实 finding；不是 DG-02 关闭、产品实现或验收。保留 10 项 Goal AC、26 项 must-have、16 项产品义务，Scope Delta：none；不关闭任何 AC，不声明 F01 实现有效或 S10 进入就绪。

## 输入和方法

复验 `planning/dg-02-design-review-card-r002.json` canonical SHA-256 `f4f5c13ef2559c8aa4bd6e5542fb81afc7ebd2ebec4b9f802d50bc18991e5154` 通过，并直接调用 renderer 读取输出；未写额外 rendered 文件。绑定 Context Bootstrap SHA-256 `32f57ef9e064469b503a5a148ab50dc2bbaff57600c5dd6cddc2c0bc9b245b56`。

本次为 r001 full baseline 的 delta review。已读 delta_read_set、source_goal、base_context_refs 及 Context Bootstrap 全部 required-read 输入；继承且复核未变的基线认知，新增阅读候选 r003、实际 Entry Packet 与 topology r310/r311，并重读四个源码及 DesignGaps。写入前 16/16 required-read 摘要及卡片全部直接绑定摘要一致；无源码或前置漂移。

候选 r003 SHA-256 `f5b1caa5843b04fe2056cf5463a860dbcdad76268ff4be51cb023feef1cf0a79`；原 review r001 SHA-256 `7ced2c1db1df264da65f2eebd2dae76199db39125ac57139708df093c74eeba5`；Entry Packet SHA-256 `4598a5d74567e1e1d3de81ce263909231dc054d8102535bc0d917238c412c658`。摘要校验只证明输入一致，不代替独立语义或运行验证。候选中其他历史超链接不因出现在正文即成为本轮通过的 admission。

## 原五项 finding 的逐项处置

| ID / severity | 独立 disposition | 依据、影响与剩余动作 |
| --- | --- | --- |
| DG02-R001-01 / P2 | **CLOSED（仅源码措辞修正关闭）** | r003 源码观察已明确当前 Pinia 与按 pathname 前缀分区的同源 localStorage，并否认自动 Pinia 同步。与 useCache.ts:6–22、user.ts:8,106–109 一致；不据此证明可靠共享生命周期。 |
| DG02-R001-02 / P1 | **OPEN，部分澄清，仍阻断** | 已区分 session generation 与 permission version，ID-02/03 引入迟到写入与 commit 前重验；但签发/撤销点、版本语义、fencing、失败/恢复和响应绑定 authority 仍 UNKNOWN。生命周期第 2 项“权限撤销必须使旧代际不可用”仍应限定为旧授权绑定/载荷不可再获准使用，避免被读成权限变化必然注销整个会话，与第 1 项冲突。需绑定真实契约后确定，不自行加政策。 |
| DG02-R001-03 / P1 | **OPEN，准备更具体，仍阻断** | TIME-01 区分数值边界和真实时间；TIME-02 明示 freshness、误差、会话绑定待定。实际来源、样本有效期、迟到/重放、刷新恢复协议均未提供，仍不能冻结。 |
| DG02-R001-04 / P2 | **PARTIALLY_ADDRESSED / OPEN（部分补充，未关闭）** | 五行候选已有初态、有序事件与若干观察点，明显超过原场景标题；但并未覆盖原 review 的完整反例清单，部分 oracle 仍依赖未来协议或含混。详见下节。 |
| DG02-R001-05 / P2 | **CLOSED（包可读性与资格区分关闭）** | 已直接读取 SP-005/S02-S09_EntryPacket.md 的 S02/F01 段，文件存在、状态 CONDITIONAL，候选亦区分资料存在和未获准入。包不提供 generation/time authority，不证明真实权限环境；本关闭不提升进入状态。 |

原 finding 关闭数为 2/5；余下 3/5 保持未关闭，其中两项 P1 是协议冻结与实现阻断。无需将已关闭的事实更正重新作为产品验证门槛。

## 源码准确性及声明边界

`useCache` 的前缀只用于 user.* 键，不能将此前缀规则自动推广所有 S02 载荷键。`user.clear` 删除键而 Pinia reset 在 logoutHandler；r003 未声称 clear 自身完成 reset。logout.ts 仍有 OIDC/CAS/自定义跳转，目的端撤销未证。resourceImages 的 listener 仍是相关图片路径调用 initialize 后才注册；r003 没有宣称它实现 S02 同步。将“不存在协议”限定为绑定读集是恰当收窄。

`pure-guards.ts` 仍未纳入本轮源码读集，故不独立背书其函数实现；仅确认 Design/DesignGaps 的有限比较边界不能代替可信时间。当前四文件静态观察不证明全仓库缺少能力、服务器撤销正确或跨标签运行行为成立。没有读取 XPack 专有实现，未启动应用、安装、构建或运行行为测试。

## 场景与 oracle 的具体缺口

| 候选场景 | 可接受部分 | 冻结前仍须补齐 |
| --- | --- | --- |
| ID-01 | U→V→U 顺序、uid 不足、失败无副作用明确 | “若服务端提供不同 generation”是候选机制条件；旧内容不可恢复是原要求，不得随该机制不存在而免除。缺 authority 保持 blocked；补登出后的旧标签刷新/离线恢复。 |
| ID-02 | g1 响应晚于 g2、不覆盖/复活要求明确 | 同一有效会话 A/B 新旧复制竞态、新复制替换顺序、通知丢失/乱序、storage 不可用尚无独立用例及 oracle；不能用跨会话迟到写入代表全部竞争。 |
| ID-03 | prepare→撤权→commit 的重验及拒绝目标不变明确 | 补恢复权限后的明确事件和结果，以及 viewer/无数据权、组织/代理变化。prepare 到 commit 的权限结果有效范围与提交边界由真实契约决定，不能只写“重验”即认为无竞态。 |
| TIME-01 | 1799999/1800000/1800001 与不续期明确；诚实限定数值比较 | 分离读取无查询、成功粘贴按原合同触发预览、过期粘贴无副作用；明确相对于本次操作的计数增量，避免把页面启动查询算入或把成功预览要求误归零。 |
| TIME-02 | 列出了异常与恢复、请求标识和样本顺序 | 将“依次注入”拆成隔离初态的案例，避免首例失效污染后例；有效前跳与不可信样本需由协议区分，不能一律当异常。仍需冻结 freshness、误差、回拨/重放判断。 |

全局观察还应明确失败时的已保存状态保持，及成功后创建/到期值不变；“预览/查询为 0”应定义为本次拒绝引起的新增调用为零。登录/刷新响应晚到覆盖新身份、重试/重放在当前表中尚未形成完整案例。上述是对原 R001-04 的剩余范围说明，不增加新产品分母。

## 剩余 authority 与后续边界

仍需真实认证/权限来源决定会话及权限版本的存在性、撤销可观察点、组织/代理绑定；需共享存储协议决定旧 writer fencing、竞争次序及失败恢复；需时间契约决定创建/到期绑定、freshness/误差与刷新/休眠后的校验。真实多标签试验是后续 witness，不能替代先声明可验证协议。

安全下一步仍是候选澄清和补完整场景，再在授权模块/API 可读时重基线并独立审查 authority。当前报告不授予实现 admission，不修改 DesignGaps，也不要求重复请求已存在的用户实施授权；未满足的是证据与技术准入条件。

单行误读检查：“2 项 finding 关闭”仅指文档事实更正；“5 个场景”不等于覆盖完整；“Entry Packet 已读”不等于 READY；“候选已 review”不等于 Design Freeze。候选留在执行设计层，不能成为 canonical KB 已成立产品事实。后续输入改变需重基线，本报告没有冻结协议或改变原合同。
