console.log("popup.js...");

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}
sendMessageToContentScript(
  { cmd: "test", value: "你好，我是popup！" },
  function (response) {
    console.log("来自content的回复：" + response);
  }
);

//
/////////方法二：/////////////////////////////
/**
 * 创建与 content.js 的连接
 * 通过 chrome.runtime.connect 创建长连接
 * 这个方法适用于需要在 popup.js 和 content.js 之间保持持续的通信。你可以通过 chrome.runtime.connect 和 chrome.runtime.onConnect 来建立一个持久的连接，从而进行双向通信。
 */
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const port = chrome.tabs.connect(tabs[0].id);

  document.getElementById("uploadButton").addEventListener("click", () => {
    const fileInput = document.getElementById("jsonFileInput");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const jsonData = JSON.parse(event.target.result);

          // 发送 JSON 数据到 content.js
          port.postMessage({ action: "uploadJson", data: jsonData });
        } catch (error) {
          console.error("JSON 解析错误:", error);
          alert("无效的 JSON 文件");
        }
      };
      reader.readAsText(file);
    } else {
      alert("请先选择一个 JSON 文件");
    }
  });
});
/////////方法二：/////////////////////////////

////////方法一：//////////////-----------///////////////////
/**
 * 这是最常用且简单的方式。popup.js 可以使用 chrome.tabs.sendMessage 将消息发送给当前激活页面的 content.js，而 content.js 使用 chrome.runtime.onMessage 监听消息并处理。
 */
document.getElementById("uploadButton").addEventListener("click", () => {
  const fileInput = document.getElementById("jsonFileInput");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const jsonData = JSON.parse(event.target.result);

        // 获取当前活动标签页，并发送消息给 content.js
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "uploadJson",
            data: jsonData,
          });
        });
      } catch (error) {
        console.error("JSON 解析错误:", error);
        alert("无效的 JSON 文件");
      }
    };
    reader.readAsText(file);
  } else {
    alert("请先选择一个 JSON 文件");
  }
});

////////方法一：//////////////-----------///////////////////

////////方法三：//////////////-----------///////////////////
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "uploadJson") {
    const jsonData = message.data;
    // 调用 API，上传 JSON 数据
    uploadToAPI(jsonData);
  }
});

// API 请求逻辑
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
////////方法三：//////////////-----------///////////////////
