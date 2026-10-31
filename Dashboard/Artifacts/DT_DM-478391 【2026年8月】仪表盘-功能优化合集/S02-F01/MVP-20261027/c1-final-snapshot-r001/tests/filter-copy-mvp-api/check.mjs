import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { transform } from 'esbuild'
import * as lodash from 'lodash-es'
import { Base64 } from 'js-base64'

const root = fileURLToPath(new URL('../../', import.meta.url))
const sourceIndex = process.argv.indexOf('--api-source')
const apiPath =
  sourceIndex < 0
    ? path.join(root, 'src/api/chart.ts')
    : path.resolve(process.argv[sourceIndex + 1])
const decodePath = path.join(root, 'src/utils/CalculateFields.ts')
const runnerPath = fileURLToPath(import.meta.url)
const hash = value => createHash('sha256').update(value).digest('hex')
const canonical = value => JSON.stringify(value)
const modeIndex = process.argv.indexOf('--mode')
const mode = modeIndex < 0 ? 'green' : process.argv[modeIndex + 1]
const sources = {}
for (const [key, file] of Object.entries({ api: apiPath, decode: decodePath })) {
  const source = await readFile(file)
  const transformed = await transform(source.toString(), {
    loader: 'ts',
    format: 'cjs',
    target: 'es2020',
    sourcefile: file
  })
  sources[key] = {
    source: source.toString(),
    code: transformed.code,
    sha256: hash(source),
    compiled_sha256: hash(transformed.code)
  }
}
const fields = [
  'xAxis',
  'xAxisExt',
  'yAxis',
  'yAxisExt',
  'extBubble',
  'extLabel',
  'extStack',
  'extTooltip',
  'extColor'
]
const field = (originName, encoded = false) => ({
  id: 'field-1',
  extField: 2,
  originName: encoded ? Base64.encode(originName) : originName
})
const input = type => ({
  type,
  customFilter: {
    logic: 'and',
    items: [
      { fieldId: 'amount', term: 'gt', value: '200', type: 'item', subTree: null },
      {
        type: 'tree',
        subTree: {
          logic: 'or',
          items: [
            {
              fieldId: 'shop',
              filterType: 'enum',
              enumValue: ['店A', '店B'],
              type: 'item',
              subTree: null
            }
          ]
        }
      }
    ]
  },
  xAxis: [{ ...field('请求动态字段'), sort: 'asc' }],
  data: { data: [{ value: 'caller-data' }] }
})
function response(code = 0) {
  if (code === 0)
    return {
      code,
      msg: '',
      data: {
        type: 'line',
        xAxis: [field('响应动态字段', true)],
        data: {
          fields: [field('动态结果字段')],
          sourceFields: [field('动态源字段')],
          left: { fields: [field('左字段', true)] },
          right: { fields: [field('右字段', true)] }
        }
      }
    }
  return {
    code,
    msg: '明确业务失败',
    xAxis: [field('错误轴字段', true)],
    data: {
      fields: [field('错误字段', true)],
      sourceFields: [field('错误源字段', true)],
      left: { fields: [field('错误左字段', true)] },
      right: { fields: [field('错误右字段', true)] }
    }
  }
}
function loadApi(reply, networkError = null) {
  const calls = []
  const decoderCalls = []
  const moduleCache = new Map()
  const request = {
    post: options => {
      calls.push(options)
      return networkError ? Promise.reject(networkError) : Promise.resolve(reply)
    }
  }
  const context = vm.createContext({ Error, TypeError, Promise, console })
  function load(name) {
    if (moduleCache.has(name)) return moduleCache.get(name).exports
    const module = { exports: {} }
    moduleCache.set(name, module)
    const require = specifier => {
      if (specifier === 'js-base64') return { Base64 }
      if (specifier === 'lodash-es') return lodash
      if (specifier === '@/config/axios') return request
      if (specifier === 'element-plus-secondary')
        return {
          ElMessage: {
            error() {
              throw new Error('API unexpectedly called UI ElMessage')
            }
          }
        }
      if (specifier === '@/utils/CalculateFields') {
        const actual = load('decode')
        return Object.fromEntries(
          ['originNameHandleWithArr', 'originNameHandleBackWithArr'].map(key => [
            key,
            (...args) => {
              decoderCalls.push({ key, target: args[0], fields: [...args[1]] })
              return actual[key](...args)
            }
          ])
        )
      }
      throw new Error(`Unknown dependency ${name}/${specifier}`)
    }
    const factory = new vm.Script(`(function(require,module,exports){\n${sources[name].code}\n})`, {
      filename: name === 'api' ? apiPath : decodePath
    }).runInContext(context)
    factory(require, module, module.exports)
    return module.exports
  }
  return { getData: load('api').getData, calls, decoderCalls }
}
function assertSuccessDecode(state, reply) {
  assert.equal(state.decoderCalls.length, 6, 'real decoder export call count')
  assert.deepEqual(
    state.decoderCalls.map(x => x.key),
    [
      'originNameHandleWithArr',
      'originNameHandleBackWithArr',
      'originNameHandleWithArr',
      'originNameHandleBackWithArr',
      'originNameHandleBackWithArr',
      'originNameHandleBackWithArr'
    ]
  )
  assert.deepEqual(state.decoderCalls[0].fields, fields)
  assert.equal(state.decoderCalls[1].target, reply.data)
  assert.equal(state.decoderCalls[2].target, reply.data.data)
  assert.equal(reply.data.xAxis[0].originName, '响应动态字段')
  assert.equal(reply.data.data.fields[0].originName, '动态结果字段')
  assert.equal(reply.data.data.sourceFields[0].originName, '动态源字段')
  assert.equal(reply.data.data.left.fields[0].originName, '左字段')
  assert.equal(reply.data.data.right.fields[0].originName, '右字段')
}
function assertErrorDecode(state, reply) {
  assert.equal(state.decoderCalls.length, 5, 'real legacy error decoder calls')
  assert.equal(state.decoderCalls[1].target, reply)
  assert.equal(reply.xAxis[0].originName, '错误轴字段')
  assert.equal(reply.data.fields[0].originName, '错误字段')
  assert.equal(reply.data.sourceFields[0].originName, '错误源字段')
  assert.equal(reply.data.left.fields[0].originName, '错误左字段')
  assert.equal(reply.data.right.fields[0].originName, '错误右字段')
}
async function assertOriginalRejection(promise, expected) {
  let rejected = false
  try {
    await promise
  } catch (observed) {
    rejected = true
    if (observed !== expected) throw observed // 未知执行错误不能降格成业务断言RED。
  }
  assert.equal(rejected, true, 'network error must reject')
}
const tests = [
  [
    'API-001',
    'strict successful envelope returns original decoded DTO',
    async () => {
      const reply = response()
      const state = loadApi(reply)
      const data = input('line')
      const before = lodash.cloneDeep(data)
      const result = await state.getData(data, { reportOutcome: true })
      assert.equal(result.ok, true, 'MVP-UI-08 strict success expected.ok=true')
      assert.equal(result.value, reply.data, 'strict success retains decoded DTO identity')
      assert.deepEqual(data, before, 'strict request must not mutate caller data')
      assert.equal(state.calls.length, 1)
      assert.equal(state.calls[0].url, '/chartData/getData')
      assert.equal(Object.hasOwn(state.calls[0].data, 'data'), false)
      assert.notEqual(state.calls[0].data, data)
      assert.equal(state.calls[0].data.xAxis[0].originName, Base64.encode('请求动态字段'))
      assert.deepEqual(
        state.calls[0].data.customFilter,
        before.customFilter,
        'two-condition payload retained'
      )
      assertSuccessDecode(state, reply)
    }
  ],
  [
    'API-002',
    'strict fulfilled nonzero response is failure with original envelope',
    async () => {
      const reply = response(50002)
      const state = loadApi(reply)
      const data = input('line')
      const before = lodash.cloneDeep(data)
      const result = await state.getData(data, { reportOutcome: true })
      assert.equal(result.ok, false)
      assert.equal(result.error, reply)
      assert.equal(result.error.code, 50002)
      assert.equal(result.error.msg, '明确业务失败')
      assert.deepEqual(data, before)
      assertErrorDecode(state, reply)
    }
  ],
  [
    'API-003',
    'strict network rejection preserves original error and caller',
    async () => {
      const error = new Error('network original')
      const state = loadApi(null, error)
      const data = input('line')
      const before = lodash.cloneDeep(data)
      await assertOriginalRejection(state.getData(data, { reportOutcome: true }), error)
      assert.deepEqual(data, before)
      assert.equal(state.calls.length, 1)
    }
  ],
  [
    'API-004',
    'strict stock-line sorts only request clone',
    async () => {
      const reply = response()
      const state = loadApi(reply)
      const data = input('stock-line')
      const before = lodash.cloneDeep(data)
      const result = await state.getData(data, { reportOutcome: true })
      assert.equal(result.ok, true)
      assert.equal(state.calls[0].data.xAxis[0].sort, 'desc')
      assert.deepEqual(data, before)
      assert.equal(data.xAxis[0].sort, 'asc')
      assertSuccessDecode(state, reply)
    }
  ],
  [
    'API-005',
    'strict string zero is not numeric envelope success',
    async () => {
      const reply = response('0')
      const state = loadApi(reply)
      const result = await state.getData(input('line'), { reportOutcome: true })
      assert.equal(result.ok, false)
      assert.equal(result.error, reply)
      assertErrorDecode(state, reply)
    }
  ],
  [
    'API-006',
    'legacy success keeps DTO identity and delete semantics',
    async () => {
      const reply = response()
      const state = loadApi(reply)
      const data = input('stock-line')
      const result = await state.getData(data)
      assert.equal(result, reply.data)
      assert.equal(Object.hasOwn(result, 'ok'), false)
      assert.equal(Object.hasOwn(data, 'data'), false)
      assert.equal(data.xAxis[0].sort, 'asc')
      assert.equal(state.calls[0].data.xAxis[0].sort, 'desc')
      assertSuccessDecode(state, reply)
    }
  ],
  [
    'API-007',
    'legacy fulfilled failure keeps raw envelope and decode',
    async () => {
      const reply = response(50002)
      const state = loadApi(reply)
      const data = input('line')
      const result = await state.getData(data)
      assert.equal(result, reply)
      assert.equal(Object.hasOwn(result, 'ok'), false)
      assert.equal(Object.hasOwn(data, 'data'), false)
      assertErrorDecode(state, reply)
    }
  ],
  [
    'API-008',
    'legacy rejection preserves original error and old input deletion',
    async () => {
      const error = new Error('legacy network original')
      const state = loadApi(null, error)
      const data = input('line')
      await assertOriginalRejection(state.getData(data), error)
      assert.equal(Object.hasOwn(data, 'data'), false)
    }
  ],
  [
    'API-009',
    'strict successful empty DTO is not guessed from its own code',
    async () => {
      const reply = { code: 0, msg: '', data: { code: 50002, data: { data: [] } } }
      const state = loadApi(reply)
      const result = await state.getData(input('line'), { reportOutcome: true })
      assert.equal(result.ok, true)
      assert.equal(result.value, reply.data)
      assert.equal(result.value.code, 50002)
    }
  ]
]
const results = []
for (const [id, name, execute] of tests) {
  try {
    await execute()
    results.push({ id, name, status: 'PASS' })
  } catch (error) {
    results.push({
      id,
      name,
      status: error?.code === 'ERR_ASSERTION' ? 'ASSERTION_FAILURE' : 'EXECUTION_ERROR',
      message: error.message,
      ...(error?.code === 'ERR_ASSERTION'
        ? { actual: error.actual, expected: error.expected }
        : { stack: error.stack })
    })
  }
}
const summary = {
  mode,
  tested_actual_api_source: true,
  tested_actual_decoder_source: true,
  network_envelopes_stubbed: true,
  cases: results.length,
  passed: results.filter(x => x.status === 'PASS').length,
  assertion_failures: results.filter(x => x.status === 'ASSERTION_FAILURE').length,
  execution_errors: results.filter(x => x.status === 'EXECUTION_ERROR').length,
  api_sha256: sources.api.sha256,
  api_compiled_sha256: sources.api.compiled_sha256,
  decoder_sha256: sources.decode.sha256,
  decoder_compiled_sha256: sources.decode.compiled_sha256,
  runner_sha256: hash(await readFile(runnerPath)),
  case_identity_sha256: hash(canonical(tests.map(([id, name]) => ({ id, name })))),
  backend_query_verified: false,
  permission_verified: false,
  UI_MVP_verified: false
}
for (const result of results) console.log(JSON.stringify({ case: result }))
console.log(JSON.stringify({ summary }))
process.exitCode = summary.execution_errors ? 2 : summary.assertion_failures ? 1 : 0
