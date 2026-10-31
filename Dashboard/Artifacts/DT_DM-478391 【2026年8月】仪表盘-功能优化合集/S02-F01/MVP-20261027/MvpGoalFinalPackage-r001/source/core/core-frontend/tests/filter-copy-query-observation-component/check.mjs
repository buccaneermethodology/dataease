import assert from 'node:assert/strict'
import { writeFile, unlink } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { parse, compileScript } from '@vue/compiler-sfc'
import { createRenderer, h, nextTick, reactive } from 'vue'

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const selectPath = resolve(frontendRoot, 'src/custom-component/v-query/Select.vue')
const selectSource = await import('node:fs/promises').then(fs => fs.readFile(selectPath, 'utf8'))
const { descriptor } = parse(selectSource, { filename: selectPath })
const compiled = compileScript(descriptor, { id: 'qobs-component', inlineTemplate: true })
const bundlePath = resolve(frontendRoot, '.qobs-observation-component-test.mjs')
const mockModules = {
  '@/api/dataset': `export const enumValueObj = input => globalThis.__qobsEnumValueObj(input); export const getEnumValue = () => Promise.resolve([])`,
  '@/store/modules/data-visualization/dvMain': `export const dvMainStoreWithOut = () => ({ dvInfo: { type: '' } })`,
  '@/utils/eventBus': `export default { on() {}, off() {} }`,
  '@/hooks/web/useEmitt': `export const useEmitt = () => ({ emitter: { emit() {} } })`,
  '@/hooks/web/useI18n': `export const useI18n = () => ({ t: value => ({ 'v_query.observation_value_invalid': '当前值不在可用选项中', 'v_query.observation_value_unverified': '当前值尚未核实' }[value] || value) })`,
  '@/utils/color': `export const colorStringToHex = value => value; export const mixColor = () => ''`,
  '@/utils/utils': `export const isMobile = () => false`,
  './cascade-utils': `export const isCascadeParentCleared = () => false`,
  '@/utils/componentUtils': `export const filterValueEquals = (left, right) => left === right`,
  './Flat.vue': `export default { name: 'Flat', render: () => null }`,
  './VanPopupSelect.vue': `export default { name: 'VanPopupSelect', render: () => null }`,
  'element-plus-secondary': `import { h } from 'vue'; export const ElMessage = () => {}; export const ElSelectV2 = { name: 'el-select-v2', props: ['modelValue', 'options'], emits: ['update:modelValue', 'change'], setup(props, { emit, expose }) { let root; expose({ pick(value) { emit('update:modelValue', value); emit('change', value) }, focus() { globalThis.__qobsFocusCalls += 1; globalThis.document.activeElement = root } }); return () => h('input', { ref: element => { root = element } }) } }`
}

const bundle = await build({
  stdin: {
    contents: compiled.content,
    resolveDir: dirname(selectPath),
    sourcefile: selectPath,
    loader: 'ts'
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  external: ['vue', 'lodash-es'],
  plugins: [
    {
      name: 'component-boundary-stubs',
      setup(builder) {
        builder.onResolve({ filter: /.*/ }, args => {
          if (args.path === 'vue' || args.path === 'lodash-es') return
          return { path: args.path, namespace: 'qobs-mock' }
        })
        builder.onLoad({ filter: /.*/, namespace: 'qobs-mock' }, args => ({
          contents:
            mockModules[args.path] ??
            `export const isCascadeParentCleared = () => false; export default {}`,
          loader: 'js'
        }))
      }
    }
  ]
})

const host = {
  createElement: type => {
    const node = { type, children: [], props: {} }
    node.contains = target => target === node
    return node
  },
  createText: text => ({ type: '#text', text }),
  createComment: text => ({ type: '#comment', text }),
  setText: (node, text) => {
    node.text = text
  },
  setElementText: (node, text) => {
    node.text = text
  },
  patchProp: (node, key, _previous, value) => {
    node.props[key] = value
  },
  insert(node, parent, anchor) {
    node.parent = parent
    const index = anchor ? parent.children.indexOf(anchor) : -1
    if (index < 0) parent.children.push(node)
    else parent.children.splice(index, 0, node)
  },
  remove(node) {
    if (!node.parent) return
    node.parent.children.splice(node.parent.children.indexOf(node), 1)
    node.parent = null
  },
  parentNode: node => node.parent || null,
  nextSibling(node) {
    if (!node.parent) return null
    return node.parent.children[node.parent.children.indexOf(node) + 1] || null
  }
}

const renderer = createRenderer(host)
const deferred = () => {
  let resolve
  let reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const tick = async () => {
  await wait(0)
  await nextTick()
}
const rows = values => values.map(value => ({ 'f-name': `${value}-code`, 'f-label': value }))
const snapshotOptions = options => options.map(option => ({ ...option }))
const baseConfig = () => ({
  id: 'q1',
  field: { id: 'f-name' },
  displayId: 'f-label',
  sort: 'asc',
  sortId: '',
  resultMode: 0,
  defaultValue: 'A',
  selectValue: 'A',
  defaultValueCheck: true,
  optionValueSource: 1,
  multiple: false,
  required: false,
  optionFilter: [],
  defaultValueFirstItem: false,
  displayFormat: 0,
  displayType: '0',
  showEmpty: false,
  checkedFields: [],
  checkedFieldsMap: {},
  valueSource: [],
  mapValue: [],
  defaultMapValue: [],
  dataset: { id: 'd1' }
})

async function mountSelect() {
  const { default: Select } = await import(pathToFileURL(bundlePath).href + `?run=${Math.random()}`)
  const config = reactive(baseConfig())
  const requests = []
  const cascadeItems = [
    {
      datasetId: 'ds--q1--f-name',
      selectValue: ['initial-map'],
      currentSelectValue: ['initial-map']
    }
  ]
  globalThis.__qobsEnumValueObj = input => {
    const call = deferred()
    requests.push({ input, ...call })
    return call.promise
  }
  globalThis.document = { querySelector: () => null, activeElement: null }
  globalThis.__qobsFocusCalls = 0
  const app = renderer.createApp({ render: () => h(Select, { config, isConfig: false }) })
  app.component('el-select-v2', {
    name: 'el-select-v2',
    props: ['modelValue', 'options'],
    emits: ['update:modelValue', 'change'],
    setup(_props, { emit, expose }) {
      let root
      expose({
        pick(value) {
          emit('update:modelValue', value)
          emit('change', value)
        },
        focus() {
          globalThis.__qobsFocusCalls += 1
          globalThis.document.activeElement = root
        }
      })
      return () => h('input', { ref: element => (root = element) })
    }
  })
  app.component('el-radio', { render: () => null })
  app.component('el-radio-group', { render: () => null })
  app.directive('loading', {})
  app
    .provide('unmount-select', { value: [] })
    .provide('placeholder', { value: { placeholderShow: false } })
    .provide('cascade-list', () => [cascadeItems])
    .provide('$custom-style-filter', { background: '#FFFFFF' })
  const container = { type: 'root', children: [] }
  const vm = app.mount(container)
  await wait(350)
  await nextTick()
  const selectInstance = vm.$.subTree.component
  const rendered = () => {
    const seen = new Set()
    const visit = vnode => {
      if (!vnode || typeof vnode !== 'object' || seen.has(vnode)) return null
      seen.add(vnode)
      if (vnode.component?.type?.name === 'el-select-v2') return vnode
      const subtree = visit(vnode.component?.subTree)
      if (subtree) return subtree
      if (Array.isArray(vnode.children)) {
        for (const child of vnode.children) {
          const found = visit(child)
          if (found) return found
        }
      }
      return null
    }
    return visit(selectInstance.subTree)
  }
  return {
    app,
    config,
    requests,
    cascadeItems,
    rendered,
    focusSelect() {
      globalThis.document.activeElement = rendered().component.subTree.el
    },
    focusCalls() {
      return globalThis.__qobsFocusCalls
    },
    activeElement() {
      return globalThis.document.activeElement
    },
    pick(value) {
      rendered().component.exposed.pick(value)
    },
    unmount() {
      app.unmount()
    }
  }
}

async function preparePendingVerification() {
  const scenario = await mountSelect()
  scenario.requests[0].resolve(rows(['A', 'B']))
  await tick()
  scenario.config.checkedFieldsMap.preload = true
  await wait(350)
  await nextTick()
  assert.equal(scenario.requests.length, 2)
  scenario.pick('C')
  await nextTick()
  scenario.requests[1].resolve(rows(['A', 'X']))
  await tick()
  assert.equal(scenario.requests.length, 3)
  return scenario
}

try {
  await writeFile(bundlePath, bundle.outputFiles[0].text)

  // PA-006: clearing during the initial request closes loading and drops its stale success.
  const clearedDuringInitialRequest = await mountSelect()
  clearedDuringInitialRequest.config.mapValue = ['initial-map']
  const optionsBeforeClearResponse = snapshotOptions(
    clearedDuringInitialRequest.rendered().component.props.options
  )
  clearedDuringInitialRequest.pick(undefined)
  await nextTick()
  assert.equal(clearedDuringInitialRequest.requests.length, 1)
  assert.equal(clearedDuringInitialRequest.rendered().dirs?.[0]?.value, false)
  assert.deepEqual(clearedDuringInitialRequest.config.mapValue, [])
  assert.deepEqual(clearedDuringInitialRequest.cascadeItems[0].currentSelectValue, [])
  clearedDuringInitialRequest.requests[0].resolve(rows(['A', 'B']))
  await tick()
  assert.equal(clearedDuringInitialRequest.requests.length, 1)
  assert.equal(clearedDuringInitialRequest.rendered().dirs?.[0]?.value, false)
  assert.equal(clearedDuringInitialRequest.rendered().component.props.modelValue, undefined)
  assert.deepEqual(clearedDuringInitialRequest.config.mapValue, [])
  assert.deepEqual(clearedDuringInitialRequest.cascadeItems[0].currentSelectValue, [])
  assert.deepEqual(
    clearedDuringInitialRequest.rendered().component.props.options,
    optionsBeforeClearResponse
  )
  clearedDuringInitialRequest.unmount()

  // PA-007: clearing during the initial request also drops its stale failure.
  const clearedBeforeInitialFailure = await mountSelect()
  clearedBeforeInitialFailure.config.mapValue = ['initial-map']
  const optionsBeforeClearFailure = snapshotOptions(
    clearedBeforeInitialFailure.rendered().component.props.options
  )
  clearedBeforeInitialFailure.pick(undefined)
  await nextTick()
  assert.deepEqual(clearedBeforeInitialFailure.config.mapValue, [])
  assert.deepEqual(clearedBeforeInitialFailure.cascadeItems[0].currentSelectValue, [])
  clearedBeforeInitialFailure.requests[0].reject(new Error('stale initial request failed'))
  await tick()
  assert.equal(clearedBeforeInitialFailure.requests.length, 1)
  assert.equal(clearedBeforeInitialFailure.rendered().dirs?.[0]?.value, false)
  assert.equal(clearedBeforeInitialFailure.rendered().component.props.modelValue, undefined)
  assert.deepEqual(clearedBeforeInitialFailure.config.mapValue, [])
  assert.deepEqual(clearedBeforeInitialFailure.cascadeItems[0].currentSelectValue, [])
  assert.deepEqual(
    clearedBeforeInitialFailure.rendered().component.props.options,
    optionsBeforeClearFailure
  )
  clearedBeforeInitialFailure.unmount()

  // PA-008: a superseded initial response cannot close a newer request's loading state.
  const overlappingRequests = await mountSelect()
  overlappingRequests.config.field.id = 'f-name-next'
  await wait(350)
  await nextTick()
  assert.equal(overlappingRequests.requests.length, 2)
  assert.equal(overlappingRequests.requests[0].input.queryId, 'f-name')
  assert.equal(overlappingRequests.requests[1].input.queryId, 'f-name-next')
  assert.equal(overlappingRequests.rendered().dirs?.[0]?.value, true)
  overlappingRequests.requests[0].resolve(rows(['STALE']))
  await tick()
  assert.equal(overlappingRequests.rendered().dirs?.[0]?.value, true)
  assert.deepEqual(overlappingRequests.rendered().component.props.options, [])
  overlappingRequests.requests[1].resolve(rows(['A', 'B']))
  await tick()
  assert.equal(overlappingRequests.rendered().dirs?.[0]?.value, false)
  assert.deepEqual(
    overlappingRequests.rendered().component.props.options.map(option => option.value),
    ['A', 'B']
  )
  overlappingRequests.unmount()

  // PA-009: a superseded initial failure also leaves the newer request loading.
  const overlappingFailure = await mountSelect()
  overlappingFailure.config.field.id = 'f-name-next'
  await wait(350)
  await nextTick()
  assert.equal(overlappingFailure.requests.length, 2)
  assert.equal(overlappingFailure.requests[0].input.queryId, 'f-name')
  assert.equal(overlappingFailure.requests[1].input.queryId, 'f-name-next')
  assert.equal(overlappingFailure.rendered().dirs?.[0]?.value, true)
  overlappingFailure.requests[0].reject(new Error('superseded initial request failed'))
  await tick()
  assert.equal(overlappingFailure.rendered().dirs?.[0]?.value, true)
  overlappingFailure.requests[1].resolve(rows(['A', 'B']))
  await tick()
  assert.equal(overlappingFailure.rendered().dirs?.[0]?.value, false)
  assert.deepEqual(
    overlappingFailure.rendered().component.props.options.map(option => option.value),
    ['A', 'B']
  )
  overlappingFailure.unmount()

  const scenario = await preparePendingVerification()
  // PA-001: the first late success triggers exactly one verification request.
  assert.equal(scenario.rendered().component.props.modelValue, 'C')
  assert.deepEqual(
    scenario.rendered().component.props.options.map(option => option.value),
    ['A', 'B']
  )
  assert.equal(scenario.rendered().dirs?.[0]?.value, true)

  scenario.focusSelect()
  scenario.requests[2].resolve(rows(['A', 'C', 'X']))
  await wait(0)
  await nextTick()
  assert.equal(scenario.rendered().key, 'single-valid')
  assert.equal(scenario.focusCalls(), 1)
  assert.equal(scenario.activeElement(), scenario.rendered().component.subTree.el)
  assert.equal(scenario.rendered().component.props.modelValue, 'C')
  assert.deepEqual(
    scenario.rendered().component.props.options.map(option => option.value),
    ['A', 'C', 'X']
  )
  assert.equal(scenario.rendered().dirs?.[0]?.value, false)
  scenario.unmount()

  const invalid = await preparePendingVerification()
  invalid.focusSelect()
  invalid.requests[2].resolve(rows(['A', 'X']))
  await tick()
  assert.equal(invalid.rendered().key, 'single-invalid')
  assert.equal(invalid.focusCalls(), 1)
  assert.equal(invalid.activeElement(), invalid.rendered().component.subTree.el)
  const invalidOptions = invalid.rendered().component.props.options
  assert.deepEqual(
    invalidOptions.map(option => option.value),
    ['A', 'X', 'C']
  )
  assert.equal(invalidOptions[2].disabled, true)
  assert.equal(invalidOptions[2].label, 'C — 当前值不在可用选项中')
  assert.equal(invalid.rendered().component.props.modelValue, 'C')
  assert.equal(invalid.rendered().dirs?.[0]?.value, false)
  invalid.unmount()

  const failed = await preparePendingVerification()
  failed.focusSelect()
  failed.requests[2].reject(new Error('verification failed'))
  await tick()
  assert.equal(failed.rendered().key, 'single-unverified')
  assert.equal(failed.focusCalls(), 1)
  assert.equal(failed.activeElement(), failed.rendered().component.subTree.el)
  const unverifiedOptions = failed.rendered().component.props.options
  assert.deepEqual(
    unverifiedOptions.map(option => option.value),
    ['A', 'B', 'C']
  )
  assert.equal(unverifiedOptions[2].disabled, true)
  assert.equal(unverifiedOptions[2].label, 'C — 当前值尚未核实')
  assert.equal(failed.rendered().component.props.modelValue, 'C')
  assert.equal(failed.rendered().dirs?.[0]?.value, false)
  failed.unmount()

  const stale = await preparePendingVerification()
  stale.pick('D')
  await nextTick()
  stale.requests[2].resolve(rows(['A', 'C', 'X']))
  await tick()
  assert.equal(stale.rendered().component.props.modelValue, 'D')
  assert.deepEqual(
    stale.rendered().component.props.options.map(option => option.value),
    ['A', 'B']
  )
  assert.equal(stale.rendered().dirs?.[0]?.value, false)
  stale.unmount()

  console.log(
    'PASS PA-001..009 Vue lifecycle + deferred enum response + clear invalidation + stale response/loading + selected-label refresh/focus cases'
  )
} finally {
  await unlink(bundlePath).catch(() => undefined)
}
