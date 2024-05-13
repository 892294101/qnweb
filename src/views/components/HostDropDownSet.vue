<template>
  <el-select v-model="ObjSet" placeholder="选择主机" :value-key="'Id'"
             filterable clearable remote :loading="LoadHostLoading"
             :remote="true" :loading-text="'正在提取主机'" @visible-change="rmRequestHost">
    <el-option v-for="item in filterHostSet" :key="item.Id" :label="`${item.Address}`" :value="item" :style="{ fontSize: '10px', color: '#828282' }"/>
  </el-select>
</template>


<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus';
import {onMounted, reactive, ref} from "vue";
import api from "@/api";

const router = useRouter();


interface ValueStruct {
  String: string,
  Valid: boolean,
}

interface HostStruct {
  Id: string
  ProjectName: string
  PlatformName: string
  BusinessName: string
  Address: string
  RemoteAddress: ValueStruct
}

let ObjSet = ref({});

let LoadHostLoading = ref<boolean>(false);


const rmRequestHost = visible => {
  if (visible) {
    getRemoteHost()
  }
}


let filterHostSet = reactive<HostStruct[]>([])

const getRemoteHost = async () => {
  LoadHostLoading.value = true
  const {data: res} = await api.getHostDropDown()
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }

  filterHostSet.splice(0, filterHostSet.length)
  if (res.data !== null) {
    for (let i = 0; i < res.data.length; i++) {
      filterHostSet.push(res.data[i])
    }
  }
  LoadHostLoading.value = false
}

onMounted(() => {
  getRemoteHost()
})

</script>


<style scoped lang="scss">

</style>