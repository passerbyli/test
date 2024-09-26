// config.js: 配置测试和生产环境的 URL 和定时请求的时间间隔
const config = {
  environments: {
    test: {
      loginUrl: "https://test.example.com/login",
      apiUrl: "https://test.example.com/api/data",
    },
    prod: {
      loginUrl: "https://prod.example.com/login",
      apiUrl: "https://prod.example.com/api/data",
    },
  },
  requestInterval: 30000, // 定时请求时间间隔（毫秒），例如每 30 秒
};
