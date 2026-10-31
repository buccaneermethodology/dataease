import { Chart } from '@antv/g2'
import {
  createG2RenderAttempt,
  G2RenderAttemptFailure,
  type G2RenderScope
} from '../../../src/views/chart/components/views/components/g2-render-attempt'

interface AttemptRecord {
  id: string
  version: number
  status: string
  created: number
  destroyed: number
  cleanupErrors: string[]
  events: string[]
}

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id)
  if (!found) throw new Error(`缺少页面元素 ${id}`)
  return found as T
}

const host = element<HTMLDivElement>('chart-host')
const snapshot = element<HTMLPreElement>('snapshot')
const notice = element<HTMLParagraphElement>('notice')
const errorsView = element<HTMLPreElement>('runtime-errors')
const releaseButton = element<HTMLButtonElement>('release-n')
const attempts: AttemptRecord[] = []
const errors: string[] = []
const pending = new Map<string, () => void>()
let generation = 0
let mounted = true
let width = 760
const height = 340
let active: { record: AttemptRecord; scope: G2RenderScope<Chart> } | null = null

function describe(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error)
}

function refresh() {
  const bounds = host.getBoundingClientRect()
  snapshot.textContent = JSON.stringify(
    {
      mounted,
      generation,
      activeId: active?.record.id ?? null,
      activeCurrent: active ? active.scope.isCurrent() && !active.scope.closed : false,
      created: attempts.reduce((sum, record) => sum + record.created, 0),
      destroyed: attempts.reduce((sum, record) => sum + record.destroyed, 0),
      cleanupErrors: attempts.flatMap(record => record.cleanupErrors),
      domCanvasCount: host.querySelectorAll('canvas').length,
      domSlotCount: host.querySelectorAll('.chart-slot').length,
      dimensions: {
        requestedWidth: width,
        requestedHeight: height,
        hostWidth: bounds.width,
        hostHeight: bounds.height,
        canvases: Array.from(host.querySelectorAll('canvas')).map(canvas => ({
          width: canvas.width,
          height: canvas.height,
          cssWidth: canvas.getBoundingClientRect().width,
          cssHeight: canvas.getBoundingClientRect().height
        }))
      },
      pendingN: [...pending.keys()],
      attempts,
      runtimeErrors: errors
    },
    null,
    2
  )
  errorsView.textContent = errors.length ? errors.join('\n') : '无'
  releaseButton.disabled = pending.size === 0
}

function showError(error: unknown, source: string) {
  errors.push(`${source}: ${describe(error)}`)
  if (error instanceof G2RenderAttemptFailure) {
    errors.push(`原始错误: ${describe(error.originalError)}`)
  }
  notice.textContent = `${source} 失败，详情见运行错误。`
  refresh()
}

function observeCleanup(record: AttemptRecord, cleanupErrors: Error[]) {
  for (const error of cleanupErrors) record.cleanupErrors.push(describe(error))
  if (cleanupErrors.length) notice.textContent = '观察到清理错误，详情见 JSON。'
}

function disposeActive(reason: string) {
  const previous = active
  active = null
  if (!previous) return
  previous.record.events.push(reason)
  observeCleanup(previous.record, previous.scope.dispose())
  previous.record.status = 'disposed'
}

function releasePending() {
  for (const [id, resolve] of pending) {
    pending.delete(id)
    attempts.find(record => record.id === id)?.events.push('release:N')
    resolve()
  }
  notice.textContent = '已释放所有待定 N；等待 helper 返回 ready 或 stale。'
  refresh()
}

async function renderAttempt(label: string, delayed = false, empty = false) {
  const version = ++generation
  mounted = true
  disposeActive('replace:dispose')
  const record: AttemptRecord = {
    id: `${label}-${attempts.length + 1}`,
    version,
    status: 'creating',
    created: 0,
    destroyed: 0,
    cleanupErrors: [],
    events: []
  }
  attempts.push(record)
  const current = () => mounted && generation === version
  const slot = document.createElement('div')
  slot.className = 'chart-slot'
  slot.dataset.attemptId = record.id
  host.append(slot)
  notice.textContent = `${record.id} 开始；activeId 在 ready 前为 null。`
  refresh()
  try {
    const result = await createG2RenderAttempt<Chart>({
      isCurrent: current,
      initialCleanups: [{ key: 'initial', cleanup: () => record.events.push('cleanup:initial') }],
      create: () => {
        record.events.push('create')
        if (empty) return { kind: 'empty' }
        const chart = new Chart({ container: slot, width, height, autoFit: false })
        record.created++
        const realDestroy = chart.destroy.bind(chart)
        chart.destroy = () => {
          record.destroyed++
          record.events.push('destroy:realG2')
          try {
            realDestroy()
          } finally {
            slot.remove()
            refresh()
          }
        }
        return { kind: 'instance', instance: chart }
      },
      setup: scope => {
        record.events.push('setup')
        const listener = () => record.events.push('fixture:ping')
        window.addEventListener('g2-fixture-ping', listener)
        scope.replaceCleanup('fixture-listener', () => {
          window.removeEventListener('g2-fixture-ping', listener)
          record.events.push('cleanup:fixture-listener')
        })
        scope.instance.options({
          type: 'line',
          animate: false,
          data: ['系列甲', '系列乙'].flatMap((series, index) =>
            [1, 2, 3, 4, 5, 6].map(month => ({
              month: `${month}月`,
              value: 15 + index * 9 + ((month * (index + 2)) % 13),
              series
            }))
          ),
          encode: { x: 'month', y: 'value', color: 'series' },
          scale: { color: { range: ['#1677ff', '#d56b13'] } },
          legend: { color: { position: 'top' } },
          interaction: { tooltip: { shared: true }, legendFilter: true },
          axis: { x: { title: '月份（虚构）' }, y: { title: '数值（虚构）' } }
        })
      },
      render: async scope => {
        record.status = 'rendering'
        record.events.push('render:start')
        refresh()
        await scope.instance.render()
        record.events.push('render:done')
        refresh()
      },
      afterRender: async scope => {
        record.events.push('afterRender:start')
        scope.replaceCleanup('after-render', () => record.events.push('cleanup:after-render'))
        if (delayed) {
          record.status = 'waiting:N'
          await new Promise<void>(resolve => {
            pending.set(record.id, resolve)
            notice.textContent = `${record.id} 已完成真实 G2 render，等待“释放 N”；尚未发布。`
            refresh()
          })
        }
        record.events.push('afterRender:done')
      },
      onCleanupErrors: cleanupErrors => {
        record.events.push(`cleanup:notify:${cleanupErrors.length}`)
        observeCleanup(record, cleanupErrors)
      }
    })
    record.status = result.status
    // 自动清理已由通知记录；结果通道单独保留，避免同一错误重复计数。
    record.events.push(`result:${result.status}:cleanupErrors=${result.cleanupErrors.length}`)
    if (result.status === 'ready' && current() && !result.scope.closed) {
      active = { record, scope: result.scope }
      record.events.push('publish:ready')
    }
    if (empty) slot.remove()
    notice.textContent = `${record.id} 返回 ${result.status}；活动实例 ${
      active?.record.id ?? '无'
    }。`
  } catch (error) {
    record.status = 'failed'
    slot.remove()
    showError(error, record.id)
  } finally {
    refresh()
  }
}

async function resize() {
  const captured = active
  if (!captured || captured.scope.closed || !captured.scope.isCurrent()) {
    notice.textContent = '没有当前 ready scope；未调用 G2 changeSize。'
    refresh()
    return
  }
  width = width === 760 ? 520 : 760
  host.style.width = `${width}px`
  if (active !== captured || captured.scope.closed || !captured.scope.isCurrent()) return
  captured.record.events.push(`changeSize:start:${width}`)
  await captured.scope.instance.changeSize(width, height)
  if (active !== captured || captured.scope.closed || !captured.scope.isCurrent()) {
    captured.record.events.push('changeSize:stale-no-replay')
  } else {
    captured.record.events.push('changeSize:done')
    notice.textContent = `${captured.record.id} 已调用真实 changeSize，宽度 ${width}。`
  }
  refresh()
}

function bind(id: string, action: () => void | Promise<void>) {
  element<HTMLButtonElement>(id).addEventListener('click', () => {
    Promise.resolve()
      .then(action)
      .catch(error => showError(error, id))
  })
}

bind('render-o', () => renderAttempt('O'))
bind('render-n', () => renderAttempt('N', true))
bind('release-n', releasePending)
bind('render-empty', () => renderAttempt('EMPTY', false, true))
bind('resize', resize)
bind('unmount', () => {
  mounted = false
  generation++
  disposeActive('unmount:dispose')
  notice.textContent = '已卸载并使待定 attempt 失效；如有 N，请释放 N 观察 stale 清理。'
  refresh()
})
bind('repeat', async () => {
  for (let index = 0; index < 5; index++) await renderAttempt('R')
})
window.addEventListener('error', event => showError(event.error ?? event.message, 'window.error'))
window.addEventListener('unhandledrejection', event =>
  showError(event.reason, 'unhandledrejection')
)
refresh()
