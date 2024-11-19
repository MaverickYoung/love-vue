import {defineStore} from 'pinia'
import {useAccountLoginApi, useLogoutApi} from '@/api/sys/auth'
import {useUserInfoApi, useUserProfileApi} from '@/api/sys/user'
import cache from '@/utlis/cache'

export interface UserProfile {
    id: number;
    nickname: string | null;
    avatar: string | null;
}

export const useUserStore = defineStore('userStore', {
    state: () => ({
        // 用户信息
        user: {
            id: 0,
            username: '',
            nickname: '',
            gender: 0,
            avatar: '',
            createTime: ''
        },
        // 访问token
        token: cache.getToken(),
        // 刷新token
        refreshToken: cache.getRefreshToken(),
        // 用户头像和昵称
        userProfiles: new Map<number, UserProfile>()
    }),
    actions: {
        setUser(val: any) {
            this.user = val
        },
        setToken(val: string) {
            this.token = val
            cache.setToken(val)
        },
        setRefreshToken(val: string) {
            this.refreshToken = val
            cache.setRefreshToken(val)
        },
        getUserId() {
            return this.user.id
        },
        // 账号登录
        async accountLoginAction(loginForm: any) {
            const {data} = await useAccountLoginApi(loginForm)
            this.setToken(data.accessToken)
            this.setRefreshToken(data.refreshToken)
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
            this.setToken('')
            this.setRefreshToken('')
        },
        // 获取单个用户资料
        getUserProfile(id: number): UserProfile | undefined {
            if (id === this.user.id) {
                return {
                    id: this.user.id,
                    nickname: this.user.nickname,
                    avatar: this.user.avatar
                }
            } else {
                return this.userProfiles.get(id);
            }
        },
        // 获取用户资料
        async fetchUserProfilesAction(userIdList: Set<number>) {
            // 用来存储不存在的 ID
            const missingIds: number[] = [];

            // 查找不存在的 ID
            userIdList.forEach((userId) => {
                if (!this.userProfiles.has(userId) && userId !== this.user.id) {
                    missingIds.push(userId);
                }
            });

            // 获取不存在的 ID
            if (missingIds.length > 0) {
                const {data} = await useUserProfileApi(missingIds);

                // 将获取到的用户资料缓存到 userProfiles 中
                data.forEach((userProfile: UserProfile) => {
                    this.userProfiles.set(userProfile.id, userProfile);
                });
            }
        },
    }
})
