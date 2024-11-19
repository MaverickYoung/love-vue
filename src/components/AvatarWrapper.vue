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
  avatar?: string;     // 头像地址
  size?: string;   // 自定义大小
}>();

// 计算大小
const computedSize = computed(() => {
  // 默认大小为10rem
  return props.size || '2rem';
})
</script>

<style scoped>
</style>