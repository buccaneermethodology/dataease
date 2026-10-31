import { cloneDeep, isEqual } from 'lodash-es'
import type { ShallowRef } from 'vue'
import type { MvpFilterTree } from './mvp-chart-filter-copy'
import { useEmitt } from '@/hooks/web/useEmitt'

// 当前画布元素在生产 props 中为 Object；该窄类型描述其真实 id 与开放持久配置，
// 不能使用 api/chart.ComponentInfo（那是字段 DTO）。
export interface PasteElement {
  id: string | number
  [key: string]: unknown
}
export interface PasteInputs {
  phase: 'candidate' | 'active'
  view: ChartObj
  element: PasteElement
}
export interface PasteBinding {
  current: ShallowRef<PasteInputs>
}
export type PreparedQuery =
  | { kind: 'queried'; response: ChartObj; request: ChartObj }
  | { kind: 'static-picture'; local: ChartObj }
export type PreparedMetadata =
  | { kind: 'g2'; drillFilters: unknown[]; originData?: unknown; publishOrigin: boolean }
  | { kind: 's2'; drillFilters: unknown[]; pageInfo: Record<string, unknown>; publishPure: boolean }
  | { kind: 'indicator'; drillFilters: unknown[] }
export interface PreparedFilterPaste {
  readonly key: string
  readonly binding: PasteBinding
  readonly metadata: PreparedMetadata
  readonly instance: unknown
  dispose(): void
}
export type PasteReady = { ok: true; handle: PreparedFilterPaste } | { ok: false; reason: string }
export interface FilterPasteRendererPublic {
  prepareFilterPaste(
    input: PreparedQuery,
    binding: PasteBinding,
    isCurrent: () => boolean
  ): Promise<PasteReady>
}
export interface FilterPasteRequest {
  operationId: number
  targetId: string | number
  editSessionId: number
  candidateTree: MvpFilterTree
  isCurrent(): boolean
  resolve(result: { ok: true } | { ok: false; reason: string }): void
}

// 局部接收端能力，仅当前编辑画布拥有；不是请求调度器，不储存任何结果/凭据。
const { emitter } = useEmitt()
const receiverListeners = new Set<() => void>()
const receiverKey = (id: string | number) => `paste-chart-filter-${id}`
export function registerMvpPasteReceiver(
  id: string | number,
  receive: (request: FilterPasteRequest) => void
) {
  const key = receiverKey(id)
  if (emitter.all.get(key)?.length) return null
  const listener = (request: unknown) => receive(request as FilterPasteRequest)
  emitter.on(key, listener)
  receiverListeners.forEach(listener => listener())
  return () => {
    emitter.off(key, listener)
    receiverListeners.forEach(listener => listener())
  }
}
export function hasMvpPasteReceiver(id: string | number) {
  return emitter.all.get(receiverKey(id))?.length === 1
}
export function subscribeMvpPasteReceivers(listener: () => void) {
  receiverListeners.add(listener)
  return () => receiverListeners.delete(listener)
}
export function requestMvpFilterPaste(
  request: Omit<FilterPasteRequest, 'resolve'>,
  timeout = 15000
) {
  return new Promise<{ ok: true } | { ok: false; reason: string }>(resolve => {
    if (!hasMvpPasteReceiver(request.targetId)) {
      resolve({ ok: false, reason: 'preparation_unavailable' })
      return
    }
    let settled = false
    const timer = setTimeout(() => finish({ ok: false, reason: 'paste_timeout' }), timeout)
    const finish = (result: { ok: true } | { ok: false; reason: string }) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve(result)
    }
    try {
      emitter.emit(receiverKey(request.targetId), {
        ...request,
        isCurrent: () => !settled && request.isCurrent(),
        resolve: finish
      })
    } catch {
      finish({ ok: false, reason: 'paste_failed' })
    }
  })
}

// isEqual 区分 own undefined 与缺键；保留原对象和快照双重检查，不序列化为 JSON。
export const sameMvpPasteInput = (left: unknown, right: unknown) => isEqual(left, right)

export function prepareMvpCommitDto(response: ChartObj, canonical: ChartObj) {
  const result = cloneDeep(response)
  const old = new Map((canonical.calParams || []).map(item => [item.id, item.value]))
  result.calParams?.forEach(item => {
    // 与现 setViewDataDetails 保持 truthy 保留语义，不在本任务修复 falsy。
    if (old.get(item.id)) item.value = old.get(item.id)
  })
  return result
}
