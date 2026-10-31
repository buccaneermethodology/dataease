# QPROJ-001 lint rebaseline 独立 Validation r002

## 双结论

- **Package validation：`PASS_WITH_BOUNDS`。**验证对象为 QPROJ-001 六个普通查询引用窄投影 identity 候选包。runner 仅有两处格式变化，反向恢复后摘要精确匹配 RED/GREEN 时冻结的 r001 runner；六 identity 独立重跑通过，定向 runner lint 通过，RED/GREEN/fixture/生产实现证据绑定一致。该结论不扩展到完整查询适配器或产品集成。
- **Original Goal conformance：`NOT_CONFORMANT_AS_GOAL_COMPLETION`。**此处仅确认 lint rebaseline 与 QPROJ-001 有界合同一致，没有改变原 Goal 分母或声称产品 AC 通过。Goal 的 10 项 AC-S02 和 16 项产品义务仍保留；真实权限继续 `BLOCKED / NOT_RUN`。

本报告不证明 copy/UI 集成、完整 query schema、目标字段能力或权限、浏览器与持久化行为、完整 F01、Q066/Q067 或 S02 完成。

## 接收端与摘要核对

- Validation 卡 `qproj-validation-card-r002.json` 按期望 digest `c1df00290806ede94e0934bc2ff651c360340bf8310c8ff14c4438300b2e6e6e` 接收端 validate/render 通过。
- Goal digest 为 `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`；r001 Validation 报告、lint rebaseline card、execution admission、r002 Execution Evidence、fixture、生产模块、当前 runner 及 r001/r002 GREEN/lint stdout 的摘要均与卡片绑定相符。
- fixture 当前 SHA-256：`d5ecf7a70c11108f80052605da4b016d9fb52296c800c7605d2e40208bed641d`；生产实现当前 SHA-256：`9c0d15e3ad7a383c65c2e4af6a23c2377c064d4f7b30906990536b3dd94b0285`，均与 rebaseline 前证据保持一致。
- 当前 runner SHA-256：`f2835aeb11d7d86f1cf585ff82e4a15f8541a93f030777a1e50c9e090f3a872b`。只在内存中反向恢复 `inputFor` 的一处调用换行和 `assert.equal` 的一处换行后，摘要为原 runner `e8ea0ca021b76140ac46119b2d28494e789aa5eaf928586020c251a516d2172c`。精确恢复旧摘要证明其余字节一致，未改 identity、输入、oracle、断言或执行逻辑；没有写回该文件。

## RED 连续性与 r002 耐久证据

r001 RED 记录仍显示实现前源文件缺失（`exists=false`，缺失标记摘要 `769b8995b8bf4407c89e906d67601a46266d34922a63ab1754440eecb0657aab`），runner 摘要为 `e8ea…`，fixture 摘要为 `d5ec…`。RED 的分离 stdout/stderr 和退出码文件仍存在；退出码 1 的六项失败均为预期的 `projection implementation unavailable`，随后测试 harness 汇总 `0/6 passed; 6 failed`。本次未重跑、覆盖或改写原 RED 证据。Builder r002 只在 runner 格式 rebaseline 后复用原 RED，并对同一六个 identity 重新 GREEN。

r002 Execution Evidence 指向的 GREEN stdout 摘要为 `7804634a134389b31110d30e52c92c0aa6b25ac1bfa70f7c78af3e826cea103a`，内容含 TC-QPROJ-001 至 -006 全部 PASS、fixture 与生产源摘要正确、runner 摘要 `f283…`，`6/6 passed; 0 failed`。保存的 GREEN stderr 有 Node `MODULE_TYPELESS_PACKAGE_JSON` 性能提示；退出码文件为 0。lint stdout 摘要为 `e3b0…`（空文件），对应 stderr 为空、退出码为 0。上述内容与执行记录和卡片绑定一致。

## 独立执行

独立执行 `node --experimental-strip-types core/core-frontend/tests/filter-copy-query-reference/query-schema-projection.test.ts`：退出码 0，TC-QPROJ-001–006 全部 PASS，`6/6 passed; 0 failed`。实时输出中的生产源、fixture 与 runner 摘要分别为 `9c0d…`、`d5ec…`、`f283…`，与 durable evidence 一致。仅有不影响结果的 Node module-type 性能提示。

独立执行 `./node_modules/.bin/eslint tests/filter-copy-query-reference/query-schema-projection.test.ts`：退出码 0、无诊断。与 rebaseline 前两条 `prettier/prettier` 换行诊断相比，当前 runner lint 已通过。

## Goal 与权限边界

`Goal.final.json` 仍包含 AC-S02-01 至 AC-S02-10 共 10 项，以及 F01 Q004–Q015、ORIG-01/02 与 Q066/Q067 共 16 项产品义务。未发现 rebaseline 修改或缩减任何原始分母；此切片不把 AC-S02-02/03/07 或其他 Goal AC 改判通过。

真实多用户权限模块/隔离环境仍不可用，故只读用户配置保密、查看/复制/粘贴拒绝、授权撤销与恢复等验收继续 `BLOCKED / NOT_RUN`。没有使用 standalone、admin 或 mock 代替权限验证。本候选未接入 UI、Store、`copy.ts` 或权限调用；模块与 runner 的职责仍是有限纯投影。

**可接受声明：**QPROJ-001 六 identity 候选通过当前独立 GREEN 与 runner lint；r001 可信 RED 耐久记录与本次 r002 runner/fixture/生产实现绑定连续。package 通过范围仅限此有界候选，不代表产品可用、真实权限通过或 S02 Goal 完成。
