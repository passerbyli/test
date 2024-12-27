使用 electron29 实现一个桌面应用。
UI 界面有顶部工具栏，内容有应用版本号，登录状态，登录按钮或者注销按钮，设置按钮。
中间分左右布局，左边位菜单列表，右边位功能主体区域。
点击登录按钮弹窗显示登录界面，成功登录后保证登录状态长期有效。
关闭窗口支持后台运行，win 系统右下角显示图标，右键图标可以打开窗口和关闭应用。
菜单列表有如下菜单：

1. 生成 excel。查询接口，根据 templates 目录下 demo.xlsx 模版，导出接口返回的数据。

应用设置包含如下内容

```
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

该配置单独使用弹窗实现。该配置文件保存在应用目录的 config.json 里。
