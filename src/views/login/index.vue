<template>
  <div class="container">
    <div class="form">
      <img :src="love" class="logo" alt="logo">
      <span class="form-span"></span>
      <input v-model="loginForm.username" placeholder="用户名" type="text" class="form-input"/>
      <input v-model="loginForm.password" placeholder="密码" type="text" class="form-input"/>
      <van-row v-if="captchaVisible">
        <van-col span="9">
          <input v-model="loginForm.captcha" type="text" class="form-input" style="width: 80px"
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
import love from "@/assets/love.svg"
import {useCaptchaApi, useCaptchaEnabledApi} from "@/api/sys/auth";
import {router} from "@/router";

const loginForm = reactive({
  username: "",
  password: "",
  key: "",
  captcha: ""
})


const captchaBase64 = ref('')

// 是否显示验证码
const captchaVisible = ref(true)

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
  captchaVisible.value = !captchaVisible.value

  // 重新封装登录数据
  const loginData = {
    username: loginForm.username.trim,
    password: loginForm.password.trim,
    key: loginForm.key,
    captcha: loginForm.captcha.trim
  }
  // 用户登录
  userStore
      .accountLoginAction(loginData)
      .then(() => {
        router.push({path: '/home'})
      })
      .catch(() => {
        if (captchaVisible.value) {
          onCaptcha()
        }
      })
}
</script>

<style scoped>

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
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #d1d9e6,
  -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
}

.form-input:focus {
  box-shadow: inset 4px 4px 4px #d1d9e6,
  inset -4px -4px 4px #f9f9f9;
}

.form-input {
  width: 200px;
  height: 45px;
  margin: 10px 0;
  padding-left: 16px;
  font-size: 16px;
  letter-spacing: 0;
  border: none;
  outline: none;
  background-color: #ecf0f3;
  transition: 0.25s ease;
  border-radius: 8px;
  box-shadow: inset 6px 6px 12px rgba(0, 0, 0, 0.1),
  inset -6px -6px 12px rgba(255, 255, 255, 0.8);
}

.submit {
  width: 200px;
  height: 45px;
  border-radius: 25px;
  margin-top: 25px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  background-color: #4b70e2;
  color: #f9f9f9;
  box-shadow: 8px 8px 16px #d1d9e6,
  -8px -8px 16px #f9f9f9;
  border: none;
  outline: none;
  transition: 0.25s;
}

.submit:active {
  box-shadow: 2px 2px 6px #d1d9e6,
  -2px -2px 6px #f9f9f9;
  transform: scale(0.97);
}

.captcha {
  width: 110px;
  height: 45px;
  margin: 10px 0;
}

</style>