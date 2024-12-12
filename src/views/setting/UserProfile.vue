<template>

  <avatar-wrapper :src="user.avatar" size="80px" @click="showAvatarPopup=true"/>

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
  <div class="info-item" @click="showGenderPopup=true">
    <div class="label">性别</div>
    <div class="value">{{ genderLabel }}</div>
  </div>

  <br/>
  <div class="info-item" @click="router.push('/setting/theme-manager')">
    <div class="label">主题</div>
    <div class="value">
      <div class="color-box"/>
    </div>
  </div>
  <div class="info-item" @click="showBackgroundPopup=true">
    <div class="label">背景</div>
    <div class="value"></div>
  </div>

  <van-popup :show="showGenderPopup" round teleport="body">
    <div class="gender-form">
      <h2>性别选择</h2>
      <div class="gender-options">
        <div
            v-for="option in genderOptions"
            :key="option.value"
            class="gender-item"
            :class="{ active: option.value === user.gender }"
            :style="{ '--default-color': option.color }"
            @click="setGender(option.value)"
        >
          <image-wrapper :src="option.image" class="icon-gender"/>
          <p>{{ option.label }}</p>
        </div>
      </div>
    </div>
  </van-popup>

  <image-popup :src="user.avatar" :show="showAvatarPopup" @update:show="showAvatarPopup=false">
    <image-popup-button label="更换头像" @click="triggerAvatarFileSelect"/>
    <!-- 隐藏的文件输入框 -->
    <input
        type="file"
        ref="avatarInput"
        accept="image/*"
        style="display: none;"
        @change="handleAvatarFileChange"
    />
    <image-popup-button label="保存头像" @click="saveBase64AsImage(user.avatar,'头像')"/>
  </image-popup>

  <image-popup :src="user.background" :show="showBackgroundPopup" @update:show="showBackgroundPopup=false">
    <image-popup-button label="更换背景图" @click="triggerBackgroundFileSelect"/>
    <!-- 隐藏的文件输入框 -->
    <input
        type="file"
        ref="backgroundInput"
        accept="image/*"
        style="display: none;"
        @change="handleBackgroundFileChange"
    />
    <image-popup-button label="保存背景图" @click="saveBase64AsImage(user.background,'背景图')"/>
  </image-popup>

</template>

<script setup lang="ts">
import AvatarWrapper from "@/components/AvatarWrapper.vue";
import {useUserStore} from "@/store/user";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import ImageWrapper from "@/components/ImageWrapper.vue";
import {useUpdateAvatarApi, useUpdateBackgroundApi, useUserInfoSubmitApi} from "@/api/sys/user";
import ImagePopup from "@/components/ImagePopup/index.vue";
import ImagePopupButton from "@/components/ImagePopup/ImagePopupButton.vue";
import {saveBase64AsImage} from "@/utlis/file";

const userStore = useUserStore()

const user = userStore.user

const router = useRouter()

type GenderOption = {
  value: number;
  label: string;
  color: string;
  image: string;
};

const genderOptions: GenderOption[] = [
  {
    value: 1,
    label: "大帅哥",
    color: "#1296db",
    image: "/src/assets/male.svg",
  },
  {
    value: 0,
    label: "神秘人",
    color: "var(--van-text-color-2)",
    image: "/src/assets/unknown.svg",
  },
  {
    value: 2,
    label: "小仙女",
    color: "#fb73e5",
    image: "/src/assets/female.svg",
  },
];

const genderLabel = ref<string>('');

const setGenderLabel = () => {
  const genderOption = genderOptions.find(option => option.value === user.gender);
  genderLabel.value = genderOption ? genderOption.label : "神秘人";
};

const setGender = async (value: number) => {
  await useUserInfoSubmitApi({
    gender: value,
  })

  await userStore.getUserInfoAction()
  user.gender = userStore.user.gender
  setGenderLabel()
  showGenderPopup.value = false;
}

const showGenderPopup = ref(false);
const showAvatarPopup = ref(false);
const showBackgroundPopup = ref(false);

const avatarInput = ref<HTMLInputElement | null>(null);
const backgroundInput = ref<HTMLInputElement | null>(null);

// 触发头像文件选择框
const triggerAvatarFileSelect = () => {
  avatarInput.value?.click();
};

// 触发背景图文件选择框
const triggerBackgroundFileSelect = () => {
  backgroundInput.value?.click();
};

// 处理头像文件选择事件
const handleAvatarFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  await useUpdateAvatarApi(file);

  await userStore.getUserInfoAction()

  user.avatar = userStore.user.avatar;

};

// 处理背景图文件选择事件
const handleBackgroundFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  await useUpdateBackgroundApi(file);

  await userStore.getUserInfoAction()

  user.background = userStore.user.background;

};
onMounted(() => {
  setGenderLabel();
})
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

.gender-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 14px;

  h2 {
    margin-bottom: 12px;
  }

  .gender-options {
    display: flex;
    border-radius: 10px;

    .gender-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      width: 75px; /* 圆的宽度 */
      height: 75px; /* 圆的高度 */
      border-radius: 50%; /* 圆形 */
      overflow: hidden; /* 确保内容不超出圆形 */
      padding: 10px;
      margin: 5px;

      font-size: 13px;
      font-weight: bold;

      --default-color: var(--van-text-color);
      color: var(--default-color);

      .icon-gender {
        width: 35px;
        height: 35px;
        margin: 10px 20px;
        transform: translateX(-1000px);
        color: inherit;
        filter: drop-shadow(1000px 0 0 currentColor);
      }

      p {
        color: inherit;
      }
    }

    .active {
      color: white;
      background-color: var(--default-color);
    }
  }
}
</style>