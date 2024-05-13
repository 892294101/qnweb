<template>
  <div>
    <span class="user-username"> {{ loginForm.username }} </span>
    <el-dropdown>
      <span class="el-dropdown-link">
        <img v-if="loginForm.iconImage" :src="loginForm.iconImage.String" class="user-avator" alt=""/>
        <img v-else src="@/assets/image/logo.png" class="user-avator" alt=""/>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <span @click="openPersonal">个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, reactive} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRouter} from "vue-router";
import storage from '@/utils/storage'

const router = useRouter();

interface HeadInfoStruct {
  username: string;
  iconImage: ValueStruct;
}


const initialValue: ValueStruct = {
  String: "",
  Valid: false
}

interface ValueStruct {
  String: string,
  Valid: boolean,
}

const loginForm = reactive<HeadInfoStruct>({
  username: "",
  iconImage: {...initialValue},
});

const openPersonal = (async () => {
  await router.push({path: "/personal/info"})
})

const getLocalUserInfo = (() => {
  loginForm.iconImage = storage.getItem("icon")
  loginForm.username = storage.getItem("user")
})


const logout = (async () => {
  ElMessageBox.confirm(
      '退出系统?',
      'Warning',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
        //center: true,
      }
  ).then(async () => {
    storage.deleteVCookie('token')
    storage.clearAll();
    ElMessage({type: 'success', message: '已成功退出', center: true})
    await router.push({path: "/login"})
  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })

})


onBeforeMount(() => {
  getLocalUserInfo()
})

</script>

<style lang="less" scoped>
.user-username {
  position: fixed;
  right: 60px;
  font-size: medium;
  margin-top: 3px;
  text-align: center;
  color: #6c6c6c;
}


.user-avator {
  cursor: pointer;
  width: 25px;
  height: 25px;
  border-radius: 8px;
}

</style>