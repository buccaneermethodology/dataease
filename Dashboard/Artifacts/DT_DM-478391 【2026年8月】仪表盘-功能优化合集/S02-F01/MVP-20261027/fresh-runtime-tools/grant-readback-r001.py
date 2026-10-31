from pathlib import Path
import subprocess,json,datetime
r=Path('/private/tmp/s02-symbolic-runtime-r001');p=next(Path('Dashboard/Artifacts').glob('DT_DM-478391*/S02-F01'));e=p/'MVP-20261027/evidence';mysql='/opt/homebrew/opt/mysql@8.4/bin/mysql'
def query(cnf,s):
 x=subprocess.run([mysql,'--defaults-extra-file='+str(cnf),'--batch','--raw','--skip-column-names','-e',s],capture_output=True,text=True)
 if x.returncode:raise RuntimeError('READBACK_FAILED_PRIVATE')
 return x.stdout.strip()
s=query('/Users/xiaomei/opt/dataease3.0/config/mysql-root.cnf',"SELECT GRANTEE,TABLE_SCHEMA,PRIVILEGE_TYPE,IS_GRANTABLE FROM information_schema.SCHEMA_PRIVILEGES WHERE GRANTEE=\"'dataease_dev'@'127.0.0.1'\" ORDER BY TABLE_SCHEMA,PRIVILEGE_TYPE")
rows=[line.split('\t') for line in s.splitlines()];target=[x for x in rows if x[1]=='s02\\_symbolic\\_20261029'];other='\n'.join('\t'.join(x).replace('\\','\\\\') for x in rows if x[1]!='s02\\_symbolic\\_20261029')
if len(target)!=18 or any(x[3]!='NO' for x in target):raise RuntimeError('TARGET_GRANT_MISMATCH')
if other!=(r/'grants-before-private.txt').read_text():raise RuntimeError('OTHER_GRANT_DRIFT')
identity=query(r/'app-identity.cnf','USE s02_symbolic_20261029; SELECT DATABASE(),@@port,CURRENT_USER();')
if identity!='s02_symbolic_20261029\t3307\tdataease_dev@127.0.0.1':raise RuntimeError('APP_IDENTITY_REFUSED')
f=e/'SymbolicFreshSchemaGrant-r001.json'
if f.exists():raise RuntimeError('exists')
f.write_text(json.dumps({'observed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'schema':'s02_symbolic_20261029','grant_schema_pattern':'s02\\_symbolic\\_20261029','existing_account_only':True,'privileges':[x[2] for x in target],'grantable':False,'other_schema_grants_unchanged':True,'password_changed':False,'commit_state':'confirmed_by_independent_raw_readback','actual_app_connection':{'database':'s02_symbolic_20261029','port':3307,'current_user':'dataease_dev@127.0.0.1'},'initial_failure':'post-GRANT checker omitted --raw; CLI escaped backslash doubled; grant was not repeated','claim':'新库授权及实际连库成功，不代表真实产品多用户权限'},ensure_ascii=False,indent=2)+'\n')
print('GRANT_READBACK_CONFIRMED_APP_CONNECTION_PASS')
