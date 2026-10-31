import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import crypto from 'node:crypto'

const root = fileURLToPath(new URL('../../', import.meta.url))
const repo = path.resolve(root, '../..')
const artifacts = path.join(repo, 'Dashboard/Artifacts')
const owner = (await fs.readdir(artifacts)).find(name => name.startsWith('DT_DM-478391'))
const witnessRoot = path.join(artifacts, owner, 'S02-F01/MVP-20261027')
const fixture = JSON.parse(
  await fs.readFile(path.join(witnessRoot, 'evidence/StaticDateNativeGolden-r001.json'), 'utf8')
)
const caseBytes = await fs.readFile(
  path.join(witnessRoot, 'shared-guard-witness-r001/Cases-r001.json')
)
const cases = JSON.parse(caseBytes)
const supported = JSON.parse(
  await fs.readFile(path.join(witnessRoot, 'SupportedCharts.json'), 'utf8')
)
const registry = Object.fromEntries(
  supported.charts.map(item => [item.render + ':' + item.type, { axis: item.axis }])
)
const pastePath = path.join(root, 'src/custom-component/filter-copy/mvp-chart-filter-paste.ts')
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
export const manager = {getChartView:(render,type)=>(${JSON.stringify(registry)})[render+':'+type]}
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
export {registerMvpPasteReceiver} from ${JSON.stringify(pastePath)};
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

const digest = value => crypto.createHash('sha256').update(value).digest('hex')
const fields = fixture.fields.map(({ id, deType }) => ({ id, deType }))
// 原始JSON中的 own undefined 按实际 own-key 顺序恢复，不能用JSON克隆冒充原件。
const nativeTree = () => {
  const descriptor = fixture.descriptor
  const absent = new Set(descriptor.undefinedPaths)
  const walk = (value, at) => {
    if (absent.has(at)) return undefined
    if (!value || typeof value !== 'object') return value
    const keys = descriptor.ownKeys[at]
    assert.ok(Array.isArray(keys), 'native ownKeys 路径必须存在')
    const out = Array.isArray(value) ? [] : {}
    for (const key of keys) {
      Object.defineProperty(out, key, {
        value: walk(value[key], `${at}.${key}`),
        enumerable: true,
        writable: true,
        configurable: true
      })
    }
    return out
  }
  return walk(descriptor.tree, '$')
}
const describeJson = value => JSON.parse(JSON.stringify(m.describeMvpFilterTree(value)))
const source = () => ({ tableId: fixture.tableId, tree: nativeTree(), fields, fieldsReady: true })
const target = () => ({ ...source(), tree: { logic: null, items: null } })
const mutate = (input, mutation) => {
  let cursor = input
  for (const key of mutation.path.slice(0, -1)) cursor = cursor[key]
  const key = mutation.path.at(-1)
  if (mutation.op === 'delete') delete cursor[key]
  else cursor[key] = structuredClone(mutation.value)
}
const timers = new Map()
let timerSequence = 0
const previousWindow = globalThis.window
// 本包不测时钟；timer provider只用于生命周期清理，避免运行真实250ms时钟。
globalThis.window = {
  setInterval: callback => {
    const id = ++timerSequence
    timers.set(id, callback)
    return id
  },
  clearInterval: id => timers.delete(id)
}
const renderer = m.createRenderer({
  createElement: type => ({ type, children: [] }),
  createText: text => ({ text }),
  createComment: text => ({ text }),
  insert: (node, parent) => {
    parent.children ||= []
    parent.children.push(node)
    node.parent = parent
  },
  remove: node => {
    if (node.parent) node.parent.children = node.parent.children.filter(item => item !== node)
  },
  setText: (node, text) => {
    node.text = text
  },
  setElementText: (node, text) => {
    node.text = text
  },
  parentNode: node => node.parent ?? null,
  nextSibling: () => null,
  patchProp: (node, key, previous, next) => {
    node.props ||= {}
    node.props[key] = next
  }
})
const results = []
for (const item of cases.cases) {
  try {
    if (item.method === 'component_category') {
      m.harness.dv.editMode = 'edit'
      m.harness.pending.length = 0
      const view = m.ref({
        id: 'guard-component',
        type: 'bar',
        render: 'antv',
        tableId: fixture.tableId,
        customFilter: nativeTree()
      })
      let ui
      let calls = 0
      const app = renderer.createApp({
        setup() {
          ui = m.useChartFilterCopyMvp(view)
          return () => m.h('div')
        }
      })
      let unregister
      try {
        app.mount({ children: [] })
        const directory = m.harness.pending.at(-1)
        assert.ok(directory, '先让目录provider实际进入待决')
        directory.resolve({
          dimensionList: fields.filter(x => ![2, 3, 4].includes(x.deType)),
          quotaList: fields.filter(x => [2, 3, 4].includes(x.deType))
        })
        await m.nextTick()
        await m.nextTick()
        ui.permission.value = 'allow'
        assert.equal(JSON.parse(ui.diagnostic.value).fieldsReady, true)
        assert.equal(ui.copyReason.value, null, '有效bar控制必须先就绪')
        ui.copy()
        assert.equal(ui.status.value, 'copied')
        const before = m.getMvpFilterClipboard()
        const tokenBefore = m.getMvpFilterSessionToken()
        const targetBefore = describeJson(view.value.customFilter)
        unregister = m.registerMvpPasteReceiver(view.value.id, request => {
          calls++
          request.resolve({ ok: false, reason: 'controlled_witness_receiver' })
        })
        assert.equal(typeof unregister, 'function', '必须有可用receiver，不能靠缺接收端制造拒绝')
        view.value.type = item.type
        await m.nextTick()
        if (item.expected_receiver_calls === 0) assert.notEqual(ui.copyReason.value, null)
        else assert.equal(ui.copyReason.value, null)
        ui.copy()
        await ui.paste()
        assert.equal(calls, item.expected_receiver_calls, '仅receiver派发计数，不是HTTP计数')
        assert.deepEqual(describeJson(view.value.customFilter), targetBefore)
        if (item.expected_receiver_calls === 0) {
          assert.deepEqual(m.getMvpFilterClipboard(), before)
          assert.deepEqual(m.getMvpFilterSessionToken(), tokenBefore)
        }
      } finally {
        unregister?.()
        app.unmount()
        m.harness.dv.editMode = 'preview'
      }
      assert.equal(timers.size, 0)
      results.push({
        id: item.id,
        status: 'pass',
        receiverDispatches: calls,
        layer: 'Vue/composable/emitter；registry等provider替身'
      })
      continue
    }
    m.invalidateMvpFilterSession()
    m.syncMvpFilterSession('guard-resource', true, [
      'fixture-user',
      'fixture-org',
      'opaque-unit-session'
    ])
    assert.deepEqual(describeJson(nativeTree()), fixture.descriptor)
    assert.equal(m.copyMvpChartFilter(source(), true, 'allow', 100), null)
    if (item.method === 'native_positive') {
      assert.deepEqual(describeJson(m.getMvpFilterClipboard(100).tree), fixture.descriptor)
      assert.equal(m.checkMvpFilterTarget(target(), 200), null)
    } else {
      const before = m.getMvpFilterClipboard(100)
      const tokenBefore = m.getMvpFilterSessionToken()
      const input = item.method === 'target' ? target() : source()
      for (const mutation of item.mutations ?? [item.mutation]) mutate(input, mutation)
      const inputBefore = structuredClone(input)
      const decision =
        item.method === 'target'
          ? m.checkMvpFilterTarget(input, 200)
          : m.copyMvpChartFilter(input, true, 'allow', 200)
      assert.notEqual(decision, null, '冻结反例必须整次拒绝')
      assert.deepEqual(m.getMvpFilterClipboard(200), before)
      assert.deepEqual(m.getMvpFilterSessionToken(), tokenBefore)
      assert.deepEqual(input, inputBefore)
    }
    results.push({ id: item.id, status: 'pass', layer: '真实service纯guard；无HTTP证明声明' })
  } catch (error) {
    results.push({
      id: item.id,
      status: error instanceof assert.AssertionError ? 'semantic_failure' : 'execution_error',
      message: error.message
    })
  }
}
globalThis.window = previousWindow
assert.equal(results.length, cases.count)
const semanticFailures = results.filter(item => item.status === 'semantic_failure').length
const executionErrors = results.filter(item => item.status === 'execution_error').length
console.log(
  JSON.stringify(
    {
      kind: '原UI05/06 verification-only见证，无新产品实现或RED→修复声明',
      casesSha256: digest(caseBytes),
      count: results.length,
      passed: results.length - semanticFailures - executionErrors,
      semanticFailures,
      executionErrors,
      results
    },
    null,
    2
  )
)
process.exitCode = executionErrors ? 2 : semanticFailures ? 1 : 0
