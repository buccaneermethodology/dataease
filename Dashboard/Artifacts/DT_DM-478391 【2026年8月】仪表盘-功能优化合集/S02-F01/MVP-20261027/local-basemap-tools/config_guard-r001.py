"""Only 14 originally absent local fixture keys; no implicit restore or secret output."""
from pathlib import Path
import argparse, hashlib, json, os, secrets, subprocess, tempfile
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
 assert f.is_file() and not f.is_symlink() and f.stat().st_mode&0o777==0o600,'private file required'
 return json.loads(f.read_bytes())
class DB:
 def __init__(self):
  self.err=tempfile.TemporaryFile();self.p=subprocess.Popen(ARGS,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=self.err,text=True,bufsize=1)
 def q(self,sql):
  tag='s02_'+secrets.token_hex(12);self.p.stdin.write(sql+";SELECT '"+tag+"';\n");self.p.stdin.flush();rows=[]
  while True:
   line=self.p.stdout.readline()
   if not line:raise RuntimeError('DB_COMMAND_FAILED_REDACTED')
   line=line.rstrip('\n')
   if line==tag:return rows
   rows.append(json.loads(line))
 def rows(self,lock=False):
  r=self.q(SELECT+(' FOR UPDATE' if lock else ''));assert len({x['pkey'] for x in r})==len(r),'duplicate setting keys';return r
 def close(self):
  if self.p.poll() is None:
   try:self.q('ROLLBACK')
   finally:self.p.stdin.close();self.p.wait(timeout=10)
  self.err.close()
def main():
 a=argparse.ArgumentParser();a.add_argument('action',choices=['backup','check-before','capture-after','dry-run','restore']);a.add_argument('--private-dir',type=Path);a.add_argument('--before-sha');a.add_argument('--after-sha');opt=a.parse_args();db=DB()
 try:
  identity=db.q("SELECT JSON_OBJECT('database',DATABASE(),'port',@@port,'host',@@hostname)")[0];assert identity['database']=='dataeasev3' and identity['port']==3307,'wrong instance'
  if opt.action=='backup':
   rows=db.rows();assert rows==[],'NONEMPTY_BASELINE_REQUIRES_NEW_REVIEW'
   d=Path(tempfile.mkdtemp(prefix='s02-basemap-private-',dir='/private/tmp'));os.chmod(d,0o700);save(d/'before.json',{'identity':identity,'keys':KEYS,'rows':rows})
   print(json.dumps({'private_dir':str(d),'before_sha256':sha(d/'before.json'),'key_count':14,'present_count':0,'dir_mode':'0700','file_mode':'0600'}));return
  d=opt.private_dir;assert d and d.is_dir() and not d.is_symlink() and d.stat().st_mode&0o777==0o700,'private dir required';assert sha(d/'before.json')==opt.before_sha,'before digest mismatch'
  before=read(d/'before.json');assert before=={'identity':identity,'keys':KEYS,'rows':[]},'unsupported original state'
  if opt.action=='check-before':
   assert db.rows()==[],'configuration drift before save';print(json.dumps({'before_matches':True,'present_count':0}));return
  if opt.action=='capture-after':
   rows=db.rows();assert {r['pkey']:r['pval'] for r in rows}==EXPECTED and len(rows)==14,'UNEXPECTED_AFTER_REDACTED';assert all(r['type']=='text' and r['sort']==1 for r in rows),'unexpected metadata'
   save(d/'after.json',{'identity':identity,'keys':KEYS,'rows':rows});print(json.dumps({'private_dir':str(d),'after_sha256':sha(d/'after.json'),'present_count':14,'payload_matches':True}));return
  assert sha(d/'after.json')==opt.after_sha,'after digest mismatch';after=read(d/'after.json');assert after['identity']==identity and after['keys']==KEYS,'after identity mismatch';assert {r['pkey']:r['pval'] for r in after['rows']}==EXPECTED and len(after['rows'])==14,'after payload mismatch'
  db.q('SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE');db.q('START TRANSACTION');assert db.rows(lock=True)==after['rows'],'after drift; restoration refused'
  ids=[int(r['id']) for r in after['rows']];assert len(set(ids))==14
  db.q('DELETE FROM core_sys_setting WHERE '+WHERE+' AND id IN ('+','.join(map(str,ids))+')');assert db.rows()==[],'restore postcondition mismatch';db.q('COMMIT' if opt.action=='restore' else 'ROLLBACK');assert db.rows()==([] if opt.action=='restore' else after['rows']),'independent readback mismatch'
  print(json.dumps({'action':opt.action,'guard_matches':True,'transaction_restore_matches_before':True,'committed':opt.action=='restore','independent_readback_matches':True,'row_scope':14}))
 finally:db.close()
if __name__=='__main__':
 try:main()
 except Exception as e:
  print(json.dumps({'failed':True,'reason':str(e) if isinstance(e,AssertionError) else type(e).__name__}));raise SystemExit(1)
