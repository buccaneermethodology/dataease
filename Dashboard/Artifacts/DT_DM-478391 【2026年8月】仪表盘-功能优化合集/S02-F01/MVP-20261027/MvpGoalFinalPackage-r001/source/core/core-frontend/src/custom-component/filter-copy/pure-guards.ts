export type Decision = 'allow' | 'reject'

const supportedKinds = new Set(['chart', 'query'])

export const decideDataset = (
  sourceDatasetId: string | null,
  targetDatasetId: string | null,
  targetMetadataStatus: string
) => {
  if (targetMetadataStatus !== 'resolved') {
    return {
      decision: 'reject' as Decision,
      reason: targetMetadataStatus === 'not_found' ? 'dataset_metadata_not_found' : 'invalid_input'
    }
  }

  if (
    typeof sourceDatasetId !== 'string' ||
    !sourceDatasetId.length ||
    typeof targetDatasetId !== 'string' ||
    !targetDatasetId.length
  ) {
    return { decision: 'reject' as Decision, reason: 'invalid_input' }
  }

  if (sourceDatasetId !== targetDatasetId) {
    return { decision: 'reject' as Decision, reason: 'dataset_id_mismatch' }
  }

  return { decision: 'allow' as Decision }
}

export const decideCompatibility = (sourceKind: string, targetKind: string) => ({
  compatibility_decision:
    supportedKinds.has(sourceKind) && sourceKind === targetKind
      ? ('allow' as Decision)
      : ('reject' as Decision)
})

export const isTtlValid = (createdAtMs: number, nowMs: number, ttlMs: number) => {
  if (![createdAtMs, nowMs, ttlMs].every(Number.isSafeInteger) || ttlMs < 0) return false
  const ageMs = nowMs - createdAtMs
  return Number.isSafeInteger(ageMs) && ageMs >= 0 && ageMs < ttlMs
}

export const utf8ByteLength = (payload: string) => new TextEncoder().encode(payload).length

export const countTerminalLeaves = (tree: unknown): number => {
  if (!tree || typeof tree !== 'object') return 0
  const items = (tree as { items?: unknown }).items
  if (!Array.isArray(items)) return 1
  return items.reduce<number>((total, item) => total + countTerminalLeaves(item), 0)
}

export const isWithinPayloadBounds = (leafCount: number, payloadBytes: number) =>
  Number.isSafeInteger(leafCount) &&
  Number.isSafeInteger(payloadBytes) &&
  leafCount >= 0 &&
  payloadBytes >= 0 &&
  leafCount <= 50 &&
  payloadBytes <= 1000000
