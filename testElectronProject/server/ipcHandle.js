const {
  getUserDataProperty,
  setUserDataJsonProperty,
} = require("./utils/storeUtil");

const { shell, app } = require("electron");
const path = require("node:path");
const db = require("./utils/db");

async function ipcHandle(e, args) {
  if (!args || !args.event) {
    return;
  }
  const event = args.event;
  const params = args.params;
  let data;

  console.group("【ipcHandle】:", event);
  console.log("params:", params);
  console.groupEnd();
  if (event === "getUserDataProperty") {
    data = getUserDataProperty(params);
  } else if (event === "setUserDataJsonProperty") {
    setUserDataJsonProperty(params.key, params.value);
  } else if (event === "openDirectory") {
    data = await openDirectory();
  } else if (event === "getDataBases") {
    data = await db.getDatabases();
  } else if (event === "getTables") {
    data = await db.getTables(params.database);
  } else if (event === "getTableData") {
    data = await db.getTableData(params.database, params.table);
  } else if (event === "getRoutines") {
    data = await db.getRoutines(params.database);
  } else if (event === "getProcedureDefinition") {
    data = await db.getProcedureDefinition(params.database, params.procName);
  }
  console.log("data:", data);
  return data;
}

async function openDirectory() {
  let folderPath = path.join(app.getPath("userData"));
  console.log("folderPath:", folderPath);
  //  folderPath = "/Users/lihaomin/projects/GitHub/test";
  shell
    .openPath(folderPath)
    .then(() => {
      console.log("文件夹已打开");
    })
    .catch((err) => {
      console.error("无法打开文件夹:", err);
    });
}

module.exports = { ipcHandle };
