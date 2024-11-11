import axios, {AxiosResponse} from 'axios' ;
import qs from 'qs';
import {useUserStore} from '@/store/user';
import cache from '@/utlis/cache';
import {Dialog, showNotify} from "vant";

// axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL as any,
    timeout: 60000,
    headers: {'Content-Type': 'application/json;charset=UTF-8'}
})

// 请求拦截器
service.interceptors.request.use(
    (config: any) => {
        const userStore = useUserStore()

        if (userStore?.token) {
            config.headers.Authorization = userStore.token
        }

        config.headers['Accept-Language'] = 'zh-CN'

        // 追加时间戳，防止GET请求缓存
        if (config.method?.toUpperCase() === 'GET') {
            config.params = {...config.params, t: new Date().getTime()}
        }

        if (Object.values(config.headers).includes('application/x-www-form-urlencoded')) {
            config.data = qs.stringify(config.data)
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 是否刷新
let isRefreshToken = false
// 重试请求
let requests: any[] = []

// 刷新token
const useRefreshTokenApi = (refreshToken: string) => {
    return service.post('/sys/auth/token?refreshToken=' + refreshToken)
}

// 响应拦截器
service.interceptors.response.use(
    async (response: AxiosResponse<any>) => {
        const userStore = useUserStore()

        if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText || 'Error'))
        }

        const res = response.data
        if (Object.prototype.toString.call(res) === '[object Blob]') {
            return response
        }

        // 响应成功
        if (res.code === 1000) {
            return res
        }

        // 刷新令牌 失效，跳转到登录页
        if (res.code === 3002) {
            return handleAuthorized()
        }

        // 没有权限，如：未登录、访问令牌 过期
        if (res.code === 3002 || res.code === 2001) {
            const config = response.config
            if (!isRefreshToken) {
                isRefreshToken = true

                // 不存在 刷新令牌，重新登录
                const refreshToken = cache.getRefreshToken()
                if (!refreshToken) {
                    return handleAuthorized()
                }

                try {
                    const {data} = await useRefreshTokenApi(refreshToken)
                    // 设置新 token
                    userStore.setToken(data.access_token)
                    config.headers!.Authorization = data.access_token
                    requests.forEach((cb: any) => {
                        cb()
                    })
                    requests = []
                    return service(config)
                } catch (e) {
                    // 刷新失败
                    requests.forEach((cb: any) => {
                        cb()
                    })
                    return handleAuthorized()
                } finally {
                    requests = []
                    isRefreshToken = false
                }
            } else {
                // 多个请求的情况
                return new Promise(resolve => {
                    requests.push(() => {
                        config.headers!.Authorization = userStore.token
                        resolve(service(config))
                    })
                })
            }
        }
        // 显示错误提示，确保 msg 未定义时有默认值
        const errorMessage = res.msg !== undefined ? res.msg : '发生错误';
        showNotify(errorMessage);

        return Promise.reject(new Error(errorMessage));
    },
    error => {
        // 统一错误处理
        const errorMessage = error.message || '网络错误';
        showNotify(errorMessage)
        return Promise.reject(error)
    }
)

const handleAuthorized = () => {
    Dialog.alert({
        title: '提示',
        message: '登录超时，请重新登录',
        showCancelButton: false,
        confirmButtonText: '重新登录',
        theme: 'round-button' // 圆角按钮样式，可根据需要设置
    }).then(() => {
        const userStore = useUserStore()

        userStore?.setToken('')
        userStore?.setRefreshToken('')
        location.reload()

        return Promise.reject('登录超时，请重新登录')
    })
}

// 导出 axios 实例
export default service
