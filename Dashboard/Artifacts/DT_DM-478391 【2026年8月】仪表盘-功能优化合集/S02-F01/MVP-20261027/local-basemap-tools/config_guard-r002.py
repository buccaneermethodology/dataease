"""Only 14 originally absent local fixture keys; no implicit restore or secret output."""
from pathlib import Path
import argparse, hashlib, json, os, secrets, subprocess, tempfile, sys, selectors, time
class GuardError(Exception):pass
def check(ok,message):
 if not ok:raise GuardError(message)
FIELDS = ['serviceType','tileUrl','styleUrl','tileScheme','tileSize','tileMinZoom','tileMaxZoom','tileAttribution','styleAttribution','tileAttributionEnabled','styleAttributionEnabled','key','securityCode']
KEYS = sorted(['map.mapType']+['customTile.map.'+f for f in FIELDS])
VALUES = ['vector','','/s02-test-basemap/style-r001.json','xyz','256','0','18','','S02 本地测试网格，仅用于功能验证','true','true','','']
EXPECTED = {'customTile.map.'+f:v for f,v in zip(FIELDS,VALUES)}|{'map.mapType':'customTile'}
ARGS = ['/opt/homebrew/opt/mysql@8.4/bin/mysql','--defaults-extra-file=/Users/xiaomei/opt/dataease3.0/config/mysql-root.cnf','--batch','--skip-column-names','--raw','--unbuffered','--default-character-set=utf8mb4','dataeasev3']
WHERE = 'pkey IN ('+','.join("'"+k+"'" for k in KEYS)+')'
SELECT = "SELECT JSON_OBJECT('id',CAST(id AS CHAR),'pkey',pkey,'pval',pval,'type',type,'sort',sort) FROM core_sys_setting WHERE "+WHERE+' ORDER BY pkey,id'
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def save(f,d):
 fd=os.open(f,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
 with os.fdopen(fd,'w') as o:json.dump(d,o,ensure_ascii=False,sort_keys=True,separators=(',',':'));o.flush();os.fsync(o.fileno())
def read(f):
 check(f.is_file() and (not f.is_symlink()) and (f.stat().st_mode & 511 == 384),'private file required')
 return json.loads(f.read_bytes())
class DB:
 def __init__(self):
  self.err=tempfile.TemporaryFile();self.p=subprocess.Popen(ARGS,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=self.err,text=True,bufsize=1)
 def q(self,sql):
  tag='s02_'+secrets.token_hex(12);self.p.stdin.write(sql+";SELECT '"+tag+"';\n");self.p.stdin.flush();rows=[]
  deadline=time.monotonic()+10;buffer=b'';selector=selectors.DefaultSelector();selector.register(self.p.stdout,selectors.EVENT_READ)
  try:
   while True:
    remaining=deadline-time.monotonic()
    if remaining<=0 or not selector.select(remaining):
     raise GuardError('COMMIT_OUTCOME_UNKNOWN_NO_RETRY' if sql.strip().upper()=='COMMIT' else 'DB_COMMAND_DEADLINE_EXCEEDED')
    chunk=os.read(self.p.stdout.fileno(),65536)
    if not chunk:raise GuardError('DB_COMMAND_FAILED_REDACTED')
    buffer+=chunk
    check(len(buffer)<=2*1024*1024,'DB_OUTPUT_BOUND_EXCEEDED')
    while b'\n' in buffer:
     line,buffer=buffer.split(b'\n',1);text=line.decode('utf-8')
     if text==tag:return rows
     rows.append(json.loads(text))
  finally:selector.close()
 def rows(self,lock=False):
  r=self.q(SELECT+(' FOR UPDATE' if lock else ''));check(len({x['pkey'] for x in r}) == len(r),'duplicate setting keys');return r
 def close(self):
  # EOF closes the session; an uncommitted transaction rolls back server-side.
  # A timed-out COMMIT has unknown outcome and must never be retried.
  try:
   if self.p.stdin and not self.p.stdin.closed:self.p.stdin.close()
   try:self.p.wait(timeout=2)
   except subprocess.TimeoutExpired:
    self.p.terminate()
    try:self.p.wait(timeout=2)
    except subprocess.TimeoutExpired:self.p.kill();self.p.wait(timeout=2)
  finally:self.err.close()
def main():
 check(not sys.flags.optimize,"OPTIMIZATION_MODE_REFUSED_BEFORE_DB")
 a=argparse.ArgumentParser();a.add_argument('action',choices=['backup','check-before','capture-after','dry-run','restore']);a.add_argument('--private-dir',type=Path);a.add_argument('--before-sha');a.add_argument('--after-sha');opt=a.parse_args();db=DB()
 try:
  identity=db.q("SELECT JSON_OBJECT('database',DATABASE(),'port',@@port,'host',@@hostname)")[0];check(identity['database'] == 'dataeasev3' and identity['port'] == 3307,'wrong instance')
  if opt.action=='backup':
   rows=db.rows();check(rows == [],'NONEMPTY_BASELINE_REQUIRES_NEW_REVIEW')
   d=Path(tempfile.mkdtemp(prefix='s02-basemap-private-',dir='/private/tmp'));os.chmod(d,0o700);save(d/'before.json',{'identity':identity,'keys':KEYS,'rows':rows})
   print(json.dumps({'private_dir':str(d),'before_sha256':sha(d/'before.json'),'key_count':14,'present_count':0,'dir_mode':'0700','file_mode':'0600'}));return
  d=opt.private_dir;check(d and d.is_dir() and (not d.is_symlink()) and (d.stat().st_mode & 511 == 448),'private dir required');check(sha(d / 'before.json') == opt.before_sha,'before digest mismatch')
  before=read(d/'before.json');check(before == {'identity': identity, 'keys': KEYS, 'rows': []},'unsupported original state')
  if opt.action=='check-before':
   check(db.rows() == [],'configuration drift before save');print(json.dumps({'before_matches':True,'present_count':0}));return
  if opt.action=='capture-after':
   rows=db.rows();check({r['pkey']: r['pval'] for r in rows} == EXPECTED and len(rows) == 14,'UNEXPECTED_AFTER_REDACTED');check(all((r['type'] == 'text' and r['sort'] == 1 for r in rows)),'unexpected metadata')
   save(d/'after.json',{'identity':identity,'keys':KEYS,'rows':rows});print(json.dumps({'private_dir':str(d),'after_sha256':sha(d/'after.json'),'present_count':14,'payload_matches':True}));return
  check(sha(d / 'after.json') == opt.after_sha,'after digest mismatch');after=read(d/'after.json');check(after['identity'] == identity and after['keys'] == KEYS,'after identity mismatch');check({r['pkey']: r['pval'] for r in after['rows']} == EXPECTED and len(after['rows']) == 14,'after payload mismatch')
  db.q('SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE');db.q('START TRANSACTION');check(db.rows(lock=True) == after['rows'],'after drift; restoration refused')
  ids=[int(r['id']) for r in after['rows']];check(len(set(ids)) == 14,'GUARD_FAILED')
  db.q('DELETE FROM core_sys_setting WHERE '+WHERE+' AND id IN ('+','.join(map(str,ids))+')');check(db.rows() == [],'restore postcondition mismatch');db.q('COMMIT' if opt.action=='restore' else 'ROLLBACK');check(db.rows() == ([] if opt.action == 'restore' else after['rows']),'independent readback mismatch')
  print(json.dumps({'action':opt.action,'guard_matches':True,'transaction_restore_matches_before':True,'committed':opt.action=='restore','independent_readback_matches':True,'row_scope':14}))
 finally:db.close()
if __name__=='__main__':
 try:main()
 except Exception as e:
  print(json.dumps({'failed':True,'reason':str(e) if isinstance(e,GuardError) else type(e).__name__}));raise SystemExit(1)
