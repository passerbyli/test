document.addEventListener("DOMContentLoaded", function () {
  // 给“清理登录信息”按钮添加点击事件监听器
  document
    .getElementById("clear-login-info")
    .addEventListener("click", function () {
      clearLoginInfo(); // 点击按钮时调用清理登录信息函数
    });

  // 给“清理缓存”按钮添加点击事件监听器
  document.getElementById("clear-cache").addEventListener("click", function () {
    clearCache(); // 点击按钮时调用清理所有缓存的函数
  });
});

/**
 * 清理登录信息，包括:
 * 1. 测试环境和生产环境的Cookie
 * 2. 测试环境和生产环境保存的账号和密码（用户凭据）
 *
 * 调用 chrome.storage.local.remove 方法清除特定的键值，保持其他配置和缓存不变。
 */
function clearLoginInfo() {
  chrome.storage.local.remove(
    ["test_cookies", "prod_cookies", "test_credentials", "prod_credentials"],
    function () {
      // 删除后弹出提示，通知用户登录信息已被清除
      alert("登录信息已清理");
    }
  );
}

/**
 * 清理插件的所有缓存数据，包括:
 * 1. 登录状态（例如是否已登录）
 * 2. 存储的Cookies
 * 3. 用户账号和密码
 * 4. 任何其他插件使用 chrome.storage.local 保存的数据
 *
 * 该函数会调用 chrome.storage.local.clear 清除所有存储在本地的插件数据，相当于完全重置插件的所有缓存和状态。
 */
function clearCache() {
  chrome.storage.local.clear(function () {
    // 删除后弹出提示，通知用户所有缓存已被清除
    alert("所有缓存已清理");
  });
}

/** */
// 初始化选项页面
document.addEventListener("DOMContentLoaded", function () {
  const currentVersion = chrome.runtime.getManifest().version;
  document.getElementById("current-version").innerText = currentVersion;

  // 从 storage 获取自动更新选项
  chrome.storage.local.get("autoCheckUpdates", function (result) {
    document.getElementById("auto-check-updates").checked =
      result.autoCheckUpdates || false;
  });

  // 监听自动更新选项的更改
  document
    .getElementById("auto-check-updates")
    .addEventListener("change", function () {
      const isChecked = this.checked;
      chrome.storage.local.set({ autoCheckUpdates: isChecked });

      // 如果启用了自动更新，则创建定时任务
      if (isChecked) {
        chrome.alarms.create("checkUpdate", { periodInMinutes: 60 });
      } else {
        chrome.alarms.clear("checkUpdate");
      }
    });

  // 手动检查更新按钮
  document
    .getElementById("check-updates-btn")
    .addEventListener("click", function () {
      checkForUpdates().then((status) => {
        document.getElementById("update-status").innerText = status;
      });
    });
});

// 检查更新逻辑
async function checkForUpdates() {
  try {
    const response = await fetch("http://127.0.0.1:8080/version");
    const data = await response.json();
    console.log(data);
    const latestVersion = data.latest_version;
    const currentVersion = chrome.runtime.getManifest().version;

    if (latestVersion > currentVersion) {
      return `有新版本可用：v${latestVersion}。`;
    } else {
      return "当前版本已是最新。";
    }
  } catch (error) {
    console.error("检查更新失败:", error);
    return "检查更新时发生错误。";
  }
}

/** */
