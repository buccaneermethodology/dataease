from pathlib import Path
import json,datetime,hashlib,subprocess
R=Path.cwd();A=R/'Dashboard/Artifacts/SP-001';now=datetime.datetime.now(datetime.timezone.utc).isoformat()
def put(p,obj):p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def ref(p):return {'path':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
# 只生成本任务新版本；不改动原始请求/合同/旧证据。
acs=json.loads((A/'planning/contract-v1.json').read_text())['acceptance_criteria']
evidence={
'AC01':['baseline/manifest.json','evidence/source-inventory-v2.json','evidence/coverage-v2.json','evidence/source-baseline-check-v2.json'],
'AC02':['planning/capability-denominator-v1.json','evidence/coverage-v2.json','evidence/gap-register-v2.json'],
'AC03':['extraction/integrated-v7/data.json','extraction/integrated-v7/chart.json','extraction/integrated-v7/access.json','reviews/data-semantic-v2.md','reviews/chart-semantic-v2.md','reviews/access-semantic-v2.md'],
'AC04':['planning/object-contract-v1.md','evidence/kb-tool-tests-formal.json','evidence/formal-package-checks.json'],
'AC05':['evidence/formal-package-checks.json','evidence/impact-example.json','reviews/relations-review-v2.md'],
'AC06':['reviews/data-semantic-v2.md','reviews/chart-semantic-v2.md','reviews/access-semantic-v2.md','reviews/base-semantic-v3.md','reviews/relations-review-v2.md'],
'AC07':['evidence/source-baseline-check-v2.json','evidence/document-disposition-v1.json','evidence/reconciliation.json'],
'AC08':['goal.md','stage-plan.md','evidence/scope-delta-audit.json','evidence/candidate-manifest.json','closeout.md','reviews/final-review.md']}
put(A/'evidence/obligation-ledger.json',{'goal':'DE-KB-001','claim':'交付与证据索引；最终验收由独立报告和Stop Gate确定','acceptance':[dict(x,evidence=evidence[x['id']]) for x in acs],'original_goal_obligations':[{'item':i,'evidence':v} for i,v in [
('输入基线与全仓盘点',['AC01']),('K00–K11及核心6类/F01–F18和新增F19–F23',['AC02','AC03']),('能力/UI/API/服务/数据/测试跨层关系',['AC03','AC05']),('JSON真源及确定性Markdown/图谱',['AC04','AC05']),('核心逐项与非核心逐域独立复核',['AC06']),('冲突/缺口仅SP，Dashboard仅执行面，全景仅参考',['AC02','AC07']),('本地最终包、来源/覆盖/维护/收尾',['AC08'])]],'required_work_units':['SP-001-P0','SP-001-P1','SP-001-P2','SP-001-P3','SP-001-P4','SP-001-FINAL']})
put(A/'evidence/scope-delta-audit.json',{'original_user_intent':ref(A/'planning/raw-user-intent-v1.txt'),'directory_and_execution_authority':ref(A/'planning/raw-user-intent-v2.txt'),'scope_decisions':ref(A/'planning/decisions.json'),'differences':[{'change':'kb与Dashboard平行，所有执行中间件归SP；全景只参考，K11外置SP','authority':'planning/raw-user-intent-v2.txt','effect':'位置调整，不删除缺口义务'},{'change':'全仓盘点＋核心深挖；静态证实；XPack仅公共契约与核心调用','authority':'planning/decisions.json','effect':'明确提取深度与证据门槛；不承诺运行或专有实现'}],'unapproved_scope_narrowing':[],'original_F01_F18_retained':True,'additional_F19_F23_retained':True,'note':'引用是用户澄清的本地审计记录，非平台签名凭证；不替代原始人类authority。'})
put(A/'evidence/provenance-manifest.json',{'recorded_at':now,'source_revision':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'source_repo':subprocess.check_output(['git','remote','get-url','origin'],text=True).strip(),'baseline':ref(A/'baseline/manifest.json'),'inventory':ref(A/'evidence/source-inventory-v2.json'),'skill_manifest':ref(A/'planning/skill-manifest.json'),'tool':ref(R/'kb/tools/kb.py'),'schema':ref(R/'kb/schema/document.schema.json'),'documents':[ref(p) for p in sorted((R/'kb/data').glob('*.json'))],'prompts':[ref(p) for p in sorted((A/'planning').glob('*prompt*.txt'))],'model':None,'model_note':'没有可靠的本轮模型版本事件记录，不猜测','claim':'来源与产物绑定，不是全仓语义穷尽'})
