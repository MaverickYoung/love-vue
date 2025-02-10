<template>
  <div
    :style="{ width: btnSize, height: btnSize }"
    class="lo-btn-icon-container">
    <lo-icon :icon="icon" :size="iconSize" color="currentColor" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import LoIcon from '@/components/love/lo-icon.vue';

const props = defineProps<{
  icon?: string;
  size?: string; // 自定义大小
}>();

const btnSize = computed(() => props.size || '4rem');

const iconSize = computed(() => {
  const match = btnSize.value.match(
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
.lo-btn-icon-container {
  display: flex;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  box-shadow: var(--shadow);
  color: var(--greyDark);
  transition: all 0.2s ease;
  overflow: hidden;

  &:active {
    box-shadow: var(--inner-shadow);
    color: var(--primary);
  }
}
</style>
