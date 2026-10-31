import CryptoJS from 'crypto-js/crypto-js'
import { prepareQuerySingleSelectCarrier } from './query-single-select-carrier'

type JsonRecord = Record<string, unknown>

const isRecord = (value: unknown): value is JsonRecord =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isJson = (value: unknown, seen = new WeakSet<object>()): boolean => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'object' || seen.has(value)) return false
  seen.add(value)
  try {
    if (Array.isArray(value)) {
      const keys = Reflect.ownKeys(value)
      if (keys.length !== value.length + 1 || !keys.includes('length')) return false
      for (let index = 0; index < value.length; index += 1) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
        if (
          !descriptor ||
          !descriptor.enumerable ||
          !('value' in descriptor) ||
          !isJson(descriptor.value, seen)
        )
          return false
      }
      return true
    }
    if (Object.getPrototypeOf(value) !== Object.prototype) return false
    return Reflect.ownKeys(value).every(key => {
      if (typeof key !== 'string') return false
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      return (
        !!descriptor &&
        descriptor.enumerable &&
        'value' in descriptor &&
        isJson(descriptor.value, seen)
      )
    })
  } finally {
    seen.delete(value)
  }
}

const clone = <T>(value: T): T => {
  if (value instanceof Date) return new Date(value.getTime()) as T
  if (Array.isArray(value)) return value.map(item => clone(item)) as T
  if (isRecord(value)) {
    const output: JsonRecord = {}
    Object.entries(value).forEach(([key, item]) => {
      Object.defineProperty(output, key, {
        configurable: true,
        enumerable: true,
        value: clone(item),
        writable: true
      })
    })
    return output as T
  }
  return value
}

const exactKeys = (value: JsonRecord, keys: string[]) =>
  Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key))

const fail = (reason: string) => ({ ok: false as const, reason })

/** Produces detached design/runtime projections without minting authority or publishing state. */
export const prepareConfirmation = (input: unknown) => {
  if (
    !isRecord(input) ||
    !isJson(input) ||
    !exactKeys(input, [
      'queryRoot',
      'outerRoot',
      'componentId',
      'revision',
      'expectedRevision',
      'commitId'
    ])
  )
    return fail('INVALID_INPUT')
  if (
    !Number.isSafeInteger(input.revision) ||
    (input.revision as number) < 0 ||
    input.revision !== input.expectedRevision
  )
    return fail('STALE_PREPARE')
  if (
    typeof input.componentId !== 'string' ||
    !input.componentId ||
    typeof input.commitId !== 'string' ||
    !input.commitId ||
    !Array.isArray(input.outerRoot) ||
    !input.outerRoot.every(isRecord)
  )
    return fail('INVALID_INPUT')

  const carrier = prepareQuerySingleSelectCarrier(input.queryRoot)
  if (!carrier.ok) return fail(carrier.reason)
  const matches = input.outerRoot.filter(item => isRecord(item) && item.id === input.componentId)
  if (matches.length !== 1)
    return fail(matches.length ? 'AMBIGUOUS_COMPONENT' : 'COMPONENT_NOT_FOUND')
  if (matches[0].component !== 'VQuery' || matches[0].innerType !== 'VQuery')
    return fail('INVALID_TARGET')

  const project = (payload: JsonRecord) => {
    const root = clone(input.outerRoot) as JsonRecord[]
    const target = root.find(item => item.id === input.componentId)!
    target.propValue = clone(payload.propValue)
    target.cascade = clone(payload.cascade)
    return root
  }
  return {
    ok: true as const,
    value: {
      revision: input.revision,
      commitId: input.commitId,
      designRoot: project(carrier.value.design),
      runtimeRoot: project(carrier.value.runtime)
    }
  }
}

const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (isRecord(value))
    return `{${Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`
  return JSON.stringify(value)
}

const cleanComponentData = (components: JsonRecord[]) =>
  components
    .filter(component => component.component !== 'GroupArea')
    .map(component => {
      if (component.component === 'UserView') component.linkageFilters = []
      if (component.component === 'Group' && Array.isArray(component.propValue))
        component.propValue.forEach(child => {
          if (isRecord(child)) child.linkageFilters = []
        })
      if (component.component === 'DeTabs' && Array.isArray(component.propValue))
        component.propValue.forEach(tab => {
          if (isRecord(tab) && Array.isArray(tab.componentData))
            tab.componentData.forEach(child => {
              if (isRecord(child)) child.linkageFilters = []
            })
        })
      return component
    })

/** Captures a complete detached save intent; it never sends requests or clears dirty state. */
export const captureSave = (input: unknown) => {
  const keys = [
    'componentData',
    'canvasStyleData',
    'canvasViewInfo',
    'appData',
    'queryDesignOverlay',
    'dvInfo',
    'checkVersion',
    'contentId'
  ]
  if (!isRecord(input) || !isJson(input) || !exactKeys(input, keys)) return fail('INVALID_INPUT')
  if (
    !Array.isArray(input.componentData) ||
    !input.componentData.every(isRecord) ||
    !isRecord(input.dvInfo) ||
    typeof input.contentId !== 'string' ||
    !input.contentId
  )
    return fail('INVALID_INPUT')

  const components = clone(input.componentData) as JsonRecord[]
  if (input.queryDesignOverlay !== null) {
    const overlay = input.queryDesignOverlay
    if (
      !isRecord(overlay) ||
      !exactKeys(overlay, ['componentId', 'commitId', 'propValue', 'cascade']) ||
      typeof overlay.componentId !== 'string' ||
      !overlay.componentId ||
      typeof overlay.commitId !== 'string' ||
      !overlay.commitId ||
      !Array.isArray(overlay.propValue) ||
      !Array.isArray(overlay.cascade)
    )
      return fail('INVALID_INPUT')
    const targets = components.filter(component => component.id === overlay.componentId)
    if (targets.length !== 1)
      return fail(targets.length ? 'AMBIGUOUS_COMPONENT' : 'COMPONENT_NOT_FOUND')
    targets[0].propValue = clone(overlay.propValue)
    targets[0].cascade = clone(overlay.cascade)
  }

  const dvInfo = clone(input.dvInfo) as JsonRecord
  if (Object.hasOwn(dvInfo, 'name') && typeof dvInfo.name !== 'string') return fail('INVALID_NAME')
  if (typeof dvInfo.name === 'string') {
    dvInfo.name = dvInfo.name.trim()
    if (!dvInfo.name || dvInfo.name.length > 64) return fail('INVALID_NAME')
  }
  const componentData = cleanComponentData(components)
  const canvasInfo = {
    canvasStyleData: JSON.stringify(clone(input.canvasStyleData)),
    componentData: JSON.stringify(componentData),
    canvasViewInfo: clone(input.canvasViewInfo),
    appData: clone(input.appData),
    ...dvInfo,
    checkVersion: clone(input.checkVersion),
    contentId: input.contentId,
    watermarkInfo: null
  }
  const method = dvInfo.id && dvInfo.optType !== 'copy' ? 'updateCanvas' : 'saveCanvas'
  const digestPayload = clone(canvasInfo)
  delete digestPayload.contentId
  delete digestPayload.checkVersion
  return {
    ok: true as const,
    value: {
      method,
      targetId: dvInfo.id ?? null,
      optType: dvInfo.optType ?? null,
      appCanvasNameCheck: input.appData
        ? {
            datasetFolderPid: canvasInfo.datasetFolderPid,
            datasetFolderName: canvasInfo.datasetFolderName
          }
        : null,
      dvNameCheck:
        method === 'updateCanvas'
          ? { opt: 'edit', nodeType: 'leaf', name: dvInfo.name, type: dvInfo.type, id: dvInfo.id }
          : null,
      payload: canvasInfo,
      intentDigest: CryptoJS.SHA256(canonical(digestPayload)).toString()
    }
  }
}

/**
 * Creates an instance-private owner for one eligible dashboard creation session.
 * Serialized component JSON is deliberately never sufficient to reconstruct this owner.
 */
export const createQuerySingleSelectLifecycleOwner = () => {
  type Session = {
    epoch: string
    phase: 'open' | 'publishing' | 'unmanaged'
    revision: number
    commitId: string
    tokenGeneration: number
    editGeneration: number
    saveSeq: number
    lastAckSeq: number
    dirty: boolean
    saveOrderUncertain: boolean
    targetId: unknown
  }
  type Capsule = {
    epoch: string
    revision: number
    commitId: string
    componentId: string
    designRoot: JsonRecord[]
    rawComponent: object
  }
  type SaveToken = {
    epoch: string
    seq: number
    revision: number
    commitId: string
    tokenGeneration: number
    editGeneration: number
    targetId: unknown
    method: string
    intentDigest: string
    payload: JsonRecord
    appCanvasNameCheck: JsonRecord | null
    dvNameCheck: JsonRecord | null
    sent: boolean
    unknownReason?: string
    isCreate: boolean
  }
  const capsules = new WeakMap<object, Capsule>()
  const manifests = new WeakMap<object, { epoch: string; capsule: Capsule }>()
  const preparedCapsules = new WeakMap<object, { epoch: string; capsule: Capsule }>()
  const pending = new Map<number, SaveToken>()
  const unknown = new Map<number, SaveToken>()
  let session: Session | null = null
  let currentCapsule: Capsule | null = null
  let currentComponent: object | null = null
  let saveOverlap = false
  let epochSequence = 0

  const invalidate = () => {
    if (!session) return
    session.phase = 'unmanaged'
    session.tokenGeneration += 1
    pending.forEach(token => {
      if (token.sent) {
        token.unknownReason = 'session_invalidated_with_request_in_flight'
        unknown.set(token.seq, token)
        session!.saveOrderUncertain = true
      } else {
        session!.dirty = true
      }
    })
    pending.clear()
    if (unknown.size > 0) session.dirty = true
    currentCapsule = null
    currentComponent = null
  }
  const usable = () => !!session && session.phase === 'open'
  const isQueryComponent = (value: unknown): value is JsonRecord =>
    isRecord(value) && value.component === 'VQuery' && value.innerType === 'VQuery'

  return {
    beginSession(context: unknown) {
      if (
        !isRecord(context) ||
        context.resourceId != null ||
        context.isTemplate !== false ||
        context.createInitCompleted !== true ||
        context.rootEmpty !== true
      )
        return fail('INELIGIBLE_SOURCE')
      if (unknown.size > 0) return fail('OUTCOME_UNKNOWN_PRESERVED')
      if (session && session.phase !== 'unmanaged') return fail('SESSION_ALREADY_STARTED')
      pending.clear()
      saveOverlap = false
      currentCapsule = null
      currentComponent = null
      session = {
        epoch: `qss-${++epochSequence}`,
        phase: 'open',
        revision: 0,
        commitId: 'initial',
        tokenGeneration: 0,
        editGeneration: 0,
        saveSeq: 0,
        lastAckSeq: 0,
        dirty: false,
        saveOrderUncertain: false,
        targetId: null
      }
      return { ok: true as const, epoch: session.epoch }
    },

    registerPending(component: unknown, topLevelCount: number) {
      if (!usable()) return fail('UNMANAGED_SESSION')
      if (!isQueryComponent(component) || topLevelCount !== 1) {
        invalidate()
        return fail('INVALID_TARGET')
      }
      currentComponent = component
      return { ok: true as const, epoch: session!.epoch }
    },

    prepareConfirmation(input: unknown) {
      if (!usable() || !currentComponent || !isRecord(input)) return fail('UNMANAGED_SESSION')
      if (input.component !== currentComponent) return fail('STALE_COMPONENT')
      const prepared = prepareConfirmation({
        queryRoot: input.queryRoot,
        outerRoot: input.outerRoot,
        componentId: input.componentId,
        revision: session!.revision,
        expectedRevision: input.expectedRevision,
        commitId: session!.commitId
      })
      if (!prepared.ok) return prepared
      const target = prepared.value.designRoot.find(item => item.id === input.componentId)
      if (!target || !isQueryComponent(target)) return fail('INVALID_TARGET')
      const capsule: Capsule = {
        epoch: session!.epoch,
        revision: session!.revision + 1,
        commitId: String(input.nextCommitId || `commit-${session!.revision + 1}`),
        componentId: String(input.componentId),
        designRoot: prepared.value.designRoot,
        rawComponent: target
      }
      const result = { ok: true as const, value: prepared.value }
      preparedCapsules.set(result, { epoch: session!.epoch, capsule })
      return result
    },

    commitConfirmation(
      prepared: unknown,
      expectedRevision: number,
      callbacks: {
        replaceRoot: (root: JsonRecord[]) => void
        select: (component: JsonRecord) => void
        publishEvents: () => void
      }
    ) {
      if (!usable() || !isRecord(prepared)) return fail('UNMANAGED_SESSION')
      const binding = preparedCapsules.get(prepared)
      if (
        !binding ||
        binding.epoch !== session!.epoch ||
        expectedRevision !== session!.revision ||
        binding.capsule.revision !== session!.revision + 1
      )
        return fail('STALE_PREPARE')
      const nextRoot = binding.capsule.designRoot
      const nextComponent = nextRoot.find(item => item === binding.capsule.rawComponent)
      if (!nextComponent) return fail('INVALID_CANDIDATE')
      session!.phase = 'publishing'
      session!.tokenGeneration += 1
      try {
        callbacks.replaceRoot(nextRoot)
        callbacks.select(nextComponent)
      } catch (error) {
        invalidate()
        throw error
      }
      const nextCapsule = { ...binding.capsule, rawComponent: nextComponent }
      capsules.set(nextComponent, nextCapsule)
      currentCapsule = nextCapsule
      currentComponent = nextComponent
      session!.revision = nextCapsule.revision
      session!.commitId = nextCapsule.commitId
      session!.phase = 'open'
      session!.dirty = true
      session!.editGeneration += 1
      try {
        callbacks.publishEvents()
      } catch (error) {
        invalidate()
        throw error
      }
      return { ok: true as const, revision: session!.revision, commitId: session!.commitId }
    },

    readDesign(component: unknown) {
      if (
        !usable() ||
        !component ||
        typeof component !== 'object' ||
        component !== currentComponent
      )
        return fail('UNMANAGED_SESSION')
      const capsule = capsules.get(component as object) || currentCapsule
      if (
        !capsule ||
        capsule.epoch !== session!.epoch ||
        capsule.revision !== session!.revision ||
        capsule.commitId !== session!.commitId
      )
        return fail('STALE_CAPSULE')
      return { ok: true as const, value: clone(capsule.designRoot) }
    },

    recordManifest(rawSnapshot: unknown, actuallyAppended: boolean) {
      if (!usable() || !actuallyAppended || !rawSnapshot || typeof rawSnapshot !== 'object')
        return false
      if (
        !currentCapsule ||
        currentCapsule.epoch !== session!.epoch ||
        !isRecord(rawSnapshot) ||
        !Array.isArray(rawSnapshot.componentData) ||
        !rawSnapshot.componentData.every(isRecord)
      )
        return false
      const designComponent = currentCapsule.designRoot.find(
        component => component.id === currentCapsule!.componentId
      )
      const historyRoot = clone(rawSnapshot.componentData) as JsonRecord[]
      const historyTargets = historyRoot.filter(
        component => component.id === currentCapsule!.componentId
      )
      if (!designComponent || historyTargets.length !== 1) return false
      historyTargets[0].propValue = clone(designComponent.propValue)
      historyTargets[0].cascade = clone(designComponent.cascade)
      manifests.set(rawSnapshot as object, {
        epoch: session!.epoch,
        capsule: {
          ...currentCapsule,
          designRoot: historyRoot,
          rawComponent: historyTargets[0]
        }
      })
      return true
    },

    prepareHistory(rawSnapshot: unknown, currentDvInfo: unknown) {
      if (!usable() || !rawSnapshot || typeof rawSnapshot !== 'object')
        return fail('UNMANAGED_SESSION')
      if (!isRecord(rawSnapshot) || !isRecord(currentDvInfo)) return fail('INVALID_HISTORY')
      const snapshot = clone(rawSnapshot) as JsonRecord
      const dvInfo = isRecord(snapshot.dvInfo) ? snapshot.dvInfo : {}
      ;['id', 'pid', 'dataState', 'contentId'].forEach(key => {
        if (Object.hasOwn(currentDvInfo, key)) dvInfo[key] = clone(currentDvInfo[key])
      })
      snapshot.dvInfo = dvInfo
      const manifest = manifests.get(rawSnapshot as object)
      if (!manifest || manifest.epoch !== session!.epoch) {
        invalidate()
        return {
          ok: false as const,
          reason: 'MANIFEST_UNAVAILABLE',
          fallback: snapshot
        }
      }
      snapshot.componentData = clone(manifest.capsule.designRoot)
      return {
        ok: true as const,
        value: snapshot,
        capsule: { ...manifest.capsule, designRoot: clone(manifest.capsule.designRoot) }
      }
    },

    commitHistory(
      prepared: unknown,
      callbacks: {
        moveIndex: () => void
        publishSnapshot: (snapshot: JsonRecord) => void
        publishSelection: () => void
        publishEvents: () => void
      }
    ) {
      if (!isRecord(prepared)) return fail('UNMANAGED_SESSION')
      if (prepared.reason === 'MANIFEST_UNAVAILABLE' && isRecord(prepared.fallback)) {
        callbacks.moveIndex()
        callbacks.publishSnapshot(prepared.fallback)
        callbacks.publishSelection()
        callbacks.publishEvents()
        return { ok: false as const, reason: 'UNMANAGED_FALLBACK' }
      }
      if (!usable() || !isRecord(prepared.value)) return fail('UNMANAGED_SESSION')
      const capsule = prepared.capsule as Capsule | undefined
      const historyComponent = capsule?.designRoot.find(
        component => component.id === capsule.componentId
      )
      if (!capsule || capsule.epoch !== session!.epoch || !historyComponent)
        return fail('INVALID_HISTORY')
      session!.phase = 'publishing'
      session!.tokenGeneration += 1
      try {
        callbacks.moveIndex()
        callbacks.publishSnapshot(prepared.value as JsonRecord)
        callbacks.publishSelection()
        session!.revision += 1
        session!.commitId = `history-${session!.revision}`
        const nextCapsule = { ...capsule, revision: session!.revision, commitId: session!.commitId }
        nextCapsule.rawComponent = historyComponent
        capsules.set(historyComponent, nextCapsule)
        currentCapsule = nextCapsule
        currentComponent = historyComponent
        session!.phase = 'open'
        session!.dirty = true
        session!.editGeneration += 1
        callbacks.publishEvents()
      } catch (error) {
        invalidate()
        throw error
      }
      return { ok: true as const, revision: session!.revision, commitId: session!.commitId }
    },

    allowsQuery(component: unknown) {
      if (!session || session.phase === 'unmanaged') return true
      return session.phase === 'open' && component === currentComponent
    },

    markDocumentEdited() {
      if (!usable()) return false
      session!.editGeneration += 1
      session!.dirty = true
      return true
    },

    captureSaveIntent(input: unknown) {
      if (!usable() || !session) return fail('UNMANAGED_SESSION')
      if (session.targetId == null && [...pending.values()].some(token => token.isCreate))
        return fail('BUSY_CREATE')
      if (session.targetId == null && [...unknown.values()].some(token => token.isCreate))
        return fail('BUSY_CREATE_OUTCOME_UNKNOWN')
      const captured = captureSave(input)
      if (!captured.ok) return captured
      if (pending.size > 0) {
        saveOverlap = true
        session.saveOrderUncertain = true
        session.dirty = true
      }
      const seq = ++session.saveSeq
      const token: SaveToken = {
        epoch: session.epoch,
        seq,
        revision: session.revision,
        commitId: session.commitId,
        tokenGeneration: session.tokenGeneration,
        editGeneration: session.editGeneration,
        targetId: captured.value.targetId,
        method: captured.value.method,
        intentDigest: captured.value.intentDigest,
        payload: clone(captured.value.payload),
        appCanvasNameCheck: clone(captured.value.appCanvasNameCheck),
        dvNameCheck: clone(captured.value.dvNameCheck),
        sent: false,
        isCreate: captured.value.method === 'saveCanvas'
      }
      pending.set(seq, token)
      if (pending.size > 1) saveOverlap = true
      return { ok: true as const, token: clone(token), capture: captured.value }
    },

    validateSaveTarget(token: unknown, dvInfo: unknown) {
      if (!usable() || !isRecord(token) || !isRecord(dvInfo)) return false
      const active = Number.isSafeInteger(token.seq) ? pending.get(token.seq as number) : undefined
      if (
        !active ||
        active.epoch !== session!.epoch ||
        active.tokenGeneration !== session!.tokenGeneration ||
        active.intentDigest !== token.intentDigest
      )
        return false
      const method = dvInfo.id && dvInfo.optType !== 'copy' ? 'updateCanvas' : 'saveCanvas'
      return (
        method === active.method &&
        (dvInfo.id ?? null) === active.targetId &&
        (method === 'saveCanvas'
          ? session!.targetId == null
          : session!.targetId === active.targetId)
      )
    },

    markSaveSent(token: unknown) {
      if (!usable() || !isRecord(token)) return false
      const active = Number.isSafeInteger(token.seq) ? pending.get(token.seq as number) : undefined
      if (
        !active ||
        active.epoch !== session!.epoch ||
        active.tokenGeneration !== session!.tokenGeneration ||
        active.intentDigest !== token.intentDigest
      )
        return false
      active.sent = true
      return true
    },

    settleSave(token: unknown, result: unknown, currentIntentDigest?: string) {
      if (!usable() || !session || !isRecord(token) || !isRecord(result))
        return fail('INVALID_TOKEN')
      if (!['unknown', 'definitely_not_written', 'success'].includes(String(result.status)))
        return fail('INVALID_RESULT')
      const seq = token.seq
      const active = Number.isSafeInteger(seq) ? pending.get(seq as number) : undefined
      if (
        !active ||
        active.epoch !== session.epoch ||
        active.tokenGeneration !== session.tokenGeneration ||
        active.intentDigest !== token.intentDigest
      )
        return fail('STALE_TOKEN')
      pending.delete(active.seq)
      if (result.status === 'unknown') {
        active.unknownReason =
          typeof result.reason === 'string' ? result.reason : 'transport_outcome_unknown'
        unknown.set(active.seq, active)
        session.saveOrderUncertain = true
        session.dirty = true
        return { ok: true as const, outcome: 'unknown', dirty: true }
      }
      if (result.status === 'definitely_not_written') {
        session.dirty = true
        if (pending.size === 0 && unknown.size === 0) saveOverlap = false
        return { ok: true as const, outcome: 'not_written', dirty: true }
      }
      if (active.isCreate && (result.resourceId == null || result.resourceId === '')) {
        active.unknownReason = 'create_succeeded_without_resource_id'
        unknown.set(active.seq, active)
        session.saveOrderUncertain = true
        session.dirty = true
        return { ok: true as const, outcome: 'unknown', dirty: true }
      }
      session.lastAckSeq = Math.max(session.lastAckSeq, active.seq)
      if (active.isCreate && session.targetId == null && result.resourceId != null) {
        session.targetId = result.resourceId
      }
      const targetMatches = active.isCreate
        ? result.resourceId != null && session.targetId === result.resourceId
        : active.targetId === session.targetId
      const unchanged =
        active.editGeneration === session.editGeneration &&
        currentIntentDigest === active.intentDigest &&
        targetMatches
      const canClear = unknown.size === 0 && pending.size === 0 && !saveOverlap && unchanged
      if (canClear) {
        session.dirty = false
        session.saveOrderUncertain = false
      } else {
        session.dirty = true
        if (saveOverlap) session.saveOrderUncertain = true
      }
      if (pending.size === 0 && unknown.size === 0) saveOverlap = false
      return {
        ok: true as const,
        outcome: 'success',
        dirty: session.dirty,
        lastAckSeq: session.lastAckSeq
      }
    },

    getState() {
      if (!session)
        return { phase: 'unmanaged' as const, authenticated: false, blocksCreate: false }
      return {
        phase: session.phase,
        authenticated: session.phase === 'open',
        blocksCreate: [...unknown.values()].some(token => token.isCreate),
        epoch: session.epoch,
        revision: session.revision,
        commitId: session.commitId,
        tokenGeneration: session.tokenGeneration,
        editGeneration: session.editGeneration,
        pending: [...pending.keys()],
        outcomeUnknown: [...unknown.keys()],
        lastAckSeq: session.lastAckSeq,
        saveOrderUncertain: session.saveOrderUncertain,
        dirty: session.dirty,
        targetId: session.targetId
      }
    },

    invalidate
  }
}
