<template>
  <div class="chat-container">
    <div class="messages" ref="messagesContainer">
      <div
          v-for="message in messages"
          :key="message.id"
          class="message-container"
      >
        <span class="message-time">{{ formatTime(message.time) }}</span>
        <div
            :class="['message', message.id === userId ? 'sent' : 'received']"
        >
          <span class="message-content">{{ message.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

interface Message {
  id: number; // 用户编号
  time: string; // 消息时间
  content: string; // 消息内容
}

const userId = 1; // 假设当前用户编号为 1
const messages = ref<Message[]>([
  {id: 1, time: '2024-11-05 10:00', content: '你好！'},
  {id: 2, time: '2024-11-05 10:01', content: '你好，有什么可以帮助你的吗？'},
  {id: 1, time: '2024-11-05 10:02', content: '我想了解一下项目进度。'},
  {id: 1, time: '2024-11-05 10:15', content: '还在吗？'},
  {id: 2, time: '2024-11-05 10:15', content: '在的'},
  {id: 3, time: '2024-11-05 10:16', content: '已经完成前期工作了'},
]);

const formatTime = (time: string) => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
  padding: 10px;
  background: #f9f9f9;
}

.message-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 5px 0;
}

.message-time {
  text-align: center;
  font-size: 0.8em;
  color: #888;
  margin-bottom: 2px;
}

.message {
  padding: 8px;
  border-radius: 4px;
  max-width: 70%; /* 限制消息框的最大宽度 */
}

.message.sent {
  align-self: flex-end;
  background-color: #dcf8c6;
}

.message.received {
  align-self: flex-start;
  background-color: #fff;
}

.message-content {
  margin-top: 2px;
}
</style>
