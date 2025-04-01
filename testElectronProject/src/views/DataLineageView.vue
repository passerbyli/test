<template>
    <button @click="selectFolder">选择文件夹</button>
    <p v-if="path">绝对路径：{{ path }}</p>
</template>

<script>
import { defineComponent, toRefs, reactive, ref } from 'vue';

export default defineComponent({
    name: 'DataLineageView',
    setup() {
        const path = ref('')



        const selectFolder = async () => {
            if (window.ipc) {
                await window.ipc.sendInvoke('toMain', {
                    event: 'select-folder'
                }).then((result) => {
                    if (result) {
                        path.value = result[0]
                    }
                });

            }
        };

        const dataMap = reactive({
            selectFolder,
            path
        })

        return {
            ...toRefs(dataMap)
        }
    }
});



</script>
