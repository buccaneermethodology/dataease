import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { parse, compileScript } from '@vue/compiler-sfc'
import { baseParse } from '@vue/compiler-dom'
import ts from 'typescript'
import * as Vue from 'vue'
import * as lodash from 'lodash-es'

const root = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(import.meta.url)
const artifacts = path.resolve(root, '../../Dashboard/Artifacts')
const owner = fs.readdirSync(artifacts).find(name => name.startsWith('DT_DM-478391'))
const evidenceRoot = path.join(artifacts, owner, 'S02-F01/MVP-20261027')
const fixtures = JSON.parse(
  fs.readFileSync(path.join(evidenceRoot, 'UiC234ConcreteFixtures-r001.json'))
)
const filename = path.join(root, 'src/custom-component/rich-text/DeRichTextView.vue')
const before = process.argv.includes('--before')
const baseline = process.argv.includes('--baseline')
const repairBefore = process.argv.includes('--repair-before')
const repairTypes = process.argv.includes('--repair-types')
const localManifest = JSON.parse(
  fs.readFileSync(path.join(evidenceRoot, 'c3-local-before-r001/manifest.json'))
)
const localEntry = localManifest.find(row => row.source.endsWith('/rich-text/DeRichTextView.vue'))
const localBefore = fs.readFileSync(localEntry.snapshot, 'utf8')
assert.equal(createHash('sha256').update(localBefore).digest('hex'), localEntry.sha256)
let source = fs.readFileSync(filename, 'utf8')
if (before) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(evidenceRoot, 'c234-before-r001/manifest.json'))
  )
  const entry = manifest.find(row => row.source.endsWith('/rich-text/DeRichTextView.vue'))
  source = fs.readFileSync(path.resolve(root, '../..', entry.snapshot), 'utf8')
  assert.equal(createHash('sha256').update(source).digest('hex'), entry.sha256)
}
if (repairBefore) source = localBefore
const sourceHash = createHash('sha256').update(source).digest('hex')
if (process.argv.includes('--types') || repairTypes) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(evidenceRoot, 'c234-before-r001/manifest.json'))
  )
  const entry = manifest.find(row => row.source.endsWith('/rich-text/DeRichTextView.vue'))
  const oldSource = repairTypes
    ? localBefore
    : fs.readFileSync(path.resolve(root, '../..', entry.snapshot), 'utf8')
  assert.equal(
    createHash('sha256').update(oldSource).digest('hex'),
    repairTypes ? localEntry.sha256 : entry.sha256
  )
  const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  const diagnose = text => {
    const virtualFile = filename + '.scope.ts'
    const virtualSource = compileScript(parse(text, { filename }).descriptor, {
      id: 'c3-types'
    }).content
    const options = { ...parsed.options, allowJs: true }
    const host = ts.createCompilerHost(options)
    const read = host.readFile,
      exists = host.fileExists
    host.readFile = name => (name === virtualFile ? virtualSource : read(name))
    host.fileExists = name => name === virtualFile || exists(name)
    const program = ts.createProgram(
      [virtualFile, ...parsed.fileNames.filter(name => name.endsWith('.d.ts'))],
      options,
      host
    )
    return ts
      .getPreEmitDiagnostics(program)
      .filter(value => value.file?.fileName === virtualFile)
      .map(value => ({
        code: value.code,
        message: ts.flattenDiagnosticMessageText(value.messageText, ' ')
      }))
  }
  const old = diagnose(oldSource),
    current = diagnose(source),
    counts = new Map()
  for (const item of old) {
    const key = JSON.stringify(item)
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  const added = current.filter(item => {
    const key = JSON.stringify(item),
      count = counts.get(key) || 0
    if (!count) return true
    counts.set(key, count - 1)
    return false
  })
  console.log(
    JSON.stringify({
      scope: '仅rich真实compileScript/tsconfig/声明诊断multiset；非全项目类型通过',
      before: old.length,
      current: current.length,
      added
    })
  )
  process.exit(added.length ? 1 : 0)
}

function bus() {
  const all = new Map()
  return {
    all,
    on(name, fn) {
      for (const event of name.split(' ')) all.set(event, [...(all.get(event) || []), fn])
    },
    off(name, fn) {
      for (const event of name.split(' '))
        all.set(
          event,
          (all.get(event) || []).filter(value => value !== fn)
        )
    },
    emit(name, value) {
      for (const fn of [...(all.get(name) || [])]) fn(value)
    }
  }
}

function scenario(id = 'tiny-normal', options = {}) {
  const effects = [],
    editors = new Map(),
    timerQueue = new Map()
  const emitter = bus(),
    eventBus = bus()
  let timerSequence = 0,
    clock = 0,
    current = true
  const schedule = (fn, ms = 0) => {
    const key = ++timerSequence
    timerQueue.set(key, { fn, at: clock + ms })
    return key
  }
  const advance = ms => {
    clock += ms
    for (const [key, task] of [...timerQueue]) {
      if (task.at <= clock) {
        timerQueue.delete(key)
        task.fn()
      }
    }
  }
  const paragraph = html => ({
    outerHTML: html,
    attrs: { onclick: 'oldClick()' },
    getAttribute(key) {
      return this.attrs[key] ?? null
    },
    setAttribute(key, value) {
      this.attrs[key] = value
      effects.push(['paragraph', html, key, value])
    }
  })
  const oldP = paragraph('<p onclick="oldClick()">OLD_ACTIVE</p>')
  const otherP = paragraph('<p onclick="oldClick()">UNRELATED</p>')
  const makeBody = () => ({
    isConnected: true,
    innerHTML: '',
    localP: paragraph('<p>candidate</p>'),
    getBoundingClientRect: () => ({ width: 640, height: 360 }),
    querySelectorAll(selector) {
      return selector === 'p' ? [this.localP] : []
    }
  })
  const doc = {
    listeners: [],
    addEventListener(...args) {
      this.listeners.push(args)
    },
    removeEventListener(name, callback) {
      this.listeners = this.listeners.filter(item => item[0] !== name || item[1] !== callback)
    },
    createElement: () => ({
      innerHTML: '',
      textContent: '',
      querySelectorAll: () => [],
      isEqualNode(other) {
        return this.innerHTML === other.innerHTML
      },
      get value() {
        return this.innerHTML
          .replaceAll('&amp;', '&')
          .replaceAll('&lt;', '<')
          .replaceAll('&gt;', '>')
      }
    }),
    getElementById: key => editors.get(key)?.body,
    querySelectorAll: selector =>
      selector === 'p' ? [oldP, otherP, ...[...editors.values()].map(ed => ed.body.localP)] : []
  }
  const appearance = {
    currentFont: 'FixtureOldFont',
    fontList: [{ name: 'FixtureFont' }, { name: 'FixtureOldFont' }],
    setCurrentFont(font) {
      this.currentFont = font
      effects.push(['font', font])
    }
  }
  const store = Vue.reactive({
    canvasViewInfo: {},
    mobileInPc: false,
    setViewDataDetails: (...args) => effects.push(['details', ...args])
  })
  const tinymce = { get: key => editors.get(key), init: () => Promise.resolve([]) }
  const Editor = Vue.defineComponent({
    props: ['init', 'id', 'modelValue', 'disabled'],
    setup(props) {
      const events = bus(),
        body = makeBody()
      const editor = {
        ...events,
        body,
        initialized: false,
        sets: [],
        removed: 0,
        inserts: 0,
        getBody: () => body,
        getDoc: () => doc,
        getContent: () => body.innerHTML,
        dom: { select: () => [] },
        selection: {
          getNode: () => body,
          select(node) {
            this.lastSelection = node
          }
        },
        insertContent() {
          this.inserts++
        },
        setContent(html) {
          if (options.contentError) throw Error('TEST_TINY_CONTENT')
          this.sets.push(html)
          body.innerHTML = options.wrongContent ? '<p>WRONG</p>' : html
          if (!options.asyncContent) this.emit('SetContent', { content: html })
        },
        remove() {
          if (this.removed) return
          this.emit('remove')
          this.removed++
          body.isConnected = false
          if (editors.get(props.id) === this) editors.delete(props.id)
        },
        destroy() {
          this.remove()
        }
      }
      Vue.onBeforeUnmount(() => editor.remove())
      editors.set(props.id, editor)
      props.init.setup(editor)
      return () => Vue.h('div', { id: props.id })
    }
  })
  const cache = new Map()
  function moduleAt(file, override) {
    if (cache.has(file)) return cache.get(file)
    const content = override ?? fs.readFileSync(file, 'utf8')
    const script = file.endsWith('.vue')
      ? compileScript(parse(content, { filename: file }).descriptor, {
          id: 'tiny-real-sfc',
          inlineTemplate: true
        }).content
      : content
    const code = ts.transpileModule(script, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
    }).outputText
    const m = { exports: {} }
    cache.set(file, m.exports)
    const load = name => {
      if (name === 'vue') return Vue
      if (name === 'lodash-es') return lodash
      if (name === 'pinia')
        return {
          storeToRefs: value =>
            Object.fromEntries(Object.keys(value).map(key => [key, Vue.toRef(value, key)]))
        }
      if (name === '@tinymce/tinymce-vue') return { default: Editor, __esModule: true }
      if (name === 'tinymce/tinymce') return { default: tinymce, __esModule: true }
      if (name.startsWith('tinymce/') || name.startsWith('tinymce-i18n/') || name === './plugins')
        return {}
      if (name.endsWith('/useI18n')) return { useI18n: () => ({ t: key => key }) }
      if (name.endsWith('/utils/utils'))
        return { getLocale: () => 'zh-CN', deepCopy: lodash.cloneDeep }
      if (name.endsWith('/utils/url'))
        return { formatDataEaseBi: value => value, getResourceBaseUrl: () => '' }
      if (name.endsWith('/snapshot'))
        return {
          snapshotStoreWithOut: () => ({
            recordSnapshotCache: (...args) => effects.push(['snapshot', ...args]),
            resetStyleChangeTimes() {
              effects.push(['reset-style-times'])
            }
          })
        }
      if (name.endsWith('/appearance')) return { useAppearanceStoreWithOut: () => appearance }
      if (name.endsWith('/dvMain')) return { dvMainStoreWithOut: () => store }
      if (name.endsWith('/user')) return { useUserStoreWithOut: () => ({ getLanguage: 'zh-CN' }) }
      if (name.endsWith('/eventBus')) return { default: eventBus, __esModule: true }
      if (name.endsWith('/useEmitt'))
        return {
          useEmitt: option => {
            if (option) {
              emitter.on(option.name, option.callback)
              Vue.onBeforeUnmount(() => emitter.off(option.name, option.callback))
            }
            return { emitter }
          }
        }
      if (name.endsWith('/form/util')) return { guid: () => 'synthetic-guid' }
      if (name.endsWith('/api/chart'))
        return {
          getData: async () => {
            effects.push(['query'])
            return response
          }
        }
      if (name.endsWith('/editor/util/chart'))
        return moduleAt(path.join(root, 'src/views/chart/components/editor/util/chart.ts'))
      if (name.endsWith('/js/formatter'))
        return moduleAt(path.join(root, 'src/views/chart/components/js/formatter.ts'))
      if (name.endsWith('/js/util'))
        return { parseJson: value => (typeof value === 'string' ? JSON.parse(value) : value) }
      if (name.endsWith('/common/common_table'))
        return {
          mappingColorCustom: () => {
            throw Error('unexpected enabled threshold')
          }
        }
      if (name.endsWith('.vue')) return { default: { render: () => null }, __esModule: true }
      if (name.startsWith('@/'))
        return moduleAt(path.join(root, 'src', name.slice(2)) + (path.extname(name) ? '' : '.ts'))
      return require(name)
    }
    vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
      console,
      document: doc,
      window: {},
      setTimeout: schedule,
      clearTimeout: key => timerQueue.delete(key),
      clearInterval: key => timerQueue.delete(key)
    })(load, m, m.exports)
    return m.exports
  }
  const config = fixtures.fixtures[id]
  const base = moduleAt(
    path.join(root, 'src/views/chart/components/editor/util/chart.ts')
  ).BASE_VIEW_CONFIG
  const view = lodash.cloneDeep(base)
  for (const [key, val] of Object.entries(config.view_assignments))
    lodash.set(view, key, lodash.cloneDeep(val))
  const element = Vue.reactive(lodash.cloneDeep(config.element))
  const response = {
    ...lodash.cloneDeep(view),
    ...lodash.cloneDeep(config.response_assignments),
    data: lodash.cloneDeep(config.response_data)
  }
  store.canvasViewInfo[element.id] = view
  const binding = { current: Vue.shallowRef({ phase: 'candidate', view, element }) }
  const Component = moduleAt(filename, source).default
  const host = { children: [] }
  const renderer = Vue.createRenderer({
    createElement: type => ({ type, children: [] }),
    insert(node, parent) {
      node.parent = parent
      parent.children.push(node)
    },
    remove(node) {
      node.removed = true
      if (node.parent) node.parent.children = node.parent.children.filter(value => value !== node)
      node.parent = null
    },
    createText: text => ({ text }),
    createComment: text => ({ text }),
    setText(node, text) {
      node.text = text
    },
    setElementText(node, text) {
      node.text = text
    },
    parentNode: node => node.parent,
    nextSibling: node => node.parent?.children[node.parent.children.indexOf(node) + 1],
    patchProp(node, key, old, value) {
      node[key] = value
    }
  })
  const app = renderer.createApp(Component, {
    element,
    view,
    pasteBinding: options.legacy ? undefined : binding,
    suffixId: 'candidate-operation-1',
    showPosition: 'canvas',
    active: true,
    editMode: 'edit'
  })
  app.config.errorHandler = error => effects.push(['vue-error', String(error)])
  const proxy = app.mount(host)
  const editor = [...editors.values()][0]
  assert.ok(editor, 'full real SFC and Editor protocol must mount before semantic tests')
  return {
    proxy,
    editor,
    host,
    doc,
    editors,
    effects,
    appearance,
    oldP,
    otherP,
    view,
    element,
    binding,
    emitter,
    config,
    advance,
    response,
    eventBus,
    init() {
      editor.initialized = true
      editor.emit('init')
    },
    prepare() {
      return proxy.prepareFilterPaste(
        { kind: 'queried', response, request: view },
        binding,
        () => current
      )
    },
    stale() {
      current = false
    },
    close() {
      current = false
      app.unmount()
    }
  }
}

const records = []
let executionErrors = 0
const check = async (id, run, options = {}, fixtureId = 'tiny-normal') => {
  let s
  try {
    s = scenario(fixtureId, options)
    await run(s)
    records.push({ id, verdict: 'PASS' })
  } catch (error) {
    const semantic = error instanceof assert.AssertionError
    if (!semantic) executionErrors++
    records.push({
      id,
      verdict: semantic ? 'SEMANTIC_FAIL' : 'EXECUTION_ERROR',
      message: String(error)
    })
  } finally {
    s?.close()
  }
}
await check('MVP-UI-10-TINY-FONT', async s => {
  if (!baseline) {
    const run = s.prepare()
    s.init()
    assert.equal((await run).ok, true)
  }
  assert.equal(
    s.appearance.currentFont,
    'FixtureOldFont',
    'candidate must never change shared selected font'
  )
})
await check('MVP-UI-10-TINY-PARAGRAPH', async s => {
  if (!baseline) {
    const run = s.prepare()
    s.init()
    assert.equal((await run).ok, true)
  }
  s.advance(1000)
  assert.equal(
    s.oldP.getAttribute('onclick'),
    'oldClick()',
    'candidate timer must not rewrite old paragraph'
  )
  assert.equal(s.otherP.getAttribute('onclick'), 'oldClick()')
})
await check('MVP-UI-10-TINY-CHANNEL', async s => {
  s.emitter.emit('fieldSelect-tiny-normal', { name: 'PUBLIC' })
  assert.equal(
    s.editor.inserts,
    0,
    'candidate must not receive public resource fieldSelect channel'
  )
})
if (!baseline) {
  await check('MVP-UI-10-TINY-INIT-CONTENT', async s => {
    let settled = false
    const run = s.prepare().then(value => {
      settled = true
      return value
    })
    await Vue.nextTick()
    assert.equal(settled, false)
    assert.equal(s.editor.sets.length, 0)
    s.init()
    const result = await run
    assert.equal(result.ok, true)
    assert.equal(s.editor.sets.at(-1), s.config.expected.assignment_html_before_editor)
    assert.equal(s.editor.getContent(), s.config.expected.assignment_html_before_editor)
    assert.equal(s.effects.filter(x => ['details', 'snapshot', 'query'].includes(x[0])).length, 0)
    result.handle.dispose()
    result.handle.dispose()
  })
  await check('MVP-UI-10-TINY-TIMEOUT-LATE', async s => {
    const run = s.prepare()
    s.advance(10000)
    assert.equal((await run).ok, false)
    s.init()
    s.advance(1000)
    await Vue.nextTick()
    assert.equal(s.editor.sets.length, 0)
    assert.equal(s.appearance.currentFont, 'FixtureOldFont')
  })
  await check(
    'MVP-UI-10-TINY-ASYNC-SETCONTENT',
    async s => {
      let settled = false
      const run = s.prepare().then(result => {
        settled = true
        return result
      })
      s.init()
      await Vue.nextTick()
      await Vue.nextTick()
      assert.equal(s.editor.sets.length, 1)
      assert.equal(settled, false, 'body assignment without content event cannot signal ready')
      s.editor.emit('SetContent', { content: s.editor.body.innerHTML })
      assert.equal((await run).ok, true)
    },
    { asyncContent: true }
  )
  await check(
    'MVP-UI-10-TINY-CONTENT-ERROR',
    async s => {
      const run = s.prepare()
      s.init()
      assert.equal((await run).ok, false)
      s.advance(1000)
      assert.equal(s.appearance.currentFont, 'FixtureOldFont')
      assert.equal(s.oldP.getAttribute('onclick'), 'oldClick()')
    },
    { contentError: true }
  )
  await check('MVP-UI-10-TINY-INIT-ERROR', async s => {
    const run = s.prepare()
    s.editor.emit('SkinLoadError', { message: 'TEST_SKIN' })
    assert.equal((await run).ok, false)
    assert.equal(s.editor.sets.length, 0)
  })
  await check('MVP-UI-10-TINY-UNMOUNT-WAIT', async s => {
    const run = s.prepare()
    s.close()
    assert.equal((await run).ok, false)
    s.init()
    s.advance(1000)
    assert.equal(s.oldP.getAttribute('onclick'), 'oldClick()')
  })
  await check(
    'MVP-UI-08-ADAPTER-RICH-COMPARE',
    async s => {
      const run = s.prepare()
      s.init()
      const result = await run
      assert.equal(result.ok, true)
      assert.equal(result.handle.metadata.kind, 'rich-text')
      assert.equal(result.handle.metadata.innerType, 'rich-text')
      assert.equal(result.handle.metadata.fields[0].dataeaseName, 'f_shop')
      assert.equal(s.editor.getContent(), s.config.expected.assignment_html_before_editor)
      assert.equal(s.view.resultCount, 77)
      assert.equal(
        s.effects.some(x => x[0] === 'query'),
        false
      )
      result.handle.dispose()
    },
    {},
    'tiny-compare'
  )
  await check('MVP-UI-11-TINY-CANONICAL', async s => {
    const run = s.prepare()
    s.init()
    const result = await run
    assert.equal(result.ok, true)
    const sets = s.editor.sets.length
    const element = Vue.reactive(lodash.cloneDeep(s.element))
    element.propValue.textValue = '<p>新金额：[金额]</p>'
    s.binding.current.value = { phase: 'active', view: s.view, element }
    await Vue.nextTick()
    assert.equal(s.editor.sets.length, sets, 'activation cannot initialize content again')
    s.proxy.renderChart(s.view)
    await Vue.nextTick()
    assert.equal(s.editor.getContent(), '<p>新金额：6761</p>')
    s.emitter.emit('fieldSelect-tiny-normal', { name: 'ACTIVE' })
    assert.equal(s.editor.inserts, 2)
    result.handle.dispose()
  })
  await check('MVP-UI-10-TINY-ALREADY-INIT', async s => {
    s.init()
    assert.equal((await s.prepare()).ok, true)
    assert.equal(s.editor.sets.length, 1)
  })
  await check('MVP-UI-08-DTO-TINY-EMPTY', async s => {
    const before = lodash.cloneDeep({ view: s.view, element: s.element })
    Object.assign(s.response.data.tableRow[0], s.config.empty_variant.patch_row)
    const run = s.prepare()
    s.init()
    const result = await run
    assert.equal(result.ok, true)
    assert.equal(s.editor.getContent(), s.config.empty_variant.assignment_html_before_editor)
    assert.deepEqual(
      { view: s.view, element: s.element },
      before,
      'prepare cannot mutate canonical input'
    )
    result.handle.dispose()
  })
  await check(
    'MVP-UI-10-TINY-CONTENT-MISMATCH',
    async s => {
      const run = s.prepare()
      s.init()
      await Vue.nextTick()
      await Vue.nextTick()
      s.advance(10000)
      assert.equal((await run).ok, false, 'content event alone cannot hide actual body mismatch')
    },
    { wrongContent: true }
  )
  await check(
    'MVP-UI-10-TINY-STALE-CONTENT',
    async s => {
      const run = s.prepare()
      s.init()
      await Vue.nextTick()
      await Vue.nextTick()
      s.stale()
      s.editor.emit('SetContent')
      assert.equal((await run).ok, false)
      s.advance(1000)
      assert.equal(s.oldP.getAttribute('onclick'), 'oldClick()')
    },
    { asyncContent: true }
  )
  await check(
    'MVP-UI-15-TINY-LEGACY',
    async s => {
      s.init()
      s.proxy.calcData(s.view)
      for (let i = 0; i < 6; i++) await Vue.nextTick()
      assert.equal(s.editor.getContent(), s.config.expected.assignment_html_before_editor)
      assert.equal(s.effects.filter(x => x[0] === 'query').length, 1)
      assert.equal(s.effects.filter(x => x[0] === 'details').length, 1)
      assert.equal(
        s.appearance.currentFont,
        'FixtureFont',
        'legacy font selection semantics remain'
      )
      s.advance(1000)
      assert.equal(s.oldP.getAttribute('onclick'), 'oldClick()')
      s.close()
      assert.equal((s.emitter.all.get('fieldSelect-tiny-normal') || []).length, 0)
    },
    { legacy: true }
  )
}
if (!baseline) {
  for (const id of ['tiny-normal', 'tiny-compare'])
    for (const event of ['Error', 'remove'])
      for (const ticks of [2, 3, 4])
        await check(
          `C3V001-${id}-${event}-micro${ticks}`,
          async s => {
            let resolved = false
            const run = s.prepare().then(value => {
              resolved = true
              return value
            })
            s.init()
            await Vue.nextTick()
            await Vue.nextTick()
            s.editor.emit('SetContent')
            for (let i = 0; i < ticks; i++) await Promise.resolve()
            assert.equal(resolved, false, 'FAULT_MUST_PRECEDE_PREPARE_RESULT')
            if (event === 'remove') s.editor.body.isConnected = false
            s.editor.emit(event, { message: 'before-adoption' })
            const result = await run
            if (ticks < 4 || result.ok !== true)
              assert.equal(result.ok, false, 'FAILED_EDITOR_CANNOT_PREPARE_OK')
            else
              assert.throws(
                () => result.handle.metadata,
                /rich_editor|paste_cancelled/,
                'FULFILLED_HANDLE_MUST_FAIL_BEFORE_ADOPTION'
              )
          },
          { asyncContent: true },
          id
        )
  for (const id of ['tiny-normal', 'tiny-compare'])
    for (const event of ['Error', 'remove'])
      await check(
        `C3V001-${id}-${event}-handle`,
        async s => {
          const run = s.prepare()
          s.init()
          const result = await run
          assert.equal(result.ok, true)
          if (event === 'remove') s.editor.body.isConnected = false
          s.editor.emit(event, { message: 'after-result-before-adoption' })
          assert.throws(
            () => result.handle.metadata,
            /rich_editor|paste_cancelled/,
            'FAILED_HANDLE_CANNOT_PROVIDE_ADOPTION_METADATA'
          )
          result.handle.dispose()
        },
        {},
        id
      )
  const adopt = async s => {
    const run = s.prepare()
    s.init()
    const result = await run
    assert.equal(result.ok, true)
    s.binding.current.value = { ...s.binding.current.value, phase: 'active' }
    await Vue.nextTick()
    return result
  }
  await check('C3V002-EDITOR-REMOUNT', async s => {
    await adopt(s)
    assert.equal(s.doc.listeners.length, 3)
    const oldListeners = [...s.doc.listeners]
    s.host.children[0].onDblclick()
    s.advance(0)
    await Vue.nextTick()
    await Vue.nextTick()
    await Vue.nextTick()
    const next = [...s.editors.values()][0]
    next.initialized = true
    next.emit('init')
    assert.notEqual(next, s.editor)
    assert.equal(s.editor.removed, 1)
    assert.equal(s.doc.listeners.length, 3, 'REMOVED_EDITOR_DOCUMENT_LISTENERS_MUST_RELEASE')
    let clones = 0
    const handle = {
      style: {},
      cloneNode: () => ({ style: {} }),
      parentNode: {
        appendChild() {
          clones++
        }
      }
    }
    for (const [name, callback] of [...oldListeners, ...s.doc.listeners])
      if (name === 'mousedown') callback({ target: { closest: () => handle } })
    await Vue.nextTick()
    assert.equal(clones, 1)
    assert.deepEqual(
      s.effects.filter(x => x[0] === 'vue-error'),
      []
    )
  })
  for (const event of ['mousedown', 'ObjectSelected'])
    await check(`C3V002-QUEUED-${event}-DISPOSE`, async s => {
      const result = await adopt(s)
      let clones = 0
      const handle = {
        style: {},
        cloneNode: () => ({ style: {} }),
        parentNode: {
          appendChild() {
            clones++
          }
        }
      }
      const resize = { style: {} }
      s.doc.getElementById = () => resize
      if (event === 'mousedown') {
        for (const [name, callback] of s.doc.listeners)
          if (name === event) callback({ target: { closest: () => handle } })
      } else
        s.editor.emit(event, {
          target: {
            nodeName: 'TABLE',
            offsetWidth: 100,
            offsetHeight: 50,
            offsetTop: 0,
            offsetLeft: 0
          }
        })
      result.handle.dispose()
      await Vue.nextTick()
      assert.equal(s.doc.listeners.length, 0)
      assert.equal(clones, 0, 'DISPOSED_EDITOR_MUST_NOT_CLONE_LATE')
      assert.notEqual(handle.style.display, 'none')
      assert.deepEqual(resize.style, {}, 'DISPOSED_EDITOR_MUST_NOT_ADJUST_RESIZE_LATE')
    })
  await check('C3V002-QUEUED-EDITOR-REMOVE', async s => {
    await adopt(s)
    let clones = 0
    const handle = {
      style: {},
      cloneNode: () => ({ style: {} }),
      parentNode: {
        appendChild() {
          clones++
        }
      }
    }
    for (const [name, callback] of s.doc.listeners)
      if (name === 'mousedown') callback({ target: { closest: () => handle } })
    s.editor.remove()
    await Vue.nextTick()
    assert.equal(clones, 0, 'REMOVED_EDITOR_QUEUED_WORK_MUST_STOP')
    assert.equal(s.doc.listeners.length, 0)
  })
  await check('C3V002-CLONE-CLEANUP', async s => {
    const result = await adopt(s)
    let clone
    const parent = {
      appendChild(node) {
        clone = node
        node.parentNode = this
      },
      removeChild(node) {
        assert.equal(node, clone)
        clone = null
      }
    }
    const handle = {
      style: { display: 'block' },
      cloneNode: () => ({ style: {} }),
      parentNode: parent
    }
    for (const [name, callback] of s.doc.listeners)
      if (name === 'mousedown') callback({ target: { closest: () => handle } })
    await Vue.nextTick()
    assert.ok(clone)
    assert.equal(handle.style.display, 'none')
    result.handle.dispose()
    assert.equal(clone, null)
    assert.equal(handle.style.display, 'block')
    assert.equal(s.doc.listeners.length, 0)
  })
  // C3V004已撤销：真实wrapper active分支继续提供有效isCurrent，不以s.stale伪造operation终态。
  await check('RICH-ACTIVE-CURRENT-PARAGRAPH-CONTROL', async s => {
    const result = await adopt(s)

    s.proxy.renderChart(s.view)
    s.advance(1000)
    await Vue.nextTick()
    assert.equal(
      s.editor.body.localP.getAttribute('onclick'),
      'event.stopPropagation()',
      'ACTIVE_WRAPPER_CURRENT_TIMER_CONTROL'
    )
    assert.equal(s.oldP.getAttribute('onclick'), 'oldClick()')
    assert.equal(s.otherP.getAttribute('onclick'), 'oldClick()')
    result.handle.dispose()
  })
  await check('RICH-DISPOSED-PARAGRAPH-CONTROL', async s => {
    const result = await adopt(s)
    s.proxy.renderChart(s.view)
    result.handle.dispose()
    s.advance(1000)
    await Vue.nextTick()
    assert.equal(s.editor.body.localP.getAttribute('onclick'), 'oldClick()')
    assert.equal(s.oldP.getAttribute('onclick'), 'oldClick()')
  })
  // 原initializer完整未改写执行；HTML树为明确DOM double，覆盖原flat innerHTML seam遗漏的分支。
  const ast = ts.createSourceFile(
    filename + '.ts',
    parse(source).descriptor.scriptSetup.content,
    ts.ScriptTarget.Latest,
    true
  )
  let initializer
  for (const statement of ast.statements)
    if (ts.isVariableStatement(statement))
      for (const declaration of statement.declarationList.declarations)
        if (declaration.name.getText(ast) === 'normalizedRichContent')
          initializer = declaration.initializer.getText(ast)
  class HtmlNode {
    constructor(tag = '', text = '') {
      this.tag = tag
      this.data = text
      this.nodeType = tag ? 1 : 3
      this.childNodes = []
      this.attributes = []
      this.style = {}
    }
    get nodeName() {
      return this.tag.toUpperCase()
    }
    get children() {
      return this.childNodes.filter(x => x.nodeType === 1)
    }
    get textContent() {
      return this.nodeType === 3 ? this.data : this.childNodes.map(x => x.textContent).join('')
    }
    set innerHTML(html) {
      const convert = a => {
        const node = new HtmlNode(a.type === 1 ? a.tag : '', a.type === 2 ? a.content : '')
        node.childNodes = (a.children || []).map(convert)
        node.attributes = (a.props || [])
          .filter(p => p.type === 6)
          .map(p => ({ name: p.name, value: p.value?.content || '' }))
        for (const child of node.childNodes) child.parentNode = node
        return node
      }
      this.childNodes = baseParse(html, { whitespace: 'preserve' }).children.map(convert)
      for (const child of this.childNodes) child.parentNode = this
    }
    querySelectorAll(selector) {
      const all = this.children.flatMap(x => [x, ...x.querySelectorAll('*')])
      return selector === '*' ? all : []
    }
    hasAttribute(name) {
      return this.attributes.some(a => a.name === name)
    }
    setAttribute(name, value) {
      this.removeAttribute(name)
      this.attributes.push({ name, value })
    }
    removeAttribute(name) {
      this.attributes = this.attributes.filter(a => a.name !== name)
    }
    removeChild(child) {
      this.childNodes = this.childNodes.filter(x => x !== child)
    }
    isEqualNode(other) {
      const form = n => ({
        tag: n.tag,
        text: n.data,
        attrs: n.attributes,
        children: n.childNodes.map(form)
      })
      return JSON.stringify(form(this)) === JSON.stringify(form(other))
    }
  }
  const normalize = vm.runInNewContext(
    ts.transpileModule('const run=' + initializer, {
      compilerOptions: { target: ts.ScriptTarget.ES2022 }
    }).outputText + ';run',
    { document: { createElement: () => new HtmlNode('div') } }
  )
  for (const [id, expected, actual, equal] of [
    [
      'INLINE-SPACE',
      '<p><span>甲</span> <span>乙</span></p>',
      '<p><span>甲</span><span>乙</span></p>',
      false
    ],
    [
      'INLINE-NBSP',
      '<p><span>甲</span>\u00a0<span>乙</span></p>',
      '<p><span>甲</span><span>乙</span></p>',
      false
    ],
    [
      'PRE-SPACE',
      '<pre><span>甲</span> <span>乙</span></pre>',
      '<pre><span>甲</span><span>乙</span></pre>',
      false
    ],
    ['BLOCK-INDENT', '<p>甲</p>\n<p>乙</p>', '<p>甲</p><p>乙</p>', true]
  ])
    await check(`C3V003-${id}`, async () =>
      assert.equal(
        normalize(expected).isEqualNode(normalize(actual)),
        equal,
        'CONTENT_VISIBLE_SPACE_MUST_PRESERVE'
      )
    )
}
for (const record of records) console.log(JSON.stringify(record))
console.log(
  JSON.stringify({
    mode: baseline ? 'baseline' : repairBefore ? 'repair-before' : 'green',
    source_sha256: sourceHash,
    pass: records.filter(x => x.verdict === 'PASS').length,
    semantic_failures: records.filter(x => x.verdict === 'SEMANTIC_FAIL').length,
    execution_errors: executionErrors,
    actual_full_sfc_loaded: true,
    tiny_protocol_doubled: true,
    real_TinyMCE_or_backend_verified: false
  })
)
process.exitCode = records.some(x => x.verdict !== 'PASS') ? 1 : 0
