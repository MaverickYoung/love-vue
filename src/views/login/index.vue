<template>
  <div>
    <div class="lo-card login-form">
      <lo-icon icon="love" size="12rem" color="red"/>
      <lo-input v-model="loginForm.username" icon="user" placeholder="用户名"/>
      <lo-input v-model="loginForm.password" icon="password" placeholder="密码" password/>
      <div class="captcha-wrapper" v-if="captchaVisible">
        <lo-input v-model="loginForm.captcha" icon="captcha" placeholder="验证码" v-if="true"/>
        <img :src="captchaBase64" alt="验证码" class="captcha" @click="onCaptcha"/>
      </div>
      <div class="lo-btn-primary submit" @click="onLogin()">登 录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useCaptchaApi, useCaptchaEnabledApi} from "@/api/sys/auth";
import {router} from "@/router";
import {useUserStore} from "@/store/user";
import cache from "@/utlis/cache";
import LoIcon from "@/components/love/lo-icon.vue";
import LoInput from "@/components/love/lo-input.vue";

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

<style scoped>

.login-form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  & > * {
    margin: 1rem 0;
  }

  .captcha-wrapper {
    display: flex;

    ::v-deep(input) {
      width: 9rem !important;
    }

    .captcha {
      border: none;
      border-radius: 1rem;
      margin-left: 1rem;
      box-shadow: var(--shadow);
      width: 8rem;
    }
  }

  .submit {
    width: 18rem;
    margin: 2rem 0 0 0;
  }
}
</style>