const { searchProduct } = require("./index");

async function ipcHandle(e, args) {
  console.log("111111", args);
  if (!args || !args.event) {
    return;
  }
  const event = args.event;
  const params = args.params;
  let data;
  if (event == "startBid") {
    console.log(event);
  }

  return data;
}

module.exports = { ipcHandle };
