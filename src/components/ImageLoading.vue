<template>
  <div class="loader">
    <div class="ring"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* 加载动画 */
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader .ring {
  width: 20px;
  height: 20px;
  border: 3px dashed #4b9cdb;
  border-radius: 50%;
  animation: loadingD 1.5s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite;
}

@keyframes loadingD {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
