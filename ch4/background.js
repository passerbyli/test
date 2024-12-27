console.log("backgroun.js...");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "showNotification") {
    console.log("djaodajso");
    chrome.notifications.create({
      type: "basic",
      iconUrl: "./icons/icon16.png", // 插件的图标
      title: "Title Notification",
      message: "message.message",
    });
  }
});

// 监听页面加载完成事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // if (changeInfo.status === "complete" && tab.url) {
  //   // 页面加载完成后注入脚本
  //   chrome.scripting.executeScript({
  //     target: { tabId: tabId },
  //     function: injectFileUploadFunctionality,
  //   });
  // }
});

// 注入文件上传功能
function injectFileUploadFunctionality() {
  const uploadElement = document.getElementById("limit_free");

  if (uploadElement) {
    // 给 #J_upload_json 添加点击事件
    uploadElement.addEventListener("click", () => {
      // 创建一个隐藏的文件选择框
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "application/json";

      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            try {
              const jsonContent = JSON.parse(e.target.result);
              console.log("Parsed JSON: ", jsonContent);
              // 将 JSON 数据上传到 API
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
}

// API 上传功能
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

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToJSON",
    title: "发送请求并保存为JSON",
    contexts: ["selection"], // 仅在有文本选中时显示
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToJSON") {
    let selectedText = info.selectionText;
    if (selectedText) {
      // 调用 API 请求
      fetchAPI(selectedText);
    }
  }
});

function fetchAPI(query) {
  const apiUrl = "https://example.com/api"; // 替换为你的 API 地址
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question: query }),
  })
    .then((response) => response.json())
    .then((data) => {
      // 将返回的数据保存为 JSON 文件
      saveDataAsJSON(data);
    })
    .catch((error) => {
      console.error("API 请求失败: ", error);
    });
}

function saveDataAsJSON(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: "api_result.json",
  });
}

////////方法三：//////////////-----------///////////////////
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendJsonToContentScript") {
    // 获取当前活动的标签页并将 JSON 数据发送到 content.js
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "uploadJson",
        data: message.data,
      });
    });
  }
});
////////方法三：//////////////-----------///////////////////
