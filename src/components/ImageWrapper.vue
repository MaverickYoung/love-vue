<template>
  <div class="image-container">
    <!-- 加载动画 -->
    <div v-if="isLoading" class="loader">
      <div class="ring"></div>
    </div>

    <img
      v-show="!isLoading"
      :alt="alt"
      :src="imageSrc"
      :style="imgStyle"
      @load="handleLoad"
      @error="handleError" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { ErrorPlaceholderIcon } from '@/assets';

const props = defineProps<{
  src: string | undefined; // 图片地址
  alt?: string; // 图片描述
  width?: string; // 自定义宽度
  height?: string; // 自定义高度
}>();

const isLoading = ref(true); // 是否正在加载
const imageSrc = ref<string>(''); // 当前图片路径

const imgStyle = computed(() => ({
  width: props.width || '100%',
  height: props.height || 'auto',
}));

// 监听 src 变化，只有 src 存在时才开始加载
watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) {
      isLoading.value = true;
      imageSrc.value = newSrc;
    }
  },
  { immediate: true }, // 添加立即执行
);

// 图片加载成功
const handleLoad = () => {
  isLoading.value = false;
};

// 图片加载失败
const handleError = () => {
  isLoading.value = false; // 避免 loader 无限显示
  imageSrc.value = ErrorPlaceholderIcon;
};
</script>

<style scoped>
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: auto;
}

/* 图片样式 */
img {
  display: block;
  background: rgba(240, 240, 240, 0);
  transition: opacity 0.3s ease-in-out;
}

/* 加载动画 */
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader .ring {
  width: 20px;
  height: 20px;
  border: 3px dashed #4b9cdb;
  border-radius: 50%;
  animation: loadingD 1.5s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite;
}

@keyframes loadingD {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
