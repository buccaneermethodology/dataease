# QPC saved-owner 产品入口分层设计 r001 独立语义复核

## 双结论

**Design Freeze Validity：`PASS_WITH_BOUNDS`，仅限产品入口分层和后续实现阶梯的设计输入。** 候选保留 Goal 原始分母，准确区分当前 checkout 静态事实、detached producer-local 验证、未来 Store producer 提案与未解决的运行/权限问题；没有把 owner 身份提升为登录主体或授权票据，也没有把本地 helper 当作产品 producer。可据此冻结有界设计边界，不能把它解释为产品实现合同已完整或 UI/Store 入口已可实现。

**Implementation Entry Readiness：`NOT_READY_FOR_PRODUCT_UI_STORE / SOURCE_READ / TARGET_COMMIT`。** 当前设计不能发放产品 Builder admission。S01 F01 Entry Packet、独立审查及终态证据摘要仍是产品 Builder 的前置；真实 permission provider 来源/公开契约和隔离多用户环境也缺失。缺口解除后仍须按当时工作树重建合同、Cases、可信 RED、Context、实际 topology 与 action/target admission。

## 复核基线与证据

Card `S02-QPC-SAVED-OWNER-PRODUCT-ENTRANCE-DESIGN-REVIEW-r001` 的 SHA-256 `aa3dc550d0e81f86ff52d6b3f57cbe4423087e0a6b661ee9765e9a93d11beb72` 校验通过；ContextBootstrap 校验通过，15 项 required-read 摘要全部匹配、`skipped_reads=[]`。读取了渲染 prompt、Topology r234、Goal.final、产品入口候选、Store Producer Trace、producer design、此前独立 reviews、Contract/Cases r004、source DeltaValidation、PermissionEnvironment 与 Sessions。

当前源码定向核对与 Trace 一致：`dashboard/index.vue` 的正常加载入口先调用 `checkPer`，缓存恢复走 `snapshotPublish`，模板路径有独立的 `createInit` 和 setter；`canvasUtils.initCanvasData` 以多个 setter 发布 `componentData`、style、`dvInfo`、view；`dvMain` 未见 saved-owner helper 产品调用点。全前端搜索只见 `createSavedCanvasOwnerLifecycle` / detached producer 的定义，没有产品接线。本次看到的 Store 发布顺序、helper 定义及 `toRaw` 适配均为静态源码事实，不证明 watcher/render 中间状态、raw/proxy 稳定性、异步竞态或真实 owner 生命周期。相关源码仍以本地工作树快照为准，没有启动应用或执行产品行为验证。

source DeltaValidation r001 的边界与设计摘要相符：支持的是 detached producer-local identity invalidation 修复、14 个同身份 Case 运行及定向严格 TypeScript/ESLint；该报告未证明 Vue、Pinia、Dashboard Store、权限 API、source-read、target-commit 或 Goal AC。该独立报告另记全项目 `npm run ts:check` 受 3 个 TS6504 阻断；设计引用定向检查通过，并未声称全项目检查通过。此基线限制应随实现验证保留。

## Boundary Review

### Authority、分母与 S01 前置

`Goal.final.json` 作为范围和验收 authority，ledger 含 26 项 must-have，原 10 项 Goal AC 与 16 项产品义务保持完整，`Scope Delta: none`。设计明确指出 copy-as-new、template/create、preview/embed 等只是在该 producer candidate 中未覆盖，仍留在完整 Goal 义务中；没有把设计范围缩窄成新的 product non-goal。

Goal 的 entry 规则允许规划、Session、Design 先行，但要求产品 Builder 绑定 S01 F01 Entry Packet、独立审查及终态证据摘要，并按切片逐项解除条件。设计第 9、49–56 行清楚保留这些前置。当前 S01 仍继续收尾，所以设计可以评审，产品接线不可据此抢先开始。

### 身份、授权与产品调用边界

设计把 resource ID、root/target raw 引用、owner/load generation、QSSDH epoch/revision、principal/organization 和每次 resource/action authorization 分开。owner 只用于当前画布对象身份与生命周期一致性，不携带用户、会话或授权决定。来源读取前和目标提交前分别要求向真实 provider 重验授权；对无权、撤权、主体/组织变化和未知授权结果采取写前拒绝。该边界与 Contract r002 的授权外置约束一致。

分层也把加载/发布、owner producer、principal/授权、复制准备、目标提交/反馈分开；读配置、整树准备、target commit、snapshot/cache、dirty/history、preview、下游 query、保存/重开被作为不同阶段和观察面，没有塞进 owner producer。cache restore 必须核对资源并 mint 新 generation；copy-as-new 不得把源 ID 冒充目标；template/blank 与 preview/embed 不因 Store 形状相似而混入 saved-edit owner。静态代码支持这些路径确有差异，但候选将对应行为留给未来真实实现验证。

### 设计声明与证据上限

候选明确标为 `CANDIDATE_FOR_INDEPENDENT_REVIEW`，说明只提供 AC-S02-02/03 设计输入，不代表产品 Builder 准入或任何产品 AC 完成。它把 Store 单 action、加载成功屏障、cache/raw 关系、主体事件和授权 provider 描述为提案或未决条件；没有宣称 detached producer 等同于产品 producer，也没有把 Case `DESIGN_ONLY`、静态 Trace、standalone/admin 或 GREEN 提升为产品/权限验收。措辞及验证阶梯对当前证据有界。

## Findings、影响与处置

| ID | 严重度/状态 | 依据与影响 | Disposition |
|---|---|---|---|
| `QPC-ENTRANCE-READY-01` | `BLOCKER`（Implementation Entry） | `PermissionEnvironment.md` 记录没有可访问的真实权限模块/安装包来源、公开主体/资源/动作契约、隔离多用户实例或持久 editor/viewer/admin 身份。现有 standalone/admin 不能验证只读禁止查看/复制/粘贴、权限撤销或恢复。产品 source-read 与 target-commit 的安全行为因此不能实现验收；若用替补权限实现或静态 `checkPer` 代替，会违反 Goal 权限分母。 | 设计已诚实标注 provider 未知并保留门槛；无需为本轮设计冻结改写为已知 API。产品接线继续 blocked，取得授权模块来源/真实隔离实例和契约后重新建立权限用例、Context 与 admission。 |
| `QPC-ENTRANCE-READY-02` | `BLOCKER`（Implementation Entry） | Goal entry 规则要求绑定 S01 F01 Entry Packet、其独立审查与终态摘要，并检查当前 HEAD/worktree、环境和逐项条件；S01 尚在收尾。没有这些当时有效的证据，无法证明 S02 产品切片前置满足。 | 设计第 9、49–56 行已保留该要求。等待 S01 稳定后绑定真实摘要并重建上下文；不能由本 review 或用户继续推进 S02 的一般授权替代。 |
| `QPC-ENTRANCE-BOUND-01` | `FOLLOW_UP_REQUIRED`（未来实现） | 正常载入与 cache restore 当前都由多 setter 依次发布，静态源码未见原子 Store action、watcher 屏障、旧响应 generation 门控或 owner 调用点。若未来 Builder 仅按“setter 完成后 mint”的描述实现，可能漏掉中间状态可观察或旧响应覆盖问题。 | 当前设计已明确这些不是现状，并要求以真实编辑器验证发布可见性/raw-proxy 身份和旧响应行为。作为后续产品合同/RED/独立验证必检项，不阻止本轮分层设计有界冻结，也不构成准入。 |

未发现需本轮修复的设计语义冲突。前三项不是把权限或 S01 要求降为非目标：前两项阻断实施，第三项限定未来实现证据。

## 设计冻结边界与下一步

允许冻结的仅是：根据静态路径分类加载分支；规定 owner 只绑定当前资源/画布对象身份与代次；将 principal/授权、source-read、目标准备、target-commit 及其副作用分开；明确权限/产品实现的独立验证阶梯与禁入条件。

设计通过不关闭任何 Goal AC、must-have、16 项产品义务、权限用例或 S02 Goal。后续可以在不影响 S01、且满足其自身精确准入的范围内继续合同/Cases 或其他 detached 技术工作。产品 Store/UI、来源读取、目标提交必须等待 S01 F01 Entry Packet 与终态摘要、真实 provider/隔离权限环境、冻结的产品 Contract/Cases、可信 RED、独立审查以及匹配当前目标的有效 admission；其后还需独立产品验证和 Goal 验收。
