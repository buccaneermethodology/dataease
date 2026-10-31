import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const featureRoot = path.join(
  repoRoot,
  'Dashboard/Artifacts/DT_DM-478391 【2026年8月】仪表盘-功能优化合集/S02-F01'
)
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-single-select-session.ts'
)
const carrierCases = JSON.parse(
  readFileSync(path.join(featureRoot, 'QuerySingleSelectCarrierFixtures-r001.json'), 'utf8')
)
const contract = JSON.parse(
  readFileSync(path.join(featureRoot, 'QuerySingleSelectPreparationCaptureCases-r001.json'), 'utf8')
)
const lifecycleCaseIndex = JSON.parse(
  readFileSync(
    path.join(featureRoot, 'QuerySingleSelectLifecycleImplementationCases-r001.json'),
    'utf8'
  )
)

let prepareConfirmation: (input: unknown) => any
let captureSave: (input: unknown) => any
let createQuerySingleSelectLifecycleOwner: () => any
if (process.env.M0_FORCE_UNIMPLEMENTED === '1') {
  prepareConfirmation = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
  captureSave = () => ({ ok: false, reason: 'UNIMPLEMENTED' })
  createQuerySingleSelectLifecycleOwner = () => ({
    beginSession: () => ({ ok: false, reason: 'UNIMPLEMENTED' })
  })
} else {
  const bundle = await build({
    stdin: {
      contents:
        "export { prepareConfirmation, captureSave, createQuerySingleSelectLifecycleOwner } from './src/custom-component/filter-copy/query-single-select-session.ts'",
      resolveDir: path.join(repoRoot, 'core/core-frontend')
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node'
  })
  const module = await import(
    `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
  )
  prepareConfirmation = module.prepareConfirmation
  captureSave = module.captureSave
  createQuerySingleSelectLifecycleOwner =
    process.env.QSSDH_LIFECYCLE_FORCE_UNIMPLEMENTED === '1'
      ? () => ({ beginSession: () => ({ ok: false, reason: 'UNIMPLEMENTED' }) })
      : module.createQuerySingleSelectLifecycleOwner
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const canonical = (value: any): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object')
    return `{${Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`
  return JSON.stringify(value)
}
const carrierInput = carrierCases.cases[0].input
assert.deepEqual(
  contract.cases.map((item: { id: string }) => item.id),
  ['M0-PREP-001', 'M0-PREP-002', 'M0-CAP-001', 'M0-CAP-002', 'M0-CAP-003', 'M0-CAP-004']
)

const outerRoot = [
  {
    id: 'query-1',
    component: 'VQuery',
    innerType: 'VQuery',
    label: 'KEEP label',
    propValue: [],
    cascade: [],
    style: { width: 400 }
  }
]
const prepareInput = {
  queryRoot: carrierInput,
  outerRoot,
  componentId: 'query-1',
  revision: 4,
  expectedRevision: 4,
  commitId: 'commit-4'
}
const prep = prepareConfirmation(prepareInput)
assert.equal(prep.ok, true, 'M0-PREP-001: valid current revision prepares detached projections')
assert.equal(prep.value.designRoot[0].label, 'KEEP label')
assert.notDeepEqual(prep.value.designRoot[0].propValue, prep.value.runtimeRoot[0].propValue)
assert.deepEqual(prepareInput.outerRoot, outerRoot, 'preparation leaves input unchanged')
assert.deepEqual(
  prepareConfirmation({ ...prepareInput, revision: 3 }).reason,
  'STALE_PREPARE',
  'M0-PREP-002 stale revision rejects'
)
assert.equal(prepareConfirmation({ ...prepareInput, outerRoot: [] }).reason, 'COMPONENT_NOT_FOUND')
assert.equal(
  prepareConfirmation({ ...prepareInput, revision: -1, expectedRevision: -1 }).reason,
  'STALE_PREPARE'
)
assert.equal(
  prepareConfirmation({
    ...prepareInput,
    outerRoot: [{ ...outerRoot[0], component: 'VText' }]
  }).reason,
  'INVALID_TARGET'
)
const cyclicRoot: any = []
cyclicRoot.push(cyclicRoot)
assert.equal(
  prepareConfirmation({ ...prepareInput, outerRoot: cyclicRoot }).reason,
  'INVALID_INPUT'
)

const saveInput = {
  componentData: [
    { id: 'tmp', component: 'GroupArea' },
    { id: 'view', component: 'UserView', linkageFilters: [{ id: 'x' }] },
    {
      id: 'group',
      component: 'Group',
      propValue: [{ id: 'child', linkageFilters: [{ id: 'y' }] }]
    },
    {
      id: 'tabs',
      component: 'DeTabs',
      propValue: [{ componentData: [{ id: 'tabChild', linkageFilters: [{ id: 'z' }] }] }]
    },
    {
      id: 'query-1',
      component: 'VQuery',
      innerType: 'VQuery',
      propValue: clone(carrierInput.propValue),
      cascade: []
    }
  ],
  canvasStyleData: { width: 1600, nested: { color: 'blue' } },
  canvasViewInfo: { page: { id: 'p1' } },
  appData: { datasetFolderPid: 'folder-ds', datasetFolderName: 'datasets', marker: 'keep' },
  queryDesignOverlay: {
    componentId: 'query-1',
    commitId: 'commit-4',
    propValue: clone(carrierInput.propValue),
    cascade: []
  },
  dvInfo: {
    id: 'dv-1',
    optType: 'edit',
    name: ' Sales ',
    type: 'dashboard',
    pid: 'folder-1',
    datasetFolderPid: 'folder-ds',
    datasetFolderName: 'datasets',
    extra: { keep: true }
  },
  checkVersion: 'v3',
  contentId: 'content-new'
}
const before = clone(saveInput)
const captured = captureSave(saveInput)
assert.equal(captured.ok, true, 'M0-CAP-001 complete update capture succeeds')
assert.equal(captured.value.method, 'updateCanvas')
assert.deepEqual(captured.value.dvNameCheck, {
  opt: 'edit',
  nodeType: 'leaf',
  name: 'Sales',
  type: 'dashboard',
  id: 'dv-1'
})
assert.equal(captured.value.payload.pid, 'folder-1')
assert.equal(captured.value.payload.watermarkInfo, null)
assert.deepEqual(captured.value.appCanvasNameCheck, {
  datasetFolderPid: 'folder-ds',
  datasetFolderName: 'datasets'
})
assert.deepEqual(captured.value.payload.appData, before.appData)
assert.deepEqual(captured.value.payload.canvasViewInfo, before.canvasViewInfo)
assert.deepEqual(JSON.parse(captured.value.payload.canvasStyleData), before.canvasStyleData)
const savedComponents = JSON.parse(captured.value.payload.componentData)
assert.equal(
  savedComponents.some((item: any) => item.component === 'GroupArea'),
  false
)
assert.deepEqual(savedComponents.find((item: any) => item.id === 'view').linkageFilters, [])
assert.deepEqual(
  savedComponents.find((item: any) => item.id === 'group').propValue[0].linkageFilters,
  []
)
assert.deepEqual(
  savedComponents.find((item: any) => item.id === 'tabs').propValue[0].componentData[0]
    .linkageFilters,
  []
)
assert.deepEqual(
  savedComponents.find((item: any) => item.id === 'query-1').propValue,
  carrierInput.propValue,
  'captured document applies detached design overlay'
)
assert.deepEqual(saveInput, before, 'capture does not mutate current document')
const originalDigest = captured.value.intentDigest
const digestPayload = clone(captured.value.payload)
delete digestPayload.contentId
delete digestPayload.checkVersion
assert.equal(
  originalDigest,
  createHash('sha256').update(canonical(digestPayload)).digest('hex'),
  'M0-CAP-001 digest covers full canonical payload except contentId/checkVersion'
)
const changedEnvelope = captureSave({ ...before, contentId: 'another-id', checkVersion: 'v4' })
assert.equal(changedEnvelope.value.intentDigest, originalDigest)
saveInput.canvasStyleData.nested.color = 'red'
assert.equal(
  captured.value.intentDigest,
  originalDigest,
  'M0-CAP-003 capture remains detached after later edits'
)

const create = captureSave({
  ...before,
  contentId: 'content-2',
  dvInfo: { id: null, optType: null, name: ' New ' }
})
assert.equal(create.value.method, 'saveCanvas', 'M0-CAP-002 create uses saveCanvas')
assert.equal(create.value.payload.name, 'New')
assert.equal(
  captureSave({ ...before, dvInfo: { ...before.dvInfo, name: '  ' } }).reason,
  'INVALID_NAME'
)
assert.equal(
  captureSave({ ...before, dvInfo: { ...before.dvInfo, name: 4 } }).reason,
  'INVALID_NAME'
)
let getterCalls = 0
const accessor = clone(before)
Object.defineProperty(accessor.dvInfo, 'sensitive', {
  enumerable: true,
  get() {
    getterCalls += 1
    return 'x'
  }
})
assert.equal(captureSave(accessor).reason, 'INVALID_INPUT', 'M0-CAP-004 accessor input rejects')
assert.equal(getterCalls, 0)
assert.deepEqual(lifecycleCaseIndex.must_execute_in_harness, [
  'M0-PREP-001',
  'M0-PREP-002',
  'M0-CAP-001',
  'M0-CAP-002',
  'M0-CAP-003',
  'M0-CAP-004',
  'LC4-SAVE-14',
  'LC4-SAVE-15',
  'LC4-SAVE-16',
  'LC4-PUBLISH-02',
  'LC4-PUBLISH-03',
  'LC3-PUBLISH-01',
  'LC3-HISTORY-01',
  'LC3-HISTORY-02',
  'LC3-HISTORY-03',
  'LC3-HISTORY-04',
  'LC3-SNAPSHOT-01'
])
assert.equal(
  typeof createQuerySingleSelectLifecycleOwner,
  'function',
  'LC4-SAVE-14: lifecycle owner API is implemented'
)
const lifecycle = createQuerySingleSelectLifecycleOwner()
const session = lifecycle.beginSession({
  resourceId: null,
  isTemplate: false,
  createInitCompleted: true,
  rootEmpty: true
})
assert.equal(session.ok, true, 'LC4-SAVE-14: verified non-template new dashboard begins a session')
assert.equal(
  createQuerySingleSelectLifecycleOwner().beginSession({
    resourceId: null,
    isTemplate: true,
    createInitCompleted: true,
    rootEmpty: true
  }).reason,
  'INELIGIBLE_SOURCE',
  'templates cannot mint a new-session source'
)
const rawQuery = {
  id: 'query-1',
  component: 'VQuery',
  innerType: 'VQuery',
  propValue: [],
  cascade: [],
  style: { width: 550 }
}
assert.equal(lifecycle.registerPending(rawQuery, 1).ok, true)
const lifecyclePrepared = lifecycle.prepareConfirmation({
  component: rawQuery,
  queryRoot: carrierInput,
  outerRoot: [rawQuery],
  componentId: 'query-1',
  expectedRevision: 0,
  nextCommitId: 'commit-1'
})
assert.equal(lifecyclePrepared.ok, true, 'confirmation is prepared without publishing')
const stalePublish = lifecycle.commitConfirmation(lifecyclePrepared, 2, {
  replaceRoot() {
    throw new Error('must not execute')
  },
  select() {
    throw new Error('must not execute')
  },
  publishEvents() {
    throw new Error('must not execute')
  }
})
assert.equal(stalePublish.reason, 'STALE_PREPARE', 'LC4-PUBLISH-02 rejects before writes')
let publishedRoot: any[] = []
let selected: any
let eventPairs = 0
assert.equal(
  lifecycle.commitConfirmation(lifecyclePrepared, 0, {
    replaceRoot(root) {
      publishedRoot = root
    },
    select(component) {
      selected = component
    },
    publishEvents() {
      eventPairs += 1
    }
  }).ok,
  true,
  'LC3-PUBLISH-01: successful confirmation publishes one root and one event pair'
)
assert.equal(publishedRoot[0], selected)
assert.equal(lifecycle.readDesign(selected).ok, true)
const throwingPrepared = lifecycle.prepareConfirmation({
  component: selected,
  queryRoot: carrierInput,
  outerRoot: publishedRoot,
  componentId: 'query-1',
  expectedRevision: 1,
  nextCommitId: 'commit-2'
})
let partialRootWritten = false
assert.throws(
  () =>
    lifecycle.commitConfirmation(throwingPrepared, 1, {
      replaceRoot() {
        partialRootWritten = true
      },
      select() {
        throw new Error('selection failed')
      },
      publishEvents() {
        eventPairs += 1
      }
    }),
  /selection failed/,
  'LC4-PUBLISH-03 propagates the original publish exception'
)
assert.equal(partialRootWritten, true)
assert.equal(eventPairs, 1, 'publish failure emits no confirmation event pair')
assert.equal(
  lifecycle.getState().authenticated,
  false,
  'failed publish invalidates session capability'
)

const historyOwner = createQuerySingleSelectLifecycleOwner()
assert.equal(
  historyOwner.beginSession({
    resourceId: null,
    isTemplate: false,
    createInitCompleted: true,
    rootEmpty: true
  }).ok,
  true
)
const historyRaw = { ...rawQuery }
historyOwner.registerPending(historyRaw, 1)
const historyPreparedConfirmation = historyOwner.prepareConfirmation({
  component: historyRaw,
  queryRoot: carrierInput,
  outerRoot: [historyRaw, { id: 'chart-1', component: 'UserView', linkageFilters: [] }],
  componentId: 'query-1',
  expectedRevision: 0
})
let historyRoot: any[] = []
let historySelected: any
historyOwner.commitConfirmation(historyPreparedConfirmation, 0, {
  replaceRoot(root) {
    historyRoot = root
  },
  select(component) {
    historySelected = component
  },
  publishEvents() {
    return undefined
  }
})
const rawSnapshotRoot = clone(historyRoot)
rawSnapshotRoot[1].name = 'later chart edit'
const rawSnapshot = { componentData: rawSnapshotRoot, dvInfo: { id: null, pid: null } }
assert.equal(
  historyOwner.recordManifest(rawSnapshot, false),
  false,
  'non-appended snapshots have no manifest'
)
assert.equal(
  historyOwner.recordManifest(rawSnapshot, true),
  true,
  'LC3-SNAPSHOT-01 binds the actual appended object'
)
const historyPrepared = historyOwner.prepareHistory(rawSnapshot, { id: 'live-id', pid: 'live-pid' })
assert.equal(historyPrepared.ok, true, 'LC3-HISTORY-01 prepares a manifested snapshot')
let moved = 0
let historyEvents = 0
let historySnapshot: any
assert.equal(
  historyOwner.commitHistory(historyPrepared, {
    moveIndex() {
      moved += 1
    },
    publishSnapshot(snapshot) {
      historySnapshot = snapshot
      assert.equal(snapshot.componentData.length, 2, 'history restores the complete root')
      assert.equal(snapshot.componentData[1].name, 'later chart edit')
      assert.equal(snapshot.dvInfo.id, 'live-id')
      assert.equal(snapshot.dvInfo.pid, 'live-pid')
    },
    publishSelection() {
      return undefined
    },
    publishEvents() {
      historyEvents += 1
    }
  }).ok,
  true
)
assert.equal(moved, 1)
assert.equal(historyEvents, 1)

const missingManifestOwner = createQuerySingleSelectLifecycleOwner()
missingManifestOwner.beginSession({
  resourceId: null,
  isTemplate: false,
  createInitCompleted: true,
  rootEmpty: true
})
missingManifestOwner.registerPending({ ...rawQuery }, 1)
const unmanifestedHistory = {
  componentData: [{ id: 'historic-chart', component: 'UserView' }],
  canvasStyleData: { width: 900 },
  dvInfo: { id: 'historic-id' }
}
const fallbackPrepared = missingManifestOwner.prepareHistory(unmanifestedHistory, { id: 'live-id' })
assert.equal(fallbackPrepared.reason, 'MANIFEST_UNAVAILABLE')
assert.equal(missingManifestOwner.getState().authenticated, false)
const fallbackOrder: string[] = []
assert.equal(
  missingManifestOwner.commitHistory(fallbackPrepared, {
    moveIndex() {
      fallbackOrder.push('index')
    },
    publishSnapshot(snapshot) {
      fallbackOrder.push('snapshot')
      assert.deepEqual(
        snapshot,
        { ...unmanifestedHistory, dvInfo: { id: 'live-id' } },
        'fallback preserves the original full snapshot'
      )
    },
    publishSelection() {
      fallbackOrder.push('selection')
    },
    publishEvents() {
      fallbackOrder.push('events')
    }
  }).reason,
  'UNMANAGED_FALLBACK',
  'an unmanifested history record falls back to ordinary full-root restore and invalidates private authority'
)
assert.deepEqual(fallbackOrder, ['index', 'snapshot', 'selection', 'events'])

const prepareFailureOwner = createQuerySingleSelectLifecycleOwner()
prepareFailureOwner.beginSession({
  resourceId: null,
  isTemplate: false,
  createInitCompleted: true,
  rootEmpty: true
})
prepareFailureOwner.registerPending({ ...rawQuery }, 1)
const prepareFailureBefore = prepareFailureOwner.getState()
const cyclicSnapshot: any = {}
cyclicSnapshot.self = cyclicSnapshot
assert.throws(
  () => prepareFailureOwner.prepareHistory(cyclicSnapshot, { id: 'live-id' }),
  RangeError,
  'LC3-HISTORY-04: snapshot deep clone failure propagates during prepare'
)
assert.deepEqual(
  prepareFailureOwner.getState(),
  prepareFailureBefore,
  'LC3-HISTORY-04: failed prepare leaves lifecycle state unchanged'
)

const partialHistoryOwner = createQuerySingleSelectLifecycleOwner()
partialHistoryOwner.beginSession({
  resourceId: null,
  isTemplate: false,
  createInitCompleted: true,
  rootEmpty: true
})
const partialHistoryRaw = { ...rawQuery }
partialHistoryOwner.registerPending(partialHistoryRaw, 1)
const partialHistoryConfirm = partialHistoryOwner.prepareConfirmation({
  component: partialHistoryRaw,
  queryRoot: carrierInput,
  outerRoot: [partialHistoryRaw],
  componentId: 'query-1',
  expectedRevision: 0
})
let partialHistoryRoot: any[] = []
let partialHistorySelection: any = partialHistoryRaw
partialHistoryOwner.commitConfirmation(partialHistoryConfirm, 0, {
  replaceRoot(root) {
    partialHistoryRoot = root
  },
  select(component) {
    partialHistorySelection = component
  },
  publishEvents() {
    return undefined
  }
})
const priorHistoryComponent = partialHistorySelection
const priorHistoryRoot = partialHistoryRoot
const partialHistorySnapshot = {
  componentData: clone(partialHistoryRoot),
  dvInfo: { id: 'doc-id' }
}
partialHistoryOwner.recordManifest(partialHistorySnapshot, true)
const partialHistoryPrepared = partialHistoryOwner.prepareHistory(partialHistorySnapshot, {
  id: 'doc-id'
})
let partialHistoryPointer = 1
let partialHistoryEvents = 0
const setterFailure = new Error('setCanvasStyle failed')
assert.throws(
  () =>
    partialHistoryOwner.commitHistory(partialHistoryPrepared, {
      moveIndex() {
        partialHistoryPointer = 0
      },
      publishSnapshot(snapshot) {
        partialHistoryRoot = snapshot.componentData
        throw setterFailure
      },
      publishSelection() {
        partialHistorySelection = partialHistoryRoot[0]
      },
      publishEvents() {
        partialHistoryEvents += 1
      }
    }),
  error => error === setterFailure,
  'LC3-HISTORY-03 propagates the original snapshot setter error'
)
assert.notEqual(
  partialHistoryRoot,
  priorHistoryRoot,
  'LC3-HISTORY-03 leaves the replaced root in place'
)
assert.equal(
  partialHistorySelection,
  priorHistoryComponent,
  'LC3-HISTORY-03 leaves the prior selection'
)
assert.equal(partialHistoryPointer, 0, 'LC3-HISTORY-03 preserves the moved history pointer')
assert.equal(partialHistoryEvents, 0, 'LC3-HISTORY-03 emits no native events after partial restore')
assert.equal(partialHistoryOwner.getState().phase, 'unmanaged')
assert.equal(partialHistoryOwner.getState().authenticated, false)

const unknownCreateOwner = createQuerySingleSelectLifecycleOwner()
unknownCreateOwner.beginSession({
  resourceId: null,
  isTemplate: false,
  createInitCompleted: true,
  rootEmpty: true
})
const unknownCreate = unknownCreateOwner.captureSaveIntent({
  ...before,
  dvInfo: { id: null, optType: null, name: 'New dashboard', type: 'dashboard' }
})
assert.equal(unknownCreate.ok, true)
assert.equal(
  unknownCreateOwner.settleSave(unknownCreate.token, { status: 'unknown' }).dirty,
  true,
  'LC4-SAVE-15 preserves dirty state for an unknown server outcome'
)
assert.equal(
  unknownCreateOwner.captureSaveIntent({
    ...before,
    dvInfo: { id: null, optType: null, name: 'New dashboard', type: 'dashboard' }
  }).reason,
  'BUSY_CREATE_OUTCOME_UNKNOWN',
  'LC4-SAVE-16 blocks duplicate create after an unknown outcome'
)
assert.deepEqual(unknownCreateOwner.getState().outcomeUnknown, [1])
assert.equal(unknownCreateOwner.getState().dirty, true)
assert.equal(unknownCreateOwner.getState().blocksCreate, true)

const unknownUpdateOwner = createQuerySingleSelectLifecycleOwner()
unknownUpdateOwner.beginSession({
  resourceId: null,
  isTemplate: false,
  createInitCompleted: true,
  rootEmpty: true
})
const unknownUpdateCreate = unknownUpdateOwner.captureSaveIntent({
  ...before,
  dvInfo: { id: null, optType: null, name: 'New dashboard', type: 'dashboard' }
})
unknownUpdateOwner.settleSave(
  unknownUpdateCreate.token,
  { status: 'success', resourceId: 'doc-1' },
  unknownUpdateCreate.capture.intentDigest
)
const unknownUpdateInput = {
  ...before,
  dvInfo: { id: 'doc-1', optType: 'edit', name: 'Sales', type: 'dashboard' }
}
const unknownUpdate = unknownUpdateOwner.captureSaveIntent(unknownUpdateInput)
assert.equal(unknownUpdate.ok, true)
assert.equal(unknownUpdateOwner.markSaveSent(unknownUpdate.token), true)
assert.equal(
  unknownUpdateOwner.settleSave(unknownUpdate.token, {
    status: 'unknown',
    reason: 'timeout_after_send'
  }).dirty,
  true,
  'LC4-SAVE-15 records a sent update with an unknown transport outcome'
)
const laterSuccessfulUpdate = unknownUpdateOwner.captureSaveIntent({
  ...unknownUpdateInput,
  contentId: 'content-later'
})
assert.equal(laterSuccessfulUpdate.ok, true)
assert.equal(unknownUpdateOwner.markSaveSent(laterSuccessfulUpdate.token), true)
const laterUpdateResult = unknownUpdateOwner.settleSave(
  laterSuccessfulUpdate.token,
  { status: 'success' },
  laterSuccessfulUpdate.capture.intentDigest
)
assert.equal(laterUpdateResult.dirty, true)
assert.equal(unknownUpdateOwner.getState().dirty, true)
assert.equal(unknownUpdateOwner.getState().saveOrderUncertain, true)
assert.deepEqual(unknownUpdateOwner.getState().outcomeUnknown, [2])
assert.equal(unknownUpdateOwner.getState().lastAckSeq, 3)

const createOwner = createQuerySingleSelectLifecycleOwner()
createOwner.beginSession({
  resourceId: null,
  isTemplate: false,
  createInitCompleted: true,
  rootEmpty: true
})
const createIntentInput = {
  ...before,
  dvInfo: { id: null, optType: null, name: 'New dashboard', type: 'dashboard' }
}
const unidentifiedCreateOwner = createQuerySingleSelectLifecycleOwner()
unidentifiedCreateOwner.beginSession({
  resourceId: null,
  isTemplate: false,
  createInitCompleted: true,
  rootEmpty: true
})
const unidentifiedCreate = unidentifiedCreateOwner.captureSaveIntent(createIntentInput)
assert.equal(
  unidentifiedCreateOwner.settleSave(
    unidentifiedCreate.token,
    { status: 'success' },
    unidentifiedCreate.capture.intentDigest
  ).outcome,
  'unknown',
  'a create acknowledgement without a resource identity remains unresolved'
)
assert.equal(unidentifiedCreateOwner.getState().blocksCreate, true)
const createIntent = createOwner.captureSaveIntent(createIntentInput)
assert.equal(createIntent.ok, true)
assert.deepEqual(createIntent.token.appCanvasNameCheck, {
  datasetFolderPid: undefined,
  datasetFolderName: undefined
})
assert.equal(createIntent.token.dvNameCheck, null)
const createSettled = createOwner.settleSave(
  createIntent.token,
  { status: 'success', resourceId: 'saved-1' },
  createIntent.capture.intentDigest
)
assert.equal(createSettled.dirty, false, 'a uniquely acknowledged unchanged create clears dirty')
assert.equal(createOwner.getState().targetId, 'saved-1')

const styleChangedSave = createOwner.captureSaveIntent({
  ...before,
  dvInfo: { id: 'saved-1', optType: 'edit', name: 'Sales', type: 'dashboard' }
})
createOwner.markDocumentEdited()
assert.equal(
  createOwner.settleSave(
    styleChangedSave.token,
    { status: 'success' },
    styleChangedSave.capture.intentDigest
  ).dirty,
  true,
  'LC4-SAVE-14 preserves dirty after an edit during a successful save'
)
const navigationSave = createOwner.captureSaveIntent({
  ...before,
  dvInfo: { id: 'saved-1', optType: 'edit', name: 'Sales', type: 'dashboard' }
})
assert.equal(createOwner.markSaveSent(navigationSave.token), true)
createOwner.invalidate()
assert.equal(
  createOwner.settleSave(navigationSave.token, { status: 'success' }).reason,
  'INVALID_TOKEN',
  'a response after same-session navigation cannot update the new page'
)
assert.deepEqual(createOwner.getState().outcomeUnknown, [3])
assert.equal(createOwner.getState().dirty, true)
assert.equal(
  createOwner.beginSession({
    resourceId: null,
    isTemplate: false,
    createInitCompleted: true,
    rootEmpty: true
  }).reason,
  'OUTCOME_UNKNOWN_PRESERVED'
)

const overlapOwner = createQuerySingleSelectLifecycleOwner()
overlapOwner.beginSession({
  resourceId: null,
  isTemplate: false,
  createInitCompleted: true,
  rootEmpty: true
})
const overlapCreate = overlapOwner.captureSaveIntent(createIntentInput)
overlapOwner.settleSave(
  overlapCreate.token,
  { status: 'success', resourceId: 'saved-overlap' },
  overlapCreate.capture.intentDigest
)
const updateInput = {
  ...before,
  dvInfo: { id: 'saved-overlap', optType: 'edit', name: 'Sales', type: 'dashboard' }
}
const firstUpdate = overlapOwner.captureSaveIntent(updateInput)
const secondUpdate = overlapOwner.captureSaveIntent(updateInput)
assert.equal(overlapOwner.getState().saveOrderUncertain, true)
overlapOwner.settleSave(
  secondUpdate.token,
  { status: 'success' },
  secondUpdate.capture.intentDigest
)
overlapOwner.settleSave(firstUpdate.token, { status: 'success' }, firstUpdate.capture.intentDigest)
assert.equal(
  overlapOwner.getState().dirty,
  true,
  'overlapping updates never infer server write order'
)
assert.equal(overlapOwner.getState().saveOrderUncertain, true)
const independentUpdate = overlapOwner.captureSaveIntent(updateInput)
assert.equal(independentUpdate.ok, true)
assert.equal(
  overlapOwner.settleSave(
    independentUpdate.token,
    { status: 'success' },
    independentUpdate.capture.intentDigest
  ).dirty,
  false,
  'a later independent successful save can clear the overlap uncertainty'
)
console.log(
  'M0 + lifecycle PASS: frozen preparation/capture, session source, publish/history failure, history manifest and unknown-outcome save guards'
)
