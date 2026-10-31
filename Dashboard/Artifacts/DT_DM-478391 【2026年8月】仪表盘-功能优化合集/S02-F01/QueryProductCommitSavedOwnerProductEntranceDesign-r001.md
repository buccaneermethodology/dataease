# QPC saved-owner 产品入口分层设计候选 r001

状态：`CANDIDATE_FOR_INDEPENDENT_REVIEW`。本候选承接 Store Producer Trace r001、producer design r001、Contract r002 / Cases r004、其独立复核及 producer source Delta Validation r001。只定义后续产品入口边界与准入条件，不改产品源码、测试、Cases 或权限实现。

## 权威、目标与范围

`Goal.final.json` 是范围与验收权威：10 项 Goal AC、26 项 must-have、16 项产品义务保持完整，`Scope Delta: none`；S01 继续独立收尾。目标是把已验证的 detached owner 状态机映射到可审查的产品实现阶梯，同时保持画布身份、当前主体、资源授权、配置读取与目标提交分离。

本候选仅支撑 AC-S02-02 / AC-S02-03 的设计输入，不代表产品 Builder 准入或任何产品 AC 完成。产品实现仍须绑定 S01 的 F01 Entry Packet、独立审查终态摘要、可信 RED、当前工作树及精确 action/target admission。

## 当前证据及能力上限

- `QueryProductCommitStoreProducerTrace-r001.md` 对 dashboard 路由、正常载入、缓存恢复、copy、template/create 与 unmount 路径提供当前 checkout 的静态映射；多 setter 发布是否会被 watcher/render 观察、异步旧响应是否能覆盖新状态仍未由该映射证明。
- `QueryProductCommitSavedOwnerProducerDesign-r001.md` 与 Contract r002 / Cases r004 定义 saved owner 的候选身份和失效语义。Cases Review r004 仅确认 QPC-PROD-001 的 mint raw identity oracle。
- `QPC-PRODUCER-source-DeltaValidation-r001.md` 独立验证 detached TypeScript producer 在 root、target、provider identity 改变时清除旧 owner、转为 invalid 并使 generation 单次前进；14 项同身份运行、定向严格 TypeScript 与 ESLint 通过。它没有调用 Vue、Pinia、Dashboard Store、权限 API、source-read 或 target-commit。
- 因而当前可声称“detached producer-local 修复经有界验证”；不能声称产品 producer 已存在或 saved-canvas copy 可用。

## 产品分层与状态边界

| 层 | 责任 | 进入条件和拒绝行为 |
|---|---|---|
| 画布加载与发布 | 现有加载流程明确 requested resource、响应 metadata、source kind、完整 root 与 view 状态；新一轮载入、缓存恢复、资源切换及卸载先失效旧 owner。 | 只在完整编辑态发布后考虑 mint；请求代次/资源身份不匹配、失败响应或发布失败时拒绝，并且不得恢复旧 owner。Store 多 setter 是否可原子观察须在真实组件上验证。 |
| Owner producer | 以一个可观察的 Store action 绑定 resource ID、load generation、source kind、root raw 引用及唯一 VQuery target raw 引用；root/target/provider identity 改变时调用同一失效语义。 | owner 只证明当前画布对象身份，不代表主体、会话或授权。cache restore 创建新 generation；copy-as-new、template、blank create、preview/embed 不自动继承 saved owner。 |
| Principal 与授权 | 由实际 permission provider 提供 principal、organization、resource/action 授权结果；分别在读取源配置前和目标提交前重验，并将授权对象绑定到具体资源与操作。 | 缺 provider、无权、授权撤销、主体/组织变化或授权结果不确定时写前拒绝。owner generation、`checkPer`、管理员身份或本地 helper 均不能替代。当前 provider 公共契约及实现来源缺失。 |
| 复制准备 | 在源读权限确认后读取并校验完整规则树，按目标数据集和字段 ID 做同一数据集兼容检查；保留查询组件字段、cascade 与完整承载语义。 | 任一字段缺失、同名异 ID、字段承载不完整、循环/非法结构或 identity 失效时整次拒绝，不产生目标副作用。源与目标身份不可混用。 |
| 目标提交与反馈 | 提交前再次检查 owner、当前身份、目标编辑授权及目标 root/revision；一次性替换完整目标树。 | 拒绝/异常必须保持目标树、snapshot/cache、dirty/history、preview、查询请求与保存版本不变；成功后分别观察一次树提交、dirty/history、preview dispatch、实际下游请求与正常保存/重开结果。任一观察面不能代替其他观察面。 |

以上顺序是设计合同候选，并不推断 Pinia `$patch` 或多 setter 天然原子。具体产品调用点、事务边界和 UI 方法须以当前实现及授权模块契约再审。

## 分支与兼容约束

- 已保存 Dashboard 正常编辑：只在 requested ID 与响应 resource ID 符合编辑模式、root/view 完整发布后建立候选 owner。
- 本地 cache restore：确认 cache resource 与当前编辑资源一致；发布新 root 后创建新 generation，旧 raw 引用不沿用；真实身份和权限仍另行核验。
- `opt=copy` / copy-as-new：来源资源身份不能冒充新目标 ID；在新目标资源身份与权限规则明确前，该 owner 入口不覆盖此分支。
- template / blank create：不属于 saved-resource owner；不可由相同 Store 形状推断支持。
- preview / onlyPreview / embed：不在此编辑态入口中，需单独定义访问身份与提交路径。
- loading 迟到或旧响应、ID mismatch、目标缺失/重复/替换、主体切换、撤权：不发布或立即失效；禁止部分应用与写前副作用。

这些分支仍留在完整 Goal 分母中；当前候选的排除是实现边界，不是把义务改成 non-goal。

## 最小验证阶梯

1. 纯 producer 合同继续以 Contract/Cases r002/r004 的同一身份与失效 oracle 验证；当前 detached Delta Validation 只覆盖该层。
2. Store producer 进入后，使用真实 Dashboard editor 加载、恢复缓存、切换资源、旧响应迟到及卸载/重载验证 owner 发布可见性、raw/proxy 身份和 generation；在拒绝路径断言旧 owner 不复活。
3. 真实权限环境到位后，以持久 editor/viewer/admin 账号验证源读取与目标编辑的 allow/deny、授权撤销和基准恢复；凭据只放安全配置，不记录在本目录。无权路径需断言配置未读、目标与所有副作用面不变。
4. 真实产品 UI 链验证图表→图表、查询→查询、跨类拒绝、D1/D2 字段兼容、整树替换、取消/保存失败、预览查询与正常保存重开；检查复制有效期、容量、跨标签、logout/account switch 和既有过滤器回归。
5. 独立 Validation 对照完整 Goal 与全部冻结 Cases，逐项记录 pass/fail/blocked/not-run；静态检查、detached GREEN、standalone/admin 均不得代替产品或权限验收。

## 未准入条件与恢复入口

当前 `PermissionEnvironment.md` 记录权限模块仓库/安装包来源不可访问，隔离多用户实例及持久测试账号未建立；此前用户已授权设置测试账号，但授权不提供模块代码访问。Goal 也要求产品 Builder 绑定 S01 F01 Entry Packet、独立审查和终态摘要。故本候选不发放 Store/UI/source-read/target-commit Builder admission。

恢复实施需同时取得：

1. S01 稳定的 F01 Entry Packet、独立审查和终态摘要，并按当时 HEAD / worktree 重建上下文；
2. 经授权可访问的 permission module 来源或真实隔离实例、公开 SDK/扩展调用契约及确认加载的 profile；
3. 持久 editor/viewer/admin 测试身份、固定资源和基准授权，凭据安全存储；
4. 当前源码的产品入口映射、冻结产品 Contract/Cases、符合当前合同的可信 RED、独立设计复核和匹配实际 canonical target 的 admission。

在这些前置满足前，可以继续完成与权限无关的设计和 detached 技术验证；只读查看/复制/粘贴限制、权限撤销和恢复等验收持续 `BLOCKED / NOT_RUN`。不得将该状态写成 pass，也不得以权限替补实现缩小范围。
