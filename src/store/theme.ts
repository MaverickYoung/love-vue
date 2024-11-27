import {defineStore} from 'pinia';

// 主题接口，定义所有可配置的 CSS 变量
interface Theme {
    '--van-primary-color': string;
    '--van-success-color': string;
    '--van-danger-color': string;
    '--van-warning-color': string;
    '--van-text-color': string;
    '--van-text-color-2': string;
    '--van-text-color-3': string;
    '--van-active-color': string;
    '--van-active-opacity': number;
    '--van-disabled-opacity': number;
    '--van-background': string;
    '--van-background-2': string;
    '--van-background-3': string;
    '--box-shadow': string;
}

// 定义 Pinia Store
export const useThemeStore = defineStore('theme', {
    state: () => ({
        currentTheme: 'light',  // 默认为亮色主题
        lightTheme: {
            '--van-primary-color': '#1989fa',
            '--van-success-color': '#07c160',
            '--van-danger-color': '#ee0a24',
            '--van-warning-color': '#ff976a',
            '--van-text-color': '#323233',
            '--van-text-color-2': '#969799',
            '--van-text-color-3': '#c8c9cc',
            '--van-active-color': '#f2f3f5',
            '--van-active-opacity': 0.6,
            '--van-disabled-opacity': 0.5,
            '--van-background': '#f7f8fa',
            '--van-background-2': '#fff',
            '--van-background-3': '#f1f1f1',
            '--box-shadow': 'rgba(0, 0, 0, 0.1)',
        } as Theme,
        darkTheme: {
            '--van-primary-color': '#1989fa',
            '--van-success-color': '#07c160',
            '--van-danger-color': '#ee0a24',
            '--van-warning-color': '#ff976a',
            '--van-text-color': '#f5f5f5',
            '--van-text-color-2': '#707070',
            '--van-text-color-3': '#4d4d4d',
            '--van-active-color': '#3a3a3c',
            '--van-active-opacity': 0.6,
            '--van-disabled-opacity': 0.5,
            '--van-background': '#000',
            '--van-background-2': '#1c1c1e',
            '--van-background-3': '#37363b',
            '--box-shadow': 'rgba(255,255,255,0.1)'
        } as Theme,
    }),

    actions: {
        // 切换主题
        switchTheme(theme: 'light' | 'dark' | 'custom') {
            let themeToApply: Theme;

            if (theme === 'light') {
                themeToApply = this.lightTheme;
            } else if (theme === 'dark') {
                themeToApply = this.darkTheme;
            } else {
                // 在这里可以使用自定义主题
                themeToApply = this.lightTheme; // 默认使用 light theme
            }

            this.applyTheme(themeToApply);
        },

        // 应用主题
        applyTheme(theme: Theme) {
            Object.entries(theme).forEach(([key, value]) => {
                const cssValue = typeof value === 'number' ? value.toString() : value;
                document.documentElement.style.setProperty(key, cssValue);
            });
        },
    },
});
