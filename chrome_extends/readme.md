# Chrome 插件：测试插件

## 插件介绍

此插件旨在帮助 xxx

## 功能说明

1. **自动更新**

- popup.html 里可以查看当前插件版本，检查是否有最新版本，如果有则显示最新版本号，提供下载地址。并不需要每次点击浮窗就检查一次，设置为每 6 个小时检查一次。
- options.html 可以配置是否自动检查插件新版本，如果开启则会定时检查是否有最新版本，有则在插件图标上显示新。

2. **存储多环境登录信息**

- 在 popup.html 里可以登录多个环境，需要显示登录状态，如果已登录会有退出功能。
- 登录信息保存切与浏览器页面隔离，不影响相同环境的其它账号登录。可以在 popup.html,option,background.js,content.js 里随时都可以获取任意环境的 cookie，方便请求其它参数。
- 如果已登录则需要定时请求取数接口保持登录状态不失效。

3. **指定页面通过鼠标右键开启/关闭插件**
   开启插件，网页左上将有一个收回的图标，点击后顶部展示工具栏，展示完整工具栏菜单。菜单有查看模型关系，查看度量，清理缓存，显示当前模型名称，检查当前页面隐藏组件的按钮等信息。
4. **导出导入当前画布信息**

- 导出当前画布的 json 文件，并且替换 json 里的图片地址，有生成环境改为测试环境。
- 导入画布 json，并刷新页面。

## 快捷键使用

## 安装指南

1. 克隆或下载此项目的代码到本地。
2. 打开 Chrome 浏览器并进入扩展程序管理页面 (`chrome://extensions/`)。
3. 打开右上角的 “开发者模式”。
4. 点击 “加载已解压的扩展程序” 按钮，选择项目的根目录。
5. 插件成功加载后，将出现在浏览器工具栏中。

## 使用方式

## 注意事项
