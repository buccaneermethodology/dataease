"""冻结实际KB/执行交付；下游报告和收尾回执槽位不倒灌快照。"""
from pathlib import Path
import json,hashlib,datetime,subprocess
R=Path.cwd();A=R/'Dashboard/Artifacts/SP-001';E=A/'evidence'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def put(p,obj):p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
tracked=['Dashboard/README.md','Dashboard/Big_Ideas.md','Dashboard/Sessions.md','Dashboard/Decisions.md','Dashboard/Artifacts/README.md']
status=subprocess.check_output(['git','status','--porcelain=v1','-z','-uall']);(E/'final-status.z').write_bytes(status)
(E/'final-tracked.diff').write_bytes(subprocess.check_output(['git','diff','--',*tracked]));(E/'final-staged.diff').write_bytes(subprocess.check_output(['git','diff','--cached']))
changes=subprocess.check_output(['git','diff','--name-only'],text=True).splitlines();assert set(changes)<=set(tracked)
assert (E/'final-staged.diff').read_bytes()==(A/'baseline/staged.patch').read_bytes()
orig=R/'Dashboard/Artifacts/temp docs/DataEase_Initial_KB_Goal.md';backup=A/'baseline/Dashboard/Artifacts/temp docs/DataEase_Initial_KB_Goal.md';assert orig.read_bytes()==backup.read_bytes()
kbfiles=sorted(p for p in (R/'kb').rglob('*') if p.is_file())
assert all('__pycache__' not in p.parts for p in kbfiles)
for p in kbfiles:assert p.suffix in {'.json','.md','.py'}
put(E/'reconciliation.json',{'observed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'候选包手工对账完成，最终验收另见独立报告','session_registry':'not_available；未声明程序化注册表校验','sessions':['DE-EXEC-S009','DE-EXEC-S010','DE-EXEC-S011','DE-EXEC-S012','DE-EXEC-S013'],'unique_parent':'SP-001','big_idea':'DE-KNOW-BI01','kb_root':'kb/','execution_root':'Dashboard/Artifacts/SP-001/','checks':{'original_goal_unchanged':True,'staged_content_unchanged':True,'tracked_product_changes':[],'knowledge_execution_separated':True,'source_baseline_report':'source-baseline-check-v2.json','scope_and_obligations':'obligation-ledger.json'},'downstream_rule':'冻结候选正文不回填PASS；最终review、wrapper、state、receipt、只读读回和观察记录追加，不反向改写已审内容。'})
slots=['reviews/final-review.md','planning/final-review-card.json','planning/final-review-prompt.txt','evidence/final-review-card-validation.json','evidence/final-result.json','evidence/final-readback.json','evidence/topology/final/','evidence/topology/series.json','evidence/topology/series-result.json','stop-gate/final-evidence/','stop-gate/state-final.json','stop-gate/receipt-final.json']
skip=[A/x for x in slots];skip+=[E/'candidate-manifest.json']
files=[R/p for p in tracked]+kbfiles+[p for p in A.rglob('*') if p.is_file() and '__pycache__' not in p.parts and not any(p==s or s in p.parents for s in skip)]
files+=list((R/'Dashboard/Artifacts/Goal-DE-GOV-003/data/tasks/SP-001').glob('v001.json'))
rows=[{'path':str(p.relative_to(R)),'sha256':sha(p),'bytes':p.stat().st_size,'disposition':'modified_tracked' if str(p.relative_to(R)) in tracked else 'new_task_file'} for p in sorted(set(files))]
put(E/'candidate-manifest.json',{'snapshot_id':'SP001-FINAL-CANDIDATE-1','frozen_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'baseline_revision':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'files':rows,'preserved_user_files':[str(orig.relative_to(R))],'downstream_slots':slots,'observation_slot':'Dashboard/Artifacts/Goal-DE-GOV-003/data/tasks/SP-001/v002.json','scope':'完整任务交付及已存在SP证据；原始用户草稿保留不属于新交付；下游槽位单向绑定，不预填结论','rename_delete':[]})
print(json.dumps({'snapshot':'SP001-FINAL-CANDIDATE-1','files':len(rows),'candidate_ready_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}))
