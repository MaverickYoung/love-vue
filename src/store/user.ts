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
        userProfiles: new Map<number, UserProfile>()
    }),
    getters: {
        getUserProfile: (state) => {
            return (id: number): UserProfile | undefined => {
                if (id === state.user.id) {
                    return {
                        id: state.user.id,
                        nickname: state.user.nickname,
                        avatar: state.user.avatar,
                    };
                }

                return state.userProfiles.get(id)!;
            };
        }

    },
    actions: {
        setUser(val: any) {
            this.user = val
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
            // 设置背景图
            if (data?.background) {
                const base64 = data.background;
                if (base64 && base64 !== this.user.background) {
                    document.body.style.backgroundImage = `url('${base64}')`;
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundRepeat = 'no-repeat';
                    document.body.style.backgroundPosition = 'center';
                }
            }
            this.setUser(data)
        },
        // 用户退出
        async logoutAction() {
            await useLogoutApi()

            // 移除 token
            this.clearTokens()
        },
        // 获取并缓存用户资料
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
