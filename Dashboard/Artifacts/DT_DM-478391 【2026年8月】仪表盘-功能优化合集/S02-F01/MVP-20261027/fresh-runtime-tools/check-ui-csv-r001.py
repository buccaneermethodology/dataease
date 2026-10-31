from pathlib import Path
import json,csv,hashlib,datetime,collections
p=next(Path('Dashboard/Artifacts').glob('DT_DM-478391*/S02-F01'));m=p/'MVP-20261027';e=m/'evidence';f=e/'SymbolicFreshUi-wire-r001.json';v=json.loads(f.read_text());csvf=m/'runtime-fixtures/TeaMaterialExtended-r001.csv';rows=list(csv.DictReader(csvf.open(encoding='utf-8-sig')));byid={r['id']:r for r in rows};shops={'果元店','南都店','香橙店','乐园店','红叶店','水围店'};checks=[]
for index,x in enumerate(v['wire']):
 if 'getData' not in x['upstream']:continue
 req=json.loads(x['request']);res=json.loads(x['body']);
 if req['type']!='symbolic-map':continue
 th=req['customFilter']['items'][0]['value'];d=res['data']['data'];fields=d['sourceFields']+d['detailFields']+d['fields'];mapping={a['originName']:a['dataeaseName'] for a in fields};eligible=[r for r in rows if float(r['amount'])>float(th) and r['shop'] in shops];groups=collections.defaultdict(float)
 for r in eligible:groups[(float(r['longitude']),float(r['latitude']))]+=float(r['amount'])
 result=[]
 for g in d['tableRow']:
  key=(float(g[mapping['longitude']]),float(g[mapping['latitude']]));details=g['details'];assert len(details)==1;rep=details[0];rid=str(rep[mapping['id']]);r=byid[rid];assert r in eligible;assert (float(r['longitude']),float(r['latitude']))==key;assert rep[mapping['shop']]==r['shop'];assert float(g[mapping['amount']])==groups[key];assert float(rep[mapping['amount']])==groups[key];result.append({'coordinate':key,'representative_id':rid,'shop':r['shop'],'aggregate_amount':groups[key]})
 assert len(result)==len(groups);checks.append({'wire_index':index,'threshold':th,'http_status':x['status'],'business_code':res['code'],'representatives':result,'all_checks':True})
save=next(x for x in v['wire'] if 'updateCanvas' in x['upstream']);saved=json.loads(save['request'])['canvasViewInfo'];load=[x for x in v['wire'] if 'findById' in x['upstream']][-1];loaded=json.loads(load['body'])['data']['canvasViewInfo'];loaded=json.loads(loaded) if isinstance(loaded,str) else loaded
persist={i:saved[i]['customFilter']==loaded[i]['customFilter'] for i in ['7520741153101058048','7520752064427724800']};assert all(persist.values());hard=next(x for x in v['marks'] if x['name']=='hard_reopened500');assert hard['diagnostic']['clipboard'] is None
out={'observed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'wire_ref':{'path':str(f),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()},'csv_sha256':hashlib.sha256(csvf.read_bytes()).hexdigest(),'backend_pid':44421,'backend_jar_sha256':'f653667d94fe3a20e9acdf2fc1bf128ef5b58c9db3181aec29ba2c363fd840e4','symbolic_query_checks':checks,'persisted_full_trees_equal':persist,'hard_reload_clipboard_empty':True,'page_errors':v['pageErrors'],'claim':'新源码独立clone真实HTTP局部运行观察；非独立Validation、非权限或完整Goal验收','limitations':['metadata探针为同配置连接而非运行中Spring Bean getter','首次加载路由glob错误已保留，修正后正常登录','hash-only导航保留clipboard，不计保存重开；另有hard reload及真实findById/getData','本次无pageerror不关闭历史ubo残余','图片资产未复制，不验收图片；权限仍standalone+DEV桩','原38义务和49类型完整验收未关闭']}
(e/'SymbolicFreshUi-r001.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print({'symbolic_queries':len(checks),'all_csv_checks':True,'persisted':persist,'hard_reload_clipboard_empty':True})
