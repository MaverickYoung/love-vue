import {defineConfig} from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from '@vant/auto-import-resolver';
import {resolve} from "path";


// https://vite.dev/config/
export default defineConfig({

    base: './',
    resolve: {
        // 配置别名
        alias: {
            '@': resolve(__dirname, './src'),
        }
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [VantResolver()],
        }),
        Components({
            resolvers: [VantResolver()],
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 3000, // 端口号
        open: false // 是否自动打开浏览器
    }
});
