<template>
  <div>
    <div class="lo-card login-form">
      <lo-icon icon="love" size="12rem" color="red"/>
      <lo-input v-model="loginForm.username" icon="user" placeholder="用户名"/>
      <lo-input v-model="loginForm.password" icon="password" placeholder="密码" password/>
      <div class="captcha-wrapper">
        <lo-input v-model="loginForm.captcha" icon="captcha" placeholder="验证码" v-if="true"/>
        <img :src="captchaBase64" alt="验证码" class="captcha" @click="onCaptcha"/>
      </div>
      <!--      <custom-button @click="onLogin()" class="submit">登 录</custom-button>-->
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

}

/*

* {
  !* 字体无法选中 *!
  user-select: none;
}

body {
  font-size: 12px;
}

.lo-card > * {
  margin: 10px 0;
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
    width: 100%; !* 线条从中心向两边扩展 *!
  }
}
*/

</style>