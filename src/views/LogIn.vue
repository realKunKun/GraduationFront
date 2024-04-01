<template>
  <MyLoginLogo></MyLoginLogo>
  <div class="sign">
    <div class="sign-head">
      <span>Account Login</span>
    </div>
    <el-form ref="signInForm" status-icon :model="registerForm" :rules="SignInRules">
      <el-form-item prop="username">
        <el-input placeholder="UserName" v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="Password" v-model="registerForm.password" @keyup.enter="handleLoginIn"></el-input>
      </el-form-item>
      <el-form-item class="sign-btn">
        <el-button @click="handleSignUp">Register</el-button>
        <el-button type="primary" @click="handleLoginIn">Log In</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance } from "vue";
import mixin from "@/mixins/mixin";
import { HttpManager} from "@/apis/indexs";
import { NavName, RouterName, SignInRules } from "@/enums";
import MyLoginLogo from "@/components/layouts/MyLoginLogo.vue";

export default defineComponent({
  components: {
    MyLoginLogo,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const { routerManager, changeIndex } = mixin();

    // Login username and password
    const registerForm = reactive({
      username: "",
      password: "",
    });

    async function handleLoginIn() {
      localStorage.removeItem("access_token");
      let canRun = true;
      (proxy.$refs["signInForm"] as any).validate((valid) => {
        if (!valid) return (canRun = false);
      });
      if (!canRun) return;

      const params = {
        username:registerForm.username,
        password:registerForm.password
      };

      try {
        const result = (await HttpManager.signIn(params)) as ResponseBody;
        (proxy as any).$message({
          message: result.message,
          type: result.type,
        });
        if (result.success) {
          if (result.data==null){  console.error("no that user");}
          else {
            localStorage.setItem("access_token", result.data);
            const userData = (await HttpManager.getUserOfName(params.username)) as ResponseBody;
            try {
              proxy.$store.commit("setUserId", userData.data.id);
              proxy.$store.commit("setUsername", userData.data.username);
              proxy.$store.commit("setUserPic", userData.data.avatar);
              proxy.$store.commit("setUserPassword",userData.data.password)
              proxy.$store.commit("setToken", true);
              changeIndex(NavName.Home);
              routerManager(RouterName.Home, { path: RouterName.Home });
            }
            catch (error){
              console.error(userData.data);
            }
          }
        }
      } catch (error) {
        console.error("Log In fail");
      }
    }

    function handleSignUp() {
      routerManager(RouterName.SignUp, { path: RouterName.SignUp });
    }

    return {
      registerForm,
      SignInRules,
      handleLoginIn,
      handleSignUp,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./src/assets/css/sign.scss";
</style>
