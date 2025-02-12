module.exports = {
  publicPath: "./", // 保证资源相对路径正确
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      // 指定 Electron 主进程入口和预加载脚本路径（相对于项目根目录）
      mainProcessFile: "electron/main.js",
      preload: "electron/preload.js",
      customFileProtocol: "./", // 让 Electron 加载本地文件
    },
  },
  chainWebpack: (config) => {
    config.target("electron-renderer");
  },
};
