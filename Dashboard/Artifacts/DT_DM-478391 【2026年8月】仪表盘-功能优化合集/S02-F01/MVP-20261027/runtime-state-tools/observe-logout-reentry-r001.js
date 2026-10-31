const root=String(globalThis.lifeArtifact),crypto=await import('node:crypto')
const hash=x=>crypto.createHash('sha256').update(x).digest('hex')
const driver=root.replace(/evidence\/$/,'runtime-state-tools/')+'observe-logout-reentry-r001.js',out=root+'LogoutClear-reentry-r001.json'
if(fs.existsSync(out))throw Error('OUTPUT_EXISTS')
const r={startedAt:new Date().toISOString(),kind:'正常退出已先观察清空后，合法会话重新进入编辑器的独立后段；认证过程不在记录器内',driverShaStart:hash(fs.readFileSync(driver)),limits:['此后段reload不作为此前logout清空的证明；旧module的clear/epoch已有独立原件','不读取auth/storage/header/cookie或录认证；只当前Editor诊断与UI控件','新页面运行域epoch不与旧运行域数值直接比较']}
try{
 if(page!==globalThis.s02LogoutMainPage||page.context()!==globalThis.s02LogoutContext)throw Error('WRONG_EXPLICIT_CONTEXT')
 await page.reload({waitUntil:'domcontentloaded'})
 const tile=page.locator('#enlarge-inner-shape-7520752064427724800'),d=page.getByRole('dialog')
 const first=await Promise.race([tile.waitFor({state:'visible',timeout:30000}).then(()=> 'tile'),d.waitFor({state:'visible',timeout:30000}).then(()=> 'dialog')])
 if(first==='dialog'||await d.isVisible()){if(!(await d.innerText()).includes('未保存'))throw Error('UNEXPECTED_DIALOG');r.draft={visibleAt:new Date().toISOString(),text:await d.innerText()};await d.getByRole('button',{name:'否',exact:true}).click();await d.waitFor({state:'hidden'});r.draft.hiddenAt=new Date().toISOString()}
 await tile.waitFor({state:'visible'});await tile.locator('..').locator('.de-drag-top').click();await page.waitForFunction(()=>{const e=document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre');return e&&JSON.parse(e.textContent).fieldsReady},{},{timeout:20000})
 const diag=async()=>JSON.parse(await page.getByTestId('chart-filter-copy-diagnostic').locator('pre').textContent())
 r.initial=await diag();if(r.initial.clipboard!==null||r.initial.source.tree.items[0].value!=='200')throw Error('REENTRY_NOT_SAVED200_EMPTY_CLIP')
 await page.getByTestId('chart-filter-permission').selectOption('allow');r.allowCheck=await diag();if(r.allowCheck.clipboard!==null||r.allowCheck.copyReason!==null||r.allowCheck.pasteReason!=='clipboard_empty')throw Error('EMPTY_CLIP_MASKED_BY_OTHER_GUARD')
 await page.getByTestId('chart-filter-permission').selectOption('unknown');r.final=await diag();r.type=await page.locator('.chart-type-select').innerText();r.routeMatchesResource=page.url().includes('1312476889213964288');r.status='REENTRY_FRESH_EDITOR_EMPTY_CLIP_WITH_VALID_COPY_INPUTS'
}catch(e){r.status='FAILED_OBSERVATION_PRESERVED';r.failure={name:e.name,message:e.message}}
finally{r.finishedAt=new Date().toISOString();r.driverShaEnd=hash(fs.readFileSync(driver));fs.writeFileSync(out,JSON.stringify(r,null,2)+'\n',{flag:'wx'})}
return {status:r.status,failure:r.failure,type:r.type,clip:r.final?.clipboard,permissions:r.final?.permissions,copyInputsValid:r.allowCheck?.copyReason===null,pasteReason:r.allowCheck?.pasteReason,driverSame:r.driverShaStart===r.driverShaEnd}
