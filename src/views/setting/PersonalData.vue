<template>
  <el-form ref="updateForm" label-width="70px" :model="registerForm" :rules="SignUpRules">
    <el-form-item prop="username" label="user name">
      <el-input v-model="registerForm.username" placeholder="user name"></el-input>
    </el-form-item>
    <el-form-item label="Gender">
      <el-radio-group v-model="registerForm.sex">
        <el-radio :label="0">Female</el-radio>
        <el-radio :label="1">Male</el-radio>
        <el-radio :label="2">Secret</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="birth" label="Birthday">
      <el-date-picker type="date" placeholder="Select Date" v-model="registerForm.birth" style="width: 100%"></el-date-picker>
    </el-form-item>
    <el-form-item prop="introduction" label="Signature">
      <el-input type="textarea" placeholder="Signature" v-model="registerForm.introduction"></el-input>
    </el-form-item>
    <el-form-item prop="location" label="Location">
      <el-select v-model="registerForm.location" placeholder="Location" style="width: 100%">
        <el-option v-for="item in AREA" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="phoneNum" label="Phone">
      <el-input placeholder="Phone" v-model="registerForm.phoneNum"></el-input>
    </el-form-item>
    <el-form-item prop="email" label="Email">
      <el-input v-model="registerForm.email" placeholder="Email"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="goBack(-1)">Cancel</el-button>
      <el-button type="primary" @click="saveMsg()">Save</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, getCurrentInstance, reactive } from "vue";
import { useStore } from "vuex";
import mixin from "@/mixins/mixin";
import { AREA, SignUpRules } from "@/enums";
import { HttpManager} from "@/apis/indexs";
import { getBirth } from "@/utils";

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const { goBack } = mixin();

    // Register
    const registerForm = reactive({
      username: "",
      sex: "",
      phoneNum: "",
      email: "",
      birth: new Date(),
      introduction: "",
      location: "",
      userPic: "",
    });
    const userId = computed(() => store.getters.userId);
    const userpassword = computed(()=>store.getters.userPassword)

    async function getUserInfo(id) {
      const result = (await HttpManager.getUserOfId(id)) as ResponseBody;
      registerForm.username = result.data.username;
      registerForm.sex = result.data.sex;
      registerForm.phoneNum = result.data.phoneNum;
      registerForm.email = result.data.email;
      registerForm.birth = result.data.birth;
      registerForm.introduction = result.data.introduction;
      registerForm.location = result.data.location;
      registerForm.userPic = result.data.avator;
    }

    async function saveMsg() {
      let canRun = true;
      (proxy.$refs["updateForm"] as any).validate((valid) => {
        if (!valid) return (canRun = false);
      });
      if (!canRun) return;

      const params = {
        id:userId.value,
        username:registerForm.username,
        sex:registerForm.sex,
        phone_num:registerForm.phoneNum,
        email:registerForm.email,
        birth:getBirth(registerForm.birth),
        introduction:registerForm.introduction,
        location:registerForm.location
      };


      const result = (await HttpManager.updateUserMsg(params)) as ResponseBody;
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });
      if (result.success) {
        proxy.$store.commit("setUsername", registerForm.username);
        goBack(-1);
      }
    }

    onMounted(() => {
      getUserInfo(userId.value);
    });

    return {
      AREA,
      registerForm,
      SignUpRules,
      saveMsg,
      goBack,
    };
  },
});
</script>

<style lang="scss" scoped>
.btn ::v-deep .el-form-item__content {
  display: flex;
  justify-content: center;
}
</style>
