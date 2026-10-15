import json, hashlib
from pathlib import Path
r=Path('.kym-tco/dataease')
m=json.load(open(r/'tco/models/tco-r001.json'))
c=json.load(open(r/'tco/proposals/coverage-kym-r005-r001.json'))
k=json.load(open(r/'kym/revisions/kym-r005.json'))
assert [len(p['requirements']) for p in m['target_profiles']]==[2,5,5,4,10]
for p,t in zip(m['target_profiles'],k['target_profiles']):
 assert p['source_target_id']==t['id']
 assert sorted(q['source_requirement_ref'] for q in p['requirements'])==sorted(t['requirement_refs'])
for rec in c['records']:
 n=next(n for n in m['nodes'] if n['id']==rec['tco_node_id'])
 assert set(q['requirement_id'] for q in rec['requirement_coverage'])==set(q['id'] for q in n['coverage_requirements'])
 for e in rec['evidence']:
  assert e['artifact_digest']=='sha256:'+hashlib.sha256(Path(e['ref']).read_bytes()).hexdigest(),e['ref']
print('PASS: Profile 分母、逐行引用及证据字节一致；未执行产品功能，不证明运行行为。')
