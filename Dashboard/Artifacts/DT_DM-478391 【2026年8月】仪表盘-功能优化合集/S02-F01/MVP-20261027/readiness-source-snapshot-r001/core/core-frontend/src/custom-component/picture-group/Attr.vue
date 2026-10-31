<script setup lang="ts">
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import { dvMainStoreWithOut } from '@/store/modules/data-visualization/dvMain'

import { storeToRefs } from 'pinia'
import { computed, PropType } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useChartFilterCopyMvp } from '@/views/chart/components/editor/filter/useChartFilterCopyMvp'
import PictureGroupUploadAttr from '@/custom-component/picture-group/PictureGroupUploadAttr.vue'
import PictureGroupDatasetSelect from '@/custom-component/picture-group/PictureGroupDatasetSelect.vue'
import CarouselSetting from '@/custom-component/common/CarouselSetting.vue'
import PictureGroupThreshold from '@/custom-component/picture-group/PictureGroupThreshold.vue'

const props = defineProps({
  themes: {
    type: String as PropType<EditorTheme>,
    default: 'dark'
  }
})

const dvMainStore = dvMainStoreWithOut()

const { curComponent, canvasViewInfo, mobileInPc, batchOptStatus } = storeToRefs(dvMainStore)
const { t } = useI18n()
const pictureView = computed(() => canvasViewInfo.value[curComponent.value?.id] as ChartObj)
const filterCopyMvp = useChartFilterCopyMvp(pictureView)
const { visible, enabled, permission, copyReason, pasteReason, status, diagnostic } = filterCopyMvp
</script>

<template>
  <div class="attr-list de-collapse-style">
    <CommonAttr
      :themes="themes"
      :element="curComponent"
      :background-color-picker-width="197"
      :background-border-select-width="197"
    >
      <picture-group-upload-attr
        :themes="themes"
        :element="curComponent"
        :view="canvasViewInfo[curComponent ? curComponent.id : 'default']"
        v-if="!mobileInPc && !batchOptStatus"
      ></picture-group-upload-attr>
      <template v-slot:carousel v-if="!mobileInPc">
        <carousel-setting
          v-if="curComponent?.innerType === 'picture-group'"
          :element="curComponent"
          :themes="themes"
        ></carousel-setting>
      </template>
      <template v-slot:threshold v-if="!mobileInPc">
        <picture-group-threshold
          :themes="themes"
          :element="curComponent"
          :view="canvasViewInfo[curComponent ? curComponent.id : 'default']"
        >
          <template v-slot:dataset>
            <picture-group-dataset-select
              :themes="themes"
              :view="canvasViewInfo[curComponent ? curComponent.id : 'default']"
            >
            </picture-group-dataset-select>
          </template>
        </picture-group-threshold>
      </template>
    </CommonAttr>
    <section v-if="visible && !batchOptStatus" data-testid="picture-filter-copy-controls">
      <el-button
        data-testid="chart-filter-copy"
        :aria-label="t('chart.filter_copy_mvp.copy')"
        :disabled="!!copyReason"
        @click="filterCopyMvp.copy"
        >{{ t('chart.filter_copy_mvp.copy') }}</el-button
      >
      <el-button
        data-testid="chart-filter-paste"
        :aria-label="t('chart.filter_copy_mvp.paste')"
        :disabled="!!pasteReason"
        @click="filterCopyMvp.paste"
        >{{ t('chart.filter_copy_mvp.paste') }}</el-button
      >
      <p v-if="copyReason" data-testid="chart-filter-copy-reason">
        {{ t('chart.filter_copy_mvp.' + copyReason) }}
      </p>
      <p v-if="pasteReason" data-testid="chart-filter-paste-reason">
        {{ t('chart.filter_copy_mvp.' + pasteReason) }}
      </p>
      <label v-if="enabled">
        {{ t('chart.filter_copy_mvp.permission_stub') }}
        <select v-model="permission" data-testid="chart-filter-permission">
          <option value="unknown">{{ t('chart.filter_copy_mvp.permission_unknown') }}</option>
          <option value="allow">{{ t('chart.filter_copy_mvp.allow') }}</option>
          <option value="deny">{{ t('chart.filter_copy_mvp.permission_denied') }}</option>
        </select>
      </label>
      <p v-if="status" role="status" data-testid="chart-filter-copy-status">
        {{ t('chart.filter_copy_mvp.' + status) }}
      </p>
      <details v-if="enabled" data-testid="chart-filter-copy-diagnostic">
        <summary>{{ t('chart.filter_copy_mvp.diagnostic') }}</summary>
        <pre>{{ diagnostic }}</pre>
      </details>
    </section>
  </div>
</template>

<style lang="less" scoped>
.de-collapse-style {
  :deep(.ed-collapse-item__header) {
    height: 36px !important;
    line-height: 36px !important;
    font-size: 12px !important;
    padding: 0 !important;
    font-weight: 500 !important;

    .ed-collapse-item__arrow {
      margin: 0 6px 0 8px;
    }
  }
  :deep(.ed-form-item) {
    display: block;
    margin-bottom: 8px;
  }
  :deep(.ed-form-item__label) {
    justify-content: flex-start;
  }
}
</style>
