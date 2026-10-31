export type QueryReferenceFailureReason =
  | 'INVALID_INPUT'
  | 'DUPLICATE_ID'
  | 'MISSING_ID_MAP'
  | 'NON_INJECTIVE_ID_MAP'
  | 'MISSING_CONDITION'
  | 'REFERENCE_IDENTITY_MISMATCH'
  | 'MISSING_COMPONENT'
  | 'AMBIGUOUS_COMPONENT'
  | 'CYCLE'

export interface QueryReferenceTarget {
  componentId: string
  datasetId: string
  fieldId: string
}

export interface QueryReferenceCondition {
  id: string
  datasetId: string
  fieldId: string
  targetRefs: QueryReferenceTarget[]
}

export interface QueryReferenceNode {
  nodeId: string
  conditionId: string
  datasetId: string
  fieldId: string
}

export interface QueryReferenceInput {
  conditions: QueryReferenceCondition[]
  chains: QueryReferenceNode[][]
  conditionMap: Record<string, string>
  nodeMap: Record<string, string>
  componentMap: Record<string, string[]>
}

export interface QueryReferencePlan {
  conditions: QueryReferenceCondition[]
  chains: QueryReferenceNode[][]
}

export type QueryReferenceResult =
  | { ok: true; value: QueryReferencePlan }
  | { ok: false; reason: QueryReferenceFailureReason }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !value.includes('--')

const hasExactKeys = (value: Record<string, unknown>, keys: string[]) =>
  Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key))

const isUnique = (values: string[]) => new Set(values).size === values.length

export const prepareQueryReferences = (input: QueryReferenceInput): QueryReferenceResult => {
  if (!isRecord(input)) return { ok: false, reason: 'INVALID_INPUT' }

  const raw = input as unknown as Record<string, unknown>
  if (!hasExactKeys(raw, ['conditions', 'chains', 'conditionMap', 'nodeMap', 'componentMap'])) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }
  if (
    !Array.isArray(raw.conditions) ||
    !Array.isArray(raw.chains) ||
    !isRecord(raw.conditionMap) ||
    !isRecord(raw.nodeMap) ||
    !isRecord(raw.componentMap)
  ) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }

  const conditions: QueryReferenceCondition[] = []
  for (const value of raw.conditions) {
    if (!isRecord(value) || !hasExactKeys(value, ['id', 'datasetId', 'fieldId', 'targetRefs'])) {
      return { ok: false, reason: 'INVALID_INPUT' }
    }
    if (!isId(value.id) || !isId(value.datasetId) || !isId(value.fieldId)) {
      return { ok: false, reason: 'INVALID_INPUT' }
    }
    if (!Array.isArray(value.targetRefs)) return { ok: false, reason: 'INVALID_INPUT' }
    const targetRefs: QueryReferenceTarget[] = []
    for (const target of value.targetRefs) {
      if (
        !isRecord(target) ||
        !hasExactKeys(target, ['componentId', 'datasetId', 'fieldId']) ||
        !isId(target.componentId) ||
        !isId(target.datasetId) ||
        !isId(target.fieldId)
      ) {
        return { ok: false, reason: 'INVALID_INPUT' }
      }
      targetRefs.push({
        componentId: target.componentId,
        datasetId: target.datasetId,
        fieldId: target.fieldId
      })
    }
    conditions.push({
      id: value.id,
      datasetId: value.datasetId,
      fieldId: value.fieldId,
      targetRefs
    })
  }

  const chains: QueryReferenceNode[][] = []
  const nodeIds: string[] = []
  for (const chain of raw.chains) {
    if (!Array.isArray(chain)) return { ok: false, reason: 'INVALID_INPUT' }
    const nodes: QueryReferenceNode[] = []
    for (const value of chain) {
      if (
        !isRecord(value) ||
        !hasExactKeys(value, ['nodeId', 'conditionId', 'datasetId', 'fieldId'])
      ) {
        return { ok: false, reason: 'INVALID_INPUT' }
      }
      if (
        !isId(value.nodeId) ||
        !isId(value.conditionId) ||
        !isId(value.datasetId) ||
        !isId(value.fieldId)
      ) {
        return { ok: false, reason: 'INVALID_INPUT' }
      }
      nodeIds.push(value.nodeId)
      nodes.push({
        nodeId: value.nodeId,
        conditionId: value.conditionId,
        datasetId: value.datasetId,
        fieldId: value.fieldId
      })
    }
    chains.push(nodes)
  }

  const conditionIds = conditions.map(condition => condition.id)
  if (!isUnique(conditionIds) || !isUnique(nodeIds)) return { ok: false, reason: 'DUPLICATE_ID' }

  const conditionMap = raw.conditionMap as Record<string, unknown>
  const nodeMap = raw.nodeMap as Record<string, unknown>
  if (
    conditionIds.some(id => !Object.hasOwn(conditionMap, id)) ||
    nodeIds.some(id => !Object.hasOwn(nodeMap, id))
  ) {
    return { ok: false, reason: 'MISSING_ID_MAP' }
  }
  const mappedConditionIds = conditionIds.map(id => conditionMap[id])
  const mappedNodeIds = nodeIds.map(id => nodeMap[id])
  if (!mappedConditionIds.every(isId) || !mappedNodeIds.every(isId)) {
    return { ok: false, reason: 'MISSING_ID_MAP' }
  }
  if (!isUnique(mappedConditionIds) || !isUnique(mappedNodeIds)) {
    return { ok: false, reason: 'NON_INJECTIVE_ID_MAP' }
  }

  const conditionById = new Map(conditions.map(condition => [condition.id, condition]))
  for (const chain of chains) {
    for (const node of chain) {
      if (!conditionById.has(node.conditionId)) return { ok: false, reason: 'MISSING_CONDITION' }
    }
  }
  for (const chain of chains) {
    for (const node of chain) {
      const condition = conditionById.get(node.conditionId)
      if (condition?.datasetId !== node.datasetId || condition.fieldId !== node.fieldId) {
        return { ok: false, reason: 'REFERENCE_IDENTITY_MISMATCH' }
      }
    }
  }

  const componentMap = raw.componentMap as Record<string, unknown>
  const referencedComponentIds = [
    ...new Set(conditions.flatMap(condition => condition.targetRefs.map(ref => ref.componentId)))
  ]
  const componentTargets = new Map<string, string>()
  for (const componentId of referencedComponentIds) {
    if (!Object.hasOwn(componentMap, componentId)) return { ok: false, reason: 'MISSING_COMPONENT' }
    const targets = componentMap[componentId]
    if (!Array.isArray(targets) || !targets.every(isId)) {
      return { ok: false, reason: 'MISSING_COMPONENT' }
    }
    if (targets.length === 0) return { ok: false, reason: 'MISSING_COMPONENT' }
    if (targets.length !== 1) return { ok: false, reason: 'AMBIGUOUS_COMPONENT' }
    componentTargets.set(componentId, targets[0])
  }

  const edges = new Map<string, Set<string>>()
  for (const chain of chains) {
    for (let index = 1; index < chain.length; index += 1) {
      const from = chain[index - 1].conditionId
      const to = chain[index].conditionId
      if (!edges.has(from)) edges.set(from, new Set())
      edges.get(from)?.add(to)
    }
  }
  const visiting = new Set<string>()
  const visited = new Set<string>()
  const hasCycle = (conditionId: string): boolean => {
    if (visiting.has(conditionId)) return true
    if (visited.has(conditionId)) return false
    visiting.add(conditionId)
    for (const next of edges.get(conditionId) || []) {
      if (hasCycle(next)) return true
    }
    visiting.delete(conditionId)
    visited.add(conditionId)
    return false
  }
  for (const conditionId of conditionIds) {
    if (hasCycle(conditionId)) return { ok: false, reason: 'CYCLE' }
  }

  return {
    ok: true,
    value: {
      conditions: conditions.map(condition => ({
        id: conditionMap[condition.id] as string,
        datasetId: condition.datasetId,
        fieldId: condition.fieldId,
        targetRefs: condition.targetRefs.map(target => ({
          componentId: componentTargets.get(target.componentId) as string,
          datasetId: target.datasetId,
          fieldId: target.fieldId
        }))
      })),
      chains: chains.map(chain =>
        chain.map(node => ({
          nodeId: nodeMap[node.nodeId] as string,
          conditionId: conditionMap[node.conditionId] as string,
          datasetId: node.datasetId,
          fieldId: node.fieldId
        }))
      )
    }
  }
}
