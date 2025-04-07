/*
 * MIT License
 *
 * Copyright (c) 2025 Maverick Young
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { onBeforeUnmount, onDeactivated, onMounted, Ref, shallowRef, unref } from 'vue'
import echarts from './echarts'

export type EChartsCoreOption = echarts.EChartsCoreOption

const useEcharts = (elRef: Ref<HTMLDivElement>, options: EChartsCoreOption) => {
	const charts = shallowRef<echarts.ECharts>()

	const setOptions = (options: EChartsCoreOption) => {
		charts.value && charts.value.setOption(options)
	}

	// 初始化
	const initCharts = (isLight: boolean, themeColor?: Array<string>) => {
		const el = unref(elRef)
		if (!el || !unref(el)) {
			return
		}
		isLight ? (charts.value = echarts.init(el)) : (charts.value = echarts.init(el, 'dark'))
		if (themeColor) {
			options.color = themeColor
		}
		setOptions(options)
	}

	// 重新窗口变化时，重新计算
	const resize = () => {
		charts.value && charts.value.resize()
	}

	onMounted(() => {
		window.addEventListener('resize', resize)
	})

	// 页面keepAlive时，不监听页面
	onDeactivated(() => {
		window.removeEventListener('resize', resize)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', resize)
	})

	return {
		initCharts,
		setOptions,
		resize
	}
}

export { useEcharts }
