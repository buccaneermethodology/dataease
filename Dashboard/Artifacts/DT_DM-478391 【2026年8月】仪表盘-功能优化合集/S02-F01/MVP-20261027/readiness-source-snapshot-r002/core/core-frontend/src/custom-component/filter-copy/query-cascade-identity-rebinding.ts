type CascadeNode = {
  id: string
  datasetId: string
  fieldId: string
  placeholder: string
  selectValue?: unknown[]
  currentSelectValue?: unknown[]
}

type RebindReason =
  | 'INVALID_INPUT'
  | 'INVALID_ID'
  | 'INVALID_COMPOSITE_REFERENCE'
  | 'MISSING_NODE_ID'
  | 'MISSING_QUERY_ID'
  | 'DUPLICATE_TARGET_ID'
  | 'INVALID_PLACEHOLDER_STATE'

type RebindResult = { ok: true; value: CascadeNode[][] } | { ok: false; reason: RebindReason }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const hasOwn = (value: object, key: string) => Object.prototype.hasOwnProperty.call(value, key)

const isId = (value: string) => value.length > 0 && !value.includes('--')

const readIdMap = (value: unknown): Record<string, unknown> | null =>
  (isRecord(value) && Object.getPrototypeOf(value) === Object.prototype) ||
  (isRecord(value) && Object.getPrototypeOf(value) === null)
    ? value
    : null

const hasInvalidMapId = (map: Record<string, unknown>) =>
  Object.entries(map).some(
    ([sourceId, targetId]) => !isId(sourceId) || typeof targetId !== 'string' || !isId(targetId)
  )

const hasDuplicateTargets = (map: Record<string, unknown>) => {
  const seen = new Set<string>()
  for (const value of Object.values(map)) {
    if (typeof value !== 'string' || seen.has(value)) return true
    seen.add(value)
  }
  return false
}

/**
 * Rebinds only the node/query identities in a QueryCascade-shaped tree.
 * Dataset and field segments stay exact; runtime selections are discarded.
 * This is an offline pure transformation and does not authorize a product paste.
 */
export const rebindQueryCascadeIdentities = (input: unknown): RebindResult => {
  if (!isRecord(input)) return { ok: false, reason: 'INVALID_INPUT' }

  const allowedInputKeys = new Set(['cascade', 'queryIdMap', 'nodeIdMap'])
  if (Object.keys(input).some(key => !allowedInputKeys.has(key))) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }

  const { cascade } = input
  const queryIdMap = readIdMap(input.queryIdMap)
  const nodeIdMap = readIdMap(input.nodeIdMap)
  if (!Array.isArray(cascade) || cascade.length === 0 || !queryIdMap || !nodeIdMap) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }

  const groups: Record<string, unknown>[][] = []
  for (const group of cascade) {
    if (!Array.isArray(group) || group.length === 0 || group.length > 2) {
      return { ok: false, reason: 'INVALID_INPUT' }
    }
    const nodes: Record<string, unknown>[] = []
    for (const node of group) {
      if (!isRecord(node)) return { ok: false, reason: 'INVALID_INPUT' }
      const allowedNodeKeys = new Set([
        'id',
        'datasetId',
        'fieldId',
        'placeholder',
        'selectValue',
        'currentSelectValue'
      ])
      if (
        Object.keys(node).some(key => !allowedNodeKeys.has(key)) ||
        !['id', 'datasetId', 'fieldId', 'placeholder'].every(key => hasOwn(node, key)) ||
        typeof node.id !== 'string' ||
        typeof node.datasetId !== 'string' ||
        typeof node.fieldId !== 'string' ||
        typeof node.placeholder !== 'string' ||
        (hasOwn(node, 'selectValue') && !Array.isArray(node.selectValue)) ||
        (hasOwn(node, 'currentSelectValue') && !Array.isArray(node.currentSelectValue))
      ) {
        return { ok: false, reason: 'INVALID_INPUT' }
      }
      nodes.push(node)
    }
    groups.push(nodes)
  }

  if (hasInvalidMapId(nodeIdMap) || hasInvalidMapId(queryIdMap)) {
    return { ok: false, reason: 'INVALID_ID' }
  }

  const encodedReferences = groups.map(group =>
    group.map(node => (node.datasetId as string).split('--'))
  )
  if (encodedReferences.some(group => group.some(parts => parts.length !== 3))) {
    return { ok: false, reason: 'INVALID_COMPOSITE_REFERENCE' }
  }

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    for (let nodeIndex = 0; nodeIndex < groups[groupIndex].length; nodeIndex++) {
      const node = groups[groupIndex][nodeIndex]
      const [datasetId, queryId, fieldId] = encodedReferences[groupIndex][nodeIndex]
      if (
        !isId(node.id as string) ||
        !isId(datasetId) ||
        !isId(queryId) ||
        !isId(fieldId) ||
        ((node.fieldId as string).length > 0 && !isId(node.fieldId as string))
      ) {
        return { ok: false, reason: 'INVALID_ID' }
      }
    }
  }

  for (const group of groups) {
    for (const node of group) {
      if (!hasOwn(nodeIdMap, node.id as string)) {
        return { ok: false, reason: 'MISSING_NODE_ID' }
      }
    }
  }
  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    for (let nodeIndex = 0; nodeIndex < groups[groupIndex].length; nodeIndex++) {
      const queryId = encodedReferences[groupIndex][nodeIndex][1]
      if (!hasOwn(queryIdMap, queryId)) {
        return { ok: false, reason: 'MISSING_QUERY_ID' }
      }
    }
  }

  if (hasDuplicateTargets(nodeIdMap) || hasDuplicateTargets(queryIdMap)) {
    return { ok: false, reason: 'DUPLICATE_TARGET_ID' }
  }

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    for (let nodeIndex = 1; nodeIndex < groups[groupIndex].length; nodeIndex++) {
      const previousDataset = encodedReferences[groupIndex][nodeIndex - 1][0]
      const currentDataset = encodedReferences[groupIndex][nodeIndex][0]
      if (previousDataset === currentDataset && groups[groupIndex][nodeIndex].fieldId !== '') {
        return { ok: false, reason: 'INVALID_PLACEHOLDER_STATE' }
      }
    }
  }

  const value = groups.map((group, groupIndex) =>
    group.map((node, nodeIndex) => {
      const [datasetId, queryId, fieldId] = encodedReferences[groupIndex][nodeIndex]
      return {
        id: nodeIdMap[node.id as string] as string,
        datasetId: `${datasetId}--${queryIdMap[queryId]}--${fieldId}`,
        fieldId: node.fieldId as string,
        placeholder: node.placeholder as string,
        selectValue: []
      }
    })
  )

  return { ok: true, value }
}
