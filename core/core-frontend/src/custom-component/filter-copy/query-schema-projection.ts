import type { QueryReferenceInput } from './query-reference-plan'

export type ProjectionReason =
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_REFERENCE_SHAPE'
  | 'SOURCE_COMPONENT_UNRESOLVED'
  | 'INVALID_COMPOSITE_REFERENCE'

export type QuerySchemaProjectionResult =
  | { ok: true; value: QueryReferenceInput }
  | { ok: false; reason: ProjectionReason }

interface SourceComponent {
  componentId: string
  datasetId: string
  fieldIds: string[]
}

const isRecord = (value: unknown): value is Record<string, any> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !value.includes('--')

const isEmptyContainer = (value: unknown) =>
  Array.isArray(value) ? value.length === 0 : isRecord(value) && Object.keys(value).length === 0

const cloneStringMap = (value: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(value).map(([key, item]) => [key, item])) as Record<
    string,
    string
  >

const cloneComponentMap = (value: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, [...(item as string[])]])
  ) as Record<string, string[]>

export const projectQueryReferenceInput = (input: unknown): QuerySchemaProjectionResult => {
  if (!isRecord(input) || !Array.isArray(input.propValue) || input.propValue.length === 0) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }
  if (input.cascade !== undefined && !Array.isArray(input.cascade)) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }
  const cascade = input.cascade === undefined ? [] : input.cascade
  if (!cascade.every((chain: unknown) => Array.isArray(chain) && chain.length > 0)) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }
  if (!Array.isArray(input.sourceComponents) || !isRecord(input.maps)) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }
  const { conditionMap, nodeMap, componentMap } = input.maps
  if (!isRecord(conditionMap) || !isRecord(nodeMap) || !isRecord(componentMap)) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }
  if (
    !Object.values(conditionMap).every(isId) ||
    !Object.values(nodeMap).every(isId) ||
    !Object.values(componentMap).every(
      (targets: unknown) => Array.isArray(targets) && targets.every(isId)
    )
  ) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }

  const checkedComponents = new Set<string>()
  for (const condition of input.propValue) {
    if (
      !isRecord(condition) ||
      !isId(condition.id) ||
      !isRecord(condition.dataset) ||
      !isId(condition.dataset.id) ||
      !isRecord(condition.field) ||
      !isId(condition.field.id) ||
      typeof condition.displayType !== 'string' ||
      typeof condition.optionValueSource !== 'number' ||
      !Array.isArray(condition.checkedFields) ||
      !condition.checkedFields.length ||
      !condition.checkedFields.every(isId) ||
      new Set(condition.checkedFields).size !== condition.checkedFields.length ||
      !isRecord(condition.checkedFieldsMap) ||
      !condition.checkedFields.every((componentId: string) =>
        isId(condition.checkedFieldsMap[componentId])
      )
    ) {
      return { ok: false, reason: 'INVALID_INPUT' }
    }
    condition.checkedFields.forEach((componentId: string) => checkedComponents.add(componentId))
  }
  for (const chain of cascade) {
    for (const node of chain) {
      if (!isRecord(node) || !isId(node.id) || typeof node.datasetId !== 'string') {
        return { ok: false, reason: 'INVALID_INPUT' }
      }
      if (node.fieldId !== undefined && node.fieldId !== '' && node.fieldId !== null) {
        if (typeof node.fieldId !== 'string') return { ok: false, reason: 'INVALID_INPUT' }
      }
    }
  }

  const complexReferenceKeys = [
    'treeFieldList',
    'treeCheckedList',
    'parameters',
    'parametersList',
    'parametersArr',
    'checkedFieldsMapArr',
    'checkedFieldsMapStart',
    'checkedFieldsMapEnd',
    'checkedFieldsMapNum',
    'checkedFieldsMapNumStart',
    'checkedFieldsMapNumEnd'
  ]
  for (const condition of input.propValue) {
    if (!['0', '2', '5'].includes(condition.displayType) || condition.optionValueSource !== 1) {
      return { ok: false, reason: 'UNSUPPORTED_REFERENCE_SHAPE' }
    }
    if (
      complexReferenceKeys.some(key => {
        const value = condition[key]
        return value !== undefined && value !== null && !isEmptyContainer(value)
      }) ||
      ['parametersStart', 'parametersEnd'].some(
        key => condition[key] !== undefined && condition[key] !== null && condition[key] !== ''
      )
    ) {
      return { ok: false, reason: 'UNSUPPORTED_REFERENCE_SHAPE' }
    }
    if (condition.checkedFields.some((componentId: string) => !isId(componentId))) {
      return { ok: false, reason: 'UNSUPPORTED_REFERENCE_SHAPE' }
    }
  }
  for (const chain of cascade) {
    const encodedDatasets = chain.map((node: any) => {
      const parts = node.datasetId.split('--')
      return parts.length === 3 && parts.every(isId) ? parts[0] : undefined
    })
    if (encodedDatasets.every((datasetId: string | undefined) => datasetId !== undefined)) {
      if (new Set(encodedDatasets).size !== 1) {
        return { ok: false, reason: 'UNSUPPORTED_REFERENCE_SHAPE' }
      }
      if (chain.some((node: any) => node.fieldId !== undefined && node.fieldId !== '')) {
        return { ok: false, reason: 'UNSUPPORTED_REFERENCE_SHAPE' }
      }
    }
  }

  const sourceComponents: SourceComponent[] = input.sourceComponents
  const sourceByComponent = new Map<string, SourceComponent[]>()
  for (const component of sourceComponents) {
    if (
      !isRecord(component) ||
      !isId(component.componentId) ||
      !isId(component.datasetId) ||
      !Array.isArray(component.fieldIds)
    ) {
      continue
    }
    const entries = sourceByComponent.get(component.componentId) || []
    entries.push(component as SourceComponent)
    sourceByComponent.set(component.componentId, entries)
  }
  for (const componentId of checkedComponents) {
    const matches = sourceByComponent.get(componentId) || []
    if (matches.length !== 1 || !matches[0].fieldIds.every(isId)) {
      return { ok: false, reason: 'SOURCE_COMPONENT_UNRESOLVED' }
    }
    const source = matches[0]
    for (const condition of input.propValue) {
      if (!condition.checkedFields.includes(componentId)) continue
      const fieldId = condition.checkedFieldsMap[componentId]
      if (!source.fieldIds.includes(fieldId)) {
        return { ok: false, reason: 'SOURCE_COMPONENT_UNRESOLVED' }
      }
    }
  }

  const parsedChains: QueryReferenceInput['chains'] = []
  for (const chain of cascade) {
    const nodes: QueryReferenceInput['chains'][number] = []
    for (const node of chain) {
      const parts = node.datasetId.split('--')
      if (parts.length !== 3 || !parts.every(isId)) {
        return { ok: false, reason: 'INVALID_COMPOSITE_REFERENCE' }
      }
      nodes.push({
        nodeId: node.id,
        conditionId: parts[1],
        datasetId: parts[0],
        fieldId: parts[2]
      })
    }
    parsedChains.push(nodes)
  }

  const projectedConditions: QueryReferenceInput['conditions'] = input.propValue.map(
    (condition: any) => ({
      id: condition.id,
      datasetId: condition.dataset.id,
      fieldId: condition.field.id,
      targetRefs: condition.checkedFields.map((componentId: string) => {
        const source = sourceByComponent.get(componentId)?.[0] as SourceComponent
        return {
          componentId,
          datasetId: source.datasetId,
          fieldId: condition.checkedFieldsMap[componentId]
        }
      })
    })
  )

  return {
    ok: true,
    value: {
      conditions: projectedConditions,
      chains: parsedChains,
      conditionMap: cloneStringMap(conditionMap),
      nodeMap: cloneStringMap(nodeMap),
      componentMap: cloneComponentMap(componentMap)
    }
  }
}
