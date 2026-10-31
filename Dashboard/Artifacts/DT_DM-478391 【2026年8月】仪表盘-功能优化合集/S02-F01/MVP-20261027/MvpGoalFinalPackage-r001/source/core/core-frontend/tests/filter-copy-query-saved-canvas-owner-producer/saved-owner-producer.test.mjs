import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { build } from 'esbuild'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const testDir = path.dirname(fileURLToPath(import.meta.url))
const frontendRoot = path.resolve(testDir, '../..')
const repoRoot = path.resolve(frontendRoot, '../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const casesPath = path.join(featureRoot, 'QueryProductCommitSavedOwnerProducerCases-r004.json')
const contractPath = path.join(
  featureRoot,
  'QueryProductCommitSavedOwnerProducerContract-r002.json'
)
const sourcePath = path.join(
  frontendRoot,
  'src/custom-component/filter-copy/saved-owner-producer.ts'
)
const casesBytes = readFileSync(casesPath)
const contractBytes = readFileSync(contractPath)
const casesDocument = JSON.parse(casesBytes.toString('utf8'))
const contract = JSON.parse(contractBytes.toString('utf8'))
const caseIds = casesDocument.case_order
const mode = process.argv[2] === '--mode' ? process.argv[3] : undefined
const sha256 = value => createHash('sha256').update(value).digest('hex')

const setup = () => {
  assert.equal(process.version, 'v24.21.0', 'pinned Node runtime')
  assert.equal(contract.revision, 'r002', 'frozen producer contract revision')
  assert.equal(casesDocument.revision, 'r004', 'frozen producer cases revision')
  assert.equal(casesDocument.contract_ref, 'QueryProductCommitSavedOwnerProducerContract-r002.json')
  assert.equal(casesDocument.cases.length, 14, 'all producer cases are present')
  assert.deepEqual(
    casesDocument.cases.map(item => item.case_id),
    caseIds,
    'declared producer case order'
  )
  assert.equal(new Set(caseIds).size, 14, 'producer case IDs are unique')
  assert.ok(casesDocument.cases.every(item => item.status === 'DESIGN_ONLY'))
}

const unimplementedFactory = () => {
  const fail = () => ({ ok: false, error: 'UNIMPLEMENTED' })
  return {
    beginLoad: fail,
    startPublication: fail,
    recordSetter: fail,
    finishPublication: fail,
    failPublication: fail,
    validateOwner: fail,
    invalidate: fail,
    getSnapshot: () => ({ status: 'unknown', owner: null, generation: null })
  }
}

const loadImplementation = async () => {
  assert.ok(existsSync(sourcePath), 'producer source must exist for GREEN')
  const bundle = await build({
    entryPoints: [sourcePath],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    metafile: true
  })
  const module = await import(
    `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
  )
  return { module, metafile: bundle.metafile }
}

const objectFor = label => ({ label })
const assertNoOwner = (producer, expectedStatus) => {
  const snapshot = producer.getSnapshot()
  assert.equal(snapshot.owner, null)
  if (expectedStatus) assert.equal(snapshot.status, expectedStatus)
  return snapshot
}

const publish = (producer, { mode = 'saved_edit', resourceId = 'R1', identity = 'I1' } = {}) => {
  const root = objectFor(resourceId === 'R1' ? 'ROOT1' : `ROOT-${resourceId}`)
  const target = objectFor(resourceId === 'R1' ? 'TARGET1' : `TARGET-${resourceId}`)
  const ticketResult = producer.beginLoad({
    mode,
    requestedResourceId: resourceId,
    providerIdentityGeneration: identity
  })
  assert.equal(ticketResult.ok, true)
  const ticket = ticketResult.ticket
  assert.equal(producer.startPublication(ticket, resourceId).ok, true)
  for (const field of ['resource_metadata', 'component_root', 'style', 'view']) {
    assert.equal(producer.recordSetter(ticket, field).ok, true)
    assert.equal(producer.getSnapshot().owner, null, `${field}: owner stays absent before mint`)
  }
  const result = producer.finishPublication(ticket, {
    rootRawRef: root,
    targets: [{ id: `VQ-${resourceId}`, type: 'VQuery', rawRef: target }],
    providerIdentityGeneration: identity
  })
  assert.equal(result.ok, true)
  return { ticket, owner: result.owner, root, target }
}

const runCase = (producer, testCase) => {
  switch (testCase.case_id) {
    case 'QPC-PROD-001': {
      const { owner, root, target } = publish(producer)
      const minted = {
        resource_id: owner.resourceId,
        generation: owner.generation,
        root_raw_ref: owner.rootRawRef.label,
        target_raw_ref: owner.targetRawRef.label
      }
      assert.deepEqual(minted, testCase.expected.owner_snapshot_at_mint)
      const valid = producer.validateOwner(owner, {
        generation: owner.generation,
        resourceId: 'R1',
        rootRawRef: root,
        targets: [{ id: 'VQ-R1', type: 'VQuery', rawRef: target }],
        providerIdentityGeneration: 'I1'
      })
      assert.equal(valid.ok, true)
      assert.equal(valid.owner.rootRawRef, testCase.expected.next_tick_root_raw_ref === 'ROOT1' ? root : null)
      assert.equal(valid.owner.targetRawRef, testCase.expected.next_tick_target_raw_ref === 'TARGET1' ? target : null)
      assert.equal(valid.owner.generation, minted.generation)
      assert.equal(producer.getSnapshot().owner, owner)
      break
    }
    case 'QPC-PROD-002': {
      const ticket = producer.beginLoad({ mode: 'saved_edit', requestedResourceId: 'R1' }).ticket
      const before = producer.getSnapshot()
      const result = producer.startPublication(ticket, 'R2')
      assert.deepEqual(result, { ok: false, reason: 'resource_id_mismatch' })
      assert.deepEqual(producer.getSnapshot(), before)
      break
    }
    case 'QPC-PROD-003': {
      const stale = producer.beginLoad({ mode: 'saved_edit', requestedResourceId: 'R1' }).ticket
      const current = producer.beginLoad({ mode: 'saved_edit', requestedResourceId: 'R2' }).ticket
      const before = producer.getSnapshot()
      assert.deepEqual(producer.startPublication(stale, 'R1'), { ok: false, reason: 'stale_generation' })
      assert.deepEqual(producer.getSnapshot(), before)
      assert.equal(producer.getSnapshot().generation, current.generation)
      break
    }
    case 'QPC-PROD-004': {
      const ticket = producer.beginLoad({ mode: 'saved_edit', requestedResourceId: 'R1' }).ticket
      assert.equal(producer.startPublication(ticket, 'R1').ok, true)
      for (const field of ['resource_metadata', 'component_root']) {
        assert.equal(producer.recordSetter(ticket, field).ok, true)
        assertNoOwner(producer, 'publishing')
      }
      assert.deepEqual(producer.failPublication(ticket, 'style_setter_throws'), {
        ok: false,
        reason: 'partial_publication_failed'
      })
      const failed = assertNoOwner(producer, 'publication_failed')
      assert.equal(failed.generation, ticket.generation)
      const retry = producer.beginLoad({ mode: 'saved_edit', requestedResourceId: 'R1' })
      assert.equal(retry.ok, true)
      assert.equal(retry.ticket.generation, ticket.generation + 1)
      break
    }
    case 'QPC-PROD-005': {
      const first = publish(producer)
      const restored = publish(producer, { mode: 'cache_restore', resourceId: 'R1' })
      assert.notEqual(restored.owner, first.owner)
      assert.equal(restored.owner.generation, first.owner.generation + 1)
      assert.deepEqual(
        producer.validateOwner(first.owner, {
          generation: restored.owner.generation,
          resourceId: 'R1',
          rootRawRef: restored.root,
          targets: [{ id: 'VQ-R1', type: 'VQuery', rawRef: restored.target }],
          providerIdentityGeneration: 'I1'
        }),
        { ok: false, reason: 'owner_invalidated' }
      )
      break
    }
    case 'QPC-PROD-006': {
      const ticket = producer.beginLoad({ mode: 'cache_restore', requestedResourceId: 'R1' }).ticket
      const before = producer.getSnapshot()
      assert.deepEqual(producer.startPublication(ticket, 'R2'), {
        ok: false,
        reason: 'resource_id_mismatch'
      })
      assert.deepEqual(producer.getSnapshot(), before)
      break
    }
    case 'QPC-PROD-007': {
      const variants = [
        { targets: () => [], reason: 'target_missing' },
        {
          targets: target => [
            { id: 'VQ-R1', type: 'VQuery', rawRef: target },
            { id: 'VQ-R1-copy', type: 'VQuery', rawRef: objectFor('duplicate') }
          ],
          reason: 'target_ambiguous'
        },
        {
          targets: () => [
            { id: 'VQ-R1', type: 'VQuery', rawRef: objectFor('replacement') }
          ],
          reason: 'target_raw_identity_changed'
        }
      ]
      assert.deepEqual(
        variants.map(variant => variant.reason),
        testCase.expected.reasons,
        'each invalidation variant follows the frozen case oracle'
      )
      for (const variant of variants) {
        const variantProducer = producer.module.createSavedCanvasOwnerStoreProducer()
        const { owner, root, target } = publish(variantProducer)
        const generation = variantProducer.getSnapshot().generation
        const targets = variant.targets(target)
        const result = variantProducer.validateOwner(owner, {
          generation: owner.generation,
          resourceId: 'R1',
          rootRawRef: root,
          targets,
          providerIdentityGeneration: 'I1'
        })
        assert.deepEqual(
          result,
          { ok: false, reason: variant.reason },
          `isolated ${variant.reason} invalidation`
        )
        assert.deepEqual(
          variantProducer.getSnapshot(),
          { status: testCase.expected.owner, generation: generation + 1, owner: null },
          `${variant.reason} invalidates and clears the current owner`
        )
        assert.deepEqual(
          variantProducer.validateOwner(owner, {
            generation,
            resourceId: 'R1',
            rootRawRef: root,
            targets,
            providerIdentityGeneration: 'I1'
          }),
          { ok: false, reason: 'owner_invalidated' },
          `${variant.reason} rejects the previously published owner`
        )
        assert.equal(
          variantProducer.getSnapshot().generation,
          generation + 1,
          `${variant.reason} does not advance generation twice`
        )
      }
      assert.equal(producer.callCounts.sourceRead, testCase.expected.source_read_calls)
      assert.equal(producer.callCounts.targetCommit, testCase.expected.target_commit_calls)
      break
    }
    case 'QPC-PROD-008':
    case 'QPC-PROD-009': {
      const { owner } = publish(producer)
      const nextIdentity = testCase.case_id.endsWith('008') ? 'P2' : 'O2'
      const reason = testCase.case_id.endsWith('008') ? 'principal_changed' : 'organization_changed'
      assert.equal(producer.invalidate(owner, reason, nextIdentity).ok, true)
      assertNoOwner(producer, 'invalid')
      assert.deepEqual(
        producer.validateOwner(owner, {
          generation: owner.generation,
          resourceId: 'R1',
          rootRawRef: owner.rootRawRef,
          targets: [{ id: owner.targetId, type: 'VQuery', rawRef: owner.targetRawRef }],
          providerIdentityGeneration: nextIdentity
        }),
        { ok: false, reason: 'owner_invalidated' }
      )
      break
    }
    case 'QPC-PROD-010':
    case 'QPC-PROD-011':
    case 'QPC-PROD-012': {
      const modeByCase = {
        'QPC-PROD-010': 'copy_as_new',
        'QPC-PROD-011': 'template_create',
        'QPC-PROD-012': 'preview_embed'
      }
      const result = producer.beginLoad({
        mode: modeByCase[testCase.case_id],
        requestedResourceId: 'R1'
      })
      assert.deepEqual(result, { ok: false, reason: 'mode_not_supported' })
      assert.equal(producer.getSnapshot().owner, null)
      break
    }
    case 'QPC-PROD-013': {
      const { owner } = publish(producer)
      const generation = producer.getSnapshot().generation
      assert.equal(producer.invalidate(owner, 'dashboard_unmount').ok, true)
      assertNoOwner(producer, 'invalid')
      assert.equal(producer.getSnapshot().generation, generation + 1)
      assert.equal(producer.invalidate(owner, 'dashboard_unmount').ok, false)
      assert.equal(producer.getSnapshot().generation, generation + 1)
      break
    }
    case 'QPC-PROD-014': {
      const { module } = producer
      assert.deepEqual(Object.keys(module).sort(), ['createSavedCanvasOwnerStoreProducer'])
      const api = producer.api
      const forbidden = /readDesign|sourceRead|copy|paste|commit|permission|preview|query|save/i
      assert.ok(Object.keys(api).every(name => !forbidden.test(name)))
      assert.equal(producer.callCounts.sourceRead, 0)
      assert.equal(producer.callCounts.targetCommit, 0)
      break
    }
    default:
      throw new Error(`unhandled frozen case ${testCase.case_id}`)
  }
}

const main = async () => {
  if (!['red', 'green'].includes(mode)) throw new Error('usage: --mode red|green')
  setup()
  if (mode === 'red') assert.equal(existsSync(sourcePath), false, 'source absent precondition')
  let module
  let bundleInputs = []
  if (mode === 'green') {
    const loaded = await loadImplementation()
    module = loaded.module
    bundleInputs = Object.keys(loaded.metafile.inputs).map(item => path.resolve(frontendRoot, item))
    assert.deepEqual(bundleInputs, [sourcePath], 'only the exact producer source is bundled')
  }
  const mismatch = []
  const executionErrors = []
  const staticCaseIds = []
  const reached = []
  for (const testCase of casesDocument.cases) {
    reached.push(testCase.case_id)
    const producerModule = module ?? { createSavedCanvasOwnerStoreProducer: unimplementedFactory }
    let api
    try {
      api = producerModule.createSavedCanvasOwnerStoreProducer()
      const context = {
        ...api,
        module: producerModule,
        api,
        callCounts: { sourceRead: 0, targetCommit: 0 }
      }
      runCase(context, testCase)
      if (testCase.case_id === 'QPC-PROD-014') staticCaseIds.push(testCase.case_id)
    } catch (error) {
      if (error instanceof assert.AssertionError) mismatch.push({ case_id: testCase.case_id, message: error.message })
      else executionErrors.push({ case_id: testCase.case_id, name: error?.name, message: error?.message })
    }
  }
  const identity = {
    setup_status: 'ok',
    mode,
    node: process.version,
    case_ids: reached,
    cases_sha256: sha256(casesBytes),
    contract_sha256: sha256(contractBytes),
    source_path: path.relative(repoRoot, sourcePath),
    source_exists: existsSync(sourcePath),
    source_sha256: existsSync(sourcePath) ? sha256(readFileSync(sourcePath)) : null,
    bundle_inputs: bundleInputs.map(item => path.relative(repoRoot, item)),
    behavior_mismatch_count: mismatch.length,
    static_case_count: staticCaseIds.length,
    static_case_ids: staticCaseIds,
    execution_error_count: executionErrors.length,
    behavior_mismatches: mismatch,
    execution_errors: executionErrors
  }
  process.stdout.write(`${JSON.stringify(identity)}\n`)
  if (executionErrors.length) process.exitCode = 2
  else if (
    mode === 'red' &&
    mismatch.length === caseIds.length - 1 &&
    staticCaseIds.length === 1 &&
    reached.length === caseIds.length
  )
    process.exitCode = 1
  else if (mode === 'green' && mismatch.length === 0 && reached.length === caseIds.length) process.exitCode = 0
  else process.exitCode = 2
}

main().catch(error => {
  process.stderr.write(`${error?.stack ?? error}\n`)
  process.exitCode = 2
})
