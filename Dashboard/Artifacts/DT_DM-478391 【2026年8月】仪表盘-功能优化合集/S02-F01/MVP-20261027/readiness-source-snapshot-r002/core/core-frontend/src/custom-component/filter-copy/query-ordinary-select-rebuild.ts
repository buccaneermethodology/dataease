export type OrdinarySelectRebuildFailureReason =
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_FIELD'
  | 'UNSUPPORTED_SHAPE'
  | 'PLAN_MISMATCH'
  | 'TARGET_UNRESOLVED'

export type OrdinarySelectRebuildResult =
  | { ok: true; value: { propValue: JsonObject[]; cascade: JsonObject[][] } }
  | { ok: false; reason: OrdinarySelectRebuildFailureReason }

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }
type JsonObject = { [key: string]: JsonValue }
type AnyRecord = Record<string, any>

const CONDITION_KEYS = [
  'id',
  'name',
  'showError',
  'timeGranularity',
  'timeGranularityMultiple',
  'field',
  'displayId',
  'sortId',
  'sort',
  'defaultMapValue',
  'mapValue',
  'conditionType',
  'conditionValueOperatorF',
  'conditionValueF',
  'conditionValueOperatorS',
  'conditionValueS',
  'defaultConditionValueOperatorF',
  'defaultConditionValueF',
  'defaultConditionValueOperatorS',
  'defaultConditionValueS',
  'timeType',
  'relativeToCurrent',
  'required',
  'timeNum',
  'relativeToCurrentType',
  'around',
  'parametersStart',
  'parametersEnd',
  'arbitraryTime',
  'timeNumRange',
  'relativeToCurrentTypeRange',
  'aroundRange',
  'arbitraryTimeRange',
  'auto',
  'defaultValue',
  'selectValue',
  'optionValueSource',
  'valueSource',
  'dataset',
  'visible',
  'defaultValueCheck',
  'multiple',
  'displayType',
  'checkedFields',
  'parameters',
  'parametersCheck',
  'parametersList',
  'checkedFieldsMap',
  'hideConditionSwitching',
  'resultMode',
  'relativeToCurrentRange',
  'treeDatasetId',
  'setTimeRange',
  'showEmpty',
  'defaultNumValueStart',
  'defaultNumValueEnd',
  'numValueEnd',
  'numValueStart',
  'displayFormat',
  'timeRange',
  'oldTreeLoad',
  'treeCheckedList',
  'defaultValueFirstItem',
  'treeFieldList',
  'checkedFieldsMapArr',
  'checkedFieldsMapArrNum',
  'checkedFieldsMapStart',
  'checkedFieldsMapStartNum',
  'checkedFieldsMapEnd',
  'checkedFieldsMapEndNum',
  'parametersArr'
]
const FIELD_KEYS = ['id', 'type', 'name', 'deType']
const DATASET_KEYS = ['id', 'name', 'fields']
const TIME_RANGE_KEYS = [
  'intervalType',
  'dynamicWindow',
  'maximumSingleQuery',
  'regularOrTrends',
  'regularOrTrendsValue',
  'relativeToCurrent',
  'timeNum',
  'relativeToCurrentType',
  'around',
  'timeNumRange',
  'relativeToCurrentTypeRange',
  'aroundRange',
  'relativeToCurrentRange'
]
const NODE_KEYS = ['id', 'datasetId', 'fieldId', 'placeholder', 'selectValue', 'currentSelectValue']
const PLAN_KEYS = ['conditions', 'chains']
const PLAN_CONDITION_KEYS = ['id', 'datasetId', 'fieldId', 'targetRefs']
const PLAN_TARGET_KEYS = ['componentId', 'datasetId', 'fieldId']
const PLAN_NODE_KEYS = ['nodeId', 'conditionId', 'datasetId', 'fieldId']
const TARGET_KEYS = ['componentId', 'datasetId', 'fieldIds']
const FIXED_CONDITION_FIELDS: Record<string, JsonValue> = {
  showError: true,
  timeGranularity: 'date',
  timeGranularityMultiple: 'datetimerange',
  sortId: '',
  sort: 'asc',
  defaultMapValue: [],
  conditionType: 0,
  conditionValueOperatorF: 'eq',
  conditionValueF: '',
  conditionValueOperatorS: 'like',
  conditionValueS: '',
  defaultConditionValueOperatorF: 'eq',
  defaultConditionValueF: '',
  defaultConditionValueOperatorS: 'like',
  defaultConditionValueS: '',
  timeType: 'fixed',
  relativeToCurrent: 'custom',
  required: false,
  timeNum: 0,
  relativeToCurrentType: 'date',
  around: 'f',
  parametersStart: null,
  parametersEnd: null,
  timeNumRange: 0,
  relativeToCurrentTypeRange: 'date',
  aroundRange: 'f',
  auto: false,
  defaultValue: [],
  optionValueSource: 1,
  valueSource: [],
  visible: true,
  defaultValueCheck: false,
  multiple: true,
  displayType: '0',
  parameters: [],
  parametersCheck: false,
  parametersList: [],
  hideConditionSwitching: false,
  resultMode: 0,
  relativeToCurrentRange: 'custom',
  setTimeRange: false,
  showEmpty: false,
  defaultNumValueStart: null,
  defaultNumValueEnd: null,
  numValueEnd: null,
  numValueStart: null,
  displayFormat: 0,
  timeRange: {
    intervalType: 'none',
    dynamicWindow: false,
    maximumSingleQuery: 0,
    regularOrTrends: 'fixed',
    regularOrTrendsValue: '',
    relativeToCurrent: 'custom',
    timeNum: 0,
    relativeToCurrentType: 'year',
    around: 'f',
    timeNumRange: 0,
    relativeToCurrentTypeRange: 'year',
    aroundRange: 'f',
    relativeToCurrentRange: 'custom'
  },
  oldTreeLoad: false,
  treeCheckedList: [],
  defaultValueFirstItem: false,
  treeFieldList: [],
  checkedFieldsMapArr: {},
  checkedFieldsMapArrNum: {},
  checkedFieldsMapStart: {},
  checkedFieldsMapStartNum: {},
  checkedFieldsMapEnd: {},
  checkedFieldsMapEndNum: {},
  parametersArr: {}
}

const fail = (reason: OrdinarySelectRebuildFailureReason): OrdinarySelectRebuildResult => ({
  ok: false,
  reason
})
const isRecord = (value: unknown): value is AnyRecord =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
const isId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !value.includes('--')
const hasExactKeys = (value: AnyRecord, keys: string[]) =>
  Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key))
const isUnique = (values: string[]) => new Set(values).size === values.length
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === 'string')
const sameJson = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right)
const isIsoUtc = (value: unknown) =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
  Number.isFinite(Date.parse(value)) &&
  new Date(value).toISOString() === value

const isJsonValue = (value: unknown, seen = new Set<object>()): value is JsonValue => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'object') return false
  if (seen.has(value)) return false
  const prototype = Object.getPrototypeOf(value)
  if (Array.isArray(value)) {
    if (prototype !== Array.prototype || Object.getOwnPropertySymbols(value).length > 0)
      return false
    seen.add(value)
    const keys = Object.keys(value)
    if (keys.length !== value.length || keys.some((key, index) => key !== String(index)))
      return false
    const valid = value.every(item => isJsonValue(item, seen))
    seen.delete(value)
    return valid
  }
  if (prototype !== Object.prototype && prototype !== null) return false
  if (Object.getOwnPropertySymbols(value).length > 0) return false
  seen.add(value)
  const valid = Object.keys(value).every(key => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    return (
      !!descriptor &&
      'value' in descriptor &&
      descriptor.enumerable &&
      isJsonValue(descriptor.value, seen)
    )
  })
  seen.delete(value)
  return valid
}

const cloneJson = (value: JsonValue): JsonValue => {
  if (Array.isArray(value)) return value.map(item => cloneJson(item))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneJson(item)]))
  }
  return value
}

export const rebuildOrdinarySelectConfig = (input: unknown): OrdinarySelectRebuildResult => {
  if (
    !isJsonValue(input) ||
    !isRecord(input) ||
    !hasExactKeys(input, ['source', 'referencePlan', 'targetComponents'])
  ) {
    return fail('INVALID_INPUT')
  }
  const source = input.source
  if (
    !isRecord(source) ||
    !hasExactKeys(source, ['propValue', 'cascade']) ||
    !Array.isArray(source.propValue) ||
    !Array.isArray(source.cascade)
  ) {
    return fail('INVALID_INPUT')
  }

  const sourceConditions: AnyRecord[] = []
  const sourceConditionIds: string[] = []
  for (const value of source.propValue) {
    if (!isRecord(value)) return fail('INVALID_INPUT')
    if (!isId(value.id)) return fail('INVALID_INPUT')
    if (!isRecord(value.field) || !isId(value.field.id) || !isId(value.field.type))
      return fail('INVALID_INPUT')
    if (
      !isRecord(value.dataset) ||
      !isId(value.dataset.id) ||
      !isStringArray(value.dataset.fields)
    ) {
      return fail('INVALID_INPUT')
    }
    if (!Array.isArray(value.checkedFields) || !isRecord(value.checkedFieldsMap))
      return fail('INVALID_INPUT')
    if (!isStringArray(value.checkedFields) || !value.checkedFields.every(isId))
      return fail('INVALID_INPUT')
    if (!isStringArray(value.selectValue) || !isStringArray(value.mapValue))
      return fail('INVALID_INPUT')
    sourceConditions.push(value)
    sourceConditionIds.push(value.id)
  }

  const sourceNodes: AnyRecord[][] = []
  const sourceNodeIds: string[] = []
  for (const chain of source.cascade) {
    if (!Array.isArray(chain) || chain.length === 0) return fail('INVALID_INPUT')
    const nodes: AnyRecord[] = []
    for (const value of chain) {
      if (!isRecord(value)) return fail('INVALID_INPUT')
      if (!isId(value.id) || typeof value.datasetId !== 'string') return fail('INVALID_INPUT')
      if (!isStringArray(value.selectValue) || !isStringArray(value.currentSelectValue))
        return fail('INVALID_INPUT')
      nodes.push(value)
      sourceNodeIds.push(value.id)
    }
    sourceNodes.push(nodes)
  }
  if (!isUnique(sourceConditionIds) || !isUnique(sourceNodeIds)) return fail('INVALID_INPUT')

  // Unknown or incomplete persisted keys fail closed instead of being silently dropped.
  for (const condition of sourceConditions) {
    if (!hasExactKeys(condition, CONDITION_KEYS)) return fail('UNSUPPORTED_FIELD')
    if (
      !isRecord(condition.field) ||
      !hasExactKeys(condition.field, FIELD_KEYS) ||
      !isRecord(condition.dataset) ||
      !hasExactKeys(condition.dataset, DATASET_KEYS) ||
      !isRecord(condition.timeRange) ||
      !hasExactKeys(condition.timeRange, TIME_RANGE_KEYS)
    )
      return fail('UNSUPPORTED_FIELD')
  }
  for (const chain of sourceNodes) {
    for (const node of chain) if (!hasExactKeys(node, NODE_KEYS)) return fail('UNSUPPORTED_FIELD')
  }

  // The supported slice is intentionally narrower than the complete product contract.
  for (const condition of sourceConditions) {
    if (
      !isStringArray(condition.defaultValue) ||
      condition.defaultValue.length !== 0 ||
      !Array.isArray(condition.defaultMapValue) ||
      condition.defaultMapValue.length !== 0 ||
      condition.dataset.fields.length !== 0 ||
      condition.field.type !== 'VARCHAR' ||
      condition.field.deType !== 0 ||
      condition.displayId !== condition.field.id ||
      condition.treeDatasetId !== condition.dataset.id ||
      !isIsoUtc(condition.arbitraryTime) ||
      !isIsoUtc(condition.arbitraryTimeRange) ||
      Object.entries(FIXED_CONDITION_FIELDS).some(
        ([key, expected]) => !sameJson(condition[key], expected)
      ) ||
      !isRecord(condition.checkedFieldsMap) ||
      Object.keys(condition.checkedFieldsMap).length !== condition.checkedFields.length ||
      !condition.checkedFields.every(
        componentId => isId(componentId) && isId(condition.checkedFieldsMap[componentId])
      )
    )
      return fail('UNSUPPORTED_SHAPE')
  }
  for (const chain of sourceNodes) {
    for (const node of chain) {
      if (
        node.fieldId !== '' ||
        typeof node.placeholder !== 'string' ||
        node.placeholder.length === 0 ||
        !node.datasetId.split('--').every(part => part.length > 0)
      )
        return fail('UNSUPPORTED_SHAPE')
    }
  }

  const plan = input.referencePlan
  if (
    !isRecord(plan) ||
    !hasExactKeys(plan, PLAN_KEYS) ||
    !Array.isArray(plan.conditions) ||
    !Array.isArray(plan.chains)
  ) {
    return fail('PLAN_MISMATCH')
  }
  if (
    plan.conditions.length !== sourceConditions.length ||
    plan.chains.length !== sourceNodes.length
  ) {
    return fail('PLAN_MISMATCH')
  }
  const planConditions: AnyRecord[] = []
  const planConditionIds: string[] = []
  for (let index = 0; index < plan.conditions.length; index += 1) {
    const value = plan.conditions[index]
    const sourceCondition = sourceConditions[index]
    if (
      !isRecord(value) ||
      !hasExactKeys(value, PLAN_CONDITION_KEYS) ||
      !Array.isArray(value.targetRefs)
    ) {
      return fail('PLAN_MISMATCH')
    }
    if (!isId(value.id) || !isId(value.datasetId) || !isId(value.fieldId))
      return fail('PLAN_MISMATCH')
    if (
      value.datasetId !== sourceCondition.dataset.id ||
      value.fieldId !== sourceCondition.field.id
    ) {
      return fail('PLAN_MISMATCH')
    }
    planConditions.push(value)
    planConditionIds.push(value.id)
  }
  const planNodes: AnyRecord[][] = []
  const planNodeIds: string[] = []
  for (let chainIndex = 0; chainIndex < plan.chains.length; chainIndex += 1) {
    const chain = plan.chains[chainIndex]
    if (!Array.isArray(chain) || chain.length !== sourceNodes[chainIndex].length)
      return fail('PLAN_MISMATCH')
    const nodes: AnyRecord[] = []
    for (let nodeIndex = 0; nodeIndex < chain.length; nodeIndex += 1) {
      const value = chain[nodeIndex]
      if (!isRecord(value) || !hasExactKeys(value, PLAN_NODE_KEYS)) return fail('PLAN_MISMATCH')
      if (
        !isId(value.nodeId) ||
        !isId(value.conditionId) ||
        !isId(value.datasetId) ||
        !isId(value.fieldId)
      ) {
        return fail('PLAN_MISMATCH')
      }
      nodes.push(value)
      planNodeIds.push(value.nodeId)
    }
    planNodes.push(nodes)
  }
  if (
    !isUnique(planConditionIds) ||
    !isUnique(planNodeIds) ||
    planConditionIds.some(id => sourceConditionIds.includes(id)) ||
    planNodeIds.some(id => sourceNodeIds.includes(id))
  )
    return fail('PLAN_MISMATCH')

  const targetFieldBindings = new Map<string, Map<string, string>>()
  for (let index = 0; index < planConditions.length; index += 1) {
    const planned = planConditions[index]
    const sourceCondition = sourceConditions[index]
    const sourceRefs = sourceCondition.checkedFields as string[]
    const sourceMap = sourceCondition.checkedFieldsMap as Record<string, string>
    if (planned.targetRefs.length !== sourceRefs.length) return fail('PLAN_MISMATCH')
    for (let refIndex = 0; refIndex < planned.targetRefs.length; refIndex += 1) {
      const ref = planned.targetRefs[refIndex]
      if (
        !isRecord(ref) ||
        !hasExactKeys(ref, PLAN_TARGET_KEYS) ||
        !isId(ref.componentId) ||
        !isId(ref.datasetId) ||
        !isId(ref.fieldId)
      ) {
        return fail('PLAN_MISMATCH')
      }
      if (
        ref.datasetId !== sourceCondition.dataset.id ||
        ref.fieldId !== sourceMap[sourceRefs[refIndex]]
      )
        return fail('PLAN_MISMATCH')
      if (!targetFieldBindings.has(planned.id)) targetFieldBindings.set(planned.id, new Map())
      const fields = targetFieldBindings.get(planned.id) as Map<string, string>
      const existing = fields.get(ref.componentId)
      if (existing !== undefined && existing !== ref.fieldId) return fail('PLAN_MISMATCH')
      fields.set(ref.componentId, ref.fieldId)
    }
  }
  for (let chainIndex = 0; chainIndex < planNodes.length; chainIndex += 1) {
    const planChain = planNodes[chainIndex]
    const sourceChain = sourceNodes[chainIndex]
    for (let nodeIndex = 0; nodeIndex < planChain.length; nodeIndex += 1) {
      const planned = planChain[nodeIndex]
      const original = sourceChain[nodeIndex]
      const sourceIdentity = String(original.datasetId).split('--')
      const conditionIndex = sourceConditionIds.indexOf(sourceIdentity[1])
      if (
        sourceIdentity.length !== 3 ||
        conditionIndex < 0 ||
        sourceIdentity[0] !== sourceConditions[conditionIndex].dataset.id ||
        sourceIdentity[2] !== sourceConditions[conditionIndex].field.id ||
        planned.conditionId !== planConditions[conditionIndex].id ||
        planned.datasetId !== sourceConditions[conditionIndex].dataset.id ||
        planned.fieldId !== sourceConditions[conditionIndex].field.id
      )
        return fail('PLAN_MISMATCH')
    }
  }

  const targetComponents = input.targetComponents
  if (!Array.isArray(targetComponents)) return fail('TARGET_UNRESOLVED')
  const directory = new Map<string, AnyRecord>()
  for (const component of targetComponents) {
    if (!isRecord(component) || !hasExactKeys(component, TARGET_KEYS))
      return fail('TARGET_UNRESOLVED')
    if (
      !isId(component.componentId) ||
      !isId(component.datasetId) ||
      !isStringArray(component.fieldIds) ||
      !component.fieldIds.every(isId)
    ) {
      return fail('TARGET_UNRESOLVED')
    }
    if (directory.has(component.componentId)) return fail('TARGET_UNRESOLVED')
    directory.set(component.componentId, component)
  }
  for (const planned of planConditions) {
    for (const ref of planned.targetRefs) {
      const target = directory.get(ref.componentId)
      if (!target || target.datasetId !== ref.datasetId || !target.fieldIds.includes(ref.fieldId)) {
        return fail('TARGET_UNRESOLVED')
      }
    }
  }

  const propValue = sourceConditions.map((condition, index) => {
    const output = cloneJson(condition as JsonObject) as AnyRecord
    const planned = planConditions[index]
    const targetFields = targetFieldBindings.get(planned.id) as Map<string, string>
    output.id = planned.id
    output.checkedFields = [...targetFields.keys()]
    output.checkedFieldsMap = Object.fromEntries(targetFields.entries())
    output.selectValue = []
    output.mapValue = []
    output.defaultValue = []
    output.defaultMapValue = []
    return output as JsonObject
  })
  const cascade = planNodes.map((chain, chainIndex) =>
    chain.map((node, nodeIndex) => {
      const original = sourceNodes[chainIndex][nodeIndex]
      return {
        id: node.nodeId,
        datasetId: `${node.datasetId}--${node.conditionId}--${node.fieldId}`,
        fieldId: '',
        placeholder: original.placeholder as string,
        selectValue: [],
        currentSelectValue: []
      } as JsonObject
    })
  )
  return { ok: true, value: { propValue, cascade } }
}
