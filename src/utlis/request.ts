import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { useUserStore } from '@/store/user';
import { showDialog, showNotify } from 'vant';

// axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL as any,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
});

interface Request {
  url: string;
  params: any;
  timestamp: number;
}

let recentRequests: Request[] = [];

const THROTTLE_ERROR = '请求被节流';

/**
 * 节流函数：检查是否有相同请求在 1 秒内发生
 * @param url 请求的 URL
 * @param params 请求的参数
 * @param currentTimestamp 当前请求的时间戳
 * @returns 是否应该抛出节流错误
 */
const isRequestThrottled = (
  url: string,
  params: any,
  currentTimestamp: number,
): boolean =>
  recentRequests.some(
    (request) =>
      request.url === url &&
      JSON.stringify(request.params) === JSON.stringify(params) &&
      currentTimestamp - request.timestamp < 1000,
  );

/**
 * 更新历史请求记录，保留最近 1 秒内的请求
 * @param url 请求的 URL
 * @param params 请求的参数
 * @param timestamp 请求的时间戳
 */
const updateRecentRequests = (
  url: string,
  params: any,
  timestamp: number,
): void => {
  recentRequests.push({ url, params, timestamp });

  // 清理 1 秒前的请求
  recentRequests = recentRequests.filter(
    (request) => timestamp - request.timestamp < 1000,
  );
};

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    const userStore = useUserStore();

    if (userStore?.accessToken) {
      config.headers.Authorization = userStore.accessToken;
    }

    config.headers['Accept-Language'] = 'zh-CN';

    // 当前请求的时间戳
    const currentTimestamp = Date.now();

    // 判断是否触发节流
    if (isRequestThrottled(config.url, config.params, currentTimestamp)) {
      return Promise.reject(new Error(THROTTLE_ERROR));
    }

    // 更新请求记录
    updateRecentRequests(config.url, config.params, currentTimestamp);

    // 追加时间戳，防止GET请求缓存
    if (config.method?.toUpperCase() === 'GET') {
      config.params = { ...config.params, t: currentTimestamp };
    }

    if (
      Object.values(config.headers).includes(
        'application/x-www-form-urlencoded',
      )
    ) {
      config.data = qs.stringify(config.data);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 是否刷新
let isRefreshing = false;
// 重试请求
let requests: Array<() => void> = [];

// 刷新token
export const useRefreshTokenApi = (refreshToken: string) => {
  return service.post(`/sys/auth/token?refreshToken=${refreshToken}`);
};

// 响应拦截器
service.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    const userStore = useUserStore();

    if (response.status !== 200) {
      return Promise.reject(new Error(response.statusText || 'Error'));
    }

    const res = response.data;
    if (Object.prototype.toString.call(res) === '[object Blob]') {
      return response;
    }

    // 响应成功
    if (res.code === 1000) {
      return res;
    }

    // 刷新令牌失效（需跳转登录页）
    if (res.code === 3002) {
      return handleAuthorized();
    }

    // 访问令牌失效或没有权限，尝试刷新 accessToken
    if (res.code === 3001 || res.code === 2001) {
      const config = response.config;
      if (!isRefreshing) {
        isRefreshing = true;

        const refreshToken = userStore.refreshToken;
        if (!refreshToken) {
          return handleAuthorized();
        }

        try {
          const { data } = await useRefreshTokenApi(refreshToken);
          // 刷新成功，更新 Token
          userStore.setTokens(data.accessToken, data.refreshToken);
          config.headers!.Authorization = data.accessToken;
          // 重试队列中的请求
          requests.forEach((cb: any) => cb());
          requests = [];
          return service(config);
        } catch (e) {
          // 刷新 accessToken 失败，但不清除 refreshToken
          showNotify({ type: 'warning', message: '服务器异常，请稍后重试' });
          requests.forEach((cb: any) => cb());
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 正在刷新 Token，等待刷新完成再重试请求
        return new Promise((resolve) => {
          requests.push(() => {
            config.headers!.Authorization = userStore.accessToken;
            resolve(service(config));
          });
        });
      }
    }

    // 其他错误提示
    showNotify({ type: 'danger', message: res.msg });
    return Promise.reject(new Error(res.msg || 'Error'));
  },
  (error) => {
    let errorMessage;
    if (error.message.includes('Network Error')) {
      errorMessage = '网络错误，请检查您的网络连接';
    } else if (error.message.includes('timeout')) {
      errorMessage = '请求超时，请稍后再试';
    } else if (error.message.includes(THROTTLE_ERROR)) {
      // 如果是节流错误，则不提示
      return Promise.reject(error);
    } else {
      errorMessage = '未知错误';
      console.log(error.message);
    }

    showNotify({ type: 'danger', message: errorMessage });
    return Promise.reject(error);
  },
);

const handleAuthorized = () => {
  showDialog({
    title: '提示',
    message: '登录超时，请重新登录',
    confirmButtonText: '重新登录',
    theme: 'round-button', // 圆角按钮样式
  }).then(() => {
    const userStore = useUserStore();

    userStore.clearTokens();
    location.reload();

    return Promise.reject('登录超时，请重新登录');
  });
};

// 导出 axios 实例
export default service;
