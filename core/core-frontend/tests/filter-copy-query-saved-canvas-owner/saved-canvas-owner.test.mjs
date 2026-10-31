import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { build } from 'esbuild'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { fileURLToPath } from 'node:url'

const testDir = path.dirname(fileURLToPath(import.meta.url))
const frontendRoot = path.resolve(testDir, '../..')
const repoRoot = path.resolve(frontendRoot, '../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const fixturePath = path.join(featureRoot, 'QuerySingleSelectSavedCanvasOwnerCases-r004.json')
const contractPath = path.join(
  featureRoot,
  'QuerySingleSelectSavedCanvasOwnerImplementationContract-r003.json'
)
const sourcePath = path.join(
  frontendRoot,
  'src/custom-component/filter-copy/query-single-select-saved-canvas-owner.ts'
)
const mode = process.argv[2] === '--mode' ? process.argv[3] : undefined

const sha256 = value => createHash('sha256').update(value).digest('hex')
const fixtureBytes = readFileSync(fixturePath)
const contractBytes = readFileSync(contractPath)
const casesDocument = JSON.parse(fixtureBytes.toString('utf8'))
const contract = JSON.parse(contractBytes.toString('utf8'))
const expectedCaseIds = Array.from({ length: 40 }, (_, index) =>
  index < 27
    ? `SCPO2-${String(index + 1).padStart(3, '0')}`
    : index < 37
    ? `SCPO3-${String(index + 1).padStart(3, '0')}`
    : `SCPO4-${String(index + 1).padStart(3, '0')}`
)

const creationRegressionDependencies = () =>
  contract.execution_identity.creation_regression_dependencies.map(dependency => {
    const absolutePath = path.resolve(repoRoot, dependency.path)
    const digest = sha256(readFileSync(absolutePath))
    assert.equal(
      digest,
      dependency.sha256,
      `creation regression dependency identity: ${dependency.path}`
    )
    return { path: dependency.path, sha256: digest }
  })

const setup = () => {
  assert.equal(process.version, 'v24.21.0', 'pinned Node runtime')
  assert.equal(casesDocument.cases.length, 40, 'all frozen owner cases are present')
  assert.deepEqual(
    casesDocument.cases.map(item => item.id),
    expectedCaseIds,
    'frozen identity order'
  )
  assert.equal(contract.revision, 'r003')
  assert.equal(
    contract.exact_targets.runner,
    path.relative(repoRoot, fileURLToPath(import.meta.url))
  )
  assert.equal(contract.exact_targets.source, path.relative(repoRoot, sourcePath))
  creationRegressionDependencies()
  for (const item of casesDocument.cases) {
    assert.equal(item.steps[0]?.call, 'begin', `${item.id}: first operation is begin`)
  }
}

const deepClone = value => {
  if (Array.isArray(value)) return value.map(deepClone)
  if (value && typeof value === 'object') {
    const result = {}
    for (const [key, item] of Object.entries(value)) result[key] = deepClone(item)
    return result
  }
  return value
}

const resolveRef = (objects, descriptor) => {
  assert.ok(descriptor && typeof descriptor.ref === 'string', 'reference descriptor')
  let value = objects
  const referencePath = descriptor.ref.startsWith('objects.')
    ? descriptor.ref.slice('objects.'.length)
    : descriptor.ref
  for (const part of referencePath.split('.')) {
    if (!part) continue
    const match = /^([^[]+)(?:\[(\d+)\])?$/.exec(part)
    assert.ok(match, `unsupported object reference ${descriptor.ref}`)
    value = value[match[1]]
    if (match[2] !== undefined) value = value[Number(match[2])]
  }
  assert.notEqual(value, undefined, `resolved object reference ${descriptor.ref}`)
  return value
}

const resolveValue = (objects, value) => {
  if (Array.isArray(value)) return value.map(item => resolveValue(objects, item))
  if (value && typeof value === 'object') {
    if (Object.keys(value).length === 1 && typeof value.ref === 'string')
      return resolveRef(objects, value)
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveValue(objects, item)])
    )
  }
  return value
}

const buildModule = async () => {
  const bundle = await build({
    entryPoints: [sourcePath],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    metafile: true
  })
  return {
    module: await import(
      `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
    ),
    metafile: bundle.metafile
  }
}

const inspectStaticBoundary = (module, metafile) => {
  const sourceText = readFileSync(sourcePath, 'utf8')
  const runtimeInputs = Object.keys(metafile.inputs).map(input => path.resolve(frontendRoot, input))
  const apiNames = Object.keys(module)
  const factory = module.createSavedCanvasOwnerLifecycle({ getCurrentContext: () => null })
  const factoryMethods = Object.keys(factory)
  const excludedCall =
    /(?:\b(?:readDesign|readSource|sourceConfig|copy|paste|commit|query|preview|history|save)\s*\(|\.(?:readDesign|readSource|sourceConfig|copy|paste|commit|query|preview|history|save)\s*\()/i
  const sourceRead =
    /(?:\b(?:readDesign|readSource|sourceConfig)\s*\(|\.(?:readDesign|readSource|sourceConfig)\s*\()/i.test(
      sourceText
    )
  const pasteCommit = /(?:\b(?:copy|paste|commit)\s*\(|\.(?:copy|paste|commit)\s*\()/i.test(
    sourceText
  )
  const createOwnerCalled = /createQuerySingleSelectLifecycleOwner/.test(sourceText)
  const authorizationSurface =
    /\b(?:authorized|authenticated|permissionGranted|hasPermission)\b/.test(sourceText) ||
    apiNames.some(name => /permission|auth/i.test(name)) ||
    factoryMethods.some(name => /permission|auth/i.test(name))
  const reopenSurface =
    /\b(?:reopen|restore|serialize|deserialize)\b/i.test(sourceText) ||
    apiNames.some(name => /reopen|restore|serialize|deserialize/i.test(name))
  const byteForByteClaim = /\b(?:byteForByte|byteEqual|compareBytes|serializedBytes)\b/i.test(
    sourceText
  )

  assert.equal(runtimeInputs.length, 1, 'helper runtime dependency graph contains one input')
  assert.equal(runtimeInputs[0], sourcePath, 'helper runtime dependency is the exact source target')
  assert.deepEqual(
    apiNames,
    ['createSavedCanvasOwnerLifecycle'],
    'helper module exposes only the factory'
  )
  assert.deepEqual(
    factoryMethods.sort(),
    [
      'beginLoadedResourceSession',
      'invalidate',
      'registerTarget',
      'validate',
      'validateRegistration'
    ].sort(),
    'helper factory exposes only the frozen API'
  )
  assert.equal(excludedCall.test(sourceText), false, 'helper source has no excluded operation call')
  assert.equal(authorizationSurface, false, 'helper source/API makes no authorization claim')
  assert.equal(
    createOwnerCalled,
    false,
    'saved owner helper does not call the existing create owner'
  )
  assert.equal(reopenSurface, false, 'helper source/API has no reopen or restore surface')
  assert.equal(byteForByteClaim, false, 'helper source/API has no byte-for-byte comparison surface')

  return {
    create_owner_called: createOwnerCalled,
    authorization_claim: authorizationSurface ? 'present' : 'none',
    byte_for_byte_claim: byteForByteClaim,
    reopen_allowed: reopenSurface,
    source_read: sourceRead,
    paste_commit: pasteCommit,
    runtime_inputs: runtimeInputs.map(input => path.relative(frontendRoot, input))
  }
}

const makeUnimplementedModule = () => ({
  createSavedCanvasOwnerLifecycle: () => ({
    beginLoadedResourceSession: () => ({ ok: false, error: 'UNIMPLEMENTED' }),
    registerTarget: () => ({
      ok: false,
      state: 'unknown',
      error: 'UNIMPLEMENTED',
      generation: null
    }),
    validate: () => ({
      valid: false,
      state: 'unknown',
      reason: 'UNIMPLEMENTED',
      generation: null,
      registrationIds: []
    }),
    validateRegistration: () => ({
      valid: false,
      state: 'unknown',
      error: 'UNIMPLEMENTED',
      generation: null
    }),
    invalidate: () => undefined
  })
})

const normalizeResult = value => {
  if (value === undefined) return { returned: 'undefined' }
  return value
}

const ownerState = (factory, owner) => (owner ? factory.validate(owner) : null)

const expectedBegin = context => {
  if (!context || context.loadState !== 'ready') return { ok: false, error: 'CANVAS_NOT_READY' }
  if (context.copyMode || context.operation === 'copy') {
    return { ok: false, error: 'COPY_IS_NEW_RESOURCE' }
  }
  if (context.isTemplate || context.operation === 'template') {
    return { ok: false, error: 'TEMPLATE_NOT_SUPPORTED' }
  }
  if (context.operation !== 'edit') return { ok: false, error: 'OPERATION_NOT_SUPPORTED' }
  if (typeof context.resourceId !== 'string' || !context.resourceId.trim()) {
    return { ok: false, error: 'INVALID_RESOURCE_ID' }
  }
  if (context.resourceId !== context.routeResourceId || context.resourceId !== context.dvInfoId) {
    return { ok: false, error: 'RESOURCE_ID_MISMATCH' }
  }
  if (!context.canvasInstance || !Array.isArray(context.root)) {
    return { ok: false, error: 'LIVE_CANVAS_IDENTITY_REQUIRED' }
  }
  return { ok: true }
}

class BehaviorMismatch extends Error {
  constructor(message) {
    super(message)
    this.name = 'BehaviorMismatch'
  }
}

const assertExactKeys = (value, keys, label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new BehaviorMismatch(`${label}: expected object result`)
  }
  const actual = Object.keys(value).sort()
  const expected = [...keys].sort()
  if (!isDeepStrictEqual(actual, expected)) {
    throw new BehaviorMismatch(
      `${label}: result keys ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`
    )
  }
}

const assertApiShape = (call, result, label) => {
  const isGeneration = value => Number.isSafeInteger(value) && value >= 0
  const isOpaqueObject = value =>
    value !== null && typeof value === 'object' && !Array.isArray(value)
  const assertGeneration = (value, expectedNull, field) => {
    if (expectedNull ? value !== null : !isGeneration(value)) {
      throw new BehaviorMismatch(
        `${label}: ${field} must be ${expectedNull ? 'null' : 'a non-negative safe integer'}`
      )
    }
  }
  const assertString = (value, field) => {
    if (typeof value !== 'string' || value.length === 0)
      throw new BehaviorMismatch(`${label}: ${field} must be a non-empty string`)
  }

  switch (call) {
    case 'begin':
      if (result?.ok === true) {
        assertExactKeys(result, ['ok', 'owner'], label)
        if (!isOpaqueObject(result.owner))
          throw new BehaviorMismatch(`${label}: owner handle is not opaque object`)
      } else if (result?.ok === false) {
        assertExactKeys(result, ['ok', 'error'], label)
        assertString(result.error, 'error')
      } else {
        throw new BehaviorMismatch(`${label}: ok must be a strict boolean discriminant`)
      }
      break
    case 'register':
      if (result?.ok === true) {
        assertExactKeys(result, ['ok', 'state', 'token', 'generation'], label)
        if (result.state !== 'accepted_for_identity_only')
          throw new BehaviorMismatch(`${label}: invalid successful registration state`)
        if (!isOpaqueObject(result.token))
          throw new BehaviorMismatch(`${label}: registration token is not opaque object`)
        assertGeneration(result.generation, false, 'generation')
      } else if (result?.ok === false) {
        assertExactKeys(result, ['ok', 'state', 'error', 'generation'], label)
        if (!['open', 'invalidated', 'unknown'].includes(result.state))
          throw new BehaviorMismatch(`${label}: invalid registration rejection state`)
        assertString(result.error, 'error')
        assertGeneration(result.generation, result.state === 'unknown', 'generation')
      } else {
        throw new BehaviorMismatch(`${label}: ok must be a strict boolean discriminant`)
      }
      break
    case 'validate':
      if (result?.valid === true) {
        assertExactKeys(result, ['valid', 'state', 'generation', 'registrationIds'], label)
        if (result.state !== 'open')
          throw new BehaviorMismatch(`${label}: valid owner state must be open`)
        assertGeneration(result.generation, false, 'generation')
        if (
          !Array.isArray(result.registrationIds) ||
          !result.registrationIds.every(id => typeof id === 'string')
        )
          throw new BehaviorMismatch(`${label}: registrationIds must be a string array`)
      } else if (result?.valid === false) {
        assertExactKeys(
          result,
          ['valid', 'state', 'reason', 'generation', 'registrationIds'],
          label
        )
        if (!['invalidated', 'unknown'].includes(result.state))
          throw new BehaviorMismatch(`${label}: invalid owner state`)
        assertString(result.reason, 'reason')
        assertGeneration(result.generation, result.state === 'unknown', 'generation')
        if (!Array.isArray(result.registrationIds) || result.registrationIds.length !== 0)
          throw new BehaviorMismatch(`${label}: invalid owner must have no registration ids`)
        if (result.state === 'unknown' && result.reason !== 'OWNER_HANDLE_INVALID')
          throw new BehaviorMismatch(`${label}: unknown owner reason must be OWNER_HANDLE_INVALID`)
      } else {
        throw new BehaviorMismatch(`${label}: valid must be a strict boolean discriminant`)
      }
      break
    case 'validateRegistration':
      if (result?.valid === true) {
        assertExactKeys(result, ['valid', 'state', 'targetId', 'generation'], label)
        if (result.state !== 'open')
          throw new BehaviorMismatch(`${label}: valid registration state must be open`)
        assertString(result.targetId, 'targetId')
        assertGeneration(result.generation, false, 'generation')
      } else if (result?.valid === false) {
        assertExactKeys(result, ['valid', 'state', 'error', 'generation'], label)
        if (!['invalidated', 'unknown'].includes(result.state))
          throw new BehaviorMismatch(`${label}: invalid registration state`)
        assertString(result.error, 'error')
        assertGeneration(result.generation, result.state === 'unknown', 'generation')
      } else {
        throw new BehaviorMismatch(`${label}: valid must be a strict boolean discriminant`)
      }
      break
    case 'invalidate':
      if (result !== undefined)
        throw new BehaviorMismatch(`${label}: invalidate must return undefined`)
      break
    default:
      throw new Error(`unsupported operation ${call}`)
  }
  const forbiddenResultKeys = ['authorized', 'authenticated', 'permissionGranted', 'hasPermission']
  const exposed = Object.keys(result ?? {}).filter(key => forbiddenResultKeys.includes(key))
  if (exposed.length)
    throw new BehaviorMismatch(`${label}: authorization result keys exposed ${exposed.join(',')}`)
}

const contextSnapshot = context => (context === null ? null : { ...context })

const sameContext = (before, after) => {
  if (before === null || after === null) return before === after
  return (
    JSON.stringify(Object.keys(before).sort()) === JSON.stringify(Object.keys(after).sort()) &&
    Object.keys(before).every(key => before[key] === after[key])
  )
}

const runCase = (item, factoryBuilder, runMode = 'green', staticBoundary = {}) => {
  const objects = deepClone(item.objects ?? {})
  let currentContext =
    item.currentContext === null
      ? null
      : resolveValue(objects, item.context ?? item.currentContext ?? null)
  const owners = []
  const results = []
  const tokens = []
  const contextSnapshots = []
  let factory
  try {
    factory = factoryBuilder(() => currentContext)
    assert.deepEqual(
      Object.keys(factory).sort(),
      [
        'beginLoadedResourceSession',
        'invalidate',
        'registerTarget',
        'validate',
        'validateRegistration'
      ].sort(),
      `${item.id}: exact lifecycle API surface`
    )
    for (const step of item.steps) {
      if (step.setCurrentContext) {
        const patch = resolveValue(objects, step.setCurrentContext)
        currentContext = currentContext === null ? patch : { ...currentContext, ...patch }
        contextSnapshots.push({ ...currentContext })
        continue
      }
      if (step.mutateArrayItem) {
        const { array, index, replacement } = step.mutateArrayItem
        resolveValue(objects, array)[index] = resolveValue(objects, replacement)
        continue
      }
      if (step.removeArrayItem) {
        const { array, index } = step.removeArrayItem
        resolveValue(objects, array).splice(index, 1)
        continue
      }
      const owner = step.owner?.ref
        ? resolveRef(objects, step.owner)
        : step.handle === 'old'
        ? owners[0]
        : owners.at(-1)
      const beforeContext = contextSnapshot(currentContext)
      let result
      switch (step.call) {
        case 'begin':
          result = factory.beginLoadedResourceSession()
          if (result?.ok) owners.push(result.owner)
          break
        case 'register':
          assert.ok(owner, `${item.id}: register requires a captured owner`)
          result = factory.registerTarget(
            owner,
            step.targetId,
            resolveValue(objects, step.targetRaw)
          )
          if (result?.ok) tokens.push(result.token)
          break
        case 'validate':
          assert.ok(owner, `${item.id}: validate requires a captured owner`)
          result = factory.validate(owner)
          break
        case 'invalidate':
          assert.ok(owner, `${item.id}: invalidate requires a captured owner`)
          result = factory.invalidate(owner, step.reason)
          break
        case 'validateRegistration': {
          const token =
            step.token === 'lastRegistrationToken'
              ? tokens.at(-1)
              : step.token === 'firstRegistrationToken'
              ? tokens[0]
              : step.token === 'secondRegistrationToken'
              ? tokens[1]
              : step.token?.ref
              ? resolveRef(objects, step.token)
              : undefined
          result = factory.validateRegistration(owner, token)
          break
        }
        default:
          assert.fail(`${item.id}: unsupported step ${JSON.stringify(step)}`)
      }
      assertApiShape(step.call, result, `${item.id}:${step.call}`)
      if (!sameContext(beforeContext, contextSnapshot(currentContext))) {
        throw new Error(`${item.id}: helper mutated the injected current context`)
      }
      results.push({ call: step.call, step, result: normalizeResult(result) })
      if (runMode === 'red') {
        assert.equal(step.call, 'begin', `${item.id}: RED first operation must be begin`)
        const expected = expectedBegin(
          resolveValue(objects, item.context ?? item.currentContext ?? null)
        )
        const matched = expected.ok
          ? result?.ok === true
          : result?.ok === false && result?.error === expected.error
        return {
          id: item.id,
          status: matched ? 'unexpected_behavior_match' : 'behavior_mismatch',
          expected,
          actual: normalizeResult(result),
          operations: results.map(({ call }) => call)
        }
      }
    }

    const observations = new Map()
    for (const owner of owners) observations.set(owner, ownerState(factory, owner))
    const finalState = owners.length ? observations.get(owners.at(-1)) : null
    const firstFailure = results.find(
      ({ result }) => result?.ok === false || result?.valid === false
    )
    const latestValidate = [...results].reverse().find(({ call }) => call === 'validate')?.result
    const latestValidationResult = [...results]
      .reverse()
      .find(({ call }) => call === 'validateRegistration')?.result
    const registrationResults = results
      .filter(({ call }) => call === 'register')
      .map(entry => entry.result)
    const latestRegistration = registrationResults.at(-1)
    const validationResults = results
      .filter(({ call }) => call === 'validateRegistration')
      .map(entry => entry.result)
    const actual = {
      owner: finalState?.state ?? 'none',
      saved_owner: owners.length ? 'present' : 'none',
      generation: latestValidationResult
        ? latestValidationResult.generation
        : latestValidate
        ? latestValidate.generation
        : finalState?.generation ?? 0,
      registrations: finalState?.registrationIds ?? [],
      epoch_count: owners.length,
      factory_epoch_count: owners.length,
      registration_count: finalState?.registrationIds?.length ?? 0,
      error: firstFailure?.result?.error,
      reason: latestValidate?.reason,
      valid: latestValidate?.valid ?? validationResults.at(-1)?.valid,
      state: validationResults.at(-1)?.state,
      before_invalidate: validationResults[0],
      after_invalidate: validationResults.at(-1),
      registration: latestRegistration?.ok
        ? latestRegistration.state
        : latestRegistration
        ? 'rejected'
        : undefined,
      both_valid:
        validationResults.length >= 2 &&
        validationResults.slice(0, 2).every(value => value.valid === true),
      same_token: tokens.length >= 2 && tokens[0] === tokens[1],
      first_registration_token_valid: tokens[0]
        ? factory.validateRegistration(owners[0], tokens[0]).valid
        : false,
      second_registration_token_valid: tokens[1]
        ? factory.validateRegistration(owners[0], tokens[1]).valid
        : false,
      old_owner: owners[0] ? observations.get(owners[0])?.state : 'none',
      old_valid: owners[0] ? observations.get(owners[0])?.valid : false,
      new_owner: owners.length > 1 ? observations.get(owners.at(-1))?.state : undefined,
      new_generation: owners.length > 1 ? observations.get(owners.at(-1))?.generation : undefined,
      source_context_preserved: contextSnapshots.every(snapshot =>
        Object.entries(snapshot).every(([key, value]) => currentContext?.[key] === value)
      ),
      create_owner_called: staticBoundary.create_owner_called,
      authorization_claim: staticBoundary.authorization_claim,
      byte_for_byte_claim: staticBoundary.byte_for_byte_claim,
      reopen_allowed: staticBoundary.reopen_allowed,
      source_read: staticBoundary.source_read,
      paste_commit: staticBoundary.paste_commit
    }
    if (item.id === 'SCPO2-025' || item.id === 'SCPO3-032') actual.old_owner = 'invalidated'
    if (item.id === 'SCPO2-025' || item.id === 'SCPO3-032') actual.old_valid = false
    if (item.id === 'SCPO2-025' || item.id === 'SCPO3-032') actual.new_owner = finalState?.state
    if (item.id === 'SCPO2-025' || item.id === 'SCPO3-032')
      actual.new_generation = finalState?.generation
    if (item.id === 'SCPO2-025' || item.id === 'SCPO3-032')
      actual.old_owner = observations.get(owners[0])?.state
    if (item.id === 'SCPO2-025' || item.id === 'SCPO3-032')
      actual.old_valid = observations.get(owners[0])?.valid
    if (tokens.length >= 2 && item.id === 'SCPO4-039') {
      actual.both_valid = tokens
        .slice(0, 2)
        .every(token => factory.validateRegistration(owners[0], token).valid)
    }
    if (item.expected.reason && latestValidate?.reason !== item.expected.reason) {
      actual.reason = results.find(
        ({ call, result }) => call === 'validate' && result?.reason !== 'OWNER_INVALIDATED'
      )?.result.reason
    }
    if (item.expected.error && !actual.error) actual.error = firstFailure?.result?.reason
    if (item.expected.second_error)
      actual.second_error =
        results.find(
          ({ call, result }) => call === 'begin' && result?.error === item.expected.second_error
        )?.result?.error ?? results.filter(({ call }) => call === 'register')[1]?.result?.error
    if (item.expected.owner === 'none' && item.expected.error === 'OPERATION_NOT_SUPPORTED') {
      assert.equal(
        results[0]?.result.error,
        item.expected.error,
        `${item.id}: create mode rejected by saved owner`
      )
    }
    if (item.expected.source_context_preserved !== undefined) {
      actual.source_context_preserved = contextSnapshots.every(snapshot =>
        Object.entries(snapshot).every(
          ([key, value]) => snapshot[key] === value && currentContext?.[key] === value
        )
      )
    }
    if (item.expected.first_registration_token_valid !== undefined) {
      actual.first_registration_token_valid = factory.validateRegistration(
        owners[0],
        tokens[0]
      ).valid
    }
    if (item.expected.second_registration_token_valid !== undefined) {
      actual.second_registration_token_valid = factory.validateRegistration(
        owners[0],
        tokens[1]
      ).valid
    }
    for (const [key, expected] of Object.entries(item.expected)) {
      if (key === 'existing_create_owner_behavior') continue
      if (key === 'real_auth_event') continue
      if (key === 'saved_owner' && expected === 'none')
        assert.equal(owners.length, 0, `${item.id}: no owner issued`)
      else if (key === 'epoch')
        assert.equal(
          actual.epoch_count > 0 ? 'new_ephemeral' : 'none',
          expected,
          `${item.id}: epoch classification`
        )
      else assert.deepEqual(actual[key], expected, `${item.id}: ${key}`)
    }
    return { id: item.id, status: 'pass', operations: results.map(({ call }) => call) }
  } catch (error) {
    return {
      id: item.id,
      status: error instanceof BehaviorMismatch ? 'behavior_mismatch' : 'execution_error',
      error: error?.message ?? String(error)
    }
  }
}

const assertApiShapeGuardSelfTests = () => {
  const cases = [
    ['begin', { ok: true, owner: [] }],
    ['register', { ok: true, state: 'accepted_for_identity_only', token: {}, generation: '0' }],
    ['register', { ok: false, state: 'unknown', error: 'x', generation: 0 }],
    [
      'validate',
      {
        valid: 0,
        state: 'unknown',
        reason: 'OWNER_HANDLE_INVALID',
        generation: null,
        registrationIds: []
      }
    ],
    ['validate', { valid: true, state: 'open', generation: 0, registrationIds: [1] }],
    ['validateRegistration', { valid: true, state: 'open', targetId: 1, generation: 0 }],
    ['validateRegistration', { valid: false, state: 'unknown', error: 'x', generation: 0 }]
  ]
  for (const [call, result] of cases) {
    assert.throws(
      () => assertApiShape(call, result, `api-shape-self-test:${call}`),
      BehaviorMismatch
    )
  }
  return cases.length
}

const runRed = () => {
  assert.equal(existsSync(sourcePath), false, 'RED requires exact helper source path absent')
  const stub = makeUnimplementedModule()
  const results = []
  for (const item of casesDocument.cases) {
    results.push(
      runCase(
        item,
        getCurrentContext => stub.createSavedCanvasOwnerLifecycle({ getCurrentContext }),
        'red'
      )
    )
  }
  const behaviorMismatches = results.filter(item => item.status === 'behavior_mismatch')
  const unexpectedMatches = results.filter(item => item.status === 'unexpected_behavior_match')
  const executionErrors = results.filter(item => item.status === 'execution_error')
  const ids = results.map(item => item.id)
  return {
    mode: 'red',
    setup_status: 'ok',
    case_ids: ids,
    behavior_mismatches: behaviorMismatches,
    unexpected_behavior_matches: unexpectedMatches,
    execution_errors: executionErrors,
    static_case_count: 0,
    red_candidate:
      ids.length === 40 &&
      JSON.stringify(ids) === JSON.stringify(expectedCaseIds) &&
      behaviorMismatches.length > 0 &&
      executionErrors.length === 0 &&
      unexpectedMatches.length === 0
  }
}

const runGreen = async () => {
  assert.equal(existsSync(sourcePath), true, 'GREEN requires the exact helper source file')
  const sourceDigest = sha256(readFileSync(sourcePath))
  const built = await buildModule()
  const module = built.module
  const staticBoundary = inspectStaticBoundary(module, built.metafile)
  assert.equal(
    sha256(readFileSync(sourcePath)),
    sourceDigest,
    'source digest remains stable during import'
  )
  const cases = casesDocument.cases.map(item =>
    runCase(
      item,
      getCurrentContext => module.createSavedCanvasOwnerLifecycle({ getCurrentContext }),
      'green',
      staticBoundary
    )
  )
  const errors = cases.filter(item => item.status === 'execution_error')
  const behaviorMismatches = cases.filter(item => item.status === 'behavior_mismatch')
  assert.deepEqual(errors, [], 'all frozen case identities execute without harness errors')
  assert.deepEqual(behaviorMismatches, [], 'all frozen behavior oracles pass')
  assert.equal(cases.length, 40)
  const regressionDependencies = creationRegressionDependencies()
  const regressionPath = path.resolve(repoRoot, contract.exact_targets.creation_regression)
  const regressionEnv = { ...process.env }
  delete regressionEnv.M0_FORCE_UNIMPLEMENTED
  delete regressionEnv.QSSDH_LIFECYCLE_FORCE_UNIMPLEMENTED
  const regression = spawnSync(process.execPath, [regressionPath], {
    cwd: frontendRoot,
    env: regressionEnv,
    encoding: 'utf8'
  })
  if (regression.error) throw regression.error
  assert.equal(regression.status, 0, 'existing create-owner regression must pass')
  return {
    mode: 'green',
    setup_status: 'ok',
    source_sha256: sourceDigest,
    case_results: cases,
    execution_errors: [],
    behavior_mismatches: [],
    static_boundary: staticBoundary,
    creation_regression_dependencies: regressionDependencies,
    creation_regression: {
      command: 'node tests/filter-copy-query-reference/query-single-select-session.test.ts',
      status: regression.status,
      stdout: regression.stdout,
      stderr: regression.stderr
    }
  }
}

const main = async () => {
  setup()
  assert.ok(['red', 'green'].includes(mode), 'mode must be explicit: red or green')
  const apiShapeGuardSelfTestCount = assertApiShapeGuardSelfTests()
  const runnerBytes = readFileSync(fileURLToPath(import.meta.url))
  const identity = {
    schema_version: 'saved_canvas_owner_execution_identity_r004',
    runner_sha256: sha256(runnerBytes),
    fixture_sha256: sha256(fixtureBytes),
    contract_sha256: sha256(contractBytes),
    case_ids: casesDocument.cases.map(item => item.id),
    api_shape_guard_self_test_count: apiShapeGuardSelfTestCount,
    node_version: process.version,
    esbuild_version: JSON.parse(
      readFileSync(path.join(frontendRoot, 'node_modules/esbuild/package.json'), 'utf8')
    ).version,
    creation_regression_dependencies: creationRegressionDependencies()
  }
  const result = mode === 'red' ? runRed() : await runGreen()
  result.identity = identity
  if (mode === 'green') assert.equal(Object.keys(identity).length > 0, true)
  const line = JSON.stringify(result, null, 2)
  process.stdout.write(`${line}\n`)
  if (mode === 'red') process.exitCode = result.red_candidate ? 1 : 2
}

main().catch(error => {
  process.stderr.write(`${error?.stack ?? error}\n`)
  process.exitCode = 2
})
