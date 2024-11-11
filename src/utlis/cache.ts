import {Storage} from "./storage"

const key = {
    tokenKey: 'loveToken',
    refreshTokenKey: 'loveRefreshToken',
}

// 缓存
class Cache {
    getToken = (): string => {
        return Storage.getItem(key.tokenKey) || ''
    }

    setToken = (value: string) => {
        Storage.setItem(key.tokenKey, value)
    }

    getRefreshToken = (): string => {
        return Storage.getItem(key.refreshTokenKey) || ''
    }

    setRefreshToken = (value: string) => {
        Storage.setItem(key.refreshTokenKey, value)
    }
}

export default new Cache()
