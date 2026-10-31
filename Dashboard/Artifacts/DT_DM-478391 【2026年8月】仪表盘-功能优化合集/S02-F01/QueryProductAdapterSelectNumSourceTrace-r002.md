# SH-SELECT-NUM 来源阶段追踪 r002

## 交付物身份与结论边界

- Artifact ID：`S02-F01-query-product-adapter-select-num-source-trace`，第 2/3 轮。
- 基于 r001 独立 Review `QueryProductAdapterSelectNumSourceTraceReview-r001.md` 的五项 findings 补充当前静态来源图；不重写、不追认 r001。
- 本文是 type 2/5 数值选择器来源索引，不是合法 shape 分母、产品数值 oracle、冻结 Cases、Builder 准入、运行/保存验证或权限验收。
- 原 Goal 10 项 AC、26 项 must-have、16 项产品义务与 `Scope Delta: none` 保持；16 项义务仍 `NOT_RUN`。S01 F01 仍 `CONDITIONAL`，真实多用户权限 `BLOCKED / NOT_RUN`。

## 五项来源补充

以下均为当前工作树静态路径事实。文件摘要分别为：`QueryConditionConfiguration.vue` `0b88bcdf92d15aceae52ca2992e7a8b4165e3f5cfc3f9cb7435296d7c7e9e047`、`Select.vue` `30efd4a571a8146a68c8a57e64dfee93208670db4155b8f9257a4553efcfcac8`、`Component.vue` `152703881a926e747e4e42f7c593a1558708efa73a3138cdb823cc519b01d081`。实际以评审时重算的摘要为准。

| Finding | 精确来源路径 | 应保留的静态结论及边界 |
|---|---|---|
| SNTR-R1-001：validator 短路与 0 值差异 | `QueryConditionConfiguration.vue:1261-1264,1468-1483,1559-1578,3492-3501` | `validate()` 使用 `some`；type 2 在来源 1 缺 `field.id` 时拒绝，`defaultValueCheck=false` 时于 1475 提前返回，因此该条件不会继续执行 1559 手工来源 truthy 检查或 1568 通用来源字段检查。type 2 手工输入使用 `v-model.number`，其 default 专项检查接受数值 `0`；type 5 没有同一专项分支、手工输入未用 `.number`，字符串 `'0'` 与数值 `0` 不可混为一谈。此为控制流/转换差异，不裁定产品意图或缺陷。 |
| SNTR-R1-002：配置 required 与运行 required | 配置：`QueryConditionConfiguration.vue:1412-1445`；运行：`Component.vue:815-847` | 配置准入对 required 先要求 `defaultValueCheck`，再检查配置默认值；运行查询另检查 `selectValue`，显式豁免数值 `0`。两个阶段有不同 owner 与状态字段；任一阶段的静态检查不能证明另一阶段或真实查询行为。 |
| SNTR-R1-003：展示值到级联值映射 | `Select.vue:134-152,250-288,440-446,494-519,541-562` | `setDefaultMapValue()` 按 `displayId || field.id` 定位枚举行，再提取 `field.id` 的行值并聚合；运行态与配置态各自写入 `mapValue/defaultMapValue` 或级联回写。此处显示键和映射键是不同角色。API 原始类型、空值/精度、持久化与下游 consumer 仍未验证。 |
| SNTR-R1-004：配置态/运行态 `selectValue` owner | `Select.vue:264-289,291-296` | 运行态写 `config.value.selectValue`；配置态更新本地 `selectValue` 与 `config.value.defaultValue/mapValue/defaultMapValue`，没有在此路径写 `config.value.selectValue`。displayType 切换重置 defaultValue 与本地 selectValue，不等于已清理持久配置字段。 |
| SNTR-R1-005：手工选项单选/多选比较 | `Select.vue:1016-1041`，配置输入：`QueryConditionConfiguration.vue:3488-3501` | 手工选项生成时将 `label/value` 转成字符串；多选 checked 用字符串化值比较，单选 checked 与原始 `ele` 比较。仅 type 2 配置输入使用 `.number`。尚未确认各模式下 `checked` 的消费路径，不据此宣称运行 bug。 |

## 下一阶段仍需取证

本修订只补齐上述来源 owner 与条件分支。合法组合（type 2/5 × single/multiple × option source × default/check × 字段/值 metadata）、完整 query consumer/API payload、Store 保存加载、复制/模板/撤销重做与历史缺省仍未闭合；数值 0、负数、小数、精度/大数、字符串数字、空字符串与 null 的端到端序列化也没有 oracle。产品策略若无来源仍须保持 `UNKNOWN`，不能由本来源图推断。

下一步可继续读取 consumer 与持久化源码以扩展静态来源图；合同、Cases、运行 harness 或产品接线须分别绑定自己的 authority、合法分母与准入。真实只读权限拒绝、权限撤销/恢复仍须真实权限模块和隔离多用户环境，不能使用 standalone/admin/mock 替代。本文不授权这些行为。
