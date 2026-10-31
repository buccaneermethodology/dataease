import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import ts from 'typescript'
import { transform } from 'esbuild'
import { AxiosHeaders } from 'axios'

const root = fileURLToPath(new URL('../../', import.meta.url))
const repo = path.resolve(root, '../..')
const owners = await fs.readdir(path.join(repo, 'Dashboard/Artifacts'))
const owner = owners.find(name => name.startsWith('DT_DM-478391'))
assert.ok(owner, '找不到原任务目录')
const packageRoot = path.join(
  repo,
  'Dashboard/Artifacts',
  owner,
  'S02-F01/MVP-20261027/save-transport-loading-cleanup-r001'
)
const casesBytes = await fs.readFile(path.join(packageRoot, 'Cases-r001.json'))
const cases = JSON.parse(casesBytes)
const source = await fs.readFile(path.join(root, 'src/config/axios/service.ts'), 'utf8')
const helperSource = await fs.readFile(path.join(root, 'src/utils/loading.ts'), 'utf8')
const digest = value => crypto.createHash('sha256').update(value).digest('hex')

const extract = (text, kind) => {
  const file = ts.createSourceFile('actual.ts', text, ts.ScriptTarget.Latest, true)
  assert.equal(file.parseDiagnostics.length, 0, '被测源码存在解析错误')
  const found = []
  const visit = node => {
    if (
      kind === 'response' &&
      ts.isCallExpression(node) &&
      node.expression.getText(file) === 'service.interceptors.response.use'
    ) {
      assert.equal(node.arguments.length, 2, 'response.use 参数结构变化')
      assert.ok(ts.isArrowFunction(node.arguments[1]), '第二参数不是实际回调')
      found.push(node.arguments[1].getText(file))
    }
    if (
      kind === 'helper' &&
      ts.isVariableDeclaration(node) &&
      node.name.getText(file) === 'tryHideLoading'
    ) {
      assert.ok(ts.isArrowFunction(node.initializer), '真实 helper 结构变化')
      found.push(node.initializer.getText(file))
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  assert.equal(found.length, 1, `必须唯一定位真实 ${kind}`)
  return found[0]
}

const actualCallback = extract(source, 'response')
const actualHelper = extract(helperSource, 'helper')
const compile = async text => {
  const result = await transform(`(${text})`, { loader: 'ts', target: 'es2022' })
  return result.code
}
const callbackCode = await compile(actualCallback)
const helperCode = await compile(actualHelper)
const results = []

for (const item of cases.cases) {
  try {
    const input = item.input
    const counts = { current: input.current_count, other: input.other_path_count ?? 7 }
    const observations = { reduce: [], resets: 0, messages: [] }
    const requestStore = {
      loadingMap: counts,
      reduceLoading: key => {
        observations.reduce.push(key)
        counts[key]--
      },
      resetLoadingMap: () => {
        observations.resets++
        counts.current = 0
        counts.other = 0
      }
    }
    // 提取真实 helper；只有其 Store provider 为有界替身。
    const hide = new Function('requestStore', `return ${helperCode}`)(requestStore)
    const forbidden = () => {
      throw Error('执行越过当前案例依赖边界')
    }
    const callback = new Function(
      'requestStore',
      'tryHideLoading',
      'permissionStore',
      'ElMessage',
      'useI18n',
      'clearCache',
      'wsCache',
      'router',
      'showMsg',
      `return ${callbackCode}`
    )(
      requestStore,
      hide,
      { getCurrentPath: 'current' },
      message => observations.messages.push(message),
      () => ({ t: key => key }),
      forbidden,
      { get: forbidden },
      { push: forbidden },
      forbidden
    )
    const error = new Error('隔离的受控传输错误')
    if (input.code) error.code = input.code
    if (!input.config_absent) {
      error.config = { url: '/dataVisualization/updateCanvas' }
      if (input.loading !== null) error.config.loading = input.loading
      if (input.handleErrorLocally) error.config.handleErrorLocally = true
    }
    if (input.response_status) {
      error.response = {
        status: input.response_status,
        headers: new AxiosHeaders(),
        data: { msg: '隔离的原 HTTP 错误' }
      }
    }
    let rejected
    try {
      await callback(error)
    } catch (failure) {
      rejected = failure
    }
    if (rejected && rejected !== error) throw rejected
    assert.equal(rejected, error, '必须继续拒绝同一个原错误')
    assert.equal(counts.current, item.expected.current_count, 'LOADING_REFERENCE_NOT_RELEASED')
    assert.equal(counts.other, item.expected.other_path_count ?? 7, '其它路径引用不得改变')
    assert.equal(observations.reduce.length, item.expected.reduce_calls, '只释放原有一个引用')
    assert.equal(observations.resets, item.expected.reset_calls, '普通错误不得全局清空')
    assert.equal(observations.messages.length, item.expected.existing_error_message_calls ?? 0)
    results.push({ id: item.id, status: 'pass' })
  } catch (failure) {
    results.push({
      id: item.id,
      status: failure instanceof assert.AssertionError ? 'semantic_failure' : 'execution_error',
      message: failure.message,
      actual: failure.actual,
      expected: failure.expected
    })
  }
}

const executionErrors = results.filter(item => item.status === 'execution_error').length
const semanticFailures = results.filter(item => item.status === 'semantic_failure').length
console.log(
  JSON.stringify(
    {
      layer: '真实回调与真实清理 helper 的提取单元；外围 Store/UI provider 有界替身',
      casesSha256: digest(casesBytes),
      sourceSha256: digest(source),
      callbackSha256: digest(actualCallback),
      helperSha256: digest(actualHelper),
      passed: results.length - executionErrors - semanticFailures,
      semanticFailures,
      executionErrors,
      results
    },
    null,
    2
  )
)
process.exitCode = executionErrors ? 2 : semanticFailures ? 1 : 0
