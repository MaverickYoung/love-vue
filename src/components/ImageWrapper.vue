<template>
  <div class="image-container">
    <!-- 加载动画 -->
    <ImageLoading v-if="isLoading" />

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
import ImageLoading from '@/components/ImageLoading.vue';

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
  width: auto;
  height: auto;
}

/* 图片样式 */
img {
  display: block;
  background: rgba(240, 240, 240, 0);
  transition: opacity 0.3s ease-in-out;
}
</style>
