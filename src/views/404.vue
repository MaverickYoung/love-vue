<template>
  <div class="password-container">
    <input
        :type="isPasswordVisible ? 'text' : 'password'"
        class="password-input"
        placeholder="请输入密码"
    />

  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue';
import ImageWrapper from "@/components/ImageWrapper.vue";

const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<style scoped>
.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  padding: 8px;
  width: 200px;
}

</style>