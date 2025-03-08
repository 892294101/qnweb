<template>
  <el-select v-model="GroupCode" placeholder="选择主机组" filterable clearable remote :loading="LoadHostGroupLoading"
             :loading-text="'正在提取主机组'" @visible-change="rmRequestHostGroup">
    <el-option v-for="item in filterHostGroupSet" :key="item.GroupCode" :label="item.GroupName" :value="item.GroupCode" :style="{ fontSize: '10px' }">
      <span style="float: left">{{ item.GroupName }}</span>
      <span style="float: right;color: var(--el-text-color-secondary); font-size: 10px;">{{ item.PlatformName }}</span>
    </el-option>
  </el-select>
</template>


<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus';
import {onMounted, reactive, ref} from "vue";
import api from "@/api";

const router = useRouter();

let GroupCode = ref<string>("")

let LoadHostGroupLoading = ref<boolean>(false);


const rmRequestHostGroup = visible => {
  if (visible) {
    getRemoteHostGroup()
  }
}

interface HostGroupStruct {
  Id: string
  ProjectName: string
  PlatformName: string
  GroupCode: string
  GroupName: string
  Address: string
}

let filterHostGroupSet = reactive<HostGroupStruct[]>([])

const getRemoteHostGroup = async () => {
  LoadHostGroupLoading.value = true
  const {data: res} = await api.getHostGroupDropDown()
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }

  filterHostGroupSet.splice(0, filterHostGroupSet.length)
  for (let i = 0; i < res.data.length; i++) {
    filterHostGroupSet.push(res.data[i])
  }

  LoadHostGroupLoading.value = false
}

onMounted(() => {
  getRemoteHostGroup()
})

</script>


<style scoped lang="scss">

</style>