<template>
  <div class="popup-container" v-if="show" @click="closePopup">
    <div class="popup-content" @click.stop>
      <image-wrapper v-if="src" :src="src" width="80dvw"/>
      <div v-else class="empty-image-placeholder">空</div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageWrapper from "@/components/ImageWrapper.vue";

const props = defineProps<{
  src?: string;
  show: boolean;
}>()

// 定义 emit
const emit = defineEmits(['update:show']);

// 关闭弹窗
const closePopup = () => {
  console.log(123)
  emit('update:show', false);
};
</script>

<style scoped>
.popup-container {
  height: 100dvh;
  width: 100dvw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .popup-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .empty-image-placeholder {
      font-size: 30px;
      margin: 50px;
    }
  }
}
</style>