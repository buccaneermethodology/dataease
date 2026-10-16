from b2c_db import *
sql="SELECT 'fixture_table',COUNT(*) FROM information_schema.tables WHERE table_schema='dataeasev3' AND table_name='s01_sp005_fixture';"
for t in ['core_datasource','core_dataset_group','core_chart_view','data_visualization_info']:
 sql += "SELECT '"+t+"',COUNT(*) FROM "+t+" WHERE "+("title" if t=="core_chart_view" else "name")+" LIKE 'S01\\_SP005\\_%';"
out={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'counts':query(sql)}
(p/'B2c-precheck.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False))
