<template>
  <div id="app">1234
    aaaaaaa
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted, toRefs } from "vue";
// import ShoppingSetting from "./components/ShoppingSetting";
// import ProductList from "./components/ProductList";
// import ShoppingList from "./components/ShoppingList";
export default defineComponent({
  name: "App",
  components: {
    // ShoppingSetting,
    // ProductList,
    // ShoppingList,
  },
  setup() {
    onMounted(() => {
      console.log('APP onMounted ----');
      if (window.ipc) {
        window.ipc.receive("fromMain", (data) => {
          console.log('-----------', data)
        })
      }
    });
    const dataMap = reactive({
      shoppingListRef: null,
      async goToBid(params) {
        // 先校验列表数据
        const valid = await dataMap.shoppingListRef.validateForm();
        if (valid) {
          const shoppingList = dataMap.shoppingListRef.getShoppingListBeforeBid(params.lastBidCountdownTime);
          const paramsStr = JSON.stringify({ shoppingList, enableStopOnSuccess: params.enableStopOnSuccess });
          window.ipc && window.ipc.send("toMain", {
            event: "startProcessShoppingList",
            params: paramsStr
          });
        }
      },
      async updateBid(params) {
        const valid = await dataMap.shoppingListRef.validateForm();
        if (valid) {
          const shoppingList = dataMap.shoppingListRef.getShoppingListBeforeBid(params.lastBidCountdownTime);
          const paramsStr = JSON.stringify({ shoppingList, enableStopOnSuccess: params.enableStopOnSuccess });
          window.ipc && window.ipc.send("toMain", {
            event: "updateProcessShoppingList",
            params: paramsStr
          });
        }
      },
      addToShoppingList(productInfo) {
        if (productInfo) {
          dataMap.shoppingListRef.addItem(productInfo);
        }
      },
      openLink(params) {
        window.ipc && window.ipc.send("toMain", { event: "openLink", params, });
      },
      addAllToShoppingList(itemList) {
        dataMap.shoppingListRef.addItemList(itemList);
      },
    });
    return {
      ...toRefs(dataMap)
    }
  }
})
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--ep-text-color-primary);
  margin-top: 20px;
}

.app-above {
  border: 2px black solid;
}

.app-above__col {
  padding: 10px 10px;
}

.app-under {
  border: 2px black solid;
  margin-top: 15px;
}

.app-title {
  text-align: left;
  font-size: 16px;
  font-weight: 700;
}

.item-title {
  text-align: left;
  font-size: 14px;
  font-weight: 700;
}

.product-link {
  cursor: pointer;
  color: #2f81f7;
}
</style>