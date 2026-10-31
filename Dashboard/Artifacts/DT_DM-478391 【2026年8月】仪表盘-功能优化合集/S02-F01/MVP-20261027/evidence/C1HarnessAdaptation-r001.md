# C1 harness 适配与原 A 证据边界 r001

记录时间：2026-10-27 05:29 UTC。Builder 补卡 canonical SHA `5538e64d7a0603d2e32bf9f52736891f11832d9984d158ccfa2392972bf099da`，Topology r436；7 个 required-read SHA 写前无漂移，三份逐 target admission 实际复验 exit 0。

仅改当前 `tests/filter-copy-mvp/check.mjs`：为 C1 新增依赖加入精确 useI18n/ElMessageBox provider doubles；实际生产 A service/composable 仍被装载，不复制控制流。两个 custom-renderer 空 hook 改为实际 host 的 removed 标记/props 更新，消除 no-empty-function。没有改冻结 A before 快照、原独立 Validation、Goal/Cases 或 API B。

另仅将 B README 的 `if(outcome.ok)` 改成 `if(outcome.ok === true)`，对应项目 strictNullChecks=false 下的 discriminant 写法；API B 源码/原 runner 未动。

实际 `node tests/filter-copy-mvp/check.mjs` exit0、14/14；两 runner 定向 ESLint exit0，定向 diff --check exit0。B API runner补跑9/9 exit0。本环境不注册真实 wrapper receiver，所以旧 A 的 preparation_unavailable 断言仍合理；不代表当前 C1 在真实编辑页仍未启用。C1 当前 paste 启用/成功/失败/取消由新的实际 composable→event→wrapper runner 与真实浏览器分别验证；不将旧 A 14组写成新增粘贴通过。原 A 独立报告保持其 as-of事实不变。

当前适配文件摘要：

- `core/core-frontend/tests/filter-copy-mvp/check.mjs`：`9409e6388d9989b2476f0b0f679cad5d60247741e82af2d5932d542b899a6989`
- `core/core-frontend/tests/filter-copy-mvp-api/README.md`：`b0ad982d58edd01d0bb8d0f91a45a641f15e93d0de288400e39fa634f11b19b5`
