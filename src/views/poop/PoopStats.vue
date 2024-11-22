<template>
  <base-chart :options="chartOptions" width="400px" height="400px"/>
</template>

<script setup lang="ts">
import BaseChart from "@/components/echarts/BaseChart.vue";
import {onMounted, ref} from "vue";
import {useLogListApi} from "@/api/poop/log";
import {usePoopStore} from "@/store/poop";

interface StatsItem {
  month: string;
  userId: number;
  nickname: string;
  poopType: number;
  poopCount: number;
}

interface Pattern {
  type: string;
  width: number;
  color: string;
  rotation?: number;
}

interface UserPattern {
  nickname: string;
  pattern: Pattern;
}

const statsList = ref<StatsItem[]>();

const statsData = {
  months: new Set<string>(),
  users: new Map<number, { nickname: string; pattern: Pattern }>(),
  poopTypes: new Set<number>(),
};

const chartOptions = ref({});

const getData = async (start?: string, end?: string) => {
  const {data} = await useLogListApi(start, end);
  statsList.value = data;

  // 数据收集和初始化
  statsData.months.clear();
  statsData.users.clear();
  statsData.poopTypes.clear();

  statsList.value?.forEach(item => {
    statsData.months.add(item.month);
    statsData.poopTypes.add(item.poopType);
    if (!statsData.users.has(item.userId)) {
      statsData.users.set(item.userId, {
        nickname: item.nickname || `用户 ${item.userId}`,
        pattern: generateRandomPattern(),
      });
    }
  });

  // 更新图表选项
  updateChartOptions();
}

/**
 * 随机生成图案（线条、方格、交替颜色等）
 */
const generateRandomPattern = (): Pattern => {
  const patterns = ['line', 'checker'];  // 支持线条和方格
  const patternType = patterns[Math.floor(Math.random() * patterns.length)];

  if (patternType === 'line') {
    return {
      type: 'line',
      width: 3 + Math.floor(Math.random() * 3), // 随机宽度 3-5
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // 随机颜色
      rotation: Math.random() * Math.PI, // 随机旋转角度
    };
  } else {
    return {
      type: 'checker',
      width: 4 + Math.floor(Math.random() * 3), // 随机宽度 4-6
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // 随机颜色
    };
  }
};

const updateChartOptions = () => {
  const poops = usePoopStore().poops;

  // 数据预处理
  const {months, users, poopTypes} = statsData;
  const poopTypeMap = new Map<number, { name: string; color: string }>();
  const statsByUserAndMonth = new Map<number, Map<string, Map<number, number>>>();

  statsList.value?.forEach(item => {
    // 初始化便便类型映射
    if (!poopTypeMap.has(item.poopType)) {
      const poop = poops.get(item.poopType) || {name: 'Unknown', color: '#ccc'};
      poopTypeMap.set(item.poopType, {name: poop.name, color: poop.color});
    }

    // 分类统计数据
    const userStats = statsByUserAndMonth.get(item.userId) || new Map();
    const monthStats = userStats.get(item.month) || new Map();
    monthStats.set(item.poopType, (monthStats.get(item.poopType) || 0) + item.poopCount);
    userStats.set(item.month, monthStats);
    statsByUserAndMonth.set(item.userId, userStats);
  });

  // 图表选项
  chartOptions.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'},
    },
    legend: {
      data: Array.from(users.values()).flatMap(user =>
          Array.from(poopTypes).map(poopType => `${user.nickname} - ${poopTypeMap.get(poopType)?.name}`)
      ),
    },
    xAxis: {type: 'value'},
    yAxis: {type: 'category', data: Array.from(months)},
    series: Array.from(poopTypes).flatMap(poopType =>
        Array.from(users.entries()).map(([userId, user]) => ({
          name: `${user.nickname} - ${poopTypeMap.get(poopType)?.name}`,
          type: 'bar',
          stack: userId.toString(),
          emphasis: {focus: 'series'},
          itemStyle: {
            color: poopTypeMap.get(poopType)?.color,
            pattern: user.pattern,
          },
          data: Array.from(months).map(month =>
              statsByUserAndMonth.get(userId)?.get(month)?.get(poopType) || 0
          ),
        }))
    ),
  };
};

onMounted(async () => {
  await usePoopStore().getPoopsAction();
  await getData()
})
</script>

<style scoped>

</style>