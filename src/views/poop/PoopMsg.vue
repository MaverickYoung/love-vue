<template>
  <div class="chat-container">
    <div class="messages" ref="messagesContainer">
      <div
          v-for="message in messages"
          :key="message.id"
          class="message-container"
      >

        <!-- 时间占据一整行 -->
        <div class="message-time-wrapper">
          <span class="message-time">{{ formatTime(message.time) }}</span>
        </div>

        <!-- 发送/接收消息时头像和消息内容分别布局 -->
        <div class="message-body">
          <!-- 接收消息：头像在左，消息内容在右 -->
          <div v-if="message.id !== userId" class="message-left">
            <AvatarWrapper class="avatar-left"/>
            <div class="message-content-wrapper">
              <div
                  :class="['message', message.id === userId ? 'sent' : 'received']"
              >
                <span class="message-content">{{ message.content }}</span>
              </div>
            </div>
          </div>

          <!-- 发送消息：头像在右，消息内容在左 -->
          <div v-if="message.id === userId" class="message-right">
            <div class="message-content-wrapper">
              <div
                  :class="['message', message.id === userId ? 'sent' : 'received']"
              >
                <span class="message-content">{{ message.content }}</span>
              </div>
            </div>
            <AvatarWrapper class="avatar-right"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {ref, onMounted} from 'vue';
import AvatarWrapper from "@/components/AvatarWrapper.vue";

interface Message {
  id: number; // 用户编号
  time: string; // 消息时间
  content: string; // 消息内容
}

const userId = 1; // 假设当前用户编号为 1
const messages = ref<Message[]>([
  {id: 1, time: '2022-11-01 10:00', content: '你好！'},
  {id: 2, time: '2023-11-10 10:01', content: '你好，有什么可以帮助你的吗？'},
  {id: 1, time: '2024-11-03 10:02', content: '我想了解一下项目进度。'},
  {id: 1, time: '2024-11-04 10:15', content: '还在吗？'},
  {id: 2, time: '2024-11-05 10:15', content: '在的'},
  {id: 3, time: '2024-11-06 10:16', content: '已经完成前期工作了'},
]);

const formatTime = (time: string) => {
  const targetTime = new Date(time);
  const now = new Date();
  const diffTime = now.getTime() - targetTime.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const isLessThan330Days = diffDays < 330;
  const hours = targetTime.getHours().toString().padStart(2, '0');
  const minutes = targetTime.getMinutes().toString().padStart(2, '0');

  if (diffDays < 1) {
    return `${hours}:${minutes}`;
  } else if (diffDays < 2) {
    return `昨天 ${hours}:${minutes}`;
  } else if (isLessThan330Days) {
    const month = (targetTime.getMonth() + 1).toString().padStart(2, '0');
    const date = targetTime.getDate().toString().padStart(2, '0');
    return `${month}-${date} ${hours}:${minutes}`;
  } else {
    const year = targetTime.getFullYear();
    const month = (targetTime.getMonth() + 1).toString().padStart(2, '0');
    const date = targetTime.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${date} ${hours}:${minutes}`;
  }
};

const messagesContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
  background: #f9f9f9;
}

.message-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 保证时间部分垂直居中 */
  margin: 5px 0;
}

.message-time-wrapper {
  width: 100%;
  text-align: center; /* 使时间居中 */
  margin-bottom: 5px; /* 让时间和消息内容之间有间距 */
}

.message-time {
  font-size: 0.8em;
  color: #888;
}

/* 聊天消息容器 */
.message-body {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 10px; /* 让每条消息之间有间距 */
}

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
.avatar-left, .avatar-right {
  width: 30px; /* 头像大小 */
  height: 30px;
  margin: 0 10px; /* 头像和消息内容之间的间距 */
}

/* 消息内容容器 */
.message-content-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 70%; /* 消息框最大宽度 */
  word-wrap: break-word;
}

/* 消息框样式 */
.message {
  padding: 8px;
  border-radius: 4px;
  word-wrap: break-word;
}

/* 发送消息样式 */
.message.sent {
  background-color: #dcf8c6;
  margin-left: 4px; /* 添加左边距，确保消息框不紧贴头像 */
}

/* 接收消息样式 */
.message.received {
  background-color: #fff;
  margin-right: 4px; /* 添加右边距，确保消息框不紧贴头像 */
}

/* 消息内容 */
.message-content {
  margin-top: 2px;
}
</style>
