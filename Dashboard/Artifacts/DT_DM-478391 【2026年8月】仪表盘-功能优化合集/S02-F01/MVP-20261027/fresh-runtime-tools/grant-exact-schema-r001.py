from pathlib import Path
import json,subprocess,hashlib,datetime,re
r=Path('/private/tmp/s02-symbolic-runtime-r001');p=next(Path('Dashboard/Artifacts').glob('DT_DM-478391*/S02-F01'));e=p/'MVP-20261027/evidence'
mysql='/opt/homebrew/opt/mysql@8.4/bin/mysql';cnf='/Users/xiaomei/opt/dataease3.0/config/mysql-root.cnf'
def sql(s):
 a=subprocess.run([mysql,'--defaults-extra-file='+cnf,'--batch','--skip-column-names'],input=s,capture_output=True,text=True)
 if a.returncode:raise RuntimeError('SQL_FAILED_NO_PUBLIC_STDERR')
 return a.stdout.strip()
def require(b,msg):
 if not b:raise RuntimeError(msg)
own=json.loads((r/'ownership.json').read_text());require(own.get('schema_created') is True and own.get('target_schema')=='s02_symbolic_20261029' and own.get('root')==str(r),'OWNERSHIP')
require(sql('SELECT @@partial_revokes')=='0','GRANT_PATTERN_MODE_DRIFT')
require(sql("SELECT User,Host FROM mysql.user WHERE User='dataease_dev'")=='dataease_dev\t127.0.0.1','ACCOUNT_DRIFT')
require(sql("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='s02_symbolic_20261029'")=='72','SCHEMA_DRIFT')
before=sql("SELECT GRANTEE,TABLE_SCHEMA,PRIVILEGE_TYPE,IS_GRANTABLE FROM information_schema.SCHEMA_PRIVILEGES WHERE GRANTEE=\"'dataease_dev'@'127.0.0.1'\" ORDER BY TABLE_SCHEMA,PRIVILEGE_TYPE")
require('s02' not in before,'EXISTING_TARGET_GRANT_REFUSED')
(r/'grants-before-private.txt').write_text(before)
try:sql("GRANT ALL PRIVILEGES ON `s02\\_symbolic\\_20261029`.* TO 'dataease_dev'@'127.0.0.1'")
except BaseException:
 (r/'grant-outcome-unknown').write_text('READ_GRANTS_BEFORE_ANY_RETRY');raise
rows=sql("SELECT TABLE_SCHEMA,PRIVILEGE_TYPE,IS_GRANTABLE FROM information_schema.SCHEMA_PRIVILEGES WHERE GRANTEE=\"'dataease_dev'@'127.0.0.1'\" ORDER BY TABLE_SCHEMA,PRIVILEGE_TYPE").splitlines()
target=[x.split('\t') for x in rows if x.split('\t')[0]=='s02\\_symbolic\\_20261029']
require(len(target)>0 and all(x[2]=='NO' for x in target),'GRANT_READBACK')
after_other='\n'.join("'dataease_dev'@'127.0.0.1'\t"+x for x in rows if x.split('\t')[0]!='s02\\_symbolic\\_20261029')
require(after_other==before,'OTHER_GRANTS_CHANGED')
out=e/'SymbolicFreshSchemaGrant-r001.json';require(not out.exists(),'EVIDENCE_EXISTS')
out.write_text(json.dumps({'observed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'schema':'s02_symbolic_20261029','grant_schema_pattern':'s02\\_symbolic\\_20261029','existing_account_only':True,'privileges':[x[1] for x in target],'grantable':False,'other_schema_grants_unchanged':True,'password_changed':False,'commit_state':'confirmed_by_readback','actual_app_connection':'NEXT_REQUIRED','claim':'仅新测试库授权；非真实产品多用户权限验收'},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'granted':True,'scope':'exact_new_schema','grantable':False}))
