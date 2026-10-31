# QSINGLE-REBUILD-001 独立 Validation r002

## 双结论

- **候选 package verdict：`PASS_WITH_BOUNDS_FOR_QSINGLE_REBUILD_001`。** 十个冻结 identity 与五项防御检查共15项断言通过，定向 ESLint 通过；RED/GREEN 使用相同 runner 和 fixture 摘要，RED 在可执行断言层失败。候选与冻结的单选离线窄域相符，未发现需要 Builder 修复的阻断缺陷。
- **Original Goal conformance：`NOT_CONFORMANT_AS_GOAL_COMPLETION`；Goal 仍开放。** 本切片不关闭任何原始 Goal AC 或产品义务，也不构成 F01/S02 完成证据。

本结论只覆盖普通 VARCHAR 单选配置的离线重建候选，不证明产品入口、UI/Store、保存/撤销、预览、真实配置来源、权限、完整 F01 或 Goal 完成。真实权限验收保持 **`BLOCKED / NOT_RUN`**；没有以 standalone、admin 或 mock 替代。树、参数、默认/首项、非 VARCHAR、历史缺省和混合单多选等仍是后续适配义务。

## Authority、卡片与冻结合同

复核了原始 Goal 阅读版、`Goal.final.json`、`F01SliceContract.md`、单选设计/fixtures/独立设计 review、Builder Card/Context/admission、baseline topology r058、dispatch topology r061 和 Builder 执行证据。QSINGLE r002 Validation Card digest `4e756460d4a5f8edc148707547da43fce46905c8128a4cd5949e00cbf7681f93` 经 `lane_task_card.py validate` 复算为 pass；Context Bootstrap validate 通过。r002 的 maximum claim 指向 QSINGLE 十个冻结 identity，forbidden claims 指向 `QuerySingleSelectRebuildDesign-r001.md`，唯一写范围为本报告。此前 r001 卡曾有 QPAD 引用残留；r001 未用于本结论，r002 已修正并重新绑定。

当前 Goal SHA-256 为 `f562da2e…c71daef0`，与验证卡一致；单选设计 `6142d260…d30c7a6`、fixtures `5260dce7…f3651490`、设计 review `95e25568…299ad9b` 均与冻结摘要一致。冻结支持域是所有条件 `multiple=false` 的普通 VARCHAR/deType=0 单选配置；无默认值、无必填、无参数/活动日期/树；函数独立，不调用或包装多选重建器。fixtures 固定 `TC-QSINGLE-REBUILD-001` 至 `TC-QSINGLE-REBUILD-010`，其中两个完整成功用例分别覆盖有选择值和缺省选择值；其余覆盖单选数组越域、默认启用、未知字段、计划错配、目标缺字段、null 默认值、首项默认及错误优先级。

## 实现与完整候选差异

当前生产候选 SHA-256 `6927e864…dc1f8e3f`、runner `ce7bd180…f0b127f71`，fixtures `5260dce7…f3651490`，均与 Builder 证据和验证日志一致。准入的产品写入仅为单选重建模块与对应测试；本轮没有发现它们接入 UI、Store、网络或其他产品入口的引用。工作树还含其他 S02 切片和 Dashboard 产物；这些不属于 QSINGLE Builder 范围，本报告不替并行切片作验证结论。

逐项检查了实现的全局阶段顺序：`INVALID_INPUT`（JSON/基本输入与身份）→ `UNSUPPORTED_FIELD`（未知或缺失持久化字段）→ `UNSUPPORTED_SHAPE`（已知字段但超出单选域）→ `PLAN_MISMATCH`（引用计划结构/身份）→ `TARGET_UNRESOLVED`（目标目录/字段）。计划校验检查数组长度与顺序、数据集/字段身份、引用闭包、唯一且不复用源 ID；目标目录按组件 ID、数据集 ID 和字段 ID 精确核对。失败只返回 reason，不给出部分 value；各冻结用例断言输入不变。成功输出完整匹配 JSON oracle，重新构造嵌套对象且无输入对象引用共享。

单选缺键语义按合同区分：条件 `defaultValue` 必须不存在，出现 `null` 也属于 `UNSUPPORTED_SHAPE`；`selectValue` 可以缺省或为字符串（包括空字符串），数组/null/数字不进入支持域；成功结果删除 `selectValue` 和 `defaultValue` 自有键，级联节点仍保留约定的空数组。防御断言分别验证空字符串只留在输入、缺键输出、深冻结输入、输出脱离输入、非 JSON 输入拒绝，以及 JSON 序列化往返。

## RED、GREEN 与独立复跑

Builder RED/GREEN 的 runner SHA-256 均为 `ce7bd180…f0b127f71`，fixture SHA-256 均为 `5260dce7…f3651490`。RED source 记录为缺失哨兵，runner 使用可执行 `UNIMPLEMENTED` fallback；八项冻结成功/失败 oracle 与五项防御检查共15项均在断言层失败，摘要 `0/15 passed; 15 failed`、exit 1。stderr 显示 case 断言及最终汇总断言失败，不是模块解析失败。GREEN source 摘要 `6927e864…dc1f8e3f`，相同 runner 下 `15/15 passed; 0 failed`、exit 0。RED/GREEN stdout、stderr、exit code 分开持久保存。

独立在 `core/core-frontend` 执行 `node tests/filter-copy-query-reference/query-single-select-rebuild.test.ts`，得到十个冻结 identity 和五项防御检查全部通过，`15/15 passed; 0 failed`、exit 0；输出的 source、fixture、runner 摘要与持久 GREEN 一致。随后执行 `./node_modules/.bin/eslint src/custom-component/filter-copy/query-single-select-rebuild.ts tests/filter-copy-query-reference/query-single-select-rebuild.test.ts`，exit 0。Node 的 module type 性能提示不影响断言结果。

## Goal conformance 与未验收事项

Goal ledger 共26项且状态均为 pending：`AC-S02-01` 至 `AC-S02-10` 共10项；`AC-F01-Q004` 至 `AC-F01-Q015`、`AC-F01-ORIG-01/02`、`AC-F04-Q066/067` 共16项。原分母保持完整。单选候选只提供设计与离线结构证据，不证明产品复制/粘贴行为、即时预览、正常保存与重开、权限拒绝、撤权与恢复、异常/兼容回归、独立 Goal 最终验收或 S10 移交。

本报告是 QSINGLE r002 Validation 卡的唯一写出。未修改源码、测试、fixtures、Builder 证据、Goal、旧报告或其他 Dashboard 状态。真实隔离权限环境和受限测试账号仍未具备，权限验收必须继续标为 `BLOCKED / NOT_RUN`。
