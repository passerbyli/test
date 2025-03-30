const mysql = require("mysql2");
const { getUserDataProperty } = require("./storeUtil");

let pool;
/**
 * 数据库配置
 */
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "admin2312",
  database: "information_schema",
  port: "3306",
  timezone: "+00:00",
};

// 创建 MySQL 连接
// const connection = mysql.createConnection(dbConfig);

// 创建 MySQL 连接
// const createMySQLConnection = async () => {
//   try {
//     return mysql.createConnection(dbConfig);
//   } catch (err) {
//     console.error("无法读取数据库配置:", err);
//     return null;
//   }
// };

// 初始化数据库连接池
const createMySQLPool = async () => {
  if (!pool) {
    try {
      const config = await getUserDataProperty("settings");
      pool = mysql.createPool(config.dataBase); // 创建连接池
    } catch (err) {
      console.error("无法读取数据库配置:", err);
    }
  }
  return pool;
};

// 获取数据库列表
const getDatabases = async () => {
  const connection = await createMySQLPool(); // 获取连接池
  return new Promise((resolve, reject) => {
    connection.query("SHOW DATABASES", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// 获取指定数据库的表列表
const getTables = async (database) => {
  const connection = await createMySQLPool(); // 获取连接池
  return new Promise((resolve, reject) => {
    connection.query(`SHOW TABLES FROM ${database}`, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// 获取指定数据库的存储过程列表
const getRoutines = async (database) => {
  const connection = await createMySQLPool(); // 获取连接池
  return new Promise((resolve, reject) => {
    connection.query(
      `SHOW PROCEDURE STATUS WHERE Db = ?`,
      [database],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

// 获取表的数据
const getTableData = async (database, table) => {
  const connection = await createMySQLPool(); // 获取连接池
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${database}.${table}`, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// 获取存储过程定义
const getProcedureDefinition = async (database, procedure) => {
  const connection = await createMySQLPool(); // 获取连接池
  return new Promise((resolve, reject) => {
    connection.query(
      `SHOW CREATE PROCEDURE ${database}.${procedure}`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

module.exports = {
  getDatabases,
  getTables,
  getRoutines,
  getTableData,
  getProcedureDefinition,
};
