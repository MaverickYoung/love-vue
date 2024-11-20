<template>
  <van-image
      round
      :width="computedSize"
      :height="computedSize"
      fit="cover"
      :src="avatar"
  />
</template>

<script setup lang="ts">
import {computed} from "vue";


const props = defineProps<{
  avatar?: string;     // 头像
  size?: string;   // 自定义大小
}>();

// 计算大小
const computedSize = computed(() => {
  return props.size || '50px';
})
</script>

<style scoped>
</style>