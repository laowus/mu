import { createApp } from "vue";
import App from "./App.vue";

//Pinia
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(piniaPersist);

//应用：创建、配置
const app = createApp(App);

//全局异常处理器
app.config.errorHandler = (err, vm, info) => {
  // 处理错误
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
};
app.use(pinia).mount("#app");
