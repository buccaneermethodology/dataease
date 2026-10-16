from b2c_db import *
q=""
for t in ['core_datasource','core_dataset_group','core_chart_view','data_visualization_info']:
 field='title' if t=='core_chart_view' else 'name'
 q+="SELECT '"+t+"',id,"+field+" FROM "+t+" WHERE "+field+" LIKE 'S01\\_SP005\\_%';"
rows=query(q)
f=p/'B2c-created-objects.json';o=json.loads(f.read_text());o['resources_observed']=rows;o['updated_at']=datetime.datetime.now(datetime.timezone.utc).isoformat();f.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n');print(rows)
