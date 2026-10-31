type QueryIdentity = {
  documentEpoch: string
  componentRaw: object
  conditionRaw: object
  designRevision: number
  tokenGeneration: number
  runtimeGeneration: number
  requestId: number
}

type CapturedIdentity = QueryIdentity & { selectedValue: string }

type QueryObservationState = {
  identity: QueryIdentity
  selectedValue: string
  validity: 'pending' | 'valid' | 'invalid' | 'unverified'
  options: string[]
  loading: boolean
  design: unknown
  effects: {
    enumRequestsStarted: number
    enumResponsesSettled: number
    queryRefreshes: number
    runtimeWrites: number
  }
}

type EnumResponse = { values: string[] | null; error: string | null }

type TransitionResult = {
  applied: boolean
  state: QueryObservationState
  verificationRequest: CapturedIdentity | null
}

const sameInitialRequest = (current: QueryIdentity, captured: CapturedIdentity) =>
  current.documentEpoch === captured.documentEpoch &&
  current.componentRaw === captured.componentRaw &&
  current.conditionRaw === captured.conditionRaw &&
  current.designRevision === captured.designRevision &&
  current.tokenGeneration === captured.tokenGeneration &&
  current.requestId === captured.requestId

const sameVerificationRequest = (current: QueryObservationState, captured: CapturedIdentity) =>
  sameInitialRequest(current.identity, captured) &&
  current.identity.runtimeGeneration === captured.runtimeGeneration &&
  current.selectedValue === captured.selectedValue

const copyState = (state: QueryObservationState): QueryObservationState => ({
  ...state,
  identity: { ...state.identity },
  options: [...state.options],
  effects: { ...state.effects }
})

const noOp = (state: QueryObservationState): TransitionResult => ({
  applied: false,
  state,
  verificationRequest: null
})

export const handleInitialEnumResponse = (input: {
  state: QueryObservationState
  captured: CapturedIdentity
  response: EnumResponse
}): TransitionResult => {
  const { state, captured, response } = input
  if (!state.loading || !sameInitialRequest(state.identity, captured)) return noOp(state)

  const next = copyState(state)
  next.effects.enumResponsesSettled += 1

  if (response.error) {
    next.validity = 'unverified'
    next.loading = false
    return { applied: true, state: next, verificationRequest: null }
  }

  const values = response.values ?? []
  if (values.includes(state.selectedValue)) {
    next.options = [...values]
    next.validity = 'valid'
    next.loading = false
    return { applied: true, state: next, verificationRequest: null }
  }

  next.effects.enumRequestsStarted += 1
  next.identity.requestId += 1
  next.loading = true
  const verificationRequest: CapturedIdentity = {
    documentEpoch: next.identity.documentEpoch,
    componentRaw: next.identity.componentRaw,
    conditionRaw: next.identity.conditionRaw,
    designRevision: next.identity.designRevision,
    tokenGeneration: next.identity.tokenGeneration,
    runtimeGeneration: next.identity.runtimeGeneration,
    requestId: next.identity.requestId,
    selectedValue: next.selectedValue
  }
  return { applied: true, state: next, verificationRequest }
}

export const handleVerificationEnumResponse = (input: {
  state: QueryObservationState
  captured: CapturedIdentity
  response: EnumResponse
}): TransitionResult => {
  const { state, captured, response } = input
  if (!state.loading || !sameVerificationRequest(state, captured)) return noOp(state)

  const next = copyState(state)
  next.effects.enumResponsesSettled += 1
  next.loading = false

  if (response.error) {
    next.validity = 'unverified'
    return { applied: true, state: next, verificationRequest: null }
  }

  const values = response.values ?? []
  next.options = [...values]
  next.validity = values.includes(state.selectedValue) ? 'valid' : 'invalid'
  return { applied: true, state: next, verificationRequest: null }
}
