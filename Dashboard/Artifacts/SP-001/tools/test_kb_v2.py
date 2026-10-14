from pathlib import Path
import json,importlib.util,tempfile,copy
A=Path(__file__).resolve().parents[1];repo=A.parents[2]
spec=importlib.util.spec_from_file_location('candidate_kb',A/'extraction/tools/kb-v2.py');kb=importlib.util.module_from_spec(spec);spec.loader.exec_module(kb)
pos=json.loads((A/'planning/cases/positive.json').read_text());cases=json.loads((A/'planning/cases/negative-cases-v2.json').read_text());results=[]
# 所有临时输入归SP；不修改产品源码。
with tempfile.TemporaryDirectory(prefix='fixture-',dir=A/'evidence') as t:
 data=Path(t)
 def check(d):
  (data/'sample.json').write_text(json.dumps(d,ensure_ascii=False));return kb.validate(repo,data,A/'planning/kb-document.schema.v1.json')
 docs,_=check(pos);results.append({'case':'positive','passed':True})
 for case in cases:
  d=copy.deepcopy(pos);m=case['mutation'];v=case['value']
  if m=='evidence_path':d['facts'][0]['evidence'][0]['path']=v
  elif m=='digest':d['facts'][0]['evidence'][0]['sha256']=v
  elif m=='kind':d['facts'][0]['kind']=v
  elif m=='duplicate':d['facts'].append(copy.deepcopy(d['facts'][0]))
  elif m=='endpoint':d['relations'][0]['to']=v
  elif m=='output':d['output_path']=v
  elif m=='repo':d['metadata']['source_repo']=v
  elif m=='revision':d['metadata']['source_revision']=v
  try:check(d);err='unexpected acceptance'
  except kb.Invalid as e:err=str(e)
  results.append({'case':case['id'],'passed':err.startswith(case['fingerprint']+':'),'observed':err})
 first=kb.projections(docs);second=kb.projections(docs);results.append({'case':'deterministic','passed':first==second})
 impact=kb.impact(docs,{pos['facts'][0]['evidence'][0]['path']});results.append({'case':'impact','passed':impact['direct_facts']==['SAMPLE-001'] and 'SAMPLE-C01' in impact['affected_objects']})
results.append({'case':'no_tested_claim','passed':'未证明运行正确' in first['kb/generated/sample.md']})
print(json.dumps({'passed':all(x['passed'] for x in results),'cases':results,'claim':'KB工具反例与最小样例；不代表全域语义验收'},ensure_ascii=False,indent=2))
raise SystemExit(0 if all(x['passed'] for x in results) else 1)
