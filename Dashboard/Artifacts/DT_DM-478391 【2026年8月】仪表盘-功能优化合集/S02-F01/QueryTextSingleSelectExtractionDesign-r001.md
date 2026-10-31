# 普通文本单选设计态提取与运行态水合子设计 r001

## 目标与边界

本子设计响应 `QueryProductAdapterDesignReview-r004` 对 R4-01/R4-02 的最短推进建议，只处理普通文本单选 `displayType="0"`、`multiple=false`、手工选项 `optionValueSource=0`、无参数、非级联、非树、非日期、非远程选项的设计态配置。它回答“明确设计默认 A、原运行值 B”如何保留 A 并丢弃 B，不定义全形态适配器、历史 JSON 迁移或产品接线。

来源必须由调用者证明为已保存的设计配置快照（`sourceStage=design-config` 且 revision 与资源身份匹配）。无法区分设计态与 dashboard 运行态的普通 JSON 一律 `SOURCE_STAGE_UNVERIFIED`，不能从字段名称或 `displayType` 猜测。函数只构造 detached 结果，不改 source、Store、画布、查询、快照或保存状态。

本文件与 Fixtures 是待独立审查的候选设计。设计审查通过仍不等于 Builder 准入；任何代码目标必须另有可信 RED、验证过的 Context/card 与精确 target-bound admission。10 项 Goal AC、26 项 must-have、16 项产品义务保持原分母；真实权限行为继续 `BLOCKED / NOT_RUN`。

## 源码依据

- `core/core-frontend/src/custom-component/v-query/options.ts:6-65, 80-136`：基础配置具有 `defaultValue`、`selectValue`、`defaultMapValue`、`mapValue`、`defaultValueCheck`、`multiple`、`displayType` 等不同字段；新增配置时默认 `defaultValueCheck=false`、`multiple=false`、`displayType="0"`。
- `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1048-1060`：配置交互把用户选项写入 `defaultValue`，并同步 `selectValue` 与 map 字段；这说明仅看当前对象字段名不足以证明保存阶段。
- `core/core-frontend/src/custom-component/v-query/QueryConditionConfiguration.vue:1448-1457`：未启用默认值时，普通单选的 `selectValue` 与 `defaultValue` 被清为 `undefined`。
- `core/core-frontend/src/custom-component/v-query/Select.vue:174-182, 262-287, 476-517`：普通选择与默认选择会维护不同值；枚举回包会写本地/运行状态，不能把它作为设计真源。
- `core/core-frontend/src/hooks/web/useFilter.ts:140-152, 398-458`：手工选项的首次加载以 `defaultValueCheck/defaultValue` 生成过滤值，非首次加载读取 `selectValue`；字段选项还有独立映射路径，故本切片排除 `optionValueSource=1`。
- `QueryProductAdapterDesign-r004.md` 的 R4-01/R4-02 和 `QueryProductAdapterDesignReview-r004.md`：统一抽取与运行态边界尚未获产品准入；应先形成一个确切 shape 子合同。

## 子合同

1. 输入为带已验证来源阶段、revision、componentId 的设计快照；只接受上述固定 shape。source 不可变且输出是全新嵌套对象。
2. 本 carrier 是完整产品 carrier 中的 **value-state 子载体**，只定义 shape/source binding 与默认字段；它不能单独重建完整 query component。完整 adapter 仍须按独立字段矩阵保留其它静态配置、身份和引用。
3. 子载体保留默认意图：特别是 `defaultValueCheck` 与其对应的 `defaultValue`。`defaultValueCheck=true` 时要求 default 为非空字符串；false 时 carrier 不保留 defaultValue。
4. 运行态字段 `selectValue`、`mapValue`、枚举 options、loading、观察状态和查询结果不进入子载体。完整 adapter 不得静默丢弃其它字段；未知字段或超出本子合同字段形态时返回 `UNSUPPORTED_FIELD` 并保持无输出。
5. 水合只接受本合同生成的子载体，重新校验 schema/version/shape。启用默认值时将默认字符串深拷贝到调用方提供的新运行对象的 `selectValue`；未启用时在内存对象中设为 `undefined`，JSON 序列化时允许省略该属性。Hydration 不触发查询或写入。
6. 首次过滤仍由现有 `useFilter(..., firstLoad=true)` 依据设计默认字段生成；非首次过滤使用水合对象的 `selectValue`。不得将旧 source 的 B 合并回新对象。
7. 明确空字符串、null、错误类型或缺失的来源证明都失败关闭；不返回部分 carrier/runtime。字段选项、显式默认映射、首项默认和历史缺省暂不由本子合同处理。

## 字段处置

| 字段族 | 处置 | 规则 |
|---|---|---|
| `id`, `name`, `field`, `displayId`, `dataset`, `displayType`, `multiple`, `optionValueSource`, `required`, `visible`, 条件与静态展示配置 | KEEP | 精确shape验证后保留，后续完整 adapter 再负责身份重绑与目录校验 |
| `defaultValueCheck`, `defaultValue` | KEEP / VALIDATE | 作为设计意图；启用时必须是非空字符串，关闭时从 carrier 省略 defaultValue |
| `defaultValueFirstItem` | KEEP=false | 仅允许 false；true 属于异步枚举首项默认，交给 R4-03/R4-01 后续合同 |
| `selectValue`, `mapValue`, enum/options/loading/观察状态 | RESET / EXCLUDE | 这些字段不得成为设计 carrier 输入或输出；水合仅按设计默认产生新 selectValue |
| `defaultMapValue`, 参数、树、日期、级联或远程选项字段 | REJECT | shape 越界，不能套用普通手工单选策略 |
| 未知或额外字段 | REJECT | 返回 `UNSUPPORTED_FIELD`，不推断为运行值、不静默丢弃 |

## 失败顺序与副作用

顺序固定：`INVALID_INPUT`（对象/JSON/revision/component identity非法）→ `SOURCE_STAGE_UNVERIFIED` → `UNSUPPORTED_FIELD` → `UNSUPPORTED_SHAPE` → `DEFAULT_VALUE_INVALID` → 构造 detached carrier/runtime。每类失败必须没有 `carrier` 或 `runtime` 部分结果；source 深度相等，查询/Store/快照写入均为0。

## 验收及后续门槛

Fixtures r001 给出完整输入和精确输出，包括 A/B 分离、无默认清除 B、缺失来源证明、空默认值、JSON round-trip 与失败无部分输出。当前只有源码映射与合同自检，没有运行产品实现。设计审查需要特别核对：来源阶段是否足以认证；实际配置保存形态是否符合静态默认/运行态分离；字段白名单是否完整；USE-filter 首次与后续查询是否和合同一致。

如果审查给出窄设计通过，才按 reviewer 建议写实现合同、测试用例、RED 和专属代码 Builder card/context/admission，然后实现独立纯函数并由独立 Validator 覆盖同一冻结用例。真实 Vue、服务端保存、权限和其他查询形态仍须独立验证。
