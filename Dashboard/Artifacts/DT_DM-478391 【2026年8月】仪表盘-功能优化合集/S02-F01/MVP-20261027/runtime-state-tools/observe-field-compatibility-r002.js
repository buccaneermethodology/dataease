const source='7520741153101058048',target='7520752064427724800',amount='1793083721146',unused='1793083721162';
const path='/api/chart/listByDQ/1312472054565572608/'+target;const matcher=u=>u.pathname===path;
const out=globalThis.lifeArtifact+'RuntimeFieldCompatibility-events-r002.json';
const invoke=globalThis.lifeArtifact+'RuntimeFieldCompatibility-invocation-r002.jsonl';
if(fs.existsSync(out)||fs.existsSync(invoke))throw Error('SLOT_USED');
const crypto=await import('node:crypto');const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const driver=globalThis.lifeArtifact.replace(/evidence\/$/,'runtime-state-tools/')+'observe-field-compatibility-r002.js';
const result={startedAt:new Date().toISOString(),driverSha256:hash(fs.readFileSync(driver)),cases:[],api:[],errors:[]};
fs.writeFileSync(invoke,JSON.stringify({phase:'start',at:result.startedAt,driverSha256:result.driverSha256})+'\n',{flag:'wx'});
const diag=async()=>JSON.parse(await page.getByTestId('chart-filter-copy-diagnostic').locator('pre').textContent());
const select=async(id,ready=true)=>{const tile=page.locator('#enlarge-inner-shape-'+id),title=tile.locator('..').locator('.de-drag-top');if(await title.count())await title.click();else await tile.click({position:{x:70,y:80}});await page.getByRole('combobox',{name:'权限测试桩'}).selectOption({label:'允许（测试）'});if(ready)await page.waitForFunction(()=>JSON.parse(document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre').textContent).fieldsReady);};
const request=req=>{const u=new URL(req.url());if(u.pathname.startsWith('/api/')&&!/\/(login|logout|auth)(\/|$)/i.test(u.pathname))result.api.push({at:new Date().toISOString(),path:u.pathname,method:req.method(),...(u.pathname.endsWith('/chartData/getData')?{body:req.postData()}:{})});};
const error=e=>result.errors.push({at:new Date().toISOString(),message:e.message});
page.on('request',request);page.on('pageerror',error);
try{
 await select(source);await page.getByRole('button',{name:'复制过滤条件',exact:true}).click();result.copied=await diag();if(result.copied.clipboard?.tree.items[0]?.value!=='500')throw Error('SOURCE_NOT_500');
 const specs=[['loading','fields_unavailable'],['network_abort','fields_unavailable'],['missing_reference','field_incompatible'],['same_name_different_id','field_incompatible'],['different_type','field_incompatible'],['duplicate_reference','field_incompatible'],['malformed_arrays','fields_unavailable'],['valid_empty','field_incompatible'],['unreferenced_removed',null]];
 for(const [name,expected]of specs){
  const c={name,expected,startedAt:new Date().toISOString(),metadata:[]};let release;const gate=new Promise(r=>release=r);let hits=0,done=0;
  const handler=async route=>{
   try{
    hits++;if(name==='network_abort'){await route.abort('failed');return;}
    const response=await route.fetch();const body=await response.json();const project=d=>({dimensionList:Array.isArray(d?.dimensionList)?d.dimensionList.map(({id,deType})=>({id,deType})):null,quotaList:Array.isArray(d?.quotaList)?d.quotaList.map(({id,deType})=>({id,deType})):null});
    const entry={before:project(body.data)};c.metadata.push(entry);
    if(name==='loading')await gate;
    else if(name==='malformed_arrays')body.data.quotaList={invalid:true};
    else if(name==='valid_empty'){body.data.dimensionList=[];body.data.quotaList=[];}
    else for(const key of ['dimensionList','quotaList'])if(Array.isArray(body.data?.[key])){
     if(name==='missing_reference')body.data[key]=body.data[key].filter(f=>f.id!==amount);
     if(name==='same_name_different_id')body.data[key]=body.data[key].map(f=>f.id===amount?{...f,id:'1793083721999'}:f);
     if(name==='different_type')body.data[key]=body.data[key].map(f=>f.id===amount?{...f,deType:0}:f);
     if(name==='duplicate_reference'){const f=body.data[key].find(f=>f.id===amount);if(f)body.data[key].push({...f});}
     if(name==='unreferenced_removed')body.data[key]=body.data[key].filter(f=>f.id!==unused);
    }
    entry.after=project(body.data);await route.fulfill({response,json:body});
   }catch(e){c.handlerFailure={name:e.name,message:e.message};await route.abort('failed').catch(()=>{});}finally{done++;}
  };
  try{
   await select(source);await page.route(matcher,handler);c.requestStart=result.api.length;
   await select(target,false);
   if(name==='loading'){
    for(let i=0;i<100&&!hits;i++)await page.waitForTimeout(50);
    c.loading=await diag();c.loadingDisabled=await page.getByRole('button',{name:'粘贴过滤条件',exact:true}).isDisabled();release();
    await page.waitForFunction(()=>JSON.parse(document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre').textContent).fieldsReady);
   }else{
    for(let i=0;i<100&&(!hits||done<hits);i++)await page.waitForTimeout(50);
    await page.waitForTimeout(300);
   }
   c.diagnostic=await diag();c.disabled=await page.getByRole('button',{name:'粘贴过滤条件',exact:true}).isDisabled();
   c.reasonMatched=name==='loading'?c.loading.pasteReason===expected&&c.diagnostic.pasteReason===null:c.diagnostic.pasteReason===expected;
   if(name==='unreferenced_removed'&&!c.disabled){
    c.queryStart=result.api.length;await page.getByRole('button',{name:'粘贴过滤条件',exact:true}).click();
    const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'确定',exact:true}).click();await dialog.waitFor({state:'hidden'});
    await page.waitForFunction(()=>['success','failure'].includes(JSON.parse(document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre').textContent).queryObservation?.outcome),undefined,{timeout:35000});
    await page.waitForTimeout(1700);c.afterPaste=await diag();c.tileText=await page.locator('#enlarge-inner-shape-'+target).innerText();
   }
   c.requestEnd=result.api.length;c.clipboardUnchanged=JSON.stringify(c.diagnostic.clipboard)===JSON.stringify(result.copied.clipboard);
  }catch(e){c.executionFailure={name:e.name,message:e.message};}
  finally{release();await page.unroute(matcher,handler).catch(()=>{});c.hits=hits;c.completedHandlers=done;c.finishedAt=new Date().toISOString();result.cases.push(c);}
 }
}catch(e){result.executionFailure={name:e.name,message:e.message};}
finally{
 try{
  await page.locator('.back-icon').click();await page.waitForTimeout(250);if(await page.getByRole('dialog').count())await page.getByRole('dialog').getByRole('button',{name:'确定',exact:true}).click();await page.waitForURL(u=>u.hash.startsWith('#/panel/index'));result.exit={at:new Date().toISOString(),url:page.url(),editorCount:await page.getByTestId('chart-filter-copy-diagnostic').count()};
  await page.goto('http://127.0.0.1:7070/#/dashboard?resourceId=1312476889213964288',{waitUntil:'networkidle'});await page.waitForTimeout(1800);if(await page.getByRole('dialog').count()){await page.getByRole('dialog').getByRole('button',{name:'否',exact:true}).click();await page.getByRole('dialog').waitFor({state:'hidden'});await page.waitForTimeout(1000);}await select(target);result.restored=await diag();
 }catch(e){result.restorationFailure={name:e.name,message:e.message};}
 page.off('request',request);page.off('pageerror',error);result.finishedAt=new Date().toISOString();fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});fs.appendFileSync(invoke,JSON.stringify({phase:'finished',at:result.finishedAt,driverSha256:hash(fs.readFileSync(driver)),outputSha256:hash(fs.readFileSync(out))})+'\n');
}
return{executionFailure:result.executionFailure,restorationFailure:result.restorationFailure,cases:result.cases.map(c=>({name:c.name,reasonMatched:c.reasonMatched,disabled:c.disabled,hits:c.hits,executionFailure:c.executionFailure,outcome:c.afterPaste?.queryObservation?.outcome,queryCount:result.api.slice(c.requestStart,c.requestEnd).filter(x=>x.path.endsWith('/chartData/getData')).length})),saveRequests:result.api.filter(x=>/\/dataVisualization\/(save|saveCanvas|updateCanvas)$/.test(x.path)).length};
