# SP-001 执行入口

[修正 Goal](goal.md) · [Stage Plan](stage-plan.md) · [原始意图](planning/raw-user-intent-v1.txt) · [执行授权与更正](planning/raw-user-intent-v2.txt)

交付候选已落地；最终验收与Goal终态从下列固定结果入口读取，本文不预判未来Gate。

- [知识库阅读入口](../../../kb/README.md)：JSON真源及确定性投影，与Dashboard平行。
- [交付与收尾](closeout.md)、[最终独立审阅](reviews/final-review.md)、[结果绑定](evidence/final-result.json)、[终态回执](stop-gate/receipt-final.json)。
- [覆盖清单](evidence/coverage-v2.json)、[来源盘点](evidence/source-inventory-v2.json)、[缺口与产品问题](evidence/gap-register-v2.json)。
- [来源与生成绑定](evidence/provenance-manifest.json)、[原义务对账](evidence/obligation-ledger.json)、[冻结包清单](evidence/candidate-manifest.json)。

baseline保存写前字节；planning保存合同/上下文/委派/准入；extraction保留候选和修正历史；evidence保存执行检查；reviews保存独立结论；tools仅为本批工具。历史失败及CONTINUE回执保留，不当作最终通过。所有执行材料留在本SP，未证实内容不进入正式KB。
