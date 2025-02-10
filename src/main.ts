import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { createPinia } from 'pinia';
import './assets/iconfont/iconfont.js';
import 'vant/lib/index.css';
import './style.css';

// vant按需引入，函数式组件不自动引入 bug
import 'vant/es/toast/style';
import 'vant/es/notify/style';
import 'vant/es/dialog/style';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');
