type SavedCanvasContext = {
  loadState?: unknown
  operation?: unknown
  resourceId?: unknown
  routeResourceId?: unknown
  dvInfoId?: unknown
  isTemplate?: unknown
  copyMode?: unknown
  canvasInstance?: unknown
  root?: unknown
}

type OwnerError =
  | 'SESSION_ALREADY_ACTIVE'
  | 'CANVAS_NOT_READY'
  | 'COPY_IS_NEW_RESOURCE'
  | 'TEMPLATE_NOT_SUPPORTED'
  | 'OPERATION_NOT_SUPPORTED'
  | 'INVALID_RESOURCE_ID'
  | 'RESOURCE_ID_MISMATCH'
  | 'RESOURCE_IDENTITY_CHANGED'
  | 'LIVE_CANVAS_IDENTITY_REQUIRED'
  | 'OWNER_HANDLE_INVALID'
  | 'OWNER_INVALIDATED'
  | 'CANVAS_INSTANCE_CHANGED'
  | 'ROOT_REPLACED'
  | 'REGISTERED_TARGET_CHANGED'
  | 'DUPLICATE_OR_INVALID_TARGET_ID'
  | 'NO_QUERY_TARGET'
  | 'TARGET_NOT_VQUERY'
  | 'STALE_COMPONENT_IDENTITY'
  | 'REGISTRATION_TOKEN_INVALID'

type InvalidationReason =
  | 'resource_changed'
  | 'auth_context_changed'
  | 'unmount'
  | 'duplicate_event'
  | 'canvas_replaced'
  | 'root_replaced'
  | 'mode_changed'
  | 'explicit'

type OwnerRecord = {
  state: 'open' | 'invalidated'
  generation: number
  resourceId: string
  routeResourceId: unknown
  dvInfoId: unknown
  canvasInstance: object
  root: unknown[]
  registrations: Map<object, { targetId: string; targetRaw: object; generation: number }>
  invalidationReason?: OwnerError | InvalidationReason
}

type CanvasComponent = {
  id?: unknown
  component?: unknown
  innerType?: unknown
}

const isObject = (value: unknown): value is object =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isCanvasComponent = (value: unknown): value is CanvasComponent => isObject(value)

const isValidResourceId = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const ownerValidity = (
  record: OwnerRecord,
  invalidationReason: OwnerError = 'OWNER_INVALIDATED'
) => {
  if (record.state === 'invalidated') {
    return {
      valid: false as const,
      state: 'invalidated' as const,
      reason: invalidationReason,
      generation: record.generation,
      registrationIds: [] as []
    }
  }
  return {
    valid: true as const,
    state: 'open' as const,
    generation: record.generation,
    registrationIds: [...record.registrations.values()].map(registration => registration.targetId)
  }
}

const unknownOwnerValidity = () => ({
  valid: false as const,
  state: 'unknown' as const,
  reason: 'OWNER_HANDLE_INVALID' as const,
  generation: null,
  registrationIds: [] as []
})

export const createSavedCanvasOwnerLifecycle = ({
  getCurrentContext
}: {
  getCurrentContext: () => SavedCanvasContext | null
}) => {
  const ownerRecords = new WeakMap<object, OwnerRecord>()
  let activeRecord: OwnerRecord | null = null

  const invalidateRecord = (record: OwnerRecord, reason: OwnerError | InvalidationReason) => {
    if (record.state === 'invalidated') return
    record.state = 'invalidated'
    record.generation += 1
    record.registrations.clear()
    record.invalidationReason = reason
    if (activeRecord === record) activeRecord = null
  }

  const getRecord = (owner: unknown) => (isObject(owner) ? ownerRecords.get(owner) : undefined)

  const revalidateOpenOwner = (record: OwnerRecord): OwnerError | null => {
    const context = getCurrentContext()
    if (!context || context.loadState !== 'ready') return 'CANVAS_NOT_READY'
    if (context.copyMode === true || context.operation === 'copy') return 'COPY_IS_NEW_RESOURCE'
    if (context.isTemplate === true || context.operation === 'template')
      return 'TEMPLATE_NOT_SUPPORTED'
    if (context.operation !== 'edit') return 'OPERATION_NOT_SUPPORTED'
    if (
      !isValidResourceId(context.resourceId) ||
      context.resourceId !== record.resourceId ||
      context.resourceId !== context.routeResourceId ||
      context.resourceId !== context.dvInfoId
    ) {
      return 'RESOURCE_IDENTITY_CHANGED'
    }
    if (context.canvasInstance !== record.canvasInstance) return 'CANVAS_INSTANCE_CHANGED'
    if (context.root !== record.root || !Array.isArray(context.root)) return 'ROOT_REPLACED'

    for (const registration of record.registrations.values()) {
      const matches = record.root.filter(
        (component): component is CanvasComponent =>
          isCanvasComponent(component) && component.id === registration.targetId
      )
      if (
        matches.length !== 1 ||
        matches[0]?.component !== 'VQuery' ||
        matches[0]?.innerType !== 'VQuery' ||
        matches[0] !== registration.targetRaw
      ) {
        return 'REGISTERED_TARGET_CHANGED'
      }
    }
    return null
  }

  const checkOpenOwner = (owner: unknown) => {
    const record = getRecord(owner)
    if (!record) return { record: null, error: 'OWNER_HANDLE_INVALID' as const }
    if (record.state === 'invalidated') return { record, error: 'OWNER_INVALIDATED' as const }
    const error = revalidateOpenOwner(record)
    if (error) {
      invalidateRecord(record, error)
      return { record, error }
    }
    return { record, error: null }
  }

  const registrationFailure = (
    state: 'open' | 'invalidated' | 'unknown',
    error: OwnerError,
    generation: number | null
  ) => ({
    ok: false as const,
    state,
    error,
    generation
  })

  const beginLoadedResourceSession = () => {
    if (activeRecord?.state === 'open')
      return { ok: false as const, error: 'SESSION_ALREADY_ACTIVE' as const }

    const context = getCurrentContext()
    if (!context || context.loadState !== 'ready')
      return { ok: false as const, error: 'CANVAS_NOT_READY' as const }
    if (context.copyMode === true || context.operation === 'copy')
      return { ok: false as const, error: 'COPY_IS_NEW_RESOURCE' as const }
    if (context.isTemplate === true || context.operation === 'template')
      return { ok: false as const, error: 'TEMPLATE_NOT_SUPPORTED' as const }
    if (context.operation !== 'edit')
      return { ok: false as const, error: 'OPERATION_NOT_SUPPORTED' as const }
    if (!isValidResourceId(context.resourceId))
      return { ok: false as const, error: 'INVALID_RESOURCE_ID' as const }
    if (context.resourceId !== context.routeResourceId || context.resourceId !== context.dvInfoId) {
      return { ok: false as const, error: 'RESOURCE_ID_MISMATCH' as const }
    }
    if (!isObject(context.canvasInstance) || !Array.isArray(context.root))
      return { ok: false as const, error: 'LIVE_CANVAS_IDENTITY_REQUIRED' as const }

    const owner = Object.freeze({})
    const record: OwnerRecord = {
      state: 'open',
      generation: 0,
      resourceId: context.resourceId,
      routeResourceId: context.routeResourceId,
      dvInfoId: context.dvInfoId,
      canvasInstance: context.canvasInstance,
      root: context.root,
      registrations: new Map()
    }
    ownerRecords.set(owner, record)
    activeRecord = record
    return { ok: true as const, owner }
  }

  const registerTarget = (owner: unknown, targetId: unknown, targetRaw: unknown) => {
    const checked = checkOpenOwner(owner)
    if (!checked.record || checked.error) {
      const state =
        checked.record?.state === 'invalidated'
          ? 'invalidated'
          : checked.record
          ? 'open'
          : 'unknown'
      const generation = checked.record?.generation ?? null
      return registrationFailure(state, checked.error ?? 'OWNER_HANDLE_INVALID', generation)
    }

    const record = checked.record
    if (!isValidResourceId(targetId))
      return registrationFailure('open', 'DUPLICATE_OR_INVALID_TARGET_ID', record.generation)
    const matches = record.root.filter(
      (component): component is CanvasComponent =>
        isCanvasComponent(component) && component.id === targetId
    )
    if (matches.length > 1)
      return registrationFailure('open', 'DUPLICATE_OR_INVALID_TARGET_ID', record.generation)
    if (matches.length === 0)
      return registrationFailure('open', 'NO_QUERY_TARGET', record.generation)
    const component = matches[0]
    if (component?.component !== 'VQuery' || component?.innerType !== 'VQuery')
      return registrationFailure('open', 'TARGET_NOT_VQUERY', record.generation)
    if (!isObject(targetRaw) || component !== targetRaw)
      return registrationFailure('open', 'STALE_COMPONENT_IDENTITY', record.generation)

    const existing = [...record.registrations.entries()].find(
      ([, registration]) => registration.targetId === targetId
    )
    if (existing) {
      if (existing[1].targetRaw !== targetRaw)
        return registrationFailure('open', 'STALE_COMPONENT_IDENTITY', record.generation)
      return {
        ok: true as const,
        state: 'accepted_for_identity_only' as const,
        token: existing[0],
        generation: record.generation
      }
    }

    const token = Object.freeze({})
    record.registrations.set(token, { targetId, targetRaw, generation: record.generation })
    return {
      ok: true as const,
      state: 'accepted_for_identity_only' as const,
      token,
      generation: record.generation
    }
  }

  const validate = (owner: unknown) => {
    const record = getRecord(owner)
    if (!record) return unknownOwnerValidity()
    if (record.state === 'invalidated') return ownerValidity(record)
    const error = revalidateOpenOwner(record)
    if (error) {
      invalidateRecord(record, error)
      return ownerValidity(record, error)
    }
    return ownerValidity(record)
  }

  const validateRegistration = (owner: unknown, token: unknown) => {
    const checked = checkOpenOwner(owner)
    if (!checked.record) {
      return {
        valid: false as const,
        state: 'unknown' as const,
        error: 'OWNER_HANDLE_INVALID' as const,
        generation: null
      }
    }
    if (checked.record.state === 'invalidated' || checked.error === 'OWNER_INVALIDATED') {
      return {
        valid: false as const,
        state: 'invalidated' as const,
        error: 'OWNER_INVALIDATED' as const,
        generation: checked.record.generation
      }
    }
    if (checked.error) {
      return {
        valid: false as const,
        state: 'invalidated' as const,
        error: 'OWNER_INVALIDATED' as const,
        generation: checked.record.generation
      }
    }
    const registration = isObject(token) ? checked.record.registrations.get(token) : undefined
    if (!registration || registration.generation !== checked.record.generation) {
      return {
        valid: false as const,
        state: 'unknown' as const,
        error: 'REGISTRATION_TOKEN_INVALID' as const,
        generation: null
      }
    }
    return {
      valid: true as const,
      state: 'open' as const,
      targetId: registration.targetId,
      generation: checked.record.generation
    }
  }

  const invalidate = (owner: unknown, reason: InvalidationReason) => {
    const record = getRecord(owner)
    if (record) invalidateRecord(record, reason)
  }

  return {
    beginLoadedResourceSession,
    registerTarget,
    validate,
    validateRegistration,
    invalidate
  }
}
