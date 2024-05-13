<template>
  <el-select v-model="PlatformId" placeholder="选择平台名称" filterable clearable remote :loading="LoadPlatformLoading"
             :remote="true" :loading-text="'正在提取平台'" @visible-change="rmRequestPlatform">
    <el-option v-for="item in filterPlatformSet" :key="item.Id" :label="`${item.PlatformName}`" :value="item.Id" :style="{ fontSize: '12px' }">
      <span style="float: left">{{ item.PlatformName}}</span>
      <span
          style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 10px;
        "
      >{{ item.ProjectName }}</span
      >
    </el-option>
  </el-select>
</template>


<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus';
import {onMounted, reactive, ref} from "vue";
import api from "@/api";

const router = useRouter();

let PlatformId = ref<string>("")

let LoadPlatformLoading = ref<boolean>(false);


const rmRequestPlatform = visible => {
  if (visible) {
    getRemoteHostGroup()
  }
}

interface PlatformStruct {
  Id: string
  PlatformName: string
  ProjectName: string
}

let filterPlatformSet = reactive<PlatformStruct[]>([])

const getRemoteHostGroup = async () => {
  LoadPlatformLoading.value = true
  const {data: res} = await api.getPlatformDropDown()
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  filterPlatformSet.splice(0, filterPlatformSet.length)
  for (let i = 0; i < res.data.length; i++) {
    filterPlatformSet.push(res.data[i])
  }
  LoadPlatformLoading.value = false
}

onMounted(() => {
  getRemoteHostGroup()
})

</script>


<style scoped lang="scss">

</style>