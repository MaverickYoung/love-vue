<!--
  - MIT License
  -
  - Copyright (c) 2025 Maverick Young
  -
  - Permission is hereby granted, free of charge, to any person obtaining a copy
  - of this software and associated documentation files (the "Software"), to deal
  - in the Software without restriction, including without limitation the rights
  - to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  - copies of the Software, and to permit persons to whom the Software is
  - furnished to do so, subject to the following conditions:
  -
  - The above copyright notice and this permission notice shall be included in all
  - copies or substantial portions of the Software.
  -
  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  - IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  - FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  - AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  - LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  - OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  - SOFTWARE.
  -->

<template>
	<div
		ref="echartsRef"
		:style="{
			width: width,
			height: height
		}" />
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref, watch } from 'vue'
import { EChartsCoreOption, useEcharts } from './useEcharts'
import { useAppStore } from '@/store/app' // 引入hooks

const props = defineProps({
	options: { type: Object as PropType<EChartsCoreOption>, required: true },
	height: { type: String, default: '100%' },
	width: { type: String, default: '100%' },
	themeColors: { type: Array as PropType<string[]>, default: () => [] }
})

const echartsRef = ref()

const { setOptions, initCharts } = useEcharts(echartsRef, props.options)

watch(
	() => props.options,
	nVal => {
		let targetOptions: EChartsCoreOption
		if (props.themeColors && props.themeColors.length > 0) {
			targetOptions = { ...nVal }
			targetOptions.color = props.themeColors
		} else {
			targetOptions = { ...nVal }
		}
		setOptions(targetOptions)
	}
)

const appStore = useAppStore()

onMounted(() => {
	initCharts(appStore.getIsLight)
})
</script>
