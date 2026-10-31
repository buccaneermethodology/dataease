import { computed, effectScope, onBeforeUnmount, reactive, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router_2'
import { useCache } from '@/hooks/web/useCache'
import { useUserStoreWithOut } from '@/store/modules/user'
import { dvMainStoreWithOut } from '@/store/modules/data-visualization/dvMain'
import { getFieldByDQ } from '@/api/chart'
import chartViewManager from '@/views/chart/components/js/panel'
import { cloneDeep } from 'lodash-es'
import { ElMessageBox } from 'element-plus-secondary'
import { useI18n } from '@/hooks/web/useI18n'
import {
  hasMvpPasteReceiver,
  requestMvpFilterPaste,
  subscribeMvpPasteReceivers,
  sameMvpPasteInput
} from '@/custom-component/filter-copy/mvp-chart-filter-paste'
import {
  checkMvpFilterPermission,
  checkMvpFilterTarget,
  checkMvpFilterTree,
  copyMvpChartFilter,
  describeMvpFilterTree,
  getMvpFilterClipboard,
  getMvpFilterSessionToken,
  invalidateMvpFilterSession,
  isMvpFilterCopyDevEnabled,
  isMvpFilterTreeEmpty,
  subscribeMvpFilterClipboard,
  syncMvpFilterSession,
  beginMvpPasteObservation,
  settleMvpPasteObservation,
  getMvpPasteObservation,
  type MvpField,
  type MvpPermission,
  type MvpFilterReason
} from '@/custom-component/filter-copy/mvp-chart-filter-copy'

let sessionScope: ReturnType<typeof effectScope> | null = null

export function useChartFilterCopyMvp(view: Ref<ChartObj>) {
  const visible = import.meta.env.DEV
  const enabled = isMvpFilterCopyDevEnabled(
    import.meta.env.DEV,
    import.meta.env.VITE_FILTER_COPY_DEV_VALIDATION
  )
  const user = useUserStoreWithOut()
  const dv = dvMainStoreWithOut()
  const route = useRoute()
  const { wsCache } = useCache()
  const { t } = useI18n()
  const permissionRoles = ['read-source', 'read-dataset', 'edit-target'] as const
  const permissions = reactive<Record<(typeof permissionRoles)[number], MvpPermission>>({
    'read-source': 'unknown',
    'read-dataset': 'unknown',
    'edit-target': 'unknown'
  })
  // 三项共同限制 DEV 验证能力；不定义生产资源权限规则。
  const permission = computed<MvpPermission>({
    get: () => {
      const values = permissionRoles.map(role => permissions[role])
      if (values.includes('deny')) return 'deny'
      return values.every(value => value === 'allow') ? 'allow' : 'unknown'
    },
    set: value => {
      for (const role of permissionRoles) permissions[role] = value
    }
  })
  const fields = ref<MvpField[]>([])
  const fieldsReady = ref(false)
  const changed = ref(0)
  const status = ref<string>('')
  const busy = ref(false)
  let pasteSequence = 0
  let targetGeneration = 0
  let unmounted = false
  watch(
    view,
    () => {
      targetGeneration++
    },
    { deep: true, flush: 'sync' }
  )
  let directoryGeneration = 0
  const readIdentity = () => {
    const uid = wsCache.get('user.uid')
    const oid = wsCache.get('user.oid')
    const token = wsCache.get('user.token')
    const time = wsCache.get('user.time')
    if (
      !uid ||
      !oid ||
      !token ||
      !time ||
      uid !== user.uid ||
      oid !== user.oid ||
      token !== user.token ||
      time !== user.time
    )
      return null
    const proxy = wsCache.get('user.proxyInfo')
    if (
      Boolean(proxy?.proxy) !== Boolean(user.proxyInfo?.proxy) ||
      (proxy?.proxyOid ?? null) !== (user.proxyInfo?.proxyOid ?? null) ||
      (proxy?.proxySecret ?? null) !== (user.proxyInfo?.proxySecret ?? null)
    )
      return null
    return [
      uid,
      oid,
      token,
      time,
      Boolean(proxy?.proxy),
      proxy?.proxyOid ?? null,
      proxy?.proxySecret ?? null
    ]
  }
  const editorPath = route.path
  const syncIdentity = () =>
    syncMvpFilterSession(
      dv.dvInfo.id,
      dv.editMode === 'edit' && route.path === editorPath,
      readIdentity()
    )
  const ensureSessionObserver = () => {
    if (!visible || sessionScope || dv.editMode !== 'edit' || route.path !== editorPath) return
    // 这是资源编辑会话的订阅，不能随临时属性面板的卸载销毁。
    const scope = effectScope(true)
    sessionScope = scope
    const initialPath = editorPath
    scope.run(() => {
      watch(
        () => [
          dv.dvInfo.id,
          dv.editMode,
          route.path,
          user.uid,
          user.oid,
          user.token,
          user.time,
          user.proxyInfo?.proxy,
          user.proxyInfo?.proxyOid,
          user.proxyInfo?.proxySecret
        ],
        () => {
          if (route.path !== initialPath || dv.editMode !== 'edit') {
            invalidateMvpFilterSession()
            scope.stop()
            if (sessionScope === scope) sessionScope = null
          } else syncIdentity()
        },
        { flush: 'sync', immediate: true }
      )
    })
  }
  const sync = () => {
    ensureSessionObserver()
    return syncIdentity()
  }
  sync()
  const unsubscribe = subscribeMvpFilterClipboard(() => {
    changed.value++
  })
  const unsubscribeReceivers = subscribeMvpPasteReceivers(() => {
    changed.value++
  })
  // TTL 到点通知真实按钮更新；普通刷新/粘贴不会修改 createdAt。
  const clock = ref(performance.now())
  const timer = visible
    ? window.setInterval(() => {
        clock.value = performance.now()
        sync()
      }, 250)
    : null

  watch(
    () => [view.value?.id, view.value?.tableId, view.value?.type],
    async () => {
      const generation = ++directoryGeneration
      fieldsReady.value = false
      fields.value = []
      status.value = ''
      if (!visible || !view.value?.tableId || !view.value?.id) return
      const { tableId, id, type } = view.value
      try {
        // 独立读取完整可选目录；不依赖轴字段或 summary，也不改图片组的旧 skip。
        const response = await getFieldByDQ(tableId, id, {
          type: type === 'picture-group' ? 'table-info' : type
        })
        if (generation !== directoryGeneration) return
        const directory = response as unknown as {
          dimensionList: MvpField[]
          quotaList: MvpField[]
        }
        if (!Array.isArray(directory?.dimensionList) || !Array.isArray(directory?.quotaList)) return
        fields.value = [...directory.dimensionList, ...directory.quotaList].map(
          ({ id, deType }) => ({ id, deType })
        )
        fieldsReady.value = true
      } catch {
        // 未加载和请求失败均 fail closed；不触碰既有字段展示/查询链。
      }
    },
    { immediate: true, flush: 'sync' }
  )

  const target = () => ({
    tableId: view.value?.tableId,
    fields: fields.value,
    fieldsReady: fieldsReady.value,
    tree: view.value?.customFilter
  })
  const baseReason = (): MvpFilterReason | null => {
    const failure = checkMvpFilterPermission(enabled, permission.value)
    if (failure) return failure
    const chart = chartViewManager.getChartView(view.value?.render, view.value?.type)
    if (!chart?.axis?.includes('filter')) return 'capability_unknown'
    if (!fieldsReady.value) return 'fields_unavailable'
    return null
  }
  const copyReason = computed(() => {
    changed.value
    return baseReason() || checkMvpFilterTree(view.value?.customFilter, fields.value)
  })
  const pasteReason = computed(() => {
    changed.value
    clock.value
    return (
      baseReason() ||
      checkMvpFilterTarget(target()) ||
      (busy.value
        ? 'paste_busy'
        : !hasMvpPasteReceiver(view.value?.id)
        ? 'preparation_unavailable'
        : null)
    )
  })
  const copy = () => {
    sync()
    const failure = baseReason() || copyMvpChartFilter(target(), enabled, permission.value)
    status.value = failure || 'copied'
  }
  const paste = async () => {
    sync()
    clock.value = performance.now()
    const observation = beginMvpPasteObservation(view.value?.id, pasteSequence + 1)
    if (pasteReason.value) {
      status.value = pasteReason.value
      settleMvpPasteObservation(observation, { ok: false, reason: status.value })
      return
    }
    const capturedTarget = view.value
    const generation = targetGeneration
    const token = getMvpFilterSessionToken()
    const clip = getMvpFilterClipboard()
    if (!clip) {
      status.value = 'clipboard_expired'
      settleMvpPasteObservation(observation, { ok: false, reason: status.value })
      return
    }
    busy.value = true
    const operationId = ++pasteSequence
    const isCurrent = () => {
      sync()
      return (
        !unmounted &&
        view.value === capturedTarget &&
        generation === targetGeneration &&
        sameMvpPasteInput(token, getMvpFilterSessionToken()) &&
        getMvpFilterClipboard()?.revision === clip.revision &&
        !baseReason() &&
        !checkMvpFilterTarget(target())
      )
    }
    try {
      if (!isMvpFilterTreeEmpty(capturedTarget.customFilter)) {
        try {
          await ElMessageBox.confirm(
            t('chart.filter_copy_mvp.replace_confirm'),
            t('chart.filter_copy_mvp.paste'),
            { type: 'warning' }
          )
        } catch {
          status.value = 'paste_cancelled'
          settleMvpPasteObservation(observation, { ok: false, reason: status.value })
          return
        }
      }
      if (!isCurrent()) {
        status.value = 'paste_stale'
        settleMvpPasteObservation(observation, { ok: false, reason: status.value })
        return
      }
      const result = await requestMvpFilterPaste(
        {
          operationId,
          targetId: capturedTarget.id,
          editSessionId: token.editSessionId,
          candidateTree: cloneDeep(clip.tree),
          isCurrent
        },
        ['flow-map', 'heat-map', 'symbolic-map', 'map', 'bubble-map'].includes(capturedTarget.type)
          ? 35000
          : 15000
      )
      settleMvpPasteObservation(observation, result)
      status.value = result.ok === true ? 'pasted' : result.reason
    } finally {
      busy.value = false
    }
  }
  const diagnostic = computed(() => {
    if (!enabled) return ''
    changed.value
    clock.value
    const current = getMvpFilterClipboard()
    return JSON.stringify(
      {
        permissions: { ...permissions },
        source: describeMvpFilterTree(view.value?.customFilter),
        clipboard: current
          ? {
              ...describeMvpFilterTree(current.tree),
              tableId: current.tableId,
              createdAt: current.createdAt,
              revision: current.revision
            }
          : null,
        session: getMvpFilterSessionToken(),
        fieldsReady: fieldsReady.value,
        copyReason: copyReason.value,
        pasteReason: pasteReason.value,
        queryObservation: getMvpPasteObservation(view.value?.id)
      },
      null,
      2
    )
  })
  onBeforeUnmount(() => {
    directoryGeneration++
    unsubscribe()
    unsubscribeReceivers()
    unmounted = true
    if (timer !== null) window.clearInterval(timer)
    // 选空白/其它面板会卸载 Editor；clip 仍归资源会话持有。
  })
  return {
    visible,
    enabled,
    permission,
    permissions,
    permissionRoles,
    copyReason,
    pasteReason,
    copy,
    paste,
    status,
    diagnostic,
    busy
  }
}
