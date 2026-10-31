const crypto = await import('node:crypto')
const root = String(globalThis.lifeArtifact)
const ids = {source:'7520741153101058048',target:'7520752064427724800',resource:'1312476889213964288'}
const driverPath=root.replace(/evidence\/$/,'runtime-state-tools/')+'observe-role-inflight-permission-r001.js'
const hash=value=>crypto.createHash('sha256').update(value).digest('hex')
const output=root+'RoleInFlightPermission-events-r001.json'
if(fs.existsSync(output))throw Error('OUTPUT_EXISTS')
const r={startedAt:new Date().toISOString(),kind:'DEV角色端口在真实查询等待中改拒绝/未知；不是后端真实撤权',driverShaStart:hash(fs.readFileSync(driverPath)),cases:[],api:[],pageErrors:[],preexistingRuntimeErrorsCount:Array.isArray(runtimeErrors)?runtimeErrors.length:null,limits:['浏览器route仅暂挂并原样continue真实请求，未fabricate响应','不监控全部Store/dirty/实例投影；只证完整filter/clip/session和实际canvas保持、无server save','未验真正受限账号/后端权限、preview已ready后撤权、未知identity']}
const requireThat=(value,message)=>{if(!value)throw Error(message)}
const diag=async()=>JSON.parse(await page.getByTestId('chart-filter-copy-diagnostic').locator('pre').textContent())
const desc=x=>JSON.stringify({tree:x.tree,ownKeys:x.ownKeys,undefinedPaths:x.undefinedPaths})
const select=async id=>{const tile=page.locator('#enlarge-inner-shape-'+id);const overlay=tile.locator('..').locator('.de-drag-top');if(await overlay.count()===1&&await overlay.isVisible())await overlay.click();else await tile.click({position:{x:100,y:20}});await page.getByTestId('chart-filter-permission').selectOption('allow');await page.waitForFunction(()=>{const p=document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre');return p&&JSON.parse(p.textContent).fieldsReady},{},{timeout:20000})}
const targetCanvas=()=>page.locator('#enlarge-inner-shape-'+ids.target+' canvas:visible').first()
const match=req=>{try{const q=JSON.parse(req.postData()||'{}');return new URL(req.url()).pathname.endsWith('/chartData/getData')&&String(q.id)===ids.target&&q.type==='area'&&q.customFilter?.items?.[0]?.value==='500'}catch{return false}}
const onRequest=req=>{const path=new URL(req.url()).pathname;if(path.startsWith('/api/')&&!/\/(login|logout|auth|token|captcha|license)(\/|$)/i.test(path))r.api.push({at:new Date().toISOString(),path,method:req.method()})}
const onError=error=>r.pageErrors.push({at:new Date().toISOString(),message:error.message})
page.on('request',onRequest);page.on('pageerror',onError)
try{
  requireThat(page.url().includes(ids.resource),'UNEXPECTED_RESOURCE')
  for(const role of ['read-source','read-dataset','edit-target'])for(const state of ['deny','unknown']){
    const c={role,state,startedAt:new Date().toISOString(),wire:[],heldRequests:[]};r.cases.push(c)
    await select(ids.source);c.source=await diag();requireThat(c.source.source.tree.items[0].value==='500','SOURCE_NOT_500')
    await page.getByTestId('chart-filter-copy').click();c.copied=await diag();requireThat(desc(c.copied.source)===desc(c.copied.clipboard),'SOURCE_CLIP_DIFF')
    await select(ids.target);await page.getByTestId('chart-filter-permission').hover();await page.waitForTimeout(400)
    c.before=await diag();requireThat(c.before.source.tree.items[0].value==='200'&&c.before.pasteReason===null,'BASELINE_NOT_AREA200_READY')
    const beforePng=await targetCanvas().screenshot();const prefix='RoleInFlightPermission-'+role+'-'+state
    fs.writeFileSync(root+prefix+'-before-r001.png',beforePng,{flag:'wx'});c.beforePngSha=hash(beforePng)
    let signalHeld,release;const held=new Promise(resolve=>signalHeld=resolve),go=new Promise(resolve=>release=resolve)
    let released=false
    const responsePending=[]
    const onResponse=response=>{if(!match(response.request()))return;const wire={at:new Date().toISOString(),status:response.status(),request:response.request().postData(),body:null};c.wire.push(wire);responsePending.push(response.text().then(text=>wire.body=text).catch(error=>wire.failure=error.message))}
    const handler=async route=>{if(!match(route.request()))return route.continue();c.heldRequests.push({at:new Date().toISOString(),request:route.request().postData(),action:'held_before_backend_send'});signalHeld();await go;c.continuedAt=new Date().toISOString();await route.continue()}
    const pattern='**/chartData/getData'
    await page.route(pattern,handler);page.on('response',onResponse)
    try{
      await page.getByTestId('chart-filter-paste').click();const dialog=page.getByRole('dialog');await dialog.waitFor({state:'visible'});requireThat((await dialog.innerText()).includes('替换全部过滤条件'),'OVERWRITE_DIALOG_MISSING');await dialog.getByRole('button',{name:'确定',exact:true}).click();await dialog.waitFor({state:'hidden'})
      await Promise.race([held,new Promise((_,reject)=>setTimeout(()=>reject(Error('QUERY_NOT_HELD')),15000))])
      c.pending=await diag();requireThat(c.pending.queryObservation?.outcome==='pending'&&c.pending.queryObservation?.logicalGetDataCalls===1,'NO_NEW_PENDING_QUERY')
      await page.getByTestId('chart-filter-permission-'+role).selectOption(state);c.changedAt=new Date().toISOString();c.revoked=await diag();requireThat(c.revoked.permissions[role]===state,'PORT_NOT_CHANGED')
      c.releasedAt=new Date().toISOString();released=true;release()
      await page.waitForFunction(target=>{const p=document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre');if(!p)return false;const q=JSON.parse(p.textContent).queryObservation;return q&&q.targetId===target&&q.outcome!=='pending'},ids.target,{timeout:30000})
      await Promise.all(responsePending);c.after=await diag();c.uiStatus=await page.getByTestId('chart-filter-copy-status').innerText()
      requireThat(c.after.queryObservation.outcome==='failure','REVOKED_QUERY_WAS_ADOPTED')
      requireThat(desc(c.before.source)===desc(c.after.source),'OLD_FILTER_CHANGED')
      requireThat(JSON.stringify(c.before.clipboard)===JSON.stringify(c.after.clipboard)&&JSON.stringify(c.before.session)===JSON.stringify(c.after.session),'CLIP_OR_SESSION_CHANGED')
      requireThat(c.heldRequests.length===1&&c.wire.length===1&&c.wire[0].status===200&&JSON.parse(c.wire[0].body).code===0,'EXPECTED_SINGLE_REAL_SUCCESS_QUERY')
      await page.getByTestId('chart-filter-permission').hover();await page.waitForTimeout(400);const afterPng=await targetCanvas().screenshot();fs.writeFileSync(root+prefix+'-after-r001.png',afterPng,{flag:'wx'});c.afterPngSha=hash(afterPng);requireThat(c.beforePngSha===c.afterPngSha,'OLD_CANVAS_PIXELS_CHANGED')
      c.outcome='REJECTED_BEFORE_ADOPTION_WITH_REAL_QUERY_COMPLETED';c.finishedAt=new Date().toISOString()
    }finally{
      if(!released)release()
      await page.unroute(pattern,handler);await Promise.allSettled(responsePending);page.off('response',onResponse)
    }
  }
  r.saveRequests=r.api.filter(x=>/\/dataVisualization\/(updateCanvas|save|saveCanvas)$/.test(x.path))
  requireThat(r.saveRequests.length===0,'UNEXPECTED_SERVER_SAVE')
  await page.goto('http://127.0.0.1:7070/#/panel/index',{waitUntil:'networkidle'});r.exit={at:new Date().toISOString(),url:page.url(),editorCount:await page.getByTestId('chart-filter-copy-diagnostic').count()};requireThat(r.exit.editorCount===0,'EDITOR_NOT_LEFT')
  await page.goto('http://127.0.0.1:7070/#/dashboard?resourceId='+ids.resource,{waitUntil:'networkidle'});const dialog=page.getByRole('dialog');if(await dialog.count()){requireThat((await dialog.innerText()).includes('未保存'),'UNEXPECTED_REOPEN_DIALOG');r.draftDiscarded=true;await dialog.getByRole('button',{name:'否',exact:true}).click();await dialog.waitFor({state:'hidden'})}
  await select(ids.target);r.reopened=await diag();requireThat(r.reopened.source.tree.items[0].value==='200'&&r.reopened.clipboard===null,'SAVED_STATE_OR_EMPTY_CLIP_NOT_RESTORED');await page.getByTestId('chart-filter-permission').selectOption('unknown');r.final=await diag();r.saveRequests=r.api.filter(x=>/\/dataVisualization\/(updateCanvas|save|saveCanvas)$/.test(x.path));requireThat(r.saveRequests.length===0,'UNEXPECTED_SERVER_SAVE_INCLUDING_CLEANUP')
  r.status='LOCAL_DEV_INFLIGHT_REJECTION_OBSERVED_NOT_REAL_AUTH'
}catch(error){r.status='FAILED_OBSERVATION_PRESERVED';r.failure={name:error.name,message:error.message}}
finally{page.off('request',onRequest);page.off('pageerror',onError);r.endRuntimeErrorsCount=Array.isArray(runtimeErrors)?runtimeErrors.length:null;r.driverShaEnd=hash(fs.readFileSync(driverPath));r.finishedAt=new Date().toISOString();fs.writeFileSync(output,JSON.stringify(r,null,2)+'\n',{flag:'wx'})}
return {status:r.status,failure:r.failure,cases:r.cases.map(c=>({role:c.role,state:c.state,outcome:c.outcome,held:c.heldRequests.length,wire:c.wire.length,pixelsSame:c.beforePngSha&&c.afterPngSha?c.beforePngSha===c.afterPngSha:null})),saveRequests:r.saveRequests?.length,driverUnchanged:r.driverShaStart===r.driverShaEnd}
