<template>
  <van-image
      round
      :width="computedSize"
      :height="computedSize"
      fit="cover"
      :src="computedAvatarUrl"
  />
</template>

<script setup lang="ts">
import {computed} from "vue";


const props = defineProps<{
  avatarUrl?: string;     // 头像地址
  size?: string;   // 自定义大小
}>();

// 默认头像 URL
const defaultAvatar = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg';

// 计算属性，根据 avatarUrl 是否为空返回不同的 URL
const computedAvatarUrl = computed(() => {
  return props.avatarUrl || defaultAvatar;
});

// 计算大小
const computedSize = computed(() => {
  // 默认大小为10rem
  return props.size || '2rem';
})
</script>

<style scoped>
</style>