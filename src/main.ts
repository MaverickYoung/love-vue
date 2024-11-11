import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import 'vant/lib/index.css';
import {router} from "./router";
import {createPinia} from "pinia";

const app = createApp(App);
app.use(router);
app.mount('#app')
app.use(createPinia())
