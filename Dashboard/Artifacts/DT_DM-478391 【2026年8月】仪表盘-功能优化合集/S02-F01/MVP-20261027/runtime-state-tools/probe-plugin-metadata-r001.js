const result={at:new Date().toISOString(),origin:new URL(page.url()).origin,steps:[],installed_total:null,loaded_total:null,eligible_total:null,claim_ceiling:'当前身份两条公开接口可见元数据；总数完整性unknown'};
const allow=new Set(['/api/plugin/query','/api/xpackComponent/viewPlugins']);
const wire=[];
const onResponse=r=>{const u=new URL(r.url());if(allow.has(u.pathname))wire.push({path:u.pathname,method:r.request().method(),http_status:r.status(),at:new Date().toISOString()});};
page.on('response',onResponse);
try {
 const data=await page.evaluate(async()=>{
  const request=(await import('/src/config/axios/index.ts')).default;
  const rows=[];
  for(const [id,url] of [['installed_visible','/plugin/query'],['advertised_types','/xpackComponent/viewPlugins']]){
   const step={step_id:id,path:url,method:'GET',at:new Date().toISOString(),status:'UNKNOWN',count:null,rows:[]};
   try {
    const res=await request.get({url,handleErrorLocally:true});
    step.business_code=typeof res?.code==='number'?res.code:null;
    step.schema_kind=Array.isArray(res?.data)?'array':res?.data===null?'null':typeof res?.data;
    if(res?.code===0&&Array.isArray(res.data)){
     step.status='VISIBLE_METADATA_ONLY';step.count=res.data.length;
     step.rows=res.data.map(row=>{
      const out={};
      for(const k of ['id','name','flag','version']){
       const v=row?.[k];out[k]=typeof v==='string'?v:k==='id'&&Number.isSafeInteger(v)?String(v):null;
      }
      out.type=id==='advertised_types'&&typeof row?.chartValue==='string'?row.chartValue:null;
      return out;
     });
    } else step.reason_code='UNKNOWN_SCHEMA_OR_BUSINESS_STATUS';
   }catch(err){step.reason_code='UNKNOWN_REQUEST_FAILURE';step.http_status=typeof err?.response?.status==='number'?err.response.status:null;}
   rows.push(step);
  }
  return rows;
 });
 result.steps=data;
}finally{page.off('response',onResponse);result.wire=wire;result.finished_at=new Date().toISOString();}
fs.writeFileSync(lifeArtifact+'ChartPluginInventoryRuntime-r001.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});
return result;
