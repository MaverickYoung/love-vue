<template>
  <div class="container">
    <div class="form">
      <image-wrapper src="/src/assets/love.svg" alt="logo" class="logo"/>
      <span class="form-span"></span>
      <input v-model="loginForm.username" placeholder="用户名" type="text" class="form-input"/>
      <div class="input-container">
        <input v-model="loginForm.password" placeholder="密码" :type="isPasswordVisible ? 'text' : 'password'"
               class="form-input"/>
        <div
            class="eye-icon"
            @click="togglePasswordVisibility"
        >
          <image-wrapper src="/src/assets/eye-show.svg" v-if="isPasswordVisible" class="eye"/>
          <div v-else>
            <div class="slash-background"></div>
            <div class="slash"></div>
            <image-wrapper src="/src/assets/eye-show.svg" class="eye"/>
          </div>
        </div>
      </div>

      <van-row v-if="captchaVisible">
        <van-col span="9">
          <input v-model="loginForm.captcha" type="text" class="form-input captcha-input"
                 placeholder="验证码"/>
        </van-col>
        <van-col span="2" style="width: 10px">
        </van-col>
        <van-col span="13">
          <img :src="captchaBase64" alt="" class="captcha" @click="onCaptcha"/></van-col>
      </van-row>
      <button class="submit" @click="onLogin()">登 录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useCaptchaApi, useCaptchaEnabledApi} from "@/api/sys/auth";
import {router} from "@/router";
import {useUserStore} from "@/store/user";
import ImageWrapper from "@/components/ImageWrapper.vue";
import cache from "@/utlis/cache";

const userStore = useUserStore()

const loginForm = reactive({
  username: cache.getLoginUsername() as string,
  password: "" as string,
  key: "" as string,
  captcha: "" as string
})


const captchaBase64 = ref('')

// 是否显示验证码
const captchaVisible = ref(false)


const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

onMounted(() => {
  onCaptchaEnabled()
})

const onCaptchaEnabled = async () => {
  const {data} = await useCaptchaEnabledApi()
  captchaVisible.value = data

  if (data) {
    await onCaptcha()
  }
}

const onCaptcha = async () => {
  const {data} = await useCaptchaApi()
  if (data.enabled) {
    captchaVisible.value = true
  }
  loginForm.key = data.key
  captchaBase64.value = data.image
}

const onLogin = async () => {
  // 重新封装登录数据
  const loginData = {
    username: loginForm.username.trim(),
    password: loginForm.password.trim(),
    key: loginForm.key,
    captcha: loginForm.captcha.trim()
  }

  // 用户登录
  userStore
      .accountLoginAction(loginData)
      .then(() => {
        router.push({path: '/poop'})
        cache.setLoginUsername(loginData.username)
      })
      .catch(() => {
        if (captchaVisible.value) {
          onCaptcha()
        }
      })
}
</script>

<style scoped lang="less">

* {
  box-sizing: border-box;
  /* 字体无法选中 */
  user-select: none;
}

body {
  font-size: 12px;
}

.logo {
  width: 80px;
  height: 80px;
}

.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  width: 300px;
  height: 400px;
  padding: 25px;
  background-color: var(--van-background);
  box-shadow: 10px 10px 10px var(--box-shadow-soft),
    -10px -10px 10px var(--box-shadow-deep);
  border-radius: 12px;
  overflow: hidden;
}

.form-input {
  width: 200px;
  height: 45px;
  margin: 10px 0;
  padding-left: 16px;
  padding-right: 30px;
  font-size: 16px;
  letter-spacing: 1px;
  border: none;
  background-color: var(--van-background);
  transition: 0.25s ease;
  border-radius: 8px;
  box-shadow: inset 6px 6px 12px var(--box-shadow-bottom),
    inset -6px -6px 12px var(--box-shadow-top);
  color: var(--van-text-color);

  &:focus {
    box-shadow: inset 4px 4px 4px var(--box-shadow-soft),
      inset -4px -4px 4px var(--box-shadow-deep);
  }

  &::placeholder {
    color: var(--van-text-color-5);
  }
}

.captcha-input {
  width: 80px;
  padding-left: 12px;
  padding-right: 12px;
}

.submit {
  width: 200px;
  height: 45px;
  border-radius: 25px;
  margin-top: 25px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background-color: var(--van-primary-color);
  color: white;
  border: none;
  outline: none;
  transition: 0.25s;
  touch-action: manipulation;

  &:active {
    box-shadow: 2px 2px 6px var(--box-shadow-soft),
      -2px -2px 6px var(--box-shadow-deep);
    transform: scale(0.97);
    filter: brightness(90%);
  }
}


.captcha {
  width: 110px;
  height: 45px;
  margin: 10px 0;
}

.input-container {
  position: relative;
}

.eye-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
}

.eye {
  width: 20px;
}

.slash-background {
  position: absolute;
  width: 0;
  height: 3px;
  background-color: var(--van-background);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  animation: draw-slash 0.3s forwards;
}

.slash {
  position: absolute;
  width: 0;
  height: 1px;
  background: #444444;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  animation: draw-slash 0.3s forwards;
}

@keyframes draw-slash {
  to {
    width: 100%; /* 线条从中心向两边扩展 */
  }
}

</style>