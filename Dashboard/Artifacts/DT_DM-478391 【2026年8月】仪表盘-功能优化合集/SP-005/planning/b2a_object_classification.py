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
sql="SELECT 'core_dataset_group_outside_demo_ids',COUNT(*) FROM core_dataset_group WHERE id NOT IN (985189053949415424,985189269226262528,985189703189925888);SELECT 'core_chart_view_outside_demo_ids',COUNT(*) FROM core_chart_view WHERE id NOT IN (985192540087128064,985192540103905280,985192540116488192,985192540124876800,985192540141654016,985192540154236928,985192540166819840,985192540175208448,985192540183597056,985192540191985664,985192540208762880,985192540217151488,985192540225540096,985192540242317312,985192540246511616,985192540267483136,985192540288454656,985192540313620480);SELECT 'data_visualization_info_outside_demo_ids',COUNT(*) FROM data_visualization_info WHERE id NOT IN (985192741891870720,985247460244983808);SELECT 'CheckDsStatusJob',COUNT(*) FROM QRTZ_JOB_DETAILS WHERE JOB_CLASS_NAME='io.dataease.job.schedule.CheckDsStatusJob';SELECT 'DeScheduleJob',COUNT(*) FROM QRTZ_JOB_DETAILS WHERE JOB_CLASS_NAME='io.dataease.job.schedule.DeScheduleJob';SELECT 'ExtractDataJob',COUNT(*) FROM QRTZ_JOB_DETAILS WHERE JOB_CLASS_NAME='io.dataease.job.schedule.ExtractDataJob';SELECT 'DeXpackDataSyncTaskScheduleJob',COUNT(*) FROM QRTZ_JOB_DETAILS WHERE JOB_CLASS_NAME='io.dataease.job.schedule.DeXpackDataSyncTaskScheduleJob';SELECT 'DeXpackDataFillingScheduleJob',COUNT(*) FROM QRTZ_JOB_DETAILS WHERE JOB_CLASS_NAME='io.dataease.job.schedule.DeXpackDataFillingScheduleJob';SELECT 'DeXpackScheduleJob',COUNT(*) FROM QRTZ_JOB_DETAILS WHERE JOB_CLASS_NAME='io.dataease.job.schedule.DeXpackScheduleJob';SELECT 'startup_unknown',COUNT(*) FROM core_sys_startup_job WHERE id NOT IN ('chartFilterMerge','chartFilterDynamic','datasetCrossListener');SELECT 'datasource_type_H2',COUNT(*) FROM core_datasource WHERE BINARY type='H2';SELECT 'datasource_type_MySQL',COUNT(*) FROM core_datasource WHERE BINARY type='MySQL';SELECT 'datasource_type_mysql',COUNT(*) FROM core_datasource WHERE BINARY type='mysql';SELECT 'datasource_type_h2',COUNT(*) FROM core_datasource WHERE BINARY type='h2';SELECT 'datasource_type_Excel',COUNT(*) FROM core_datasource WHERE BINARY type='Excel';"
rd,wr=os.pipe();os.write(wr,conf.encode());os.close(wr)
try:
 z=subprocess.run([shutil.which('mysql'),'--defaults-extra-file=/dev/fd/'+str(rd),'--connect-timeout=5','--batch','--skip-column-names','--database=dataeasev3','--execute',sql],pass_fds=(rd,),capture_output=True,text=True,timeout=30)
 out={'executed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'returncode':z.returncode,'counts':z.stdout,'error':z.stderr.replace(pw,'[REDACTED]'),'business_rows_read':False}
 (p/'B2a-object-classification.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False))
finally:os.close(rd)
