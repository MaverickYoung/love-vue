<template>
  <div
    ref="echartsRef"
    :style="{
      width: width,
      height: height,
    }"
  />
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref, watch } from 'vue';
import { EChartsCoreOption, useEcharts } from './useEcharts';
import { useAppStore } from '@/store/app'; // 引入hooks

const props = defineProps({
  options: { type: Object as PropType<EChartsCoreOption>, required: true },
  height: { type: String, default: '100%' },
  width: { type: String, default: '100%' },
  themeColors: { type: Array as PropType<string[]>, default: () => [] }
});

const echartsRef = ref();

const { setOptions, initCharts } = useEcharts(echartsRef, props.options);

watch(
  () => props.options,
  (nVal) => {
    let targetOptions: EChartsCoreOption;
    if (props.themeColors && props.themeColors.length > 0) {
      targetOptions = { ...nVal };
      targetOptions.color = props.themeColors;
    } else {
      targetOptions = { ...nVal };
    }
    setOptions(targetOptions);
  }
);

const appStore = useAppStore();

onMounted(() => {
  initCharts(appStore.getIsLight);
});
</script>
