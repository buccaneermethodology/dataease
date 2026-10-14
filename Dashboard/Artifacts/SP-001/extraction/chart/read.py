from pathlib import Path
import json,hashlib,sys
out=Path("Dashboard/Artifacts/SP-001/extraction/chart/read-log.json")
logs=json.loads(out.read_text()) if out.exists() else []
for spec in sys.argv[1:]:
 p,a,b=spec.rsplit(":",2); a=int(a);b=int(b); f=Path(p);ls=f.read_text().splitlines(); b=min(b,len(ls))
 print("\nFILE",p)
 print("\n".join(f"{i+1}: {ls[i]}" for i in range(a-1,b)))
 logs.append(dict(path=p,start_line=a,end_line=b,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),method="逐行源码阅读"))
out.write_text(json.dumps(logs,ensure_ascii=False,indent=2)+"\n")
