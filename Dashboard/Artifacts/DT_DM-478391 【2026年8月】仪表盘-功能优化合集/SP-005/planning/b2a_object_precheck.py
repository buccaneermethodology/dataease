from pathlib import Path
import re,json,os,subprocess,shutil,socket,datetime
p=Path(__file__).resolve().parent.parent
cfg=Path('/Users/xiaomei/opt/dataease3.0/config/application.yml')
stack=[]; vals={}
for line in cfg.read_text().splitlines():
 if not line.strip() or line.lstrip().startswith('#'): continue
 m=re.match(r'^(\s*)([\w.-]+):(?:\s+(.*))?$',line)
 if not m: continue
 ind=len(m[1]); key=m[2]; v=m[3]
 while stack and stack[-1][0]>=ind: stack.pop()
 path='.'.join([x[1] for x in stack]+[key])
 if v is None or not v.strip(): stack.append((ind,key)); continue
 v=v.strip()
 if v[:1] in ['"',"'"]:
  if v[:1]!=v[-1:]: continue
  v=v[1:-1]
 else: v=v.split(' #',1)[0]
 vals[path]=v

url=vals.get('spring.datasource.url','');user=vals.get('spring.datasource.username');pw=vals.get('spring.datasource.password')
assert re.match(r'^jdbc:(mysql|mariadb)://(127[.]0[.]0[.]1|localhost):3307/dataeasev3(?:[?]|$)',url) and user=='dataease_dev' and pw is not None
quote=lambda v: '"'+v.replace(chr(92),chr(92)*2).replace('"',chr(92)+'"').replace(chr(10),chr(92)+'n')+'"'
conf='[client]\nhost=127.0.0.1\nport=3307\nuser='+quote(user)+'\npassword='+quote(pw)+'\nprotocol=TCP\n'
tables=['core_datasource','core_dataset_group','core_chart_view','data_visualization_info','core_datasource_task','core_export_task','core_sys_startup_job','QRTZ_JOB_DETAILS','QRTZ_TRIGGERS','QRTZ_FIRED_TRIGGERS']
sql=';'.join("SELECT '"+t+"', COUNT(*) FROM `"+t+"`" for t in tables)+';'
rd,wr=os.pipe();os.write(wr,conf.encode());os.close(wr)
try:
 z=subprocess.run([shutil.which('mysql'),'--defaults-extra-file=/dev/fd/'+str(rd),'--connect-timeout=5','--batch','--skip-column-names','--database=dataeasev3','--execute',sql],pass_fds=(rd,),capture_output=True,text=True,timeout=30)
 out={'executed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'returncode':z.returncode,'counts':z.stdout,'error':z.stderr.replace(pw,'[REDACTED]'),'business_rows_read':False}
 (p/'B2a-object-precheck.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False))
finally:os.close(rd)
