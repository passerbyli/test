const { app } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

function getUserData() {
  const dataPath = path.join(app.getPath("userData"), "data.json");
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}), { encoding: "utf-8" });
  }
  return JSON.parse(fs.readFileSync(dataPath, { encoding: "utf-8" }));
}

function getUserDataProperty(key) {
  return getUserData()[key];
}

module.exports = {
  getUserData,
  getUserDataProperty,
};
