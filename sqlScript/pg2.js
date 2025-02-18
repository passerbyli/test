const pgStructure = require("pg-structure");
const { Client } = require("pg");

const client = new Client({
  user: "your_user",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432,
});

client.connect();

pgStructure(client)
  .then((structure) => {
    console.log(structure.tables); // 获取所有表
    console.log(structure.views); // 获取所有视图
    console.log(structure.functions); // 获取所有函数
  })
  .catch((err) => console.error(err))
  .finally(() => client.end());
