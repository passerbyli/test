const mysql = require("mysql2/promise");

// 配置你的 MySQL 连接信息
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin2312",
  database: "tasks_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 示例函数：查询任务（根据传入条件查询）
async function queryTasks(query) {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM tasks WHERE title LIKE ?",
      [`%${query}%`]
    );
    return rows;
  } catch (err) {
    console.error("查询任务出错：", err);
    return [];
  }
}

module.exports = { queryTasks };
