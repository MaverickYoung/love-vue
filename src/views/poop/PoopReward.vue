<template>
  <div class="container">
    <div @click="datePickerVisible= true" class="date-container">{{ formatDate }}</div>
    <div v-for="(reward,index) in rewardList" :key="index">
      <div class="reward-container">
        <div class="photo-frame">
          <!-- 使用 image-wrapper 包裹图片 -->
          <image-wrapper :src="reward.rewardImage" width="180px" class="reward-image"/>
          <!-- 头像 -->
          <avatar-wrapper
              class="avatar"
              :src="useUserStore().getUserProfile(reward.userId)?.avatar"
              size="30px"
          />
          <!-- 王冠 -->
          <image-wrapper src="/src/assets/crown.svg" width="20px" class="crown"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import ImageWrapper from "@/components/ImageWrapper.vue";
import {computed, onMounted, ref} from "vue";
import {useRewardApi} from "@/api/poop/summary";
import AvatarWrapper from "@/components/AvatarWrapper.vue";
import {useUserStore} from "@/store/user";


interface RewardItem {
  month: string;
  userId: number;
  isRewarded: boolean;
  rewardImage: string;
}

const rewardList = ref<RewardItem[]>([]);

const onGetReward = async (month: string) => {
  const {data} = await useRewardApi(month);
  rewardList.value = data;
}

const datePickerVisible = ref(false);
const currentDate = ref(['2024', '10']);

const formatDate = computed(() => {
  return `${currentDate.value[0]}-${currentDate.value[1]}`;
})

onMounted(() => {
  onGetReward(formatDate.value);
})

</script>

<style scoped>
.reward-container {
  position: relative;
  width: 100%; /* 容器宽度占满父容器 */
  height: 100%; /* 容器高度占满父容器 */

  .date-container {
    padding: 10px;
  }

  .photo-frame {
    /* 外层相框 */
    position: relative;
    display: inline-block;
    padding: 10px; /* 外框和内框的间距 */

    /* 第一圈细线黑色相框 */
    border: 2px solid black;
    border-radius: 10px; /* 圆角效果 */

    .reward-image {
      /* 内层细线相框 */
      border: 2px solid black;
      border-radius: 8px; /* 圆角效果，与外框稍微小一点 */
    }

    .avatar {
      position: absolute;
      bottom: 20px; /* 距离底部的间距，可调整 */
      left: 20px; /* 距离左侧的间距，可调整 */
      z-index: 10; /* 保证头像在图片上层 */
      overflow: hidden;
    }

    .crown {
      position: absolute;
      top: -5px; /* 王冠相对于头像的位置，向上偏移 */
      right: -5px; /* 王冠相对于头像的位置，向右偏移 */
      width: 20px; /* 王冠的宽度 */
      height: auto; /* 高度自动 */
      z-index: 20; /* 保证王冠在头像上层 */
    }
  }
}
</style>