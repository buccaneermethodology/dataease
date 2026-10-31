# G2 area 粘贴失败有界诊断设计 r001

## 目标与准入边界

本设计只针对已观察到的受支持 G2 `area` 图表：真实查询已返回，但粘贴以 `paste_render_failed` 结束且原过滤树保留。该路径影响 P1 `AC-MVP-F01-01/06/08/12`。Goal 保持 38 项完整验收义务，先做界面 MVP、再做复杂验收；本设计不会把 area 移出 eligible 分母，也不把开发权限桩称为真实权限。

真实见证是 `MVP-20261027/evidence/RuntimeAreaPasteFailure-r001.json`：同页同会话、同数据集，两条件整树；逻辑 `getData` 次数为 1，query plan 为 queried，响应返回；最终原树仍在，结果为 `paste_render_failed`，未保存改动。该见证没有保存 area 配置，也没有定位 renderer 内部抛错。浏览器 Vue `readonly view` warning 是单独观察，当前没有调用栈或因果关系，不能据此定根因。

## 设计原则

1. 先以 captured request/response 和当前真实生产 SFC 建立可复现 runner；实际生产调用与错误出现点必须执行到，装载失败或 harness 不匹配不得算 RED。
2. 诊断只覆盖 strict candidate prepare/render，不改 legacy 普通渲染的错误行为，不更改过滤树的完整性规则和保存契约。
3. 若根因明确且位于获准范围，只做最小修复；通过 readiness 之前不写 canonical view/store/result/dirty/snapshot。失败仍返回稳定失败结果，目标、结果和画面保留。
4. 若需要 DEV 诊断，限定 allowlisted 阶段码与异常类别，不保存异常原文、stack、request/response、数据行、身份或权限内容。诊断只用于定位，不能成为验收本身。
5. `readonly view` 警告只有在新的调用栈/对照证明与失败相关后才纳入同一实现；否则作为残余观察，避免把相关性写成因果。

## 冻结的测试身份

见 `AreaPasteFailureCases-r001.json`。`AREA-PASTE-REAL-001` 绑定上述真实 UI 失败证据和当前 Goal。当前产品源需使用全新冻结前快照摘要；runner 要先完成真实 Vue SFC 编译/挂载，再进入生产 prepare/renderer 调用。测试适配器可以替代外部 SDK/DOM host，但必须把替代边界写明，且不能声称真实浏览器通过。

- RED：相同 captured case 在当前源码上重现 `paste_render_failed`，0 个执行/装载错误，并保持 target 状态。
- GREEN：复用相同 case identity 和 runner，若发现根因并修复，则 area readiness 成功且原子采用；故障注入案仍保持失败保旧。
- 防御：stale、query失败、renderer拒绝、异常诊断隐私不得污染 canonical target。

## 计划写范围和步骤

1. 只读追踪 `views/index.vue → FilterPasteRenderer.vue → ChartComponentG2Plot.vue → renderChart/renderG2Plot → area ChartView`；确认 warning 的真实写入源与 renderer reject 的实际栈/阶段。
2. 建立 runner-only RED/GREEN 与完整失败前后树/结果/dirty fingerprint。若 mock SFC 路径不能复现 observed fingerprint，停止扩展结论并返回真实 UI/renderer 继续取证。
3. 对明确的生产根因进行最小局部修改；冻结合同/病例不随实现改写。除 `ChartComponentG2Plot.vue` 及其专用 runner 外不扩写，若证据要求其他文件，另附影响和精确范围后重新准入。
4. 执行同 identity GREEN、focused failure/stale、定向 ESLint、受影响 renderer suites；再在隔离开发 UI 对 area 重跑并记录query、ready、采用、保存/重开。

## 不能由本设计得出的结论

本设计不证明 area 已可用、G2 SDK/真实浏览器行为、其余48内建类型、全eligible source/target矩阵、P1 MVP 完成、真实权限、或 S02 Goal 完成。产品实现须等待独立设计审查、可信 runner RED 与绑定当前 Goal/Context/Design/Topology 的精确 admission。真实多用户权限与只读/撤权仍为 `BLOCKED / NOT_RUN`。
