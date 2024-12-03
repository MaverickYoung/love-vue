<template>
  <form class="edit-field-form">
    <label>用户名
      <input
          v-model="username"
          type="text"
          placeholder="用户名 2-20位 不含空格"
      />
    </label>
    <p v-if="error" class="error">{{ error }}</p>
    <van-button>保存</van-button>
  </form>
</template>

<script setup lang="ts">
import {ref} from "vue";

const username = ref<string>('');
const error = ref<string | null>(null);
</script>

<style scoped>

</style>