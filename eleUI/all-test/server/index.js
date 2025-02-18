const { mainSendToRender } = require("./utils/mainProcessMsgHandle");

function updateRenderShoppingItemInfo(shoppingItem) {
  // 数据发送到渲染进程
  mainSendToRender("update.shopping.item", shoppingItem);
}

async function searchProduct(params = {}) {
  let data = null;
  console.log("daoidjaios");
  return data;
}

module.exports = {
  searchProduct,
};
