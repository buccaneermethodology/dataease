import json,hashlib
from pathlib import Path
from collections import Counter
B=Path('.kym-tco/dataease'); S=B/'reports/tco-r004-support'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
m=read(B/'tco/models/tco-r004.json'); old=read(B/'tco/models/tco-r003.json'); c=read(B/'tco/proposals/coverage-kym-r007-r004.json');p=read(S/'progress.json'); ledger=read(S/'source-ledger.json')
assert m['nodes']==old['nodes']
import copy
a=copy.deepcopy(m['target_profiles']); b=copy.deepcopy(old['target_profiles'])
for profiles in [a,b]:
 for profile in profiles:
  for req in profile['requirements']:
   req.pop('missing_items',None)
   if profile['id']=='profile_w0':req.pop('claim_ceiling',None)
assert a==b  # Only current gap prose changes; no Target predicate/mapping/threshold changes.
assert [len(x['requirements']) for x in m['target_profiles']]==[2,5,5,4,10]
assert len(p['ac_bindings'])==len({x['ac_id'] for x in p['ac_bindings']})==171
assert Counter(x['status'] for x in p['ac_bindings'])=={'partial_static_binding_runtime_required':76,'explicit_gap_unresolved':95}
assert len(p['issue_investigations'])==14
assert len({x['id'] for x in p['items']})==len(p['items'])==52
ids={n['id'] for n in m['nodes'] if n['node_kind']=='m1'}
assert {x['node_id'] for x in p['items']}==ids
assert all(not x['counts_toward_target_met'] for x in p['items'])
assert next(x for x in p['items'] if x['id']=='f02-s01-runtime')['status']=='blocked'
assert next(x for x in p['items'] if x['id']=='baseline-cleanup')['status']=='paused'
assert all(x['status']=='pending' for x in p['items'] if x['id'].endswith('-acceptance'))
known={x['snapshot_ref'] for x in ledger['sources']}
for x in ledger['sources']:
 assert sha(Path(x['snapshot_ref']))==x['sha256']
 assert sha(Path(x['source_ref']))==x['sha256'],x['source_ref']
for x in p['items']:assert x['evidence_refs'] and set(x['evidence_refs'])<=known
for r in c['records']:
 assert r['coverage_state']==r['effective_state']=='design_only'
 assert r['capability_lifecycle_state']=='contract_defined'
 assert r['validation_posture']=='producer_checked'
 n=next(n for n in m['nodes'] if n['id']==r['tco_node_id'])
 assert {x['requirement_id'] for x in r['requirement_coverage']}=={x['id'] for x in n['coverage_requirements']}
 for e in r['evidence']:
  if e.get('artifact_digest'):assert e['artifact_digest']=='sha256:'+sha(Path(e['ref']))
assert sum(len(n.get('coverage_requirements',[])) for n in m['nodes'])==178
print('PASS：原M1/Profiles/178要求不变；52推进项、171唯一AC、76/95、14issue与来源摘要一致；产品状态未自动提升。仅候选结构与证据一致性验证。')
