import { cloneDeep } from 'lodash-es'
import { textOptions, dateOptions, valueOptions } from '@/views/visualized/data/dataset/options.js'

export type MvpFilterTree = Record<string, unknown>
export type MvpPermission = 'allow' | 'deny' | 'unknown'
export interface MvpField {
  id: string | number
  deType: number
}
export interface MvpFilterTarget {
  tableId: string | number
  fields: MvpField[]
  fieldsReady: boolean
  tree: unknown
}
export interface MvpClipboard {
  tree: MvpFilterTree
  tableId: string | number
  fields: MvpField[]
  createdAt: number
  identityEpoch: number
  editSessionId: number
  revision: number
}
export interface MvpPasteObservation {
  targetId: string | number
  operationId: number
  logicalGetDataCalls: number
  counterScope: 'logical_getData_calls_not_physical_HTTP'
  queryPlan: 'not-dispatched' | 'queried' | 'static-picture'
  request: Pick<ChartObj, 'id' | 'type' | 'render' | 'tableId' | 'customFilter'> | null
  responseData: unknown
  outcome: 'pending' | 'success' | 'failure' | 'cancelled'
  reason: string | null
}
export type MvpFilterReason =
  | 'disabled'
  | 'permission_unknown'
  | 'permission_denied'
  | 'identity_unknown'
  | 'session_unavailable'
  | 'empty_source'
  | 'unsupported_tree'
  | 'fields_unavailable'
  | 'field_incompatible'
  | 'dataset_incompatible'
  | 'clipboard_empty'
  | 'clipboard_expired'
  | 'capability_unknown'
  | 'preparation_unavailable'

const TTL = 1_800_000
const rootKeys = new Set(['logic', 'items'])
const itemKeys = new Set([
  'enumValue',
  'fieldId',
  'timeValue',
  'filterType',
  'filterTypeTime',
  'dynamicTimeSetting',
  'term',
  'timeType',
  'value',
  'type',
  'subTree',
  'field',
  'valueType'
])
const dynamicKeys = new Set([
  'relativeToCurrent',
  'timeGranularity',
  'timeNum',
  'relativeToCurrentType',
  'around',
  'arbitraryTime'
])
let clip: Readonly<MvpClipboard> | null = null
let identityEpoch = 0
let editSessionId = 0
let revision = 0
let resource: string | number | null = null
let pasteObservation: MvpPasteObservation | null = null
let observationSequence = 0
let observationToken: number | null = null
// 凭据只用于当前身份比较，绝不写入 clipboard 或诊断输出。
let identity: readonly unknown[] | null = null
const subscribers = new Set<() => void>()
const notify = () => subscribers.forEach(listener => listener())
const plain = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype
const knownKeys = (value: object, allowed: Set<string>) =>
  Reflect.ownKeys(value).every(key => typeof key === 'string' && allowed.has(key))
const scalar = (value: unknown) =>
  value == null ||
  typeof value === 'string' ||
  typeof value === 'boolean' ||
  (typeof value === 'number' && Number.isFinite(value))
const hasSystemParameter = (value: unknown): boolean =>
  typeof value === 'string' && value.includes('${sysParams.')
const fieldIdValid = (id: unknown): id is string | number =>
  (typeof id === 'string' && !!id && !['count', '-1'].includes(id)) ||
  (typeof id === 'number' && Number.isSafeInteger(id) && id > 0)

function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  return value
}

export const isMvpFilterCopyDevEnabled = (dev: boolean, flag: unknown) => dev && flag === 'true'

const observationEnabled = () =>
  isMvpFilterCopyDevEnabled(import.meta.env.DEV, import.meta.env.VITE_FILTER_COPY_DEV_VALIDATION)
const notifyObservation = () =>
  subscribers.forEach(listener => {
    try {
      listener()
    } catch {
      // 单个诊断订阅失败不影响其它订阅或业务。
    }
  })

// 只保留最近一次显式 DEV 观测；所有读取/写入失败都不能影响业务调用。
export function beginMvpPasteObservation(
  targetId: string | number,
  operationId: number,
  reusePending = false
) {
  if (!observationEnabled()) return null
  try {
    if (
      reusePending &&
      pasteObservation?.outcome === 'pending' &&
      pasteObservation.targetId === targetId &&
      pasteObservation.operationId === operationId
    )
      return observationToken
    observationToken = ++observationSequence
    pasteObservation = {
      targetId,
      operationId,
      logicalGetDataCalls: 0,
      counterScope: 'logical_getData_calls_not_physical_HTTP',
      queryPlan: 'not-dispatched',
      request: null,
      responseData: null,
      outcome: 'pending',
      reason: null
    }
    notifyObservation()
    return observationToken
  } catch {
    return null
  }
}

const updatePasteObservation = (
  token: number | null,
  update: (observation: MvpPasteObservation) => void
) => {
  if (!observationEnabled()) return
  try {
    if (token === null || token !== observationToken || pasteObservation?.outcome !== 'pending')
      return
    update(pasteObservation)
    notifyObservation()
  } catch {
    // 诊断投影/订阅失败不能改变 query、准备、发布或拒绝结果。
  }
}

export function observeMvpPasteQuery(
  token: number | null,
  plan: 'queried' | 'static-picture',
  request: ChartObj
) {
  updatePasteObservation(token, observation => {
    observation.queryPlan = plan
    // 只在调用 getData 前计数；不统计 Axios 重试或任何物理 HTTP 请求。
    if (plan === 'queried') observation.logicalGetDataCalls++
    observation.request = cloneDeep({
      id: request.id,
      type: request.type,
      render: request.render,
      tableId: request.tableId,
      customFilter: request.customFilter
    })
  })
}

export function observeMvpPasteResponse(token: number | null, data: unknown) {
  updatePasteObservation(token, observation => {
    observation.responseData = cloneDeep(data)
  })
}

export function settleMvpPasteObservation(
  token: number | null,
  result: { ok: true } | { ok: false; reason: string }
) {
  updatePasteObservation(token, observation => {
    observation.outcome =
      result.ok === true ? 'success' : result.reason === 'paste_cancelled' ? 'cancelled' : 'failure'
    observation.reason = result.ok === true ? null : result.reason
  })
}

export function getMvpPasteObservation(targetId: string | number) {
  if (!observationEnabled()) return null
  try {
    return pasteObservation?.targetId === targetId ? cloneDeep(pasteObservation) : null
  } catch {
    return null
  }
}

export function subscribeMvpFilterClipboard(listener: () => void) {
  subscribers.add(listener)
  return () => subscribers.delete(listener)
}

export function invalidateMvpFilterSession() {
  clip = null
  pasteObservation = null
  observationToken = null
  identity = null
  resource = null
  identityEpoch++
  editSessionId++
  notify()
}

export function syncMvpFilterSession(
  resourceId: string | number | null,
  editing: boolean,
  identityTuple: readonly unknown[] | null
) {
  if (!editing || !fieldIdValid(resourceId) || !identityTuple) {
    if (identity || resource != null || clip) invalidateMvpFilterSession()
    return false
  }
  if (
    resource !== resourceId ||
    !identity ||
    identity.length !== identityTuple.length ||
    identity.some((value, index) => value !== identityTuple[index])
  ) {
    invalidateMvpFilterSession()
    resource = resourceId
    identity = [...identityTuple]
  }
  return true
}

export function getMvpFilterSessionToken() {
  return Object.freeze({ identityEpoch, editSessionId, revision })
}

export function checkMvpFilterPermission(
  enabled: boolean,
  permission: MvpPermission
): MvpFilterReason | null {
  if (!enabled) return 'disabled'
  if (permission === 'deny') return 'permission_denied'
  if (permission !== 'allow') return 'permission_unknown'
  if (!identity || resource == null) return 'identity_unknown'
  return null
}

export function isMvpFilterTreeEmpty(tree: unknown) {
  return (
    plain(tree) &&
    knownKeys(tree, rootKeys) &&
    (tree.logic == null || tree.logic === 'and' || tree.logic === 'or') &&
    (tree.items == null || (Array.isArray(tree.items) && tree.items.length === 0))
  )
}

export function checkMvpFilterTree(
  tree: unknown,
  fields: MvpField[],
  allowEmpty = false
): MvpFilterReason | null {
  if (isMvpFilterTreeEmpty(tree)) return allowEmpty ? null : 'empty_source'
  const seen = new Set<object>()
  const walk = (node: unknown, depth: number): MvpFilterReason | null => {
    if (
      !plain(node) ||
      depth > 64 ||
      seen.has(node) ||
      !knownKeys(node, rootKeys) ||
      !['and', 'or'].includes(node.logic as string) ||
      !Array.isArray(node.items) ||
      !node.items.length
    )
      return 'unsupported_tree'
    seen.add(node)
    for (const item of node.items) {
      if (!plain(item) || !knownKeys(item, itemKeys) || seen.has(item)) return 'unsupported_tree'
      seen.add(item)
      if (item.field != null || item.valueType != null) return 'unsupported_tree'
      const dynamic = item.dynamicTimeSetting
      if (
        dynamic != null &&
        (!plain(dynamic) ||
          !knownKeys(dynamic, dynamicKeys) ||
          Object.values(dynamic).some(value => value !== null))
      )
        return 'unsupported_tree'
      if (
        item.filterTypeTime != null &&
        item.filterTypeTime !== '' &&
        item.filterTypeTime !== 'dateValue'
      )
        return 'unsupported_tree'
      if (
        ![undefined, null, '', 'year', 'month', 'date', 'datetime', 'time'].includes(
          item.timeType as string
        )
      ) {
        return 'unsupported_tree'
      }
      if (item.type === 'tree') {
        // 分组的原生空占位保留；非空的叶子语义不允许藏在分组上。
        if (
          ![undefined, null, ''].includes(item.fieldId as string) ||
          ![undefined, null, ''].includes(item.filterType as string) ||
          ![undefined, null, ''].includes(item.term as string) ||
          ![undefined, null, ''].includes(item.value as string) ||
          ![undefined, null, ''].includes(item.timeValue as string) ||
          (item.enumValue != null && (!Array.isArray(item.enumValue) || item.enumValue.length))
        ) {
          return 'unsupported_tree'
        }
        const failure = walk(item.subTree, depth + 1)
        if (failure) return failure
        continue
      }
      if (item.type !== 'item' || item.subTree !== null || !fieldIdValid(item.fieldId)) {
        return 'unsupported_tree'
      }
      const matches = fields.filter(entry => entry.id === item.fieldId)
      const field = matches.length === 1 ? matches[0] : null
      if (!field || !Number.isInteger(field.deType) || field.deType < 0 || field.deType > 7) {
        return 'field_incompatible'
      }
      if (
        !scalar(item.value) ||
        !scalar(item.timeValue) ||
        hasSystemParameter(item.value) ||
        hasSystemParameter(item.timeValue)
      )
        return 'unsupported_tree'
      if (item.filterType === 'enum') {
        if (
          !Array.isArray(item.enumValue) ||
          !item.enumValue.length ||
          item.enumValue.some(value => !scalar(value) || hasSystemParameter(value))
        )
          return 'unsupported_tree'
      } else if (item.filterType === 'logic') {
        const options =
          field.deType === 1
            ? dateOptions
            : [2, 3, 4].includes(field.deType)
            ? valueOptions
            : textOptions
        if (!options.some(option => option.value === item.term)) return 'unsupported_tree'
        if (
          !['null', 'not_null', 'empty', 'not_empty'].includes(item.term as string) &&
          (item.value == null || item.value === '')
        )
          return 'unsupported_tree'
        if (
          item.enumValue != null &&
          (!Array.isArray(item.enumValue) ||
            item.enumValue.some(value => !scalar(value) || hasSystemParameter(value)))
        )
          return 'unsupported_tree'
      } else return 'unsupported_tree'
    }
    return null
  }
  return walk(tree, 0)
}

export function copyMvpChartFilter(
  source: MvpFilterTarget,
  enabled: boolean,
  permission: MvpPermission,
  now = performance.now()
): MvpFilterReason | null {
  const permissionFailure = checkMvpFilterPermission(enabled, permission)
  if (permissionFailure) return permissionFailure
  if (!source.fieldsReady) return 'fields_unavailable'
  if (!fieldIdValid(source.tableId)) return 'dataset_incompatible'
  const failure = checkMvpFilterTree(source.tree, source.fields)
  if (failure) return failure
  if (!Number.isFinite(now) || now < 0) return 'clipboard_expired'
  // 只在全部 guard 成功后替换，失败保留上一次有效复制。
  clip = freeze({
    tree: cloneDeep(source.tree as MvpFilterTree),
    tableId: source.tableId,
    fields: source.fields.map(({ id, deType }) => ({ id, deType })),
    createdAt: now,
    identityEpoch,
    editSessionId,
    revision: ++revision
  })
  notify()
  return null
}

export function getMvpFilterClipboard(now = performance.now()): Readonly<MvpClipboard> | null {
  if (
    !clip ||
    !identity ||
    resource == null ||
    !Number.isFinite(now) ||
    now - clip.createdAt < 0 ||
    now - clip.createdAt >= TTL
  )
    return null
  return freeze(cloneDeep(clip))
}

export function checkMvpFilterTarget(
  target: MvpFilterTarget,
  now = performance.now()
): MvpFilterReason | null {
  if (!identity || resource == null) return 'session_unavailable'
  if (!clip) return 'clipboard_empty'
  const current = getMvpFilterClipboard(now)
  if (!current) return 'clipboard_expired'
  if (!target.fieldsReady) return 'fields_unavailable'
  if (!fieldIdValid(target.tableId) || current.tableId !== target.tableId)
    return 'dataset_incompatible'
  for (const field of current.fields) {
    // 完整目录用于解析，兼容只约束树实际引用的字段，避免无关字段变更误拒。
    const referenced = (node: MvpFilterTree): boolean =>
      (node.items as MvpFilterTree[]).some(item =>
        item.type === 'tree' ? referenced(item.subTree as MvpFilterTree) : item.fieldId === field.id
      )
    if (
      referenced(current.tree) &&
      !target.fields.some(entry => entry.id === field.id && entry.deType === field.deType)
    )
      return 'field_incompatible'
  }
  return (
    checkMvpFilterTree(target.tree, target.fields, true) ||
    checkMvpFilterTree(current.tree, target.fields)
  )
}

export function describeMvpFilterTree(tree: unknown) {
  const ownKeys: Record<string, string[]> = {}
  const undefinedPaths: string[] = []
  const seen = new Set<object>()
  const walk = (value: unknown, path: string) => {
    if (value === undefined) undefinedPaths.push(path)
    if (!value || typeof value !== 'object' || seen.has(value)) return
    seen.add(value)
    ownKeys[path] = Object.keys(value)
    Object.keys(value).forEach(key => walk(value[key], `${path}.${key}`))
  }
  walk(tree, '$')
  return freeze({ tree: cloneDeep(tree), ownKeys, undefinedPaths })
}
