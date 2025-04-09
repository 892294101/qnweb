<template>
  <el-select v-model="GroupCode" placeholder="选择主机组" filterable clearable remote :loading="LoadHostGroupLoading"
             :loading-text="'正在提取主机组'" @visible-change="rmRequestHostGroup">
    <el-option v-for="item in filterHostGroupSet" :key="item.GroupCode" :label="item.GroupName" :value="item.GroupCode" :style="{ fontSize: '12px' }">
      <span style="float: left">{{ item.GroupName }}</span>
      <span style="float: right;color: #55d688; font-size: 12px;">{{ item.PlatformName }}</span>
    </el-option>
  </el-select>
</template>


<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus';
import {onMounted, reactive, ref, watch} from "vue";
import api from "@/api";


const router = useRouter();

const props = defineProps({
  groupCodeParent: String,
});

interface HostGroupDropDownProps {
  GroupCode: string,
}

let GroupCodeFromParent = reactive<HostGroupDropDownProps>({GroupCode: props.groupCodeParent || ""})

//let GroupCodeFromParent = ref<string>(props.groupCodeParent || "")


let GroupCode = ref<string>("")
let LoadHostGroupLoading = ref<boolean>(false);
const rmRequestHostGroup = visible => {
  if (visible) {
    getRemoteHostGroup(GroupCodeFromParent)
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

const getRemoteHostGroup = async (data) => {
  LoadHostGroupLoading.value = true
  const {data: res} = await api.getHostGroupDropDown(data)
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
  getRemoteHostGroup(GroupCodeFromParent)
})

watch(() => props.groupCodeParent, (newValue) => {
  GroupCodeFromParent.GroupCode = newValue || "";
  console.log("GroupCodeFromParent.value:", GroupCodeFromParent.GroupCode);
});

</script>


<style scoped lang="scss">

</style>