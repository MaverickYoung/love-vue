<template>
  <div class="container">
    <div class="card-item">
      <image-wrapper :src="PoopNormalIcon" alt="小便便图标" width="40%" />
    </div>

    <div class="card-item">
      <van-tabs v-model:active="activeTab" animated swipeable>
        <van-tab class="tab-content">
          <template #title>
            <image-wrapper :src="PoopNormalIcon" alt="小便便图标" width="50%" />
          </template>
          <poop-message />
        </van-tab>
        <van-tab class="tab-content">
          <template #title>
            <image-wrapper :src="PoopNormalIcon" alt="小便便图标" width="50%" />
          </template>
          <poop-reward />
        </van-tab>
        <van-tab class="tab-content">
          <template #title>
            <image-wrapper :src="PoopNormalIcon" alt="小便便图标" width="50%" />
          </template>
          <poop-stats />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ImageWrapper from "@/components/ImageWrapper.vue";
import { ref } from "vue";
import PoopMessage from "@/views/poop/PoopMessage.vue";
import PoopReward from "@/views/poop/PoopReward.vue";
import PoopStats from "@/views/poop/PoopStats.vue";
import { PoopNormalIcon } from "@/assets";

const activeTab = ref("");
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
