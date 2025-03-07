<template>
  <el-tree-select v-model="DeptId" :data="filterDeptSet" check-strictly :render-after-expand="false" filterable clearable
                  :loading="LoadDeptLoading" :loading-text="'正在提取部门'" placeholder="请选择部门"
                  @visible-change="rmRequestProject" :props="{value:'Id', label: 'DeptName', children: 'ChildDeptTable'}"
                  default-expand-all/>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus';
import {onMounted, reactive, ref} from "vue";
import api from "@/api";

const router = useRouter();

let DeptId = ref<string>("")

const rmRequestProject = visible => {
  if (visible) {
    getRemoteDeptSet()
  }
}


// 请求部门数据api
interface DeptSetStruct {
  Id: string
  DeptName: string
  ParentId: string
  DeptType: string
  CreateTime: string
  ChildDeptTable: DeptSetStruct[]
}

let filterDeptSet = reactive<DeptSetStruct[]>([])
let LoadDeptLoading = ref<boolean>(true);
const getRemoteDeptSet = async () => {
  LoadDeptLoading.value = true
  const {data: res} = await api.getDeptSetDropDown()
  console.log("data: ", res.data);
  if (res.code !== 200) {
    LoadDeptLoading.value = false
    ElMessage.error(res.message)
    return
  }

  filterDeptSet.splice(0, filterDeptSet.length)
  for (let i = 0; i < res.data.list.length; i++) {
    filterDeptSet.push(res.data.list[i])
  }
  console.log("filterDeptSet: ", filterDeptSet)
  LoadDeptLoading.value = false
}


onMounted(() => {
  getRemoteDeptSet()
})

</script>


<style scoped lang="scss">

</style>