<template>
  <div class="poop-reward-container">
    <div class="date-container" @click="datePickerVisible = true">
      {{ formatDate }}
    </div>
    <hr class="divider" />
    <div class="reward-container">
      <ImageLoading v-if="isLoading" style="padding: 80px" />
      <!-- 空数据提示 -->
      <div v-else-if="rewards.length === 0" class="tips-empty">
        <image-wrapper :src="EmptyIcon" width="70%" />
      </div>
      <div v-for="(reward, index) in rewards" :key="index">
        <div class="photo-frame">
          <!-- 使用 image-wrapper 包裹图片 -->
          <image-wrapper
            v-if="reward.rewardImage"
            :src="reward.rewardImage"
            class="reward-image"
            width="180px"
            @click="showImage(reward.rewardImage)" />
          <div v-else class="reward-not">
            <span>
              <b>{{ getNickname(reward.userId) }}</b> 的奖励呢？
            </span>
          </div>

          <!-- 头像 -->
          <avatar-wrapper
            :src="getAvatar(reward.userId)"
            class="avatar"
            size="30px" />
          <!-- 王冠 -->
          <image-wrapper :src="CrownIcon" class="crown" width="15px" />
        </div>
      </div>
    </div>
    <hr class="divider" />
    <van-uploader
      v-model="pendingUploads"
      :before-read="beforeRead"
      :disabled="!canUpload"
      :max-count="1" />
    <van-button :disabled="canSubmitUpload" type="primary" @click="handleUpload"
      >上 传
    </van-button>
    <van-popup
      v-model:show="datePickerVisible"
      :style="{ height: '40%' }"
      position="bottom"
      round
      style="margin: 0"
      teleport="#app">
      <van-date-picker
        ref="datePickerRef"
        v-model="currentDate"
        :columns-type="columnsType"
        :formatter="formatter"
        :max-date="maxDate"
        :min-date="minDate"
        title="选择年月"
        @confirm="onConfirm" />
    </van-popup>
    <van-popup
      :show="isCompressing"
      round
      teleport="#app"
      class="tips-compress">
      <p>图片压缩中</p>
      <ImageLoading />
    </van-popup>
    <Teleport to="#app">
      <div v-if="previewImage" class="image-preview-container">
        <div class="image-preview-overlay" @click="previewImage = ''"></div>
        <image-wrapper
          :src="previewImage"
          class="image-preview"
          width="80dvw" />
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import ImageWrapper from '@/components/ImageWrapper.vue';
import { computed, onMounted, ref } from 'vue';
import { useRewardApi, useUpdateRewardApi } from '@/api/poop/summary';
import AvatarWrapper from '@/components/AvatarWrapper.vue';
import { useUserStore } from '@/store/user';
import {
  DatePickerColumnType,
  DatePickerInstance,
  showSuccessToast,
  showToast,
  UploaderFileListItem,
} from 'vant';
import { CrownIcon, EmptyIcon } from '@/assets';
import ImageLoading from '@/components/ImageLoading.vue';
import ImageUtils from '@/utlis/file';

interface RewardItem {
  month: string;
  userId: number;
  isRewarded: boolean;
  rewardImage: string;
}

const userStore = useUserStore();

const getAvatar = (userId: number) => {
  return userStore.getUserProfile(userId)?.avatar;
};

const getNickname = (userId: number) => {
  return userStore.getUserProfile(userId)?.nickname;
};

const rewards = ref<RewardItem[]>([]);

const isLoading = ref(false); // 新增加载状态变量

const fetchRewards = async (month: string) => {
  isLoading.value = true; // 开始加载
  rewards.value = []; //清空数据
  try {
    const { data } = await useRewardApi(month);
    rewards.value = data;
    const userIds = new Set<number>(
      data.map((item: RewardItem) => item.userId),
    );
    await userStore.fetchUserProfilesAction(userIds);
  } finally {
    isLoading.value = false; // 加载完成
  }
};

const datePickerVisible = ref(false);
const columnsType: DatePickerColumnType[] = ['year', 'month'];

const minDate = new Date(2024, 9); // 最小日期为 2024 年 10 月
const maxDate = new Date(); // 获取当前日期
maxDate.setMonth(maxDate.getMonth() - 1); // 当前月份减一个月

// 格式为 [year,month] 值为maxDate
const currentDate = ref([
  maxDate.getFullYear().toString(),
  (maxDate.getMonth() + 1).toString().padStart(2, '0'),
]);

const formatter = (type: string, option: any) => {
  if (type === 'year') {
    option.text += '年';
  }
  if (type === 'month') {
    option.text += '月';
  }
  return option;
};

const formatDate = computed(() => {
  return `${currentDate.value[0]}-${currentDate.value[1]}`;
});

// 上传的奖励列表
const pendingUploads = ref<UploaderFileListItem[]>([]);

// 支持的图片格式
const supportedFormats = [
  'image/jpeg', // JPEG/JPG
  'image/png', // PNG
  'image/webp', // WebP
  'image/gif', // GIF（包括动态）
  'image/svg+xml', // SVG（将被栅格化）
  'image/tiff', // TIFF
  'image/heif', // HEIF（需系统支持）
  'image/heic', // HEIC（需系统支持）
  'application/pdf', // PDF（提取第一页）
];

onMounted(() => {
  fetchRewards(formatDate.value);
});

// 上传前的验证函数
const beforeRead = (file: File | File[]): boolean => {
  // 确保 file 是数组时，遍历所有文件
  const files = Array.isArray(file) ? file : [file];

  for (let i = 0; i < files.length; i++) {
    const currentFile = files[i];
    if (!supportedFormats.includes(currentFile.type)) {
      showToast('不支持的图片格式');
      return false;
    }
  }

  return true;
};

const isCompressing = ref(false);

const handleUpload = async () => {
  if (pendingUploads.value.length === 0) return;

  isCompressing.value = true;

  await Promise.all(
    pendingUploads.value.map(async (fileItem) => {
      if (fileItem.file) {
        let newFile;
        try {
          // 使用 await 调用 compressToAvif，并获取压缩后的文件
          newFile = await ImageUtils.compressToAvif(fileItem.file);
          isCompressing.value = false;
        } catch (error) {
          isCompressing.value = false;
          showToast('图片压缩失败');
          return;
        }
        return useUpdateRewardApi(newFile, formatDate.value);
      }
    }),
  );
  showSuccessToast('上传完成');

  pendingUploads.value = [];

  await fetchRewards(formatDate.value);
};

// 允许上传
const canUpload = computed(() => {
  return rewards.value.some((item) => item.userId === userStore.user.id);
});

// 上传按钮是否禁用
const canSubmitUpload = computed(() => {
  return !canUpload.value || pendingUploads.value.length === 0;
});

const datePickerRef = ref<DatePickerInstance>();

const onConfirm = () => {
  datePickerVisible.value = false; // 关闭弹窗
  fetchRewards(formatDate.value);
};

const previewImage = ref('');
const showImage = (image: string) => {
  previewImage.value = image;
};
</script>

<style scoped>
.poop-reward-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 430px;
  margin: 8px;

  .divider {
    border: 1px solid var(--van-text-color-2);
    margin: 5px 0; /* 设置上下的间距 */
    width: 220px;
  }

  .reward-container {
    max-height: 220px;
    min-height: 220px;
    overflow-y: auto;

    .photo-frame {
      margin-bottom: 8px;

      /* 外层相框 */
      position: relative;
      display: inline-block;
      padding: 10px; /* 外框和内框的间距 */

      /* 第一圈细线相框 */
      border: 2px solid var(--van-text-color-3);
      border-radius: 10px; /* 圆角效果 */

      .reward-image,
      .reward-not {
        /* 内层细线相框 */
        border: 2px solid var(--van-text-color-3);
        border-radius: 8px; /* 圆角效果，与外框稍微小一点 */
      }

      .reward-not {
        display: flex;
        width: 180px;
        text-align: left;
        min-height: 50px;

        span {
          margin-left: auto; /* 将 span 推到右边 */
          padding: 4px;
          max-width: 120px; /* 限制最大宽度 */
          word-wrap: break-word; /* 长单词换行 */
        }
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
        bottom: 42px; /* 王冠相对于头像的位置，向上偏移 */
        left: 42px; /* 王冠相对于头像的位置，向右偏移 */
        z-index: 20; /* 保证王冠在头像上层 */
        height: auto;
      }
    }
  }
}

.image-preview-container {
  position: absolute; /* 现在基于 #app 定位 */
  z-index: 999; /* 确保显示在最上层 */
  top: 0;
  left: 0;
  height: 100dvh;
  width: 100dvw;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.image-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 0; /* 遮罩在底层 */
  pointer-events: all; /* 遮罩可点击 */
}

.image-preview {
  z-index: 1; /* 确保图片在遮罩之上 */
}

.tips-empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.tips-compress {
  padding: 32px;

  p {
    font-size: 20px;
    margin: 16px 0;
  }
}

/* 覆盖默认样式*/
::v-deep(.van-uploader__upload) {
  margin: 16px;
}
</style>
