"""本批最终检查，仅写SP；不运行DataEase。"""
from pathlib import Path
import json,hashlib,datetime,subprocess,re,importlib.util,collections
R=Path.cwd();A=R/'Dashboard/Artifacts/SP-001';E=A/'evidence'
def put(name,obj):(E/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
now=datetime.datetime.now(datetime.timezone.utc).isoformat();docs=[json.loads(p.read_text()) for p in sorted((R/'kb/data').glob('*.json'))]
old=json.loads((E/'coverage-v1.json').read_text());inventory=json.loads((E/'source-inventory-v2.json').read_text());facts={f['id']:f for d in docs for f in d['facts']};source={e['path'] for f in facts.values() for e in f['evidence']}
read=set()
def walk(x):
 if isinstance(x,dict):
  if 'path' in x and isinstance(x['path'],str):read.add(x['path'])
  for y in x.values():walk(y)
 elif isinstance(x,list):
  for y in x:walk(y)
for p in (A/'extraction').glob('*/read-log.json'):walk(json.loads(p.read_text()))
for p in (A/'extraction').glob('relations-*.json'):walk(json.loads(p.read_text()).get('read_log',[]))
read|=source
review={'data':'data-semantic-v2.md','chart':'chart-semantic-v2.md','access':'access-semantic-v2.md','architecture-extensions':'base-semantic-v3.md'}
caprows=[];prior={c['id']:c for c in old['capabilities']}
for d in docs:
 for c in d['capabilities']:
  caprows.append({'id':c['id'],'original_name':prior[c['id']]['original_name'],'name':c['name'],'depth':c['depth'],'document':d['doc_id'],'facts':sorted({f for v in c['contract'].values() for f in v}),'empty_axes':[k for k,v in c['contract'].items() if not v],'limits':c['limits'],'semantic_review':'reviews/'+review[d['doc_id']]})
rows=[]
for row in inventory['files']:
 state='fact_evidence_slice' if row['path'] in source else 'logged_read_slice_not_admitted' if row['path'] in read else 'reference_only' if row['kind']=='reference_only' else 'excluded_content' if row['kind']!='source_text' else 'no_read_record'
 rows.append({'path':row['path'],'kind':row['kind'],'reading_status':state})
put('coverage-v2.json',{'observed_at':now,'claim':'物理盘点与切片证据分开；不表示文件全读、语义穷尽或运行通过','inventory_files':len(rows),'source_files_with_fact_evidence':len(source),'reading_counts':dict(collections.Counter(x['reading_status'] for x in rows)),'files':rows,'capabilities':sorted(caprows,key=lambda x:int(x['id'][1:])),'domains':old['domains'],'final_review_slot':'reviews/final-review.md'})
gap=json.loads((E/'gap-register-v1.json').read_text());gap['supersedes']='gap-register-v1.json';gap['observed_at']=now;gap['core_semantic_blockers']='分域修正复验均通过；最终包与关系增量结论见reviews/final-review.md，不能由缺口登记代替'
for x in gap['items']:
 if x['id']=='DATA-G02':x['uncertainty']='access领域已核实核心消费和分享专用切面；通用DePermit定义与企业实现不可见。';x['next_action']='保持公共契约边界；实际身份矩阵另行运行验证。'
 if x['id']=='CHART-G05':x['gap']='已与access领域行列权限和脱敏事实整合；未证明全部身份运行场景。'
put('gap-register-v2.json',gap)
changed=[];missing=[]
for row in inventory['files']:
 if row['sha256']:
  p=R/row['path']
  if not p.is_file():missing.append(row['path'])
  elif sha(p)!=row['sha256']:changed.append(row['path'])
put('source-baseline-check-v2.json',{'observed_at':now,'compared_digest_files':sum(bool(x['sha256']) for x in inventory['files']),'changed':changed,'missing':missing,'passed':not changed and not missing,'scope':'含未跟踪/忽略来源；敏感文件仅元数据不读取'})
spec=importlib.util.spec_from_file_location('kb_formal',R/'kb/tools/kb.py');kb=importlib.util.module_from_spec(spec);spec.loader.exec_module(kb)
_,stats=kb.validate(R,R/'kb/data',R/'kb/schema/document.schema.json');outputs=kb.projections(docs)
first={p:hashlib.sha256(s.encode()).hexdigest() for p,s in outputs.items()};second={p:hashlib.sha256(s.encode()).hexdigest() for p,s in kb.projections(docs).items()}
issues=[]
for p,content in outputs.items():
 for link in re.findall(r'\]\(([^)]+)\)',content):
  if '://' in link:continue
  dest,_,anchor=link.partition('#');target=(R/p).parent/dest
  if not target.exists():issues.append({'from':p,'target':link})
put('formal-package-checks.json',{'observed_at':now,'validation':stats,'deterministic':first==second,'landed_matches':all((R/p).read_text()==s for p,s in outputs.items()),'missing_links':issues,'generated_hashes':first,'graph_count':sum('```mermaid' in s for s in outputs.values()),'product_tests_run':False})
impact=kb.impact(docs,{'core/core-backend/src/main/java/io/dataease/chart/server/ChartDataServer.java'});put('impact-example.json',impact)
r=subprocess.run(['git','diff','--check'],capture_output=True,text=True);put('diff-check.json',{'exit_code':r.returncode,'output':r.stdout+r.stderr})
print(json.dumps({'stats':stats,'source_unchanged':not changed and not missing,'links':len(issues),'deterministic':first==second,'diff_check':r.returncode},ensure_ascii=False))
assert not changed and not missing and not issues and first==second and r.returncode==0
