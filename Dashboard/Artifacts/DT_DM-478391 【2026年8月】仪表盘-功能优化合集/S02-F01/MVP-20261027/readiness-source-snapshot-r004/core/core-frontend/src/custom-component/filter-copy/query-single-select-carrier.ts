import { prepareSingleSelectValueState } from './query-single-select-value-state'

export type QuerySingleSelectCarrierError =
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_FIELD'
  | 'UNSUPPORTED_SHAPE'
  | 'QVALUE_ERROR'

export type QuerySingleSelectCarrier = {
  propValue: Record<string, unknown>[]
  cascade: []
}

export type QuerySingleSelectCarrierResult =
  | { ok: true; value: { design: QuerySingleSelectCarrier; runtime: QuerySingleSelectCarrier } }
  | {
      ok: false
      reason:
        | QuerySingleSelectCarrierError
        | 'INVALID_INPUT'
        | 'UNSUPPORTED_FIELD'
        | 'UNSUPPORTED_SHAPE'
    }

const rootKeys = ['propValue', 'cascade'] as const
const conditionKeys = [
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
] as const

const variableKeys = new Set([
  'id',
  'name',
  'field',
  'displayId',
  'defaultMapValue',
  'mapValue',
  'defaultValue',
  'selectValue',
  'dataset',
  'checkedFields',
  'checkedFieldsMap',
  'arbitraryTime',
  'arbitraryTimeRange',
  'treeDatasetId',
  'defaultValueCheck'
])

const fixedCondition: Record<string, unknown> = {
  showError: true,
  timeGranularity: 'date',
  timeGranularityMultiple: 'datetimerange',
  sortId: '',
  sort: 'asc',
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
  optionValueSource: 1,
  valueSource: [],
  visible: true,
  defaultValueCheck: true,
  multiple: false,
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

const failure = (reason: QuerySingleSelectCarrierError) => ({ ok: false as const, reason })

const isJsonValue = (value: unknown, stack: WeakSet<object>): boolean => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'object') return false
  if (stack.has(value)) return false
  stack.add(value)
  try {
    if (Array.isArray(value)) {
      if (Object.getPrototypeOf(value) !== Array.prototype) return false
      const keys = Reflect.ownKeys(value)
      if (keys.length !== value.length + 1 || !keys.includes('length')) return false
      for (let index = 0; index < value.length; index += 1) {
        const descriptor = Object.getOwnPropertyDescriptor(value, String(index))
        if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return false
        if (!isJsonValue(descriptor.value, stack)) return false
      }
      return true
    }
    if (Object.getPrototypeOf(value) !== Object.prototype) return false
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') return false
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) return false
      if (!isJsonValue(descriptor.value, stack)) return false
    }
    return true
  } finally {
    stack.delete(value)
  }
}

const cloneJson = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(item => cloneJson(item)) as T
  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>))
      output[key] = cloneJson(item)
    return output as T
  }
  return value
}

const deepEqual = (left: unknown, right: unknown): boolean => {
  if (left === right) return true
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false
  if (Array.isArray(left) !== Array.isArray(right)) return false
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      key =>
        Object.hasOwn(right, key) &&
        deepEqual((left as Record<string, unknown>)[key], (right as Record<string, unknown>)[key])
    )
  )
}

const exactKeys = (
  value: Record<string, unknown>,
  expected: readonly string[],
  optional: readonly string[] = []
) => {
  const actual = Object.keys(value)
  return (
    actual.every(key => expected.includes(key)) &&
    expected.every(key => optional.includes(key) || Object.hasOwn(value, key))
  )
}

const nonEmpty = (value: unknown): value is string => typeof value === 'string' && value.length > 0

const isIsoUtc = (value: unknown): value is string => {
  if (typeof value !== 'string') return false
  const date = new Date(value)
  return Number.isFinite(date.getTime()) && date.toISOString() === value
}

const validCondition = (condition: Record<string, unknown>): boolean => {
  if (!exactKeys(condition, conditionKeys, ['defaultValue', 'selectValue'])) return false
  for (const [key, expected] of Object.entries(fixedCondition)) {
    if (!variableKeys.has(key) && !deepEqual(condition[key], expected)) return false
  }

  const field = condition.field
  if (!field || typeof field !== 'object' || Array.isArray(field)) return false
  const fieldValue = field as Record<string, unknown>
  if (
    !exactKeys(fieldValue, ['id', 'name', 'type', 'deType']) ||
    !nonEmpty(fieldValue.id) ||
    fieldValue.id.includes('--') ||
    typeof fieldValue.name !== 'string' ||
    fieldValue.type !== 'VARCHAR' ||
    fieldValue.deType !== 0
  )
    return false

  const dataset = condition.dataset
  if (!dataset || typeof dataset !== 'object' || Array.isArray(dataset)) return false
  const datasetValue = dataset as Record<string, unknown>
  if (
    !exactKeys(datasetValue, ['id', 'name', 'fields']) ||
    !nonEmpty(datasetValue.id) ||
    datasetValue.id.includes('--') ||
    typeof datasetValue.name !== 'string' ||
    !Array.isArray(datasetValue.fields) ||
    datasetValue.fields.length !== 0
  )
    return false

  if (
    !nonEmpty(condition.id) ||
    condition.id.includes('--') ||
    typeof condition.name !== 'string' ||
    condition.displayId !== fieldValue.id ||
    condition.treeDatasetId !== datasetValue.id
  )
    return false

  const checkedFields = condition.checkedFields
  const checkedFieldsMap = condition.checkedFieldsMap
  if (
    !Array.isArray(checkedFields) ||
    checkedFields.length === 0 ||
    !checkedFields.every(item => nonEmpty(item) && !item.includes('--')) ||
    new Set(checkedFields).size !== checkedFields.length ||
    !checkedFieldsMap ||
    typeof checkedFieldsMap !== 'object' ||
    Array.isArray(checkedFieldsMap)
  )
    return false
  const map = checkedFieldsMap as Record<string, unknown>
  if (!exactKeys(map, checkedFields) || checkedFields.some(key => map[key] !== fieldValue.id))
    return false

  if (!isIsoUtc(condition.arbitraryTime) || !isIsoUtc(condition.arbitraryTimeRange)) return false
  if (typeof condition.defaultValueCheck !== 'boolean') return false
  if (condition.defaultValueCheck) {
    if (
      !Object.hasOwn(condition, 'defaultValue') ||
      !nonEmpty(condition.defaultValue) ||
      !Array.isArray(condition.defaultMapValue) ||
      condition.defaultMapValue.length !== 1 ||
      !nonEmpty(condition.defaultMapValue[0])
    )
      return false
  } else if (
    Object.hasOwn(condition, 'defaultValue') ||
    !Array.isArray(condition.defaultMapValue) ||
    condition.defaultMapValue.length !== 0
  ) {
    return false
  }
  if (Object.hasOwn(condition, 'selectValue') && typeof condition.selectValue !== 'string')
    return false
  if (
    !Array.isArray(condition.mapValue) ||
    !(
      condition.mapValue.length === 0 ||
      (condition.mapValue.length === 1 && nonEmpty(condition.mapValue[0]))
    )
  )
    return false
  return true
}

export const prepareQuerySingleSelectCarrier = (input: unknown): QuerySingleSelectCarrierResult => {
  if (
    !isJsonValue(input, new WeakSet()) ||
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input)
  ) {
    return failure('INVALID_INPUT')
  }
  const root = input as Record<string, unknown>
  if (!exactKeys(root, rootKeys)) return failure('UNSUPPORTED_FIELD')
  if (
    !Array.isArray(root.propValue) ||
    root.propValue.length !== 1 ||
    !Array.isArray(root.cascade) ||
    root.cascade.length !== 0
  ) {
    return failure('UNSUPPORTED_SHAPE')
  }
  const source = root.propValue[0]
  if (!source || typeof source !== 'object' || Array.isArray(source))
    return failure('INVALID_INPUT')
  const condition = source as Record<string, unknown>
  const actualKeys = Object.keys(condition)
  if (
    actualKeys.some(key => !conditionKeys.includes(key as (typeof conditionKeys)[number])) ||
    conditionKeys.some(
      key => !['defaultValue', 'selectValue'].includes(key) && !Object.hasOwn(condition, key)
    )
  ) {
    return failure('UNSUPPORTED_FIELD')
  }
  if (condition.defaultValueCheck === true && !Object.hasOwn(condition, 'defaultValue')) {
    return failure('UNSUPPORTED_FIELD')
  }
  const nestedShapes: Array<[unknown, readonly string[]]> = [
    [condition.field, ['id', 'name', 'type', 'deType']],
    [condition.dataset, ['id', 'name', 'fields']],
    [
      condition.timeRange,
      [
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
    ]
  ]
  if (
    nestedShapes.some(
      ([value, keys]) =>
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !exactKeys(value as Record<string, unknown>, keys)
    )
  )
    return failure('UNSUPPORTED_FIELD')
  if (!validCondition(condition)) return failure('UNSUPPORTED_SHAPE')

  let runtimeValues: { selectValue: string; mapValue: string[] } | undefined
  if (condition.defaultValueCheck) {
    const projection = {
      displayType: condition.displayType,
      multiple: condition.multiple,
      optionValueSource: condition.optionValueSource,
      defaultValueCheck: condition.defaultValueCheck,
      defaultValueFirstItem: condition.defaultValueFirstItem,
      defaultValue: condition.defaultValue,
      defaultMapValue: condition.defaultMapValue,
      selectValue: condition.defaultValue,
      mapValue: condition.defaultMapValue
    }
    const valueState = prepareSingleSelectValueState(projection)
    if (!valueState.ok) return { ok: false, reason: valueState.reason }
    runtimeValues = {
      selectValue: valueState.value.runtime.selectValue,
      mapValue: valueState.value.runtime.mapValue
    }
  }

  const designCondition = cloneJson(condition)
  delete designCondition.selectValue
  delete designCondition.mapValue
  const runtimeCondition = cloneJson(designCondition)
  if (runtimeValues) {
    runtimeCondition.selectValue = runtimeValues.selectValue
    runtimeCondition.mapValue = cloneJson(runtimeValues.mapValue)
  } else {
    runtimeCondition.mapValue = []
  }

  return {
    ok: true,
    value: {
      design: { propValue: [designCondition], cascade: [] },
      runtime: { propValue: [runtimeCondition], cascade: [] }
    }
  }
}
