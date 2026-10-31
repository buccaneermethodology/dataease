# 图表过滤树载荷准备器独立语义审查 r003（最终轮）

## 双结论

- **Design Freeze Validity：NEEDS_REVISION（本交付物最终轮未通过）。** r003 已解决多数前轮合同问题，manifest 与两份候选内容的摘要相符；但 accessor cases 的 expected 结构与失败结果 exact-keys 合同混用，令当前用例 oracle 不能无歧义执行。另有 runtime setup/断言的执行细节和特殊类型 snapshot 边界需澄清。
- **Implementation Entry Readiness：NOT_READY_FOR_BUILDER。** 不得由本审查放行 Builder。除设计仍有未决问题外，当前没有本轮 review 后生成并验证的 exact-target Context/card/execution admission。产品接线仍受 Goal 的 S01 F01 Entry Packet 前置、真实权限隔离环境及相应验证限制；standalone/admin/mock 不可替代。
- 本次是该交付物第 **3/3 轮**最终审查。发现仍需修订时，不再开启同一交付物第 4 轮，也不以改名、拆件或追加 manifest 绕过上限；保持本轮结论与 Builder 阻断。

## 审查范围与快照

完整读取 ChartFilterPayloadDesign-r003.md、ChartFilterPayloadCases-r003.json、ChartFilterPayloadManifest-r003.json、r002 报告及 CFP-001..010 的处置；核对当前 FilterTree.vue/RowAuth.vue 及 Goal/S00/S01/权限声明。Cases JSON 成功解析，含 38 个唯一 ID（TC-CFP-001..038）；本轮没有运行 helper/runner、产品构建、浏览器、数据库或权限验收，也未修改候选或源码。

本轮 SHA-256（UTF-8 原始字节）：

| 文件 | SHA-256 |
|---|---|
| ChartFilterPayloadDesign-r003.md | 5ad93fdd9147fbfa2385f5c05ed302825b6926f89efb663f43cb62f7f6bc7006 |
| ChartFilterPayloadCases-r003.json | b4136d263c153bb5db233b0d7db4ef551f160919dcda36293c7e2ddbf8167293 |
| ChartFilterPayloadManifest-r003.json | f5030fe5e05dbd9af93c3b49d54c4ae80b9478f53359746f1f5b1e58587e1787 |

绑定核对：Cases 的 design_sha256 与 Design 的重算值完全一致；Manifest 的两条相对路径均准确指向本次审查对象，条目 SHA 与 Design/Cases 重算值逐一一致。Manifest 不自引用自身摘要；Design 明确要求未来 Build Context/Admission 锁定 Manifest 摘要，因此 pair 的摘要绑定顺序无循环且当前内部一致。此处不表示 Context/Admission 已生成或消费 manifest。

## CFP-001..010 逐项处置

| Finding | r003 处置与本轮 disposition |
|---|---|
| CFP-001 truthy field 行为 | **CLOSED_WITH_BOUNDS**：Design :14,32,51 复现 truthy 删除；Cases 覆盖 truthy/false/null/0/空串及缺省 field 成功叶，TC-CFP-014 覆盖 truthy field + 空 items。 |
| CFP-002 root/node/subTree 谓词和错误归类 | **CLOSED_WITH_BOUNDS**：Design :29-34 明确谓词；Cases 覆盖缺 root logic/items、错误 root type、非数组 items、非法 root/subTree logic、null item、缺 subTree logic/items、array-valued subTree 和空组叶分支。 |
| CFP-003 cycle runtime builder | **CLOSED_WITH_BOUNDS**：TC-CFP-031 用 root-to-descendant back-edge 构造 cycle。 |
| CFP-004 unsupported 值域/marker 协议 | **CLOSED_WITH_BOUNDS（受 fixture protocol 限定）**：Cases 覆盖当前列出的非 JSON 值类别；通过有限 value_kind 和专用 setup，不使用 marker 替换。该枚举/构造仍有见 CFP-012。 |
| CFP-005 深度隔离/失败无 partial oracle | **CLOSED_WITH_BOUNDS**：Design :40-45、Cases protocol :27-30 定义 graph snapshot、双向 sentinel probe 与 exact failure keys；accessor expected 结构见 CFP-011。 |
| CFP-006 Design/Cases 摘要绑定 | **CLOSED_WITH_BOUNDS**：本轮重算确认 Cases 和 Manifest 均绑定正确；未来仍需 admission 锁定 manifest 本身摘要。 |
| CFP-007 RowAuth carrier 与临时 field 来源 | **CLOSED_WITH_BOUNDS**：Design :15,57 与 TC-CFP-016 source_refs/fixture_note 已拆分 RowAuth 叶 carrier 和 FilterTree 注入的 synthetic field。未声称 synthetic metadata 复现实际对象 shape。 |
| CFP-008 Proxy 边界 | **CLOSED_WITH_BOUNDS**：Design :23,29,61 将 hostile Proxy 排除于可信 JSON-shaped 输入的保证域，且不宣称捕获异常可撤销 trap 副作用。 |
| CFP-009 __proto__ 保留 | **CLOSED_WITH_BOUNDS**：Design :33,62 明确 own-property/value 语义；TC-CFP-015 断言 own key 与输出 prototype 状态。该用例额外断言语义的精确定义见 CFP-013。 |
| CFP-010 cycle-safe graph snapshot | **PARTIAL / P2**：Design :40-43 和 protocol :27 明确 cycle-safe、visited-pair、引用/别名拓扑；但对 Date/Map/Set 等特殊对象内部状态的快照未定义，见 CFP-014。 |

## 本轮全部 Findings

### CFP-011 / P1 / OPEN：accessor 观测值与被测函数 expected result 混在同一对象

**位置：** Design ChartFilterPayloadDesign-r003.md:25,42-45；Cases ChartFilterPayloadCases-r003.json:929-938,957-966。

失败返回合同规定函数结果对象精确只有 {ok,reason}（Design :25,34；Fixture failure_shape 为 protocol :29）。但 TC-CFP-029 和 TC-CFP-030 把 getter_call_count:0 放在 expected 对象中，与 ok/reason 并列；同一用例又要求 failure_has_exact_keys。Protocol accessor_observation（Cases :30）及 assertion getter_not_invoked 的意图看起来是检查 runner 侧副作用计数，不是 helper 返回字段，但 Cases 没有将 expected helper result 与 expected harness observations 分开。

**影响：** 若 runner 按 expected 与 helper result 深比较，两个本应正确的失败结果会因多出 getter count 而不匹配；若 runner 忽略 expected 多余键，则 accessor 观察的实际断言又没有唯一数据载体。当前固定 oracle 有两种互不相容的解释。

**建议处置：** 将 expected_result 严格限定为 {ok:false,reason}，另设 expected_observations:{getter_call_count:0} 或明确的 assertion 参数；逐项说明 getter_not_invoked 读取的是 runner 侧计数而非 helper 结果。本交付物已到 3/3，记录为最终未关闭项，不另开第 4 轮。

### CFP-012 / P2 / OPEN：runtime special value enum 有重复项，构造语义尚未完全确定

**位置：** Cases ChartFilterPayloadCases-r003.json:7-30,1140-1155。

special_value_kinds 声称是 closed enum，但 negative_infinity 重复两次（:17-24）。JSON 允许重复数组项，但这会降低 enum 登记的规范性。另如 array_with_group_keys、class_instance、date、map、set 只列了名字，没有定义 set_special 构造出的精确值/内部状态；TC-CFP-038 的 array extra own keys 也没有用独立的 attach_array_extra_key 操作明确指出具体 key。不同 runner 可以得到不同特例对象，虽都满足名称的直觉解释，却不一定形成同一输入 identity。

**影响：** 受限 runtime builder 比 r002 已显著具体，但固定特殊值的逐字节以外运行时语义尚未完全冻结；重复 enum 值也可能掩盖维护时漏项或误项。

**建议处置：** 由维护者在后续修订中去重，并给每个 builder kind 固定构造规则（例如 Date 的时间值、Map/Set 内容、class instance 的原型/自有字段、array group keys 的确切 key 集）。若其含义只是“任意代表值”，明确可变化字段及仍须稳定的类别谓词。

### CFP-013 / P2 / OPEN：扩展 assertion 名称的比较基准和判断动作未完整定义

**位置：** Design ChartFilterPayloadDesign-r003.md:40-45；Cases ChartFilterPayloadCases-r003.json:495-500,934-938,962-966。

Design 明确定义了 input_graph_equal_snapshot、两种 detached probes、failure_has_exact_keys、preserves_exact_payload，但 TC-CFP-015 还使用 output_proto_unchanged、output_own_key_present，accessor cases 使用 getter_not_invoked；后两个/三者没有共同的可执行断言格式。尤其 output_proto_unchanged 未说明与 input prototype、标准 Object.prototype 还是 invocation 前 snapshot 比较；output_own_key_present 未定义检查哪个对象路径/键/值。Accessor 计数另有 CFP-011。

**影响：** __proto__ case 的额外安全 oracle 和 accessor 观察需由 runner 作者临时解释；不同 runner 可能都声称通过但检查不同语义。

**建议处置：** 对扩展 assertion 规定参数和唯一比较基准，或将其改写为已定义的通用 graph_assertions 路径/value/prototype predicate。第 3 轮后不再启动此对象的复审。

### CFP-014 / P2 / OPEN：特殊对象 graph snapshot 未覆盖 Date/Map/Set 内部状态

**位置：** Design ChartFilterPayloadDesign-r003.md:40-43；Cases protocol ChartFilterPayloadCases-r003.json:27；用例 :783-885。

Graph snapshot 声称保留 primitives、prototype、own keys/descriptors、array holes、aliases 与 reference edges；Date 的时间值、Map 的 entry 序列、Set 的成员属于 intrinsic/internal state，不一定呈现为 own keys/descriptors。当前 Date、Map、Set rejection cases 都执行 input_graph_equal_snapshot。若 helper 在判定前改变 Date time 或 Map/Set contents，所列 snapshot contract 不一定能发现；它们不能仅凭记录 own keys 判定输入值完整不变。

**影响：** input_graph_equal_snapshot 对 JSON/plain record 和循环引用有明确 oracle，但它对被明确列入 unsupported 的特殊对象未必能验证“不修改输入”不变量。

**建议处置：** 为列出的 special object builder 规定 intrinsic-state snapshot/compare（Date time、Map entries、Set membership/iteration order），或对 unsupported special values 将断言限定为不调用自定义 getter/不写 own properties，并明确不声称比较其所有内部状态。该边界应与“完整 graph snapshot”用语保持一致。

### CFP-015 / P2 / OPEN：允许 null-prototype record，但 runtime fixture 无法构造或覆盖该接受分支

**位置：** Design ChartFilterPayloadDesign-r003.md:29-31；Cases protocol ChartFilterPayloadCases-r003.json:8-9，无 null-prototype case/operator。

Design 接受 Object.prototype 与 null prototype 的普通记录；Cases 的每个初始 fixture 都由 JSON.parse 创建，runtime op 列表没有将指定记录转换为 null prototype 的操作，38 个 cases 中也无 null-prototype 输入。由此无法验证 helper 是按合同接受该域并保留 own keys，还是意外把其判为 unsupported/invalid。

**影响：** Design 的 accepted input domain 比冻结案例实际覆盖域更宽；后续 test pass 不能支撑“所有约定 plain record 原型形式均支持”的声明。

**建议处置：** 增加安全、明确的 set_prototype_null runtime operation 和对应成功用例，验证调用前后图快照、payload own keys/深度隔离；或者将 null-prototype record 从输入接受域移除。此 finding 在本交付物最终轮保持未关闭。

## Authority、边界和声明上限

- **Goal/S00：** 原 Goal 仍要求完整 chart→chart、query→query、同数据集/权限检查、原子替换、预览保存、真实权限与独立验收。Design/Cases 明确是 chart payload helper 候选，不缩小原 10 项 Goal AC、26 项 must-have、16 项产品义务，也不改变 Scope Delta: none。
- **源码语义：** FilterTree.vue:47-55 对有效节点按非空 subTree.items 递归，空 items 按叶分支处理，且仅 truthy field 被删除；FilterTree.vue:59-68 注入 computed field metadata；RowAuth.vue:232-245 生成叶 carrier 而不生成 field。r003 已将这两种来源拆分且没有把 helper 冒充 FilterTree 产品路径。
- **Query adapter 分界：** 本候选只复制图表 customFilter JSON-shaped 值，不接 query schema、Store、UI、权限、source-read 或 target-commit。不得据此关闭 query adapter 合同。
- **S01/权限：** S01 F01 Entry Packet 仍为有条件，真实权限模块与隔离实例不可用；只读用户禁止查看/复制/粘贴以及权限撤销/恢复仍为 BLOCKED / NOT_RUN。本轮没有权限验证证据，不能以 standalone/admin/mock 替代。
- **最强可支持声明：** “r003 的候选 Design/Cases/Manifest 摘要绑定一致；大部分 r001/r002 语义 findings 已有明确处置；最终轮仍发现 runner expected/assertion 和边界覆盖问题。”不能压缩为设计冻结、Cases 全验证、helper 实现、产品接线准入、权限通过或 S02 Goal 完成。

## 最终轮次结论

r003 为 **3/3**。本轮剩余 CFP-011..015，其中 CFP-011 是 P1 blocker；CFP-012..015 是 P2 未决问题。故该候选包最终评审**不通过设计冻结，也不放行 Builder**。不允许对同一交付物开启第 4 轮；后续 S02 工作必须继续保留本 helper slice 的未冻结/未准入状态，并在更上层 Goal 台账中保留原始完整范围和当前证据上限。
