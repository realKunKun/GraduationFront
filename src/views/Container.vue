<template>
  <el-container>
    <el-header>
      <MyHeader></MyHeader>
    </el-header>
    <el-main>
      <router-view />
      <MyCurrentPlay></MyCurrentPlay>
      <MyPlayBar></MyPlayBar>
      <MyScrollTop></MyScrollTop>
      <MyAudio></MyAudio>
    </el-main>
    <el-footer>
      <MyFooter></MyFooter>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from "vue";
import MyCurrentPlay from "@/components/layouts/MyCurrentPlay.vue";
import MyPlayBar from "@/components/layouts/MyPlayBar.vue";
import MyAudio from "@/components/layouts/MyAudio.vue";
import MyScrollTop from "@/components/layouts/MyScrollTop.vue";
import MyFooter from "@/components/layouts/MyFooter.vue";
import MyHeader from "@/components/layouts/MyHeader.vue";

const { proxy } = getCurrentInstance();

if (sessionStorage.getItem("dataStore")) {
  proxy.$store.replaceState(Object.assign({}, proxy.$store.state, JSON.parse(sessionStorage.getItem("dataStore"))));
}

window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("dataStore", JSON.stringify(proxy.$store.state));
});
</script>

<style lang="scss" scoped>
@import "./src/assets/css/var.scss";
@import "./src/assets/css/global.scss";

.el-container {
  min-height: calc(100% - 60px);
}
.el-header {
  padding: 0;
}
.el-main {
  padding-left: 0;
  padding-right: 0;
}
</style>
