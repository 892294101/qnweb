<template>
  <el-select v-model="ProjectId" placeholder="选择项目名称" filterable clearable remote :loading="LoadProjectLoading"
             :loading-text="'正在提取项目'" @visible-change="rmRequestProject">
    <el-option v-for="item in filterProjectSet" :key="item.Id" :label="item.ProjectName" :value="item.Id"/>
  </el-select>
</template>


<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus';
import {onMounted, reactive, ref} from "vue";
import api from "@/api";

const router = useRouter();

let ProjectId = ref<string>("")

let LoadProjectLoading = ref<boolean>(false);


const rmRequestProject = visible => {
  if (visible) {
    getRemoteHostGroup()
  }
}

interface ProjectStruct {
  Id: string
  ProjectName: string
}

let filterProjectSet = reactive<ProjectStruct[]>([])

const getRemoteHostGroup = async () => {
  LoadProjectLoading.value = true
  const {data: res} = await api.getProjectDropDown()
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  filterProjectSet.splice(0, filterProjectSet.length)
  for (let i = 0; i < res.data.length; i++) {
    filterProjectSet.push(res.data[i])
  }
  LoadProjectLoading.value = false
}

onMounted(() => {
  getRemoteHostGroup()
})

</script>


<style scoped lang="scss">

</style>