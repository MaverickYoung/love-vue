<template>
  <div
    :style="{ width: avatarSize, height: avatarSize }"
    class="lo-avatar-container">
    <img v-if="avatar" :src="avatar" alt="头像" class="lo-avatar" />
    <lo-icon
      v-else
      :size="iconSize"
      class="lo-loading-image"
      icon="loading-image" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import LoIcon from '@/components/love/lo-icon.vue';

const props = defineProps<{
  avatar?: string; // 头像 URL
  size?: string; // 自定义大小
}>();

const avatarSize = computed(() => props.size || '6rem');

const iconSize = computed(() => {
  const match = avatarSize.value.match(
    /^(\d*\.?\d+)(px|rem|em|%|vh|vw|vmin|vmax|pt|in|cm|mm)?$/,
  );
  if (!match) throw new Error('Invalid size format');

  const [_, value, unit] = match; // 解构出数值和单位
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) throw new Error('无效的数值');
  return `${numericValue * 0.6}${unit || ''}`; // 计算 60% 并返回
});
</script>

<style scoped>
.lo-avatar-container {
  position: relative;
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  border-radius: 50%;
  box-shadow: var(--shadow);
  padding: 0.3rem;

  .lo-avatar {
    width: 100%;
    height: 100%;
  }

  .lo-loading-image {
    display: inline-block; /* 保持元素本身为块级 */
  }
}
</style>
