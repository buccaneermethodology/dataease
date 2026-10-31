import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'

const root = fileURLToPath(new URL('../../', import.meta.url))
const repo = path.resolve(root, '../..')
const artifacts = path.join(repo, 'Dashboard/Artifacts')
const owner = (await fs.readdir(artifacts)).find(name => name.startsWith('DT_DM-478391'))
const fixture = JSON.parse(
  await fs.readFile(
    path.join(
      artifacts,
      owner,
      'S02-F01/MVP-20261027/evidence/ExistingTwoConditionPersisted-r001.json'
    ),
    'utf8'
  )
)
const servicePath = path.join(root, 'src/custom-component/filter-copy/mvp-chart-filter-copy.ts')
const composablePath = path.join(
  root,
  'src/views/chart/components/editor/filter/useChartFilterCopyMvp.ts'
)

// 只替换实际 composable 的外部 provider。Vue、被测 service/composable 和原生 options 均为真实模块。
const doubles = `
import { reactive } from 'vue'
export const user = reactive({uid:'u1',oid:'o1',token:'internal-test-token',time:123,proxyInfo:{proxy:false,proxyOid:null}})
export const dv = reactive({dvInfo:{id:'resource-1'},editMode:'edit'})
export const route = reactive({path:'/dashboard'})
export const cache = new Map([['user.uid','u1'],['user.oid','o1'],['user.token','internal-test-token'],['user.time',123]])
export const pending = []
export const useUserStoreWithOut = () => user
export const dvMainStoreWithOut = () => dv
export const useRoute = () => route
export const useCache = () => ({wsCache:{get:key=>cache.get(key)}})
export const getFieldByDQ = (...args) => new Promise((resolve,reject)=>pending.push({args,resolve,reject}))
export const manager = {getChartView:(render,type)=>type==='unknown-plugin'?undefined:{axis:['filter']}}
export const useI18n = () => ({t:key=>key})
export const ElMessageBox = {confirm:()=>Promise.resolve()}
export default manager
`
const providerImports = new Set([
  'vue-router_2',
  '@/hooks/web/useCache',
  '@/store/modules/user',
  '@/store/modules/data-visualization/dvMain',
  '@/api/chart',
  '@/hooks/web/useI18n',
  'element-plus-secondary',
  '@/views/chart/components/js/panel'
])
const harnessOptions = {
  stdin: {
    contents: `export * from ${JSON.stringify(servicePath)};
export * from ${JSON.stringify(composablePath)};
export {ref,reactive,createRenderer,h,nextTick} from 'vue';
export * as harness from 'test:providers';`,
    resolveDir: root,
    sourcefile: 'mvp-harness.ts'
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  target: 'es2022',
  define: {
    'import.meta.env.DEV': 'true',
    'import.meta.env.VITE_FILTER_COPY_DEV_VALIDATION': '"true"'
  },
  plugins: [
    {
      name: 'explicit-provider-doubles',
      setup(builder) {
        builder.onResolve({ filter: /.*/ }, args => {
          if (providerImports.has(args.path) || args.path === 'test:providers')
            return { path: 'providers', namespace: 'test' }
          if (args.path.startsWith('@/'))
            return {
              path:
                path.join(root, 'src', args.path.slice(2)) + (path.extname(args.path) ? '' : '.ts')
            }
        })
        builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
          contents: doubles,
          loader: 'js',
          resolveDir: root
        }))
      }
    }
  ]
}
const bundle = await build(harnessOptions)
const m = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
)
let passed = 0
const check = async (name, test) => {
  await test()
  passed++
  console.log(`PASS ${name}`)
}
const tree = () => structuredClone(fixture.rows[0].customFilter)
const fields = fixture.fields.map(({ id, deType }) => ({ id, deType }))
const source = () => ({ tableId: '985189703189925888', tree: tree(), fields, fieldsReady: true })
const target = () => ({ ...source(), tree: { logic: null, items: null } })
const session = () => m.syncMvpFilterSession('resource-1', true, ['u1', 'o1', 'opaque-session'])
await check('真实持久树完整复制，保留 field/valueType null 与缺失 timeValue', () => {
  session()
  assert.equal(m.copyMvpChartFilter(source(), true, 'allow', 100), null)
  assert.deepEqual(m.getMvpFilterClipboard(100).tree, tree())
  assert.equal(Object.hasOwn(m.getMvpFilterClipboard(100).tree.items[0], 'timeValue'), false)
  assert.equal(m.getMvpFilterClipboard(100).tree.items[0].field, null)
  assert.equal(m.getMvpFilterClipboard(100).tree.items[1].subTree.items[0].enumValue.length, 6)
})
await check('own undefined 与缺键不同，深克隆不可变且不储凭据', () => {
  const input = source()
  input.tree.items[0].timeValue = undefined
  assert.equal(m.copyMvpChartFilter(input, true, 'allow', 100), null)
  const copied = m.getMvpFilterClipboard(100)
  assert.equal(Object.hasOwn(copied.tree.items[0], 'timeValue'), true)
  assert.ok(m.describeMvpFilterTree(copied.tree).undefinedPaths.includes('$.items.0.timeValue'))
  input.tree.items[0].value = '999'
  assert.equal(copied.tree.items[0].value, '200')
  assert.throws(() => {
    copied.tree.items[0].value = 'invalid'
  }, TypeError)
  assert.equal(JSON.stringify(copied).includes('opaque-session'), false)
})
await check('空源三个形态拒绝，空目标三个形态接受', () => {
  for (const empty of [{}, { logic: null, items: null }, { logic: 'and', items: [] }]) {
    assert.equal(
      m.copyMvpChartFilter({ ...source(), tree: empty }, true, 'allow', 100),
      'empty_source'
    )
    assert.equal(m.checkMvpFilterTarget({ ...target(), tree: empty }, 100), null)
  }
})
await check('未知结构/动态条件/空子组整包拒绝，原 clip 保留', () => {
  const before = m.getMvpFilterClipboard(100)
  for (const mutate of [
    x => {
      x.items[0].unknownExtension = true
    },
    x => {
      x.items[0].filterTypeTime = 'dynamicDate'
    },
    x => {
      x.items[0].dynamicTimeSetting.timeNum = 1
    },
    x => {
      x.items[0].value = '${sysParams.userId}'
    },
    x => {
      x.items[1].subTree.items = []
    }
  ]) {
    const input = source()
    mutate(input.tree)
    assert.equal(m.copyMvpChartFilter(input, true, 'allow', 100), 'unsupported_tree')
  }
  assert.deepEqual(m.getMvpFilterClipboard(100), before)
})
await check('原始 dataset/field ID、完整目录、deType 检查', () => {
  assert.equal(
    m.checkMvpFilterTarget({ ...target(), tableId: 985189703189925888 }, 100),
    'dataset_incompatible'
  )
  assert.equal(
    m.checkMvpFilterTarget({ ...target(), fieldsReady: false }, 100),
    'fields_unavailable'
  )
  assert.equal(
    m.checkMvpFilterTarget({ ...target(), fields: fields.slice(1) }, 100),
    'field_incompatible'
  )
  assert.equal(
    m.checkMvpFilterTarget({ ...target(), fields: fields.map(f => ({ ...f, deType: 7 })) }, 100),
    'field_incompatible'
  )
  assert.equal(
    m.checkMvpFilterTarget({ ...target(), fields: [...fields, { id: 'unused', deType: 2 }] }, 100),
    null
  )
})
await check('权限 unknown/deny 与 production flag 均拒绝', () => {
  assert.equal(m.copyMvpChartFilter(source(), true, 'unknown', 100), 'permission_unknown')
  assert.equal(m.copyMvpChartFilter(source(), true, 'deny', 100), 'permission_denied')
  assert.equal(m.copyMvpChartFilter(source(), false, 'allow', 100), 'disabled')
  for (const dev of [true, false])
    for (const flag of [undefined, 'false', 'true', true]) {
      assert.equal(m.isMvpFilterCopyDevEnabled(dev, flag), dev && flag === 'true')
    }
})
await check('TTL [0,1800000)，到点/回退/非有限拒绝，不续期', () => {
  m.copyMvpChartFilter(source(), true, 'allow', 100)
  assert.ok(m.getMvpFilterClipboard(100))
  assert.ok(m.getMvpFilterClipboard(1800099))
  assert.equal(m.getMvpFilterClipboard(1800100), null)
  assert.equal(m.getMvpFilterClipboard(99), null)
  assert.equal(m.getMvpFilterClipboard(NaN), null)
  assert.equal(m.checkMvpFilterTarget(target(), 1800100), 'clipboard_expired')
  assert.equal(m.getMvpFilterClipboard(200).createdAt, 100)
})
await check('同资源保留；换资源、离开编辑、身份变化、clear 主动失效', () => {
  for (const invalidate of [
    () => m.syncMvpFilterSession('resource-2', true, ['u1', 'o1', 'opaque-session']),
    () => m.syncMvpFilterSession('resource-1', false, ['u1', 'o1', 'opaque-session']),
    () => m.syncMvpFilterSession('resource-1', true, ['u2', 'o1', 'opaque-session']),
    () => m.invalidateMvpFilterSession()
  ]) {
    session()
    m.copyMvpChartFilter(source(), true, 'allow', 100)
    session()
    assert.ok(m.getMvpFilterClipboard(100))
    invalidate()
    assert.equal(m.getMvpFilterClipboard(100), null)
  }
})

// 真实 Vue custom renderer mount：验证 composable 生命周期，不模拟任何真实 query/save。
const timers = new Map()
let timerId = 0
globalThis.window = {
  setInterval: fn => {
    timers.set(++timerId, fn)
    return timerId
  },
  clearInterval: id => timers.delete(id)
}
const host = {
  createElement: type => ({ type, children: [] }),
  insert: (node, parent) => parent.children.push(node),
  remove: node => {
    node.removed = true
  },
  createText: text => ({ text }),
  createComment: text => ({ text }),
  setText: (node, text) => {
    node.text = text
  },
  setElementText: (node, text) => {
    node.text = text
  },
  parentNode: () => null,
  nextSibling: () => null,
  patchProp: (node, key, previous, next) => {
    node.props ||= {}
    node.props[key] = next
  }
}
const renderer = m.createRenderer(host)
const view = m.ref({
  ...source(),
  id: 'chart-source',
  type: 'bar',
  render: 'antv',
  customFilter: tree()
})
let ui
const mount = () => {
  const app = renderer.createApp({
    setup() {
      ui = m.useChartFilterCopyMvp(view)
      return () => m.h('div')
    }
  })
  app.mount({ children: [] })
  return app
}
const resolveDirectory = async () => {
  m.harness.pending.at(-1).resolve({ dimensionList: fields, quotaList: [] })
  await m.nextTick()
  await m.nextTick()
}
await check('真实 composable：目录未加载/unknown拒绝；allow复制，paste明确未就绪', async () => {
  const app = mount()
  assert.equal(ui.copyReason.value, 'permission_unknown')
  ui.permission.value = 'allow'
  assert.equal(ui.copyReason.value, 'fields_unavailable')
  await resolveDirectory()
  assert.equal(ui.copyReason.value, null)
  ui.copy()
  assert.equal(ui.status.value, 'copied')
  assert.equal(ui.pasteReason.value, 'preparation_unavailable')
  const before = m.describeMvpFilterTree(view.value.customFilter).tree
  ui.paste()
  assert.equal(ui.status.value, 'preparation_unavailable')
  assert.deepEqual(view.value.customFilter, before)
  assert.equal(m.harness.pending.length, 1)
  app.unmount()
  assert.equal(timers.size, 0)
  assert.ok(m.getMvpFilterClipboard())
})
await check('源→目标切换/临时卸载保留 clip；目录陈旧响应丢弃', async () => {
  const app = mount()
  ui.permission.value = 'allow'
  await resolveDirectory()
  const revision = m.getMvpFilterClipboard().revision
  view.value = { ...view.value, id: 'chart-target', customFilter: { logic: null, items: null } }
  await m.nextTick()
  assert.equal(ui.pasteReason.value, 'fields_unavailable')
  const stale = m.harness.pending.at(-1)
  view.value = { ...view.value, id: 'chart-third' }
  await m.nextTick()
  stale.resolve({ dimensionList: [], quotaList: [] })
  await m.nextTick()
  assert.equal(ui.pasteReason.value, 'fields_unavailable')
  await resolveDirectory()
  assert.equal(ui.pasteReason.value, 'preparation_unavailable')
  assert.equal(m.getMvpFilterClipboard().revision, revision)
  app.unmount()
  assert.ok(m.getMvpFilterClipboard())
  m.harness.dv.editMode = 'preview'
  assert.equal(m.getMvpFilterClipboard(), null)
})
await check('真实 composable：缓存清理通知与 unknown plugin fail closed', async () => {
  m.harness.dv.editMode = 'edit'
  const app = mount()
  ui.permission.value = 'allow'
  await resolveDirectory()
  view.value.customFilter = tree()
  await m.nextTick()
  ui.copy()
  assert.ok(m.getMvpFilterClipboard())
  m.harness.cache.delete('user.token')
  m.invalidateMvpFilterSession()
  ui.copy()
  assert.equal(ui.status.value, 'identity_unknown')
  m.harness.cache.set('user.token', 'internal-test-token')
  view.value = { ...view.value, type: 'unknown-plugin' }
  await m.nextTick()
  ui.copy()
  assert.equal(ui.copyReason.value, 'capability_unknown')
  app.unmount()
  m.harness.route.path = '/other'
  assert.equal(m.getMvpFilterClipboard(), null)
})
await check('同路由资源切换立即清空，新资源临时卸载后仍监听真实退出', async () => {
  view.value.type = 'bar'
  const app = mount()
  ui.permission.value = 'allow'
  await resolveDirectory()
  ui.copy()
  assert.ok(m.getMvpFilterClipboard())
  m.harness.dv.dvInfo.id = 'resource-2'
  assert.equal(m.getMvpFilterClipboard(), null)
  ui.copy()
  assert.ok(m.getMvpFilterClipboard())
  app.unmount()
  m.harness.dv.editMode = 'preview'
  assert.equal(m.getMvpFilterClipboard(), null)
  m.harness.dv.editMode = 'edit'
})
await check('实际 production 编译分支关闭入口/权限桩与目录请求', async () => {
  const output = await build({
    ...harnessOptions,
    define: {
      'import.meta.env.DEV': 'false',
      'import.meta.env.VITE_FILTER_COPY_DEV_VALIDATION': '"true"'
    }
  })
  const prod = await import(
    `data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`
  )
  const app = prod.createRenderer(host).createApp({
    setup() {
      const state = prod.useChartFilterCopyMvp(
        prod.ref({
          id: 'chart',
          tableId: source().tableId,
          type: 'bar',
          render: 'antv',
          customFilter: tree()
        })
      )
      assert.equal(state.visible, false)
      assert.equal(state.enabled, false)
      state.permission.value = 'allow'
      assert.equal(state.copyReason.value, 'disabled')
      state.copy()
      assert.equal(prod.getMvpFilterClipboard(), null)
      assert.equal(prod.harness.pending.length, 0)
      return () => prod.h('div')
    }
  })
  app.mount({ children: [] })
  app.unmount()
  assert.equal(timers.size, 0)
})
await check('真实 Editor SFC 编译：两按钮、诊断与原过滤入口共存', async () => {
  const filename = path.join(root, 'src/views/chart/components/editor/index.vue')
  const source = await fs.readFile(filename, 'utf8')
  const { descriptor, errors } = parse(source, { filename })
  assert.deepEqual(errors, [])
  const script = compileScript(descriptor, { id: 'mvp-focused' })
  const template = compileTemplate({
    source: descriptor.template.content,
    filename,
    id: 'mvp-focused',
    compilerOptions: { bindingMetadata: script.bindings }
  })
  assert.deepEqual(template.errors, [])
  for (const testid of ['chart-filter-copy', 'chart-filter-paste'])
    assert.ok(template.code.includes(testid))
  assert.ok(template.code.includes('openTreeFilter'))
  assert.ok(template.code.includes('filterCopyReason'))
  for (const file of ['src/store/modules/user.ts', 'src/utils/cacheUtil.ts']) {
    assert.ok(
      (await fs.readFile(path.join(root, file), 'utf8')).includes('invalidateMvpFilterSession()')
    )
  }
})
console.log(
  JSON.stringify({
    passed,
    production_module_imported: true,
    actual_vue_lifecycle: true,
    editor_sfc_compiled: true,
    provider_doubles: true,
    real_query_save_verified: false,
    independent_validation: false
  })
)
