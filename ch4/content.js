console.log("1content.js...");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
  if (request.cmd == "test") {
    console.log(request.value + "@xxx");
  }
  sendResponse("我收到了你的消息！");
});

document.addEventListener("DOMContentLoaded", () => {});
document.addEventListener("click", function (event) {
  console.log("jdiao");
  const target = event.target;

  if (target.classList.contains("title")) {
    const titleContent = target.getAttribute("title") || "No title attribute";

    // 显示浏览器通知
    chrome.runtime.sendMessage({
      type: "showNotification",
      message: titleContent,
    });
  }
});

/////////方法二：/////////////////////////////
/**
 * todo：通过 chrome.runtime.connect 创建长连接
 */
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    if (message.action === "uploadJson") {
      const jsonData = message.data;

      // 调用 API，上传 JSON 数据
      uploadToAPI(jsonData);
    }
  });
});

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
/////////方法二：/////////////////////////////

////////方法一：//////////////-----------///////////////////
/***
 * 
content.js 将监听来自 popup.js 的消息，当接收到消息时，进行 API 请求。
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "uploadJson") {
    const jsonData = message.data;

    // 调用 API，上传 JSON 数据
    uploadToAPI(jsonData);
  }
});

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
