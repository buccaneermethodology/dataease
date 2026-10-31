# S02 MVP-first 全验收分母补充授权

## 当前决定

本补充记录对应当前对话中的用户直接指示：“授权Goal目标调整为‘先完成界面 MVP，再补齐复杂场景’，完整验收要求没有删减”。它是当前任务的最新人类 authority；其含义是调整实施顺序，而不是减少 DE-S02-F01 完成分母。

当前 Goal 采用两个非终态阶段：

- **P1：界面 MVP**，12 项新增界面义务（AC-MVP-F01-01..12）。
- **P2：复杂场景完整验收**，26 项原始义务：10 项 Goal AC（AC-S02-01..10）与 16 项产品义务（AC-F01-Q004..Q015、AC-F01-ORIG-01/02、AC-F04-Q066/067）。

38 项均为当前 Goal 必须完成的验收项。P1 满足退出条件后只形成界面 MVP 里程碑并进入 P2；只有 P2 也全部完成、独立验证和最终 Stop Gate 通过，才能声明 S02 Goal 完成。真实权限、只读限制和撤权/恢复必须由真实鉴权实现及隔离多用户环境验证。

## 与既有范围迁移记录的关系

既有 `MvpScopeAuthority-20261027.json`、`GoalScopePatch-r005.json` 和 `ScopeDelta.json` 保持原字节，继续作为历史上曾获准按 MVP 边界迁移的证据，不予删除、改写或追认通过。当前用户的新指示覆盖其中“迁出项不作当前Goal完成前置”的旧完成边界；被迁移的16项恢复为本Goal的 P2 pending 分母。对应六个后续 Session 保留追踪复杂工作，但不再豁免本Goal的最终验收要求。

本文件只记录当前人类指示的语义和处置。当前工具输出未暴露该消息的平台 turn/message ID 或可核验 approval receipt，因此不伪造此类指针；如治理系统要求平台级 receipt，须由宿主以后绑定。此限制不改变本对话中用户直接给出的工作授权。

## Goal 绑定

- Goal：`Goal.final.json`（由Goal通过 `sections.source_baseline.current_authority` 绑定本文件路径与SHA-256，避免循环摘要）
- Ledger：38 项；P1 阶段义务 12 项，P2 阶段义务 26 项（原始 10 项 Goal AC + 16 项原始产品义务）
- Completion claim：`S02_COMPLETE`
- 历史权限环境阻塞：仍为 `BLOCKED / NOT_RUN`，不可由 standalone/admin/测试桩替代
