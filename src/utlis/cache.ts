import { Storage } from './storage';
import { Theme, ThemeConfig } from '@/utlis/theme';

const key = {
  refreshTokenKey: 'loveRefreshToken',
  loginUsername: 'loveLoginUsername',
  theme: 'loveTheme',
  background: 'loveBackground'
};

// 缓存
class Cache {
  getRefreshToken = (): string => {
    return Storage.getItem(key.refreshTokenKey) ?? '';
  };

  setRefreshToken = (value: string) => {
    Storage.setItem(key.refreshTokenKey, value);
  };

  getLoginUsername = (): string => {
    return Storage.getItem(key.loginUsername) ?? '';
  };

  setLoginUsername = (value: string) => {
    Storage.setItem(key.loginUsername, value);
  };

  // 获取主题配置
  getTheme = (): ThemeConfig => {
    const themeConfig = Storage.getItem(key.theme);

    // 如果 themeConfig 是无效的（类型错误或为空），返回默认的亮色主题
    if (!themeConfig || typeof themeConfig.isLight !== 'boolean' || !themeConfig.styles) {
      return {
        isLight: true, // 默认为亮色主题
        styles: {} as Theme
      };
    }
    return themeConfig;
  };

  setTheme = (value: ThemeConfig) => {
    Storage.setItem(key.theme, value);
  };
}

export default new Cache();
