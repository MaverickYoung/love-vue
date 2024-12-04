<template>
  <form class="edit-field-form">
    <h2>修改用户名</h2>
    <label>用户名
      <input
          v-model="username"
          type="text"
          placeholder="用户名 2-20位 不含空格"
      />
    </label>
    <p v-if="error" class="error">{{ error }}</p>
    <custom-button>取消</custom-button>
  </form>
</template>

<script setup lang="ts">
import {ref} from "vue";
import CustomButton from "@/components/CustomButton.vue";

const username = ref<string>('');
const error = ref<string | null>(null);


</script>

<style scoped>
.edit-field-form {
  h2 {
    text-align: center; /* 标题居中 */
    margin-bottom: 16px; /* 增加与其他项的间距 */
  }

  label {
    display: flex; /* 使用 flex 布局 */
    align-items: center; /* 垂直居中对齐 label 和 input */
    margin-top: 16px; /* 每一项增加间距 */

    input {
      flex: 1; /* 输入框占据剩余空间 */
      border: none; /* 去除原边框 */
      border-bottom: 1px solid var(--van-text-color-2); /* 添加下边框 */
      padding: 8px 0; /* 给输入框增加上下内边距 */
      font-size: 14px;
      margin-left: 16px; /* 输入框与 label 之间的间距 */

      &:focus {
        outline: none; /* 去除焦点时的外框 */
        border-bottom-color: var(--van-primary-color); /* 焦点时下边框高亮 */
      }
    }
  }

  .error {
    color: var(--van-danger-color);
    margin-bottom: 16px; /* 与按钮之间增加间距 */
  }

  button{
    margin-top: 32px;
  }
}
</style>