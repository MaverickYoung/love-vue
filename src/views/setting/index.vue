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
    <div class="info-item" @click="switchToLightTheme">
      <div class="label">背景</div>
      <div class="value">{{ user.background }}</div>
    </div>

    <br/> <!-- 用于增加与主题项的间距 -->

    <div class="info-item" @click="switchToDarkTheme">
      <div class="label">主题</div>
      <div class="value">
        <div class="color-box"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AvatarWrapper from "@/components/AvatarWrapper.vue";
import {useUserStore} from "@/store/user";
import {onMounted, ref} from "vue";
import {useThemeStore} from "@/store/theme";

const userStore = useUserStore()

const user = userStore.user

const username = ref<string>();
const nickname = ref<string>();
const password = ref<string>();
const gender = ref<number>();
const background = ref<string>();

const themeStore = useThemeStore();

// 切换亮色主题
const switchToLightTheme = () => {
  themeStore.switchTheme('light');
};

// 切换暗色主题
const switchToDarkTheme = () => {
  themeStore.switchTheme('dark');
};

// 切换自定义主题（你可以根据输入的颜色来修改主题）
const switchToCustomTheme = () => {
  themeStore.switchTheme('custom');
};

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
  box-shadow: 0 8px 16px var(--box-shadow);

  background: var(--van-background-2);

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
        border-radius: 4px;
        border: 1px solid var(--van-border-color);
        background-color: var(--van-background);
      }
    }
  }
}


</style>