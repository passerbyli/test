console.log("background...");
/* START  */
let requestLog = [];

// 监听所有请求
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.method === "POST") {
      const { url, method, requestId } = details;
      const request = {
        url: url,
        method: method,
        timeStamp: details.timeStamp,
        getParams: extractGetParams(details.url),
      };

      // 提取POST和PUT的请求参数
      if (details.method === "POST" || details.method === "PUT") {
        request.postParams = extractPostPutParams(details);
      }

      // 保存请求日志
      requestLog.push(request);

      // 只保留最近的 50 条请求记录
      if (requestLog.length > 50) {
        requestLog.shift();
      }
      // 保存 requestLog 到 chrome.storage.session
      chrome.storage.session.set({ requestLog: requestLog }, function () {
        console.log("Request log saved to session storage.");
      });

      // 打印请求日志到 console
      console.log("Request saved:", { url, method, requestBody });
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// 接收从content script发来的cell-id，并返回匹配的请求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "findRequestByCellId") {
    const cellId = message.cellId;
    const matchingRequests = requestLog.filter((request) =>
      request.url.includes(cellId)
    );
    sendResponse(requestLog);
  }
});

// 从URL中提取GET参数
function extractGetParams(url) {
  const urlObj = new URL(url);
  const params = {};
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

// 从POST/PUT请求体中提取参数
function extractPostPutParams(details) {
  let params = {};

  // 检查是否包含form data（针对POST/PUT表单提交）
  if (details.requestBody && details.requestBody.formData) {
    params = details.requestBody.formData;
  } else if (details.requestBody && details.requestBody.raw) {
    // 处理非表单的请求体数据
    const decoder = new TextDecoder("utf-8");
    details.requestBody.raw.forEach((element) => {
      const text = decoder.decode(element.bytes);
      try {
        params = JSON.parse(text); // 尝试解析JSON
      } catch (e) {
        params = { body: text }; // 如果解析失败，直接作为文本记录
      }
    });
  }

  return params;
}

chrome.storage.local.get("savedCookies", function (data) {
  if (data.savedCookies) {
    console.log("Retrieved cookies:", data.savedCookies);
    // 你可以在这里使用这些 cookie 数据，例如用于其他请求
  } else {
    console.log("No cookies saved.");
  }
});

// 将请求日志保存到 chrome.storage 中，供 popup 使用
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getRequestLog") {
    sendResponse({ requestLog });
  }
});

/* END  */

// 监听消息以处理请求 Cookies 的操作
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    const env = request.environment;
    chrome.storage.local.get([env + "_cookies"], function (result) {
      sendResponse(result[env + "_cookies"]);
    });
    return true; // 表示响应是异步的
  }
});

// 设置定时器任务，定期刷新登录状态和 Cookie
chrome.alarms.create("cookieRefresh", { periodInMinutes: 30 });

// 监听定时器，执行定时任务
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "cookieRefresh") {
    chrome.storage.local.get(["test_cookies", "prod_cookies"], function (data) {
      // 刷新 Cookies 或执行其他逻辑
      console.log("定时任务：检查 Cookies 是否有效", data);
    });
  }
});

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "toggleFloatingButton",
    title: "开启/关闭浮窗",
    contexts: ["all"],
  });
});

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "toggleFloatingButton") {
    // 向当前活动的标签页发送消息以切换浮窗
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleFloatingButton" });
    });
  }
});

/**START 更新版本 */
// 检查更新的逻辑（与之前相同）
async function checkForUpdates() {
  try {
    const response = await fetch("http://127.0.0.1:8080/version");
    const data = await response.json();
    console.log(data);
    const latestVersion = data.latest_version;
    const currentVersion = chrome.runtime.getManifest().version;

    if (latestVersion > currentVersion) {
      chrome.storage.local.get("lastNotifiedVersion", function (result) {
        if (result.lastNotifiedVersion !== latestVersion) {
          notifyUpdate(latestVersion, data.update_url);
          chrome.storage.local.set({ lastNotifiedVersion: latestVersion });
        }
      });
    }
  } catch (error) {
    console.error("检查更新失败:", error);
  }
}

// notifyUpdate("1.1", "##");

// 发送版本更新提醒
function notifyUpdate(newVersion, updateUrl) {
  chrome.action.setBadgeText({ text: "有更新" });
  chrome.notifications.clear("id");
  //创建一个通知面板

  chrome.notifications.create(
    "id",
    {
      type: "list",
      iconUrl: chrome.runtime.getURL("icons/icon16.png"),
      appIconMaskUrl: "icons/icon16.png",
      title: "通知主标题",
      message: "通知副标题",
      contextMessage: "好开心呀，终于会使用谷歌扩展里面的API了！",
      buttons: [
        { title: "按钮1的标题", iconUrl: "icons/icon16.png" },
        { title: "按钮2的标题", iconUrl: "icons/icon16.png" },
      ],
      items: [
        { title: "消息1", message: "今天天气真好！" },
        { title: "消息2", message: "明天天气估计也不错！" },
      ],
      eventTime: Date.now() + 2000,
    },
    (id) => {
      console.log(id);
    }
  );

  chrome.notifications.create(
    "id",
    {
      type: "basic",
      iconUrl: "icons/icon16.png",
      title: "新版本可用",
      message: `插件有新版本可用：v${newVersion}。点击更新。`,
      buttons: [{ title: "更新" }],
      isClickable: true,
    },
    () => {
      console.log("12189");
    }
  );

  chrome.notifications.onClicked.addListener(function () {
    chrome.tabs.create({ url: updateUrl });
  });
}

// 监听定时任务
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "checkUpdate") {
    chrome.storage.local.get("autoCheckUpdates", function (result) {
      if (result.autoCheckUpdates) {
        checkForUpdates();
      }
    });
  }
});

// 插件启动时检查是否需要开启自动更新
chrome.storage.local.get("autoCheckUpdates", function (result) {
  if (result.autoCheckUpdates) {
    chrome.alarms.create("checkUpdate", { periodInMinutes: 5 });
  }
});

/**END 更新版本 */

let isGridActive = false;

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "toggleRulerGrid",
    title: "开启标尺和删格",
    contexts: ["all"],
    documentUrlPatterns: ["https://*.cnblogs.com/*"],
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "toggleRulerGrid") {
    // 切换标尺和删格状态
    isGridActive = !isGridActive;

    // 向 content.js 发送消息，切换标尺和删格
    chrome.tabs.sendMessage(tab.id, { toggleGrid: isGridActive });

    // 更新右键菜单的显示文字
    chrome.contextMenus.update("toggleRulerGrid", {
      title: isGridActive ? "关闭标尺和删格" : "开启标尺和删格",
    });
  }
});
