import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {useUserStore} from "@/store/user";

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

    // token存在的情况
    if (userStore.token) {
        if (to.path === '/login') {
            next('/poop')
        } else {
            // 用户信息不存在，则重新拉取
            if (!userStore.user.id) {
                try {
                    await userStore.getUserInfoAction()
                } catch (error) {
                    // 请求异常，则跳转到登录页
                    userStore?.setToken('')
                    next('/login')
                    return Promise.reject(error)
                }

                // 错误路由
                router.addRoute(errorRoute)

                next({...to, replace: true})
            } else {
                next()
            }
        }
    } else {
        // 没有token的情况下，可以进入白名单
        if (whiteList.indexOf(to.path) > -1) {
            next()
        } else {
            next('/login')
        }
    }
})

// 路由加载后
router.afterEach(() => {
    NProgress.done()
})



