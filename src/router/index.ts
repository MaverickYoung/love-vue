import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {description: '登陆'}
    },
    {
        path: '/layout',
        name: 'layout',
        component: import("@/layout/index.vue"),
        meta: {description: '布局'},
        children: []
    },
    {
        path: '/poop',
        name: 'poop',
        component: import("@/views/poop/index.vue"),
        meta: {description: '记录'},
    },
    {
        path: '/404',
        name: '404',
        component: import("@/views/404.vue"),
        meta: {description: '404'},

    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
})



