<template>
  <div class="theme-manager-container">
    <h2>主题配置</h2>
    <div class="info-item">
      <div class="label">主题切换</div>
      <label>
        <input
            type="radio"
            name="themeOptions"
            value="light"
            v-model="selectedTheme"
        />
        <span class="option">亮色</span>
      </label>
      <label>
        <input
            type="radio"
            name="themeOptions"
            value="dark"
            v-model="selectedTheme"
        />
        <span class="option">暗色</span>
      </label>
      <div class="slider"></div>
    </div>

    <br/>
    <div>
      <div class="info-item">
        <div class="label">主要背景色</div>
        <div class="value">
          <div class="color-box" :style="{ backgroundColor: appStore.theme.styles['--van-background'] }"/>
        </div>
      </div>

      <div class="info-item">
        <div class="label">次要背景色</div>
        <div class="value">
          <div class="color-box" :style="{ backgroundColor: appStore.theme.styles['--van-background-2'] }"/>

        </div>
      </div>

      <div class="info-item">
        <div class="label">辅助背景色</div>
        <div class="value">
          <div class="color-box" :style="{ backgroundColor: appStore.theme.styles['--van-background-3'] }"/>
        </div>
      </div>
    </div>

  </div>
  <color-picker :color="backgroundColor" @update:color="onUpdateBackground"/>
</template>

<script setup lang="ts">

import {useAppStore} from "@/store/app";
import {ref} from "vue";
import ColorPicker from "@/components/ColorPicker.vue";

const appStore = useAppStore()
const selectedTheme = ref('light');

const backgroundColor = ref<string>();
const backgroundColor2 = ref<string>();
const backgroundColor3 = ref<string>();

const onUpdateBackground = (color: string) => {
  console.log(color);
}

</script>

<style scoped>
.theme-manager-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h2 {
    margin-bottom: 20px;
  }

  /* 子容器样式 */

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 250px;
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
      }
    }
  }
}

</style>