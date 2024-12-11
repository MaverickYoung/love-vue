<template>
  <div class="back" @click="handleBack">
    <ImageWrapper src="/src/assets/back.svg" class="icon-back"/>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import ImageWrapper from "@/components/ImageWrapper.vue";
import {PropType} from "vue";

// 获取路由实例
const router = useRouter();

// 接收父组件传递的 handleBack 方法
const props = defineProps({
  handleBack: {
    type: Function as PropType<() => void>
  }
});
const handleBack = props.handleBack || (() => router.back());
</script>


<style scoped>
.back {
  width: 25px;
  height: 25px;
  position: absolute;
  top: 0;
  left: 0;

  .icon-back {
    transform: translateX(-1000px);
    filter: drop-shadow(1000px 0 0 var(--van-text-color));
  }
}
</style>