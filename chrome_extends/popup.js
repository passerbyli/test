console.log("popup.js...");

document.addEventListener("DOMContentLoaded", function () {
  initialize();
  /**
   * 获取当前页签的cookie
   */
  document.getElementById("getCookies").addEventListener("click", async () => {
    // 获取当前活动标签的URL
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // 获取当前页面的cookie
    chrome.cookies.getAll({ url: tab.url }, async (cookies) => {
      if (cookies.length === 0) {
        alert("No cookies found");
        return;
      }

      // 将所有cookie拼接成字符串
      const cookieString = cookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      // 复制到剪贴板
      await navigator.clipboard.writeText(cookieString);

      alert("Cookies copied to clipboard!");
    });
  });

  // 监听测试环境登录按钮点击事件
  document
    .getElementById("test-login-btn")
    .addEventListener("click", function () {
      const username = document.getElementById("test-username").value;
      const password = document.getElementById("test-password").value;
      loginToEnvironment("test", username, password);
    });

  // 监听生产环境登录按钮点击事件
  document
    .getElementById("prod-login-btn")
    .addEventListener("click", function () {
      const username = document.getElementById("prod-username").value;
      const password = document.getElementById("prod-password").value;
      loginToEnvironment("prod", username, password);
    });

  // 监听退出测试环境
  document
    .getElementById("test-logout-btn")
    .addEventListener("click", function () {
      logoutEnvironment("test");
    });

  // 监听退出生产环境
  document
    .getElementById("prod-logout-btn")
    .addEventListener("click", function () {
      logoutEnvironment("prod");
    });

  // 监听清理缓存按钮点击事件
  document
    .getElementById("clear-cache-btn")
    .addEventListener("click", function () {
      chrome.storage.local.clear(function () {
        alert("缓存已清理");
        updateStatus("test", "未登录");
        updateStatus("prod", "未登录");
      });
    });
});

/**
 * 初始化状态，检查本地存储的登录信息并填充到页面。
 */
function initialize() {
  // 读取已保存的状态，更新页面显示
  chrome.storage.local.get(["test_status", "prod_status"], function (data) {
    updateStatus("test", data.test_status || "未登录");
    updateStatus("prod", data.prod_status || "未登录");
  });
}
/**
 * 登录到指定环境，并保存 Cookies 和登录状态。
 * @param {string} env - 环境名称（'test' 或 'prod'）。
 * @param {string} username - 用户名。
 * @param {string} password - 密码。
 */
async function loginToEnvironment(env, username, password) {
  const loginUrl = config.environments[env].loginUrl;
  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 其他必要的请求头
      },
      body: JSON.stringify({ username, password }),
      credentials: "omit", // 不发送页面的 Cookie，确保与浏览器页面隔离
    });

    if (!response.ok) {
      throw new Error("登录失败");
    }

    // 获取服务器返回的 Cookie 并通过 chrome.cookies API 设置
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookies = parseCookies(setCookieHeader); // 需要自定义解析逻辑

      for (const cookie of cookies) {
        chrome.cookies.set({
          url: `https://${envDomain}`,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain || envDomain,
          path: cookie.path || "/",
          secure: cookie.secure || true,
          httpOnly: cookie.httpOnly || true,
          expirationDate: cookie.expires
            ? new Date(cookie.expires).getTime() / 1000
            : undefined,
        });
      }
      console.log("插件的 Cookie 已成功设置");
    }

    saveEnvironmentCookies(env, setCookieHeader);
    updateStatus(env, "已登录");
    alert(`${env === "test" ? "测试" : "生产"}环境登录成功`);
  } catch (error) {
    console.error("登录请求出错:", error);
  }
}

function parseCookies(setCookieHeader) {
  // 假设 setCookieHeader 包含多个 Cookie，分号分隔
  const cookieArray = setCookieHeader.split(";");
  return cookieArray.map((cookieString) => {
    const cookieParts = cookieString.split("=");
    return {
      name: cookieParts[0].trim(),
      value: cookieParts[1] ? cookieParts[1].trim() : "",
    };
  });
}
/**
 * 退出指定环境，并清除 Cookies 和登录状态。
 * @param {string} env - 环境名称（'test' 或 'prod'）。
 */
function logoutEnvironment(env) {
  chrome.storage.local.remove([env + "_cookies", env + "_status"], function () {
    updateStatus(env, "未登录");
    alert(`${env === "test" ? "测试" : "生产"}环境已退出`);
  });
}

/**
 * 更新页面上的登录状态。
 * @param {string} env - 环境名称（'test' 或 'prod'）。
 * @param {string} status - 要显示的状态文本。
 */
function updateStatus(env, status) {
  document.getElementById(`${env}-status`).textContent = `状态: ${status}`;
  chrome.storage.local.set({ [env + "_status"]: status });
}

/**
 * 保存环境的 Cookies。
 * @param {string} env - 环境名称（'test' 或 'prod'）。
 * @param {Array} cookies - Cookies 数据。
 */
function saveEnvironmentCookies(env, cookies) {
  chrome.storage.local.set({ [env + "_cookies"]: cookies });
}

/**
 * 发送带有插件 Cookie 的请求
 * @param {*} envDomain
 * @param {*} apiUrl
 */
async function sendRequestWithPluginCookies(envDomain, apiUrl) {
  const cookies = await new Promise((resolve) => {
    chrome.cookies.getAll({ domain: envDomain }, resolve);
  });

  const cookieHeader = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Cookie: cookieHeader, // 手动设置插件的 Cookie
    },
    credentials: "omit", // 确保不会自动发送页面的 Cookie
  });

  const data = await response.json();
  console.log("请求结果:", data);
}

/**START zx */
document.addEventListener("DOMContentLoaded", () => {
  // 加载时获取并显示当前的 SKU 值
  chrome.storage.local.get("sku", (result) => {
    const sku = result.sku || "No SKU found";
    document.getElementById("sku-display").innerText = `当前 SKU: ${sku}`;
  });

  // 绑定 API 请求按钮的点击事件
  const buttons = document.querySelectorAll(".api-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const endpoint = button.getAttribute("data-endpoint");
      fetchApiAndShowStatus(endpoint, button);
    });
  });
});

// 发送 API 请求并显示请求状态
function fetchApiAndShowStatus(endpoint, button) {
  button.disabled = true;
  button.innerText = "请求中...";
  console.log(`正在请求 API: ${endpoint}`);

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      button.innerText = "成功";
      console.log("API 响应:", data);
    })
    .catch((error) => {
      button.innerText = "失败";
      console.error("API 请求失败:", error);
    })
    .finally(() => {
      setTimeout(() => {
        button.disabled = false;
        button.innerText = "请求";
      }, 2000);
    });
}

/**END zx */

/** */
const VERSION_CHECK_URL = "http://127.0.0.1:8080/version";
document.addEventListener("DOMContentLoaded", function () {
  const currentVersion = chrome.runtime.getManifest().version;
  document.getElementById("current-version").innerText = currentVersion;

  // 从存储中获取上次检查时间
  chrome.storage.local.get(
    ["lastCheckTime", "latestVersion", "updateUrl"],
    function (result) {
      const now = Date.now();
      const lastCheckTime = result.lastCheckTime || 0;
      const twelveHours = 30 * 1000; //12 * 60 * 60 * 1000;

      // 如果存储中已有新版本信息，显示它
      if (result.latestVersion && result.latestVersion > currentVersion) {
        displayUpdateInfo(result.latestVersion, result.updateUrl);
      }

      // 如果距离上次检查已超过 12 小时，执行更新检查
      if (now - lastCheckTime > twelveHours) {
        checkForUpdates().then((status) => {
          document.getElementById("update-status").innerText = status.message;

          if (status.isUpdateAvailable) {
            displayUpdateInfo(status.latestVersion, status.updateUrl);
            chrome.storage.local.set({
              latestVersion: status.latestVersion,
              updateUrl: status.updateUrl,
              lastCheckTime: now,
            });
          }
        });
      }
    }
  );
});

// 显示新版本信息
function displayUpdateInfo(latestVersion, updateUrl) {
  document.getElementById("latest-version").innerText = latestVersion;
  const updateLink = document.getElementById("update-link");
  updateLink.href = updateUrl;
  document.getElementById("update-info").style.display = "block";
}

// 检查更新逻辑
async function checkForUpdates() {
  try {
    const response = await fetch(VERSION_CHECK_URL); // 替换为你的服务器 URL
    const data = await response.json();

    const latestVersion = data.latest_version;
    const updateUrl = data.update_url;
    const currentVersion = chrome.runtime.getManifest().version;

    if (latestVersion > currentVersion) {
      return {
        isUpdateAvailable: true,
        latestVersion: latestVersion,
        updateUrl: updateUrl,
        message: `新版本可用：v${latestVersion}`,
      };
    } else {
      return { isUpdateAvailable: false, message: "当前版本已是最新。" };
    }
  } catch (error) {
    console.error("检查更新失败:", error);
    return { isUpdateAvailable: false, message: "检查更新时发生错误。" };
  }
}

/** */
