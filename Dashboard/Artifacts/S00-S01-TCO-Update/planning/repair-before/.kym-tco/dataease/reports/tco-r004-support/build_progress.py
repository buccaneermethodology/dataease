import json,hashlib,copy,datetime
from pathlib import Path
from collections import Counter
ROOT=Path.cwd(); B=Path('.kym-tco/dataease'); S=B/'reports/tco-r004-support'; A=Path('Dashboard/Artifacts/S00-S01-TCO-Update')
S00=next(Path('Dashboard/Artifacts').glob('DT_DM*/SP-004/Resume-r004')); S01=next(Path('Dashboard/Artifacts').glob('DT_DM*/SP-005'))
def read(p):return json.loads(Path(p).read_text())
def save(p,d):Path(p).parent.mkdir(parents=True,exist_ok=True);Path(p).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def canonical(d):return 'sha256:'+hashlib.sha256(json.dumps(d,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
ledger=[]; snapshots={}
def snap(p):
 p=Path(p); key=str(p)
 if key in snapshots:return snapshots[key]
 digest=sha(p); dst=B/'sources/snapshots'/('s00s01-'+p.stem+'-'+digest[:12]+p.suffix)
 if dst.exists():assert dst.read_bytes()==p.read_bytes()
 else:dst.write_bytes(p.read_bytes())
 ledger.append({'source_ref':key,'snapshot_ref':str(dst),'sha256':digest,'source_role':'historical_stage_evidence','read_at':datetime.datetime.now(datetime.timezone.utc).isoformat()});snapshots[key]=str(dst);return str(dst)
selected0=['S00Closeout.md','AcceptanceCriteria.md','AcceptanceMapping.json','FixtureSpec.md','DecisionLedger.json','ReviewFindings-final.md','DashboardReconciliation.md','receipt-final.json','ScopeDelta.md']
selected1=['S01_Closeout.md','IndependentReviewFindings-r002.md','IndependentFinalReconciliation-r003.md','TestabilityMatrix-r012.json','ClaimsLedger-r002.json','TechnicalDependencyLedger-r003.json','FixtureTraceLedger.json','RuntimeEvidenceLedger.json','B2c-Runtime-Result.md','EnvironmentRecovery-r001.md','S02-S09_EntryPacket.md','ScopeDelta-r001.md','ScopeDelta-r002.md','TechnicalImpactMatrix.md','DependencyGraph.md','FunctionConnectionMap_F01-F04.md','FunctionConnectionMap_F05-F08.md','B2c-F05-repair-case.json','B2c-export-file-check.json','B2c-multidrag-dom.txt','B2c-multidrag-undo-dom.txt','stop-gate/receipt-final.json','planning/final-readback.json']
for base,names in [(S00,selected0),(S01,selected1)]:
 for n in names:snap(base/n)
# Preserve screenshot bytes for the narrow observations, without copying scripts or connection material.
for name in ['B2c-filter-new-preview.png','B2c-export-task-success.png','B2c-query-region300.png','B2c-query-clear650.png','B2c-F05-pivot-rule-render.png','B2c-F05-pivot-reopened-recovery.png','B2c-enum-multi500.png','B2c-enum-clear650.png','B2c-custom-total-render.png','B2c-pivot-total.png']:snap(S01/name)
old=read(B/'tco/models/tco-r003.json'); model=copy.deepcopy(old)
model['model_revision']='r004';model['base_model_digest']=canonical(old)
model['claim_ceiling']='以S01有条件收尾为事实截止，S00规格与S01调查/局部观察分层可见；不包含S02进行中成果，不提升整功能Coverage或创建批准状态。'
model['lineage'].append({'source':'S00_S01_historical_evidence_update','projection_ledger':str(S/'projection-ledger.json'),'progress_ledger_ref':str(S/'progress.json'),'source_ledger_ref':str(S/'source-ledger.json'),'base_model_ref':str(B/'tco/models/tco-r003.json'),'scope_note':'M1、TSP、Target Profiles和178覆盖要求保持原义；推进项是独立项目观察轴，不属于CLI保留Coverage状态。前序lineage是历史时点，当前事实以本条所引账本为准。'})
for profile in model['target_profiles']:
 if profile['id']=='profile_w0':
  for req in profile['requirements']:
   req['missing_items']=['S00规格及S01有条件调查已完成；影响实现的设计/实验待决项、真实权限与App真设备验证仍保留，尚未证明W0无悬而未决问题。']
mp=B/'tco/models/tco-r004.json';save(mp,model)
cov=read(B/'tco/proposals/coverage-kym-r007-r003.json');cov['proposal_id']='coverage-kym-r007-r004';cov['source_tco_model']=str(mp);cov['source_tco_model_digest']=canonical(model)
notes={
'f01':('既有过滤条件使明细表剩5行，保存后新预览仍5行。','专用复制粘贴、跨标签身份/TTL、复杂过滤树、真实权限未证。'),
'f02':('静态入口及依赖调查完成；指定App与真设备运行未执行。','真设备/App、方向与返回恢复及3秒条件仍阻塞；延期不计通过。'),
'f03':('异步导出任务成功；服务端xlsx为含表头6行2列，内容与5行fixture一致。','浏览器下载事件超时；全格式、权限/脱敏、取消与永久保留未完整验证。'),
'f04':('既有查询链选择华东=300、清除后=650。','级联与完整可选值过滤树、NULL/错误语义、真实权限未证。'),
'f05':('最小透视条件命中/不命中及保存重开已有证据。','全部字段/属性、跨字段与历史兼容未证；新增归档按用户要求暂停。'),
'f06':('两个同类字段一次拖入，撤销一次恢复原region维度。','容量、全部目标区域、原子性与配置保留未全覆盖；最大选中数仍未决。'),
'f07':('枚举多选后查询=500，清空后=650，已观察既有清空路径。','5000/5001截断、全域搜索、输入验证、三类选择器及性能未证。'),
'f08':('分组300/300/50与总计650；自定义1+1刷新后为2。','确认后一度显示“-”；小计、多级底层聚合、10槽位、异常公式与性能未证。')}
legacy=[]
for r in cov['records']:
 nid=r['tco_node_id']
 # Old code reads can drift while S02 edits proceed: retain them as historical navigation, not current counted evidence.
 legacy.append({'node_id':nid,'evidence':copy.deepcopy(r.get('evidence',[])),'original_claim_ceiling':r.get('claim_ceiling'),'status':'historical_r003_not_current_runtime'})
 r['evidence']=[e for e in r.get('evidence',[]) if e['kind']!='code']
 for e in r['evidence']:
  if e.get('artifact_digest') and Path(e['ref']).exists():
   assert e['artifact_digest']=='sha256:'+sha(e['ref']),e['ref']
 if nid.startswith('f0'):
  refs=[S01/'TestabilityMatrix-r012.json',S01/'S01_Closeout.md',S01/'B2c-Runtime-Result.md']
  if nid=='f05':refs.append(S01/'EnvironmentRecovery-r001.md')
  r['claim_ceiling']=notes[nid][0]+' '+notes[nid][1]+' 仅S01历史局部观察；未逐AC完成运行验收，整体Coverage仍design_only。推进项见 '+str(S/'progress.json')
 elif nid=='baseline':
  refs=[S01/'S01_Closeout.md',S01/'IndependentFinalReconciliation-r003.md',S01/'TechnicalDependencyLedger-r003.json']
  r['claim_ceiling']='S00规格整理及S01有条件技术调查已交付并独立审查；156题/171AC/19fixture/14issue保留，76部分静态绑定/95显式gap。真实权限、App/真设备延期，第二批清理与新增F05归档暂停；不等于完整基线冻结或W0所有目标已满足。推进项见 '+str(S/'progress.json')
 else:
  refs=[S01/'S01_Closeout.md']
  r['claim_ceiling']={'demo':'七功能既有链路的局部演示观察，不是完整独立产品演示/回归验收。','boundary_check':'局部保存重开/撤销有见证，不能推广全部边界及持久化验收。','data_check':'合成数据局部查询及文件核对有见证；真实权限、脱敏、完整性能未验。','release':'S00/S01未执行完整发布门槛核验；保留全部发布要求。'}[nid]+' 当前design_only；阶段进展见 '+str(S/'progress.json')
 for ref in refs:
  dst=snap(ref);r['evidence'].append({'kind':'document','ref':dst,'label':'S01历史调查证据；不代表整项产品验收','artifact_digest':'sha256:'+sha(dst)})
 for q in r['requirement_coverage']:
  if nid=='baseline':q['notes']='S00规格与S01有条件调查完成；真实权限/真设备等延期，完整基线与W0门槛未全验证。'
  elif nid in notes:q['notes']=q['notes'].split(' 当前design_only')[0]+' S01已有功能级调查/局部观察；不得据此认定本条产品要求通过。'
  # Replace stale code references in row evidence by a faithful historical document.
  q['evidence_refs']=[x for x in q.get('evidence_refs',[]) if not x.startswith(('core/','sdk/'))]
  if not q['evidence_refs']:q['evidence_refs']=[snap(S01/'TestabilityMatrix-r012.json')]
cp=B/'tco/proposals/coverage-kym-r007-r004.json';save(cp,cov);save(S/'historical-r003-evidence.json',legacy)
mat=read(S01/'TestabilityMatrix-r012.json');claims=read(S01/'ClaimsLedger-r002.json');issues=read(S01/'TechnicalDependencyLedger-r003.json');fixture=read(S01/'FixtureTraceLedger.json')
items=[]
def item(id,node,title,stage,before,after,result,refs,next_,owner='后续Slice负责人'):
 items.append({'id':id,'node_id':node,'title':title,'stage':stage,'before_status':before,'status':after,'result':result,'evidence_refs':[snap(p) for p in refs],'owner':owner,'next':next_,'counts_toward_target_met':False})
for i in range(1,9):
 nid=f'f{i:02}'; F=nid.upper(); subset=[x for x in mat['mappings'] if x['function_id']==F]
 item(nid+'-s00-spec',nid,'需求决策与验收规格整理','S00','unknown','completed','已整理该功能的决策、验收规格与fixture关联；完成的是规格整理，不是产品验收或消除所有技术待决项。',[S00/'AcceptanceCriteria.md',S00/'ReviewFindings-final.md'],'沿用原规格，待决项显式保留')
 item(nid+'-s01-investigate',nid,'现状连接点与风险调查','S01','pending','completed_with_bounds',f'该功能{len(subset)}条AC已纳入逐项可测试性调查；静态结论保持事实/推断/未知边界。',[S01/'TestabilityMatrix-r012.json',S01/'ClaimsLedger-r002.json',S01/'TechnicalDependencyLedger-r003.json',S01/'IndependentFinalReconciliation-r003.md'],'按调查结论冻结切片设计，未决问题逐项处理')
 item(nid+'-s01-runtime',nid,'既有链路局部运行观察','S01','pending','blocked' if i==2 else 'partial',notes[nid][0]+' '+notes[nid][1],[S01/'ScopeDelta-r001.md'] if i==2 else [S01/'B2c-Runtime-Result.md',S01/'EnvironmentRecovery-r001.md'],'补齐本功能未覆盖场景；禁止从局部观察外推完整功能')
 item(nid+'-s01-ac-map',nid,'逐条AC证据绑定','S01','pending','partial',f"{sum(x['status']=='partial_static_binding_runtime_required' for x in subset)}条部分静态绑定，{sum(x['status']=='explicit_gap_unresolved' for x in subset)}条显式缺口；产品AC通过数未建立。",[S01/'TestabilityMatrix-r012.json'],'以AC身份逐条补证，不将静态绑定计作产品PASS')
 item(nid+'-acceptance',nid,'完整功能实现符合性与验收','后续','pending','pending','S00/S01未交付新产品实现，也未完成完整功能验收；既有代码实现程度按逐条证据判断。',[S01/'S01_Closeout.md'],'先完成相关设计与准入，再按原AC验证')
for id,title,stage,before,after,result,refs,next_ in [
 ('baseline-s00-decisions','156项决策映射','S00','unknown','completed','156项问答/决策完整整理。',[S00/'DecisionLedger.json',S00/'ReviewFindings-final.md'],'保留追溯'),
 ('baseline-s00-spec','171AC与19组fixture规格','S00','unknown','completed','已形成规格及完整对应关系；不是171项测试通过。',[S00/'AcceptanceMapping.json',S00/'FixtureSpec.md'],'按规格落实验证'),
 ('baseline-s00-review','S00独立审查收尾','S00','unknown','completed','历史S00文档审查与终态回执已记录。',[S00/'ReviewFindings-final.md',S00/'receipt-final.json'],'保留历史时点'),
 ('baseline-s01-investigate','八功能现状与14项技术依赖调查','S01','pending','completed_with_bounds','70条静态claim、14项依赖逐项调查完成，具体未知与后续责任保留。',[S01/'ClaimsLedger-r002.json',S01/'TechnicalDependencyLedger-r003.json'],'解决调查中记录的后续设计/实验项'),
 ('baseline-s01-closeout','S01独立审查与有条件收尾','S01','pending','completed_with_bounds','VALID_WITH_CONDITIONS；历史Gate允许按批准范围收尾，未证明原无条件范围全部完成。',[S01/'IndependentFinalReconciliation-r003.md',S01/'stop-gate/receipt-final.json',S01/'planning/final-readback.json'],'按EntryPacket继续切片设计'),
 ('baseline-external','真实权限与指定App/真设备验证','后续','pending','blocked','获准延期出S01完成条件；仍是对应产品验收缺口。',[S01/'ScopeDelta-r001.md'],'依赖可用后在授权隔离环境补验'),
 ('baseline-cleanup','第二批清理与新增F05归档','S01','unknown','paused','第一批已清理；第二批资源与新增F05归档由用户暂停，非零残留。',[S01/'ScopeDelta-r002.md'],'等待用户恢复指令，不在本任务执行'),
 ('baseline-freeze','完整基线冻结与W0退出核验','后续','pending','pending','S01有条件完成不自动满足W0所有原目标与真实环境核验。',[S01/'S01_Closeout.md'],'按原Profile逐条确认门槛及延期项影响')]:item(id,'baseline',title,stage,before,after,result,refs,next_,'基线/后续调查负责人')
for nid,title,result in [('demo','局部演示观察','七功能相关链路有局部观察，完整产品演示与回归未验。'),('boundary_check','局部保存重开与撤销','保存重开及单次撤销有局部观察，完整边界未验。'),('data_check','局部数据结果核对','合成数据和服务端文件有局部核对，真实权限与完整性能未验。'),('release','发布门槛验证','S00/S01未执行产品发布验收。')]:
 item(nid+'-s01-observation',nid,title,'S01','pending','pending' if nid=='release' else 'partial',result,[S01/'B2c-Runtime-Result.md',S01/'S01_Closeout.md'],'按原Profile补齐完整验证')
progress={'schema':'dataease.tco_progress.v1','candidate_status':'candidate_not_approved','model_ref':str(mp),'model_digest':canonical(model),'coverage_ref':str(cp),'source_kym_revision':'r007','as_of':'S01按批准范围有条件收尾（2026-10-16 UTC）；2026-10-21读取，不包括S02','states':{'unknown':'历史未建立记录','pending':'待执行/待完成','completed':'该推进项完成','completed_with_bounds':'该推进项按明确边界完成','partial':'部分观察/绑定','blocked':'依赖阻塞','paused':'用户暂停'},'semantics':'项目级推进轴，不是CLI原生Coverage；不得把推进项数量换算为产品完成率。before是对应阶段输入时点，S00前无记录保持unknown。','items':items,'ac_bindings':mat['mappings'],'issue_investigations':issues['issues'],'denominators':{'decisions':156,'acceptance_criteria':171,'fixtures':19,'issues':14,'m1':13,'target_requirements':26,'coverage_requirements':178},'profile_denominators':{p['id']:len(p['requirements']) for p in model['target_profiles']},'historical_runtime':read(S01/'RuntimeEvidenceLedger.json'),'historical_source_note':'RuntimeEvidenceLedger/FixtureTraceLedger包含早期清理与NOT_RUN描述；S01_Closeout及ScopeDelta-r002明确后续时点，不能引用旧零残留为当前结论。','evidence_coverage_summary':{'partial_static_binding':76,'explicit_gap':95,'product_ac_pass':'not_established'},'current_source_drift':[]}
for c in claims['claims']:
 path=Path(c['path']); expected=c.get('file_sha256',c.get('sha256')); actual=sha(path) if path.exists() else None
 if actual!=expected:progress['current_source_drift'].append({'claim_id':c['claim_id'],'path':str(path),'s01_sha256':expected,'current_sha256':actual,'disposition':'S01历史结论保留，未证明当前工作树行为；S02不纳入本次状态'})
save(S/'progress.json',progress);save(S/'source-ledger.json',{'schema':'dataease.historical_source_ledger.v1','note':'字节快照溯源，不冒充CLI external-run source-ledger','sources':ledger})
save(S/'projection-ledger.json',{'schema':'dataease.capability_progress_projection.v1','base_model':str(B/'tco/models/tco-r003.json'),'stable_m1_ids':[n['id'] for n in model['nodes'] if n['node_kind']=='m1'],'mappings':[{'progress_id':x['id'],'node_id':x['node_id'],'evidence_refs':x['evidence_refs']} for x in items],'preserved_target_profiles':True,'no_new_business_rules':True})
print('Generated',mp,cp,'progress items',len(items),'source snapshots',len(ledger),'historical code drift claims',len(progress['current_source_drift']))
