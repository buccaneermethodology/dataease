import { prepareQuerySingleSelectCarrier } from './query-single-select-carrier'

type ModelErrorCode =
  | 'INVALID_JSON_INPUT'
  | 'MODEL_INPUT_INVALID'
  | 'UNSUPPORTED_EVENT'
  | 'REVISION_MISMATCH'
  | 'INVALID_TRANSITION'

type ModelState = Record<string, unknown>
type ModelEvent = Record<string, unknown>
type ModelResult = { ok: true; state: ModelState } | { ok: false; error: { code: ModelErrorCode } }

const stateKeys = [
  'documentEpoch',
  'phase',
  'revision',
  'root',
  'carrier',
  'snapshotIndex',
  'snapshots',
  'pendingSnapshotMarks',
  'effects',
  'newCapabilityEligible'
]
const effectKeys = ['confirmPreviewEmits', 'snapshotAppend', 'historyPublish', 'network']
const knownEvents = new Set([
  'fresh_non_template_dashboard_createInit',
  'handleNewFromCanvasMain',
  'cancel_or_fail_before_addComponent',
  'confirm',
  'draft',
  'cancel',
  'cancel_or_validation_failed',
  'open_managed_draft',
  'recordSnapshot',
  'accepted_outer_runtime_write',
  'accepted_runtime_select',
  'undo',
  'redo',
  'undo_at_first_snapshot'
])

const fail = (code: ModelErrorCode): ModelResult => ({ ok: false, error: { code } })

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value)) &&
  Object.getPrototypeOf(value) === Object.prototype

const isJsonValue = (value: unknown, stack: WeakSet<object>): boolean => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'object') return false
  if (stack.has(value)) return false
  stack.add(value)
  try {
    if (Array.isArray(value)) {
      if (Object.getPrototypeOf(value) !== Array.prototype) return false
      const keys = Reflect.ownKeys(value)
      if (keys.length !== value.length + 1 || !keys.includes('length')) return false
      for (let index = 0; index < value.length; index += 1) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
        if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return false
        if (!isJsonValue(descriptor.value, stack)) return false
      }
      return true
    }
    if (Object.getPrototypeOf(value) !== Object.prototype) return false
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') return false
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return false
      if (!isJsonValue(descriptor.value, stack)) return false
    }
    return true
  } finally {
    stack.delete(value)
  }
}

const cloneJson = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(item => cloneJson(item)) as T
  if (isPlainRecord(value)) {
    const copy: Record<string, unknown> = {}
    for (const key of Object.keys(value)) {
      Object.defineProperty(copy, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: cloneJson(value[key])
      })
    }
    return copy as T
  }
  return value
}

const exactKeys = (value: Record<string, unknown>, keys: readonly string[]) => {
  const actual = Object.keys(value)
  return actual.length === keys.length && keys.every(key => Object.hasOwn(value, key))
}

const equalJson = (left: unknown, right: unknown): boolean => {
  if (left === right) return true
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => equalJson(value, right[index]))
    )
  }
  if (!isPlainRecord(left) || !isPlainRecord(right)) return false
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(key => Object.hasOwn(right, key) && equalJson(left[key], right[key]))
  )
}

const finiteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const validateComponent = (value: unknown, phase: string): value is Record<string, unknown> => {
  if (!isPlainRecord(value)) return false
  const pendingKeys = [
    'id',
    'component',
    'innerType',
    'canvasId',
    'propValue',
    'style',
    'x',
    'sizeX',
    'sizeY'
  ]
  const managedKeys = [...pendingKeys, 'cascade']
  if (!exactKeys(value, phase === 'managed' ? managedKeys : pendingKeys)) return false
  if (
    typeof value.id !== 'string' ||
    !value.id ||
    value.component !== 'VQuery' ||
    value.innerType !== 'VQuery' ||
    typeof value.canvasId !== 'string' ||
    !value.canvasId ||
    !finiteNumber(value.x) ||
    !finiteNumber(value.sizeX) ||
    !finiteNumber(value.sizeY) ||
    !isPlainRecord(value.style) ||
    !exactKeys(value.style, ['width', 'height']) ||
    !finiteNumber(value.style.width) ||
    !finiteNumber(value.style.height)
  )
    return false
  if (phase === 'pending') return value.propValue === ''
  if (
    !Array.isArray(value.propValue) ||
    value.propValue.length !== 1 ||
    !isPlainRecord(value.propValue[0]) ||
    !Array.isArray(value.cascade) ||
    value.cascade.length !== 0
  )
    return false
  const condition = value.propValue[0]
  return (
    typeof condition.id === 'string' &&
    Boolean(condition.id) &&
    isPlainRecord(condition.field) &&
    typeof condition.field.id === 'string' &&
    isPlainRecord(condition.dataset) &&
    typeof condition.dataset.id === 'string' &&
    Array.isArray(condition.mapValue) &&
    typeof condition.selectValue === 'string'
  )
}

const validateCarrier = (value: unknown, state: ModelState): value is ModelState => {
  if (
    !isPlainRecord(value) ||
    !exactKeys(value, ['componentId', 'documentEpoch', 'revision', 'commitId', 'design'])
  )
    return false
  if (
    typeof value.componentId !== 'string' ||
    value.documentEpoch !== state.documentEpoch ||
    !nonNegativeSafeInteger(value.revision) ||
    value.revision > Number(state.revision) ||
    value.commitId !== `${value.documentEpoch}:${value.revision}` ||
    !isPlainRecord(value.design) ||
    !exactKeys(value.design, ['propValue', 'cascade']) ||
    !Array.isArray(value.design.propValue) ||
    value.design.propValue.length !== 1 ||
    !isPlainRecord(value.design.propValue[0]) ||
    !Array.isArray(value.design.cascade) ||
    value.design.cascade.length !== 0
  )
    return false
  const design = value.design.propValue[0]
  const component = state.root[0]
  if (
    !isPlainRecord(component) ||
    component.id !== value.componentId ||
    !Array.isArray(component.propValue)
  )
    return false
  const runtime = component.propValue[0]
  if (!isPlainRecord(runtime)) return false
  return (
    !Object.hasOwn(design, 'selectValue') &&
    !Object.hasOwn(design, 'mapValue') &&
    design.id === runtime.id &&
    equalJson(design.field, runtime.field) &&
    equalJson(design.dataset, runtime.dataset)
  )
}

const collectObjects = (value: unknown, output = new Set<object>()): Set<object> => {
  if (value && typeof value === 'object' && !output.has(value)) {
    output.add(value)
    Object.values(value as Record<string, unknown>).forEach(child => collectObjects(child, output))
  }
  return output
}

const hasSharedObjects = (left: unknown, right: unknown): boolean => {
  const leftObjects = collectObjects(left)
  const rightObjects = collectObjects(right)
  return Array.from(leftObjects).some(object => rightObjects.has(object))
}

const nonNegativeSafeInteger = (value: unknown): value is number =>
  Number.isSafeInteger(value) && Number(value) >= 0

const validateState = (value: unknown): value is ModelState => {
  if (!isPlainRecord(value) || !exactKeys(value, stateKeys)) return false
  if (
    typeof value.documentEpoch !== 'string' ||
    !['empty', 'pending', 'managed'].includes(String(value.phase)) ||
    !nonNegativeSafeInteger(value.revision) ||
    !Array.isArray(value.root) ||
    !Number.isInteger(value.snapshotIndex) ||
    !Array.isArray(value.snapshots) ||
    !nonNegativeSafeInteger(value.pendingSnapshotMarks) ||
    typeof value.newCapabilityEligible !== 'boolean'
  )
    return false
  const effects = value.effects
  if (!isPlainRecord(effects) || !exactKeys(effects, effectKeys)) return false
  if (!effectKeys.every(key => nonNegativeSafeInteger(effects[key]))) return false
  if (effects.network !== 0) return false

  const phase = value.phase
  if (phase === 'empty' && (value.root.length !== 0 || value.carrier !== null)) return false
  if (
    phase !== 'empty' &&
    (value.root.length !== 1 || !validateComponent(value.root[0], String(phase)))
  )
    return false
  if (value.newCapabilityEligible !== (phase === 'managed')) return false
  if (phase === 'managed') {
    if (!validateCarrier(value.carrier, value)) return false
  } else if (value.carrier !== null) {
    return false
  }

  if (value.snapshotIndex < -1 || value.snapshotIndex >= value.snapshots.length) return false
  for (const snapshot of value.snapshots) {
    if (
      !isPlainRecord(snapshot) ||
      !exactKeys(snapshot, ['componentData', 'carrier', 'phase', 'documentEpoch']) ||
      snapshot.documentEpoch !== value.documentEpoch ||
      !['empty', 'pending', 'managed'].includes(String(snapshot.phase)) ||
      !Array.isArray(snapshot.componentData)
    )
      return false
    if (snapshot.phase === 'empty' && snapshot.componentData.length !== 0) return false
    if (
      snapshot.phase !== 'empty' &&
      (snapshot.componentData.length !== 1 ||
        !validateComponent(snapshot.componentData[0], String(snapshot.phase)))
    )
      return false
    if ((snapshot.phase === 'managed') !== (snapshot.carrier !== null)) return false
    if (snapshot.carrier !== null) {
      const snapshotState = { ...value, root: snapshot.componentData }
      if (!validateCarrier(snapshot.carrier, snapshotState)) return false
    }
    if (hasSharedObjects(snapshot.componentData, snapshot.carrier)) return false
  }
  if (hasSharedObjects(value.root, value.carrier)) return false
  for (let left = 0; left < value.snapshots.length; left += 1) {
    for (let right = left + 1; right < value.snapshots.length; right += 1) {
      if (hasSharedObjects(value.snapshots[left], value.snapshots[right])) return false
    }
    if (hasSharedObjects(value.root, value.snapshots[left])) return false
  }
  return true
}

const eventKeys = (event: ModelEvent): string[] => {
  switch (event.type) {
    case 'fresh_non_template_dashboard_createInit':
    case 'cancel_or_fail_before_addComponent':
    case 'cancel':
    case 'cancel_or_validation_failed':
    case 'undo_at_first_snapshot':
      return ['type']
    case 'handleNewFromCanvasMain':
      return ['type', 'component']
    case 'confirm':
      return event.validation === 'failed'
        ? ['type', 'validation', 'candidate']
        : ['type', 'candidate', 'expectedRevision']
    case 'draft':
      return ['type', 'candidate']
    case 'open_managed_draft':
      return ['type', 'source']
    case 'recordSnapshot':
      return ['type', 'eligible']
    case 'accepted_outer_runtime_write':
      return ['type', 'value', 'matchingMode']
    case 'accepted_runtime_select':
      return ['type', 'value', 'mapValue']
    case 'undo':
    case 'redo':
      return ['type', 'selectedIndex']
    default:
      return ['type']
  }
}

const validateEvents = (events: unknown[]): ModelErrorCode | null => {
  for (const value of events) {
    if (!isPlainRecord(value) || typeof value.type !== 'string') return 'MODEL_INPUT_INVALID'
    if (!knownEvents.has(value.type)) return 'UNSUPPORTED_EVENT'
  }
  for (const value of events as ModelEvent[]) {
    const expected = eventKeys(value)
    if (!exactKeys(value, expected)) return 'MODEL_INPUT_INVALID'
    if (
      value.type === 'confirm' &&
      value.validation !== 'failed' &&
      (!nonNegativeSafeInteger(value.expectedRevision) || !isPlainRecord(value.candidate))
    )
      return 'MODEL_INPUT_INVALID'
    if (
      value.type === 'confirm' &&
      value.validation === 'failed' &&
      !Object.hasOwn(value, 'candidate')
    )
      return 'MODEL_INPUT_INVALID'
    if (value.type === 'recordSnapshot' && typeof value.eligible !== 'boolean')
      return 'MODEL_INPUT_INVALID'
    if (value.type === 'undo' || value.type === 'redo') {
      if (!Number.isInteger(value.selectedIndex)) return 'MODEL_INPUT_INVALID'
    }
    if (
      (value.type === 'accepted_outer_runtime_write' || value.type === 'accepted_runtime_select') &&
      typeof value.value !== 'string'
    )
      return 'MODEL_INPUT_INVALID'
  }
  return null
}

const initialState = (): ModelState => ({
  documentEpoch: 'new-doc-1',
  phase: 'empty',
  revision: 0,
  root: [],
  carrier: null,
  snapshotIndex: -1,
  snapshots: [],
  pendingSnapshotMarks: 0,
  effects: { confirmPreviewEmits: 0, snapshotAppend: 0, historyPublish: 0, network: 0 },
  newCapabilityEligible: false
})

const setCount = (state: ModelState, name: string, amount: number): boolean => {
  const next = Number((state.effects as Record<string, unknown>)[name]) + amount
  if (!Number.isSafeInteger(next)) return false
  ;(state.effects as Record<string, unknown>)[name] = next
  return true
}

const updateRevision = (state: ModelState): number => {
  const next = Number(state.revision) + 1
  if (!Number.isSafeInteger(next)) throw new Error('INVALID_TRANSITION')
  state.revision = next
  return next
}

const managedCarrierAtRevision = (carrierValue: unknown, revision: number): ModelState => {
  const carrier = cloneJson(carrierValue) as Record<string, unknown>
  carrier.revision = revision
  carrier.commitId = `${String(carrier.documentEpoch)}:${revision}`
  return carrier
}

const applyEvent = (state: ModelState, event: ModelEvent): ModelErrorCode | null => {
  const phase = String(state.phase)
  const root = state.root as unknown[]
  const snapshots = state.snapshots as ModelState[]
  const component = root[0] as Record<string, unknown> | undefined

  switch (event.type) {
    case 'fresh_non_template_dashboard_createInit':
      return 'INVALID_TRANSITION'
    case 'handleNewFromCanvasMain': {
      if (phase !== 'empty' || root.length !== 0 || !isPlainRecord(event.component))
        return 'INVALID_TRANSITION'
      const added = cloneJson(event.component)
      if (!validateComponent(added, 'pending')) return 'INVALID_TRANSITION'
      state.root = [added]
      state.phase = 'pending'
      state.pendingSnapshotMarks = Number(state.pendingSnapshotMarks) + 1
      if (!Number.isSafeInteger(state.pendingSnapshotMarks)) return 'INVALID_TRANSITION'
      state.newCapabilityEligible = false
      return null
    }
    case 'cancel_or_fail_before_addComponent':
    case 'cancel':
    case 'cancel_or_validation_failed':
    case 'draft':
      return null
    case 'open_managed_draft':
      return phase === 'managed' && event.source === 'carrier' ? null : 'INVALID_TRANSITION'
    case 'confirm': {
      if (!component || !['pending', 'managed'].includes(phase)) return 'INVALID_TRANSITION'
      if (event.validation === 'failed') return null
      if (event.expectedRevision !== state.revision) return 'REVISION_MISMATCH'
      const prepared = prepareQuerySingleSelectCarrier(event.candidate)
      if (!prepared.ok) return 'MODEL_INPUT_INVALID'
      const nextRevision = updateRevision(state)
      component.propValue = cloneJson(prepared.value.runtime.propValue)
      component.cascade = cloneJson(prepared.value.runtime.cascade)
      state.phase = 'managed'
      state.carrier = {
        componentId: component.id,
        documentEpoch: state.documentEpoch,
        revision: nextRevision,
        commitId: `${String(state.documentEpoch)}:${nextRevision}`,
        design: cloneJson(prepared.value.design)
      }
      state.newCapabilityEligible = true
      state.pendingSnapshotMarks = Number(state.pendingSnapshotMarks) + 1
      if (!Number.isSafeInteger(state.pendingSnapshotMarks)) return 'INVALID_TRANSITION'
      if (!setCount(state, 'confirmPreviewEmits', 1)) return 'INVALID_TRANSITION'
      return null
    }
    case 'recordSnapshot': {
      if (!event.eligible) return null
      const nextSnapshots = snapshots.slice(0, Number(state.snapshotIndex) + 1)
      nextSnapshots.push({
        componentData: cloneJson(root),
        carrier: cloneJson(state.carrier),
        phase: state.phase,
        documentEpoch: state.documentEpoch
      })
      state.snapshots = nextSnapshots
      state.snapshotIndex = nextSnapshots.length - 1
      state.pendingSnapshotMarks = 0
      if (!setCount(state, 'snapshotAppend', 1)) return 'INVALID_TRANSITION'
      return null
    }
    case 'accepted_outer_runtime_write': {
      if (
        phase !== 'managed' ||
        event.matchingMode !== 'value' ||
        typeof event.value !== 'string' ||
        event.value.length === 0 ||
        !component ||
        !Array.isArray(component.propValue) ||
        !isPlainRecord(component.propValue[0])
      )
        return 'INVALID_TRANSITION'
      const condition = component.propValue[0] as Record<string, unknown>
      condition.defaultValue = event.value
      condition.selectValue = event.value
      condition.defaultMapValue = [event.value]
      condition.mapValue = [event.value]
      return null
    }
    case 'accepted_runtime_select': {
      if (
        phase !== 'managed' ||
        typeof event.value !== 'string' ||
        event.value.length === 0 ||
        !Array.isArray(event.mapValue) ||
        event.mapValue.length !== 1 ||
        typeof event.mapValue[0] !== 'string' ||
        !event.mapValue[0] ||
        !component ||
        !Array.isArray(component.propValue) ||
        !isPlainRecord(component.propValue[0])
      )
        return 'INVALID_TRANSITION'
      const condition = component.propValue[0] as Record<string, unknown>
      condition.selectValue = event.value
      condition.mapValue = cloneJson(event.mapValue)
      return null
    }
    case 'undo':
    case 'redo': {
      const selectedIndex = Number(event.selectedIndex)
      const isUndo = event.type === 'undo'
      const expectedIndex = Number(state.snapshotIndex) + (isUndo ? -1 : 1)
      if (
        (isUndo && Number(state.snapshotIndex) <= 0) ||
        (!isUndo && Number(state.snapshotIndex) >= snapshots.length - 1) ||
        selectedIndex !== expectedIndex
      )
        return 'INVALID_TRANSITION'
      const selected = snapshots[selectedIndex]
      if (!selected || selected.documentEpoch !== state.documentEpoch) return 'INVALID_TRANSITION'
      const revision = Number(state.revision) + 1
      if (!Number.isSafeInteger(revision)) return 'INVALID_TRANSITION'
      state.root = cloneJson(selected.componentData)
      state.phase = selected.phase
      state.carrier =
        selected.phase === 'managed' ? managedCarrierAtRevision(selected.carrier, revision) : null
      state.snapshotIndex = selectedIndex
      state.revision = revision
      state.newCapabilityEligible = selected.phase === 'managed'
      if (!setCount(state, 'historyPublish', 1)) return 'INVALID_TRANSITION'
      return null
    }
    case 'undo_at_first_snapshot':
      return Number(state.snapshotIndex) === 0 ? null : 'INVALID_TRANSITION'
    default:
      return 'UNSUPPORTED_EVENT'
  }
}

export const transitionCreatedQueryLifecycle = (input: unknown): ModelResult => {
  if (!isJsonValue(input, new WeakSet())) return fail('INVALID_JSON_INPUT')
  if (
    !isPlainRecord(input) ||
    !exactKeys(input, ['state', 'events']) ||
    !Array.isArray(input.events) ||
    input.events.length === 0
  )
    return fail('MODEL_INPUT_INVALID')

  const eventError = validateEvents(input.events)
  if (eventError) return fail(eventError)
  const events = cloneJson(input.events) as ModelEvent[]
  let state: ModelState
  if (input.state === null) {
    if (events[0]?.type !== 'fresh_non_template_dashboard_createInit')
      return fail('MODEL_INPUT_INVALID')
    state = initialState()
    events.shift()
  } else {
    if (!validateState(input.state)) return fail('MODEL_INPUT_INVALID')
    state = cloneJson(input.state)
  }

  for (const event of events) {
    try {
      const error = applyEvent(state, event)
      if (error) return fail(error)
    } catch {
      return fail('INVALID_TRANSITION')
    }
  }
  return { ok: true, state }
}
