import cache from "@/utlis/cache";

// 主题接口，定义所有可配置的 CSS 变量
export interface Theme {
    '--van-primary-color': string;
    '--van-success-color': string;
    '--van-danger-color': string;
    '--van-warning-color': string;
    '--van-text-color': string;
    '--van-text-color-2': string;
    '--van-text-color-3': string;
    '--van-background': string;
    '--van-background-2': string;
    '--van-background-3': string;
    '--box-shadow': string;
}

export const lightTheme: Theme = {
    '--van-primary-color': '#1989fa',
    '--van-success-color': '#07c160',
    '--van-danger-color': '#ee0a24',
    '--van-warning-color': '#ff976a',
    '--van-text-color': '#323233',
    '--van-text-color-2': '#969799',
    '--van-text-color-3': '#c8c9cc',
    '--van-background': '#f7f8fa',
    '--van-background-2': '#fff',
    '--van-background-3': '#f1f1f1',
    '--box-shadow': 'rgba(0, 0, 0, 0.1)',
}

const darkTheme: Theme = {
    '--van-primary-color': '#1989fa',
    '--van-success-color': '#07c160',
    '--van-danger-color': '#ee0a24',
    '--van-warning-color': '#ff976a',
    '--van-text-color': '#f5f5f5',
    '--van-text-color-2': '#707070',
    '--van-text-color-3': '#4d4d4d',
    '--van-background': '#000',
    '--van-background-2': '#1c1c1e',
    '--van-background-3': '#37363b',
    '--box-shadow': 'rgba(255,255,255,0.1)'
}

/**
 * 切换主题
 * @param theme 主题配置
 */
export const switchTheme = (theme: 'light' | 'dark' | Theme ) => {
    if (theme === 'light') {
        applyTheme(lightTheme)
    } else if (theme === 'dark') {
        applyTheme(darkTheme)
    } else {
        applyTheme(theme);
    }
}

/**
 * 应用主题
 * @param theme 主题配置
 */
export const applyTheme = (theme: Theme) => {
    Object.entries(theme).forEach(([key, value]) => {
        const cssValue = typeof value === 'number' ? value.toString() : value;
        document.documentElement.style.setProperty(key, cssValue);
    });

    cache.setTheme(theme);
}
