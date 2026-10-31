# QPC saved-canvas owner 与效果边界增量 r006

状态：`DESIGN_REVISION_CANDIDATE_REVIEW_REQUIRED`。本文件是 `QueryProductCommitDesign-r005.md` 的窄增量；未改写 r005 历史、未改变 `QueryProductCommitCases-r005.json`，也未发放产品 UI/Store Builder 准入。

## 绑定对象与范围

- Base design：`QueryProductCommitDesign-r005.md`，SHA-256 `ddef9ea1e00dcd1cffee040b51e3632cca85d7166fd9782c9ff4246b2ccd3d69`。
- Cases：`QueryProductCommitCases-r005.json`，SHA-256 `388f0719d018b7cd444b6232d8601e0825513f99d0dee98ca68cf89dd3240728`。
- Design review：`reviews/QueryProductCommitDesignReview-r005.md`，SHA-256 `c9ab8212e34a86eabdeb8fc9159b59336320a8d7e13ad1f4dbd682ebbdee117a`。
- Owner contract：`QuerySingleSelectSavedCanvasOwnerDesign-r004.md`，SHA-256 `f7d430ed4801b647efd44499b37d86677563e466d3e216380aba6261ab9e4d59`。
- Owner source independent validation：`reviews/SAVED-CANVAS-OWNER-source-Validation-r002.md`，SHA-256 `83a2c649d3d2281616116da5387fa9e2303418140f67ffa6ccf4dfa7848b2070`。

本增量仍只服务 S02/F01 的普通文本单选候选和本地状态协议。Goal 分母维持 10 项 AC、26 项 must-have、16 项产品义务，`Scope Delta: none`；S01独立。

## QPCR-02：saved owner 能力边界

Saved Canvas Owner helper 的独立验证只证明：当调用方注入当前上下文 getter 时，helper 能对已加载、正在编辑的已保存资源绑定 `resourceId/routeResourceId/dvInfoId`、`canvasInstance`、顶层 `root` 引用，并要求已注册目标在当前 root 中唯一、`component` 与 `innerType` 均为 `VQuery` 且 raw object 身份相同。失效后 generation 增加一次、注册清空，旧 owner/token 不复活。

这不是实际 Store producer，也不是用户、组织或权限身份。helper 的 `auth_context_changed` 是调用方主动传入的失效原因；当前代码没有证明它能观察真实登录/组织切换。`generation`、资源/画布对象引用、QSSDH 生命周期 `epoch/revision` 和任何授权凭证是不同身份域，不得互相代替。

因此，QPC r005 中基于新建空画布与 `querySingleSelectLifecycle` 的成功状态模型仍只覆盖该模型。它没有因 detached helper 通过而自动覆盖从真实 dashboard Store 取得 loaded context 的路径。实际 getter 来源、加载完成发布顺序、Vue raw/代理对象规范化、unmount/换画布/换主体的失效事件仍需分别源追踪和审查。QPC-02 的产品 producer 缺口保持开放。

## QPCR-03：快照与预览效果措辞

精确规则为：owner commit 的 editGeneration 先增加一次；成功调用 `recordSnapshotCache('confirmClick')` 后，只有 `dataPrepareState=true` 才会调用 `markQuerySingleSelectDocumentEdited` 并额外增加 editGeneration、cacheTimes。`dataPrepareState=false` 时调用次数仍可为 1，但 dirty 标记、额外代次及 cacheTimes 增量为 0。物理 history append 仍取决于后续 flush、移动端和 snapshot disable 等门槛。

`previewEventDispatch`（本地事件调度）、实际关联图表扇出产生的 `downstreamQueryRequest`、物理 `historyAppend` 是三个独立观察面。当前 QPC cases 中的链接图表数量属于模型输入，真实查询请求保持 `NOT_RUN`，不能将模型值写成运行请求数。

## 独立设计结论与准入上限

QPC r005 独立审查的修订引用、cache dirty 文字和 saved owner 缺口按上述规则澄清。维护者已指定的迟到枚举 C 策略仍完整沿用 QPC r005：仅追加一次核对请求；核对完成后结束 loading；仍不含 C 时保留 C 并显示无效。复制默认值 A 的目标枚举失败仍是独立的写前拒绝。

QPCR-06 不变：尚无已授权权限模块来源、可用公开授权契约和隔离多用户环境。来源配置查看/复制、数据集访问、目标编辑及撤权行为仍为 `BLOCKED / NOT_RUN`；不使用 standalone、mock 或管理员身份替代。当前产品 UI/Store、source-read、target commit、预览/查询/保存/历史接线仍 `NOT_READY_FOR_PRODUCT_UI_STORE`。本增量不是实现合同、可信 RED 或 Builder admission。

## 后续顺序

1. 独立审查本增量是否准确限定 detached owner 与 QPC 本地模型，并核对 dirty、preview、history 的分离。
2. 若设计增量通过，只能继续制作只读的真实 Store context producer 源追踪与产品入口设计；在公开权限契约及隔离环境可用前，不接入来源配置读取或目标提交。
3. 权限依赖解除后，重新绑定 actual topology、完整合同/cases、可信 RED、独立预审和精确 target admission，再考虑产品 Builder；所有原始义务保持开放。
