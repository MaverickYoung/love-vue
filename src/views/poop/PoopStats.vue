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
	<div class="poop-stats-container">
		<base-chart :options="chartOptions" height="400px" width="250px" />
	</div>
</template>

<script lang="ts" setup>
import BaseChart from '@/components/echarts/BaseChart.vue';
import { onMounted, ref } from 'vue';
import { useLogListApi } from '@/api/poop/log';
import { usePoopStore } from '@/store/poop';
import { EChartsOption } from 'echarts';

interface StatsItem {
	month: string;
	userId: number;
	nickname: string;
	poopType: number;
	poopCount: number;
}

const statsList = ref<StatsItem[]>();

const statsData = {
	months: new Set<string>(),
	users: new Map<number, string>(),
	poopTypes: new Set<number>()
};

const chartOptions = ref<EChartsOption>({});

const getData = async (start?: string, end?: string) => {
	const { data } = await useLogListApi(start, end);
	statsList.value = data;

	// 数据收集和初始化
	statsData.months.clear();
	statsData.users.clear();
	statsData.poopTypes.clear();

	statsList.value?.forEach(item => {
		statsData.months.add(item.month);
		statsData.poopTypes.add(item.poopType);
		if (!statsData.users.has(item.userId)) {
			statsData.users.set(item.userId, item.nickname || `用户 ${item.userId}`);
		}
	});

	// 更新图表选项
	updateChartOptions();
};

const updateChartOptions = () => {
	const poops = usePoopStore().poops;

	// 数据预处理
	const { months, users, poopTypes } = statsData;
	const poopTypeMap = new Map<number, string>();
	const statsByUserAndMonth = new Map<number, Map<string, Map<number, number>>>();

	statsList.value?.forEach(item => {
		// 初始化便便类型映射
		if (!poopTypeMap.has(item.poopType)) {
			const poopName = poops.get(item.poopType)?.name ?? `便便 ${item.poopType}`;
			poopTypeMap.set(item.poopType, poopName);
		}

		// 分类统计数据
		// 当前用户的统计数据
		const userStats = statsByUserAndMonth.get(item.userId) || new Map();
		// 当前用户、当前月份的统计数据
		const monthStats = userStats.get(item.month) || new Map();
		monthStats.set(item.poopType, item.poopCount);
		userStats.set(item.month, monthStats);
		statsByUserAndMonth.set(item.userId, userStats);
	});

	// 图表选项
	chartOptions.value = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'shadow' }
		},
		grid: {
			top: '10%',
			left: '3%',
			right: '3%',
			bottom: '2%',
			containLabel: true
		},
		legend: {
			itemWidth: 14,
			itemHeight: 14,
			data: Array.from(users.values()).flatMap(user =>
				Array.from(poopTypes).map(poopType => `${user} - ${poopTypeMap.get(poopType)}`)
			),
			type: 'scroll',
			formatter: name => (name.length > 15 ? `${name.substring(0, 15)}...` : name) // 控制名称长度
		},
		xAxis: { type: 'value' },
		yAxis: { type: 'category', data: Array.from(months) },
		series: Array.from(poopTypes).flatMap(poopType =>
			Array.from(users.entries()).map(([userId, user]) => ({
				name: `${user} - ${poopTypeMap.get(poopType)}`,
				type: 'bar',
				stack: userId.toString(),
				emphasis: { focus: 'series' },
				data: Array.from(months).map(month => statsByUserAndMonth.get(userId)?.get(month)?.get(poopType) || 0)
			}))
		),
		dataZoom: [
			{
				orient: 'vertical',
				startValue: 100,
				maxValueSpan: 8,
				type: 'inside',
				zoomLock: true
			}
		]
	};
};

onMounted(async () => {
	await usePoopStore().getPoopsAction();
	await getData();
});
</script>

<style scoped>
.poop-stats-container {
	margin: 16px;
	padding: 16px;
}
</style>
