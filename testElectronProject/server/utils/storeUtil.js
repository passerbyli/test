const { app } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const consoleUtil = require("./consoleLogUtil");

function getUserData() {
  const dataPath = path.join(app.getPath("userData"), "data.json");
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}), { encoding: "utf-8" });
  }
  return JSON.parse(fs.readFileSync(dataPath, { encoding: "utf-8" }));
}

function setUserData(params) {
  const dataPath = path.join(app.getPath("userData"), "data.json");
  fs.writeFileSync(dataPath, JSON.stringify(params, null, 2), {
    encoding: "utf-8",
  });
}

function setUserDataStr(strParams) {
  const dataPath = path.join(app.getPath("userData"), "data.json");
  fs.writeFileSync(dataPath, strParams, { encoding: "utf-8" });
}

function setUserDataProperty(key, value) {
  const data = getUserData();
  data[key] = value;
  setUserData(data);
}

function getUserDataProperty(key) {
  return getUserData()[key];
}

function setUserDataJsonProperty(key, json) {
  let obj;
  try {
    obj = JSON.parse(json);
  } catch (error) {}
  if (obj) {
    const data = getUserData();
    data[key] = obj;
    setUserData(data);
  }
}

module.exports = {
  getUserData,
  setUserData,
  setUserDataStr,
  getUserDataProperty,
  setUserDataProperty,
  setUserDataJsonProperty,
};
