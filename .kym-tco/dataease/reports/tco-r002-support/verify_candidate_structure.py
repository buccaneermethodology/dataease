import json, hashlib
from pathlib import Path
b=Path('.kym-tco/dataease')
k=json.loads((b/'kym/revisions/kym-r006.json').read_text())
old=json.loads((b/'kym/revisions/kym-r005.json').read_text())
m=json.loads((b/'tco/models/tco-r002.json').read_text())
c=json.loads((b/'tco/proposals/coverage-kym-r006-r002.json').read_text())
assert k['target_profiles']==old['target_profiles']
assert [len(p['requirements']) for p in m['target_profiles']]==[2,5,5,4,10]
for profile,target in zip(m['target_profiles'],k['target_profiles']):
 assert profile['source_target_id']==target['id']
 assert sorted(x['source_requirement_ref'] for x in profile['requirements'])==sorted(target['requirement_refs'])
for r in c['records']:
 n=next(x for x in m['nodes'] if x['id']==r['tco_node_id'])
 assert {x['requirement_id'] for x in r['requirement_coverage']}=={x['id'] for x in n['coverage_requirements']}
 assert r['coverage_state']=='design_only'
 for e in r['evidence']:
  if e['kind']!='command' and e.get('artifact_digest'):
   assert 'sha256:'+hashlib.sha256(Path(e['ref']).read_bytes()).hexdigest()==e['artifact_digest'],e['ref']
print('候选Profile分母、要求映射、证据摘要及design_only边界检查通过；没有执行产品功能测试。')
