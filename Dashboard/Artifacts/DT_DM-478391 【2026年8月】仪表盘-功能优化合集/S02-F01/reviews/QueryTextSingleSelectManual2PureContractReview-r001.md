# Manual2 纯 helper 合同独立语义审查 r001

审查对象：`QueryTextSingleSelectManual2PureContract-r001.md`、`QueryTextSingleSelectManual2PureCases-r001.json`、静态校验候选及其源码依据。Card `S02-F01-QTS-MANUAL2-PURE-HELPER-CONTRACT-REVIEW-r001` 的 canonical SHA-256 `07235b8a44f0b75455a01f76e936088f02909186f2a9dd2cda186a298da30135` 复验通过；对应 Context Bootstrap 校验通过。按 Card 只读检查，未运行实现或用例。

## 双结论

| 结论面 | 独立结论 | 边界 |
|---|---|---|
| Design Freeze Validity | **VALID_WITH_BOUNDS：合同内部一致，可作为 manual2 精确值态纯 helper 子合同候选冻结。** API、校验域、拒绝结果和 detached 输出都可直接实现；未发现改变语义的源码矛盾或来源伪造。 | 这是审查建议，不是维护者冻结。发现两项 P2 用例覆盖建议（见下文）；若要宣称28项边界已穷尽，应先补例并生成新版本。当前文件仍标记 `candidate` / `frozen_for_builder=false`。 |
| Pure Helper Implementation Entry Readiness | **READY_WITH_BOUNDS：仅可为单参数纯 helper 建立后续实现准入。** 本合同足够指导实现 `prepareManual2ValueState(valueState: unknown)`，并按单一 `{status, carrier, runtime}` 形状实现成功/拒绝。 | 仍须由控制面完成人类冻结、绑定当前 Contract/Cases/Context/topology 的 Builder card 与 execution admission，并用同一冻结身份执行可信 RED/GREEN。此结论不准入产品调用或认证工厂。 |

## 审查范围与分母

独立检查了 28 个 Case 的身份、input、expected、assertions、状态及 `M2-E01..07` 映射；逐项对照 `QueryTextSingleSelectSourceOracleCases-r001.json` 中旧 M2-E 输入/预期；复核 manual2 配置、选项生成、初始化和查询消费的当前源码。源码核对重点为：

- `QueryConditionConfiguration.vue:3224–3233` 将 0/1/2 分别标成自动、选择数据集、手工输入。
- `QueryConditionConfiguration.vue:1725–1748` 手工列表以 trim 仅判断空白，过滤时不修剪保存值；`1559–1566` 对 source2 检查空列表，但不是严格 string[] schema。
- `Select.vue:134–138` 在 `optionValueSource !== 1` 时返回空 `defaultMapValue`；`249–286` 分别写运行期选择与配置期默认值；`976–1043` 的 source2 选项展示路径会读取 `valueSource` 和 `optionFilter`。
- `Select.vue:1047–1059` 初始化运行选择取默认值或清空；`useFilter.ts:115–155` 首次与后续查询分别消费默认值和运行值；`372–395` 对任何 truthy `optionFilter`（包括空数组）追加 `in` 条件。

保留原 Goal 分母 **10 AC / 26 must-have / 16 product obligations**，本 review 不关闭其中任何产品义务、不作 Scope Delta。审查覆盖只限一个 manual2 值态子切片；不能以28个 helper oracle 代表 Goal 覆盖率。`M2P-001..028` 全部为 `NOT_RUN`、`result=null`、`evidence=[]`、`frozen_for_builder=false`，所以本文不报告 RED/GREEN 或运行通过。

## 语义核对

**输入及来源。** 精确单参数投影与来源认证分离，避免把 `sourceStage`、binding ID 或测试夹具当可信凭证。必需/可选字段集合完整明确；stage/binding/fixture 或其它未知键只能作为 schema 错误统一拒绝。`M2P-007` 对只含合法 projection 的旧 live-unknown 情景返回 `OK`，且说明上层必须先阻止该调用；`M2P-008` 对误传 `sourceStageFixture` 的额外键拒绝。两例没有把 `OK` 说成来源认证，且覆盖 QTSO-001 的修正意图。

**唯一拒绝与次序。** 合同统一规定失败为且仅为 `{status:"REJECTED",carrier:null,runtime:null}`，不泄露首错码、部分值或诊断字段；7 个校验步骤从普通对象/descriptor 检查到完整验证后构造，顺序确定。`M2P-009` 同时携带多个非法因素并期望唯一 REJECTED，满足“多重失败整体拒绝”的最低 oracle。由于失败结果不暴露步骤或首错，单看这个 fixture 无法观察是哪条规则先命中；它支持“拒绝多重失败”，不能单独证明执行顺序。合同已明确不返回首错，因此这是证据上限而非矛盾。

**对象和数组边界。** 普通对象允许 `Object.prototype` 或 null prototype，拒绝 accessor、symbol、自定义原型、非枚举字段；访问 descriptor 不得调用 getter。恶意 Proxy 明确排除在输入域外，合同不声称可将任意 JS 对象作为安全沙箱。`M2P-025..028` 分别以测试 recipe 构造 getter、稀疏数组、symbol key、自定义 prototype；fixture recipe 不进入生产 API。普通稠密数组、原始字符串和重复约束也都写入合同。实现必须遵循该数据域并处理 array 的 own keys/descriptor，而不能仅以 `Array.isArray` 与元素遍历替代结构检查。

**字段语义。** `defaultMapValue` 必须显式空数组，是当前 source2 writer/初始化观察下的窄子合同；缺失、null、非空数组均统一拒绝，不把历史数据判为产品非法。`optionFilter` 任意存在都拒绝，含 `[]`：Select 选项过滤表达式把空数组视为“不筛选”，但 `useFilter` 中空数组仍 truthy 并生成 `value: []` 的 `in` 条件，故不能合并成缺失或在 carrier 中静默删除。`M2P-003/004` 与 source oracle 对应正确。

开启默认时要求非空字符串且精确出现在 valueSource；关闭时仍验证可选 `defaultValue` 类型，但不把它输出到 carrier。`M2P-018/019` 覆盖关闭默认值丢弃及带边缘空格的精确保存。旧 `selectValue/mapValue` 只验证类型后丢弃，运行态从默认 A 或 undefined 重建、map 为空新数组；它们不回填设计默认，也不共享 source/carrier 引用。输出结构严格区分 schemaVersion/shape/design 与 runtime；身份、revision、source、defaultMapValue、旧运行值均不进入 carrier。输出 detached/跨调用数组隔离仍是未来 runner 的行为断言，不是本轮已验证事实。

**undefined 与 JSON codec。** 约定标记只由测试 codec 在调用前解码，生产 helper 不收到 marker。`M2P-024` 覆盖 input 的 `selectValue: undefined`，而成功 runtime 的 undefined 键经 JSON 序列化省略；失败仍保持完整 null 输出。合同也规定显式 `defaultValue: undefined` 等价缺失并不进入 carrier，这一属性目前没有对应专例（Finding F-01）。

**身份映射。** 旧 `M2-E01..06` 分别映射至新 `M2P-001..006`；其旧 binding/stage 元数据被移出 helper API，成功输出 schema 也按新合同重定。旧 `M2-E07` 被明确分为 `M2P-007`（移除来源字段后，同一合法 projection 可返回 OK）和 `M2P-008`（若将 stage 字段误传入生产投影，额外键拒绝）。新 Case 中输入、expected 和 mapping 三处一致；不是旧身份行为相同的声称。

## Findings

| ID / 严重性 | Finding 与证据 | 影响与处置 |
|---|---|---|
| F-01 / P2 | 合同第5步允许 `defaultValue` own 属性存在且值为 `undefined`，按缺失处理；fixture codec 只声明对 `input.selectValue` 与 `expected.runtime.selectValue` 解码 undefined，28例没有 `defaultValue: undefined` 输入。 | 不构成合同歧义，但实现回归目前没有该输入域的直接 oracle。冻结前建议新增专例，验证 OK、carrier 不含 `defaultValue`、source 不变；或把合同收窄为仅“属性缺失”代表无值。 |
| F-02 / P2 | 数组规则比数组 fixture 覆盖更广：合同拒绝任意额外 own 属性、symbol、accessor，并要求 valueSource/mapValue 均为普通稠密数组；现有例仅有 valueSource hole，symbol/getter 都是根对象例，没有覆盖数组自定义键、数组 symbol/getter 或 mapValue hole。 | 实现准入依赖开发者遵循合同，但这些数组分支尚无逐例 oracle。建议冻结前补 1–2 个 recipe-driven case，至少覆盖 mapValue hole 与数组额外 descriptor/symbol（可合并），并显式断言 getter count 为0。 |

未发现其它阻断性 finding。上述 P2 是用例覆盖建议，不表示相应候选语义错误，也不授权把失败状态细分或改写历史/source0 用例。若审查方要求 Cases 作为完整边界回归集合，则需先修订 Case 版本再冻结；否则应把这两项缺口纳入后续 builder tests 的必测清单。

## 不准入范围与 claim ceiling

本文最多支持：“manual2 精确值态纯 helper 候选具有可实现、可审查的有限合同；若按合同实现并通过后续同身份测试，可证明该纯函数的投影/水合规则。”本文不证明来源来自已保存设计态，不证明产品中的完整组件字段保留、身份/数据集重绑、默认选项真实存在、不证明保存/重开/历史/撤销、查询命中、UI 或后端行为。

产品来源认证与接线仍 `NOT_READY`；S01 F01 Packet `NOT_AVAILABLE`；无已确认真实多用户权限隔离环境，因此只读禁止查看/复制/粘贴、撤权等验收 `BLOCKED / NOT_RUN`。保存、历史、完整 shape2、真实数据命中以及完整 S02 Goal 仍未验收；standalone admin 不可代替权限验证。10/26/16 分母和 `Scope Delta: none` 保持原样。
