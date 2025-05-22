<template>
    <div class="common-layout">
        <div class="main-container">
            <LayHeader />
        </div>
        <el-container>
            <el-header class="cus_header header-flex">1
                <div class="header-lf">
                </div>
                <el-menu mode="horizontal" :default-active="activeMenu" class="cus-menu-horizontal" router>
                    <menu-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
                </el-menu>

            </el-header>
            <el-container class="classic-content">
                <el-aside width="200px" style="display: none;">
                    <el-menu :default-active="activeMenu" class="cus-menu-vertical" background-color="#fff"
                        text-color="#333" active-text-color="#409EFF" router>
                        <menu-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
                    </el-menu>
                </el-aside>
                <el-container class="classic-main">
                    <el-main>
                        <RouterView />
                    </el-main>
                </el-container>
            </el-container>

        </el-container>

    </div>
</template>
<script setup>
import { defineComponent, h, computed, ref, onMounted } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'

import MenuItem from './MenuItem.vue' // 递归组件


onMounted(() => {
    if (window.ipc) {
        window.ipc.receive('fromMain', (data) => {
            if (data && data.event) {
                if (data.event === 'console') {
                    console.log('%c助手：', 'color:#fff;font-size:14px', data.data)
                } 
            }
        })


    }
})



const router = useRouter()
const route = useRoute()
// 获取当前激活的菜单项
const activeMenu = computed(() => route.path)



// 过滤出有 meta.title 的路由作为菜单显示
const routes = computed(() =>
    router.options.routes[0].children.filter((r) => r.meta?.title || (r.children && r.children.length))
)




const LayHeader = defineComponent({
    name: "LayHeader",
    render() {
        return h(
            "div",
            {
                class: { "fixed-header": true },
                style: ["box-shadow: 0 1px 4px #0d0d0d"

                ]
            },
            {
                default: () => [
                    null,
                    null,
                    null,
                    null
                ]
            }
        );
    }
});

</script>
<style lang="scss" scoped>
.common-layout {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
}

.el-container {
    width: 100%;
    height: 100%;


    .classic-content {
        display: flex;
        height: calc(100% - 50px - 40px);
    }

    .classic-main {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
}

.header-flex {
    display: flex;
    align-items: center;
    height: 40px;
    background-color: var(--color-background-base);

    .header-lf {
        width: 180px;
    }


    .operate-setting {
        margin-left: auto;
        display: flex;
        align-items: center;

        &:focus {
            outline: none;
        }
    }
}

.sys-user {
    display: flex;
    align-items: center;

    .username {
        margin-right: 10px;
        color: #fff;
    }

    .item-box {
        width: 100px;
        margin-right: 10px;
    }
}

.sys-setting {
    margin: 0 10px 0 0;
    padding: 5px;
    height: 28px;
    width: 28px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #fff;
}

.classic-footer {
    height: 40px;
}
</style>
<style lang="scss">
.cus-menu-vertical .el-menu-item.is-active {
    background: var(--color-background-base) !important;
    color: #fff;
}

.cus-menu-horizontal {
    height: 40px;
    min-width: 570px;
    color: #fff;
    background: var(--color-background-base);

}

.cus-menu-horizontal.el-menu--horizontal>.el-menu-item.is-active {
    color: #fff !important;
}

.cus-menu-horizontal.el-menu--horizontal>.el-sub-menu.is-active .el-sub-menu__title {
    color: #fff !important;
}
</style>