# 原UI05/06共享guard见证

当前入口：`node tests/filter-copy-mvp-guard-witness/check-r002.mjs`（在core/core-frontend运行）。

原check.mjs保留首轮历史；它的两query类别案例混入了切type后的目录未ready，不能当当前类别guard验收。r002先resolve新目录并确认fieldsReady、其它guard兼容和receiver存在，再验证拒绝。原Cases20/nativeGolden/product源码不改。

`S02_GUARD_CAPABILITY_FAULT=omit`仅在esbuild内存中省略唯一能力gate，验证新见证能检出两类别缺陷；期望18pass/2指定语义失败/0执行错误。它不是产品RED或生产源码修复，普通执行不设该变量。

真实日期UI/query/save/恢复原件与20个pure/component输入分层，不将provider/receiver计数冒充真实HTTP或真实Query UI。原首轮结果、假阴性风险与后修正均保留。
