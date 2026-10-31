"""记录正式提升/收尾窗口的实际lane证据；不回填早期时间。"""
from pathlib import Path
import json,hashlib,datetime,sys
R=Path.cwd();A=Path('Dashboard/Artifacts/SP-001');checkpoint=sys.argv[1];D=A/'evidence/topology'/checkpoint;D.mkdir(parents=True,exist_ok=True)
def put(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def ref(p):return {'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
now=datetime.datetime.now(datetime.timezone.utc).isoformat();snapshot='SP001-formal-'+checkpoint
outputs={'design':A/'planning/design-v2.md','builder':A/'extraction/integrated-v5/architecture-extensions.json','semantic':A/'reviews/p1-review-v2.md','validation':A/'reviews/base-semantic-v3.md','closure':A/'stop-gate/state-continue-v1.json'}
if checkpoint=='final':outputs['validation']=A/'reviews/final-review.md';outputs['closure']=A/'closeout.md'
identities={'design':'/root','builder':'/root','semantic':'/root/pre_review','validation':'/root/pre_review','closure':'/root'}
refs={}
for lane,p in outputs.items():
 ident=identities[lane]
 if not p.is_file():raise SystemExit('缺实际输出 '+str(p))
 cap=D/(lane+'-capability.json');life=D/(lane+'-lifecycle.json');row=D/(lane+'-evidence.json')
 put(cap,{'schema_version':'sge_capability_receipt_v1','lane':lane,'execution_identity':ident,'state':'supported','evidence':'当前宿主工具与实际durable输出；非安装推断','observed_at':now})
 put(life,{'schema_version':'sge_lane_lifecycle_event_v1','lane':lane,'execution_identity':ident,'checkpoint':checkpoint,'state':'output_candidate','observed_at':now,'note':'正式提升/收尾窗口观测；不回填候选提取前时点','output':str(p)})
 put(row,{'schema_version':'sge_lane_evidence_v1','lane':lane,'execution_identity':ident,'checkpoint':checkpoint,'snapshot_id':snapshot,'capability_receipt_ref':ref(cap),'lifecycle_event_ref':ref(life),'durable_output_ref':ref(p)})
 refs[lane]=ref(row)
snap={'repo_root':str(R),'snapshot_id':snapshot,'checkpoint':checkpoint,'required_lanes':list(outputs),'lane_evidence_refs':refs,'execution_admission_ref':ref(A/'planning/admission-promotion-v1.json')}
put(D/'snapshot.json',snap)
print(str(D/'snapshot.json'))
