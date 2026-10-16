from b2c_db import *
assert query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='dataeasev3' AND table_name='s01_sp005_fixture';").strip()=='0', 'table already exists; stop'
marker='S01_SP005_20261015_owned_fixture'
query("CREATE TABLE s01_sp005_fixture (id BIGINT PRIMARY KEY,org_marker VARCHAR(20),region VARCHAR(30),category VARCHAR(10),enum_text VARCHAR(20),nullable_text VARCHAR(20),event_date DATE,qty INT,amount DECIMAL(18,4),denominator INT) COMMENT='"+marker+"';")
ledger={'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'table':'s01_sp005_fixture','marker':marker,'resources':[],'cleanup':'pending'}
(p/'B2c-repair-created-objects.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
rows=[]
for i in range(1,6):
 region=['华东','华东','华南','华北','华南'][i-1] if i<=5 else '枚举区'
 cat=['A','B','A','C','A'][i-1] if i<=5 else ['A','B','C'][i%3]
 amt=[100,200,300,50,0][i-1] if i<=5 else i
 nullable='NULL' if i%3==0 else ("''" if i%3==1 else "'DUP'")
 rows.append(f"({i},'ORG_{'A' if i%2==0 else 'B'}','{region}','{cat}','E{i:05d}',{nullable},'2026-08-15',{i%10},{amt},{i%7})")
query('SET NAMES utf8mb4; START TRANSACTION; INSERT INTO s01_sp005_fixture VALUES '+','.join(rows)+'; COMMIT;')
out=query("SELECT COUNT(*),SUM(amount),COUNT(DISTINCT enum_text),SUM(nullable_text IS NULL),SUM(nullable_text='') FROM s01_sp005_fixture; SELECT GROUP_CONCAT(id ORDER BY id) FROM s01_sp005_fixture WHERE id<=5 AND ((region='华东' AND amount>=150) OR (region='华南' AND category='A'));")
(p/'B2c-repair-seed-result.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'aggregate':out},ensure_ascii=False,indent=2)+'\n');print(out)
