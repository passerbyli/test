let config = {
  environment: "test",
  test: {
    account: {
      loginApi: "http://test.com/login",
      logoutApi: "http://test.com/logout",
      healthApi: "http://test.com/health",
      username: "xx",
      password: "xxxx",
      cookie: "xxx",
    },
    appId: "xxx",
    appKey: "xxxx",
    token: "xxx",
  },
  production: {
    account: {
      loginApi: "http://test.com/login",
      logoutApi: "http://test.com/logout",
      healthApi: "http://test.com/health",
      username: "xx",
      password: "xxxx",
      cookie: "xxx",
    },
    appId: "xxx",
    appKey: "xxxx",
    token: "xxx",
  },
  //数据库连接信息
  database: {
    host: "localhost",
    user: "root",
    password: "admin2312",
    database: "test",
  },
  exportPath: "/Users/lihaomin/projects/GitHub/test/elec——error", //全局设置导出内容目录
  // 应用登录
  appAccount: {
    cookies: "", // 应用登录cookie
    username: "admin", //应用登录用户名
    password: "123456", //应用登录密码
    rememberMe: true, //记录应用登录用户名及密码
  },
};
