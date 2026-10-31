// 临时 renderer chart 的可枚举 string/function 字段可穿过既有 deepCopy/spread。
// 仅 SFC prepared 路径附加，不进入 canonical view、请求、DTO 或剪贴板。
function interactionGuard(chart?: object) {
  return chart && '__deFilterPasteInteraction' in chart
    ? chart.__deFilterPasteInteraction
    : undefined
}

export function hasFilterPasteInteraction(chart?: object) {
  return typeof interactionGuard(chart) === 'function'
}

export function isFilterPasteInteractionAllowed(chart?: object) {
  const allowed = interactionGuard(chart)
  if (typeof allowed !== 'function') return true
  try {
    return allowed() === true
  } catch {
    return false
  }
}
