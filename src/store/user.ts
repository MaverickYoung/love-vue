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
            background: ''
        },
        // 访问token
        accessToken: '',
        // 刷新token
        refreshToken: cache.getRefreshToken(),
        // 用户头像和昵称
        userProfiles: [] as { key: number; value: UserProfile }[]
    }),
    actions: {
        setUser(val: any) {
            this.user = val
        },
        getUserId() {
            return this.user.id
        },
        setTokens(accessToken: string, refreshToken: string) {
            this.accessToken = accessToken
            this.refreshToken = refreshToken
            cache.setRefreshToken(refreshToken)
        },
        clearTokens() {
            this.accessToken = ''
            this.refreshToken = ''
        },
        // 账号登录
        async accountLoginAction(loginForm: any) {
            const {data} = await useAccountLoginApi(loginForm)
            this.setTokens(data.accessToken, data.refreshToken)
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
            this.clearTokens()
        },
        // 获取单个用户资料
        getUserProfile(id: number): UserProfile | undefined {
            if (id === undefined || id === null) return undefined;

            if (id === this.user.id) {
                return {
                    id: this.user.id,
                    nickname: this.user.nickname,
                    avatar: this.user.avatar,
                };
            }
            this.fetchUserProfilesAction(new Set<number>([id])).then(r => null)
            return this.userProfiles.find(item => item.key === id)?.value;
        },
        // 获取用户资料
        async fetchUserProfilesAction(userIdList: Set<number>) {
            // 用来存储不存在的 ID
            const missingIds: number[] = [];

            // 查找不存在的 ID
            userIdList.forEach(userId => {
                if (userId !== this.user.id && !this.userProfiles.some(item => item.key === userId)) {
                    missingIds.push(userId);
                }
            });

            // 获取不存在的 ID
            if (missingIds.length > 0) {
                const {data} = await useUserProfileApi(missingIds);

                // 将获取到的用户资料缓存到 userProfiles 中
                data.forEach((userProfile: UserProfile) => {
                    this.userProfiles.push({key: userProfile.id, value: userProfile});
                });
            }
        },
    }
})
