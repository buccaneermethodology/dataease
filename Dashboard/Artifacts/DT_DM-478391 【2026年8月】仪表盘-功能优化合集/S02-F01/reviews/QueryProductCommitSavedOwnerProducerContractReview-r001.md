# QPC saved-owner producer Contract/Cases r001 独立复核

## 双结论

**Design Freeze Validity：`PASS_WITH_BOUNDS`。** Contract r001 与 14 个 Cases 将 producer-local owner 生命周期、排除分支、失效和权限边界描述为候选状态合同；身份轴和授权结果没有被宣称为同一概念。结论只覆盖该语义模型，不把 `DESIGN_ONLY` 案例当成可运行或通过的测试 oracle。

**Implementation Entry Readiness：`NOT_READY_FOR_PRODUCT_UI_STORE`。** 不批准产品 UI/Store/source-read/target-commit 或真实权限验收。若要进入任何本地 producer Builder，仍需独立的精确执行准入和可信验证；产品路径还必须等待真实权限 provider、公开契约与隔离多用户环境。producer-local 合同通过不表示 producer 已实现。

## 复核基线

- Card SHA-256 `b195d5b2374e6c4ac2e8d52b6883812c9c48c31404527bf569a27a8aff23184c` 验证通过；ContextBootstrap 校验通过，12 项 required read 摘要全匹配，`skipped_reads=[]`。
- 已读取 Context 渲染 prompt、Contract/Cases、producer 设计和静态 Source Trace、前序独立设计复核、Goal、PermissionEnvironment、Sessions、PreparationStatus，以及 topology r222；Context 的前序绑定 topology r221 与 r222 执行快照保持可辨。
- 本次只读解析 JSON 和对照静态源材料；未执行用例、应用或真实权限测试，未修改 Contract、Cases、源码、测试、Goal、Session 或 topology。

## Boundary Review

### Authority、分母与 truth carrier

`Goal.final.json` 是目标、验收分母和声明上限的 authority。Contract 明确保留 10 项 AC、26 项 must-have、16 项产品义务、`Scope Delta: none` 和 S01 独立关系；Cases 也标示同一 contract ID。未发现范围缩小或把 QPC producer 子集替代完整 Goal 的表述。

Contract 是候选状态转换/不变量合同；Cases 是有序见证场景；静态 Store Producer Trace 是当前 checkout 源映射；producer 设计 review 是先前裁定。它们的 truth 职责没有被写成互相替代。Contract 标明 `frozen_for_builder=false`，14 个 Case 全部是 `DESIGN_ONLY`、`execution_ok=null`、无 evidence refs；这是候选场景，不是 RED/GREEN 或产品验收。前序设计 review 和本报告均不能抬升这些状态。

### 身份轴与生命周期

Contract 分开定义：

- resource requested/response/owner ID；
- load/request generation；
- canvas token、root raw reference/revision；
- target ID、raw reference/cardinality；
- source kind；
- principal/organization/session generation；
- source-read 与 target-edit authorization。

生命周期顺序也清楚要求先使旧代次失效、再加载/恢复、验证模式和元数据、完整 Store context 发布后才 mint 新 owner。owner 不派生/缓存权限；权限读取与目标提交属于外部授权轴。其 forbidden collapses 明确禁止将 owner 当登录身份/授权票据、将资源 ID 等同 canvas/generation、将静态 setter 顺序当原子性、或将 snapshot/cache 与 history、preview、query、save 合并。

一个需要实现前保持显式的边界是：Contract 的 `authorization` state axis 使用 `source_read_authorized` 与 `target_edit_authorized` 字段名，同时又规定这些值与 owner 独立、producer 不缓存/派生/证明。当前语义通过 rule 澄清了边界，但未来执行材料不应把这两个布尔值放进 owner snapshot；应把它们作为外部权限契约输入/状态，否则容易造成角色合并。

### 分支、stale response、mismatch 与失效场景

14 个 Cases 覆盖了用户要求的关键场景：

| 案例 | 设计边界与复核 |
|---|---|
| QPC-PROD-001 | 当前代、saved-edit、请求/响应 ID 相同且完整发布后才建立 owner；不表示 source-read |
| QPC-PROD-002 | 请求 R1、响应 R2 时拒绝；不发布 owner |
| QPC-PROD-003 | 旧 generation 响应不能覆盖较新资源；明确是 race oracle，运行时未观测 |
| QPC-PROD-004 | root/view 多 setter 未完整发布时不 mint；不能推断 Pinia 多字段原子 |
| QPC-PROD-005/006 | 同资源 cache restore 产生新 generation；异资源缓存拒绝；旧 owner 不复用 |
| QPC-PROD-007 | target 删除、重复或 raw 替换使 owner 失效 |
| QPC-PROD-008/009 | 真实 provider 的 principal 或 organization 变化使 owner 失效；provider 不存在，仍未运行 |
| QPC-PROD-010/011/012 | copy-as-new、template/blank create、preview/embed 排除于本合同 |
| QPC-PROD-013 | unmount/mode exit 使 owner 失效 |
| QPC-PROD-014 | 不论授权状态，producer 本身零 source-read/target-commit；授权 allow/deny 留给另一合同 |

合同的失败优先序包含 stale generation、unsupported mode、resource mismatch、incomplete publication、root/target 身份失败和主体/组织变化。当前未见与列出的单场景 Cases 矛盾。Cases 以简短字符串表达初态和终态，足以说明候选意图，但还不是可执行 oracle；特别是 QPC-PROD-004 后续必须明确观察窗口：该“不完整发布”是进入 producer 时已存在的 Store 部分状态，还是 producer 已开始写后失败。若后者，还需定义 partial publication 的终态/恢复行为。此边界不会被本次设计-only 合同审查写成已验证。

### Success / rejection oracle 与分支排除

Contract 对成功观察要求 generation 变化、resource ID 三方相同、当前 root/唯一 VQuery raw 引用一致、旧 owner 失效，以及 producer 不调用 source-read、target-commit 或权限 API。拒绝观察要求 owner absent/invalid、精确 reason/precedence、Store root/resource/config/selection 不被 producer 改动、旧响应不发布且无 source/target/preview/query/save side effect。Case 014 将“任意授权状态、producer 仍零读取/提交”单独列出，正确分离授权判定合同。

合同排除了 UI/Store 产品实现、source config 读取、copy/paste/目标提交、真实身份 provider、权限/撤权、preview/query/save/history 及 copy/template/create/preview/embed 的 producer 支持。copy-as-new 等仍是 Goal 义务范围的一部分；当前合同排除不构成 Scope Delta，也不应被误写为永久不支持。

## 权限阻塞与 claim ceiling

PermissionEnvironment 表明当前没有可授权访问的权限实现来源、公开的主体/资源/操作契约或真实隔离多用户实例；现有 standalone/admin/mock 不可替代。权限相关验收维持 `BLOCKED / NOT_RUN`。当前 QPC-SAVED-OWNER helper 与静态 trace 不能证明实际 principal/org 事件、撤权、source config 可见性、target edit 权限或 Store watcher/render 行为。

Claim ceiling 是“候选 producer-local 状态/生命周期合同”。不可压缩成 producer 已落地、saved-canvas copy 已支持、产品 UI/Store integration ready、权限通过或任何 Goal AC 完成。术语压缩测试要求用“producer-local 合同候选已通过有界复核；Cases 为 design-only；producer 未实现；产品接线与权限未准入”，不可只写“saved owner ready/complete”。

## Evolution / Implementation-Entry Review

### 最小切片与实现梯级

合同的最小切片是为正常已保存编辑与匹配 cache restore 定义 owner mint/代次条件，为 stale、资源 ID 不符、未完整发布、目标失效、principal/org 改变和卸载定义 owner invalidation/拒绝，并保证 producer 不执行权限、source-read、target-commit 或预览保存副作用。各被排除分支继续留在完整 Goal 分母。

合理的后续梯级是：

1. 将 QPC-PROD-001..014 的字符串初终态转成可精确复验的 producer-local contract/Cases，补 QPC-PROD-004 的部分发布观察窗口，并明确 owner 内不含 authorization 布尔值。
2. 为这一个本地 producer 切片另建绑定 Goal/Contract/Cases/Context 的精确 Builder admission、可信 RED/GREEN 与独立验证范围；本 review 不等价于该 admission。
3. 如未来涉及实际 Store/UI、source-read 或 target-commit，先有真实 owner producer、load-generation 与 watcher/render 可见性验证，再分别完成公开权限契约、隔离多用户、授权/撤权/恢复矩阵与独立产品准入。
4. 完整产品接线后另行观察真实 preview/query/history/save/reopen；任一 detached helper 或 producer-local GREEN 都不替代 Goal 验收。

该合同目前没有把 ontology、runtime ref、权限审批、历史、保存与发布决策塞入一个上帝对象；它把授权列为独立轴并明确不拥有。因为有一组 permission 字段名位于 producer axes，后续实现应维持“外部引用、不存入 owner”的规则。当前 JSON 是清楚标记的版本化候选合同，不应另加未验证 DSL 语义或宣称可解析执行。

## 最终边界

Design Freeze Validity 为 `PASS_WITH_BOUNDS`，仅确认 producer-local 生命周期合同与 design-only 场景有足够清楚的语义边界继续形成验证准入材料。Implementation Entry Readiness 为 `NOT_READY_FOR_PRODUCT_UI_STORE`。真实权限、隔离环境和产品 producer 运行时行为仍未验证；不批准产品 UI/Store/source-read/target-commit/权限验收。原 Goal 分母和 `Scope Delta: none` 保持不变。
