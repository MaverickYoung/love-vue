import {defineStore} from 'pinia'
import {useAccountLoginApi, useLogoutApi} from '@/api/sys/auth'
import {useUserInfoApi} from '@/api/sys/user'
import cache from '@/utlis/cache'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        // 用户信息
        user: {
            id: '',
            username: '',
            nickname: '',
            gender: 0,
            avatar: '',
            createTime: ''
        },
        // 访问token
        token: cache.getToken(),
        // 刷新token
        refreshToken: cache.getRefreshToken()
    }),
    actions: {
        setUser(val: any) {
            this.user = val
        },
        setToken(val: any) {
            this.token = val
            cache.setToken(val)
        },
        setRefreshToken(val: any) {
            this.refreshToken = val
            cache.setRefreshToken(val)
        },
        // 账号登录
        async accountLoginAction(loginForm: any) {
            const {data} = await useAccountLoginApi(loginForm)
            this.setToken(data.access_token)
            this.setRefreshToken(data.refresh_token)
        },
        // 获取用户信息
        async getUserInfoAction() {
            const {data} = await useUserInfoApi()
            this.setUser(data)
        },
        // 用户退出
        async logoutAction() {
            await useLogoutApi()

            // 移除 token
            this.setToken(null)
            this.setRefreshToken(null)
        }
    }
})
