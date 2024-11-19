import {Storage} from "./storage"

const key = {
    refreshTokenKey: 'loveRefreshToken',
    loginUsername: 'loveLoginUsername',
}

// 缓存
class Cache {
    getRefreshToken = (): string => {
        return Storage.getItem(key.refreshTokenKey) ?? ''
    }

    setRefreshToken = (value: string) => {
        Storage.setItem(key.refreshTokenKey, value)
    }

    getLoginUsername = (): string => {
        return Storage.getItem(key.loginUsername) ?? ''
    }

    setLoginUsername = (value: string) => {
        Storage.setItem(key.loginUsername, value)
    }

}

export default new Cache()
