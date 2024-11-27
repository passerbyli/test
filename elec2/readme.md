使用 electron29 实现一个桌面应用。
UI 界面有顶部工具栏，内容有应用版本号，环境切换（测试或者生产），登录状态，登录按钮或者注销按钮，设置按钮。
中间分左右布局，左边位菜单列表，右边位功能主体区域。
最下方有 60 像素的输出日志区域，显示 console 打印的内容。

菜单列表有如下菜单：

1. 生成 excel。选择 json 文件，生成一个 excel 文件到指定目录。
2. 显示数据库相关运行信息。

应用设置包含如下内容

```
{
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

```

test/production 根据 environment 切换设置。该配置单独使用弹窗实现。该配置文件保存在应用目录的 config.json 里。
