import type { QueryReferenceTarget } from './query-reference-plan'

export interface ComponentDirectoryEntry {
  componentId: string
  datasetId: string
  fieldIds: string[]
}

export interface QueryTargetComponentMapInput {
  references: QueryReferenceTarget[]
  sourceComponents: ComponentDirectoryEntry[]
  targetComponents: ComponentDirectoryEntry[]
}

export type QueryTargetComponentMapFailureReason =
  | 'INVALID_INPUT'
  | 'DUPLICATE_COMPONENT_ID'
  | 'SOURCE_REFERENCE_UNRESOLVED'
  | 'MISSING_COMPONENT'
  | 'AMBIGUOUS_COMPONENT'

export type QueryTargetComponentMapResult =
  | { ok: true; componentMap: Record<string, string[]> }
  | { ok: false; reason: QueryTargetComponentMapFailureReason }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !value.includes('--')

const hasExactKeys = (value: Record<string, unknown>, keys: string[]) =>
  Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key))

const isReference = (value: unknown): value is QueryReferenceTarget =>
  isRecord(value) &&
  hasExactKeys(value, ['componentId', 'datasetId', 'fieldId']) &&
  isId(value.componentId) &&
  isId(value.datasetId) &&
  isId(value.fieldId)

const isDirectoryEntry = (value: unknown): value is ComponentDirectoryEntry =>
  isRecord(value) &&
  hasExactKeys(value, ['componentId', 'datasetId', 'fieldIds']) &&
  isId(value.componentId) &&
  isId(value.datasetId) &&
  Array.isArray(value.fieldIds) &&
  value.fieldIds.every(isId)

const isDirectory = (entries: unknown): entries is ComponentDirectoryEntry[] =>
  Array.isArray(entries) && entries.every(isDirectoryEntry)

const tupleKey = (reference: QueryReferenceTarget) =>
  JSON.stringify([reference.componentId, reference.datasetId, reference.fieldId])

export const resolveTargetComponentMap = (input: unknown): QueryTargetComponentMapResult => {
  if (
    !isRecord(input) ||
    !hasExactKeys(input, ['references', 'sourceComponents', 'targetComponents']) ||
    !Array.isArray(input.references) ||
    !input.references.every(isReference) ||
    !isDirectory(input.sourceComponents) ||
    !isDirectory(input.targetComponents)
  ) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }
  if (
    new Set(input.sourceComponents.map(component => component.componentId)).size !==
      input.sourceComponents.length ||
    new Set(input.targetComponents.map(component => component.componentId)).size !==
      input.targetComponents.length
  ) {
    return { ok: false, reason: 'DUPLICATE_COMPONENT_ID' }
  }

  const sourceById = new Map(
    input.sourceComponents.map(component => [component.componentId, component])
  )
  for (const reference of input.references) {
    const source = sourceById.get(reference.componentId)
    if (
      !source ||
      source.datasetId !== reference.datasetId ||
      !source.fieldIds.includes(reference.fieldId)
    ) {
      return { ok: false, reason: 'SOURCE_REFERENCE_UNRESOLVED' }
    }
  }

  const referencesBySource = new Map<string, { datasetId: string; fieldIds: Set<string> }>()
  const seenReferences = new Set<string>()
  for (const reference of input.references) {
    const key = tupleKey(reference)
    if (seenReferences.has(key)) continue
    seenReferences.add(key)

    const group = referencesBySource.get(reference.componentId)
    if (group) {
      group.fieldIds.add(reference.fieldId)
    } else {
      referencesBySource.set(reference.componentId, {
        datasetId: reference.datasetId,
        fieldIds: new Set([reference.fieldId])
      })
    }
  }

  const mapEntries: Array<[string, string[]]> = []
  for (const [sourceId, group] of referencesBySource) {
    const candidates = input.targetComponents.filter(
      target =>
        target.datasetId === group.datasetId &&
        [...group.fieldIds].every(fieldId => target.fieldIds.includes(fieldId))
    )
    if (candidates.length === 0) return { ok: false, reason: 'MISSING_COMPONENT' }
    if (candidates.length > 1) return { ok: false, reason: 'AMBIGUOUS_COMPONENT' }
    mapEntries.push([sourceId, [candidates[0].componentId]])
  }

  return { ok: true, componentMap: Object.fromEntries(mapEntries) }
}
