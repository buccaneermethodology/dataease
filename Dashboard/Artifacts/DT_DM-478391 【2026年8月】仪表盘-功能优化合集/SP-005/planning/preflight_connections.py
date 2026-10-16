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
out={'executed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'A阶段已授权本机只读预检','mysql':{},'redis':{}}
url=vals.get('spring.datasource.url',''); user=vals.get('spring.datasource.username'); pw=vals.get('spring.datasource.password')
m=re.match(r'^jdbc:(mysql|mariadb)://([^/:?]+):(\d+)/([^?]+)',url)
if m and m[2] in ['127.0.0.1','localhost'] and m[3]=='3307' and m[4]=='dataeasev3' and user=='dataease_dev' and pw is not None and '${' not in pw:
 out['mysql']={'target':'127.0.0.1:3307/dataeasev3','driver_scheme':m[1],'user':'dataease_dev'}
 cli=shutil.which('mysql')
 if cli:
  # anonymous pipe: no credentials on disk or command line
  quote=lambda v: '"'+v.replace(chr(92),chr(92)*2).replace('"',chr(92)+'"').replace(chr(10),chr(92)+'n')+'"'
  conf='[client]\nhost=127.0.0.1\nport=3307\nuser='+quote(user)+'\npassword='+quote(pw)+'\nprotocol=TCP\n'
  rd,wr=os.pipe();os.write(wr,conf.encode());os.close(wr)
  try:
   z=subprocess.run([cli,'--defaults-extra-file=/dev/fd/'+str(rd),'--connect-timeout=5','--batch','--skip-column-names','--database=dataeasev3','--execute',"SELECT 1; SELECT DATABASE(); SELECT VERSION(); SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY TABLE_NAME;"],pass_fds=(rd,),capture_output=True,text=True,timeout=15)
   clean=lambda s:s.replace(pw,'[REDACTED]') if pw else s
   out['mysql'].update(returncode=z.returncode,result=clean(z.stdout),error=clean(z.stderr))
  except Exception as e:out['mysql']['error_type']=type(e).__name__
  finally:os.close(rd)
 else:out['mysql']['status']='client_unavailable'
else:out['mysql']['status']='allowlist_not_matched_no_connection'
host=vals.get('spring.data.redis.host');port=vals.get('spring.data.redis.port');rp=vals.get('spring.data.redis.password')
if host in ['localhost','127.0.0.1'] and port=='6379' and (rp is None or '${' not in rp):
 try:
  with socket.create_connection(('127.0.0.1',6379),timeout=5) as sock:
   def cmd(*args):
    data=b'*'+str(len(args)).encode()+b'\r\n'+b''.join(b'$'+str(len(a.encode())).encode()+b'\r\n'+a.encode()+b'\r\n' for a in args);sock.sendall(data);return sock.recv(8192).decode(errors='replace')
   auth=cmd('AUTH',rp) if rp else 'not_configured';pong=cmd('PING') if not auth.startswith('-') else 'not_attempted';info=cmd('INFO','server') if pong.startswith('+PONG') else '';ver=re.search(r'redis_version:([^\r\n]+)',info)
   out['redis']={'target':'127.0.0.1:6379','auth_ok':auth.startswith('+OK') or auth=='not_configured','ping':pong.strip(),'version':ver[1] if ver else None,'dedicated_isolation':'not_proven'}
 except Exception as e:out['redis']={'error_type':type(e).__name__}
else:out['redis']['status']='allowlist_not_matched_no_connection'
(p/'PreflightA-connections-r002.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False,indent=2))
