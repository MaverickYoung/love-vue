<template>
  <div class="profile-wrapper">
    <avatar-wrapper :src="user.avatar" size="80px"/>

    <div class="info-item">
      <div class="label">用户名</div>
      <div class="value">{{ user.username }}</div>
    </div>
    <div class="info-item">
      <div class="label">昵称</div>
      <div class="value">{{ user.nickname }}</div>
    </div>
    <div class="info-item">
      <div class="label">密码</div>
      <div class="value"></div>
    </div>
    <div class="info-item">
      <div class="label">性别</div>
      <div class="value">{{ user.gender }}</div>
    </div>
    <div class="info-item">
      <div class="label">背景</div>
      <div class="value">{{ user.background }}</div>
    </div>

    <br/> <!-- 用于增加与主题项的间距 -->

    <div class="info-item">
      <div class="label">主题</div>
      <div class="value"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AvatarWrapper from "@/components/AvatarWrapper.vue";
import {useUserStore} from "@/store/user";
import {onMounted, ref} from "vue";

const userStore = useUserStore()

const user = userStore.user

const username = ref<string>();
const nickname = ref<string>();
const password = ref<string>();
const gender = ref<number>();
const background = ref<string>();
const theme = ref<string>();

const colors = [
  '#409eff',
  '#0BB2D4',
  '#3E8EF7',
  '#11C26D',
  '#17B3A3',
  '#667AFA',
  '#997B71',
  '#9463F7',
  '#757575',
  '#EB6709',
  '#F74584',
  '#FCB900',
  '#FF4C52'
]

onMounted(() => {

})

</script>

<style scoped>
.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 300px;
  padding: 20px;

  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);


  /* 头像样式 */

  avatar-wrapper {
    margin-bottom: 20px;
  }

  /* 子容器样式 */

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 300px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 8px 0;

    /* 标签样式 */

    .label {
      font-weight: bold;
      text-align: left;
      flex: 1;
    }

    /* 值样式 */

    .value {
      color: #888;
      text-align: right;
      flex: 1;

      /* 添加 ">" 符号 */

      &::after {
        content: " >";
        color: #ccc;
      }
    }
  }
}


</style>