<template>
  <el-container class="home-container">
    <el-aside :style="{ width: isCollapse ? '65px' : '210px' }">
      <div class="logo">
        <img src="../assets/image/logo.png" class="siderbar-logo">
        <h3 v-show="!isCollapse">{{ APP_TITLE }}</h3>
      </div>

      <el-menu background-color="#304156" text-color="#fff" unique-opened router
               :default-active="$route.path"
               :collapse="isCollapse" :collapse-transition="false">

        <template v-for="subItem in ParentListSet" :key="subItem.url">
          <el-sub-menu v-if="subItem.childlist?.length" :index="subItem.id" :key="subItem.id">
            <template #title>
              <el-icon v-if="subItem.icon">
                <component :is="subItem.icon"></component>
              </el-icon>
              <span>{{ subItem.menuname }} </span>
            </template>
            <el-menu-item v-for="sub in subItem.childlist" :index="sub.url" :key="sub.id">
              <template #title>
                <el-icon v-if="sub.icon">
                  <component :is="sub.icon"></component>
                </el-icon>
                <span>{{ sub.menuname }} </span>
              </template>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item v-else :index="subItem.url" :key="subItem.id">
            <el-icon v-if="subItem.icon">
              <component :is="subItem.icon"></component>
            </el-icon>
            <template #title>
              <span>{{ subItem.menuname }}</span>
            </template>
          </el-menu-item>
        </template>


      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="height: 40px; padding-left: 8px">
        <div class="fold-btn">
          <el-icon size="20" @click="toggleCollapse">
            <component :is="collapseBtn"/>
          </el-icon>
        </div>
        <div class="bread-btn">
          <el-breadcrumb separator=">" v-if="$router.currentRoute.path != '/index'">
            <template v-if="$route.meta.sTitle  != null  ">
              <el-breadcrumb-item to="{ path: '/index' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ $route.meta.sTitle }}</el-breadcrumb-item>
            </template>

            <template v-if="$route.meta.tTitle != null  ">
              <el-breadcrumb-item>{{ $route.meta.tTitle }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <HeadModel/>
      </el-header>
      <TagModel/>
      <el-main style="padding: 10px;">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import HeadModel from '@/components/model/head.vue'
import TagModel from '@/components/model/tags.vue'
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router'
import globalApi from "@/config/global.js"
import {useDataStore} from '@/store'

const APP_TITLE = import.meta.env.VITE_APP_TITLE

interface ChildList {
  id: string,
  menuname: string,
  icon: string,
  url: string,
}

interface ParentList {
  id: string,
  menuname: string,
  url: string,
  icon: string,
  childlist: ChildList[],
}


let ParentListSet = ref<[ParentList]>();
let isCollapse = ref<boolean>(false);
let collapseBtn = ref<string>('Fold');
let activePath = ref<string>('');


const global = globalApi()
const router = useRouter();
const dataStore = useDataStore()

const getMenu = (async () => {

  await dataStore.fetchData();
  ParentListSet.value = dataStore.$state.ParentMenu
  /*const {data: res} = await api.reqParentMenu()
  if (res.code !== 200) {
    ElMessage.error(res.message)
  } else {
    ParentListSet.value = res.data.ParentMenu
  }*/
})


const toggleCollapse = (() => {
  isCollapse.value = !isCollapse.value
  if (collapseBtn.value === 'Fold') {
    collapseBtn.value = 'Expand'
  } else {
    collapseBtn.value = 'Fold'
  }
})


const computed = (() => {

})


onMounted(() => {
  getMenu()
})

</script>

<style lang="less" scoped>
.home-container {
  height: 100%;

  .el-aside {
    background-color: #304156;

    .logo {
      margin-top: 5px;
      display: flex;
      align-items: center;
      font-size: 13px;
      height: 50px;
      color: #fff;
      font-style: italic;

      .siderbar-logo {
        width: 32px;
        height: 32px;
        margin: 0 16px;
      }

    }

    .el-menu {
      border-right: none;
    }

  }

  .el-header {
    background-color: #f9fafc;
    align-items: center;
    justify-content: space-between;
    display: flex;

    .fold-btn {
      padding-top: 5px;
      font-size: 23px;
      cursor: pointer;
      margin-left: 0;
    }

    .bread-btn {
      padding-top: 2px;
      position: fixed;
      margin-left: 30px;
    }

  }

  .el-main {
    background-color: #eaedf1;
  }

}
</style>