from pathlib import Path
import json,hashlib
r=Path('Dashboard/Artifacts/SP-001/extraction/access');d=json.loads((r/'candidate-v2.json').read_text());b='core/core-backend/src/main/java/io/dataease/';f='core/core-frontend/src/'
def add(n,s,es,kind='implemented'):
 d['facts'].append(dict(id=f'ACCESS-{n:03}',statement=s,scope='当前源码静态分支；未运行',kind=kind,evidence=[dict(path=p,start_line=a,end_line=z,symbol=sym,sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest()) for p,a,z,sym in es]))
for x in d['facts']:
 if x['id']=='ACCESS-023':x['statement']='列权限把启用且选中的规则按用户/角色分组，用户规则优先；字段匹配项中任一opt为Desensitization就保留字段，但登记到脱敏映射的是该组匹配项的第一项get(0)，不保证是触发判断的脱敏项；无脱敏匹配则去除字段，无任何匹配则保留。规则查询在行/列API缺失或系统管理员时返回空规则。'
add(47,'Entrances通信回调只处理带de-embedded标记的消息，先await ensureDekey；event.origin等于当前origin时直接setIframeData、置isIframe、记录event.source为宿主并发initIframe事件，不调用跨源initApi。',[(f+'views/component/embedded-iframe/Entrances.vue',17,29,'communicationCb')])
add(48,'跨源握手将event.origin经btoa后调用rsaEncryp，再把embeddedToken与加密origin交给initApi；仅res.msg为空时写Store、iframe标记与宿主并发initIframe，有msg或initApi Promise拒绝显示域名匹配错误。ensureDekey及origin加密发生在该Promise catch之外，不应把所有初始化失败都描述为域名提示。',[(f+'views/component/embedded-iframe/Entrances.vue',17,46,'communicationCb/showError'),(f+'utils/encryption.ts',24,46,'ensureDekey/getDekeyParts'),(f+'utils/encryption.ts',62,66,'rsaEncryp')])
add(49,'Entrances挂载前对有登录Token或非iframe的指定preview URL、已有embeddedToken、de-link URL分别发initIframe(false)并早退；否则获取dekey、注册message监听、向parent以*发ready消息。卸载前移除同一监听；检测top/self异常时按iframe处理。',[(f+'views/component/embedded-iframe/Entrances.vue',48,80,'isInIframe/onBeforeMount/onBeforeUnmount')])
add(50,'异步数据集导出对orderChecked字段构造asc排序；查总数后把用于分片计算的totalCount取实际总数与dataset导出限额较小值，再按sheetLimit和extractPageSize计算sheet/page数量。SQL页通常用sheet偏移加页偏移与extractPageSize；单页sheet分支改用offset0和sheetSize。本段不证明末页实际返回行数绝不超过逻辑限额。',[(b+'exportCenter/manage/ExportCenterDownLoadManage.java',392,435,'startDatasetTask')])
add(51,'异步数据集每页查询携带dsMap/isCross和复制后的prepared参数，Provider结果交buildPreviewData并传入desensitizationList；从返回data按字段dataeaseName读取行，首批加字段名表头，后续追加行，以setDatasetCellValue写单元格，故Excel内容消费的是该脱敏处理后的结果。',[(b+'exportCenter/manage/ExportCenterDownLoadManage.java',435,496,'startDatasetTask'),(b+'exportCenter/manage/ExportCenterDownLoadManage.java',140,149,'applyPreparedParams'),(b+'exportCenter/manage/ExportCenterDownLoadManage.java',937,954,'setDatasetCellValue')])
add(52,'异步数据集按sheet/page进度更新IN_PROGRESS，完成遍历后加水印，通过ExportTaskFileTarget输出流写workbook并flush/close；既有后续处理负责成功/失败状态与上下文清理。',[(b+'exportCenter/manage/ExportCenterDownLoadManage.java',498,521,'startDatasetTask')])
add(53,'数据集与图表导出限额配置默认各100000；限额管理器type为空或view时取viewLimit，否则取datasetLimit。异步导出页大小配置默认50000，sheetLimit固定1000000。',[(b+'exportCenter/manage/ExportCenterLimitManage.java',7,21,'getExportLimit'),(b+'exportCenter/manage/ExportCenterDownLoadManage.java',108,126,'extractPageSize/sheetLimit'),(b+'exportCenter/util/ExportCenterUtils.java',13,19,'getExportLimit')],kind='configured')
updates={'F09':{'trigger':[47,49],'inputs':[47,48],'outputs':[48,49],'preconditions':[47,48,49],'state_changes':[47,48],'postconditions':[47,48],'invariants':[48,49],'failures':[48],'permissions':[48],'implementation':[47,48,49],'dependencies':[48],'data':[14,47,48]},'F10':{'inputs':[50,53],'outputs':[51,52],'preconditions':[50],'state_changes':[52],'postconditions':[51,52],'invariants':[50,53],'implementation':[50,51,52,53],'dependencies':[51,53],'data':[50,51,52]}}
for c in d['capabilities']:
 for k,ns in updates.get(c['id'],{}).items():c['contract'][k]=list(dict.fromkeys(c['contract'][k]+[f'ACCESS-{n:03}' for n in ns]))
 if c['id']=='F09':
  c['contract']['failures']=['ACCESS-048']
  c['limits']=['已核实主仓Entrances同源/跨源握手、加密origin、状态与监听生命周期；后端签发、域名校验、过期、注销与应用持久化仅有SDK契约证据，未推断其实现。','未运行宿主浏览器握手或失败测试；ensureDekey/加密异常不在initApi.catch内。']
 if c['id']=='F10':c['limits'].append('限额记录的是源码逻辑计数和分页分支，末页实际行数、跨sheet单页offset及所有导出入口一致性均未运行验证。')
# 保留已存在关系ID，新关系只追加，避免历史审阅指针变动。
existing={(x['from'],x['to']) for x in d['relations']}
for c in d['capabilities']:
 for n in sorted(set(v for a in c['contract'].values() for v in a)):
  if (c['id'],n) not in existing:
   d['relations'].append(dict(id=f'ACCESS-R{len(d["relations"])+1:03}',type='CAPABILITY_REALIZED_BY',**{'from':c['id'],'to':n},evidence_fact_ids=[n]));existing.add((c['id'],n))
(r/'candidate.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
reads={}
for x in d['facts']:
 for e in x['evidence']:reads.setdefault(e['path'],[]).append({k:e[k] for k in ['start_line','end_line','symbol']})
log=json.loads((r/'read-log-v2.json').read_text());log['version']=3;log['files']=[dict(path=p,ranges=a,sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest()) for p,a in reads.items()]
(r/'read-log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n')
g=json.loads((r/'gaps-v2.json').read_text());g.append(dict(id='ACCESS-G05',capabilities=['F10'],gap='分页末页与单页sheet分支的实际输出条数/偏移未运行验证',reason='已静态核实392–510，记录具体分支，不把totalCount截断等同输出绝对上界',next='如需运行保证，在隔离环境验证非整页限额及跨sheet场景'))
(r/'gaps.json').write_text(json.dumps(g,ensure_ascii=False,indent=2)+'\n')
ids={x['id'] for x in d['facts']}
for x in d['facts']:
 for e in x['evidence']:
  p=Path(e['path']);assert hashlib.sha256(p.read_bytes()).hexdigest()==e['sha256'];assert 1<=e['start_line']<=e['end_line']<=len(p.read_text().splitlines())
for c in d['capabilities']:
 for a in c['contract'].values():assert set(a)<=ids
print(len(d['facts']),len(d['relations']),len(reads),hashlib.sha256((r/'candidate.json').read_bytes()).hexdigest())
