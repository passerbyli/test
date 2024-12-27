const { ipcRenderer } = require("electron");
const moment = require("moment"); // 用于格式化时间

document.addEventListener("DOMContentLoaded", () => {
  const todoListElement = document.getElementById("todoList");
  const addTodoForm = document.getElementById("addTodoForm");
  const taskTitleInput = document.getElementById("taskTitle");
  const taskDescriptionInput = document.getElementById("taskDescription");
  const reminderTimeInput = document.getElementById("reminderTime");
  const cronTimeInput = document.getElementById("cronTime"); // 定时任务的 cron 表达式输入框

  // 获取代办事项列表并渲染到页面
  ipcRenderer.invoke("getTodoList").then((todoList) => {
    renderTodoList(todoList);
  });

  // 添加代办事项
  addTodoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let newTask;
    if (cronTimeInput.value) {
      // 如果选择了定时任务
      newTask = {
        id: Date.now(), // 使用时间戳作为任务 ID
        title: taskTitleInput.value,
        description: taskDescriptionInput.value,
        cronTime: cronTimeInput.value, // 使用 cron 表达式
      };
    } else {
      // 如果选择了指定时间提醒任务
      newTask = {
        id: Date.now(), // 使用时间戳作为任务 ID
        title: taskTitleInput.value,
        description: taskDescriptionInput.value,
        reminderTime: reminderTimeInput.value, // 格式: '2024-12-20 14:30:00'
      };
    }

    ipcRenderer.invoke("addTodo", newTask).then(() => {
      renderTodoList([newTask, ...todoList]); // 显示新添加的任务
    });

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    reminderTimeInput.value = "";
    cronTimeInput.value = ""; // 重置输入框
  });

  // 渲染代办事项列表
  function renderTodoList(todoList) {
    // 渲染逻辑同前
  }
});
