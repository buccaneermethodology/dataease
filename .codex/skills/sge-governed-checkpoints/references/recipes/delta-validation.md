# Delta Validation recipe

1. 读取上一轮 Validation State Snapshot；验证 baseline revision、tracked/untracked/renamed/generated inventory。
2. 只读取 changed files、受影响 gates、未关闭 blocker 与最终状态面。
   已通过完整最终候选包的 review 后，若仅按预声明槽位生成同一报告的 wrapper/state/receipt，执行绑定和只读读回；不因历史 `CONTINUE` 推进到当前 `GOAL_COMPLETE` 而重写 review 或自动追加一轮 review。受审对象变化仍按第 3 项及 [收尾规则](../baseline-and-closeout.md#单向收尾与时点) 处理。
3. user/Goal/governance/AC/authority/claim/truth/topology/threat/snapshot 或 inventory 变化立即 rebaseline。
4. 默认 initial validation → blocker-fix delta validation → final-state reconciliation；第四轮起记录 blocker admissibility 或 rebaseline reason。
5. 同一根因连续两轮新增 blocker 时升级 rebaseline、hardening Session 或人类 scope decision。
6. 只读窄 reconciliation 可单独 Validation lane；实现、KB truth、runtime/schema、acceptance 或 semantic widening 仍启用必要 lanes。

完整 snapshot/card/audit schema 扩读 `../context-efficient-goal-validation.md`。
