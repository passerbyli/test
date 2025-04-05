const { ipcRenderer } = require("electron");
const axios = require("axios");
const https = require("https");
const http = require("http");
const fs = require("fs");
const { setUserDataJsonProperty, getUserDataProperty } = require("./storeUtil");
const consoleUtil = require("./consoleLogUtil");

const myAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

async function login(username, password) {
  return myAxios
    .post("http://localhost:3000/login", {
      username,
      password,
    })
    .then((response) => {
      let data = response.data;
      if (response.status !== 200) {
        return false;
      } else {
        console.log("=======data:", response.headers["set-cookie"]);
        setUserDataJsonProperty(
          "cookies",
          JSON.stringify(response.headers["set-cookie"])
        );
      }
      return data;
    })
    .catch((err) => {
      console.log("====xxx:", err);
      if (err.response) {
        return {
          type: "error",
          message: err.response,
        };
      } else {
        return {
          type: "error",
          message: err.code,
        };
      }
    });
}
function fetchPageAndGetCookie(username, password) {
  const options = {
    hostname: "localhost", // 修改为目标网站的主机名
    port: 3000,
    path: "/login", // 修改为目标网页的路径
    method: "POST",
    headers: {},
    data: {
      username: username,
      password: password,
    },
  };

  const req = http.request(options, (res) => {
    let cookies = [];

    // 获取所有的 Set-Cookie 头
    if (res.headers["set-cookie"]) {
      cookies = res.headers["set-cookie"];
    }

    res.on("data", (chunk) => {
      console.log(`Body: ${chunk}`);
    });

    res.on("end", () => {
      console.log("No more data in response.");
      console.log("Cookies:", cookies);

      // 将 cookies 写入文件
      fs.writeFile("cookies.txt", cookies.join("\n"), (err) => {
        if (err) {
          console.error("Error writing cookies to file:", err);
        } else {
          console.log("Cookies saved to cookies.txt");
        }
      });
    });
  });

  req.on("error", (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
}

async function getMessage() {
  return myAxios
    .get("http://localhost:3000/messages", {
      headers: {
        Cookie: getUserDataProperty("cookies"),
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      consoleUtil.error("getMessage:", err?.response?.data);
      return ["getMessage"];
    });
}

module.exports = {
  getMessage,
  fetchPageAndGetCookie,
  login,
};
