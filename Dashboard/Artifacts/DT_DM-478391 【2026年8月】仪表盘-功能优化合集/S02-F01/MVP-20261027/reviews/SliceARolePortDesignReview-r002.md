# Slice A 三角色 DEV 权限端口设计独立预审 r002

- reviewed_at：2026-10-30T17:56:00.482643+00:00；reviewer/source：`/root/bubble_ready_validator_resumed`，非本设计作者，未代修源码/测试/合同。
- snapshot_id：`S02-SLICE-A-ROLE-PORT-DESIGN-r002`；as_of_state：Topology-r572及本报告绑定输入，三角色端口尚未实现/执行。
- 类型与预算：Boundary + Implementation-Entry 语义预审，延续 **Slice A 累计第2/3轮**；第1/3轮为冻结Slice A实现的`SliceAValidation-r001.md`，实现后至多剩第3/3轮。**UIIntegration设计3/3不重开**，不把本轮称作UIIntegration设计第4轮或另起一套三轮。
- 接收端卡canonical SHA：`3fd7d84de6476d3cdba8b9521d171aed9fc377074d2a6f851ba9339c38ba2cde`；validate/render均exit0，9处引用、8个唯一输入原SHA匹配，写前复验无漂移。

## 双裁决与声明上限

**Design Freeze Validity：PASS_WITH_BOUNDS（限定三角色DEV测试门槛的设计有效）。Implementation Entry Readiness：PASS_WITH_ENTRY_CONSTRAINTS（可进入最小实现，但精确写集合、同步兼容与下列验证约束须进入Builder输入/准入）。新增协议或预算阻断0；需要新人类权限裁定0。**

设计可用于补齐UI04/S039的“可逐维参数化”缺口。它尚不是实现通过、权限验收通过或完整P1通过；也没有把生产复制权限重新定义为必须有目标管理权。原38义务（P1=12、P2=26）、49内置类型、完整0/49、真实权限`BLOCKED/NOT_RUN`、插件installed unknown保持。

本次允许继续最小Builder，不要求为下面的常规接线约束另开设计确认轮。若实际Builder准入仍仅允许两源码文件，则**不能在该准入下直接写locale**；先把必要locale路径加入精确实现范围与摘要绑定再实施。这是写集合的前置，不是新增产品AC或重开UIIntegration设计。

## 原合同到当前设计的映射

冻结`MVP-UI-04` setup为：DEV与显式flag开，对read-source / read-dataset / edit-target每一维参数化allow/deny/unknown；allow只允许全部**所需**权限allow且identity已解析时开始；deny/unknown不得query/dirty/Store写/成功提示；准备中改deny后完成response/preview，应提交前拒绝并保旧。

Goal/TSP AC-MVP-F01-05采用source-read / dataset-read / target-manage命名。设计的三端口是这三项的测试别名，不是三个用户或三种真实身份：

| 冻结UI04 | Goal/TSP | 本设计端口的有限含义 |
| --- | --- | --- |
| read-source | source-read | DEV测试源读取门槛 |
| read-dataset | dataset-read | DEV测试数据集读取门槛 |
| edit-target | target-manage | DEV测试目标编辑门槛 |

当前composable只有`permission = ref('unknown')`；`baseReason()`调用`checkMvpFilterPermission(enabled, permission.value)`，copy/paste共享该门槛。现统一控件只支持一组三态，不能独立改变某一维而固定其它两维，因此不能据旧单控件称三角色均已参数化验证。三ref + 可写聚合适配可以最小补上这个缺口，无需改service签名或clipboard载荷。

聚合规则可确定为：任一deny→deny；无deny但任一unknown→unknown；三项全allow→allow。一次单项deny/unknown（其它两项allow）即可把各维独立影响显示出来，混合deny/unknown再核优先级；无需升级为27组合或49类型逐一重复。

## 全部发现与处置

### ARP-N01 / P2 / 语义上限：三项共用门槛仅能证明DEV模型，不是生产copy角色定义

设计第5行明确copy/paste都消费三项聚合，并限定为DEV能力测试门槛。**UI04没有单独冻结“copy仅需前两项、paste需三项”的动作子集，也没有许诺edit-target=deny时copy必须仍可用。** 因此本轮不凭通常权限常识强加一个新的copy/paste拆分，也不把当前明示的DEV保守门槛判为合同内实质冲突。

同时，不能将实现后的“copy会因edit-target deny禁用”压缩成生产权限规范，更不能声称真实只读用户复制、源资源撤权或目标管理鉴权已通过。三端口仍是当前composable实例中的显式测试输入，不是绑定真实sourceId/targetId/权限服务的三次鉴权。后续P2真实权限应按原资源/操作契约落地，不能直接复用这个聚合当授权结论。

**处置：非阻断。** Builder文案、诊断和交付说明保留“DEV测试”范围；不改原合同，不减少P2，也不增加生产门槛。若以后要求把这一聚合发布成真实权限行为，那将是另一项需按原权限契约解决的差异，本报告没有预批。

### ARP-N02 / P2 / 精确实施范围：新角色标签与“两文件限定”存在待补的i18n写集合

设计第5行将变更限定为composable、Editor和必要现有测试；第11行又要求国际化。当前三locale的`chart.filter_copy_mvp`只有统一`permission_stub`和三态文案，**没有三项角色标签键**。若用新角色label，按项目规范应在`zh-CN.ts/en.ts/tw.ts`同步补齐；不能只硬编码中文/英文角色字符串，也不能用无关“指标/图表/组织编辑”键假冒角色含义。

**处置：实施入口约束，非架构阻断。** 建议精确Builder范围明确加入三locale的局部namespace，以及实际改动的既有runner；或明确采用已有、语义准确的国际化键组合并验证三语言含义。未扩充准入前不擅写额外文件；根Agent可把这项必要实现范围纳入正常card/admission，无需为同一既有i18n要求再开审查轮。

### ARP-N03 / P2 / 同步与兼容：不能把聚合实现为延迟镜像或双向watch回写

当前真实调用者包括Editor对`permission`的v-model，以及两个现有runner直接写`ui.permission.value='allow'`。只保留testid但把导出的`permission`改只读computed，或setter只写旧ref而不写三端口，都会破坏已存在测试/运行协议。若用watch把“单项→聚合→统一setter→三项”串成双向回写，还会把原本独立的三项吞成同值，失去UI04的逐维度状态。

**最低接线约束：** 三个端口为独立`MvpPermission`状态；聚合getter直接同步读三项；只有显式调用统一setter才同步写三项。单项更新只改变该项并影响聚合，不反向扇出。保持原导出`permission.value`可写、旧`chart-filter-permission`与现三个option值/文案；保留原copy/paste/reason/busy等公开行为。不用post/async watch维护另一份可能短暂过期的effective值。

统一旧select还应保留唯一可访问名“权限测试桩”。若新增三个label都把这个旧名字作为前缀，已有`getByRole('combobox', {name:'权限测试桩'})`的默认子串匹配可能变成多命中。三个角色控件应有各自唯一、可国际化的label和testid，既有统一控件的角色定位与testid均保持。不是要求新增UI框架。

**处置：非阻断、必须进入Builder约束。** 以上可由局部可写聚合/三ref与现有select实现，不需要扩service/Pinia/全局权限状态或统一权限框架。

### ARP-N04 / P2 / 提交前撤权：现接点足够，但要测到真实isCurrent链，不能只测聚合函数

静态调用链已核：composable的`isCurrent()`先sync身份，再读`baseReason()`；request port包装仍调用原`request.isCurrent()`；views/index在query后、prepare前和prepare handle ready后再次调用；FilterPasteRenderer也在prepare完成/返回前复验。因此把同步聚合接入现有baseReason，原则上可在三项任一deny/unknown保持到提交时阻止采用，**无需修改renderer或引入新通用调度**。

实现后应复用当前deferred query/preview fixture，在每项从allow变deny/unknown后才释放response/preview；核旧tree/data/画面、dirty/Store及成功提示均不被候选覆盖。开始前拒绝为0query；已经发query后撤权应保留真实dispatch记录，**不能要求其追溯变0query**。确认框等待期间的改变同样由现isCurrent复验覆盖。仅测`effectivePermission`返回值不足以证明端到端提交前拒绝。

设计“准备中任一项改deny/unknown”按UI04当前最小情境解释为：拒绝态保留到提交检查；它没有证明短暂deny后重新allow的ABA策略或真实源资源撤权。若要声称任何历史拒绝脉冲永久作废该操作，需要另有明确政策与代次事实，不能由本次简单聚合自动推导；本轮不追加这一新must-have。

**处置：非阻断、实现后最后一轮应核上述实际接点。** 不清空或重建clipboard来替代权限复验，不重置identity/TTL，不把拒绝后的旧clip丢失当作合格保旧。

## 已检查无问题维度

- 设计原范围对应已冻结AC05/UI04；三项分开控制可解除单permission无法逐维参数化的具体缺口，不需要27组合、2401配对或每type全部负向。
- deny优先于unknown、全allow才allow，与现`checkMvpFilterPermission`的deny/unknown理由兼容；identity缺失在全allow时仍经原sync/token检查拒绝。
- DEV+字符串flag的enabled gate、生产分支隐藏/禁用、既有后端query/save鉴权均可原样保留。新角色控件/诊断权限字段也必须在同一个enabled条件内，不在生产或flag关闭时泄露/旁路。
- 外部统一setter/testid可由可写聚合保留；三项独立ref无需改service/clip payload、opaque session token或runtime serializer。
- 现候选准备/发布的多处isCurrent读取同一composable回调，提供最小撤权复验接点；本设计不需要改动地图销毁、共享渲染生命周期或重启C2。
- 诊断可以只新增三态与effective值；“只导出三态”应理解为权限域只新增这些安全值，不删除原树/ownKeys/undefinedPaths/opaque epochs等既有诊断字段，不导出uid/token/cache/代理凭据。
- 当前budget继承保守：Slice A旧1/3是旧冻结实现；本次2/3明确为语义预审，不能充作新三端口实现验证。实现后只剩一次3/3，不因更名“RolePort”重置。UIIntegration设计3/3的既有合同不变，本次不是其第四轮。

## 未检查、同类残余与准入预测

未运行UI/DB/HTTP、安装、构建、测试或lint，未读取认证内容/XPack；未实施三端口或修改任何源码/测试/合同。当前报告是只读设计预审，不把上一轮14/14或生产编译分支测试写成本轮运行结果。真实多账号/组织/行列权限、所有宿主登录退出、真实source/target服务鉴权、跨context、ABA政策和完整P1/Goal均不在本次证据中。

同类残余保留：Slice A r001的测试hook lint和原生畸形数值语义建议是历史时点发现，是否已在后续修复不能由本设计推定；不能顺带把本次权限补齐扩为数值校验重构。C2V-005、旧ubo/circle/progress异常、其它类型缺列及已耗尽预算不由此关闭。旧ScopeDelta中已被当前Goal/TSP覆盖的迁出/22项表述不作为豁免38项/P2的依据。

**实施准入预测：** root可把ARP-N02所需的准确写集合和ARP-N03/N04约束写入最小Builder card/admission后实施；原两源码文件+必要现有runner+必要三locale即可，不需要service改造、全局权限表、真实后端账号或新设计审查。先做三项独立状态/聚合和旧统一接口，再接现模板/安全诊断/i18n，最后复用已有组件fixture核逐维前置拒绝与准备中拒绝。共享正常UI只补AC05原要求的角色端口情境，不复制到49型。

实现后的独立验证仍计Slice A累计第3/3轮：应核当时真正落地的完整局部diff、旧统一协议回归、角色矩阵、identity门槛、DEV关闭和提交前保旧；不能仅重跑旧14例后称新角色已验。当前不要求第四轮“确认”，也不因剩余次数少把未知提升为pass。

## 绑定清单与写入保全

| 主输入 | SHA-256 |
| --- | --- |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/Goal.final.json` | `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationCases-r002.json` | `e365ef111582ef84f20f26e6136854409b7fc66bb0931cae40a9df5318036d55` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/RolePermissionPortDesign-r001.md` | `d72932df9d3ccc863dd4d1b29be1e5c745db98218411ab330df70c12d1d0a9ce` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/MvpAcceptanceReadinessReview-r001.md` | `fba3b6ad368e085b787cd9a69497f5fb51163397559d718f7596dd014a06d9af` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/reviews/SliceAValidation-r001.md` | `48b7a56c6f7f21e615c9b1455305ad6faebaf8069eaddadd25193693e2015505` |
| `core/core-frontend/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts` | `658027b89e327a6bfa65481f7fd5f43a19b048c15427cd16207f8048773204a8` |
| `core/core-frontend/src/views/chart/components/editor/index.vue` | `0a9b782b8b72f3f6ac95148187d49e09a8d24f1610ea43b18e9e7002db06d5ee` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/planning/Topology-actual-r572.json` | `e59ed5fe32fb4eb39945552c5ca43d3a0b4585421d4557f7ff7a1cd1b154eda1` |

| 条件扩读（全部只读） | SHA-256 |
| --- | --- |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-copy.ts` | `9f4eca86173318b7b964648d216fd7a6c153b41abce9eda12f8f6e9fc6944b82` |
| `core/core-frontend/src/custom-component/filter-copy/mvp-chart-filter-paste.ts` | `d3ebbd6236bf832df6e3e9971841a9ee68300dfb9e31a015c1532b5dc46a3e9e` |
| `core/core-frontend/src/views/chart/components/views/index.vue` | `dd88f2ac4f7c5e35f0b07822c72cae0764a3bad11be4a19f23a86d9fb9de3c7b` |
| `core/core-frontend/src/views/chart/components/views/components/FilterPasteRenderer.vue` | `1c6708ef48bfa466c2d167fba010183792815f2dc7926ff9d163c19abb9fa985` |
| `core/core-frontend/tests/filter-copy-mvp/check.mjs` | `9409e6388d9989b2476f0b0f679cad5d60247741e82af2d5932d542b899a6989` |
| `core/core-frontend/tests/filter-copy-mvp-paste/check.mjs` | `868b41984942796d4a6092f88b016b9333034f0a9ef88e1f178a5dec783be69a` |
| `core/core-frontend/src/locales/zh-CN.ts` | `32af92a537d6cbc7e4155d084f0cc35b6afdfbe696a063a58ba787d876c11858` |
| `core/core-frontend/src/locales/en.ts` | `1809323f6282f08fc6c86fba5fae9659124db524f1da2fe9897c859e63a91a8e` |
| `core/core-frontend/src/locales/tw.ts` | `8827fff6250df55d81a5124aeadacde6a2560eeb8e582a7746a544032a8ef57b` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/TSP.md` | `ae03f58a18373d41a139f8831101e3294b9c80e7252ad48cefb779a4a878acae` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/UiIntegrationDesign-r002.md` | `ea2f947c370b554b8f9510d39924e1455c28705088bf4739df78c4725a034468` |
| `Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01/MVP-20261027/ScopeDelta.md` | `920b6bca3f9a3477c5e76e4584715a423115540f700b849da230bdf7cee1f9ea` |

报告写前全部主输入未漂移，输出路径原不存在；仅新增本报告。它不构成最终KB/Dashboard/full-diff/post-closeout或Stop Gate终态绑定。
