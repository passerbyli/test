const Store = require('electron-store')

const configStore = new Store({
  name: 'config', // 存储为 config.json
  defaults: {
    theme: 'light',
    lang: 'zh-CN',
    notify: true,
    version: '1.0.0',
    server: {
      host: '127.0.0.1',
      port: 3306,
    },
    datasources: [
      {
        name: 'pgsql_name',
        dbType: 'pgsql',
        host: 'localhost',
        user: 'postgres',
        password: 'admin2312',
        database: 'lihaomin',
        port: 5432,
        timezone: '+00:00xxx',
        aa: 'xx',
      },
      {
        name: 'mysqlsql_name',
        dbType: 'mysql',
        host: 'localhost',
        user: 'root',
        password: 'admin2312',
        database: 'information_schema',
        port: 3306,
        timezone: '+00:00',
      },
    ],
  },
})

module.exports = configStore
