const mysql = require("mysql2");
const fs = require("fs");

// MySQL 数据库连接配置
const dbConfig = {
  host: "localhost", // 数据库地址
  user: "your_username", // 数据库用户名
  password: "your_password", // 数据库密码
  database: "your_database_name", // 数据库名称
};

// 连接到 MySQL
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error("连接数据库失败:", err.message);
    return;
  }
  console.log("成功连接到数据库！");

  // 查询 cms_details 表数据
  const query = "SELECT * FROM cms_details";
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error("查询失败:", error.message);
      connection.end();
      return;
    }

    // 找到 LONGBLOB 类型的字段
    const blobFields = fields
      .filter(
        (field) =>
          field.type === mysql.Types.BLOB ||
          field.type === mysql.Types.LONG_BLOB
      )
      .map((field) => field.name);

    // 将结果转换为 INSERT 语句
    let sqlStatements = results.map((row) => {
      const columns = Object.keys(row)
        .map((col) => `\`${col}\``)
        .join(", ");

      // 处理每一列的值
      const values = Object.entries(row)
        .map(([col, value]) => {
          if (value === null) {
            return "NULL";
          }
          if (blobFields.includes(col)) {
            // 将 BLOB 字段转为十六进制
            return `x'${value.toString("hex")}'`;
          }
          // 转义字符串中的单引号
          return `'${value.toString().replace(/'/g, "\\'")}'`;
        })
        .join(", ");

      return `INSERT INTO cms_details (${columns}) VALUES (${values});`;
    });

    // 写入到文件
    const fileName = "cms_details_insert.sql";
    fs.writeFile(fileName, sqlStatements.join("\n"), (err) => {
      if (err) {
        console.error("写入文件失败:", err.message);
      } else {
        console.log(`SQL 文件已成功生成: ${fileName}`);
      }
      connection.end(); // 关闭数据库连接
    });
  });
});
