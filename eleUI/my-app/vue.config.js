const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath: "./", // 确保资源路径是相对路径
  transpileDependencies: true,

  pluginOptions: {
    electronBuilder: {
      // mainProcessFile: "./src/main/background.js",
      // preload: "./src/main/preload.js",
      nodeIntegration: true, // 允许 Node.js 模块在渲染进程中使用
      contextIsolation: false, // 关闭上下文隔离，确保可以使用 `window.require`
      enableRemoteModule: true, // 允许 remote 模块（如需）
    },
  },

  configureWebpack: {
    resolve: {
      alias: {
        "@": require("path").resolve(__dirname, "src"),
      },
    },
  },

  chainWebpack: (config) => {
    config.plugin("define").tap((args) => {
      args[0]["process.env.FS"] = JSON.stringify(true);
      return args;
    });
  },
});

// module.exports = {
//   pluginOptions: {
//     electronBuilder: {
//       mainProcessFile: "src/main/background.js",
//       preload: "src/main/preload.js",
//     },
//   },
// };
