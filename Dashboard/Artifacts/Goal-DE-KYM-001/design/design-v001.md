# DE-KYM-001 Design v001

## 最小切片

以 `.kym-tco/dataease/kym/revisions/kym-r001.json` 为 base，先用普通 CLI snapshot 用户指定的需求 JSON，再生成完整 r002 draft。所有新增需求陈述使用该 snapshot 的 source identity 和准确行号。复用固定树，只在 Users、Product 各固定分支和 Project 下增加语义分支；不改变固定二级节点。

## 语义映射

- 规范需求与 TSP：进入 Product Info / Scope / Business Rules，按功能语义分组并保留 Q 编号。
- 角色：只把直接使用产品的设计者、分析师、报表查看者归入 Users；管理员与采购/治理主体没有充分关系证据时保留 unresolved。
- 原文/JSON 中的确认、待证、排除、未裁事项分开记录；Q157 和跨功能冲突裁定不提升为已确认规则。
- 需求 JSON 的 `implementation_status=not_assessed` 作为需求文档状态边界，不写为当前代码状态。
- Existing source-supported repo statements and open questions in r001 remain unchanged. The current repo is not re-audited for runtime implementation in this task.

## 生成与验证

普通 CLI 路径按 `kym ingest` → hand-authored complete draft → `validate` → `lint --strict` → bundled `audit_candidate.py` → `package-candidate` → independent renderer byte readback。仅当实际命令成功时记录通过。该路径不含 supported-host 的 source ledger/materialization binding；用户授权覆盖该 Skill 限制，但最终报告仍明确不具备该证据。

## 验收与限制

固定树、旧 r001 内容、Profile 和来源边界受保护；候选最大状态为 `candidate_not_approved`。该设计不产生 TCO、Coverage、代码实现结论或独立审阅结论。
