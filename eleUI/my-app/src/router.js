import Vue from "vue";
import Router from "vue-router";
import HomePage from "./components/HomePage.vue";
import TaskManagement from "./components/TaskManagement.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/", component: HomePage },
    { path: "/tasks", component: TaskManagement },
  ],
});
