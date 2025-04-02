<!--
  - MIT License
  -
  - Copyright (c) 2025 Maverick Young
  -
  - Permission is hereby granted, free of charge, to any person obtaining a copy
  - of this software and associated documentation files (the "Software"), to deal
  - in the Software without restriction, including without limitation the rights
  - to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  - copies of the Software, and to permit persons to whom the Software is
  - furnished to do so, subject to the following conditions:
  -
  - The above copyright notice and this permission notice shall be included in all
  - copies or substantial portions of the Software.
  -
  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  - IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  - FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  - AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  - LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  - OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  - SOFTWARE.
  -->

<template>
  <div class="poop-messages-container">
    <div ref="messagesContainer" class="messages-container">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-container">
        <!-- 时间占据一整行 -->
        <div class="message-time-wrapper">
          <span class="message-time">{{ formatTime(message.time) }}</span>
        </div>

        <!-- 发送/接收消息时头像和消息内容分别布局 -->
        <div class="message-body">
          <!-- 接收消息：头像在左，消息内容在右 -->
          <div v-if="message.userId !== currentUserId" class="message-left">
            <avatar-wrapper
              :src="getAvatar(message.userId)"
              class="avatar"
              size="30px" />
            <div class="message-content-wrapper">
              <image-wrapper
                :lazy="true"
                :src="getPoopSrc(message.type)"
                class="message-content"
                width="45px" />
            </div>
          </div>

          <!-- 发送消息：头像在右，消息内容在左 -->
          <div v-else class="message-right">
            <div class="message-content-wrapper">
              <image-wrapper
                :lazy="true"
                :src="getPoopSrc(message.type)"
                class="message-content"
                width="45px" />
            </div>
            <avatar-wrapper
              :src="getAvatar(message.userId)"
              class="avatar"
              size="30px" />
          </div>
        </div>
      </div>
    </div>

    <div style="height: 16px"></div>
    <van-popover
      v-model:show="isPopoverVisible"
      actions-direction="horizontal"
      placement="top">
      <van-row style="width: 250px">
        <van-col
          v-for="poop in poopOptions"
          :key="poop.id"
          class="popover-item"
          span="8">
          <image-wrapper
            :src="poop.src"
            width="60px"
            @click="onOptionClick(poop)" />
        </van-col>
      </van-row>

      <template #reference>
        <image-wrapper
          :src="selectedType?.src ? selectedType?.src : ''"
          width="100px" />
      </template>
    </van-popover>
    <br />
    <custom-button
      :backgroundColor="selectedType?.color"
      class="submit"
      square
      @click="onSubmit"
      >发 射
    </custom-button>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import AvatarWrapper from '@/components/AvatarWrapper.vue';
import { useLogPageApi, useLogSaveApi } from '@/api/poop/log';
import { useUserStore } from '@/store/user';
import { Poop, usePoopStore } from '@/store/poop';
import ImageWrapper from '@/components/ImageWrapper.vue';
import { showSuccessToast } from 'vant';
import CustomButton from '@/components/CustomButton.vue';

interface LogItem {
  id: number; // ID
  userId: number; // 用户ID
  time: string; // 消息时间
  type: number; // 便便类型
}

const userStore = useUserStore();
const poopStore = usePoopStore();

// 当前用户ID
const currentUserId = userStore.user.id;

const userIdList = ref<Set<number>>(new Set<number>());

const messages = ref<LogItem[]>([]);

const isPopoverVisible = ref<boolean>(false);

// 使用 ref 引用子组件实例
const messagesContainer = ref<HTMLElement | null>(null);

const selectedType = ref<Poop>();

const onOptionClick = (option: Poop) => {
  isPopoverVisible.value = false;
  selectedType.value = option;
};

/**
 * 时间格式化
 * @param time 时间字符串
 */
const formatTime = (time: string) => {
  const targetTime = new Date(time);
  const now = new Date();

  // 获取当前和目标日期的午夜时间（00:00:00），用于计算自然日差异
  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const targetMidnight = new Date(
    targetTime.getFullYear(),
    targetTime.getMonth(),
    targetTime.getDate(),
  );

  // 计算自然日差异
  const diffDays =
    (nowMidnight.getTime() - targetMidnight.getTime()) / (1000 * 60 * 60 * 24);

  const hours = targetTime.getHours().toString().padStart(2, '0');
  const minutes = targetTime.getMinutes().toString().padStart(2, '0');

  if (diffDays === 0) {
    return `${hours}:${minutes}`; // 今天
  } else if (diffDays === 1) {
    return `昨天 ${hours}:${minutes}`; // 昨天
  } else if (diffDays < 330) {
    // 今年内的日期显示月-日
    const month = (targetTime.getMonth() + 1).toString().padStart(2, '0');
    const date = targetTime.getDate().toString().padStart(2, '0');
    return `${month}-${date} ${hours}:${minutes}`;
  } else {
    // 跨年日期显示年-月-日
    const year = targetTime.getFullYear();
    const month = (targetTime.getMonth() + 1).toString().padStart(2, '0');
    const date = targetTime.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${date} ${hours}:${minutes}`;
  }
};

const pagePrams = reactive({
  size: 100,
  current: 1,
});

/**
 * 获取便便日志
 */
const onLogPage = async () => {
  const { data } = await useLogPageApi(pagePrams.size, pagePrams.current);

  // 更新userIdList
  data?.list?.forEach((item: LogItem) => {
    userIdList.value.add(item.userId);
  });

  await userStore.fetchUserProfilesAction(userIdList.value);

  // 填充数据
  messages.value = data.list
    .map((item: any) => ({
      id: item.id,
      userId: item.userId,
      time: item.logTime,
      type: item.poopType,
    }))
    .reverse();
};

const getAvatar = (userId: number) => {
  return userStore.getUserProfile(userId)?.avatar;
};

const getPoopSrc = (id: number): string => {
  return poopStore.getPoop(id)?.src ?? '';
};

const poopOptions = ref<Poop[]>([]);

// 滚动到底部
const scrollToBottom = (immediate = false) => {
  const container = messagesContainer.value;
  const lastMessage = container?.querySelector('.message-container:last-child');
  if (lastMessage) {
    lastMessage.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
  }
};

const onSubmit = async () => {
  await useLogSaveApi(selectedType.value?.id);
  showSuccessToast('发射成功');
  await onLogPage();
  scrollToBottom();
};

const setInitialOption = () => {
  onOptionClick(poopOptions.value[0]);
};

onMounted(async () => {
  // 并行执行 getPoopsAction 和 onLogPage
  await Promise.all([poopStore.getPoopsAction(), onLogPage()]);

  // 这些操作需在 getPoopsAction 完成后执行
  poopOptions.value = [...poopStore.poops.values()];
  setInitialOption();

  // 等待 Vue 更新 DOM
  await nextTick();
  scrollToBottom(true);
});
</script>

<style scoped>
.poop-messages-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px;

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 4px;
    background: var(--van-background-2);
    max-height: 240px;
    min-height: 240px;
    width: 250px;

    .message-container {
      display: flex;
      flex-direction: column;
      align-items: center; /* 保证时间部分垂直居中 */
      width: 100%;
      margin-top: 8px;

      .message-time-wrapper {
        width: 100%;
        text-align: center; /* 使时间居中 */
        margin-bottom: 1px; /* 让时间和消息内容之间有间距 */

        .message-time {
          font-size: 0.8em;
          color: var(--van-text-color-2);
        }
      }

      /* 聊天消息容器 */

      .message-body {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 47px;
        width: 100%;

        /* 接收消息：头像左对齐，消息内容右对齐 */

        .message-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start; /* 头像和消息内容左对齐 */
        }

        /* 发送消息：头像右对齐，消息内容左对齐 */

        .message-right {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end; /* 头像和消息内容右对齐 */
          width: 100%; /* 确保消息部分占满整行 */
        }

        /* 头像 */

        .avatar {
          margin: 0 10px; /* 头像和消息内容之间的间距 */
        }

        /* 消息内容容器 */

        .message-content-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 70%; /* 消息框最大宽度 */
          word-wrap: break-word;

          /* 消息内容 */

          .message-content {
            margin-top: 2px;
          }
        }
      }
    }
  }

  .popover-item {
    padding: 8px;
  }

  .submit {
    width: 75px !important;
    font-size: 14px;
    word-spacing: 2px;
    padding: 10px 0;
  }
}
</style>
