import esbuild from "esbuild";
import { spawn } from "child_process";
import electron from "electron";

export const devPlugin = () => {
  return {
    name: "dev-plugin", // 插件的名称
    // 一个异步的方法，用于配置服务器的
    // 接收一个参数，该参数就是 Vite 开发服务器的实例
    async configureServer(server) {
      // 首先第一步，咱们需要使用 esbuild 去同步的构建项目
      esbuild.buildSync({
        entryPoints: ["./src/main/mainEntry.js"], // 对象项目的入口文件
        bundle: true, //  启用打包，将依赖一起打包为一个文件
        platform: "node", // 指定平台为 node，主要是为了 Electorn 主进程服务
        format: "esm", // 模块的格式
        outfile: "./dist/mainEntry.js", // 输出文件的路径
        external: ["electron"], // 外部依赖，避免被打包进去
      });
      // 接下来，我们需要监听服务器的 listening 事件
      // 这个 listening 事件会在服务器开始监听端口时触发
      server.httpServer.once("listening", () => {
        // 当触发 listening 事件的时候，我们需要启动 electron 进程

        // 获取服务器的地址信息，包括 IP 和端口
        const addressInfo = server.httpServer.address();
        // 构造服务器的 HTTP 地址字符串
        const httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;

        // 启动 electron 进程
        const electronProcess = spawn(
          electron,
          ["./dist/mainEntry.js", httpAddress],
          {
            cwd: process.cwd(), // 子进程 electron 当前的工作目录
            stdio: "inherit", // 继承父进程的标准输入输出
          }
        );

        // 监听 electron 的 close 事件
        electronProcess.on("close", () => {
          server.close(); // 关闭 Vite 开发服务器
          process.exit(); // 退出当前进程
        });
      });
    },
  };
};

export const getReplacer = () => {
  // 在这个插件里面，我们主要要做的事情就是替换工作
  // 这里的替换工作包含两个方面：
  // 1. Node.js 常见的模块替换，比如 path、fs、os 等
  // 2. Electron 相关的内置模块，比如 clipboard，ipcRenderer 等

  // 该数组存放了一些 Node.js 下常用模块
  let externalModels = [
    "os",
    "fs",
    "path",
    "events",
    "child_process",
    "crypto",
    "http",
    "buffer",
    "url",
    "better-sqlite3",
    "knex",
  ];
  // 该对象用于存储最终的替换结果
  let result = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}'); export { ${item} as default }`,
    });
  }

  // 处理 electron 对应的模块，处理的思路和上面的 node.js 的处理思路是一样。
  result["electron"] = () => {
    let electronModules = [
      "clipboard",
      "ipcRenderer",
      "nativeImage",
      "shell",
      "webFrame",
    ].join(",");
    return {
      find: new RegExp(`^electron$`), // 使用该正则去匹配 electron 模块
      code: `const { ${electronModules} } = require('electron'); export { ${electronModules} }`, // 要生成的代码片段
    };
  };

  return result;
};
