<template>
  <div class="login_container">
    <div class="login_box">
      <el-form class="login_form" ref="loginFormRef" :rules="rules" :model="loginForm">
        <div class="title">{{ APP_TITLE }}</div>
        <el-form-item prop="username" size="large">
          <el-input size="large" @keydown.enter.capture="submitLoginForm(loginFormRef)" ref="usernameRef" prefix-icon="Avatar" placeholder="账号" v-model="loginForm.username" maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item prop="password" size="large">
          <el-input size="large" @keydown.enter.capture="submitLoginForm(loginFormRef)" placeholder="密码" prefix-icon="Key" minlength="5" maxlength="18" v-model="loginForm.password" clearable
                    show-password></el-input>
        </el-form-item>
        <el-form-item prop="image" size="large">
          <el-input size="large" @keydown.enter.capture="submitLoginForm(loginFormRef)" placeholder="验证码" @input="checkCodeValidate(loginForm.image)" prefix-icon="View"
                    style="width: 200px; float: left;"
                    minlength="4" maxlength="4" v-model="loginForm.image" clearable/>
          <el-image class="captchaImg" style="width: 150px; float: left;" :src="image" @click="getCaptcha"/>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-button class="login-but" size="large" :loading="Loading" type="primary" @click="submitLoginForm(loginFormRef)">登录</el-button>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-button class="login-reset" size="large" :loading="Loading" type="info" @click="resetLoginForm(loginFormRef)">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {FormInstance, FormRules} from 'element-plus';
import {ElMessage} from 'element-plus';
import {onBeforeUnmount, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router'

import {useCookies} from "vue3-cookies";
import api from '@/api'
import storage from '@/utils/storage'

const APP_TITLE = import.meta.env.VITE_APP_TITLE

const router = useRouter();
const {cookies} = useCookies();
const Loading = ref<boolean>(false);
const rules: FormRules = {
  username: [{required: true, message: "请输入账号", trigger: "blur", min: 4, max: 30}],
  password: [{required: true, message: "请输入密码", trigger: "blur", min: 5, max: 30}],
  image: [{required: true, message: "请输入验证码", trigger: "blur", min: 4, max: 4}]
};

interface LoginInfo {
  username: string;
  password: string;
  image: string;
  idKey: string;
}

let image = ref<string>('')

let loginForm = reactive<LoginInfo>({
  username: '',
  password: '',
  image: '',
  idKey: '',
});

const loginFormRef = ref<FormInstance>();

const submitLoginForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      Loading.value = true
      const {data: res} = await api.login(loginForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        await getCaptcha()
        usernameRef.value.focus();
        loginForm.image = ''
        loginForm.username = ''
        loginForm.password = ''
        Loading.value = false
      } else {
        storage.setItem('user', res.data.username);
        storage.setItem('icon', res.data.icon);
        storage.setVCookie('token', res.data.token)

        // 登录组件中，登录成功后：
        // 获取重定向地址,如果存在则跳转,否则定向到主页
        const redirectData = sessionStorage.getItem('UserRedirect');
        console.log("redirectData: ", redirectData)
        if (redirectData) {
          ElMessage.success({message: "登录成功，跳转中···", center: true})
          setTimeout(async () => {
            await router.push(redirectData);
          }, 500);
        } else {
          ElMessage.success({message: "登录成功", center: true})
          setTimeout(async () => {
            await router.push({path: "/index"})
          }, 500);
        }
        sessionStorage.removeItem('redirect');
        Loading.value = false
      }
    }
  });
};

const checkCodeValidate = (value => {
  const reg = /^[0-9a-zA-Z]*$/
  if (reg.test(value)) {
    return true
  } else {
    loginForm.image = value.replace(/[^a-zA-Z0-9]/g, "")
  }
})


const getCaptcha = (async () => {
  const {data: res} = await api.reqCaptcha()
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  image.value = res.data.image
  loginForm.idKey = res.data.idKey
})

const resetLoginForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getCaptcha()
}


onBeforeUnmount(() => {
})

const usernameRef = ref(null);

onMounted(() => {
  usernameRef.value.focus();
  getCaptcha()
})


</script>

<style lang="less" scoped>

.login_container {
  background-image: url("@/assets/image/background.png");
  background-size: cover;
  height: 100%;
  width: 100%;

}


.login_box {
  width: 400px;
  height: 330px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
}

.login_form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
}

.title {
  color: white;
  font-size: 23px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  font-style: italic;
}

.captchaImg {
  height: 38px;
  width: 100%;
  margin-left: 8px;
  border: 0 solid rgba(0, 0, 0, 0.5);
  border-radius: 3px;
}

.login-but {
  width: 169px;
  font-size: large;
  opacity: 0.9;
  background-image: linear-gradient(to right, #74ebd5 0%, #9face6 100%);
}

.login-reset {
  width: 169px;
  font-size: large;
  opacity: 0.9;
}

/* .el-input .el-input--large .el-input--prefix .el-input--suffix*/

:deep(#el-input-login) {
  border-color: red;
}

:deep(.el-input__wrapper) {
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  box-shadow: chartreuse;
}

:deep(.el-input__inner) {
  color: white;
  box-sizing: border-box;

}


</style>