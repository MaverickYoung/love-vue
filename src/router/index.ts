import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {useUserStore} from "@/store/user";
import {useRefreshTokenApi} from "@/utlis/request";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/poop',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {description: '登陆'}
    },
    {
        path: '/layout',
        name: 'layout',
        component: () => import("@/layout/index.vue"),
        meta: {description: '布局'},
        children: []
    },
    {
        path: '/poop',
        name: 'poop',
        component: () => import("@/views/poop/index.vue"),
        meta: {description: '便便'},
    },
    {
        path: '/404',
        name: '404',
        component: () => import("@/views/404.vue"),
        meta: {description: '404'},

    }
]

export const errorRoute: RouteRecordRaw = {
    path: '/:pathMatch(.*)',
    redirect: '/404'
}

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
})


// 白名单列表
const whiteList = ['/login']

// 路由跳转前
router.beforeEach(async (to, from, next) => {
    NProgress.start()

    const userStore = useUserStore()

    // 检查是否存在 accessToken
    if (userStore.accessToken) {
        if (to.path === '/login') {
            next('/poop')
        } else {
            // 用户信息不存在时重新拉取
            if (!userStore.user.id) {
                try {
                    await userStore.getUserInfoAction()
                } catch (error) {
                    // 获取用户信息失败，清空 Token 并跳转登录页
                    userStore.clearTokens()
                    next('/login')
                    return Promise.reject(error)
                }

                // 添加错误路由
                router.addRoute(errorRoute)

                next({ ...to, replace: true })
            } else {
                next()
            }
        }
    } else {
        // 没有 accessToken 的情况下，检查 refreshToken
        const refreshToken = userStore.refreshToken
        if (refreshToken) {
            try {
                // 使用 refreshToken 刷新 accessToken
                const { data } = await useRefreshTokenApi(refreshToken)
                userStore.setTokens(data.accessToken, data.refreshToken)

                next({ ...to, replace: true })
            } catch (error) {
                // 刷新令牌失败，跳转到登录页
                userStore.clearTokens()
                next('/login')
                return Promise.reject(error)
            }
        } else {
            // 没有 refreshToken，且不在白名单中，跳转到登录页
            if (whiteList.includes(to.path)) {
                next()
            } else {
                next('/login')
            }
        }
    }
})


// 路由加载后
router.afterEach(() => {
    NProgress.done()
})



