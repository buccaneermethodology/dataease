# 手工文本单选来源与 Oracle 候选独立语义复核 r001

## 双结论

**Design Freeze Validity：`PASS_WITH_FINDINGS / NARROW_MANUAL2_VALUESTATE_CANDIDATE`。** 这份候选正确区分 `optionValueSource=2` 手工输入与旧 `optionValueSource=0` 自动来源；范围限于 `displayType="0"`、单选、纯字符串值态，并明确排除身份/数据集重绑、全组件、保存/历史/权限接线。25 条 source trace 均有当前文件摘要匹配；12 个组合条目、18 条路径化字段规则及 27 个候选 fixture 与其边界相符。候选可作为一个 detached pure value-state 模块的设计输入。该结论不把当前 `candidate / frozen_for_builder=false` 提升为已冻结合同；guard/API 信任边界尚需补齐，AC-S02-02/03 仍 pending。

**Implementation Entry Readiness：`NOT_READY_NOW / PRODUCT_NOT_READY / PURE_MODULE_CANDIDATE_ONLY`。** 产品接线不准入：四个 `M2-P01..04` 均 `NOT_READY / NOT_RUN`，分别缺可信来源认证、保存重开、历史/undo 与真实查询命中 ID；S01 F01 Packet 仍 `NOT_AVAILABLE`，真实权限仍 `BLOCKED / NOT_RUN`。窄纯模块是合适的下一实现候选，但当前执行也不能直接开始：需先把生产 API 与测试 fixture 的来源身份边界、guard 拒绝语义冻结，建立同身份 RED runner 并取得 target-bound admission。届时实现范围只能是值态纯函数、其 runner/tests 与类型，不得新造认证来源或接 UI/Store/保存/权限。

## 复核身份、基线与方法

本报告只写此 Review；未修改被审 Design、Cases、StaticValidation、旧 source0 材料、Goal、CoverageMatrix、AC 来源、源码、tests 或权限状态。Card `S02-F01-R4-SH-SELECT-TEXT-SOURCE-ORACLE-REVIEW-r001` canonical digest 为 `232292fc50b1bf7346456616889d01ddf638b1a49fe4e13ae504e3d7b0ad090d`，validate 通过；Context SHA-256 为 `41f6c3ef032c06293264500136dc903ad0a66787dbbdc1883307f92f4e28b09f`，validate 通过，39 项 required-read 摘要匹配、`skipped_reads=[]`。实际 dispatch 记录为 Topology r250；复核重基线仍绑定 Card 指定的 Topology r249。

独立复算：10 项 Goal AC、26 项 must-have、16 项产品义务均保留，`Scope Delta: none`；12 个组合条目、18 条字段规则、27 个 case ID 唯一，16 项产品义务仍 `NOT_RUN`；27/27 case 为 `frozen_for_builder=false`、`execution_status=NOT_RUN`、`result=null`、`evidence=[]`，其中 23 项 `DETERMINATE_CANDIDATE`、4 项 `NOT_READY`。25 条 SRC 文件 SHA-256 均与 Cases 中 `source_sha256` 一致。以上验证登记与输入摘要，不是行为测试或验收。

## source2 与旧 source0 的语义边界

源码 `QueryConditionConfiguration.vue:3224–3233` 明确 0=auto、1=select_dataset、2=manual_input；`Select.vue:988–1039` 对 source2 使用 `valueSource` 构造选项。旧 `QueryTextSingleSelectExtractionDesign-r006.md` 与 Fixtures r007 固定的是 `optionValueSource=0`，且 18 个 case 都以 0 为输入；历史文档中的“手工”标题不能改写实际枚举。新候选把 0 的旧结果隔离，未计入 source2 覆盖，语义校正正确。此结论只说明当前源码枚举，不推断历史版本枚举。

源链证据从创建默认、手工值确认与校验，经过配置/运行写入、Select 选项构造、`useFilter` 查询投影，延伸至 save/load/history/undo、owner bridge 和工具栏保存路径。代码中的局部事实支持候选主要判断：配置选择会写 `defaultValue`/`defaultMapValue`，运行选择会写 `selectValue`/`mapValue`（`Select.vue:252–286`）；source2 以字符串化的 `valueSource` 生成选项（`Select.vue:1014–1038`）；查询 consumer 对首次与后续读取不同值分支（`useFilter.ts:141–155`）；`optionFilter=[]` 因数组 truthy 仍会进入额外 `in` 过滤投影（`useFilter.ts:372–395`）。这些路径能支持纯表达式或现有 consumer 的预期数组，不证明 SQL 命中 ID、组件挂载行为或产品保存行为。

## 组合、路径字段与 Cases 质量

12 个组合条目把“源码局部支持”“局部配置拒绝”“当前子模块不承载”“NOT_READY”分开，没有把单选 source2 之外的组合自动判成产品非法。尤其是非字符串历史值、`firstItem=true`、多选，以及缺失/空/非空 `optionFilter` 均保留边界。18 条字段规则路径化到 component、condition、value-state、source owner 与阶段；`defaultValue`、`defaultMapValue`、`optionFilter` 使用多条条件规则，分别表达 KEEP/REMOVE/RESET/REBIND/NOT_READY，而不是按字段前缀统一清理。

27 个 fixture 分层清楚：10 个 `M2-Q` 是已有 `searchQuery` 的确定输入/输出；4 个 `M2-O` 只复核已标出的 options 表达式，不调用整个 Vue 组件副作用；7 个 `M2-E` 是尚不存在的 detached candidate helper 合同；2 个 `M2-C` 是配置局部拒绝；4 个 `M2-P` 明确留空预期并为产品层 `NOT_READY`。成功纯候选与 guard 拒绝均约束输入不变、无部分输出及零网络/Store/snapshot/save/preview/success-toast；配置拒绝允许错误提示。sourceStage/binding fixture 字段明确是测试夹具，不颁发来源认证。

`optionFilter` 被正确单独处理：对现有 consumer，缺失、`[]`、非空值会产生不同投影，候选保留各自 oracle；对复制/extract，来源 producer 未证据化，字段只要存在（包含 `[]`）就 `NOT_READY`。`defaultMapValue` 仅在已认证 source2 配置态且严格空数组时允许从值态 carrier 排除，历史缺失/null/非空一律阻断。当前 `handleValueSourceChange`（`QueryConditionConfiguration.vue:1024` 起）切换 source 会重置默认值，但没有在该局部逻辑中清空 `defaultMapValue`；因此从 source1 切到 source2 时保留旧映射是需要容纳的边界。候选对非空历史 map 阻断而不是删除，处理方向正确。

## Findings 与处置

| ID / 严重性 | Finding 与证据 | 对接受/准入的影响 | 处置建议 |
|---|---|---|---|
| `QTSO-001 / P1` | **source2 pure API 的可信输入类型未正式冻结。** `M2-E01..07` 用普通 JSON 描述 `bindingFixture` 与 `sourceStageFixture="trusted-config-confirmed"`，设计同时正确说明它们只是测试前置，不是认证。尚无生产 owner 能产生 shape2 可信 snapshot；更关键的是，candidate 没有像已审 source0 子合同那样明确生产 helper 的不透明 snapshot/binding 参数类型，或明确声明 helper 只处理 caller 已认证的纯 valueState，绝不把阶段字符串/ID 当凭证。 | 阻止把当前候选直接交给纯模块 Builder，避免“测试夹具标记”滑成运行时信任判断；产品来源仍保持 NOT_READY。 | 在冻结前明确 API 边界：可复用可信边界的不透明 binding 类型并对 manual2 valueState 单独做 schema，或将纯函数限定为不认证的 valueState 投影、将 source admission 留给独立上层。runner 仅在 test harness 内构造夹具，不把 fixture-only 字段暴露给生产函数。 |
| `QTSO-002 / P1` | **guard schema/拒绝优先级仍是开放设计项。** `M2-E03..07` 分别覆盖单一失败条件；没有组合失败输入定义当同一对象同时含未知 shape、未认证来源、`optionFilter`、非空 `defaultMapValue` 或非法 default 时，输出哪个 status。设计的 `M2-G05` 也明确 schema/guard priority/runner 待独立确定。 | builder 可以实现拒绝行为，却无法保证诊断 status 是冻结契约；不同实现顺序会产生不同结果。 | 冻结一个短小、确定的验证顺序，或把多重失败结果降为统一 reject 且只保证零部分输出；为交叉失败至少补一个 oracle。 |
| `QTSO-003 / P1` | **产品可信来源、保存/历史路径尚未闭环。** `dvMain` 只暴露 `querySingleSelectLifecycle` bridge（SRC-19）；独立 `query-single-select-saved-canvas-owner.ts`（SRC-20）虽有资源/root/代际校验，当前证据未证明它就是 bridge 的生产来源 owner。save capture、实际保存响应 revision、load、manifest/缺 manifest fallback、undo/redo 也没有 source2 fixture。 | 产品 UI/Store、保存、恢复、历史接线不准入；不能把 owner 文件存在等同已接入或认证完成。 | 保持产品入口阻塞。后续单独完成 owner/producer 调用链和 shape2 保存版本 fixture、旧历史/缺 manifest/undo oracle，再经产品入口独立审查。 |
| `QTSO-004 / P1` | **真实产品命中与权限验收仍缺证据。** `M2-P04` 的 query hit ID 预期为空；filter 数组投影不是查询结果。S01 Packet 未提供，真实多用户权限环境不可用。工具栏的组织检查也不是后端授权（SRC-24/25）。 | 不能关闭 AC-S02-02/03，不能宣称产品实现/权限行为或只读/撤权验收通过。 | 维持 16 项产品义务 `NOT_RUN`、权限 `BLOCKED / NOT_RUN`；取得 S01 与隔离真实权限环境后再验证。 |
| `QTSO-005 / P2` | **边缘 option/default 组合仍有有意保留的 unknown。** `defaultMapValue` source1→source2 切换可残留旧值；optionFilter producer 未闭合；trim 空白、重复值、default 不在当前 valueSource、非 string/null 历史项未全取证。候选已阻止危险删除，但这些组合不能作为 source2 全形态规则。 | 不阻止纯值态子切片作为候选；阻止把切片提升为完整 source2 adapter 或历史迁移规则。 | 保留相应 NOT_READY；用真实 producer/历史 fixture 补充，而不是从 `Select` 单段 consumer 推断合法性。 |

## AC-S02-02 / AC-S02-03 与准入判断

- **AC-S02-02：保持 pending。** 当前窄切片有来源 trace 与候选用例登记，但 27 项未运行，4 个产品边界 case 无 oracle，source owner、历史/save/undo、查询命中与真实权限仍未闭合；不能据此声称全部冻结 F01 来源/AC 已映射到“无关键未决”的完整设计和测试。
- **AC-S02-03：保持 pending。** 本 Review 给出清晰的窄候选结论，但不覆盖完整 F01 Design Freeze 或代码实现边界；之前全形态 Review 的 blockers 未因本子切片改变。
- **下一纯模块入口：** 推荐单独的 detached manual2 value-state helper，范围只含精确 shape、设计字段提取、运行值 hydrate/reset、未知输入 fail-closed；不含组件 ID 重绑、checkedFields、optionFilter producer、保存/历史、query dispatch、Store、UI、网络或权限。该切片当前为“候选可接受、执行未准入”；先冻结 QTSO-001/002 的 API 与拒绝合同、同身份 runner/可信 RED，再由控制面发目标绑定 Builder admission。
- **下一产品入口：** 当前 `NOT_READY`。需先满足真实来源 owner/保存 revision 绑定、保存重开与历史/undo oracle、真实查询 ID，以及 S01 F01 Packet 与真实权限环境。纯 helper 的结果不得自动提升到产品阶段。

## 最小实现阶梯与后续 Session

1. 将 source2 的测试描述转成明确的纯 API：生产函数不得接受 `sourceStageFixture` 等可伪造认证字段；定义 guard 拒绝顺序或统一拒绝 oracle，并固定精确输入/输出和序列化规则。
2. 生成并冻结同身份 detached Cases/runner，只测试 M2-E 与必要纯投影，不调用旧 source0 helper；可信 RED/GREEN 前后保持相同 case identity。
3. 在独立 source2 helper 模块中实现提取/guard/hydrate；不得新增可信来源工厂或接 Product UI/Store。另做独立 Validation 对照冻结 Cases、零副作用及 source0/source2 不混淆。
4. 新建产品 Session 处理可信来源 owner、保存 revision、恢复/undo、optionFilter 历史以及真实 query/权限；S01/权限前置未满足时只保留 design-only/blocked。
5. 对完整 F01 分母做独立验证、Scope 对账和 closeout；此 Review 不关闭任何 Goal AC。

建议下一 Session 名称：`S02-F01-QTS-MANUAL2-PURE-HELPER`，唯一目标是冻结并实现 detached source2 value-state helper 及同身份 runner。其退出标准是有效的固化合同、RED/GREEN 与独立 Validation；不要求、也不替代产品来源认证/权限验证。

## 术语压缩风险与未来误用

- 单独写“23 个 oracle 确定”容易被读成 23 项测试已通过；准确表述应为“23 个输入/预期结构确定但全部 `NOT_RUN`”。
- 单独写“source2 手工设计通过”可能被扩展为全手工来源、source0 历史覆盖或完整 F01 完成；摘要需保留“仅 displayType 0、单选、manual2 的值态 pure candidate”。
- **误用 1：** 把旧 r006/r007 的 18 项 source0 测试计入 source2。防护：保留 enum 值、独立 case identity 和 `counts_as_manual2_coverage=false`。
- **误用 2：** 将 fixture 的 `trusted-config-confirmed` 或 binding 字段当成生产认证。防护：测试 harness 专属，不进入生产 API；可信 owner 与绑定流程另行准入。
- **误用 3：** 把 `optionFilter=[]` 当无条件可清理的空值，或把残留 `defaultMapValue` 一律删除。防护：保留 consumer 三态差异；copy/extract 遇到字段存在或历史 map 非空时 fail closed。
- **误用 4：** 把纯 helper 的 `PASS_WITH_FINDINGS` 外推到 UI、保存、历史、查询命中或真实权限。防护：保持四个 M2-P 项 `NOT_READY / NOT_RUN`，产品入口状态独立跟踪。

## 范围与结论

全局分母保持 10 项 Goal AC、26 项 must-have、16 项产品义务；`Scope Delta: none`。本复核接受 source2 手工文本单选 value-state 作为一个受限纯模块设计候选，但因 API 信任边界与 guard contract 尚未冻结，当前不能直接声称 Builder 已准入。产品实现、权限行为、保存/恢复、完整 F01 Design Freeze 与 Goal 完成均不在本报告结论内；S01 Packet 和真实权限继续保持未就绪。
