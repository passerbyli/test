import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
});

app.$mount("#app");
