interface Theme {
    '--primary-color': string;  // 主要颜色
    '--text-color': string;     // 文字颜色
    '--background-color': string; // 背景颜色
    '--button-bg-color': string; // 按钮背景色
    '--button-text-color': string; // 按钮文字颜色
    '--border-color': string;    // 边框颜色
    '--link-color': string;      // 链接颜色
    '--link-hover-color': string; // 链接 hover 颜色
    '--card-bg-color': string;   // 卡片背景色
    '--shadow-color': string;    // 阴影颜色
}

// 亮色主题
const lightTheme: Theme = {
    '--primary-color': '#409eff',    // 蓝色
    '--text-color': '#000000',       // 黑色
    '--background-color': '#ffffff', // 白色
    '--button-bg-color': '#409eff',  // 按钮蓝色
    '--button-text-color': '#ffffff',// 按钮文字白色
    '--border-color': '#e0e0e0',     // 浅灰色边框
    '--link-color': '#409eff',       // 蓝色链接
    '--link-hover-color': '#0066cc', // 链接 hover 变深
    '--card-bg-color': '#f5f5f5',    // 卡片背景色
    '--shadow-color': 'rgba(0, 0, 0, 0.1)', // 轻微的阴影
};

// 暗色主题
const darkTheme: Theme = {
    '--primary-color': '#1e1e1e',    // 深灰色
    '--text-color': '#ffffff',       // 白色
    '--background-color': '#121212', // 背景深色
    '--button-bg-color': '#2a2a2a',  // 按钮背景色灰黑
    '--button-text-color': '#ffffff',// 按钮文字白色
    '--border-color': '#333333',     // 深灰色边框
    '--link-color': '#66aaff',       // 蓝色链接
    '--link-hover-color': '#3399ff', // 链接 hover 变深
    '--card-bg-color': '#2c2c2c',    // 卡片背景色
    '--shadow-color': 'rgba(0, 0, 0, 0.7)', // 更深的阴影
};

// 自定义颜色主题
const customTheme = (primaryColor: string,
                     textColor: string,
                     backgroundColor: string,
                     buttonBgColor: string,
                     buttonTextColor: string,
                     borderColor: string,
                     linkColor: string,
                     linkHoverColor: string,
                     cardBgColor: string,
                     shadowColor: string): Theme => {
    return {
        '--primary-color': primaryColor,
        '--text-color': textColor,
        '--background-color': backgroundColor,
        '--button-bg-color': buttonBgColor,
        '--button-text-color': buttonTextColor,
        '--border-color': borderColor,
        '--link-color': linkColor,
        '--link-hover-color': linkHoverColor,
        '--card-bg-color': cardBgColor,
        '--shadow-color': shadowColor,
    };
}
