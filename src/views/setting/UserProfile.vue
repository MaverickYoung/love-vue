<template>

  <avatar-wrapper :src="user.avatar" size="80px"/>

  <div class="info-item" @click="router.push('/setting/edit-username')">
    <div class="label">用户名</div>
    <div class="value">{{ user.username }}</div>
  </div>
  <div class="info-item" @click="router.push('/setting/edit-nickname')">
    <div class="label">昵称</div>
    <div class="value">{{ user.nickname }}</div>
  </div>
  <div class="info-item" @click="router.push('/setting/edit-password')">
    <div class="label">密码</div>
    <div class="value"></div>
  </div>
  <div class="info-item" @click="switchGender">
    <div class="label">性别</div>
    <div class="value">{{ user.gender }}</div>
  </div>

  <br/>
  <div class="info-item" @click="router.push('/setting/theme-manager')">
    <div class="label">主题</div>
    <div class="value">
      <div class="color-box"/>
    </div>
  </div>
  <div class="info-item">
    <div class="label">背景</div>
    <div class="value">{{ user.background }}</div>
  </div>
</template>

<script setup lang="ts">
import AvatarWrapper from "@/components/AvatarWrapper.vue";
import {useUserStore} from "@/store/user";
import {ref} from "vue";
import {useRouter} from "vue-router";

const userStore = useUserStore()

const user = userStore.user

const router = useRouter()

const gender = ref<number>();
const background = ref<string>();
const switchGender = () => {

}

</script>


<style scoped>
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
  max-width: 270px;
  padding: 10px;
  border: 1px solid var(--van-border-color);
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
    color: var(--van-text-color-2);
    text-align: right;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    /* 添加 ">" 符号 */

    &::after {
      content: ">";
      margin-left: 8px;
    }

    .color-box {
      width: 16px;
      height: 16px;
      border-radius: 2px;
      border: 2px solid var(--van-text-color-3);
      background-color: var(--van-background);
    }
  }
}
</style>