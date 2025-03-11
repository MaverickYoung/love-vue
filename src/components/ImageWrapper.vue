<template>
  <div class="image-container">
    <img :alt="alt" :src="src" :style="imgStyle" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  src: string;     // 图片
  alt?: string;     // 图片描述
  width?: string;   // 自定义宽度
  height?: string;  // 自定义高度
}>();

// 计算样式
const imgStyle = computed(() => {
  return {
    width: props.width || '100%',  // 默认宽度为100%
    height: props.height || 'auto' // 默认高度自适应
  };
});
</script>

<style scoped>
.image-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: auto;
}

img {
  display: block; /* 避免底部留白 */
}
</style>
