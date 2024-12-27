const data = {
  name: "测试插件",
  version: "1.0",
  description: "测试插件,功能有",
  manifest_version: 3, // 清单文件的版本，这个必须写，而且必须是3
  action: {
    default_popup: "popup.html",
  },
  // 权限申请
  permissions: [
    "clipboardWrite",
    "contextMenus", // 右键菜单
    "scripting",
    "storage", // 插件本地存储
    "cookies",
    "activeTab",
    "alarms",
    "tabs", // 标签
    "notifications", // 通知
    "webRequest", // web请求
    "webRequestBlocking",
    "<all_urls>",
    "http://*/*", // 可以通过executeScript或者insertCSS访问的网站
    "https://*/*", // 可以通过executeScript或者insertCSS访问的网站
    "*://*/*",
  ],
  options_page: "options.html", //配置页写法
  host_permissions: [
    "https://test.example.com/*",
    "https://prod.example.com/*",
    "<all_urls>",
  ],
  // 会一直常驻的后台JS或后台页面
  background: {
    service_worker: "background.js",
  },
  // 需要直接注入页面的JS
  content_scripts: [
    {
      //"matches": ["http://*/*", "https://*/*"],
      // "<all_urls>" 表示匹配所有地址
      matches: ["*://*.baidu.com/*"],
      // 多个JS按顺序注入
      js: ["config.js", "content.js"],
      css: ["style.css"],
    },
    {
      css: ["custom.css"],
      js: ["content_csdn.js"],
      matches: ["https://blog.csdn.net/*"],
      // 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"
      // 最后一个表示页面空闲时，默认document_idle
      run_at: "document_end",
    },
    {
      matches: ["*://*.jianshu.com/*"],
      js: ["content_zx.js"],
    },
  ],
  icons: {
    16: "icons/icon16.png",
    48: "icons/icon16.png",
    128: "icons/icon16.png",
  },
};
