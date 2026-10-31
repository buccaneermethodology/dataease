type SavedOwnerMode = 'saved_edit' | 'cache_restore'
type LoadMode =
  | SavedOwnerMode
  | 'copy_as_new'
  | 'template_create'
  | 'blank_create'
  | 'preview_embed'
type PublicationField = 'resource_metadata' | 'component_root' | 'style' | 'view'
type ProducerStatus = 'idle' | 'loading' | 'publishing' | 'ready' | 'publication_failed' | 'invalid'

type ProviderGeneration = string | number | null | undefined

type LoadTicket = {
  readonly generation: number
  readonly mode: SavedOwnerMode
  readonly requestedResourceId: string
  readonly providerIdentityGeneration: ProviderGeneration
  readonly token: object
}

type SavedCanvasOwner = {
  readonly resourceId: string
  readonly generation: number
  readonly canvasInstanceToken: object
  readonly rootRawRef: object
  readonly rootRevision: number
  readonly targetId: string
  readonly targetRawRef: object
  readonly providerIdentityGeneration: ProviderGeneration
}

type ProducerSnapshot = {
  status: ProducerStatus
  generation: number
  owner: SavedCanvasOwner | null
}

type Result<T> = ({ ok: true } & T) | { ok: false; reason: string }
type NoFields = Record<never, never>

const publicationOrder: PublicationField[] = [
  'resource_metadata',
  'component_root',
  'style',
  'view'
]
const isSupportedMode = (mode: LoadMode): mode is SavedOwnerMode =>
  mode === 'saved_edit' || mode === 'cache_restore'

/**
 * Detached producer-local lifecycle model. It has no Store, permission, read,
 * commit, rendering, query, preview, or persistence dependencies.
 */
export const createSavedCanvasOwnerStoreProducer = () => {
  let snapshot: ProducerSnapshot = { status: 'idle', generation: 0, owner: null }
  let activeTicket: LoadTicket | null = null
  let setterIndex = 0
  let publishedResourceId: string | null = null

  const getSnapshot = (): ProducerSnapshot => ({ ...snapshot })

  const beginLoad = (input: {
    mode: LoadMode
    requestedResourceId?: string | null
    providerIdentityGeneration?: ProviderGeneration
  }): Result<{ ticket: LoadTicket }> => {
    if (!isSupportedMode(input.mode)) return { ok: false, reason: 'mode_not_supported' }
    if (!input.requestedResourceId) return { ok: false, reason: 'resource_id_mismatch' }

    const generation = snapshot.generation + 1
    const ticket: LoadTicket = Object.freeze({
      generation,
      mode: input.mode,
      requestedResourceId: input.requestedResourceId,
      providerIdentityGeneration: input.providerIdentityGeneration,
      token: {}
    })
    activeTicket = ticket
    setterIndex = 0
    publishedResourceId = null
    snapshot = { status: 'loading', generation, owner: null }
    return { ok: true, ticket }
  }

  const isCurrentTicket = (ticket: LoadTicket): boolean =>
    activeTicket === ticket && ticket.generation === snapshot.generation

  const startPublication = (ticket: LoadTicket, responseResourceId: string): Result<NoFields> => {
    if (!isCurrentTicket(ticket)) return { ok: false, reason: 'stale_generation' }
    if (!isSupportedMode(ticket.mode)) return { ok: false, reason: 'mode_not_supported' }
    if (!responseResourceId || responseResourceId !== ticket.requestedResourceId) {
      return { ok: false, reason: 'resource_id_mismatch' }
    }

    publishedResourceId = responseResourceId
    setterIndex = 0
    snapshot = { status: 'publishing', generation: snapshot.generation, owner: null }
    return { ok: true }
  }

  const recordSetter = (ticket: LoadTicket, field: PublicationField): Result<NoFields> => {
    if (!isCurrentTicket(ticket)) return { ok: false, reason: 'stale_generation' }
    if (snapshot.status !== 'publishing') {
      return { ok: false, reason: 'incomplete_store_publication' }
    }
    if (publicationOrder[setterIndex] !== field) {
      return { ok: false, reason: 'incomplete_store_publication' }
    }
    setterIndex += 1
    return { ok: true }
  }

  const failPublication = (ticket: LoadTicket, _cause: string): Result<Record<string, never>> => {
    if (!isCurrentTicket(ticket)) return { ok: false, reason: 'stale_generation' }
    if (snapshot.status !== 'publishing') {
      return { ok: false, reason: 'incomplete_store_publication' }
    }
    activeTicket = null
    publishedResourceId = null
    snapshot = { status: 'publication_failed', generation: snapshot.generation, owner: null }
    return { ok: false, reason: 'partial_publication_failed' }
  }

  const finishPublication = (
    ticket: LoadTicket,
    context: {
      rootRawRef?: object | null
      targets?: Array<{ id?: string | null; type?: string; rawRef?: object | null }>
      providerIdentityGeneration?: ProviderGeneration
    }
  ): Result<{ owner: SavedCanvasOwner }> => {
    if (!isCurrentTicket(ticket)) return { ok: false, reason: 'stale_generation' }
    if (!isSupportedMode(ticket.mode)) return { ok: false, reason: 'mode_not_supported' }
    if (publishedResourceId !== ticket.requestedResourceId) {
      return { ok: false, reason: 'resource_id_mismatch' }
    }
    if (snapshot.status !== 'publishing' || setterIndex !== publicationOrder.length) {
      return { ok: false, reason: 'incomplete_store_publication' }
    }
    if (!context.rootRawRef) return { ok: false, reason: 'root_missing_or_changed' }

    const targets = (context.targets ?? []).filter(target => target.type === 'VQuery')
    if (targets.length === 0) return { ok: false, reason: 'target_missing' }
    if (targets.length !== 1) return { ok: false, reason: 'target_ambiguous' }
    const target = targets[0]
    if (!target.id || !target.rawRef) return { ok: false, reason: 'target_raw_identity_changed' }
    if (context.providerIdentityGeneration !== ticket.providerIdentityGeneration) {
      return { ok: false, reason: 'principal_or_organization_changed' }
    }

    const owner: SavedCanvasOwner = Object.freeze({
      resourceId: publishedResourceId,
      generation: snapshot.generation,
      canvasInstanceToken: ticket.token,
      rootRawRef: context.rootRawRef,
      rootRevision: snapshot.generation,
      targetId: target.id,
      targetRawRef: target.rawRef,
      providerIdentityGeneration: ticket.providerIdentityGeneration
    })
    snapshot = { status: 'ready', generation: snapshot.generation, owner }
    return { ok: true, owner }
  }

  const validateOwner = (
    owner: SavedCanvasOwner,
    context: {
      generation: number
      resourceId: string
      rootRawRef?: object | null
      targets?: Array<{ id?: string | null; type?: string; rawRef?: object | null }>
      providerIdentityGeneration?: ProviderGeneration
    }
  ): Result<{ owner: SavedCanvasOwner }> => {
    if (snapshot.owner !== owner || snapshot.status !== 'ready') {
      return { ok: false, reason: 'owner_invalidated' }
    }
    if (context.generation !== owner.generation || context.resourceId !== owner.resourceId) {
      return { ok: false, reason: 'stale_generation' }
    }
    if (!context.rootRawRef || context.rootRawRef !== owner.rootRawRef) {
      return invalidateForIdentityChange(owner, 'root_missing_or_changed')
    }
    const targets = (context.targets ?? []).filter(target => target.type === 'VQuery')
    if (targets.length === 0) return invalidateForIdentityChange(owner, 'target_missing')
    if (targets.length !== 1) return invalidateForIdentityChange(owner, 'target_ambiguous')
    if (targets[0].id !== owner.targetId || targets[0].rawRef !== owner.targetRawRef) {
      return invalidateForIdentityChange(owner, 'target_raw_identity_changed')
    }
    if (context.providerIdentityGeneration !== owner.providerIdentityGeneration) {
      return invalidateForIdentityChange(owner, 'principal_or_organization_changed')
    }
    return { ok: true, owner }
  }

  const invalidateForIdentityChange = (
    owner: SavedCanvasOwner,
    reason: string
  ): Result<{ owner: SavedCanvasOwner }> => {
    if (snapshot.owner !== owner || snapshot.status !== 'ready') {
      return { ok: false, reason: 'owner_invalidated' }
    }
    activeTicket = null
    setterIndex = 0
    publishedResourceId = null
    snapshot = { status: 'invalid', generation: snapshot.generation + 1, owner: null }
    return { ok: false, reason }
  }

  const invalidate = (
    owner: SavedCanvasOwner,
    reason: string,
    _nextIdentityGeneration?: ProviderGeneration
  ): Result<NoFields> => {
    if (snapshot.owner !== owner || snapshot.status !== 'ready') {
      return { ok: false, reason: 'owner_invalidated' }
    }
    activeTicket = null
    publishedResourceId = null
    snapshot = {
      status: 'invalid',
      generation: snapshot.generation + 1,
      owner: null
    }
    return { ok: true }
  }

  return Object.freeze({
    beginLoad,
    startPublication,
    recordSetter,
    finishPublication,
    failPublication,
    validateOwner,
    invalidate,
    getSnapshot
  })
}
