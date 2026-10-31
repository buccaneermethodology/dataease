# C2 普通刷新后逆序清理交接设计独立语义评审 r001

**结论：设计边界有条件成立；当前设计/案例包不能冻结，Builder 暂不可进入实现。**

| Gate | Verdict | 说明 |
|---|---|---|
| Design Freeze Validity | `PASS WITH FINDINGS` | 目标准确落在 C2V-005 的组件局部资源交接，未改写 Goal、原 C2 结论或验收分母；但下列 P1 发现需修订后才能冻结设计与案例。 |
| Implementation Entry Readiness | `FAIL` | 案例尚不能观察核心“销毁调用前先清空引用”不变量，也未固定 destroy 抛错通道；候选 helper 的通用卸载影响面未收敛。不能据此进入精确 Builder RED/实现。 |
| Overall | `BLOCKED` | 先修订此新设计交付物的边界与 oracle，再独立确认冻结；不得重开 `SliceC2Validation-r003` 的第 4 轮。 |

## 评审绑定与范围

- Lane card：`S02-MVP-C2-REFRESH-DISPOSAL-DESIGN-REVIEW-r001`，canonical SHA-256 `0cf67dfc84df4a86a308823306f59cb487b9ca4c29c5e94978015f809ea80bfa`，验证通过。
- Context：`ContextBootstrap-C2-REFRESH-DISPOSAL-DESIGN-REVIEW-r001.json`，SHA-256 `688e53d0b1fc48ceccb3f86a912120063a4993491cee622a47911d2af0614eaf`；required-read-set 中 18 个输入逐一复算摘要，均匹配；context validate 通过。
- 当前 Goal：`DE-S02-F01`，SHA-256 `4db931a6764a8c48345e7e8358e579550a9bc98594bf1654647716d72b9678c4`。P1 是 12 项界面 MVP；P2 是 26 项原始义务；完整 38 项不删减。真实权限验收仍 `BLOCKED / NOT_RUN`。
- 最新已绑定 Gate 为 state/receipt r207，`CONTINUE`、`final_allowed=false`，下一步是本设计独立审查；其不构成 C2 或 Goal 完成。
- 复核对象：`C2RefreshDisposalDesign-r001.md`（SHA `a0a0fabe9c5ac04d830a819fc897a941a8ae98284c79651f57294bbf61834b9e`）、`C2RefreshDisposalCases-r001.json`（SHA `b5a965b46d8524c9d3b27efe608de1d57e115f0ed87f594c38cded488e884242`）、C2V-005 终轮报告、两份此前局部修复报告、当前 SFC/wrapper/ready helper/map runner 与 README；均与 Context 摘要一致。
- 本次仅写入本评审报告。未修改源码、设计、案例、Goal、runner、既有报告或三轮交付物；未执行运行时/浏览器/SDK/GPU 验证。

## Findings

### F-001 / P1：案例只断言最终引用为空，未观测 destroy 调用前的同步清空

设计不变量 4 要求先同步清空当前引用，再调用外部 `destroy()`，以便即使 `destroy()` 抛错，第二条清理入口也不会重试；案例 oracle 虽称观察 current-reference state，28 个 case 实际只有 `expected_current_ref: null` 的最终状态断言。一个“先 destroy、后置空”的实现也会通过所有正常销毁用例，却违反明确不变量；若 destroy 抛错，最终状态还可能不同。因此，现有案例不能验证设计要求的关键次序。

**修订要求：**在 destroy double/spy 的调用入口同步采样组件当前引用，并对准备期实例与刷新后当前实例分别断言该引用已先置空；final-state 断言保留。用例需证明观测来自当前 SFC 写域，而不是仅对复制出的 helper 控制流断言。

### F-002 / P1：没有 destroy 抛错用例，异常语义与“最多一次调用”不闭合

设计说明异常不得吞掉且引用先清空；当前 28 案均以正常 destroy 为前提，`expected_red` 也只允许 7 个正常路径 assertion failures。现有代码的两个入口异常边界不同：`onBeforeUnmount` 通过局部 `cleanup` 捕获并上报错误（SFC 约 1808–1827 行）；返回的 `handle.dispose` 直接调用清理操作（约 1608–1624 行），且先将 `alive=false`。仅凭正常销毁矩阵不能证明 helper 变更后保留这两种错误行为，也不能证明 throw 后再次调用另一入口不会对同一实例重试。

**修订要求：**增加有界同步 `destroy()` 抛错分支，分别覆盖 `unmount → handle.dispose` 和 `handle.dispose → unmount`；断言调用前引用已清空、每个实例调用计数不超过 1、异常仍按各自现有入口被上报/传播、重复清理不重试。不要把 double 的抛错当作真实 SDK/GPU 释放成功，也不要新增吞错。

### F-003 / P1：建议 helper 的 unmount 调用点是所有非 G2 图表的共享清理入口

候选方向让 `prepareFilterPaste.dispose` 与 SFC `onBeforeUnmount` 的“非 `activeG2Scope`”分支共同调用释放当前 `myChart` 的 helper。前者属于仅对 G2/L7/L7Plot 准备开放的 paste handle；后者是所有非 G2 图表的通用卸载清理路径，不限地图。案例只覆盖七个地图 fixture，不能证明这一调用点的其余图表所有权和卸载行为不受语义变化影响。设计提到若跨其它图表 owner 则收窄，但当前建议尚未给出有效的范围识别条件或非地图对照。

**修订要求：**选定并写明一种边界：要么让共享 helper 仅用于可识别的本地 paste handoff 所有权，保留其它图表原路径；要么明确这是有意的通用卸载语义，并将受影响图表及关键 G2/legacy 对照加入最小回归。不要只凭“组件局部”就称影响仅限地图。`activeG2Scope` 的独立释放分支须继续保持身份与异常语义，不应被通用 helper 绕开。

### F-004 / P2：相邻的卸载期间异步 draw 完成路径没有纳入边界，可能留下同根因残余

普通 G2 legacy render 在 `ChartComponentG2Plot.vue` 约 986–1001 行先等待 `drawChart()`，随后将结果赋给 `myChart`；若此时组件已卸载，分支直接调用 `chartInstance.destroy()` 并返回，没有清空 `myChart`。若原 paste handle 尚留在 wrapper 的 `pasteNodes` 中，随后首次 `handle.dispose` 仍可能再销毁该引用。此为与 C2V-005 相邻的“异步 draw 跨卸载完成”时序；当前 28 案只覆盖 refresh 完成后再 unmount，不覆盖此交错。它不应被悄悄算作本次 C2V-005 已修复，也不要求本窄设计自动扩成通用异步取消工程。

**修订要求：**明确把该交错列为本次范围外的独立残余，并把设计的通用“任意先后顺序”措辞收窄到“普通刷新已完成、当前引用已稳定替换”的现有反例；或另行提供有界案例与设计依据。不得宣称覆盖所有卸载/异步启动时点。

## Boundary Review

### 已核对且当前无发现的维度

- **Authority / 分母：**Goal、补充授权、TSP 与 r207 state 对齐；P1 仅是里程碑，P2 的原始验收仍 pending，权限真验收没有被替换或降级。设计没有把 C2 修复说成 MVP 或 S02 完成。
- **原始 finding：**`SliceC2Validation-r003` 明确指出刷新后的新当前实例由 Vue 卸载销毁后，原 handle 第一次 dispose 再销毁同一实例；设计的清理交接方向与该事实相符。此报告是旧实现交付第 3/3 轮、预算已耗尽的证据，不得重开。
- **此前修复关系：**`C2LocalRepair-r001` 所述 `mapPasteInstance` 区分准备期旧实例与当前实例；`C2SceneRepair-r001` 所述 strict scene → normal scene 交接及后续复用，都是本设计的前置边界。新设计没有要求回滚这两项，也没有把旧实例与刷新后的当前实例合并。
- **案例矩阵结构：**7 个地图 fixture × 是否普通刷新 × 两种清理顺序，共 28 个唯一 ID；正序、逆序和未刷新对照均存在。期望区分旧/新实例计数，能够针对报告中的 7 个逆序失败而不更改图表类型分母。
- **scope 与 claim ceiling：**设计排除通用异步取消、资源注册表、GPU/SDK 内部保证、地图功能、tooltip、权限及整个 Goal 验收，且声明当前仅是设计候选。静态 wrapper 条件可解释为何旧 handle 可能继续存活，但没有声称真实浏览器已复演。
- **资源 helper 方向：**“先把当前引用移出 owner，再调用 destroy”可解决两个清理入口各自以相同共享引用为目标时的重复调用，且不要求全局资源管理器。此只支持设计方向合理，不证明实现或 vendor 资源释放。

### Claim 压缩误读与未来误用场景

1. 未来 Session 只看到标题中的“设计评审通过”，就把 C2V-005 或 MVP 标成 closed。缓解：维持本报告双 Gate；只称 design review，不改变 C2 r003 的 `BLOCKED` 与 Goal 状态。
2. Builder 把 `onBeforeUnmount` 通用非 G2 分支都改为新 helper，却只跑 7 类地图矩阵。缓解：先处理 F-003，冻结明确的地图 handoff 边界和非地图/G2 对照。
3. Builder 只看最后 `myChart === null`，漏测销毁调用前置空或 destroy 抛错后重试。缓解：按 F-001/F-002 把采样点和 throw 两顺序写进 frozen Cases。
4. 后续汇报把 double 中 destroy 调用次数等同真实 SDK/GPU 已释放，或把静态 wrapper 条件写成真实浏览器已观察。缓解：保留双重声明边界；当前证据只到 SFC 组件与 SDK double 的调用协议。
5. 看到 28 案覆盖七 fixture 就推断全 49 类型、跨入口/权限或 Goal 已完成。缓解：案例明确禁止图表分母折叠；Goal 38 项仍需分别验收。

## Implementation-Entry Review

### 最小安全切片与推进阶梯

当前设计已给出一个小且可审查的生产切片：本组件局部取出当前 `myChart` 引用、先置空、再销毁；仅由两个已识别的局部 owner 调用。**但在 F-001 至 F-003 未解决前，这只是方向，不是 Builder 可直接执行的精确 slice。**建议顺序：

1. 修订本设计/案例的范围、时序、destroy throw 与同步引用观察点；确认 F-004 是明确 out-of-scope 残余或另有独立 bounded cases。
2. 冻结修订后唯一的 Contract/Cases identity，验证前置/最终引用和错误通道 oracle；随后只对实际组件模块与案例 runner 准备同身份可信 RED，区分预期语义失败与执行错误。
3. RED 可信后再签发精确 SFC/runner action-target execution admission，Builder 只实现共用的最小局部释放操作，不得改 Contract/Cases。
4. GREEN 复用同一身份；运行冻结的 28 案扩展矩阵、原 maps 317 基线以及适用的 renderer/tooltip/paste 回归和定向静态检查。若影响面仍是通用卸载路径，须加入 F-003 要求的对照。
5. 由非 Builder 独立验证完整差异及异常通道，再单独处置 C2V-005；仍不得升级 49 类型、真实浏览器、真实权限、GPU 或 Goal 完成声明。

### 下一 Session 所需输入、输出与验收

- **输入：**本报告；当前 Goal/authority、C2V-005 终轮报告、两项先前 repair 报告、SFC/wrapper/helper/map runner 当前摘要；若任何摘要变化则重新绑定 Context 与 card。
- **输出：**修订后的新设计和新的冻结案例文件/identity、可信 RED 与执行记录、精确 admission 之后的最小源码变更、同身份 GREEN/回归报告、独立验证报告。不得改写 r003 或伪造此前三轮未解决为通过。
- **本局部验收：**两种 cleanup 顺序都不重复调用同一当前实例 destroy；销毁前引用已同步清空；正常刷新前后的实例身份分别精确计数；throw 时保留既有异常路由且不重试；无查询/Store/目标状态副作用；C2V-005 原症状被相同身份案例关闭。
- **非目标：**完整异步取消、启动前/卸载中延迟完成的通用治理、SDK/GPU 释放保证、真实浏览器复演、所有地图供应商、49 type、权限、query/save/reopen 和 Goal 终态。

## 已检查的限制与同类残余

- 当前 `ChartComponentG2Plot.vue`、wrapper、`FilterPasteMapReady`、runner/README 的绑定摘要均匹配 Context。静态 wrapper 代码存在在 child renderer 条件卸载时 parent `pasteNodes` 仍保存 handle 的可能路径；这是源码可达性分析，不是浏览器观测。
- 旧报告中的 317 是组件检查条目，不是 317 个图表类型；原 r003 对 C2V-005 的 7 个逆序反例和执行边界仍有效。
- 本次不运行 runner，不以既有绿测替代当前设计验证，也不证明新 28 案已经执行。真实 SDK/GPU/浏览器、实际用户可达性、权限和完整 MVP 均未检查或验证。
- 同类残余至少包括 F-004 所列卸载期间异步 draw 完成并在之后再次 handle.dispose 的时序；此外原 r003 中与 C2V-005 无关或明确未覆盖的 SDK/provider、hover、普通异步时点等限制按原文保留。不得把残余搬入本次 C2V-005 修复后报成已覆盖。

## 有界准入预测

F-001 至 F-003 是本新设计交付物的准入前置；完成修订、重新绑定新设计/案例摘要并取得适用的独立审查后，可预测只允许为精确 SFC/runner 切片准备可信 RED。F-004 应保留为明确残余或以独立批准的窄案例另行处理。即便 C2V-005 后续通过，也只可能关闭该局部实现 finding；C2V 原三轮仍保持历史 `BLOCKED` 结论的原始记录，S02 的 38 项 Goal、真实权限 `BLOCKED / NOT_RUN` 和所有未验环境边界均不变。
