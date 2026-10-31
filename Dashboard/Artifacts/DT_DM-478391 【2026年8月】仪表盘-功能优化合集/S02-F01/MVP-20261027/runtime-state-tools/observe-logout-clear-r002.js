const root=String(globalThis.lifeArtifact),crypto=await import('node:crypto')
const hash=x=>crypto.createHash('sha256').update(x).digest('hex')
const driver=root.replace(/evidence\/$/,'runtime-state-tools/')+'observe-logout-clear-r002.js'
const out=root+'LogoutClear-events-r002.json';if(fs.existsSync(out))throw Error('OUTPUT_EXISTS')
const r={startedAt:new Date().toISOString(),kind:'U4正常同浏览器context辅助页退出，主编辑页既有内存clip由真实身份观察清空；非后端权限/Token撤销验收',driverShaStart:hash(fs.readFileSync(driver)),limits:['不录认证请求响应内容/headers/cookies/storage/登录过程；退出接口只记录HTTP状态码','辅助页仅正常AccountOperator退出；clip不传给辅助页，主页面只用已核同实例public getters只读观察','当前standalone替补logout仅服务日志；只证明core前端正常退出/缓存身份变化，不证明真实后端鉴权','重入另段采样，不能用重载反推退出前已清空；不直接调用invalidate/clear']}
const need=(v,m)=>{if(!v)throw Error(m)}
const diag=async()=>JSON.parse(await page.getByTestId('chart-filter-copy-diagnostic').locator('pre').textContent())
try{
 r.explicitContextBinding={mainPageMatches:page===globalThis.s02LogoutMainPage,contextMatches:page.context()===globalThis.s02LogoutContext};need(r.explicitContextBinding.mainPageMatches&&r.explicitContextBinding.contextMatches,'NOT_EXPLICIT_U4_CONTEXT')
 need(page.url().includes('1312476889213964288'),'WRONG_RESOURCE')
 const tile=page.locator('#enlarge-inner-shape-7520752064427724800');await tile.locator('..').locator('.de-drag-top').click();await page.getByTestId('chart-filter-permission').selectOption('allow');await page.waitForFunction(()=>{const e=document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre');return e&&JSON.parse(e.textContent).fieldsReady})
 r.beforeCopy=await diag();need(r.beforeCopy.source.tree.items[0].fieldId==='1793083721146'&&r.beforeCopy.source.tree.items[0].value==='200','NOT_AMOUNT200_BASELINE')
 await page.getByTestId('chart-filter-copy').click();r.copied=await diag();need(r.copied.clipboard!==null,'COPY_NOT_VALID')
 r.moduleBinding=await page.evaluate(async expected=>{
  if(typeof globalThis.__s02LogoutPublicRead!=='undefined')throw Error('OBSERVER_SLOT_ALREADY_BOUND')
  const wanted='/src/custom-component/filter-copy/mvp-chart-filter-copy.ts'
  const candidates=performance.getEntriesByType('resource').map(e=>e.name).filter(name=>{try{return new URL(name).pathname.endsWith(wanted)}catch{return false}})
  const text=await(await fetch('/src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts')).text()
  for(const match of text.matchAll(/from\s*["']([^"']*mvp-chart-filter-copy\.ts[^"']*)["']/g))candidates.push(new URL(match[1],location.origin).href)
  candidates.push(new URL(wanted,location.origin).href)
  for(const candidate of [...new Set(candidates)].slice(-6)){
   const url=new URL(candidate);if(url.origin!==location.origin||!url.pathname.endsWith(wanted)||[...url.searchParams.keys()].some(k=>!['t','import'].includes(k)))continue
   const module=await import(candidate),clip=module.getMvpFilterClipboard(),session=module.getMvpFilterSessionToken()
   const expectedDescriptor={tree:expected.clipboard.tree,ownKeys:expected.clipboard.ownKeys,undefinedPaths:expected.clipboard.undefinedPaths}
   if(!clip||clip.createdAt!==expected.clipboard.createdAt||clip.revision!==expected.clipboard.revision||JSON.stringify(module.describeMvpFilterTree(clip.tree))!==JSON.stringify(expectedDescriptor)||JSON.stringify(session)!==JSON.stringify(expected.session))continue
   const createdAt=clip.createdAt
   const read=()=>{const c=module.getMvpFilterClipboard(),token=module.getMvpFilterSessionToken();for(const key of ['identityEpoch','editSessionId','revision'])if(typeof token[key]!=='number')throw Error('UNSAFE_SESSION_PROJECTION');return {session:{identityEpoch:token.identityEpoch,editSessionId:token.editSessionId,revision:token.revision},clipboard:c?{...module.describeMvpFilterTree(c.tree),tableId:c.tableId,createdAt:c.createdAt,revision:c.revision}:null,elapsedSinceBoundCopyMs:performance.now()-createdAt}}
   globalThis.__s02LogoutPublicRead=read
   return {matchedExistingNonemptyClip:true,modulePath:url.pathname,moduleCacheQueryKeys:[...url.searchParams.keys()],snapshot:read()}
  }
  throw Error('NO_VERIFIED_EXISTING_MODULE_INSTANCE')
 },r.copied)
 const auxiliary=await page.context().newPage();globalThis.s02LogoutPage=auxiliary;r.auxiliaryContextMatches=auxiliary.context()===page.context();need(r.auxiliaryContextMatches,'DIFFERENT_BROWSER_CONTEXT')
 await auxiliary.goto('http://127.0.0.1:7070/#/panel/index',{waitUntil:'networkidle'});await auxiliary.locator('.top-info-container').waitFor({state:'visible',timeout:25000});await auxiliary.locator('.top-info-container').click();const exit=auxiliary.locator('.uinfo-footer').getByText('退出系统',{exact:true});await exit.waitFor({state:'visible'})
 r.immediatelyBeforeLogout=await page.evaluate(()=>globalThis.__s02LogoutPublicRead());need(r.immediatelyBeforeLogout.clipboard!==null&&r.immediatelyBeforeLogout.clipboard.revision===r.copied.clipboard.revision,'CLIP_INVALIDATED_BEFORE_LOGOUT')
 const logoutResponse=auxiliary.waitForResponse(res=>new URL(res.url()).pathname.endsWith('/logout'),{timeout:20000}).catch(()=>null)
 r.normalLogoutClickAt=new Date().toISOString();await exit.click();await auxiliary.waitForURL(url=>url.hash.startsWith('#/login'),{timeout:20000});const response=await logoutResponse;r.normalLogoutObserved={at:new Date().toISOString(),auxiliaryRouteIsLogin:true,httpStatusOnly:response?.status()??null}
 await page.bringToFront();await page.waitForFunction(before=>{const read=globalThis.__s02LogoutPublicRead;if(typeof read!=='function')return false;const v=read();return v.clipboard===null&&v.session.identityEpoch>before},r.immediatelyBeforeLogout.session.identityEpoch,{timeout:15000})
 r.afterLogout=await page.evaluate(()=>globalThis.__s02LogoutPublicRead());need(r.afterLogout.elapsedSinceBoundCopyMs<1800000,'TTL_COULD_CONFUND_LOGOUT')
 r.mainEditorDiagnosticPresent=await page.getByTestId('chart-filter-copy-diagnostic').count();if(r.mainEditorDiagnosticPresent){r.afterDiagnostic=await diag();r.copyDisabled=await page.getByTestId('chart-filter-copy').isDisabled();r.pasteDisabled=await page.getByTestId('chart-filter-paste').isDisabled()}
 r.status='NORMAL_LOGOUT_CLEARED_VERIFIED_MAIN_EDITOR_CLIP_BEFORE_REENTRY'
}catch(e){r.status='FAILED_OBSERVATION_PRESERVED';r.failure={name:e.name,message:e.message}}
finally{if(r.moduleBinding?.matchedExistingNonemptyClip)await page.evaluate(()=>{delete globalThis.__s02LogoutPublicRead}).catch(()=>{});r.finishedAt=new Date().toISOString();r.driverShaEnd=hash(fs.readFileSync(driver));fs.writeFileSync(out,JSON.stringify(r,null,2)+'\n',{flag:'wx'})}
return {status:r.status,failure:r.failure,sameContext:r.auxiliaryContextMatches,beforeNonempty:!!r.immediatelyBeforeLogout?.clipboard,afterEmpty:r.afterLogout?.clipboard===null,epochBefore:r.immediatelyBeforeLogout?.session.identityEpoch,epochAfter:r.afterLogout?.session.identityEpoch,elapsedMs:r.afterLogout?.elapsedSinceBoundCopyMs,driverSame:r.driverShaStart===r.driverShaEnd}
