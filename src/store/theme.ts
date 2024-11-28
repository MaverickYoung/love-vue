import cache from "@/utlis/cache";

// 主题
export interface Theme {
    '--van-primary-color': string;
    '--van-success-color': string;
    '--van-danger-color': string;
    '--van-warning-color': string;
    '--van-background': string;
    '--van-text-color': string;
    '--box-shadow': string;

    [key: `--van-background-${number}`]: string;

    [key: `--van-text-color-${number}`]: string;

    [key: `--box-shadow-${number}`]: string;
}

// 主题接口
export interface ITheme {
    isLight: boolean;
    theme: Theme;
}


export const lightTheme: Theme = {
    '--van-primary-color': '#1989FA',
    '--van-success-color': '#07C160',
    '--van-danger-color': '#EE0A24',
    '--van-warning-color': '#FF976A',
    '--van-background': '#E6E6E6',
    '--van-text-color': '#323233',
    '--box-shadow': '#00000019',
}

export const darkTheme: Theme = {
    '--van-primary-color': '#1989FA',
    '--van-success-color': '#07C160',
    '--van-danger-color': '#EE0A24',
    '--van-warning-color': '#FF976A',
    '--van-background': '#000000',
    '--van-text-color': '#F5F5F5',
    '--box-shadow': '#FFFFFF19'
}

/**
 * 将十六进制颜色解析为 RGBA
 * @param hex 十六进制颜色
 * @returns 包含 RGBA 的数组
 */
const hexToRgba = (hex: string): [number, number, number, number] => {
    const sanitizedHex = hex.replace('#', '');
    const hasAlpha = sanitizedHex.length === 8;
    const bigint = parseInt(sanitizedHex.substring(0, 6), 16);
    const alpha = hasAlpha ? parseInt(sanitizedHex.substring(6, 8), 16) / 255 : 1;

    return [
        (bigint >> 16) & 255, // 红
        (bigint >> 8) & 255,  // 绿
        bigint & 255,         // 蓝
        alpha,
    ];
};

/**
 * 将 RGBA 转换回十六进制颜色
 * @param r 红色分量
 * @param g 绿色分量
 * @param b 蓝色分量
 * @param a 透明度
 * @returns 十六进制颜色字符串
 */
const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
    const alpha = Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}${alpha !== 'FF' ? alpha : ''}`;
};


/**
 * 生成颜色变淡的梯度
 * @param baseColor 基础颜色
 * @param steps 梯度数量
 * @param level 调整幅度，0~1之间
 * @returns 变浅或变深的颜色梯度数组 （除去基础色）
 */
const generateLightGradient = (baseColor: string, steps: number, level: number): string[] => {
    const [r, g, b, a] = hexToRgba(baseColor);
    const colors: string[] = [];

    level = level / steps;

    // 生成渐变颜色
    for (let i = 1; i < steps; i++) {
        const newR = (255 - r) * level * i + r
        const newG = (255 - g) * level * i + g
        const newB = (255 - b) * level * i + b
        colors.push(rgbaToHex(Math.round(newR), Math.round(newG), Math.round(newB), a));
    }

    return colors;
};

/**
 * 生成颜色变浓的梯度
 * @param baseColor 基础颜色
 * @param steps 梯度数量
 * @param level 调整幅度，0~1之间
 * @returns 变浅或变深的颜色梯度数组 （除去基础色）
 */
const generateDarkGradient = (baseColor: string, steps: number, level: number): string[] => {
    const [r, g, b, a] = hexToRgba(baseColor);
    const colors: string[] = [];

    level = level / steps;

    // 生成渐变颜色
    for (let i = 1; i < steps; i++) {
        const newR = r - (r * level) * i
        const newG = g - (g * level) * i
        const newB = b - (b * level) * i
        colors.push(rgbaToHex(Math.round(newR), Math.round(newG), Math.round(newB), a));
    }

    return colors;
};

/**
 * 为多个属性生成梯度并更新 Theme
 * @param theme 当前 Theme 对象
 * @returns 更新后的 Theme 对象
 */
const updateThemeGradients = (
    theme: Theme, lightProperties: string[], darkProperties: string[]
): Theme => {

    const steps: number = 5;
    const level: number = 1;

    lightProperties.forEach(property => {
        const baseColor = theme[property as keyof Theme] as string;
        const gradients = generateDarkGradient(baseColor, steps, level)

        // 为每个属性生成梯度
        gradients.forEach((color, index) => {
            theme[`${property}-${index + 2}` as keyof Theme] = color;
        });
    });

    darkProperties.forEach(property => {
        const baseColor = theme[property as keyof Theme] as string;
        const gradients = generateLightGradient(baseColor, steps, level)

        // 为每个属性生成梯度
        gradients.forEach((color, index) => {
            theme[`${property}-${index + 2}` as keyof Theme] = color;
        });
    });

    return theme;
};


/**
 * 切换主题
 * @param iTheme 主题配置
 */
export const switchTheme = (theme: Theme, isLight: boolean) => {
    // 生成梯度的属性名列表
    const lightProperties: string[] = ['--van-background', '--van-text-color'];
    const darkProperties: string[] = ['--box-shadow'];

    let gradientTheme: Theme;
    if (isLight) {
        gradientTheme = updateThemeGradients(theme, lightProperties, darkProperties);
    } else {
        gradientTheme = updateThemeGradients(theme, darkProperties, lightProperties)
    }

    applyTheme({theme:gradientTheme, isLight})
}

/**
 * 应用主题
 * @param iTheme 主题配置
 */
export const applyTheme = (iTheme: ITheme) => {
    cache.setTheme(iTheme);

    const theme = iTheme.theme;
    const isLight = iTheme.isLight;

    Object.entries(theme).forEach(([key, value]) => {
        const cssValue = typeof value === 'number' ? value.toString() : value;
        document.documentElement.style.setProperty(key, cssValue);
    });

}
