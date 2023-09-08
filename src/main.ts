import { createApp } from "vue";
import App from "@/App.vue";
import {message}  from 'ant-design-vue';
import "@/plugins/antDesignVue"
import "@/plugins/storage"
import "@/assets/public.css"

import router from "@/router";//配置路由
import store from "@/store";//配置vuex
const app = createApp(App);

app.use(router).use(store).mount("#app");
app.config.globalProperties.$message = message;
