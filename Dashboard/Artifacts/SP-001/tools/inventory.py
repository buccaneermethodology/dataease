"""SP-001 来源盘点：只读产品；仅写本批证据，不代表语义阅读。"""
from pathlib import Path
import os,json,hashlib,subprocess,datetime,collections
ROOT=Path(__file__).resolve().parents[4]
OUT=ROOT/'Dashboard/Artifacts/SP-001/evidence'
SKIP={'.git','node_modules','target','dist','.idea','.cache','__pycache__'}
TEXT={'.java','.ts','.vue','.js','.json','.xml','.md','.yaml','.yml','.sql','.py','.sh','.html','.properties','.txt','.scss','.css','.conf','.toml','.mjs','.cjs','.less','.ftl','.bat','.ps1','.svg'}
def main():
 tracked=set(subprocess.check_output(['git','ls-files','-z'],cwd=ROOT).decode().split('\0'))
 rows=[];excluded=[]
 for base,dirs,files in os.walk(ROOT,followlinks=False):
  rel=Path(base).relative_to(ROOT)
  for d in list(dirs):
   p=rel/d
   if d in SKIP or p.parts[0] in {'Dashboard','kb','.codex'}:
    excluded.append({'path':p.as_posix(),'reason':'执行/治理/本批输出，不作产品来源' if p.parts[0] in {'Dashboard','kb','.codex'} else 'VCS/依赖/生成物'});dirs.remove(d)
  for name in sorted(files):
   p=Path(base)/name;q=p.relative_to(ROOT).as_posix();suffix=p.suffix.lower()
   sensitive=name.startswith('.env') or name in {'dbhub.toml','.mcp.json'} or (suffix in {'.json','.yaml','.yml','.toml','.properties','.pem','.key'} and any(t in name.lower() for t in ('secret','credential','privatekey')))
   reference=q.lower().startswith('docs/dashboard/')
   text=suffix in TEXT or name in {'Dockerfile','LICENSE','THIRD-PARTY-NOTICES'}
   asset=q.startswith(('mapFiles/','drivers/','staticResource/')) or suffix in {'.svg','.png','.jpg','.jpeg','.gif','.woff','.woff2','.ttf','.ico'}
   kind='sensitive_excluded' if sensitive else 'reference_only' if reference else 'asset_or_binary' if asset else 'source_text' if text else 'asset_or_binary'
   row={'path':q,'tracked':q in tracked,'kind':kind,'size':p.lstat().st_size,'content_review':'not_read','sha256':None}
   if p.is_symlink():row['kind']='symlink_not_followed'
   elif not sensitive: row['sha256']=hashlib.sha256(p.read_bytes()).hexdigest()
   rows.append(row)
 # ignore status in batch; no blind rg ignore assumptions
 raw=subprocess.run(['git','check-ignore','--stdin'],input='\n'.join(x['path'] for x in rows)+'\n',capture_output=True,text=True,cwd=ROOT).stdout
 ignored=set(raw.splitlines())
 for x in rows:x['ignored']=x['path'] in ignored
 result={'captured_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'meaning':'物理盘点，不是语义覆盖；不读取敏感文件正文','files':rows,'excluded_directories':excluded,'inaccessible':[{'path':'de-xpack','reason':'子模块未检出；仅主仓库公共接口范围'}],'counts':dict(collections.Counter(x['kind'] for x in rows))}
 OUT.mkdir(parents=True,exist_ok=True);(OUT/'source-inventory-v2.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'files':len(rows),'counts':result['counts'],'excluded_directories':len(excluded)},ensure_ascii=False))
if __name__=='__main__': main()
