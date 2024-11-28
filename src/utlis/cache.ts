import {Storage} from "./storage"
import {ITheme, lightTheme} from "@/store/theme";

const key = {
    refreshTokenKey: 'loveRefreshToken',
    loginUsername: 'loveLoginUsername',
    theme: 'loveTheme',
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

    getTheme = (): ITheme => {
        return Storage.getItem(key.theme) ?? {theme: lightTheme, isLight: true}
    }

    setTheme = (value: ITheme) => {
        Storage.setItem(key.theme, value)
    }
}

export default new Cache()
