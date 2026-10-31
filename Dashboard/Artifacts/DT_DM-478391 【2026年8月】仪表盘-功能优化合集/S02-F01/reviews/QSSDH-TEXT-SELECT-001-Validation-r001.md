# QSSDH-TEXT-SELECT-001 独立 Validation r001

## 1. 任务理解

本候选实现普通手工文本单选的离线 value-state helper：按已验证 snapshot 与 expected binding 的 revision/resource/component identity 决定是否接受输入；保留设计态默认值，排除旧运行值，并产生 detached carrier/runtime。候选不接 UI、Store、查询、保存/重开、网络或权限。

本报告只判断当前窄 helper package 是否符合 r006 合同。即使 package 通过，也不能证明可信生产者、产品调用、完整复制链路、保存/重开、权限行为或 S02 完成。

## 2. Read Manifest / Evidence Completeness

- Validation card canonical digest 为 `20e93bb185b51d0f4be0ee85593c28fce25d1d634bda074f1f833f449fb35cab`；`lane_task_card.py validate` 与 `render` 均通过。Context Bootstrap validate/render 通过，profile 为 `validation`、mode 为 `full_baseline`，唯一写入范围为本文件。
- Context 的 25 项 required read manifest 均与当前文件摘要匹配，`skipped_reads=[]`。Goal 摘要为 `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`；Design r006 为 `b098ecc7241fe809ffbb2407c78befb91583d54b6c35b2118fab05d17e8bd2f2`；Fixtures r006 为 `8beecc66105cd9075c25f396156f26ba13ea12eae242af7d9b9c26d86647b10c`；Design Review r005 为 `f68aefa3f656fc468e3ed56fd01ca008b8dda95aabc7f16ee8313f805df63dcb`；Builder ExecutionEvidence r002 为 `db952aa7d7adec4ee99ebe00f2de586ad1aafcf46fec9584e2b6e7e354c51294`。
- 本切片的完整实现差异是三个新增未跟踪文件：helper `core/core-frontend/src/custom-component/filter-copy/query-text-single-select-value-state.ts`，runner `core/core-frontend/tests/filter-copy-query-reference/query-text-single-select-value-state.test.ts`，以及 typecheck 文件 `core/core-frontend/tests/filter-copy-query-reference/query-text-single-select-value-state.typecheck.ts`。其摘要分别为 `17d2be6193324fcfa59a3ff0226f6bc12300fd5cbed914a07c4b9e4d20c7c301`、`07ca0fa95813d1ebc35c51bfbaad0329a11f9a24a303b8ae287fc41dbcddfc26`、`f2e187709c3725ec7816cf456141860acae06f5204ecb10902f840f1b759bffd`。限定范围内未发现额外产品接线文件或既有 tracked 源码差异。工作树另有大量与本 slice 无关的未提交改动；本验证未将其归入候选或检查为本候选成果。
- Goal 保留 26 项 must-have，当前均为 `pending`；Sessions 明确原 Goal 分母为 10 项 AC、26 项 must-have、16 项产品义务。候选不关闭这些义务，也没有批准的 Scope Delta。

## 3. 阻断发现

### QSSDH-VAL-001（P2）：默认关闭时未拒绝类型错误的 `defaultValue`

Design r006 将 `defaultValue` 定义为可选 `string`；默认关闭只表示 carrier 不保留该字段，不能使 JSON 中的 `null` 或数字变成合法 string。当前 helper 在 `defaultValueCheck=true` 时检查非空字符串，但在 `false` 时跳过类型检查（实现约第194–200行）。验证者使用同一实现做只读反例调用：固定 shape、有效绑定、`defaultValueCheck=false`，分别传入 `defaultValue:null` 与 `defaultValue:7`，两次均返回 `OK` 并静默丢弃该值。由此 malformed JSON 值被当作合法无默认状态接受，不符合精确输入类型和 fail-closed 边界。

**要求：** Builder 应在默认开关分支之外检查“字段存在时必须为 string”；当默认开启时再检查非空要求。若默认关闭下的非法值确实拟被忽略，须先由维护者明确并修订合同。需通过新的冻结回归用例验证该边界，保持现有 r006 identity 不变并为新增合同/用例版本重新绑定执行证据，然后申请独立复验。本 Validator 未修改实现或测试。

## 4. 非阻断发现

### QSSDH-VAL-002（P2）：可信 RED 失败数与耐久执行说明不符

独立执行同 runner 的强制未实现 RED，得到 `checks=17, failures=16, exit=1`；RED/GREEN runner SHA 均为 `07ca0fa…fc26`，source SHA 均为 `17d2be…c301`，Fixtures r006 SHA 为 `8beecc…7b10c`。GREEN 为 `checks=17, failures=0, exit=0`。现存 r002 RED stdout 也记录 17 checks、16 failures、exit 1；但 Builder ExecutionEvidence 声称“17项冻结断言失败”。runner 跳过 1 个 compile-time case，剩余 15 个 case checks 加 deep-freeze check 在 forced-unimplemented 下失败；第 17 个 `failure-has-no-side-effect-surfaces` check 只核对 fixture 的零副作用声明，仍会通过。因此 16 个失败构成可执行的 RED，但文字中的 17 failures 与实际日志不符。

**要求：** 后续耐久证据应把计数写为 `17 checks / 16 failures / exit 1`，或调整 runner/预期后重新绑定同身份完整输出；不得将单个通过的 side-effect fixture 检查记为失败。此项不改变 GREEN 结果，但当前验证请求所给“RED 预期 17 failures”未满足。

## 5. Scope narrowing / overclaim 检查

实现保持在 Design r006 的普通手工文本单选精确 shape，输入接受两种 opaque 类型，比较 revision/resource/component 身份，不创建认证工厂或 producer。TC-QTEXT-REJECT-015（revision 8/9）GREEN 结果为 `SOURCE_STAGE_UNVERIFIED`；TC-QTEXT-REJECT-016（null/null）GREEN 结果为 `INVALID_INPUT`。其它固定身份、输出和拒绝状态均与 16 项 fixtures 一致。

实现没有缩减 Goal 分母；当前候选执行说明也明确未接产品。真实权限验收仍为 `BLOCKED / NOT_RUN`，尤其只读用户限制、权限撤销/恢复仍未验证。S01 保持独立收尾。没有证据支持将当前候选表述为产品功能已就绪或 Goal 已通过。

## 6. 测试 / Gate 充分性

验证环境为 Node `v24.21.0`、TypeScript `4.9.5`、ESLint `7.32.0`。独立执行结果：

- `QSSDH_TEXT_SELECT_FORCE_UNIMPLEMENTED=1 node --experimental-strip-types tests/filter-copy-query-reference/query-text-single-select-value-state.test.ts`：exit 1，17 checks / 16 failures；runner 与 source 摘要正确，失败来自预期 `UNIMPLEMENTED` 与合同结果不符，不是模块解析失败。
- `node --experimental-strip-types tests/filter-copy-query-reference/query-text-single-select-value-state.test.ts`：exit 0，17/17 checks 通过；TC-015、TC-016 均通过。
- TypeScript 4.9.5 单文件边界检查：`./node_modules/.bin/tsc --noEmit --strict --target ES2022 --lib ES2022 --module ESNext --moduleResolution node --typeRoots /tmp/qssdh-empty-type-roots tests/filter-copy-query-reference/query-text-single-select-value-state.typecheck.ts`：exit 0，plain JSON 调用由 `@ts-expect-error` 确认不满足 opaque 输入类型。此项不是全量前端 TypeScript 检查。
- 定向 ESLint 对 helper、runner、typecheck 三文件：exit 0。

GREEN 覆盖冻结 15 个运行期 case、carrier/runtime、输入不变、对象 detachment、TC-015/016 状态和 fixture 声明的失败零副作用计数。helper 本身没有 query/store/snapshot 依赖。runner 的首次和后续 filter 投影由返回的 `selectValue` 映射为 `[]` 或 `[value]`；这验证 helper 产物与冻结投影一致，不是实际运行 `useFilter` 的产品集成验证。全量 typecheck、Vue/browser、产品调用与真实权限均未运行，不能提升为已验证。

## 7. KB / Dashboard truth split 检查

本验证未修改 canonical KB，也未改 Goal、Sessions 或 Topology。执行状态继续由 Dashboard 记录；本报告只新增独立验证结论，不把纯 helper candidate 写成稳定产品知识或 Goal 完成事实。

## 8. Required Builder repair

1. 按 QSSDH-VAL-001 修正或由维护者明确禁用默认时 malformed `defaultValue` 的合同语义，并增加新的冻结回归身份。
2. 重新执行并保全与新合同/runner/source/fixture 摘要绑定的 RED/GREEN、typecheck 与 lint；耐久 RED 说明必须与真实 `checks/failures/exit` 相符。
3. 将修复后的精确 package 重新提交独立 Validation。期间不接产品，不改变权限、Goal 分母或 S01 状态。

## 9. Verdict

- **Bounded package：`FAIL_FOR_QSSDH_TEXT_SELECT_001_PACKAGE`。** 当前 GREEN、typecheck、lint 和绑定状态 case 均通过，但 QSSDH-VAL-001 是对冻结输入类型 fail-closed 契约的可复现偏差，Builder 修复并独立复验前不能接纳该 package。RED 计数说明另需更正文证；当前 RED 仍是有效失败而非模块级假红。
- **Goal conformance：`PARTIAL`，DE-S02-F01 继续开放。** 本切片仅实现并验证有限 helper 候选，不能关闭任何完整产品义务或据此宣称 S02 完成。原 Goal 10 项 AC、26 项 must-have、16 项产品义务均保留；真实权限及产品接线继续 `BLOCKED / NOT_RUN`。

本报告只写入授权目标；未修改源码、测试、合同、Fixtures、Builder evidence、Goal、Sessions 或 Dashboard 状态。
