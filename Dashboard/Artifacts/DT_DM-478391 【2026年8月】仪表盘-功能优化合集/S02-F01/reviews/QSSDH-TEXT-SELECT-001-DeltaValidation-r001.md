# QSSDH-TEXT-SELECT-001 Repair r001 独立 Delta Validation

## 1. 任务理解与声明上限

本轮验证针对 r006 普通手工文本单选 value-state helper 的一次有界修复：当 `defaultValueCheck=false` 时，如果输入仍提供 `defaultValue`，其值也必须是 string；仅默认开启时额外要求非空。r007 fixtures 应保留 r006 的16个既有 case identity，并新增 null 与数字两个非法反例。

本报告裁定的是本次纯 helper 候选包，不证明真实来源生产者、产品接线、useFilter 实际运行、UI/Store、保存/重开、权限或完整 Goal 完成。

## 2. Read Manifest / Evidence Completeness

- Validation card canonical digest `cfe7e30cb63bd89ee36acd9e56407591e5fa49792a3deba2b06c66eeb6be80c6`：validate/render 通过。Context Bootstrap digest `941dcb4b083cdd77e93f1083127a689a7d90458d6d4a5112fa2043fca8829058`：validate/render 通过，`task_profile=validation`、delta mode、`skipped_reads=[]`，唯一写入目标是本报告。
- Required Read Set 共16项，当前摘要全部匹配，无输入漂移。实际 Topology r163 SHA-256 为 `6e9a44b920d9a32ab8c615d6125a1fa14209bdfab6788042463d09c770a5e743`，记录 repair Builder candidate 完成且独立 Delta Validation 待执行；本报告不改写它。
- r006 Design SHA-256 `b098ecc7241fe809ffbb2407c78befb91583d54b6c35b2118fab05d17e8bd2f2`，Fixtures SHA-256 `8beecc66105cd9075c25f396156f26ba13ea12eae242af7d9b9c26d86647b10c`；Repair Contract SHA-256 `924717c2eeefa8e04492e336d9ff7cc2876338f4c9b338235ba493abdaa3bf5e`；r007 Fixtures SHA-256 `2ba16485d5030d8bc5ffb6096a9e146e1516c25b862804828a87bd1d46aadaf2`。
- 被测 helper SHA-256 `02d17666bb5224ea829f83f4475e5c60ca380e342bc2335d63c25c0411474761`；runner SHA-256 `a16a8eb5a0ff40d90a4d82be961672401dcf105e99d286986cb3b3d07072a6da`；typecheck 源 SHA-256 `f2e187709c3725ec7816cf456141860acae06f5204ecb10902f840f1b759bffd`。它们与 RepairEvidence r001 绑定的摘要一致。
- 候选实现差异限于 helper、同身份 runner、r007 fixtures、Repair Contract 和 RepairEvidence；typecheck 文件与前一轮摘要相同。helper 在默认值校验中新增“字段存在时类型必须为 string”检查；runner 指向 r007 并核验18项固定 case。未见产品调用或权限路径接线。

## 3. r006 → r007 与 Finding 修复核验

解析后逐对象比较，r007 的前16个 case 与 r006 全部16个 case 完全相同，identity 与顺序均保留；r007 总数为18且 identity 唯一。只新增：

- **TC-QTEXT-REJECT-017**：`defaultValueCheck=false` 且 `defaultValue=null`，预期 `DEFAULT_VALUE_INVALID`。
- **TC-QTEXT-REJECT-018**：`defaultValueCheck=false` 且 `defaultValue=7`，预期 `DEFAULT_VALUE_INVALID`。

两条新用例均要求 carrier/runtime 为 null、输入不变、query/Store/snapshot 写入为0、失败无部分输出。实现对“字段存在且非 string”返回 `DEFAULT_VALUE_INVALID`，与 Repair Contract 一致；默认关闭但值为 string 时仍不把 defaultValue 写入 carrier/runtime。此前 QSSDH-VAL-001 已由这两项反例覆盖并关闭。

既有边界仍保持：TC-QTEXT-REJECT-015 的有效 revision 8/9 mismatch 返回 `SOURCE_STAGE_UNVERIFIED`；TC-QTEXT-REJECT-016 的 null/null 返回 `INVALID_INPUT`。其余 r006 identity 与期望未变。

## 4. 独立执行结果

环境为 Node `v24.21.0`、TypeScript `4.9.5`、ESLint `7.32.0`。在 `core/core-frontend` 独立复跑：

- 强制未实现 RED：`QSSDH_TEXT_SELECT_FORCE_UNIMPLEMENTED=1 node --experimental-strip-types tests/filter-copy-query-reference/query-text-single-select-value-state.test.ts`，exit 1，`checks=19, failures=18`。
- GREEN：`node --experimental-strip-types tests/filter-copy-query-reference/query-text-single-select-value-state.test.ts`，exit 0，`checks=19, failures=0`。两个输出内的 runner/source SHA 完全一致，分别为 `a16a8eb5…2a6da` 和 `02d17666…74761`；同次执行读取的 r007 Fixtures 摘要为 `2ba16485…aadaf2`。
- TypeScript opaque-input boundary：`./node_modules/.bin/tsc --noEmit --strict --target ES2022 --lib ES2022 --module ESNext --moduleResolution node --typeRoots /tmp/qssdh-empty-type-roots tests/filter-copy-query-reference/query-text-single-select-value-state.typecheck.ts`，exit 0。该单文件检查证明普通 JSON 调用不满足 opaque 输入类型；不代表全量前端 typecheck。
- 对 helper、runner、typecheck 三个文件执行定向 ESLint，exit 0。

RED 共19个 check，其中17个运行期 case 加 deep-freeze check 共18个失败；唯一通过的是检查冻结 fixture 中失败用例零副作用计数的结构性 check。该计数与 RepairEvidence r001 的18 failures 一致。它更正了早期 r002 文本的旧计数；历史证据与前一轮报告保持未修改。

GREEN 实际覆盖 carrier/runtime 输出、source 不变、detachment、拒绝无部分输出、TC-015/016/017/018 状态及 fixture 的零副作用声明。helper 无 query/store/snapshot 依赖。first-load/subsequent filter oracle 仍由 runner 从 runtime `selectValue` 形成 `[]` 或 `[value]` 投影；没有在本轮调用产品 `useFilter`，因此不声称产品查询行为已验证。

## 5. 原 Goal、范围与状态边界

`Goal.final.json` 保持 DE-S02-F01 的26项 must-have，当前全部 `pending`；Session 分母仍为10项 Goal AC、26项 must-have、16项产品义务，无批准 Scope Delta。r007 只扩充 helper 的局部反例，不删除、替换、延期或降级 Goal 要求。Topology r163 和 RepairEvidence 均把 claim ceiling 限于 helper candidate。

真实多用户权限环境仍未具备。只读用户查看/复制/粘贴限制、权限撤销与恢复继续为 `BLOCKED / NOT_RUN`；产品来源 producer、产品接线、保存/重开也仍未验证。S01 继续独立收尾。本报告不更新 Dashboard 状态。

## 6. Findings 与后续

**本候选范围内未发现新的阻断或非阻断 finding。** QSSDH-VAL-001 的修复满足 Repair Contract，QSSDH-VAL-002 的 RED 计数在 RepairEvidence r001 中按实测更正为18/19。原 Validation r001 与 r002 历史证据保持原样。

bounded helper package 可作为通过独立 Delta Validation 的候选交付。后续如推进产品接线，必须另行定位并验证可信来源 producer，按新目标生成设计/接线准入和产品验证；不能复用本报告证明产品、权限或 Goal 完成。

## 7. Verdict

- **QSSDH-TEXT-SELECT-001 repair candidate：`PASS_WITH_BOUNDS_FOR_QSSDH_TEXT_SELECT_001`。** r007 保留16个既有身份并只新增两项反例；RED/GREEN、opaque type boundary 与定向 ESLint 均达到当前窄 package 要求。结论只适用于 helper 候选。
- **DE-S02-F01 Goal conformance：`PARTIAL`，Goal 继续开放。** 本候选不关闭原10项 AC、26项 must-have 或16项产品义务。真实权限仍 `BLOCKED / NOT_RUN`，产品接线和完整 S02 均未验收。

本报告是唯一写入；未修改源码、runner、fixtures、Repair Contract、Builder Evidence、Sessions 或 Topology。
