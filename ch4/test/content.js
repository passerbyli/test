console.log("test/content.js...");
document.addEventListener("DOMContentLoaded", () => {
  const uploadElement = document.getElementById("J_upload_json");

  if (uploadElement) {
    uploadElement.addEventListener("click", () => {
      // 创建文件选择框
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "application/json";

      // 当用户选择文件时触发
      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            try {
              const jsonContent = JSON.parse(e.target.result);
              console.log("解析的 JSON: ", jsonContent);
              // 发送 API 请求
              uploadToAPI(jsonContent);
            } catch (error) {
              console.error("JSON 文件解析错误: ", error);
              alert("JSON 文件格式错误，请重试。");
            }
          };
          reader.readAsText(file);
        }
      };

      // 触发文件选择框
      fileInput.click();
    });
  } else {
    console.error("#J_upload_json 元素未找到");
  }
});

// 发送请求到 API 的函数
function uploadToAPI(jsonData) {
  const apiUrl = "https://example.com/api/upload"; // 替换为你的 API 地址

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("API 上传成功: ", data);
      alert("JSON 上传成功！");
    })
    .catch((error) => {
      console.error("API 上传失败: ", error);
      alert("上传失败，请重试！");
    });
}
