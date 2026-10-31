<script lang="ts" setup>
import {
  FilterPasteMapReady,
  canPrepareFilterPasteMap
} from '@/views/chart/components/js/panel/charts/map/filter-paste-ready'
import { installG2AssistLineVisibility } from '@/views/chart/components/js/panel/types/impl/g2-assist-line'
import {
  applyG2TiledLegend,
  installG2TiledLegendStateAdapter,
  replayG2TiledLegendSelection
} from '@/views/chart/components/js/panel/types/impl/g2-legend-tile'
import {
  computed,
  PropType,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  toRefs
} from 'vue'
import { getData } from '@/api/chart'
import type {
  PasteBinding,
  PasteReady,
  PreparedQuery
} from '@/custom-component/filter-copy/mvp-chart-filter-paste'
import { ChartLibraryType } from '@/views/chart/components/js/panel/types'
import { G2ChartView, isLargeDataLabelMark } from '@/views/chart/components/js/panel/types/impl/g2'
import { L7PlotChartView } from '@/views/chart/components/js/panel/types/impl/l7plot'
import chartViewManager from '@/views/chart/components/js/panel'
import { useAppStoreWithOut } from '@/store/modules/app'
import { dvMainStoreWithOut } from '@/store/modules/data-visualization/dvMain'
import ViewTrackBar from '@/components/visualization/ViewTrackBar.vue'
import { storeToRefs } from 'pinia'
import { getColorFormAlphaColor, hexColorToRGBA, parseJson } from '@/views/chart/components/js/util'
import { defaultsDeep, cloneDeep, concat } from 'lodash-es'
import ChartError from '@/views/chart/components/views/components/ChartError.vue'
import { BASE_VIEW_CONFIG } from '../../editor/util/chart'
import { customAttrTrans, customStyleTrans, recursionTransObj } from '@/utils/canvasStyle'
import { deepCopy, isMobile } from '@/utils/utils'
import { isDashboard, trackBarStyleCheck } from '@/utils/canvasUtils'
import { useEmitt } from '@/hooks/web/useEmitt'
import { L7ChartView } from '@/views/chart/components/js/panel/types/impl/l7'
import { useI18n } from '@/hooks/web/useI18n'
import { ExportImage } from '@antv/l7'
import {
  configAxisTitleOverflowTooltip,
  configEmptyDataStyle,
  installG2SliderAdapter
} from '@/views/chart/components/js/panel/common/common_antv'
import { installG2SideLegendPaginationAdapter } from '@/views/chart/components/js/panel/types/impl/g2-legend-pagination'
import { ElMessage } from 'element-plus-secondary'
import G2TooltipCarousel from '@/views/chart/components/js/G2TooltipCarousel'
import { listenerTooltipShow } from '@/views/chart/components/js/panel/charts/g2/bar/barUtil'
import { createChartRefreshMock } from './chart-refresh-mock'
import { type Chart as G2Chart } from '@antv/g2'
import {
  createG2RenderAttempt,
  G2RenderAttemptFailure,
  type G2RenderScope
} from './g2-render-attempt'
const mockRefreshResponse = import.meta.env.DEV ? createChartRefreshMock() : undefined
const { t } = useI18n()
const dvMainStore = dvMainStoreWithOut()
const { nowPanelTrackInfo, nowPanelJumpInfo, mobileInPc, embeddedCallBack, inMobile } =
  storeToRefs(dvMainStore)
const { emitter } = useEmitt()
const props = defineProps({
  pasteBinding: { type: Object as PropType<PasteBinding>, required: false },
  element: {
    type: Object,
    default() {
      return {
        propValue: null
      }
    }
  },
  view: {
    type: Object,
    default() {
      return {
        propValue: null
      }
    }
  },
  showPosition: {
    type: String,
    required: false,
    default: 'canvas'
  },
  scale: {
    type: Number,
    required: false,
    default: 1
  },
  terminal: {
    type: String,
    default: 'pc'
  },
  //图表渲染id后缀
  suffixId: {
    type: String,
    required: false,
    default: 'common'
  },
  fontFamily: {
    type: String,
    required: false,
    default: 'inherit'
  },
  active: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emit = defineEmits([
  'onPointClick',
  'onChartClick',
  'onDrillFilters',
  'onJumpClick',
  'resetLoading'
])

const g2TypeSeries1 = ['bidirectional-bar']
const g2TypeSeries0 = ['bar-range']
const g2TypeTree = ['circle-packing', 'treemap']
const g2TypeStack = [
  'bar-stack',
  'bar-group-stack',
  'percentage-bar-stack',
  'bar-stack-horizontal',
  'percentage-bar-stack-horizontal'
]
const g2TypeGroup = ['bar-group', 'box-plot']

const { showPosition, scale, terminal, suffixId } = toRefs(props)
const filterPasteBinding = shallowRef<PasteBinding | undefined>(props.pasteBinding)
const view = computed(() => filterPasteBinding.value?.current.value.view ?? props.view)
const element = computed(() => filterPasteBinding.value?.current.value.element ?? props.element)
const isPasteActive = () =>
  !filterPasteBinding.value || filterPasteBinding.value.current.value.phase === 'active'

const isError = ref(false)
const errMsg = ref('')
const linkageActiveHistory = ref(false)
// 箱线图的生效联动独立于最近点击，下钻和打开菜单不能覆盖已提交的联动条件
const boxPlotLinkageData = shallowRef(null)
// G2 重绘后只用这些原始字段回放选中，避免旧 datum 的对象引用参与匹配
const LINKAGE_REPLAY_FIELDS = ['field', 'name', 'category', 'group', 'value', 'x', 'y', 'path']

const dataVMobile = !isDashboard() && isMobile()

const state = reactive({
  trackBarStyle: {
    position: 'absolute',
    left: '50px',
    top: '50px'
  },
  trackBarStyleMobile: {
    position: 'absolute',
    left: '50px',
    top: '50px'
  },
  linkageActiveParam: null,
  pointParam: null,
  data: { fields: [] } // 图表数据
})
let chartData = shallowRef<Partial<Chart['data']>>({
  fields: []
})

const containerId = 'container-' + showPosition.value + '-' + view.value.id + '-' + suffixId.value
const viewTrack = ref(null)
const chartStroke = computed(() => {
  const customAttr = parseJson(view.value.customAttr)
  // 联动选中态优先使用主题转换后的反色
  const stroke =
    customAttr?.basicStyle?.themeContrastColor ??
    customAttr?.label?.color ??
    (!isDashboard() || dvMainStore.canvasStyleData?.dashboard?.themeColor === 'dark'
      ? '#fff'
      : '#000')
  // 箱线图联动回放也使用基础不透明度，避免选中后覆盖为不透明描边
  return view.value.type === 'box-plot'
    ? hexColorToRGBA(getColorFormAlphaColor(stroke), customAttr?.basicStyle?.alpha ?? 100)
    : stroke
})
const LINKAGE_STYLE_CACHE = '__deLinkageStyleCache__'
const LINKAGE_STYLE_KEYS = ['opacity', 'stroke', 'lineWidth']
const LINKAGE_SELECTED_STYLE = computed(() => ({
  stroke: chartStroke.value,
  lineWidth: 1,
  linkStroke: chartStroke.value,
  linkStrokeOpacity: chartStroke.value
}))
const LINKAGE_SELECTED_OPACITY_STYLE = { opacity: 1 }
const LINKAGE_SELECTED_POINT_STYLE = computed(() => ({
  ...LINKAGE_SELECTED_STYLE.value,
  opacity: 1,
  strokeOpacity: 1
}))
const LINKAGE_UNSELECTED_STYLE = { opacity: 0.5 }
const LINKAGE_OPACITY_MARK_TYPES = ['line', 'point', 'area']
const LINKAGE_IGNORE_MARK_TYPES = ['lineX', 'lineY']
const LINKAGE_IGNORE_CLASS_REG = /crosshair|tooltip/

const clearLinkage = () => {
  linkageActiveHistory.value = false
  boxPlotLinkageData.value = null
  try {
    resetLinkageElementState()
    myChart?.emit('element:unselect', { nativeEvent: false })
    myChart?.emit('element:unhighlight', { nativeEvent: false })
    resetLinkageContentOpacity()
  } catch (e) {
    console.warn('clearLinkage error', e)
  }
}
const reDrawView = () => {
  linkageActiveHistory.value = false
}
const linkageActivePre = () => {
  if (linkageActiveHistory.value) {
    reDrawView()
  }
  nextTick(() => {
    linkageActive()
  })
}
const linkageActive = () => {
  linkageActiveHistory.value = true
  try {
    const replayData = getLinkageReplayData()
    if (!replayData) {
      return
    }
    if (view.value.type === 'box-plot') {
      // 箱线图先恢复原样式，避免 G2 将联动淡化值缓存为取消选中后的原始值
      resetLinkageElementState()
    } else {
      applyLinkageElementState()
    }
    // elementSelect 单选会切换已选元素；回放前先清空，避免重复选中时被反向取消
    myChart?.emit('element:unselect', { nativeEvent: false })
    myChart?.emit('element:select', {
      nativeEvent: false,
      data: { data: [replayData] }
    })
    const chart = myChart
    if (chart === myChart && linkageActiveHistory.value) {
      applyLinkageElementState(true)
    }
  } catch (err) {
    console.warn('linkageActive error', err)
  }
}
// 只收集 primitive 字段，G2 selectElementByData 使用严格相等匹配
const getLinkageReplayData = () => {
  const data = view.value.type === 'box-plot' ? boxPlotLinkageData.value : state.pointParam?.data
  if (!data) {
    return null
  }
  const replayData: Record<string, any> = {}
  LINKAGE_REPLAY_FIELDS.forEach(key => {
    const value = data[key]
    if (['string', 'number', 'boolean'].includes(typeof value) && !Number.isNaN(value)) {
      replayData[key] = value
    }
  })
  return Object.keys(replayData).length ? replayData : null
}
// renderG2 和 forceFit 共用回放逻辑，覆盖图例和标题显隐两类路径
const replayLinkageActive = () => {
  if (!linkageActiveHistory.value || !state.linkageActiveParam) {
    return
  }
  const chart = myChart
  const replayScope = activeG2Scope
  const replayVersion = g2RenderVersion
  requestAnimationFrame(() => {
    if (replayScope && !isActiveG2Scope(replayVersion, replayScope, chart)) return
    if (chart !== myChart || !linkageActiveHistory.value) {
      return
    }
    linkageActive()
  })
}
const getG2Elements = () => {
  const document = myChart?.getContext?.()?.canvas?.document
  return Array.from(document?.getElementsByClassName?.('element') || [])
}
const getElementDatum = element => {
  const data = element?.__data__
  if (data?.data) {
    return data.data
  }
  const viewList = myChart?.getContext?.()?.views || []
  const targetView = viewList.find(item => item.key === data?.viewKey) || viewList[0]
  const targetMark = Array.from(targetView?.markState?.keys?.() || []).find(
    (mark: any) => mark.key === data?.markKey
  ) as any
  return targetMark?.data?.[data?.index] ?? data
}
const eachElementShape = (element, callback) => {
  if (!element) {
    return
  }
  callback(element)
  Array.from(element.childNodes || []).forEach(child => eachElementShape(child, callback))
}
const getShapeAttr = (shape, key) =>
  typeof shape?.getAttribute === 'function' ? shape.getAttribute(key) : shape?.attributes?.[key]
const setShapeAttr = (shape, key, value) => {
  if (typeof shape?.setAttribute === 'function') {
    shape.setAttribute(key, value)
  }
}
const flushG2Canvas = () => {
  myChart?.getContext?.()?.canvas?.render?.()
}
const isLinkageOpacityElement = element => LINKAGE_OPACITY_MARK_TYPES.includes(element?.markType)
const getElementClassInfo = element => {
  const info = []
  eachElementShape(element, shape => {
    info.push(shape?.className, shape?.id, shape?.name, getShapeAttr(shape, 'className'))
  })
  return info.filter(Boolean).join(' ').toLowerCase()
}
const isLinkageDataElement = element => {
  // 象限背景是区域不参与数据联动的选中和淡化
  if (view.value.type === 'quadrant' && element?.markType === 'range') {
    return false
  }
  // 采样标签载体只负责定位文本，不参与联动选中和透明度回放
  if (isLargeDataLabelMark(element?.__data__?.markKey)) {
    return false
  }
  if (LINKAGE_IGNORE_MARK_TYPES.includes(element?.markType)) {
    return false
  }
  return !LINKAGE_IGNORE_CLASS_REG.test(getElementClassInfo(element))
}
const backupShapeStyle = shape => {
  if (!shape?.[LINKAGE_STYLE_CACHE]) {
    shape[LINKAGE_STYLE_CACHE] = LINKAGE_STYLE_KEYS.reduce((pre, key) => {
      pre[key] = getShapeAttr(shape, key)
      return pre
    }, {})
  }
}
const applyElementStyle = (element, style) => {
  eachElementShape(element, shape => {
    backupShapeStyle(shape)
    Object.entries(style).forEach(([key, value]) => setShapeAttr(shape, key, value))
  })
}
const getLinkageElementStyle = (element, selected) => {
  if (view.value.type === 'box-plot') {
    // 箱体和异常点保留基础配色的 alpha，仅用额外透明度区分联动状态
    if (!selected) {
      return { opacity: 0.65 }
    }
    if (element?.markType === 'box') {
      return { ...LINKAGE_SELECTED_STYLE.value, opacity: 1 }
    }
  }
  if (view.value.type === 'sankey') {
    // 联动触发后直接设置已渲染 polygon 的真实属性，不使用 Sankey spec 的 link 前缀
    return selected
      ? {
          lineWidth: 1,
          stroke: chartStroke.value,
          strokeOpacity: 1
        }
      : LINKAGE_UNSELECTED_STYLE
  }
  // 子弹图仅实际值柱绘制选中描边，背景区间和目标值只按维度切换透明度
  if (view.value.type === 'bullet-graph') {
    if (!selected) {
      return LINKAGE_UNSELECTED_STYLE
    }
    return element?.__data__?.markKey === '__de_bullet_measure__'
      ? LINKAGE_SELECTED_STYLE.value
      : LINKAGE_SELECTED_OPACITY_STYLE
  }
  // 进度条背景层只切换透明度，不绘制选中描边
  if (element?.__data__?.markKey === 'progress-background') {
    return selected ? LINKAGE_SELECTED_OPACITY_STYLE : LINKAGE_UNSELECTED_STYLE
  }
  if (element?.markType === 'point') {
    return selected ? LINKAGE_SELECTED_POINT_STYLE.value : LINKAGE_UNSELECTED_STYLE
  }
  if (isLinkageOpacityElement(element)) {
    return selected ? LINKAGE_SELECTED_OPACITY_STYLE : LINKAGE_UNSELECTED_STYLE
  }
  return selected ? LINKAGE_SELECTED_STYLE.value : LINKAGE_UNSELECTED_STYLE
}
const resetElementStyle = element => {
  eachElementShape(element, shape => {
    const cache = shape?.[LINKAGE_STYLE_CACHE]
    if (!cache) {
      return
    }
    Object.entries(cache).forEach(([key, value]) => {
      // 原始属性不存在时必须移除，否则 AntV G 会保留联动覆盖值
      if (value === undefined || value === null) {
        shape.removeAttribute?.(key)
      } else {
        setShapeAttr(shape, key, value)
      }
    })
    delete shape[LINKAGE_STYLE_CACHE]
  })
}
const resetLinkageElementState = () => {
  getG2Elements().forEach(resetElementStyle)
}
const resetLinkageContentOpacity = () => {
  let changed = false
  getG2Elements().forEach(element => {
    const isBoxPlotBox = view.value.type === 'box-plot' && element?.markType === 'box'
    if (!isLinkageDataElement(element) || (!isLinkageOpacityElement(element) && !isBoxPlotBox)) {
      return
    }
    eachElementShape(element, shape => {
      const opacity = Number(getShapeAttr(shape, 'opacity'))
      if (opacity !== 0 && opacity < 1) {
        setShapeAttr(shape, 'opacity', 1)
        changed = true
      }
    })
  })
  changed && flushG2Canvas()
}
const applyLinkageElementState = (flush = false) => {
  const elements = getG2Elements()
  resetLinkageElementState()
  elements.forEach(element => {
    if (!isLinkageDataElement(element)) {
      return
    }
    const datum = getElementDatum(element)
    if (!datum || Array.isArray(datum)) {
      return
    }
    const selected = checkSelected(datum)
    // 折线/点/面积只改透明度，避免定位线或点被套成黑色选中描边
    const style = getLinkageElementStyle(element, selected)
    applyElementStyle(element, style)
  })
  flush && flushG2Canvas()
}
const checkSelected = param => {
  if (view.value.type === 'box-plot') {
    // 箱线图按已映射维度的原始值匹配，空值和 0 不转换成展示占位符
    const dimensions =
      boxPlotLinkageData.value?.dimensionList?.filter(
        item => nowPanelTrackInfo.value[`${view.value.id}#${String(item.id)}`]?.length
      ) ?? []
    return (
      dimensions.length > 0 &&
      dimensions.every(selected =>
        param?.dimensionList?.some(
          item => String(item.id) === String(selected.id) && item.value === selected.value
        )
      )
    )
  }
  // 获取当前视图的所有联动字段ID
  const mappingFieldIds = Array.from(
    new Set(
      (view.value.type.includes('chart-mix')
        ? concat(chartData.value?.left?.fields, chartData.value?.right?.fields)
        : chartData.value?.fields
      )
        .map(item => item?.id)
        .filter(id =>
          Object.keys(nowPanelTrackInfo.value).some(
            key => key.startsWith(view.value.id) && key.split('#')[1] === id
          )
        )
    )
  )
  // 维度字段匹配
  const [xAxis, xAxisExt, extStack] = ['xAxis', 'xAxisExt', 'extStack'].map(key =>
    view.value[key].find(item => mappingFieldIds.includes(item.id))
  )
  // 选中字段数据
  const { group, name, category } = state.linkageActiveParam
  // 选中字段数据匹配
  if (view.value.type === 'sankey') {
    // 桑基图联动只选中实际点击的连接，不选中起止节点
    const sourceSelected = name === param?.source?.key
    return view.value.xAxisExt?.length
      ? sourceSelected && category === param?.target?.key
      : sourceSelected
  } else if (view.value.type === 'stock-line') {
    // K线 datum 使用动态日期字段，联动参数中的 name 即对应日期值
    return name === param[view.value.xAxis[0].dataeaseName]
  } else if (g2TypeSeries1.includes(view.value.type)) {
    return name === param.field
  } else if (g2TypeSeries0.includes(view.value.type)) {
    return category === param.category
  } else if (g2TypeTree.includes(view.value.type)) {
    // pack 图元使用 d3 hierarchy 节点包装原始数据，联动匹配需读取节点的 data
    const treeData = param?.data ?? param
    const treePath = typeof treeData?.path === 'string' ? treeData.path : ''
    if (treePath.startsWith(name) || name === t('commons.all')) {
      return true
    }
    return name === treeData?.name
  } else if (g2TypeGroup.includes(view.value.type)) {
    const isNameMatch = name === param.name || (name === 'NO_DATA' && !param.name)
    const isCategoryMatch = category === param.category
    if (xAxis && xAxisExt) {
      return isNameMatch && isCategoryMatch
    }
    if (xAxis && !xAxisExt) {
      return isNameMatch
    }
    if (!xAxis && xAxisExt) {
      return isCategoryMatch
    }
    return false
  } else if (g2TypeStack.includes(view.value.type)) {
    const isGroupMatch = group === param.group || (group === 'NO_DATA' && !param.group)
    const isNameMatch = name === param.name || (name === 'NO_DATA' && !param.name)
    const isCategoryMatch = category === param.category
    // 全部匹配
    if (xAxis && xAxisExt && extStack) {
      return isNameMatch && isGroupMatch && isCategoryMatch
    }
    // 只匹配到维度
    if (xAxis && !xAxisExt && !extStack) {
      return isNameMatch
    } else if (!xAxis && xAxisExt && !extStack) {
      return isGroupMatch
    } else if (!xAxis && !xAxisExt && extStack) {
      return isCategoryMatch
    } else if (xAxis && xAxisExt && !extStack) {
      return isNameMatch && isGroupMatch
    } else if (xAxis && !xAxisExt && extStack) {
      return isNameMatch && isCategoryMatch
    } else if (!xAxis && xAxisExt && extStack) {
      return isGroupMatch && isCategoryMatch
    } else {
      return false
    }
  } else {
    return (
      (name === param.name || (name === 'NO_DATA' && !param.name)) && category === param.category
    )
  }
}

/**
 * 查询图表数据并传递刷新来源，开发模拟仅在显式开启时修改响应副本
 * autoRefresh 只标记定时刷新，手动查询仍使用完整绘制流程
 */
const calcData = async (view, callback, autoRefresh = false) => {
  if (!isPasteActive()) {
    callback?.()
    return
  }
  if (view.tableId || view['dataFrom'] === 'template') {
    isError.value = false
    const v = JSON.parse(JSON.stringify(view))
    getData(v)
      .then(async res => {
        if (res.code && res.code !== 0) {
          isError.value = true
          errMsg.value = res.msg
          callback?.()
        } else {
          if (mockRefreshResponse) {
            res = mockRefreshResponse(res, view, autoRefresh)
          }
          chartData.value = res?.data as Partial<Chart['data']>
          emit('onDrillFilters', res?.drillFilters)
          if (!res?.drillFilters?.length) {
            dynamicAreaId.value = ''
            scope = null
            gadmName = null
          } else {
            const chartExtRequest = view.chartExtRequest || view.value?.chartExtRequest
            const extra = chartExtRequest?.drill?.[res?.drillFilters?.length - 1].extra
            dynamicAreaId.value = extra?.adcode ? extra.adcode + '' : ''
            scope = extra?.scope
            gadmName = extra?.gadmName
            // 地图
            const map = parseJson(view.customAttr)?.map
            if (map) {
              let areaId = map.id
              country.value = areaId.slice(0, 3)
              if (country.value === '000' || dynamicAreaId.value?.startsWith('000')) {
                const firstAdcode = chartExtRequest?.drill?.[0]?.extra?.adcode
                if (firstAdcode) {
                  country.value = firstAdcode + ''
                }
              }
            }
            if (dynamicAreaId.value && !dynamicAreaId.value?.startsWith(country.value)) {
              if (country.value === 'cus') {
                dynamicAreaId.value = '156' + dynamicAreaId.value
              } else {
                dynamicAreaId.value = country.value + dynamicAreaId.value
              }
            }
          }
          dvMainStore.setViewDataDetails(view.id, res)
          if (!res.drill && !res.chartExtRequest?.linkageFilters?.length) {
            dvMainStore.setViewOriginData(view.id, chartData.value)
            emitter.emit('chart-data-change')
          }
          await renderChart(res, callback, autoRefresh)
        }
      })
      .catch(() => {
        callback?.()
      })
  } else {
    if (['bubble-map', 'map', 'flow-map', 'heat-map'].includes(view.type)) {
      await renderChart(view, callback)
    }
    callback?.()
  }
}
let curView
const interactionView = computed(() =>
  filterPasteBinding.value
    ? { ...view.value, drill: curView?.drill, drillFilters: curView?.drillFilters }
    : curView
)
/**
 * 按图表渲染库分发查询结果，仅向 G2 传递局部更新所需的定时刷新标记
 */
const renderChart = async (view, callback?, autoRefresh = false, strict = false) => {
  if (!view) {
    return
  }
  curView = view
  // view 为引用对象 需要存库 view.data 直接赋值会导致保存不必要的数据
  // 与默认图表对象合并，方便增加配置项
  const chart = deepCopy({
    ...defaultsDeep(view, cloneDeep(BASE_VIEW_CONFIG)),
    data: chartData.value,
    ...(props.fontFamily && props.fontFamily !== 'inherit' ? { fontFamily: props.fontFamily } : {})
  })
  const chartView = chartViewManager.getChartView(view.render, view.type)
  // 只附于本次临时 chart；可枚举 string/function 键经真实 deepCopy/spread 保留。
  if (strict && chartView.library === ChartLibraryType.G2) {
    chart.__deFilterPasteInteraction = pasteInteractionAllowed
  }
  recursionTransObj(customAttrTrans, chart.customAttr, scale.value, terminal.value)
  recursionTransObj(customStyleTrans, chart.customStyle, scale.value, terminal.value)
  if (chartView.library !== ChartLibraryType.G2 && (activeG2Scope || ownedG2Generation)) {
    // 仅离开 owned line 时使进行中的尝试失效；L7 绘制本身沿用原分支。
    g2RenderVersion++
    ownedG2Generation = false
    g2Timer && clearTimeout(g2Timer)
    finishG2Schedule?.()
    clearG2ResizeSchedule()
    if (activeG2Scope) disposeActiveG2Scope()
  }
  switch (chartView.library) {
    case ChartLibraryType.L7_PLOT:
      if (strict) {
        await renderPreparedMap(chart, chartView)
        break
      }
      await renderL7Plot(chart, chartView as L7PlotChartView<any, any>, callback)
      break
    case ChartLibraryType.L7:
      if (strict) {
        await renderPreparedMap(chart, chartView)
        break
      }
      await renderL7(chart, chartView as L7ChartView<any, any>, callback)
      break
    case ChartLibraryType.G2:
      await renderG2(chart, chartView as G2ChartView<any, any>, autoRefresh, strict)
      callback?.()
      break
    default:
      break
  }
}
let myChart = null
let activeG2Scope: G2RenderScope<G2Chart> | null = null
let activeG2Version = 0
let ownedG2Generation = false
const reportG2CleanupErrors = (errors: unknown[]) => {
  if (errors.length) console.warn('G2 cleanup errors', errors)
}
const isActiveG2Scope = (version: number, scope: G2RenderScope<G2Chart>, instance: G2Chart) =>
  !chartComponentUnmounted &&
  version === g2RenderVersion &&
  activeG2Scope === scope &&
  myChart === instance &&
  !scope.closed
const disposeActiveG2Scope = () => {
  const scope = activeG2Scope
  activeG2Scope = null
  myChart = null
  if (scope) reportG2CleanupErrors(scope.dispose())
}
const clearG2ResizeSchedule = () => {
  g2ResizeTimer && clearTimeout(g2ResizeTimer)
  g2ResizeTimer = undefined
  G2TooltipCarousel.dequeueResize(containerId)
}
let g2Timer: number
let finishG2Schedule: (() => void) | undefined
let g2RenderQueue = Promise.resolve()
let g2RenderVersion = 0
let g2SliderCleanup: (() => void) | undefined
let assistLineCleanup: (() => void) | undefined
let g2TiledLegendCleanup: (() => void) | undefined
let g2LegendPaginationCleanup: (() => void) | undefined
const clearG2SliderAdapter = () => {
  if (activeG2Scope) {
    activeG2Scope.removeCleanup('slider')
    return
  }
  g2SliderCleanup?.()
  g2SliderCleanup = undefined
}
const clearG2LegendPaginationAdapter = () => {
  if (activeG2Scope) {
    activeG2Scope.removeCleanup('assist')
    activeG2Scope.removeCleanup('tiled')
    activeG2Scope.removeCleanup('pagination')
    return
  }
  assistLineCleanup?.()
  assistLineCleanup = undefined
  g2TiledLegendCleanup?.()
  g2TiledLegendCleanup = undefined
  g2LegendPaginationCleanup?.()
  g2LegendPaginationCleanup = undefined
}
const installG2SvgCoordinateScaleAdapter = chartInstance => {
  const canvas = chartInstance?.getContext?.()?.canvas
  const svg = canvas?.getContextService?.()?.getDomElement?.()
  if (!(svg instanceof SVGSVGElement)) {
    return
  }
  const scalableSvg = svg as SVGSVGElement & {
    offsetWidth?: number
    offsetHeight?: number
  }
  const dimensions = [
    ['offsetWidth', 'width'],
    ['offsetHeight', 'height']
  ] as const
  dimensions.forEach(([offsetKey, sizeKey]) => {
    if (Number(scalableSvg[offsetKey]) > 0) {
      return
    }
    // SVG 节点没有 HTMLElement 的 offsetWidth/offsetHeight，补齐逻辑尺寸供 AntV G 识别外层 transform 缩放
    Reflect.defineProperty(scalableSvg, offsetKey, {
      configurable: true,
      get: () =>
        Number(canvas.getConfig?.()?.[sizeKey]) ||
        Number.parseFloat(svg.getAttribute(sizeKey) || '') ||
        svg.getBoundingClientRect()[sizeKey]
    })
  })
}
/**
 * 串行执行 G2 绘制，丢弃过期调度并在卸载后停止操作实例
 * 定时刷新优先尝试已注册的局部更新，不支持时回退完整绘制
 * 返回的 Promise 在本轮绘制结束或调度取消后完成，供调用方释放加载状态
 */
const renderG2 = async (
  chart,
  chartView: G2ChartView<any, any>,
  autoRefresh = false,
  strict = false
) => {
  if (
    !chart.customAttr?.tooltip?.carousel?.enable &&
    G2TooltipCarousel.getInstanceByContainerId(containerId)
  ) {
    // 关闭轮播时立即释放当前实例，不等待防抖重绘
    G2TooltipCarousel.destroyByContainer(containerId, true)
    replayLinkageActive()
  }
  const version = ++g2RenderVersion
  const ownedLine = chart.type === 'line' && chartView.library === ChartLibraryType.G2
  ownedG2Generation = ownedLine
  if (ownedLine || activeG2Scope) clearG2ResizeSchedule()
  g2Timer && clearTimeout(g2Timer)
  finishG2Schedule?.()
  return new Promise<void>((resolve, reject) => {
    finishG2Schedule = () => (strict ? reject(new Error('paste_cancelled')) : resolve())
    g2Timer = setTimeout(() => {
      finishG2Schedule = undefined
      g2RenderQueue = g2RenderQueue
        .then(async () => {
          if (
            chartComponentUnmounted ||
            version !== g2RenderVersion ||
            (strict && !pasteIsCurrent())
          ) {
            if (strict) throw new Error('paste_cancelled')
            return
          }
          const notifiedCleanupErrors = new Set<Error>()
          const notifyCleanupErrors = (errors: Error[]) => {
            errors.forEach(error => notifiedCleanupErrors.add(error))
            reportG2CleanupErrors(errors)
          }
          try {
            // owned line 切换到 legacy 前先释放旧 scope，避免 legacy 再次 destroy 旧实例。
            if (!ownedLine && activeG2Scope) disposeActiveG2Scope()
            // 仅在移动端配置右侧缩略区域隐藏图表文本
            let dashboardHidden = element.value.dashboardHidden
            if (dvMainStore.mobileInPc) {
              dashboardHidden = !!document
                .getElementById(containerId)
                ?.closest('.mobile-wrapper-inner-adaptor')
            }
            const tScale = dvMainStore.canvasStyleData?.tScale
            const isDataV = !isDashboard()
            const drawOptions = {
              chartObj: myChart,
              container: containerId,
              chart: {
                ...chart,
                container: containerId,
                dashboardHidden,
                tScale,
                isDataV,
                themes: isDataV ? 'dark' : dvMainStore.canvasStyleData?.dashboard?.themeColor
              },
              scale: scale.value,
              action,
              quadrantDefaultBaseline
            }
            if (ownedLine) {
              const isCurrent = () =>
                !chartComponentUnmounted &&
                version === g2RenderVersion &&
                (!strict || pasteIsCurrent())
              const scope = activeG2Scope
              const instance = scope?.instance
              if (autoRefresh && scope && instance) {
                const isActive = () => isActiveG2Scope(version, scope, instance)
                const updated = await chartView.updateData(drawOptions, () => {
                  if (!isActive()) return
                  // remove 先释放旧 adapter，再安装并登记本实例的新 adapter。
                  scope.removeCleanup('assist')
                  if (!isActive()) return
                  scope.replaceCleanup('assist', installG2AssistLineVisibility(instance, chart))
                })
                if (!isActive()) return
                if (updated) {
                  activeG2Version = version
                  replayLinkageActive()
                  return
                }
              }
              configEmptyDataStyle([1], containerId)
              clearG2ResizeSchedule()
              if (activeG2Scope) {
                disposeActiveG2Scope()
              } else {
                // legacy -> owned：保留原资源释放顺序，再清空活动指针。
                G2TooltipCarousel.destroyByContainer(containerId)
                clearG2SliderAdapter()
                clearG2LegendPaginationAdapter()
                myChart?.destroy()
                myChart = null
              }
              const result = await createG2RenderAttempt<G2Chart>({
                isCurrent,
                onCleanupErrors: notifyCleanupErrors,
                initialCleanups: [
                  {
                    key: 'carousel',
                    cleanup: () => G2TooltipCarousel.destroyByContainer(containerId)
                  },
                  { key: 'resize', cleanup: clearG2ResizeSchedule }
                ],
                create: async () => {
                  if (Array.isArray(chart.data?.data) && chart.data.data.length === 0) {
                    configEmptyDataStyle([], containerId)
                    return { kind: 'empty' }
                  }
                  const instance = await chartView.drawChart(drawOptions)
                  return { kind: 'instance', instance }
                },
                setup: scope => {
                  const chartInstance = scope.instance
                  listenerTooltipShow(chartInstance, { ...chart, container: containerId })
                  configAxisTitleOverflowTooltip(
                    { ...chart, container: containerId },
                    chartInstance
                  )
                  chartView.applyThemeFont(chartInstance, chart.fontFamily)
                  chartView.optimizeLargeData(chartInstance)
                  const legendContainer = document.getElementById(containerId)
                  chartInstance.options(
                    applyG2TiledLegend(
                      chartInstance.options(),
                      chart.customStyle?.legend,
                      legendContainer?.clientWidth || 1,
                      legendContainer?.clientHeight || 1,
                      (event, payload) => chartInstance.emit(event, payload),
                      !isDashboard() ||
                        dvMainStore.canvasStyleData?.dashboard?.themeColor === 'dark'
                        ? 'dark'
                        : 'light'
                    )
                  )
                  if (chart.customStyle?.legend?.displayMode === 'tile') {
                    scope.replaceCleanup('tiled', installG2TiledLegendStateAdapter(chartInstance))
                  }
                  scope.replaceCleanup(
                    'assist',
                    installG2AssistLineVisibility(chartInstance, chart)
                  )
                },
                render: async scope => {
                  await scope.instance.render()
                },
                afterRender: async scope => {
                  const chartInstance = scope.instance
                  installG2SvgCoordinateScaleAdapter(chartInstance)
                  await chartView.afterRender?.(chartInstance)
                  if (!isCurrent()) return
                  scope.replaceCleanup('slider', installG2SliderAdapter(chartInstance))
                  scope.replaceCleanup(
                    'pagination',
                    installG2SideLegendPaginationAdapter(chartInstance, {
                      afterPageLayout: () => {
                        if (isActiveG2Scope(activeG2Version, scope, chartInstance)) {
                          replayLinkageActive()
                        }
                      }
                    })
                  )
                }
              })
              if (result.status === 'ready') {
                if (!isCurrent()) {
                  reportG2CleanupErrors(result.scope.dispose())
                  return
                }
                activeG2Scope = result.scope
                activeG2Version = version
                myChart = result.scope.instance
                replayLinkageActive()
              }
              if (strict && result.status === 'stale') throw new Error('paste_cancelled')
              return
            }
            if (
              autoRefresh &&
              myChart &&
              (await chartView.updateData(drawOptions, () => {
                assistLineCleanup?.()
                assistLineCleanup = installG2AssistLineVisibility(myChart, chart)
              }))
            ) {
              if (!chartComponentUnmounted && version === g2RenderVersion) replayLinkageActive()
              return
            }
            // 在这里清理掉之前图表的空dom
            configEmptyDataStyle([1], containerId)
            // G2 重绘前先停掉 tooltip 轮播，避免旧实例残留高亮背景
            G2TooltipCarousel.destroyByContainer(containerId)
            clearG2SliderAdapter()
            clearG2LegendPaginationAdapter()
            myChart?.destroy()
            if (strict && Array.isArray(chart.data?.data) && chart.data.data.length === 0) {
              configEmptyDataStyle([], containerId)
              myChart = null
              return
            }
            myChart = await chartView.drawChart(drawOptions)
            // 固定本轮创建的实例，避免等待异步渲染期间新一轮 renderG2 替换全局 myChart 后误操作新实例
            const chartInstance = myChart
            if (strict && !pasteIsCurrent()) {
              chartInstance?.destroy()
              myChart = null
              throw new Error('paste_cancelled')
            }
            if (!chartInstance) {
              if (strict) throw new Error('paste_instance_missing')
              return
            }
            if (chartComponentUnmounted) {
              chartInstance.destroy()
              return
            }
            // 数据 tooltip 的缩放补偿统一在公共入口接入，幂等保护避免轮播图重复绑定
            listenerTooltipShow(chartInstance, { ...chart, container: containerId })
            configAxisTitleOverflowTooltip(
              {
                ...chart,
                container: containerId
              },
              chartInstance
            )
            // 此时 drawChart 已经完成最终 Spec 装配，但 G2 尚未开始首次绘制
            // 主题字体在公共入口注入，让坐标轴、图例、标签和特殊文本使用同一字体
            chartView.applyThemeFont(chartInstance, chart.fontFamily)
            // 在这里统一应用性能策略，可以避免大数据首次进入页面时创建海量标签并执行昂贵动画
            // 优化后的 options 会保留在当前实例中，刷新和容器调整触发 forceFit 时也会直接复用
            chartView.optimizeLargeData(chartInstance)
            const legendContainer = document.getElementById(containerId)
            chartInstance.options(
              applyG2TiledLegend(
                chartInstance.options(),
                chart.customStyle?.legend,
                legendContainer?.clientWidth || 1,
                legendContainer?.clientHeight || 1,
                (event, payload) => chartInstance.emit(event, payload),
                !isDashboard() || dvMainStore.canvasStyleData?.dashboard?.themeColor === 'dark'
                  ? 'dark'
                  : 'light'
              )
            )
            if (chart.customStyle?.legend?.displayMode === 'tile') {
              g2TiledLegendCleanup = installG2TiledLegendStateAdapter(chartInstance)
            }
            assistLineCleanup = installG2AssistLineVisibility(chartInstance, chart)
            // 等待 G2 完成包含轴边界校正的最终布局
            await chartInstance?.render()
            if (strict && !pasteIsCurrent()) throw new Error('paste_cancelled')
            installG2SvgCoordinateScaleAdapter(chartInstance)
            // 双向条形图、象限图仍依赖首次布局，必须等待其专属处理后再恢复联动状态
            await chartView.afterRender?.(chartInstance)
            if (strict && !pasteIsCurrent()) throw new Error('paste_cancelled')
            // 异步等待期间若图表已被新实例替换，本轮旧实例不再回放联动状态，避免污染当前画布
            if (!chartComponentUnmounted && chartInstance && chartInstance === myChart) {
              g2SliderCleanup = installG2SliderAdapter(chartInstance)
              // 侧边图例翻页后重新计算整体占宽，并在 Plot 重排完成后恢复联动选中态
              g2LegendPaginationCleanup = installG2SideLegendPaginationAdapter(chartInstance, {
                afterPageLayout: replayLinkageActive
              })
              replayLinkageActive()
            }
          } catch (e) {
            if (strict) throw e
            if (e instanceof G2RenderAttemptFailure) {
              console.error('renderG2Plot error', e.originalError ?? e)
              // helper 已通知的 cleanup errors 不重复输出；主业务错误保持单独观察。
              reportG2CleanupErrors(
                e.cleanupErrors.filter(error => !notifiedCleanupErrors.has(error))
              )
            } else {
              console.error('renderG2Plot error', e)
            }
          }
        })
        .then(resolve, error => {
          if (strict) reject(error)
          else resolve()
        })
    }, 300)
  })
}

const dynamicAreaId = ref('')
const country = ref('')
const appStore = useAppStoreWithOut()
let gadmName
const chartContainer = ref<HTMLElement>(null)
let scope
let mapTimer: ReturnType<typeof setTimeout>
const renderL7Plot = async (chart: ChartObj, chartView: L7PlotChartView<any, any>, callback) => {
  const map = parseJson(chart.customAttr).map
  let areaId = map.id
  country.value = areaId.slice(0, 3)
  if (dynamicAreaId.value) {
    // 世界下钻到国家，切换路径
    if (country.value === '000' && dynamicAreaId.value.startsWith('000')) {
      country.value = dynamicAreaId.value.slice(3)
      areaId = country.value
    } else {
      areaId = dynamicAreaId.value
    }
  }
  mapTimer && clearTimeout(mapTimer)
  mapTimer = setTimeout(async () => {
    try {
      clearG2SliderAdapter()
      clearG2LegendPaginationAdapter()
      // 旧 strict 桥只释放自己持有的实例；普通刷新产生的新实例仍走原清理路径。
      if (mapPasteInstance && myChart === mapPasteInstance) releaseMapPreparation()
      myChart?.destroy()
      if (chartContainer.value) {
        chartContainer.value.textContent = ''
      }
      myChart = await chartView.drawChart({
        chartObj: myChart,
        container: containerId,
        chart,
        areaId,
        action,
        scope,
        gadmName
      })
      callback?.()
    } catch (e) {
      console.error('renderL7Plot error', e)
      callback?.()
    } finally {
      emit('resetLoading')
    }
  }, 500)
}

let mapL7Timer: number
const renderL7 = async (chart: ChartObj, chartView: L7ChartView<any, any>, callback) => {
  mapL7Timer && clearTimeout(mapL7Timer)
  mapL7Timer = setTimeout(async () => {
    try {
      // 首次普通重绘结束 strict 桥的旧 layer/scene 所有权，避免复用时的正常 destroy 被当作准备失败。
      if (mapPasteInstance && myChart === mapPasteInstance) releaseMapPreparation()
      myChart = await chartView.drawChart({
        chartObj: myChart,
        container: containerId,
        chart: chart,
        action
      })
      myChart?.render()
      callback?.()
    } catch (e) {
      console.error('renderL7 error', e)
      callback?.()
    } finally {
      emit('resetLoading')
    }
  }, 500)
}

const pointClickTrans = () => {
  if (embeddedCallBack.value === 'yes') {
    trackClick('pointClick')
  }
}

const actionDefault = param => {
  if (param.from === 'map') {
    emitter.emit('map-default-range', param)
  }
  if (param.from === 'word-cloud') {
    emitter.emit('word-cloud-default-data-range', param)
  }
  if (param.from === 'gauge' || param.from === 'liquid') {
    emitter.emit('gauge-liquid-y-value', param)
  }
}

const action = param => {
  if (!isPasteActive()) return
  if (param.from) {
    actionDefault(param)
    return
  }
  if (view.value.type === 'map') {
    if (!(param?.data?.data?.quotaList && param?.data?.data?.quotaList.length > 0)) {
      return
    }
  }
  state.pointParam = param.data
  // 点击
  pointClickTrans()
  // 保留嵌入点击回调，放大和复用视图沿用禁用交互的规则，避免误报最后一级
  if (['multiplexing', 'viewDialog'].includes(showPosition.value)) return
  // 下钻 联动 跳转
  state.linkageActiveParam = {
    ...(view.value.type === 'box-plot'
      ? { dimensionList: cloneDeep(state.pointParam.data.dimensionList) }
      : {}),
    category: state.pointParam.data.category ? state.pointParam.data.category : 'NO_DATA',
    name: state.pointParam.data.name ? state.pointParam.data.name : 'NO_DATA',
    group: state.pointParam.data.group ? state.pointParam.data.group : 'NO_DATA'
  }
  if (trackMenu.value.length < 2) {
    if (view.value.drillFields.length > 0 && trackMenu.value.length === 0) {
      ElMessage.error(t('chart.last_layer'))
      return
    }
    // 只有一个事件直接调用
    trackClick(trackMenu.value[0])
  } else {
    // 图表关联多个事件
    const pointX = param.x ?? param?.canvas?.x ?? 0
    const pointY = param.y ?? param?.canvas?.y ?? 0
    const barStyleTemp = {
      left: pointX - 50,
      top: pointY + 10
    }
    trackBarStyleCheck(element.value, barStyleTemp, props.scale, trackMenu.value.length)
    const trackBarX = barStyleTemp.left
    let trackBarY = 50
    state.trackBarStyle.left = barStyleTemp.left + 'px'
    if (interactionView.value.type === 'symbolic-map') {
      trackBarY = pointY + 10
      state.trackBarStyle.top = pointY + 10 + 'px'
    } else {
      trackBarY = barStyleTemp.top
      state.trackBarStyle.top = barStyleTemp.top + 'px'
    }
    if (dataVMobile) {
      state.trackBarStyle.left = trackBarX + 40 + 'px'
      state.trackBarStyle.top = trackBarY + 70 + 'px'
    } else {
      state.trackBarStyle.left = trackBarX + 'px'
      state.trackBarStyle.top = trackBarY + 'px'
    }

    viewTrack.value.trackButtonClick(view.value.id)
  }
}

const trackClick = trackAction => {
  if (!isPasteActive()) return
  const param = state.pointParam
  if (!param?.data?.dimensionList) {
    return
  }
  let checkName = undefined
  if (param.data.dimensionList.length > 1) {
    // 分组堆叠处理 去能比较出来值的那个维度
    if (view.value.type === 'bar-group-stack') {
      const length = param.data.dimensionList.length
      // 存在最后一个id
      if (param.data.dimensionList[length - 1].id === param.data.dimensionList[length - 2].id) {
        param.data.dimensionList.pop()
      }
      param.data.dimensionList.forEach(dimension => {
        if (dimension.value === param.data.category) {
          checkName = dimension.id
        }
      })
    }
    if (!checkName) {
      // 对多维度的处理 取第一个
      checkName = param.data.dimensionList[0].id
    }
  }
  if (!checkName) {
    checkName = param.data.name
  }
  // 跳转字段处理
  let jumpName = state.pointParam.data.name
  if (state.pointParam.data.dimensionList.length > 1) {
    const fieldIds = []
    // 优先下钻字段
    if (interactionView.value.drill) {
      const curFiled = interactionView.value.drillFields[interactionView.value.drillFilters.length]
      fieldIds.push(curFiled.id)
    }
    if (interactionView.value.type.includes('chart-mix')) {
      const mixFields = [
        ...(chartData.value?.left?.fields || []),
        ...(chartData.value?.right?.fields || [])
      ]
      // 左右轴子类别不同，只匹配当前点击数据实际包含的维度，避免选中另一侧的跳转配置。
      mixFields.forEach(field => {
        const hasDimension = param.data.dimensionList.some(dimension => dimension.id === field.id)
        if (hasDimension && !fieldIds.includes(field.id)) {
          fieldIds.push(field.id)
        }
      })
    } else {
      chartData.value?.fields?.forEach(field => {
        if (!fieldIds.includes(field.id)) {
          fieldIds.push(field.id)
        }
      })
    }
    for (let i = 0; i < fieldIds.length; i++) {
      const id = fieldIds[i]
      const sourceInfo = view.value.id + '#' + id
      if (nowPanelJumpInfo.value[sourceInfo]) {
        jumpName = id
        break
      }
    }
  }
  let quotaList = state.pointParam.data.quotaList
  if (['bar-range', 'bullet-graph'].includes(interactionView.value.type)) {
    quotaList = state.pointParam.data.dimensionList
  } else if (interactionView.value.type === 'multi-scatter') {
    const dynamicValueMap = {}
    ;[
      ...(state.pointParam.data.dynamicLabelValue || []),
      ...(state.pointParam.data.dynamicTooltipValue || [])
    ].forEach(item => {
      dynamicValueMap[item.fieldId] = item.stringValue ?? item.value
    })
    const multiScatterValueMap = {
      [interactionView.value.xAxis?.[0]?.id]: state.pointParam.data.x,
      [interactionView.value.yAxis?.[0]?.id]: state.pointParam.data.y,
      [interactionView.value.extBubble?.[0]?.id]: state.pointParam.data.popSize,
      [interactionView.value.yAxisExt?.[0]?.id]: state.pointParam.data.lightness,
      ...dynamicValueMap
    }
    quotaList = quotaList.map(item => ({
      ...item,
      value: multiScatterValueMap[item.id]
    }))
  } else {
    quotaList[0]['value'] = state.pointParam.data.value
  }
  const linkageParam = {
    option: 'linkage',
    name: checkName,
    viewId: view.value.id,
    dimensionList: state.pointParam.data.dimensionList,
    quotaList: quotaList
  }
  const jumpParam = {
    option: 'jump',
    name: jumpName,
    viewId: view.value.id,
    dimensionList: state.pointParam.data.dimensionList,
    quotaList: quotaList
  }

  const clickParams = {
    option: 'pointClick',
    name: checkName,
    viewId: view.value.id,
    dimensionList: state.pointParam.data.dimensionList,
    quotaList: quotaList
  }
  if (view.value.type === 'box-plot' && ['linkage', 'linkageAndDrill'].includes(trackAction)) {
    // 与提交过滤条件使用同一份原始维度，后续点击和下钻参数的修改不影响回放
    boxPlotLinkageData.value = cloneDeep(state.pointParam.data)
  }
  switch (trackAction) {
    case 'pointClick':
      emit('onPointClick', clickParams)
      break
    case 'linkageAndDrill':
      if (view.value.type === 'box-plot') {
        linkageActivePre()
      }
      dvMainStore.addViewTrackFilter(linkageParam)
      emit('onChartClick', param)
      break
    case 'drill':
      emit('onChartClick', param)
      break
    case 'linkage':
      linkageActivePre()
      dvMainStore.addViewTrackFilter(linkageParam)
      break
    case 'jump':
      if (mobileInPc.value && !inMobile.value) return
      emit('onJumpClick', jumpParam)
      break
    default:
      clearLinkage()
      break
  }
}

const trackMenu = computed(() => {
  let trackMenuInfo = []
  // 复用、放大状态的仪表板不进行联动、跳转和下钻的动作
  if (!['multiplexing', 'viewDialog'].includes(showPosition.value)) {
    let drillFields =
      interactionView.value?.drill && interactionView.value?.drillFilters?.length
        ? interactionView.value.drillFilters.map(item => item.fieldId)
        : []
    let linkageCount = 0
    let jumpCount = 0
    if (interactionView.value?.type?.includes('chart-mix')) {
      Array.of('left', 'right').forEach(side => {
        chartData.value?.[side]?.fields
          ?.filter(item => !drillFields.includes(item.id))
          .forEach(item => {
            const sourceInfo = view.value.id + '#' + item.id
            if (nowPanelTrackInfo.value[sourceInfo]) {
              linkageCount++
            }
            if (nowPanelJumpInfo.value[sourceInfo]) {
              jumpCount++
            }
          })
      })
    } else {
      chartData.value?.fields
        ?.filter(item => !drillFields.includes(item.id))
        .forEach(item => {
          const sourceInfo = view.value.id + '#' + item.id
          if (nowPanelTrackInfo.value[sourceInfo]) {
            linkageCount++
          }
          if (nowPanelJumpInfo.value[sourceInfo]) {
            jumpCount++
          }
        })
    }
    jumpCount &&
      view.value?.jumpActive &&
      (!mobileInPc.value || inMobile.value) &&
      trackMenuInfo.push('jump')
    linkageCount && view.value?.linkageActive && trackMenuInfo.push('linkage')
    view.value.drillFields.length && trackMenuInfo.push('drill')
    // 如果同时配置jump linkage drill 切配置联动时同时下钻 在实际只显示两个 '跳转' '联动和下钻'
    if (trackMenuInfo.length === 3 && element.value.actionSelection.linkageActive === 'auto') {
      trackMenuInfo = ['jump', 'linkageAndDrill']
    } else if (
      trackMenuInfo.length === 2 &&
      element.value.actionSelection.linkageActive === 'auto' &&
      !trackMenuInfo.includes('jump')
    ) {
      trackMenuInfo = ['linkageAndDrill']
    }
  }
  return trackMenuInfo
})
const quadrantDefaultBaseline = defaultQuadrant => {
  if (!isPasteActive()) return
  emitter.emit('quadrant-default-baseline', defaultQuadrant)
}

const canvas2Picture = (pictureData, online) => {
  const mapDom = document.getElementById(containerId)
  const childNodeList = mapDom.querySelectorAll('.l7-scene')
  if (childNodeList?.length) {
    childNodeList.forEach(child => {
      child['style'].display = 'none'
    })
  }
  if (online) {
    const canvasContainerList = mapDom.querySelectorAll('.amap-maps')
    canvasContainerList?.forEach(canvasContainer => {
      canvasContainer['style'].display = 'none'
    })
  }
  const imgDom = document.createElement('img')
  imgDom.style.width = '100%'
  imgDom.style.height = '100%'
  imgDom.style.position = 'absolute'
  imgDom.style.objectFit = 'cover'
  imgDom.style['z-index'] = '2'
  imgDom.classList.add('prepare-picture-img')
  imgDom.src = pictureData
  mapDom?.appendChild(imgDom)
}
const preparePicture = id => {
  if (id !== curView?.id) {
    return
  }
  const chartView = chartViewManager.getChartView(curView.render, curView.type)
  if (chartView.library === ChartLibraryType.L7_PLOT) {
    myChart
      .getScene()
      .exportMap('png')
      .then(res => canvas2Picture(res, false))
  } else if (chartView.library === ChartLibraryType.L7) {
    const scene = myChart.getScene()
    const zoom = new ExportImage({
      onExport: (base64: string) => {
        canvas2Picture(base64, true)
      }
    })
    let getTmapImage
    if (scene) {
      scene.addControl(zoom)
      zoom.hide()
      // 天地图
      getTmapImage = async () => {
        const res = await scene.exportPng('png')
        canvas2Picture(res, true)
      }
    }
    zoom
      .getImage()
      .then(res => {
        canvas2Picture(res, true)
      })
      .catch(() => {
        if (scene && getTmapImage) {
          getTmapImage()
        }
      })
  }
}
const unPreparePicture = id => {
  if (id !== curView?.id) {
    return
  }
  const chartView = chartViewManager.getChartView(curView.render, curView.type)
  if (chartView.library === ChartLibraryType.L7_PLOT || chartView.library === ChartLibraryType.L7) {
    const mapDom = document.getElementById(containerId)
    const childNodeList = mapDom.querySelectorAll('.l7-scene')
    if (childNodeList?.length) {
      childNodeList.forEach(child => {
        child['style'].display = 'block'
      })
    }
    const imgDomList = mapDom.querySelectorAll('.prepare-picture-img')
    imgDomList?.forEach(child => {
      child.remove()
    })
    const canvasContainerList = mapDom.querySelectorAll('.amap-maps')
    canvasContainerList?.forEach(canvasContainer => {
      canvasContainer['style'].display = 'block'
    })
  }
}
let pasteIsCurrent = () => true
let pasteInteractionAllowed = () => true
const filterPasteAreaId = chart => {
  const areaId = parseJson(chart.customAttr)?.map?.id
  if (areaId?.startsWith('000') && dynamicAreaId.value.startsWith('000'))
    return dynamicAreaId.value.slice(3)
  return dynamicAreaId.value || areaId
}
const canPrepareFilterPaste = () => {
  const library = chartViewManager.getChartView(view.value.render, view.value.type)?.library
  return (
    library === ChartLibraryType.G2 ||
    ([ChartLibraryType.L7, ChartLibraryType.L7_PLOT].includes(library) &&
      canPrepareFilterPasteMap(
        view.value as ChartObj,
        scope ? '156' : filterPasteAreaId(view.value)
      ))
  )
}
let mapPasteReady: FilterPasteMapReady | undefined
let mapPasteInstance
let cancelMapPreparation: (() => void) | undefined
const releaseMapPreparation = () => {
  cancelMapPreparation?.()
  if (mapPasteInstance && myChart === mapPasteInstance) myChart = null
}
const assertMapPreparation = () => {
  if (mapPasteReady && !mapPasteReady.check()) throw new Error('paste_map_cancelled')
}
const renderPreparedMap = (chart, chartView) =>
  new Promise<void>((resolve, reject) => {
    cancelMapPreparation = () => {
      mapPasteReady?.dispose()
      reject(new Error('paste_map_cancelled'))
    }
    mapTimer = setTimeout(async () => {
      const ready = new FilterPasteMapReady(pasteIsCurrent)
      mapPasteReady = ready
      try {
        if (!ready.check()) throw new Error('paste_map_cancelled')
        const originalId = chart.id
        chart.id = `paste-${props.suffixId}-${originalId}`
        const areaId = filterPasteAreaId(chart)
        const instance = await chartView.drawChart({
          chartObj: undefined,
          container: containerId,
          chart,
          areaId,
          action,
          scope,
          gadmName,
          filterPaste: ready
        })
        if (!ready.check()) {
          ready.dispose()
          throw new Error('paste_map_cancelled')
        }
        if (!instance) throw new Error('paste_map_instance_missing')
        mapPasteInstance = instance
        myChart = instance
        if (chartView.library === ChartLibraryType.L7) instance.render()
        await ready.ready
        if (!ready.check()) throw new Error('paste_map_cancelled')
        resolve()
      } catch (error) {
        ready.fail(error)
        reject(error)
      }
    }, 500)
  })
const prepareFilterPaste = async (
  input: PreparedQuery,
  binding: PasteBinding,
  isCurrent: () => boolean
): Promise<PasteReady> => {
  const library =
    input.kind === 'queried' &&
    chartViewManager.getChartView(input.response.render, input.response.type)?.library
  if (
    input.kind !== 'queried' ||
    ![ChartLibraryType.G2, ChartLibraryType.L7, ChartLibraryType.L7_PLOT].includes(library)
  ) {
    return { ok: false, reason: 'preparation_unavailable' }
  }
  filterPasteBinding.value = binding
  if (!canPrepareFilterPaste()) return { ok: false, reason: 'map_infrastructure_unavailable' }
  let alive = true
  pasteIsCurrent = () => alive && !chartComponentUnmounted && isCurrent()
  pasteInteractionAllowed = () =>
    alive && !chartComponentUnmounted && binding.current.value.phase === 'active'
  const dispose = () => {
    if (!alive) return
    alive = false
    g2RenderVersion++
    clearTimeout(mapTimer)
    releaseMapPreparation()
    clearTimeout(g2Timer)
    finishG2Schedule?.()
    clearG2ResizeSchedule()
    if (activeG2Scope) disposeActiveG2Scope()
    else {
      clearG2SliderAdapter()
      clearG2LegendPaginationAdapter()
      myChart?.destroy()
      myChart = null
    }
  }
  let timeout: ReturnType<typeof setTimeout>
  try {
    if (!pasteIsCurrent()) throw new Error('paste_cancelled')
    const response = cloneDeep(input.response)
    chartData.value = (response.data ?? { fields: [], data: [] }) as Partial<Chart['data']>
    // 候选不启动共享轮播；此非关键交互在后续普通重绘时按 canonical 配置恢复。
    const carousel = response.customAttr?.tooltip?.carousel
    if (carousel && typeof carousel === 'object') carousel.enable = false
    if (library !== ChartLibraryType.G2) {
      response.customAttr.tooltip.show = false
      const drill = response.drillFilters || []
      const extra = input.request.chartExtRequest?.drill?.[drill.length - 1]?.extra
      dynamicAreaId.value = extra?.adcode ? String(extra.adcode) : ''
      scope = extra?.scope
      gadmName = extra?.gadmName
    }
    isError.value = false
    await Promise.race([
      renderChart(response, undefined, false, true),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error('paste_render_timeout')),
          library === ChartLibraryType.G2 ? 10000 : 31000
        )
      })
    ])
    // renderPreparedMap resolve 后仍会跨越 renderChart/Promise.race 的微任务。
    assertMapPreparation()
    const node = document.getElementById(containerId)
    if (
      !pasteIsCurrent() ||
      !node?.isConnected ||
      node.getBoundingClientRect().width <= 1 ||
      node.getBoundingClientRect().height <= 1
    )
      throw new Error('paste_render_disconnected')
    const metadata = {
      kind: 'g2' as const,
      drillFilters: cloneDeep(response.drillFilters || []),
      originData: cloneDeep(chartData.value),
      publishOrigin: !response.drill && !response.chartExtRequest?.linkageFilters?.length
    }
    return {
      ok: true,
      handle: {
        key: props.suffixId,
        binding,
        instance: myChart,
        get metadata() {
          // 调用方 await 返回后、同步发布前读取 metadata 时再核已知失败。
          assertMapPreparation()
          return metadata
        },
        dispose
      }
    }
  } catch {
    dispose()
    return { ok: false, reason: 'paste_render_failed' }
  } finally {
    clearTimeout(timeout)
  }
}
defineExpose({
  canPrepareFilterPaste,
  prepareFilterPaste,
  calcData,
  renderChart,
  trackMenu,
  clearLinkage
})
let intersectionObserver
let resizeObserver
const TOLERANCE = 0.01
// 热力图的水平端点文字占位依赖容器宽度，resize 时重新生成图例配置
const RESIZE_MONITOR_CHARTS = ['map', 'bubble-map', 'flow-map', 'heat-map', 't-heatmap', 'gauge']
let g2ResizeTimer: number
let chartComponentUnmounted = false
onMounted(() => {
  const containerDom = document.getElementById(containerId)
  const { offsetWidth, offsetHeight } = containerDom
  const preSize = [offsetWidth, offsetHeight]
  resizeObserver = new ResizeObserver(([entry] = []) => {
    if (!isPasteActive()) return
    const [size] = entry.borderBoxSize || []
    const widthOffsetPercent = (size.inlineSize - preSize[0]) / preSize[0]
    const heightOffsetPercent = (size.blockSize - preSize[1]) / preSize[1]
    if (Math.abs(widthOffsetPercent) < TOLERANCE && Math.abs(heightOffsetPercent) < TOLERANCE) {
      return
    }
    const requiresFullRender = RESIZE_MONITOR_CHARTS.includes(view.value.type)
    const isNowVisible = size.inlineSize > 1 && size.blockSize > 1
    // 隐藏态取消待执行的尺寸调整，避免图表按零尺寸自适应
    if (!isNowVisible) {
      g2ResizeTimer && clearTimeout(g2ResizeTimer)
    }
    const canResizeRender = isNowVisible
    if (myChart && canResizeRender) {
      if (requiresFullRender) {
        renderChart(curView)
      } else {
        g2ResizeTimer && clearTimeout(g2ResizeTimer)
        const resizeVersion = activeG2Scope ? activeG2Version : g2RenderVersion
        const resizeScope = activeG2Scope
        const resizeInstance = resizeScope?.instance
        g2ResizeTimer = setTimeout(() => {
          G2TooltipCarousel.enqueueResize(containerId, async () => {
            const chartView = chartViewManager.getChartView(curView.render, curView.type)
            const chartInstance = resizeScope ? resizeInstance : myChart
            if (
              chartComponentUnmounted ||
              (resizeScope && !isActiveG2Scope(resizeVersion, resizeScope, resizeInstance)) ||
              chartView.library !== ChartLibraryType.G2 ||
              typeof chartInstance?.forceFit !== 'function'
            ) {
              return
            }

            // forceFit 完成后恢复 G2 联动选中态
            const legendContainer = document.getElementById(containerId)
            chartInstance.options(
              applyG2TiledLegend(
                chartInstance.options(),
                parseJson(view.value.customStyle)?.legend,
                legendContainer?.clientWidth || 1,
                legendContainer?.clientHeight || 1,
                (event, payload) => chartInstance.emit(event, payload),
                !isDashboard() || dvMainStore.canvasStyleData?.dashboard?.themeColor === 'dark'
                  ? 'dark'
                  : 'light'
              )
            )
            await chartInstance.forceFit()
            if (
              !chartComponentUnmounted &&
              chartInstance === myChart &&
              (!resizeScope || isActiveG2Scope(resizeVersion, resizeScope, resizeInstance))
            ) {
              replayG2TiledLegendSelection(chartInstance.options(), (event, payload) =>
                chartInstance.emit(event, payload)
              )
              replayLinkageActive()
            }
          })
        }, 300)
      }
    }
    preSize[0] = size.inlineSize
    preSize[1] = size.blockSize
  })
  resizeObserver.observe(containerDom)
  intersectionObserver = new IntersectionObserver(([entry]) => {
    if (!isPasteActive()) return
    if (RESIZE_MONITOR_CHARTS.includes(view.value.type)) {
      return
    }
    if (entry.intersectionRatio <= 0 && typeof myChart?.emit === 'function') {
      // L7 等非 G2 实例不保证提供 emit，离屏时只通知支持事件总线的图表
      myChart.emit('tooltip:hidden')
    }
  })
  intersectionObserver.observe(containerDom)
  if (!filterPasteBinding.value) useEmitt({ name: 'l7-prepare-picture', callback: preparePicture })
  if (!filterPasteBinding.value)
    useEmitt({ name: 'l7-unprepare-picture', callback: unPreparePicture })
})
const MAP_CHARTS = ['map', 'bubble-map', 'flow-map', 'heat-map', 'symbolic-map']
const onWheel = (e: WheelEvent) => {
  if (!MAP_CHARTS.includes(view.value.type)) {
    return
  }
  if (!props.active) {
    e.stopPropagation()
  }
}
onBeforeUnmount(() => {
  // 先同步失效，已开始的库 Promise 只能 settle，不能再发布或回放。
  chartComponentUnmounted = true
  releaseMapPreparation()
  clearTimeout(mapTimer)
  g2RenderVersion++
  const cleanup = (release: () => void) => {
    try {
      release()
    } catch (error) {
      reportG2CleanupErrors([error])
    }
  }
  try {
    cleanup(() => clearTimeout(g2Timer))
    cleanup(() => finishG2Schedule?.())
    cleanup(clearG2ResizeSchedule)
    if (activeG2Scope) {
      cleanup(disposeActiveG2Scope)
    } else {
      cleanup(() => G2TooltipCarousel.destroyByContainer(containerId))
      cleanup(clearG2SliderAdapter)
      cleanup(clearG2LegendPaginationAdapter)
      cleanup(() => myChart?.destroy())
    }
  } finally {
    cleanup(() => resizeObserver?.disconnect())
    cleanup(() => intersectionObserver?.disconnect())
  }
})
</script>

<template>
  <div class="canvas-area">
    <view-track-bar
      ref="viewTrack"
      :track-menu="trackMenu"
      :font-family="fontFamily"
      :is-data-v-mobile="dataVMobile"
      class="track-bar"
      :style="state.trackBarStyle"
      @trackClick="trackClick"
    />
    <div
      @wheel.capture="onWheel"
      v-if="!isError"
      ref="chartContainer"
      class="canvas-content"
      :id="containerId"
    ></div>
    <chart-error v-else :err-msg="errMsg" />
  </div>
</template>

<style lang="less" scoped>
.canvas-area {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 0;
  .canvas-content {
    position: relative;
    width: 100% !important;
    height: 100% !important;
    :deep(.g2-tooltip) {
      position: fixed !important;
    }
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip) {
      position: absolute !important;
      box-sizing: border-box;
      // 轮播与悬浮 tooltip 一致，按内容展开并受最大宽度限制
      width: max-content !important;
      min-width: var(--de-carousel-tooltip-min-width) !important;
      max-width: var(--de-carousel-tooltip-max-width) !important;
      max-height: var(--de-carousel-tooltip-max-height) !important;
      overflow: hidden !important;
      overflow-y: hidden !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none;
      transition: left 400ms cubic-bezier(0.22, 1, 0.36, 1),
        top 400ms cubic-bezier(0.22, 1, 0.36, 1) !important;
    }
    // 轮播 tooltip 高度由外层约束，同时禁用内部滚动并隐藏滚动条
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip-list) {
      box-sizing: border-box;
      // 与轮播外框共用逻辑宽度上限，覆盖模板按缩放后图表宽度设置的限制
      width: max-content;
      min-width: 0;
      max-width: max(0px, calc(var(--de-carousel-tooltip-max-width) - 24px)) !important;
      max-height: none !important;
      overflow-y: hidden !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none;
    }
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip::-webkit-scrollbar),
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip-list::-webkit-scrollbar) {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip-list-item) {
      box-sizing: border-box;
      flex-wrap: nowrap;
      // 每行填满列表，使不同长度的数值共享右边界
      width: auto;
      min-width: 0;
    }
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip-list-item-name) {
      // 名称优先收缩，但至少保留标记和一个可识别的省略片段
      flex: 1 9999 auto !important;
      min-width: calc(12px + 2em) !important;
      max-width: none !important;
      overflow: hidden;
    }
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip-list-item-marker) {
      flex: 0 0 auto;
    }
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip-list-item-name-label),
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip-list-item-value) {
      min-width: 0 !important;
      max-width: none !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
    }
    :deep([data-tooltip-display-mode='carousel'] .g2-tooltip-list-item-value) {
      flex: 0 1 auto !important;
      max-width: max(0px, calc(var(--de-carousel-tooltip-max-width) - 48px - 2em)) !important;
      margin-left: 12px !important;
    }
  }
}
</style>

<style lang="less">
// Keep legend scrollbars visible even when the surrounding canvas hides its own scrollbars.
.dataease-tiled-legend {
  // Standard non-auto colors override WebKit scrollbar styling on Chromium (including overlay mode).
  @supports selector(::-webkit-scrollbar) {
    scrollbar-color: auto !important;
  }
  &::-webkit-scrollbar {
    display: block !important;
    width: 8px !important;
    height: 8px !important;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--legend-scroll-thumb);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
}

div[id^='G2-TOOLTIP-WRAPPER-'] .g2-tooltip {
  // 只收紧垂直留白，水平内边距保持 G2 原有值
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

// 独立图表可能只设置字号，避免继承固定行高而裁切文字。
div[id^='G2-TOOLTIP-WRAPPER-'] .g2-tooltip-title,
div[id^='G2-TOOLTIP-WRAPPER-'] .g2-tooltip-list-item-name-label,
div[id^='G2-TOOLTIP-WRAPPER-'] .g2-tooltip-list-item-value {
  line-height: normal !important;
}

div[id^='G2-TOOLTIP-WRAPPER-'] .g2-tooltip:has(> .g2-tooltip-list:empty) {
  // 根据最终 DOM 识别空列表，无指标时进一步减少上下留白
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

div[id^='G2-TOOLTIP-WRAPPER-'] .g2-tooltip:has(> .g2-tooltip-list:not(:empty)) > .g2-tooltip-title {
  // 仅在存在指标内容时拉开标题与列表的层次
  margin-bottom: 8px;
}

div[id^='G2-TOOLTIP-WRAPPER-'] .g2-tooltip-list-item + .g2-tooltip-list-item,
div[id^='G2-TOOLTIP-WRAPPER-'] .g2-tooltip-list-group-title + .g2-tooltip-list-item {
  // 相邻指标及分组标题后的首条指标统一保留间距
  margin-top: 6px;
}

div[id^='G2-TOOLTIP-WRAPPER-'][data-tooltip-display-mode='hover']
  .g2-tooltip:not([data-de-tooltip-position-ready='true']) {
  // 仅首次定位禁用位移过渡，稳定后恢复 AntV 的平滑跟随
  transition: visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) !important;
}

div[id^='G2-TOOLTIP-WRAPPER-'][data-tooltip-display-mode='hover'] {
  // 悬浮 tooltip 按真实内容伸缩，长数值优先完整展示并保留移动端边界
  .g2-tooltip {
    box-sizing: border-box;
    width: max-content !important;
    min-width: 0 !important;
    max-width: min(33.333333vw, calc(100vw - 24px)) !important;
    max-height: min(480px, 60vh) !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior: contain;
  }

  .g2-tooltip-list {
    box-sizing: border-box;
    // 子列表按真实内容参与 tooltip 的 max-content 计算，不回落到图表内的可用宽度
    width: max-content;
    min-width: 0;
    max-width: max(0px, calc(var(--de-hover-tooltip-max-width, 33.333333vw) - 24px)) !important;
    max-height: none !important;
  }

  .g2-tooltip-title {
    white-space: normal !important;
    overflow-wrap: anywhere;
  }

  // 指标名称和数值保持单行，超出可用宽度时省略
  .g2-tooltip-list-item {
    flex-wrap: nowrap;
    align-items: baseline !important;
    box-sizing: border-box;
    // 填满列表可用宽度，使各行数值共享右边界，列表仍按内容自适应
    width: auto;
    min-width: 0;
    max-width: max(0px, calc(var(--de-hover-tooltip-max-width, 33.333333vw) - 24px));
  }

  .g2-tooltip-list-item-name {
    // 名称容器以文字提供基线，避免首个色点参与行基线计算。
    align-items: baseline !important;
    // 名称优先收缩，同时保留色点和可识别的名称片段
    flex: 1 9999 auto !important;
    min-width: calc(12px + 2em) !important;
    max-width: none !important;
    overflow: hidden !important;
  }

  .g2-tooltip-list-item-marker {
    flex: 0 0 auto;
    align-self: center;
  }

  .g2-tooltip-list-item-name-label {
    min-width: 0 !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    text-align: left;
  }

  .g2-tooltip-list-item-value {
    flex: 0 1 auto !important;
    min-width: 0 !important;
    max-width: max(
      0px,
      calc(var(--de-hover-tooltip-max-width, 33.333333vw) - 48px - 2em)
    ) !important;
    margin-left: 12px !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    text-align: right;
  }
}

@media (max-width: 768px) {
  div[id^='G2-TOOLTIP-WRAPPER-'][data-tooltip-display-mode='hover'] .g2-tooltip {
    // 移动端按内容展开到整屏宽度，保留左右安全间距
    max-width: calc(100vw - 24px) !important;
  }
}

@supports (width: 100dvw) {
  div[id^='G2-TOOLTIP-WRAPPER-'][data-tooltip-display-mode='hover'] .g2-tooltip {
    min-width: 0 !important;
    max-width: min(
      33.333333dvw,
      calc(100dvw - 24px - env(safe-area-inset-left) - env(safe-area-inset-right))
    ) !important;
    max-height: min(480px, 60dvh) !important;
  }

  @media (max-width: 768px) {
    div[id^='G2-TOOLTIP-WRAPPER-'][data-tooltip-display-mode='hover'] .g2-tooltip {
      max-width: calc(
        100dvw - 24px - env(safe-area-inset-left) - env(safe-area-inset-right)
      ) !important;
    }
  }
}
</style>
