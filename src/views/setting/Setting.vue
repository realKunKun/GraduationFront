<template>
  <div class="setting">
    <h1>Setting</h1>
    <el-tabs tab-position="left">
      <el-tab-pane label="Personal Data" class="content">
        <Personal-data></Personal-data>
      </el-tab-pane>
      <el-tab-pane label="Change password" class="content">
        <Password></Password>
      </el-tab-pane>
      <el-tab-pane label="Account And Security" class="content">
        <el-button type="danger" :icon="Delete" @click="cancelAccount">Cancel Account</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, computed, reactive } from "vue";
import { Delete } from "@element-plus/icons-vue";
import PersonalData from "./PersonalData.vue";
import Password from "./Password.vue";
import { HttpManager } from "@/apis/indexs";
import { useStore } from "vuex";
import mixin from "@/mixins/mixin";
import { RouterName } from "@/enums";

export default defineComponent({
  components: {
    PersonalData,
    Password,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const { routerManager } = mixin();

    const userId = computed(() => store.getters.userId);

    async function cancelAccount() {
      const result = (await HttpManager.deleteUser(userId.value)) as ResponseBody;
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });
      routerManager(RouterName.SignIn, { path: RouterName.SignIn });
      proxy.$store.commit("setToken", false);
    }

    return {
      Delete,
      cancelAccount,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./src/assets/css/var.scss";
@import "./src/assets/css/global.scss";

h1 {
  border-bottom: 1px solid $color-grey;
}

.content {
  padding-top: 20px;
  text-align: center;
}

@media screen and (min-width: $sm) {
  .setting {
    margin: 0 10% 30px;
    padding: 20px;
    min-height: 60vh;
  }
}

@media screen and (max-width: $sm) {
  .setting {
    padding: 20px;
  }
}
</style>
