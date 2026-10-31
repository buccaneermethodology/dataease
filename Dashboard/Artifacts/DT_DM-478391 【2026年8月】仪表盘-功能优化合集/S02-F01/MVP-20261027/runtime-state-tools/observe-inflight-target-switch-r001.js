const root=String(globalThis.lifeArtifact)
const crypto=await import('node:crypto')
const hash=x=>crypto.createHash('sha256').update(x).digest('hex')
const driver=root.replace(/evidence\/$/,'runtime-state-tools/')+'observe-inflight-target-switch-r001.js'
const r={startedAt:new Date().toISOString(),kind:'真实query暂挂时正常选择其它目标；非权限测试',driverShaStart:hash(fs.readFileSync(driver)),api:[],wire:[],limits:['只监测原目标完整树/已导出clip/session/canvas；不声明全部Store零写','route仅暂挂并原样continue，不改真实请求响应；无保存动作','重选原target后qobs可能已reset；不由null推断原operation失败状态']}
const output=root+'InFlightTargetSwitch-events-r001.json'
if(fs.existsSync(output))throw Error('OUTPUT_EXISTS')
const need=(v,m)=>{if(!v)throw Error(m)}
const diag=async()=>JSON.parse(await page.getByTestId('chart-filter-copy-diagnostic').locator('pre').textContent())
const select=async id=>{const tile=page.locator('#enlarge-inner-shape-'+id);const over=tile.locator('..').locator('.de-drag-top');if(await over.count()===1&&await over.isVisible())await over.click();else await tile.click({position:{x:100,y:20}});await page.getByTestId('chart-filter-permission').selectOption('allow');await page.waitForFunction(()=>{const p=document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre');return p&&JSON.parse(p.textContent).fieldsReady},{},{timeout:20000})}
const descriptor=x=>JSON.stringify({tree:x.tree,ownKeys:x.ownKeys,undefinedPaths:x.undefinedPaths})
const matches=req=>{try{const b=JSON.parse(req.postData()||'{}');return new URL(req.url()).pathname.endsWith('/chartData/getData')&&String(b.id)==='7520752064427724800'&&b.type==='area'&&b.customFilter.items[0].value==='500'}catch{return false}}
const onReq=req=>{const path=new URL(req.url()).pathname;if(path.startsWith('/api/')&&!/\/(login|logout|auth|token|captcha|license)(\/|$)/i.test(path))r.api.push({at:new Date().toISOString(),path,method:req.method()})}
const responses=[]
const onRes=res=>{if(!matches(res.request()))return;const x={at:new Date().toISOString(),status:res.status(),request:res.request().postData()};r.wire.push(x);responses.push(res.text().then(t=>x.body=t).catch(e=>x.failure=e.message))}
let signal,release,released=false
const held=new Promise(ok=>signal=ok),go=new Promise(ok=>release=ok)
const handler=async route=>{if(!matches(route.request()))return route.continue();r.heldAt=new Date().toISOString();signal();await go;r.continuedAt=new Date().toISOString();await route.continue()}
page.on('request',onReq);page.on('response',onRes)
try{
 need(page.url().includes('1312476889213964288'),'WRONG_RESOURCE')
 await select('7520741153101058048');r.source=await diag();need(r.source.source.tree.items[0].value==='500','SOURCE_NOT_500');await page.getByTestId('chart-filter-copy').click();r.copied=await diag()
 await select('7520752064427724800');r.before=await diag();need(r.before.source.tree.items[0].value==='200','TARGET_NOT_200')
 const canvas=page.locator('#enlarge-inner-shape-7520752064427724800 canvas:visible').first();const before=await canvas.screenshot();fs.writeFileSync(root+'InFlightTargetSwitch-before-r001.png',before,{flag:'wx'});r.beforePngSha=hash(before)
 await page.route('**/chartData/getData',handler)
 await page.getByTestId('chart-filter-paste').click();const dialog=page.getByRole('dialog');await dialog.waitFor({state:'visible'});await dialog.getByRole('button',{name:'确定',exact:true}).click();await dialog.waitFor({state:'hidden'})
 await Promise.race([held,new Promise((_,bad)=>setTimeout(()=>bad(Error('NOT_HELD')),15000))]);r.pending=await diag();need(r.pending.queryObservation.outcome==='pending','NOT_PENDING')
 await select('7521402539875504128');r.other=await diag();r.otherSelectedAt=new Date().toISOString();release();released=true
 await page.waitForResponse(res=>matches(res.request()),{timeout:30000});await Promise.all(responses);await page.waitForTimeout(700)
 await select('7520752064427724800');r.after=await diag();need(descriptor(r.before.source)===descriptor(r.after.source),'OLD_TARGET_CHANGED');need(JSON.stringify(r.before.clipboard)===JSON.stringify(r.after.clipboard),'CLIP_CHANGED');need(JSON.stringify(r.before.session)===JSON.stringify(r.after.session),'SESSION_CHANGED')
 await page.getByTestId('chart-filter-permission').hover();await page.waitForTimeout(300);const after=await canvas.screenshot();fs.writeFileSync(root+'InFlightTargetSwitch-after-r001.png',after,{flag:'wx'});r.afterPngSha=hash(after);need(r.beforePngSha===r.afterPngSha,'CANVAS_CHANGED');need(r.wire.length===1&&r.wire[0].status===200&&JSON.parse(r.wire[0].body).code===0,'WIRE_NOT_ONE_SUCCESS')
 r.status='TARGET_SWITCH_OLD_TARGET_PRESERVED_LOCAL_OBSERVATION'
}catch(e){r.status='FAILED_OBSERVATION_PRESERVED';r.failure={name:e.name,message:e.message}}
finally{if(!released)release();await page.unroute('**/chartData/getData',handler);await Promise.allSettled(responses);page.off('request',onReq);page.off('response',onRes);r.saveRequests=r.api.filter(x=>/\/dataVisualization\/(updateCanvas|save|saveCanvas)$/.test(x.path));r.finishedAt=new Date().toISOString();r.driverShaEnd=hash(fs.readFileSync(driver));fs.writeFileSync(output,JSON.stringify(r,null,2)+'\n',{flag:'wx'})}
await page.getByTestId('chart-filter-permission').selectOption('unknown')
return {status:r.status,failure:r.failure,wire:r.wire.length,save:r.saveRequests.length,pixelsSame:r.beforePngSha===r.afterPngSha}
