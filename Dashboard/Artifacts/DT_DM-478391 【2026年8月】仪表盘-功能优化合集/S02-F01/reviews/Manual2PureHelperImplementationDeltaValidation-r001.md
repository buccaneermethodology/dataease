# Manual2 纯 Helper Builder 证据增量验证 r001

**局部 Delta verdict：pass-with-findings（证据附件缺失项已修复，仍有证据限制）**。Builder Card 要求的附件现已存在，内容、摘要、Topology 引用与正确的 Builder admission 一致；前次“必需附件缺失” finding 可关闭。RED 原始 stdout/退出码文件仍未保存，附件如实披露了这一边界，因此不能把结构化 RED 记录说成原始日志。本 verdict 只处置该附件 finding，不改变前次整体 Implementation Validation 的 partial，也不表示纯 helper 整体、产品、权限或 S02 Goal 通过。

## 1. 验证身份与完整性

- Card：`planning/manual2-pure-helper-evidence-delta-validation-card-r001.json`；按指定 canonical SHA `08863e722d2e43087247be7350b53b61f17a8d6efce42e7d064c7bf32e3ce77b` 验证通过，渲染出的 prompt 与 Card execution command 一致。
- Context Bootstrap：`context_bootstrap.py validate` 通过。Card、Context 及其 `required_read_set` 中全部 12 个文件的实际 SHA-256 均与记录摘要一致，没有 revision drift。
- 写入边界：仅本报告，符合 Card `write_scope`。

## 2. Finding 处置与新增证据

前次报告 r001 的 Finding 1 是 Builder Card 必需输出缺失。当前附件已落盘：

`planning/evidence/Manual2PureHelperBuilderEvidence-r001.md`

其 SHA-256 为 `3471261b3f3af5cb56e2d0dcacb964bd5a3807e457697befeac6253201e73c86`，与 Delta Context 的预期摘要、Topology r259 的输入摘要一致。正文列出 helper/runner 摘要、RED 与 GREEN 的命令和结果、定向 ESLint、严格 TypeScript 结果，并明确说明完整 RED 终端 stdout 未单独保存；该附件是事后编写的结构化 Builder 证据摘要，不是对缺失原始日志的补造。

对应 admission `execution-admission-manual2-pure-helper-evidence-r001.json` 通过确定性校验，`action=builder`，`target` 精确指向上述 evidence 附件。该校验没有用 Validation action 替代 Builder action。

Topology r257 绑定原实现候选和 33 项 GREEN、lint、TS 结果；Topology r259 记录本次补齐 Builder 证据，引用同一附件摘要及前次 r001 Validation 摘要，声明不改源码、runner、冻结合同或前次报告。两份拓扑中相关摘要均与当前文件一致。前次报告 r001 的 SHA-256 为 `9d9d2ce1916f270cc12d911c65dc76424e40b7d675b2512e3595e46b1c7b8aa9`，与 Context 一致。

**Finding 1：已关闭。** 必需附件缺失的事实已改变，要求的输出已按正确 Builder admission 落盘且摘要匹配。

## 3. RED 边界与残余 Finding

前次报告的 RED 限制仍成立。Topology r256 记录 source 缺失指纹 `769b8995b8bf4407c89e906d67601a46266d34922a63ab1754440eecb0657aab`、31 项 `UNIMPLEMENTED` 失败、`contract_valid`/执行状态以及进程失败结果；该指纹与 `sha256("<missing>")` 相符。证据附件也明确写出当时完整 stdout 未单独保存。Delta Validation 未重新运行历史 source-missing RED，也未取得原始 stdout/退出码文件，不能提升历史结构化记录为 raw log。

因此前次报告的 Finding 2（原始 RED 执行附件缺失）**没有被关闭**。它是可追溯性限制，不影响“必需 BuilderEvidence 附件已补齐”这一局部事实；完整 helper Validation 是否接受没有原始 RED 输出，不由本 lane 擅自裁定。

## 4. 当前关联验证摘要

本轮只读复跑的命令结果与附件中声明一致：

- `node tests/filter-copy-query-reference/query-single-select-manual2-pure.test.ts`：退出码 0，28 个冻结 case、3 个 P2 及隔离检查共 33/33 通过，`contract_valid=true`、`execution_ok=true`、`behavior_failures=0`。Node `MODULE_TYPELESS_PACKAGE_JSON` warning 仍存在。
- 定向 ESLint：helper 和 runner 两个文件，退出码 0。
- 严格精确 TypeScript 检查（`--noEmit --strict --target ES2022 --lib ES2022,DOM --module ESNext --moduleResolution node --skipLibCheck --types node --allowSyntheticDefaultImports`）：退出码 0。
- 当前 helper SHA-256 `8b2b892de636e59e0ca0ba3c7e7e752cb9edb1027244d28bfb4597fa25bcef23`，runner SHA-256 `ed61301c2a932437a4cf426f639323d96b5f11c05c5dcdb4334b2c8083b1a151`；均与附件、r257 及 Context 摘要相符。

这些复跑只确认本次读到的局部 runner 与文件摘要，不改变当前验证任务的授权边界，也不构成产品接线或产品行为验证。

## 5. 范围和结论

原 Goal 分母仍为 10 Goal AC / 26 must-have / 16 产品义务，`Scope Delta: none`。产品 source/auth 接线未就绪，真实多用户权限仍 BLOCKED/NOT_RUN；保存/历史与完整 S02 Goal 未验收。

**局部 Delta verdict：pass-with-findings。** 可关闭前次“Builder 必需附件缺失” finding；原始 RED stdout/退出码附件仍缺，保留为未闭合限制。前次整体 Implementation Validation 仍为 partial，除非另行执行授权的最终 reconciliation；此报告不能作为整体 helper、产品、权限或 Goal 的通过证据。
