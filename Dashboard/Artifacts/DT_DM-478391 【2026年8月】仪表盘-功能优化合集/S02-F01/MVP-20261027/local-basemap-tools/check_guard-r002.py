from pathlib import Path
import contextlib, io, json, os, subprocess, sys, tempfile
p=next(Path('Dashboard/Artifacts').glob('DT_DM-478391*/S02-F01'));m=p/'MVP-20261027';tool=m/'local-basemap-tools/config_guard-r002.py';ns={'__name__':'guard_test'};exec(compile(tool.read_text(),str(tool),'exec'),ns)
root=Path(tempfile.mkdtemp(prefix='s02-guard-synthetic-',dir='/private/tmp'));os.chmod(root,0o700)
identity={'database':'dataeasev3','port':3307,'host':'synthetic-test'};keys=ns['KEYS'];rows=[{'id':str(i+1),'pkey':k,'pval':ns['EXPECTED'][k],'type':'text','sort':1} for i,k in enumerate(keys)]
ns['save'](root/'before.json',{'identity':identity,'keys':keys,'rows':[]});ns['save'](root/'after.json',{'identity':identity,'keys':keys,'rows':rows});bs=ns['sha'](root/'before.json');afs=ns['sha'](root/'after.json');results=[]
for optimize in [0,1,2]:
 for case in ['dry-run','restore','bad_identity','bad_before_digest','bad_after_digest','row_drift']:
  ns={'__name__':'guard_test'};exec(compile(tool.read_text(),str(tool),'exec',optimize=optimize),ns);calls=[]
  class FakeDB:
   def __init__(self):self.current=[dict(x) for x in rows]
   def q(self,sql):
    calls.append(sql.split()[0])
    if 'JSON_OBJECT' in sql:return [identity|({'port':9999} if case=='bad_identity' else {})]
    if sql.startswith('DELETE'):self.current=[]
    if sql=='ROLLBACK':self.current=[dict(x) for x in rows]
    return []
   def rows(self,lock=False):
    calls.append('LOCK_READ' if lock else 'READ')
    return self.current[:-1] if case=='row_drift' and lock else self.current
   def close(self):calls.append('CLOSE')
  ns['DB']=FakeDB;args=['guard',case if case in ['dry-run','restore'] else 'dry-run','--private-dir',str(root),'--before-sha',('0'*64 if case=='bad_before_digest' else bs),'--after-sha',('0'*64 if case=='bad_after_digest' else afs)];old=sys.argv;sys.argv=args
  try:
   with contextlib.redirect_stdout(io.StringIO()):ns['main']()
   accepted=True
  except ns['GuardError']:accepted=False
  finally:sys.argv=old
  expected=case in ['dry-run','restore'];ok=accepted==expected and (('DELETE' in calls)==expected) and (not expected or calls.index('LOCK_READ')<calls.index('DELETE'))
  if case=='dry-run':ok=ok and 'ROLLBACK' in calls and 'COMMIT' not in calls
  if case=='restore':ok=ok and 'COMMIT' in calls
  results.append({'case':case,'compiled_optimize':optimize,'pass':ok,'accepted':accepted,'delete':('DELETE' in calls),'lock_read':('LOCK_READ' in calls)})
for args,env in [([sys.executable,'-O',str(tool),'backup'],None),([sys.executable,str(tool),'backup'],dict(os.environ,PYTHONOPTIMIZE='1'))]:
 r=subprocess.run(args,env=env,capture_output=True,text=True,timeout=5);d=json.loads(r.stdout);results.append({'case':'interpreter_optimization_refused_before_DB','mode':'-O' if '-O' in args else 'PYTHONOPTIMIZE','pass':r.returncode==1 and d['reason']=='OPTIMIZATION_MODE_REFUSED_BEFORE_DB'})
print(json.dumps({'fake_only':True,'real_db_writes':False,'cases':results,'pass':sum(x['pass'] for x in results),'fail':sum(not x['pass'] for x in results)},ensure_ascii=False,indent=2));sys.exit(0 if all(x['pass'] for x in results) else 1)
