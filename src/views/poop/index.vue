<template>
  <div class="poop-container">
    <div class="header">
      <div class="header-left">
        <p class="title">王子请拉屎</p>
      </div>
      <div class="header-center">
        <div class="clock">
          <div class="time">{{ time }}</div>
          <div class="date">{{ date }}</div>
        </div>
        <div class="circle">

          <div class="circle-button" @click="isPooping=!isPooping">
            <lo-icon v-if="!isPooping" icon="start" size="3rem" color="currentColor"/>
            <lo-icon v-else icon="stop" size="3rem" color="currentColor"/>
          </div>

          <span class="circle-back-1" :class="!isPooping?'stop':''"></span>
          <span class="circle-back-2" :class="!isPooping?'stop':''"></span>
        </div>
      </div>
      <div class="header-right">
        <lo-button-icon icon="ranking"/>
        <lo-button-icon icon="record"/>
        <lo-button-icon icon="reward"/>
      </div>
    </div>
    <div class="main">
      <div class="toilet"/>
      <avatar-wrapper class="left-avatar" :avatar="leftUser.avatar"/>
      <avatar-wrapper class="right-avatar"/>
      <!-- 左侧图片 -->
      <img
          v-if="leftUser.isPooping"
          :src="leftUser.gender === '大帅哥' ? malePooping : femalePooping"
          alt="Pooping"
          class="left-pooping"
      />

      <!-- 右侧图片 -->
      <img
          v-if="rightUser.isPooping"
          :src="rightUser.gender === '大帅哥' ? malePooping : femalePooping"
          alt="Pooping"
          class="right-pooping"
      />


    </div>
    <div class="footer">
      <p>距离你上次便便：<b>{{ timeDifference }}</b></p>
      <p>上次便便时长：<b>{{ leftUser.lastPoopDuration }}</b></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {femalePooping, malePooping} from '@/assets/imageAssets'
import AvatarWrapper from "@/components/love/lo-avatar.vue";
import LoIcon from "@/components/love/lo-icon.vue";
import LoButtonIcon from "@/components/love/lo-button-icon.vue";
import {useUserStore} from "@/store/user";

type User = {
  id: number;
  nickname: string,
  avatar: string,
  gender: string,
  poopCountToday: number,
  isPooping: boolean,
}

const time = ref();
const date = ref();
const timeDifference = ref()

interface PoopHistory {
  lastPoopTime: string | null;
  lastPoopDuration: string | null;
}


const leftUser = ref<User>({
  id: 0,
  nickname: '傅傅大帅哥',
  avatar: 'data:image/png;base64,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',
  gender: '大帅哥',
  poopCountToday: 0,
  isPooping: true,
});
const rightUser = ref<User>({
  id: 1,
  nickname: '胡胡小仙女',
  avatar: '',
  gender: '小仙女',
  poopCountToday: 1,
  isPooping: true,
});

const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const updateClock = () => {
  const now = new Date();

  // 时间
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  time.value = `${hours}:${minutes}`;

  // 日期
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateValue = String(now.getDate()).padStart(2, '0');
  date.value = `${month}月${dateValue}日 ${days[now.getDay()]}`;
}


const calculateTimeDifference = () => {
  const now = new Date();

  // 如果 lastPoopTime 为空，则跳过计算
  if (!leftUser.value.lastPoopTime) {
    timeDifference.value = 'N/A';  // 或者显示其他提示信息
    return;
  }

  // 将 lastPoopTime 字符串转换为 Date 对象
  const lastPoopTime = new Date(leftUser.value.lastPoopTime);

  // 计算时间差
  const diffInMilliseconds = now.getTime() - lastPoopTime.getTime();

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  // 构造显示的时间差字符串
  let timeString = '';
  if (hours > 0) timeString += `${hours}小时 `;
  if (minutes > 0) timeString += `${minutes}分钟 `;
  if (seconds > 0) timeString += `${seconds}秒`;

  // 如果时间差为 0，则显示 刚刚
  timeDifference.value = timeString || '刚刚';
}

const isPooping = ref(false);

const message = ref();


// 获取环境变量配置
const apiUrl = import.meta.env.VITE_API_URL as string;
const token = useUserStore().accessToken;

const startSseConnection = () => {
  // 创建一个 EventSource 实例，建立与服务器的连接
  const eventSource = new EventSource(`${apiUrl}/poop/sse/connect/${token}`);

  // 监听服务器推送的消息
  eventSource.onmessage = (event) => {
    if (event.data === "ping") {
      console.log('收到心跳消息');
      return;
    }

    const receivedData = JSON.parse(event.data); // 解析服务器发送的数据
    console.log('接收到推送的消息：', receivedData);
    // 你可以在这里更新 UI 或做其他操作
  };

  // 处理连接打开事件
  eventSource.onopen = () => {
    console.log('SSE 连接已打开');
  };

  // 处理错误事件
  eventSource.onerror = (error) => {
    console.error('SSE 连接发生错误：', error);
  };
}


onMounted(() => {
  updateClock(); // 初始化
  setInterval(() => {
    calculateTimeDifference();
    updateClock();
  }, 1000);

  startSseConnection()
});
</script>

<style scoped>
* {
  display: flex;
  justify-content: center;
  align-items: center;
}

.poop-container {
  height: 100dvh;
  width: 100dvw;
  flex-direction: column;

  & > div {
    width: 80%;
    box-shadow: var(--shadow);
    margin: 1rem;
    border-radius: 1rem;
    padding: 1rem;
  }

  .header {
    margin-top: 3rem;
    justify-content: space-between; /* 左右平分剩余空间 */
    align-items: center; /* 垂直居中 */

    .header-left, .header-right {
      flex: 1;
    }

    .header-left {
      .title {
        writing-mode: vertical-rl;
        font-family: 'ZCOOL KuaiLe', cursive;
        font-size: 2.5rem; /* 设置较大的字体 */
        color: var(--primary); /* 设置文字透明 */
        text-shadow: .2rem .2rem .5rem rgba(0, 0, 0, 0.2); /* 添加文字阴影 */
      }
    }

    .header-center {
      width: 15rem;
      flex-direction: column;

      .clock, .circle {
        margin: .5rem 1rem;
      }

      .clock {
        text-align: center;
        color: black;
        flex-direction: column;
      }

      .time {
        font-size: 4rem;
        margin: 0.5rem 0;
        font-weight: 600;
      }

      .date {
        font-size: 1.5rem;
        margin: 0.2rem 0;
        font-weight: 550;
      }
    }

    .header-right {
      flex-flow: column;

      div {
        margin: .5rem;
      }
    }

    .circle {
      width: 9rem;
      height: 9rem;
      position: relative;

      .circle-button {
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        color: var(--primary);
        box-shadow: var(--shadow);
        z-index: 300;
      }

      .circle-back-1, .circle-back-2 {
        position: absolute;
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        filter: blur(1px);
        z-index: 100;

        &.stop {
          animation-play-state: paused;
        }
      }

      .circle-back-1 {
        box-shadow: var(--shadow);
        background: linear-gradient(to bottom right, var(--greyLight-2) 0%, var(--white) 100%);
        animation: waves 2s linear infinite;
      }

      .circle-back-2 {
        box-shadow: var(--shadow);
        animation: waves 2s linear 1s infinite;
      }
    }
  }

  .main {
    position: relative;
    padding: 2rem;
    border: 1rem solid transparent;
    box-shadow: var(--shadow), var(--inner-shadow);

    .toilet {
      width: 35rem;
      height: 35rem;
    }

    .left-pooping {
      left: 10rem;
      transform: translate(-50%, -50%);
    }

    .right-pooping {
      right: 10rem;
      transform: translate(50%, -50%) scaleX(-1); /* 镜像翻转 */
    }

    .left-pooping, .right-pooping {
      position: absolute;
      width: 13rem;
      top: 25rem;
    }

    .left-avatar, .right-avatar {
      position: absolute;
      top: 3rem;
    }

    .left-avatar {
      left: 3rem;
    }

    .right-avatar {
      right: 3rem;
    }
  }

  .footer {
    flex-direction: column;
  }
}

@keyframes waves {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}

</style>
