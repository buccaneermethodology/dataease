type TreeCheckedLevel = {
  checkedFields: string[]
  checkedFieldsMap: Record<string, string>
}

type RebindInput = {
  treeFieldIds: string[]
  treeCheckedList: TreeCheckedLevel[]
  componentMap: Record<string, string[]>
}

type RebindReason =
  | 'INVALID_INPUT'
  | 'INVALID_ID'
  | 'FIELD_MISMATCH'
  | 'MISSING_COMPONENT_MAP'
  | 'AMBIGUOUS_COMPONENT_MAP'

type RebindResult = { ok: true; value: TreeCheckedLevel[] } | { ok: false; reason: RebindReason }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  isRecord(value) &&
  (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)

const isId = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !value.includes('--')

/** Rebinds only the component references in each selected tree-filter level. */
export const rebindQueryTreeRelations = (input: unknown): RebindResult => {
  if (!isPlainRecord(input)) return { ok: false, reason: 'INVALID_INPUT' }

  const allowedInputKeys = new Set(['treeFieldIds', 'treeCheckedList', 'componentMap'])
  if (Object.keys(input).some(key => !allowedInputKeys.has(key))) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }

  const { treeFieldIds, treeCheckedList, componentMap } = input as Partial<RebindInput>
  if (
    !Array.isArray(treeFieldIds) ||
    treeFieldIds.length < 1 ||
    treeFieldIds.length > 5 ||
    !Array.isArray(treeCheckedList) ||
    treeCheckedList.length !== treeFieldIds.length ||
    !isPlainRecord(componentMap)
  ) {
    return { ok: false, reason: 'INVALID_INPUT' }
  }

  const seenFields = new Set<unknown>()
  for (let index = 0; index < treeFieldIds.length; index++) {
    const fieldId = treeFieldIds[index]
    if (!isId(fieldId) || seenFields.has(fieldId)) {
      if (isId(fieldId)) return { ok: false, reason: 'INVALID_INPUT' }
    }
    seenFields.add(fieldId)
  }

  const levels: Record<string, unknown>[] = []
  for (const rawLevel of treeCheckedList) {
    if (!isPlainRecord(rawLevel)) return { ok: false, reason: 'INVALID_INPUT' }
    const keys = Object.keys(rawLevel)
    if (
      keys.some(key => key !== 'checkedFields' && key !== 'checkedFieldsMap') ||
      !Array.isArray(rawLevel.checkedFields) ||
      rawLevel.checkedFields.length === 0 ||
      !isPlainRecord(rawLevel.checkedFieldsMap)
    ) {
      return { ok: false, reason: 'INVALID_INPUT' }
    }
    if (new Set(rawLevel.checkedFields).size !== rawLevel.checkedFields.length) {
      return { ok: false, reason: 'INVALID_INPUT' }
    }
    levels.push(rawLevel)
  }

  // ID validation precedes semantic mismatch and map lookup errors.
  for (const fieldId of treeFieldIds) {
    if (!isId(fieldId)) return { ok: false, reason: 'INVALID_ID' }
  }
  for (const level of levels) {
    const selected = level.checkedFields as unknown[]
    for (const sourceId of selected) {
      if (!isId(sourceId)) return { ok: false, reason: 'INVALID_ID' }
      const fieldMap = level.checkedFieldsMap as Record<string, unknown>
      if (Object.prototype.hasOwnProperty.call(fieldMap, sourceId) && !isId(fieldMap[sourceId])) {
        return { ok: false, reason: 'INVALID_ID' }
      }
    }
  }
  for (const level of levels) {
    for (const sourceId of level.checkedFields as string[]) {
      if (!Object.prototype.hasOwnProperty.call(componentMap, sourceId)) continue
      const mapped = componentMap[sourceId]
      if (!Array.isArray(mapped)) return { ok: false, reason: 'INVALID_INPUT' }
      if (mapped.some(targetId => !isId(targetId))) return { ok: false, reason: 'INVALID_ID' }
    }
  }
  for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
    const level = levels[levelIndex]
    const fieldMap = level.checkedFieldsMap as Record<string, unknown>
    for (const sourceId of level.checkedFields as string[]) {
      if (
        !Object.prototype.hasOwnProperty.call(fieldMap, sourceId) ||
        fieldMap[sourceId] !== treeFieldIds[levelIndex]
      ) {
        return { ok: false, reason: 'FIELD_MISMATCH' }
      }
    }
  }

  // Mapping errors are checked only for selected references, in level/source order.
  for (const level of levels) {
    for (const sourceId of level.checkedFields as string[]) {
      if (!Object.prototype.hasOwnProperty.call(componentMap, sourceId)) {
        return { ok: false, reason: 'MISSING_COMPONENT_MAP' }
      }
      const mapped = componentMap[sourceId]
      if (mapped.length !== 1) return { ok: false, reason: 'AMBIGUOUS_COMPONENT_MAP' }
    }
  }

  const value: TreeCheckedLevel[] = []
  for (let index = 0; index < levels.length; index++) {
    const level = levels[index]
    const checkedFields: string[] = []
    const checkedFieldsMap: Record<string, string> = {}
    for (const sourceId of level.checkedFields as string[]) {
      const targetId = (componentMap[sourceId] as string[])[0]
      if (!Object.prototype.hasOwnProperty.call(checkedFieldsMap, targetId)) {
        checkedFields.push(targetId)
        Object.defineProperty(checkedFieldsMap, targetId, {
          value: treeFieldIds[index],
          enumerable: true,
          configurable: true,
          writable: true
        })
      }
    }
    value.push({ checkedFields, checkedFieldsMap })
  }
  return { ok: true, value }
}
