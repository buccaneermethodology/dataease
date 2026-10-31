const crypto = await import('node:crypto')
const root = String(globalThis.lifeArtifact)
const target = '7520752064427724800'
const driverPath = root.replace(/evidence\/$/, 'runtime-state-tools/') + 'observe-role-permission-controls-r001.js'
const sha = x => crypto.createHash('sha256').update(x).digest('hex')
const output = root + 'RolePermissionControls-events-r001.json'
if (fs.existsSync(output)) throw Error('OUTPUT_EXISTS')
const record = { startedAt: new Date().toISOString(), kind: 'DEV正常UI参数化观察，非真实权限', driverShaStart: sha(fs.readFileSync(driverPath)), cases: [], queries: [], pageErrors: [] }
const onRequest = req => { if (new URL(req.url()).pathname.endsWith('/chartData/getData')) record.queries.push({at:new Date().toISOString(), method:req.method()}) }
const onError = error => record.pageErrors.push(String(error.message))
try {
  await page.reload({waitUntil:'networkidle'})
  const dialog = page.getByRole('dialog')
  if (await dialog.count()) throw Error('UNEXPECTED_DIALOG_NO_DISCARD')
  await page.locator('#enlarge-inner-shape-' + target).click({position:{x:100,y:20}})
  const diag = async () => JSON.parse(await page.getByTestId('chart-filter-copy-diagnostic').locator('pre').textContent())
  await page.waitForFunction(() => {const p=document.querySelector('[data-testid="chart-filter-copy-diagnostic"] pre');return p && JSON.parse(p.textContent).fieldsReady})
  const initial = await diag()
  if (Object.values(initial.permissions).some(value=>value!=='unknown')) throw Error('INITIAL_NOT_UNKNOWN')
  record.initial = initial
  record.legacyComboboxExactCount = await page.getByRole('combobox',{name:'权限测试桩',exact:true}).count()
  if (record.legacyComboboxExactCount !== 1) throw Error('LEGACY_NAME_NOT_UNIQUE')
  page.on('request',onRequest)
  page.on('pageerror',onError)
  const aggregate = page.getByTestId('chart-filter-permission')
  for (const role of ['read-source','read-dataset','edit-target']) {
    for (const state of ['deny','unknown']) {
      await aggregate.selectOption('allow')
      await page.getByTestId('chart-filter-permission-'+role).selectOption(state)
      const d = await diag()
      const reason = state==='deny'?'permission_denied':'permission_unknown'
      if (d.copyReason!==reason || d.pasteReason!==reason) throw Error('REASON_MISMATCH:'+role+':'+state)
      if (!await page.getByTestId('chart-filter-copy').isDisabled() || !await page.getByTestId('chart-filter-paste').isDisabled()) throw Error('BUTTON_ENABLED')
      if (Object.values(d.permissions).filter(x=>x==='allow').length!==2 || d.permissions[role]!==state) throw Error('CROSS_ROLE_OVERWRITE')
      record.cases.push({role,state,diagnostic:d,copyDisabled:true,pasteDisabled:true})
    }
  }
  await aggregate.selectOption('allow')
  const allowed = await diag()
  if (await page.getByTestId('chart-filter-copy').isDisabled() || allowed.copyReason!==null) throw Error('ALL_ALLOW_COPY_BLOCKED')
  record.allowed = allowed
  await page.getByTestId('chart-filter-permission-read-source').selectOption('unknown')
  await page.getByTestId('chart-filter-permission-edit-target').selectOption('deny')
  record.mixed = await diag()
  if(record.mixed.copyReason!=='permission_denied')throw Error('DENY_PRIORITY')
  const shot=root+'RolePermissionControls-r001.png'
  const image=await page.screenshot()
  fs.writeFileSync(shot,image,{flag:'wx'})
  record.screenshot={path:shot,sha256:sha(image)}
  await aggregate.selectOption('unknown')
  record.final=await diag()
  if(record.queries.length!==0)throw Error('UNEXPECTED_QUERY_FROM_ROLE_CONTROL')
  record.status='LOCAL_UI_OBSERVED_NOT_REAL_AUTH_ACCEPTANCE'
} catch(error) { record.status='FAILED_OBSERVATION_PRESERVED';record.failure={name:error.name,message:error.message} }
finally {
  page.off('request',onRequest);page.off('pageerror',onError)
  record.driverShaEnd=sha(fs.readFileSync(driverPath));record.finishedAt=new Date().toISOString()
  fs.writeFileSync(output,JSON.stringify(record,null,2)+'\n',{flag:'wx'})
}
return {status:record.status,failure:record.failure,cases:record.cases.length,queryCount:record.queries.length,driverUnchanged:record.driverShaStart===record.driverShaEnd}
