<template>
  <MyLoginLogo></MyLoginLogo>
  <div class="sign">
    <div class="sign-head">
      <span>Register</span>
    </div>
    <el-form ref="signUpForm" label-width="70px" status-icon :model="registerForm" :rules="SignUpRules">
      <el-form-item prop="username" label="Username">
        <el-input v-model="registerForm.username" placeholder="username"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="password">
        <el-input type="password" placeholder="password" v-model="registerForm.password"></el-input>
      </el-form-item>
      <el-form-item prop="sex" label="gender">
        <el-radio-group v-model="registerForm.sex">
          <el-radio :label="0">Female</el-radio>
          <el-radio :label="1">Male</el-radio>
          <el-radio :label="2">Security</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="phoneNum" label="Phone">
        <el-input placeholder="Phone" v-model="registerForm.phoneNum"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="email">
        <el-input v-model="registerForm.email" placeholder="email"></el-input>
      </el-form-item>
      <el-form-item prop="birth" label="birthday">
        <el-date-picker type="date" placeholder="select date" v-model="registerForm.birth" style="width: 100%"></el-date-picker>
      </el-form-item>
      <el-form-item prop="introduction" label="signature">
        <el-input type="textarea" placeholder="signature" v-model="registerForm.introduction"></el-input>
      </el-form-item>
      <el-form-item prop="location" label="location">
        <el-select v-model="registerForm.location" placeholder="location" style="width: 100%">
          <el-option v-for="item in AREA" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="sign-btn">
        <el-button @click="goBack()">Log In</el-button>
        <el-button type="primary" @click="handleSignUp(formRef)">Yes</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance } from "vue";
import mixin from "@/mixins/mixin";
import { HttpManager} from "@/apis/indexs";
import { getBirth } from "@/utils";
import { AREA, RouterName, NavName, SignUpRules } from "@/enums";
import MyLoginLogo from "@/components/layouts/MyLoginLogo.vue";

export default defineComponent({
  components: {
    MyLoginLogo,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const { routerManager, changeIndex } = mixin();

    const registerForm = reactive({
      username: "",
      password: "",
      sex: "",
      phoneNum: "",
      email: "",
      birth: new Date(),
      introduction: "",
      location: "",
    });

    async function handleSignUp() {
      let canRun = true;
      (proxy.$refs["signUpForm"] as any).validate((valid) => {
        if (!valid) return (canRun = false);
      });
      if (!canRun) return;

      const params = {username:registerForm.username,
        password:registerForm.password,
        sex:registerForm.sex,
        phoneNum:registerForm.phoneNum,
        email:registerForm.email,
        birth:getBirth(registerForm.birth),
        introduction:registerForm.introduction,
        location:registerForm.location
        };

      try {
        const result = (await HttpManager.SignUp(params)) as ResponseBody;
        (proxy as any).$message({
          message: result.message,
          type: result.type,
        });

        if (result.success) {
          changeIndex(NavName.SignIn);
          routerManager(RouterName.SignIn, { path: RouterName.SignIn });
        }
      } catch (error) {
        console.error(error);
      }
    }

    return {
      SignUpRules,
      AREA,
      registerForm,
      handleSignUp,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./src/assets/css/sign.scss";
</style>
