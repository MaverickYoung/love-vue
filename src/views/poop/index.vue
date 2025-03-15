<template>
  <div class="container">
    <div class="card-item">
      <image-wrapper
        :src="NormalPoopIcon"
        alt="小便便图标"
        width="120px"
        height="120px" />
    </div>

    <div class="card-item">
      <van-tabs v-model:active="activeTab" animated swipeable>
        <van-tab class="tab-content">
          <template #title>
            <image-wrapper :src="MessageIcon" alt="消息图标" width="30px" />
          </template>
          <keep-alive>
            <poop-message v-if="loadedTabs.includes(0) || activeTab === 0" />
          </keep-alive>
        </van-tab>

        <van-tab class="tab-content">
          <template #title>
            <image-wrapper :src="RewardIcon" alt="记录图标" width="30px" />
          </template>
          <keep-alive>
            <poop-reward v-if="loadedTabs.includes(1) || activeTab === 1" />
          </keep-alive>
        </van-tab>

        <van-tab class="tab-content">
          <template #title>
            <image-wrapper :src="StatsIcon" alt="日志图标" width="30px" />
          </template>
          <keep-alive>
            <poop-stats v-if="loadedTabs.includes(2) || activeTab === 2" />
          </keep-alive>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ImageWrapper from '@/components/ImageWrapper.vue';
import { onMounted, ref, watch } from 'vue';
import PoopMessage from '@/views/poop/PoopMessage.vue';
import PoopReward from '@/views/poop/PoopReward.vue';
import PoopStats from '@/views/poop/PoopStats.vue';
import { MessageIcon, NormalPoopIcon, RewardIcon, StatsIcon } from '@/assets';

// 默认加载第一个tab
const activeTab = ref<number>(0);
const loadedTabs = ref<number[]>([0]);
watch(activeTab, (newVal) => {
  // 标记已加载的tab
  if (!loadedTabs.value.includes(newVal)) {
    loadedTabs.value.push(newVal);
  }
});

onMounted(() => {
  const img = new Image();
  img.src = NormalPoopIcon;
  img.decode().catch(() => {});
});
</script>

<style scoped>
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-item {
  border-radius: 10px;
  box-shadow: 0 8px 16px var(--box-shadow-bottom);
  padding: 16px 0 16px 0;
  width: 300px;
  text-align: center;
  margin: 16px 0 16px 0;
}

.tab-content {
  height: 440px;
  position: relative;
}
</style>
