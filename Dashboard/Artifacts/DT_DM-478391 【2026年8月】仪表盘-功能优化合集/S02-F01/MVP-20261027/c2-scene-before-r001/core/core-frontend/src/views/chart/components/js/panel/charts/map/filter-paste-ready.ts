import { useMapStoreWithOut } from '@/store/modules/map'

interface MapEvents {
  on(event: string, callback: (...args: unknown[]) => void): unknown
  off(event: string, callback: (...args: unknown[]) => void): unknown
}

// 只属于一次地图候选的有限 ready 桥，不调度其它图表，不缓存资源。
export class FilterPasteMapReady {
  readonly ready: Promise<void>
  private resolve: () => void
  private reject: (error: unknown) => void
  private pending = 1
  private closed = false
  private settled = false
  private cleanups: Array<() => void> = []
  private timer: ReturnType<typeof setTimeout>

  constructor(readonly isCurrent: () => boolean) {
    this.ready = new Promise<void>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
    // drawChart 自身还在 await SDK/资产时也消费拒绝，避免未处理拒绝。
    this.ready.catch(() => undefined)
    this.timer = setTimeout(() => this.fail(new Error('paste_map_timeout')), 30000)
  }

  check() {
    if (this.closed || !this.isCurrent()) {
      this.fail(new Error('paste_map_cancelled'))
      return false
    }
    return true
  }

  callback<T extends unknown[]>(callback: (...args: T) => void) {
    return (...args: T) => {
      if (!this.check()) return
      try {
        callback(...args)
      } catch (error) {
        this.fail(error)
      }
    }
  }

  listen(target: MapEvents, event: string, callback: (...args: unknown[]) => void) {
    if (!this.check()) return
    target.on(event, callback)
    this.cleanups.push(() => target.off(event, callback))
  }

  errors(target: MapEvents) {
    this.listen(target, 'error', error => this.fail(error || new Error('paste_map_error')))
    this.listen(target, 'destroy', () => this.fail(new Error('paste_map_destroyed')))
  }

  wait(target: MapEvents, event: string, callback: () => void = () => undefined) {
    this.pending++
    let seen = false
    this.listen(
      target,
      event,
      this.callback(() => {
        if (seen) return
        seen = true
        callback()
        this.done()
      })
    )
  }

  private done() {
    if (--this.pending === 0 && this.check() && !this.settled) {
      this.settled = true
      clearTimeout(this.timer)
      this.resolve()
    }
  }

  seal() {
    this.done()
  }

  fail(error: unknown) {
    if (!this.settled) {
      this.settled = true
      clearTimeout(this.timer)
      this.reject(error)
    }
    this.closed = true
    this.release()
  }

  addCleanup(cleanup: () => void) {
    if (this.closed) {
      try {
        cleanup()
      } catch {
        /* 晚到的已知资源仍须释放。 */
      }
    } else this.cleanups.push(cleanup)
  }

  private release() {
    const cleanups = this.cleanups.splice(0)
    for (const cleanup of cleanups) {
      try {
        cleanup()
      } catch {
        /* 失败不阻止其余局部监听解绑。 */
      }
    }
  }

  dispose() {
    this.fail(new Error('paste_map_cancelled'))
  }
}

// 仅检查已经由正常 active 地图预热的基础设施；不请求配置、不注入脚本。
export function canPrepareFilterPasteMap(chart: Chart | ChartObj, preparedAreaId?: string) {
  const store = useMapStoreWithOut()
  if (['map', 'bubble-map'].includes(chart.type)) {
    // 保持 parseJson 的 string/object 语义，避免局部 ready 桥引入图库 util 的初始化依赖。
    const customAttr = preparedAreaId
      ? undefined
      : typeof chart.customAttr === 'string'
      ? JSON.parse(chart.customAttr)
      : chart.customAttr
    const areaId = preparedAreaId || customAttr?.map?.id
    return (
      typeof areaId === 'string' &&
      !areaId.startsWith('custom_') &&
      !!store.mapCache[areaId]?.features?.length
    )
  }
  if (!store.mapKeyLoaded) return false
  if (store.mapKey.mapType === 'customTile') return true
  const sdk =
    store.mapKey.mapType === 'qq' ? 'TMap' : store.mapKey.mapType === 'tianditu' ? 'T' : 'AMap'
  return typeof window !== 'undefined' && !!window[sdk]
}

export function preparedMapKey() {
  const store = useMapStoreWithOut()
  if (!store.mapKeyLoaded) throw new Error('paste_map_infrastructure_unavailable')
  return store.mapKey
}
