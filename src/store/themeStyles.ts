
// 主题样式
export interface ThemeStyles {
    '--van-background': string,
    '--van-background-2': string,
    '--van-background-3': string,
}

// 主题配置
export interface ThemeConfig {
    isLight: boolean;
    theme: ThemeStyles;
}

export const lightThemeConfig: ThemeStyles = {
    '--van-background': '#F7F8FA',
    '--van-background-2': '#FFFFFF',
    '--van-background-3': '#FFFFFF',
}

export const darkThemeConfig: ThemeStyles = {
    '--van-background': '#131313',
    '--van-background-2': '#1C1C1E',
    '--van-background-3': '#37363B',
}

export const lightTheme = {
    ...lightThemeConfig,
    '--van-text-color': '#323233',
    '--van-text-color-2': '#969799',
    '--van-text-color-3': '#c8c9cc',
    '--box-shadow-top': '#FFFFFF19',
    '--box-shadow-bottom': '#00000033',
    '--box-shadow-soft': '#D1D9E6',
    '--box-shadow-deep': '#F9F9F9',
}

export const darkTheme = {
    ...darkThemeConfig,
    '--box-shadow-top': '#0000007F',
    '--box-shadow-bottom': '#0000004C',
    '--box-shadow-soft': '#FFFFFF33',
    '--box-shadow-deep': '#FFFFFF19',
    '--van-text-color': '#F5F5F5',
    '--van-text-color-2': '#707070',
    '--van-text-color-3': '#4D4D4D',
}

/**
 * 应用主题
 * @param config 主题配置
 */
export const applyTheme = (config: ThemeConfig) => {
    let theme =
        {
            '--van-text-color': '#323233',
            '--van-text-color-2': '#969799',
            '--van-text-color-3': '#c8c9cc',
            '--van-background': config.theme["--van-background"],
            '--van-background-2': config.theme["--van-background-2"],
            '--van-background-3': config.theme["--van-background-3"],
            '--box-shadow-top': '#FFFFFF19',
            '--box-shadow-bottom': '#00000033',
            '--box-shadow-soft': '#D1D9E6',
            '--box-shadow-deep': '#F9F9F9',
        }
    if (!config.isLight) {
        theme["--box-shadow-top"] = darkTheme["--box-shadow-top"];
        theme["--box-shadow-bottom"] = darkTheme["--box-shadow-bottom"];
        theme["--box-shadow-soft"] = darkTheme["--box-shadow-soft"];
        theme["--box-shadow-deep"] = darkTheme["--box-shadow-deep"];
        theme["--van-text-color"] = darkTheme["--van-text-color"];
        theme["--van-text-color-2"] = darkTheme["--van-text-color-2"];
        theme["--van-text-color-3"] = darkTheme["--van-text-color-3"];
        document.documentElement.classList.add("van-theme-dark");
    }
    else {
        document.documentElement.classList.remove("van-theme-dark");
    }
    Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });
}

