chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "toggle-plugin",
    title: "开启/关闭插件",
    contexts: ["all"],
  });
});

let isEnabled = false;

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "toggle-plugin") {
    isEnabled = !isEnabled;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: togglePlugin,
      args: [isEnabled],
    });
  }
});

function togglePlugin(enabled) {
  if (enabled) {
    document.getElementById("jd-plugin-nav").style.display = "block";
  } else {
    document.getElementById("jd-plugin-nav").style.display = "none";
  }
}
