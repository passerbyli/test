import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/HomePage.vue";
import TaskManager from "@/components/TaskManager.vue";
import JsonFormatter from "@/components/JsonFormatter.vue";
import JsonAnalyzer from "@/components/JsonAnalyzer.vue";
import SqlExporter from "@/components/SqlExporter.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/", component: Home },
    { path: "/task", component: TaskManager },
    { path: "/jsonFormatter", component: JsonFormatter },
    { path: "/jsonAnalyzer", component: JsonAnalyzer },
    { path: "/sqlExporter", component: SqlExporter },
  ],
});
