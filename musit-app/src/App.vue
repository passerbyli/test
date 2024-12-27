<template>
  <div>Hello</div>
</template>

<script setup>
import fs from "fs";
import { ipcRenderer } from "electron";
import { onMounted } from "vue";
onMounted(() => {
  console.log(fs.writeFileSync);
  console.log(ipcRenderer);
});
</script>

<style scoped></style>
