<script setup lang="ts">
import { computed, onBeforeUnmount, onErrorCaptured, ref, type PropType } from 'vue'
import ChartComponentG2Plot from './ChartComponentG2Plot.vue'
import ChartComponentS2 from './ChartComponentS2.vue'
import DeIndicator from '@/custom-component/indicator/DeIndicator.vue'
import chartViewManager from '@/views/chart/components/js/panel'
import type {
  PasteBinding,
  PreparedQuery,
  PasteReady,
  FilterPasteRendererPublic
} from '@/custom-component/filter-copy/mvp-chart-filter-paste'

const props = defineProps({
  binding: { type: Object as PropType<PasteBinding>, required: true },
  suffixId: { type: String, required: true },
  scale: { type: Number, default: 1 },
  showPosition: { type: String, default: 'canvas' },
  fontFamily: { type: String, default: 'inherit' },
  themes: { type: String, default: 'light' },
  commonParams: { type: Object, default: undefined },
  active: { type: Boolean, default: false },
  drillLength: { type: Number, default: 0 }
})
const emit = defineEmits([
  'onChartClick',
  'onPointClick',
  'onDrillFilters',
  'onJumpClick',
  'onComponentEvent',
  'resetLoading'
])
const component = ref<FilterPasteRendererPublic>()
const inputs = computed(() => props.binding.current.value)
const renderer = computed(() => {
  const library = chartViewManager.getChartView(
    inputs.value.view.render,
    inputs.value.view.type
  )?.library
  return library === 'g2'
    ? ChartComponentG2Plot
    : library === 's2'
    ? ChartComponentS2
    : library === 'indicator'
    ? DeIndicator
    : null
})
let alive = true
let renderError = false
let rejectRender: (() => void) | null = null
onErrorCaptured(() => {
  if (inputs.value.phase === 'active') return
  renderError = true
  rejectRender?.()
  return false
})
const forward = (name, ...args) => {
  if (alive && inputs.value.phase === 'active') emit(name, ...args)
}
const prepareFilterPaste: FilterPasteRendererPublic['prepareFilterPaste'] = async (
  input: PreparedQuery,
  binding: PasteBinding,
  isCurrent
): Promise<PasteReady> => {
  if (renderError) return { ok: false, reason: 'paste_render_failed' }
  if (!alive || !renderer.value || !component.value?.prepareFilterPaste)
    return { ok: false, reason: 'preparation_unavailable' }
  let timer
  let abandoned = false
  const failure = new Promise<PasteReady>(resolve => {
    rejectRender = () => resolve({ ok: false, reason: 'paste_render_failed' })
    timer = setTimeout(() => resolve({ ok: false, reason: 'paste_timeout' }), 12000)
  })
  try {
    const preparation = component.value
      .prepareFilterPaste(input, binding, () => alive && !renderError && isCurrent())
      .then(result => {
        if (result.ok === true && (abandoned || renderError || !alive || !isCurrent())) {
          result.handle.dispose()
          return { ok: false as const, reason: 'paste_render_failed' }
        }
        return result
      })
    const result = await Promise.race([preparation, failure])
    if (result.ok !== true) abandoned = true
    if (renderError || !alive || !isCurrent()) {
      if (result.ok === true) result.handle.dispose()
      return { ok: false, reason: 'paste_render_failed' }
    }
    return result
  } catch {
    return { ok: false, reason: 'paste_render_failed' }
  } finally {
    clearTimeout(timer)
    rejectRender = null
  }
}
onBeforeUnmount(() => {
  alive = false
  rejectRender?.()
})
defineExpose({ component, prepareFilterPaste })
</script>

<template>
  <component
    :is="renderer"
    v-if="renderer"
    ref="component"
    :paste-binding="binding"
    :view="inputs.view"
    :element="inputs.element"
    :suffix-id="suffixId"
    :scale="scale"
    :show-position="showPosition"
    :font-family="fontFamily"
    :themes="themes"
    :common-params="commonParams"
    :active="active"
    :drill-length="drillLength"
    @onChartClick="(...args) => forward('onChartClick', ...args)"
    @onPointClick="(...args) => forward('onPointClick', ...args)"
    @onDrillFilters="(...args) => forward('onDrillFilters', ...args)"
    @onJumpClick="(...args) => forward('onJumpClick', ...args)"
    @onComponentEvent="(...args) => forward('onComponentEvent', ...args)"
    @resetLoading="(...args) => forward('resetLoading', ...args)"
  />
</template>
