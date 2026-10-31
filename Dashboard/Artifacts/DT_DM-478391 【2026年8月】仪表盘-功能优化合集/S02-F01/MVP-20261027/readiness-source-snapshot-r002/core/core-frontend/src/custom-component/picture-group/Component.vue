<template>
  <div ref="pictureRoot" class="pic-main">
    <chart-error v-if="isError" :err-msg="errMsg" />
    <img
      ref="pictureImage"
      draggable="false"
      v-else-if="state.showUrl"
      :style="imageAdapter"
      :src="isPasteCandidate ? candidateImageSrc : imgUrlTrans(state.showUrl)"
    />
    <template v-else>
      <chart-empty-info :view-icon="view.type"></chart-empty-info>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  CSSProperties,
  computed,
  nextTick,
  toRefs,
  reactive,
  ref,
  PropType,
  watch,
  onBeforeMount,
  onBeforeUnmount
} from 'vue'
import { imgUrlTrans } from '@/utils/imgUtils'
import { waitForResourceImages } from '@/utils/resourceImageCache'
import eventBus from '@/utils/eventBus'
import { dvMainStoreWithOut } from '@/store/modules/data-visualization/dvMain'
import { getData } from '@/api/chart'
import { parseJson } from '@/views/chart/components/js/util'
import { mappingColorCustom } from '@/views/chart/components/js/panel/common/common_table'
import { storeToRefs } from 'pinia'
import ChartEmptyInfo from '@/views/chart/components/views/components/ChartEmptyInfo.vue'
import ChartError from '@/views/chart/components/views/components/ChartError.vue'
import { deepCopy } from '@/utils/utils'
import { cloneDeep } from 'lodash-es'
import type {
  PasteBinding,
  PreparedQuery,
  PasteReady
} from '@/custom-component/filter-copy/mvp-chart-filter-paste'
const dvMainStore = dvMainStoreWithOut()
const { canvasViewInfo, mobileInPc, fullscreenFlag } = storeToRefs(dvMainStore)
const state = reactive({
  emptyValue: '-',
  data: null,
  viewDataInfo: null,
  totalItems: 0,
  showUrl: null,
  firstRender: true,
  previewFirstRender: true,
  curImgList: []
})
const initReady = ref(true)
const props = defineProps({
  pasteBinding: { type: Object as PropType<PasteBinding>, required: false },
  suffixId: { type: String, default: 'common' },
  element: {
    type: Object,
    default() {
      return {
        propValue: { urlList: [] }
      }
    }
  },
  showPosition: {
    required: false,
    type: String,
    default: 'preview'
  },
  // 仪表板刷新计时器
  searchCount: {
    type: Number,
    required: false,
    default: 0
  },
  view: {
    type: Object as PropType<ChartObj>,
    default() {
      return {
        propValue: null
      }
    }
  }
})
const isError = ref(false)
const errMsg = ref('')
const dataRowSelect = ref({})
const dataRowNameSelect = ref({})
const dataRowFiledName = ref([])
let carouselTimer = null
const { showPosition } = toRefs(props)
const view = computed(() => props.pasteBinding?.current.value.view || props.view)
const element = computed(
  () => (props.pasteBinding?.current.value.element || props.element) as typeof props.element
)
const isPasteCandidate = computed(() => props.pasteBinding?.current.value.phase === 'candidate')
const pictureRoot = ref<HTMLElement>()
const pictureImage = ref<HTMLImageElement>()
const candidateImageSrc = ref<string>()
let pictureAlive = true
let cancelImageWait: (() => void) | null = null
let innerRefreshTimer = null
let innerSearchCount = 0
const isEditMode = computed(
  () => showPosition.value.includes('canvas') && !mobileInPc.value && !fullscreenFlag.value
)

watch([() => props.searchCount], () => {
  // 内部计时器启动 忽略外部计时器
  if (!isPasteCandidate.value && !innerRefreshTimer) {
    calcData(view.value, () => {
      // do searchCount
    })
  }
})

// 编辑状态下 不启动刷新
const buildInnerRefreshTimer = (
  refreshViewEnable = false,
  refreshUnit = 'minute',
  refreshTime = 5
) => {
  if (
    !isPasteCandidate.value &&
    pictureAlive &&
    showPosition.value === 'preview' &&
    !innerRefreshTimer &&
    refreshViewEnable
  ) {
    innerRefreshTimer && clearInterval(innerRefreshTimer)
    const timerRefreshTime = refreshUnit === 'second' ? refreshTime * 1000 : refreshTime * 60000
    innerRefreshTimer = setInterval(() => {
      if (!pictureAlive || isPasteCandidate.value) return
      calcData(view.value, () => {
        // do innerRefreshTimer
      })
      innerSearchCount++
    }, timerRefreshTime)
  }
}

watch(
  () => isEditMode.value,
  () => {
    initCarousel()
  }
)

const initCarousel = () => {
  carouselTimer && clearInterval(carouselTimer)
  carouselTimer = null
  if (isPasteCandidate.value || !pictureAlive) return
  const picLength = element.value.propValue.urlList?.length || 0
  const { threshold } = parseJson(view.value.senior)
  // 非编辑状态 未启用条件样式 存在图片 启用轮播
  if (!isEditMode.value && !threshold.enable && picLength > 0 && element.value.carousel?.enable) {
    const switchTime = (element.value.carousel.time || 5) * 1000
    let switchCount = 1
    // 轮播定时器
    carouselTimer = setInterval(() => {
      const nowIndex = switchCount % element.value.propValue.urlList.length
      switchCount++
      nextTick(() => {
        if (!pictureAlive || isPasteCandidate.value) return
        state.showUrl = element.value.propValue.urlList[nowIndex].url
      })
    }, switchTime)
  }
}

const imageAdapter = computed(() => {
  const style = {
    position: 'relative',
    width: '100%',
    height: '100%'
  }
  if (element.value.style.adaptation === 'original') {
    style.width = 'auto'
    style.height = 'auto'
  } else if (element.value.style.adaptation === 'equiratio') {
    style.height = 'auto'
  }
  return style as CSSProperties
})

const uploadImg = () => {
  if (isPasteCandidate.value) return
  nextTick(() => {
    eventBus.emit('uploadImg')
  })
}

const initCurFields = chartDetails => {
  dataRowFiledName.value = []
  dataRowSelect.value = {}
  dataRowNameSelect.value = {}
  if (chartDetails.data && chartDetails.data.sourceFields) {
    const checkAllAxisStr =
      JSON.stringify(chartDetails.xAxis) +
      JSON.stringify(chartDetails.xAxisExt) +
      JSON.stringify(chartDetails.yAxis) +
      JSON.stringify(chartDetails.yAxisExt)
    chartDetails.data.sourceFields.forEach(field => {
      if (checkAllAxisStr.indexOf(field.id) > -1) {
        dataRowFiledName.value.push(`[${field.name}]`)
      }
    })
    if (checkAllAxisStr.indexOf('"记录数*"') > -1) {
      dataRowFiledName.value.push(`[记录数*]`)
    }
    const sourceFieldNameIdMap = chartDetails.data.fields.reduce((pre, next) => {
      pre[next['dataeaseName']] = next['name']
      return pre
    }, {})
    const rowData = chartDetails.data.tableRow[0]
    for (const key in rowData) {
      dataRowNameSelect.value[sourceFieldNameIdMap[key]] = rowData[key]
    }
  }
  conditionAdaptor(view.value)
}

const conditionAdaptor = (chart: Chart) => {
  state.showUrl = null
  if (!chart || !chart.senior) {
    return
  }
  const { threshold } = parseJson(chart.senior)
  if (!threshold.enable) {
    return
  }
  const conditions = threshold.tableThreshold ?? []
  if (conditions?.length > 0) {
    for (let i = 0; i < conditions.length; i++) {
      const field = deepCopy(conditions[i])
      let defaultValueColor = null
      field.conditions.sort((a, b) => {
        const aIsDefault = a.term === 'default'
        const bIsDefault = b.term === 'default'

        if (aIsDefault && !bIsDefault) return 1
        if (!aIsDefault && bIsDefault) return -1
        return 0
      })
      const checkResult = mappingColorCustom(
        dataRowNameSelect.value[field.field.name],
        defaultValueColor,
        field,
        'url'
      ).color
      if (checkResult) {
        state.showUrl = checkResult
      }
    }
  }
}

const withInit = () => {
  if (element.value.propValue['urlList'] && element.value.propValue['urlList'].length > 0) {
    state.showUrl = element.value.propValue['urlList'][0].url
  } else {
    state.showUrl = null
  }

  initCarousel()
}

const calcData = (viewCalc: Chart, callback) => {
  if (isPasteCandidate.value || !pictureAlive) {
    callback?.()
    return
  }
  isError.value = false
  const { threshold } = parseJson(viewCalc.senior)
  if (!threshold.enable) {
    withInit()
    callback?.()
    return
  }
  if (viewCalc.tableId || viewCalc['dataFrom'] === 'template') {
    const v = JSON.parse(JSON.stringify(viewCalc))
    v.type = 'table-info'
    v.render = 'antv'
    v.resultCount = 1
    getData(v)
      .then(res => {
        if (res.code && res.code !== 0) {
          isError.value = true
          errMsg.value = res.msg
        } else {
          res.type = 'picture-group'
          res.render = 'custom'
          state.data = res?.data
          state.viewDataInfo = res
          state.totalItems = res?.totalItems
          const curViewInfo = canvasViewInfo.value[element.value.id]
          curViewInfo['curFields'] = res.data.fields
          dvMainStore.setViewDataDetails(element.value.id, res)
          initReady.value = true
          initCurFields(res)
          initCarousel()
        }
        callback?.()
        nextTick(() => {
          initReady.value = true
        })
      })
      .catch(e => {
        console.error(e)
        nextTick(() => {
          initReady.value = true
        })
        callback?.()
      })
  } else if (!viewCalc.tableId) {
    initReady.value = true
    withInit()
    callback?.()
    nextTick(() => {
      initReady.value = true
    })
  } else {
    withInit()
    nextTick(() => {
      initReady.value = true
    })
    callback?.()
  }
}

// 初始化此处不必刷新
const renderChart = viewInfo => {
  //do renderView
}

onBeforeMount(() => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
  if (!isPasteCandidate.value) buildInnerRefreshTimer()
})

const waitForPreparedImage = (isCurrent: () => boolean) =>
  new Promise<boolean>(resolve => {
    const image = pictureImage.value
    const root = pictureRoot.value
    const sourceUrl = state.showUrl
    if (!image || !root || !sourceUrl || typeof image.decode !== 'function') {
      resolve(false)
      return
    }
    let settled = false
    let decoding = false
    let resourceReady = false
    let expectedSrc = ''
    const deadline = performance.now() + 10000
    const current = () =>
      !settled &&
      performance.now() < deadline &&
      pictureAlive &&
      isCurrent() &&
      pictureImage.value === image &&
      pictureRoot.value === root &&
      state.showUrl === sourceUrl &&
      image.isConnected &&
      root.isConnected
    const finish = (ok: boolean) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      image.removeEventListener('load', loaded)
      image.removeEventListener('error', failed)
      cancelImageWait = null
      resolve(ok)
    }
    const failed = () => finish(false)
    const finalImageCurrent = () =>
      current() &&
      image.getAttribute('src') === expectedSrc &&
      imgUrlTrans(sourceUrl) === expectedSrc &&
      image.complete &&
      image.naturalWidth > 0
    const loaded = async () => {
      if (settled || decoding || !resourceReady) return
      if (!finalImageCurrent()) {
        finish(false)
        return
      }
      decoding = true
      try {
        await image.decode()
        finish(finalImageCurrent())
      } catch {
        finish(false)
      }
    }
    image.addEventListener('load', loaded)
    image.addEventListener('error', failed)
    const timer = setTimeout(failed, 10000)
    cancelImageWait = failed
    // 缓存地址可能在 DOM patch 和资源扫描之间变化，稳定前不能解码占位图。
    const prepareResource = async () => {
      try {
        while (current()) {
          expectedSrc = imgUrlTrans(sourceUrl)
          if (!current() || !expectedSrc) break
          candidateImageSrc.value = expectedSrc
          await nextTick()
          if (!current()) break
          await waitForResourceImages(root)
          if (!current()) break
          if (imgUrlTrans(sourceUrl) !== expectedSrc) continue
          resourceReady = true
          // 最终 load 可能已经在门关闭时到达，主动检查缓存命中图片。
          if (image.complete && image.naturalWidth > 0) void loaded()
          return
        }
        finish(false)
      } catch {
        finish(false)
      }
    }
    void prepareResource()
  })
const prepareFilterPaste = async (
  input: PreparedQuery,
  binding: PasteBinding,
  isCurrent: () => boolean
): Promise<PasteReady> => {
  if (!pictureAlive || props.pasteBinding !== binding || !isPasteCandidate.value || !isCurrent())
    return { ok: false, reason: 'paste_stale' }
  try {
    const queried = input.kind === 'queried'
    if (queried) {
      const response = cloneDeep(input.response)
      if (response.type !== 'picture-group' || response.render !== 'custom')
        return { ok: false, reason: 'paste_response_invalid' }
      state.data = response.data
      state.viewDataInfo = response
      state.totalItems = response.totalItems
      initCurFields(response)
    } else withInit()
    await nextTick()
    if (!pictureAlive || !isCurrent() || !pictureRoot.value?.isConnected)
      return { ok: false, reason: 'paste_stale' }
    if (state.showUrl && !(await waitForPreparedImage(isCurrent)))
      return { ok: false, reason: 'paste_render_failed' }
    if (!pictureAlive || !isCurrent()) return { ok: false, reason: 'paste_stale' }
    let disposed = false
    return {
      ok: true,
      handle: {
        key: props.suffixId,
        binding,
        instance: null,
        metadata: {
          kind: 'picture-group',
          drillFilters: [],
          queried,
          ...(input.kind === 'queried'
            ? { fields: cloneDeep(input.response.data?.fields || []) }
            : {})
        },
        dispose() {
          if (disposed) return
          disposed = true
          pictureAlive = false
          cancelImageWait?.()
          if (carouselTimer) clearInterval(carouselTimer)
          if (innerRefreshTimer) clearInterval(innerRefreshTimer)
        }
      }
    }
  } catch {
    return { ok: false, reason: 'paste_render_failed' }
  }
}
watch(isPasteCandidate, candidate => {
  if (!candidate && pictureAlive) {
    initCarousel()
    buildInnerRefreshTimer(
      view.value.refreshViewEnable,
      view.value.refreshUnit,
      view.value.refreshTime
    )
  }
})
onBeforeUnmount(() => {
  pictureAlive = false
  cancelImageWait?.()
  if (carouselTimer) clearInterval(carouselTimer)
  if (innerRefreshTimer) clearInterval(innerRefreshTimer)
})

defineExpose({
  calcData,
  renderChart,
  prepareFilterPaste
})
</script>

<style lang="less" scoped>
.pic-main {
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.pic-upload {
  display: flex;
  width: 100%;
  height: 100%;
  color: #5370af;
  align-items: center;
  justify-content: center;
}
</style>
