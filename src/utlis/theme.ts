// 主题样式接口

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
  '--van-background-3': '#FFFFFF'
};

// 暗黑模式基础样式
const darkBaseStyles: Theme = {
  '--van-background': '#131313',
  '--van-background-2': '#1C1C1E',
  '--van-background-3': '#37363B'
};

// 默认的明亮和暗黑额外样式
const defaultLightExtras = {
  '--van-text-color': '#323233',
  '--van-text-color-2': '#969799',
  '--van-text-color-3': '#c8c9cc',
  '--box-shadow-top': '#FFFFFF19',
  '--box-shadow-bottom': '#00000033',
  '--box-shadow-soft': '#D1D9E6',
  '--box-shadow-deep': '#F9F9F9'
};

const defaultDarkExtras = {
  '--van-text-color': '#F5F5F5',
  '--van-text-color-2': '#707070',
  '--van-text-color-3': '#4D4D4D',
  '--box-shadow-top': '#0000007F',
  '--box-shadow-bottom': '#0000004C',
  '--box-shadow-soft': '#FFFFFF33',
  '--box-shadow-deep': '#FFFFFF19'
};

/**
 * 应用主题
 * @param config 主题配置
 */
export const applyTheme = (config: ThemeConfig) => {
  // 获取基础样式和默认额外样式
  const { isLight, styles: customStyles } = config;
  const baseStyles = isLight ? lightBaseStyles : darkBaseStyles;
  const extraStyles = isLight ? defaultLightExtras : defaultDarkExtras;

  // 合并基础样式和自定义样式
  config.styles = { ...baseStyles, ...customStyles };

  // 合并额外样式和最终样式
  const mergedStyles = { ...extraStyles, ...config.styles };

  // 设置 HTML 类名以切换Vant主题
  document.documentElement.classList.toggle('van-theme-dark', !isLight);

  // 应用样式到根节点
  Object.entries(mergedStyles).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
};
