<template>
  <van-image
    :height="computedSize"
    :src="avatar"
    :width="computedSize"
    fit="cover"
    round
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';


const props = defineProps<{
  avatar?: string;     // 头像
  size?: string;   // 自定义大小
}>();

// 计算大小
const computedSize = computed(() => {
  return props.size || '50px';
});
</script>

<style scoped>
</style>