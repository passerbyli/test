const https = require("https");
const fs = require("fs");

function fetchPageAndGetCookie() {
  const options = {
    hostname: "example.com", // 修改为目标网站的主机名
    path: "/", // 修改为目标网页的路径
    method: "GET",
  };

  const req = https.request(options, (res) => {
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

fetchPageAndGetCookie();
