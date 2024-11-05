const { ipcRenderer } = require("electron");

// 页面切换逻辑
document
  .getElementById("nav-excel")
  .addEventListener("click", () => showPage("excel-generator"));
document
  .getElementById("nav-encoder")
  .addEventListener("click", () => showPage("encoder-tool"));
document
  .getElementById("nav-json")
  .addEventListener("click", () => showPage("json-formatter"));

function showPage(pageId) {
  const pages = ["excel-generator", "encoder-tool", "json-formatter"];
  pages.forEach((page) => {
    document.getElementById(page).style.display =
      page === pageId ? "block" : "none";
  });
}

// 初始显示 Excel 生成器页面
showPage("excel-generator");

// Excel 生成器功能
document.getElementById("select-file").addEventListener("click", async () => {
  const result = await ipcRenderer.invoke("select-file");
  if (result && result.filePaths) {
    document.getElementById("file-path").innerText = result.filePaths[0];
  }
});

document.getElementById("generate").addEventListener("click", async () => {
  const filePath = document.getElementById("file-path").innerText;
  if (!filePath) return alert("请选择一个 JSON 文件");

  const result = await ipcRenderer.invoke("generate-excel", filePath);
  document.getElementById("export-status").innerText = result.success
    ? `导出成功: ${result.path}`
    : `导出失败: ${result.error}`;
});

// 信息编解码功能
document.getElementById("url-encode").addEventListener("click", () => {
  const input = document.getElementById("encode-input").value;
  document.getElementById("encode-output").innerText =
    encodeURIComponent(input);
});

document.getElementById("url-decode").addEventListener("click", () => {
  const input = document.getElementById("encode-input").value;
  document.getElementById("encode-output").innerText =
    decodeURIComponent(input);
});

document.getElementById("base64-encode").addEventListener("click", () => {
  const input = document.getElementById("encode-input").value;
  document.getElementById("encode-output").innerText =
    Buffer.from(input).toString("base64");
});

document.getElementById("base64-decode").addEventListener("click", () => {
  const input = document.getElementById("encode-input").value;
  document.getElementById("encode-output").innerText = Buffer.from(
    input,
    "base64"
  ).toString("utf-8");
});

// JSON 格式化功能
document.getElementById("format-json").addEventListener("click", () => {
  try {
    const jsonString = document.getElementById("json-input").value;
    const formattedJson = JSON.stringify(JSON.parse(jsonString), null, 4);
    document.getElementById("json-output").innerText = formattedJson;
  } catch (error) {
    document.getElementById("json-output").innerText = "无效的 JSON 字符串";
  }
});

// 打开设置窗口
document.getElementById("settings-btn").addEventListener("click", () => {
  ipcRenderer.send("open-settings");
});
