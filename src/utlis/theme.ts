// 主题样式接口
import {useAppStore} from "@/store/app";

export interface Theme {
    '--van-background': string;
    '--van-background-2': string;
    '--van-background-3': string;
}

// 主题配置接口
export interface ThemeConfig {
    isLight: boolean; // 是否为明亮模式
    styles: Theme; // 自定义主题样式
}

// 明亮模式基础样式
const lightBaseStyles: Theme = {
    '--van-background': '#F7F8FA',
    '--van-background-2': '#FFFFFF',
    '--van-background-3': '#FFFFFF',
};

// 暗黑模式基础样式
const darkBaseStyles: Theme = {
    '--van-background': '#131313',
    '--van-background-2': '#1C1C1E',
    '--van-background-3': '#37363B',
};

// 默认的明亮和暗黑额外样式
const defaultLightExtras = {
    '--van-text-color': '#323233',
    '--van-text-color-2': '#969799',
    '--van-text-color-3': '#c8c9cc',
    '--box-shadow-top': '#FFFFFF19',
    '--box-shadow-bottom': '#00000033',
    '--box-shadow-soft': '#D1D9E6',
    '--box-shadow-deep': '#F9F9F9',
};

const defaultDarkExtras = {
    '--van-text-color': '#F5F5F5',
    '--van-text-color-2': '#707070',
    '--van-text-color-3': '#4D4D4D',
    '--box-shadow-top': '#0000007F',
    '--box-shadow-bottom': '#0000004C',
    '--box-shadow-soft': '#FFFFFF33',
    '--box-shadow-deep': '#FFFFFF19',
};

/**
 * 获取完整的主题样式
 * @param config 自定义主题配置
 * @returns 合并后的完整主题样式
 */
const getCompleteThemeStyles = (config: ThemeConfig) => {
    const baseStyles = config.isLight ? lightBaseStyles : darkBaseStyles; // 根据 isLight 获取基础样式
    const defaultExtras = config.isLight ? defaultLightExtras : defaultDarkExtras; // 根据 isLight 获取默认额外样式

    return {
        ...defaultExtras, // 默认的额外样式
        ...baseStyles, // 默认基础样式
        ...config.styles, // 用户自定义样式（优先级最高）
    };
};


/**
 * 应用主题
 * @param config 主题配置
 */
export const applyTheme = (config: ThemeConfig) => {
    const themeStyles = getCompleteThemeStyles(config); // 获取完整样式

    useAppStore().setTheme(config)

    // 设置 HTML 类名
    document.documentElement.classList.toggle('van-theme-dark', !config.isLight);

    // 应用样式到根节点
    Object.entries(themeStyles).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });
};
