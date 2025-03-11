<template>
  <div class="image-popup-button">
    {{ label }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  label: string;
}>();
</script>

<style scoped>
.image-popup-button {
  font-size: 16px;
  width: 200px;
  margin-top: 16px;
  background-color: #323233;
  height: 40px;
  border-radius: 5px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

}
</style>