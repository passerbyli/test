const puppeteer = require("puppeteer-extra");
const findChrome = require("../node_modules/carlo/lib/find_chrome.js");
const userAgent = require("user-agents");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const {
  getUserData,
  setUserDataJsonProperty,
} = require("./utils/storeUtil.js");
const Constants = require("../constant/constants");
const consoleUtil = require("./utils/consoleLogUtil");

const { mainSendToRender } = require("./utils/mainProcessMsgHandle.js");

const { sendNotice } = require("./utils/noticeUtil.js");

const API = Constants.API;
let Browser;
let isLogin = false;
let page;
let Cookie = null;
let Item_ID;

// 浏览器是否关闭
let BrowserDisconnected = false;

let Item_URL;

function getToBid(params) {
  handleSendNotice("xxajdioa");
  // return new Promise((resolve, reject) => {
  //   if (Browser && Browser.isConnected()) {
  //     if (isLogin) {
  //       handleSendNotice("登录成功，开始抢标");
  //       resolve({});
  //       return;
  //     }
  //   }

  //   resetData();

  //   initBid();
  // });
}

function updateBid(params) {}

async function initBid() {
  await initBrowser();
  page = await Browser.newPage();
  await page.setUserAgent(userAgent.random().toString());
  BrowserDisconnected = false;

  const {
    [Constants.StoreKeys.OPTIONS_KEY]: options = {},
    [Constants.StoreKeys.COOKIES_KEY]: cookies,
  } = getUserData();

  consoleUtil.log("options:", options);
  if (options.enableAutoLogin && cookies && cookies.length > 0) {
    page
      .waitForResponse(async (response) => {
        const responseUrl = response.url();
        if (
          responseUrl.startWith(API.get_user_info_url) &&
          response.status() === 200
        ) {
          const responseText = (await response.text()) || "";
          const responseJson = JSON.parse(
            responseText.substring(
              responseText.indexOf("(") + 1,
              responseText.lastIndexOf(")")
            )
          );
          if (responseJson && responseJson.data && responseJson.data.isLogin) {
            isLogin = true;
            handleGoToTargetPage();
          } else {
            handleLogin();
          }
          response.ok();
          return true;
        }
        return false;
      })
      .catch((e) => {
        consoleUtil.log("waitForResponse error: ", e);
      });
    await page.setCookie(...cookies);
    page.goto(Item_URL).catch((e) => {});
  } else {
    handleLogin();
  }
}

function handleLogin() {
  if (!page) {
    return;
  }
  page.on("load", async function () {
    const pageUrl = page.url();
    if (
      pageUrl === API.login_success_redirect_url ||
      pageUrl === API.login_success_redirect_url + "/" + Item_ID
    ) {
      isLogin = true;
      handleGoToTargetPage();
    }
  });
  page.goto(API.login_url).catch((e) => {});
}

async function initBrowser() {
  if (Browser && Browser.isConnected()) {
    return;
  }

  let findChromePath = await findChrome({});
  let executablePath = findChromePath.executablePath;
  puppeteer.use(StealthPlugin());

  Browser = await puppeteer.launch({
    executablePath,
    headless: false,
    defaultViewport: null,
    args: ["--disable-web-security"],
    ignoreDefaultArgs: ["--enable-automation"],
  });

  Browser.on("disconnected", () => {
    BrowserDisconnected = true;
    // 监听浏览器断开连接, 重置数据
    isLogin = false;
    Browser = null;
    page = null;
    BrowserDisconnected = true;
  });
}
function resetData() {
  Cookie = null;
  BrowserDisconnected = false;
}

async function handleGoToTargetPage() {
  if (!page) {
    return;
  }
  const pageUrl = page.url();
  if (Item_URL !== pageUrl) {
    await page.goto(Item_URL);
  }

  const page_cookie = await page.cookies();
  Cookie = page_cookie;
  setUserDataJsonProperty(Constants.StoreKeys.COOKIES_KEY, page_cookie);
  return;
}

function handleSendNotice(msg) {
  consoleUtil.log(msg);
}

function getLoginStatus() {
  if (Browser && Browser.isConnected()) {
    if (isLogin) {
      return true;
    }
  }
  return false;
}

function isBrowerDisconnected() {
  return BrowserDisconnected;
}
function handleSendNotice(msg) {
  sendNotice(msg);
}

module.exports = {
  getToBid,
  updateBid,
  initBid,
  handleLogin,
  initBrowser,
  resetData,
  handleSendNotice,
  getLoginStatus,
  isBrowerDisconnected,
};
