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

def query(sql):
 rd,wr=os.pipe();os.write(wr,conf.encode());os.close(wr)
 try:
  z=subprocess.run([shutil.which('mysql'),'--defaults-extra-file=/dev/fd/'+str(rd),'--connect-timeout=5','--batch','--skip-column-names','--database=dataeasev3'],input=sql,pass_fds=(rd,),capture_output=True,text=True,timeout=60)
  if z.returncode: raise RuntimeError(z.stderr.replace(pw,'[REDACTED]'))
  return z.stdout
 finally: os.close(rd)
