# QPIPE-001 Builder 执行证据 r001

状态：Builder candidate；独立 Validation 未完成。范围仅为六项冻结纯组合用例。Goal仍进行中，10项AC、14项F01义务及Q066/Q067分母不变。

## 准入与实现

- 设计独立复核：`reviews/QueryReferencePipelineDesignReview-r001.md`，`PASS_WITH_BOUNDS`。
- Builder Context、lane card 与 target-bound admission 已用SP-010脚本验证；admission精确绑定`query-reference-pipeline.ts`、Goal、fixtures、Context、设计复核及Topology r029。
- 可信RED在实现文件缺失时运行六个冻结identity，均以`implementation unavailable`失败，退出码1。随后相同runner、fixture和identity实现后GREEN 6/6。
- 新增纯组合模块按QPROJ→QMAP→QPREP固定顺序调用真实模块，按阶段短路并透传原reason；调用spy包装真实函数后记录实际调用，未stub替代行为。
- 不修改QPROJ、QMAP、QPREP、copy入口、UI、Store、权限、持久化或网络。

## 验证

- RED：`node --experimental-strip-types tests/filter-copy-query-reference/query-reference-pipeline.test.ts`，六项按预期失败，exit 1。
- GREEN：同命令，6/6通过，exit 0。覆盖完整成功plan、QPROJ短路、QMAP零/多候选、QPREP缺闭包与环错误；同时断言调用序列、深冻结输入不变及失败不泄漏部分值。
- ESLint：`./node_modules/.bin/eslint src/custom-component/filter-copy/query-reference-pipeline.ts tests/filter-copy-query-reference/query-reference-pipeline.test.ts`，exit 0。
- 本报告所引用的逐项stdout、stderr、exit code及RED摘要快照位于本目录。无Vue应用、数据库、权限或产品端到端验证。

## 摘要

- `QPIPE-001-red.stdout.txt` SHA-256 `dc2fb3b5d218a62013da3c75e9c34c9ce3222671860c920fca1ce1ff7a4b6636`
- `QPIPE-001-red.stderr.txt` SHA-256 `e44224127b5b47139471a98213599ee28a81b25ca8c2e3d18a0b09bef2f50d8f`
- `QPIPE-001-red.exitcode.txt` SHA-256 `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865`
- `QPIPE-001-red.snapshot.json` SHA-256 `1e64b23f0355506e4856fbc3330e92c87b71b943b6866184ba879cd57faf075d`
- `QPIPE-001-green.stdout.txt` SHA-256 `9dbf580123d5d1c5435f8187fceaae24b39d5c78bc3c6522ba077ab5f35b71f9`
- `QPIPE-001-green.stderr.txt` SHA-256 `749d1f79c048809b4d16e84512f9fc8a6c1c2d3ff16dc5a863bbdef96e4572be`
- `QPIPE-001-green.exitcode.txt` SHA-256 `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa`
- `QPIPE-001-lint.stdout.txt` SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `QPIPE-001-lint.stderr.txt` SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `QPIPE-001-lint.exitcode.txt` SHA-256 `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa`
- `core/core-frontend/src/custom-component/filter-copy/query-reference-pipeline.ts` SHA-256 `7066211a16f981cbd05df0c5e41d97f2d01b445b397c948f9ce2344ae34b9d10`
- `core/core-frontend/tests/filter-copy-query-reference/query-reference-pipeline.test.ts` SHA-256 `9d8042ad4cfdcf375ed392ff3b60e625312890062ba38f486f52b648c9fdfa02`

QPREP的历史RED/角色/时点证据缺口继续保留，QPIPE组合GREEN不追认QPREP package验收。真实权限仍为`BLOCKED / NOT_RUN`。QPIPE纯模块通过不代表产品schema、真实目标目录可信或获授权、UI/复制粘贴、保存重开或Goal验收。
