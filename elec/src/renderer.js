// 页面加载时请求待办事项

window.onload = function () {
  window.electron.send("load-todos"); // 请求加载待办事项
};

// 控制窗口关闭
document.getElementById("close-btn").addEventListener("click", () => {
  ipcRenderer.send("close-window");
});

// 监听待办事项更新
window.electron.on("todos-updated", (todos) => {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = ""; // 清空现有列表
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = `${todo.title} - ${todo.content}`;

    // 添加编辑按钮
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTodo(todo);
    li.appendChild(editBtn);

    todoList.appendChild(li);
  });
});

// 添加待办事项
function updateTodos() {
  const title = document.getElementById("todoTitle").value;
  const content = document.getElementById("todoContent").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const isRepeating = document.getElementById("isRepeating").checked;
  const repeatPeriod = document.getElementById("repeatPeriod").value;

  const newTodo = {
    title,
    content,
    start: startTime,
    end: endTime,
    repeat: isRepeating,
    period: isRepeating ? repeatPeriod : null,
    id: Date.now(), // 使用时间戳生成唯一 ID
  };

  window.electron.send("add-todo", newTodo);
}

// 修改任务
function editTodo(todo) {
  document.getElementById("todoTitle").value = todo.title;
  document.getElementById("todoContent").value = todo.content;
  document.getElementById("startTime").value = todo.start;
  document.getElementById("endTime").value = todo.end;
  document.getElementById("isRepeating").checked = todo.repeat;
  document.getElementById("repeatPeriod").value = todo.period;

  // 更新按钮点击事件
  document.getElementById("addTodoBtn").onclick = () => {
    todo.title = document.getElementById("todoTitle").value;
    todo.content = document.getElementById("todoContent").value;
    todo.start = document.getElementById("startTime").value;
    todo.end = document.getElementById("endTime").value;
    todo.repeat = document.getElementById("isRepeating").checked;
    todo.period = todo.repeat
      ? document.getElementById("repeatPeriod").value
      : null;

    window.electron.send("update-todo", todo);
  };
}

// 设置周期可见性
document.getElementById("isRepeating").addEventListener("change", (e) => {
  const repeatOptions = document.getElementById("repeatOptions");
  if (e.target.checked) {
    repeatOptions.style.display = "block";
  } else {
    repeatOptions.style.display = "none";
  }
});

// 打开设置窗口
function openSettings() {
  window.electron.send("open-settings");
}

// 控制窗口关闭
document.getElementById("close-btn").addEventListener("click", () => {
  ipcRenderer.send("close-window");
});
// 控制窗口关闭
document.getElementById("close-btn").addEventListener("click", () => {
  window.electron.closeWindow();
});

// 实现拖动窗口功能
const titleBar = document.getElementById("title-bar");
let isMouseDown = false;
let offsetX, offsetY;

titleBar.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  offsetX = event.clientX;
  offsetY = event.clientY;
  titleBar.style.cursor = "grabbing";
});

window.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const deltaX = event.clientX - offsetX;
    const deltaY = event.clientY - offsetY;

    // 通过 window.electron 发送窗口位置的改变
    window.electron.moveWindow(deltaX, deltaY);

    offsetX = event.clientX;
    offsetY = event.clientY;
  }
});

window.addEventListener("mouseup", () => {
  isMouseDown = false;
  titleBar.style.cursor = "grab";
});
