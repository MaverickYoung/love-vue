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
          <div v-if="message.userId !== currentUserId" class="message-left">
            <avatar-wrapper class="avatar-left" :src="getAvatar(message.userId)"/>
            <div class="message-content-wrapper">
              <div class="sent">
                <image-wrapper class="message-content" width="45px"
                               :src="getPoopSrc(message.type)"/>
              </div>
            </div>
          </div>

          <!-- 发送消息：头像在右，消息内容在左 -->
          <div v-else class="message-right">
            <div class="message-content-wrapper">
              <div class="received">
                <image-wrapper class="message-content" width="45px"
                               :src="getPoopSrc(message.type)"/>
              </div>
            </div>
            <avatar-wrapper class="avatar-right" :src="getAvatar(message.userId)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import AvatarWrapper from "@/components/AvatarWrapper.vue";
import {useLogPageApi} from "@/api/poop/log";
import {useUserStore} from "@/store/user";
import {usePoopStore} from "@/store/poop";
import ImageWrapper from "@/components/ImageWrapper.vue";

interface LogItem {
  id: number; // ID
  userId: number; // 用户ID
  time: string; // 消息时间
  type: number; // 便便类型
}

const userStore = useUserStore()
const poopStore = usePoopStore()

// 当前用户ID
const currentUserId = userStore.getUserId();

const userIdList = ref(new Set<number>());

const messages = ref<LogItem[]>([]);

/**
 * 时间格式化
 * @param time 时间
 */
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
  onLogPage();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo(0, messagesContainer.value.scrollHeight);
  }
});

const pagePrams = reactive({
  size: 100,
  current: 1,
})

/**
 * 获取便便日志
 */
const onLogPage = async () => {
  const {data} = (await useLogPageApi(pagePrams.size, pagePrams.current));

  // 更新userIdList
  data?.list?.forEach((item: LogItem) => {
    userIdList.value.add(item.userId);
  });

  await userStore.fetchUserProfilesAction(userIdList.value);

  // 填充数据
  messages.value = data.list.map((item: any) => ({
    id: item.id,
    userId: item.userId,
    time: item.logTime,
    type: item.poopType
  }));
}

const getAvatar = (userId: number) => {
  return userStore.getUserProfile(userId)?.avatar;
}

const getPoopSrc = (id: number): string => {
  return poopStore.getPoop(id)?.src ?? ''
}

// 暴露方法给父组件
defineExpose({
  onLogPage
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
  background: #f1f1f1;
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

  /* 发送消息样式 */

  &.sent {
    background-color: #dcf8c6;
    margin-left: 4px; /* 添加左边距，确保消息框不紧贴头像 */
  }

  /* 接收消息样式 */

  &.received {
    background-color: #fff;
    margin-right: 4px; /* 添加右边距，确保消息框不紧贴头像 */
  }
}

/* 消息内容 */
.message-content {
  margin-top: 2px;
}
</style>
