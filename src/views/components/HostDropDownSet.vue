<template>
  <el-select v-model="ObjSet" placeholder="选择主机" :value-key="'Id'"
             filterable clearable remote :loading="LoadHostLoading"
             :loading-text="'正在提取主机'" @visible-change="rmRequestHost">
    <el-option v-for="item in filterHostSet" :key="item.Id" :label="`${item.Address}`" :value="item" :style="{ fontSize: '12px', color: '#828282' }">
      <span style="display: inline-block; width: 100px; text-align: left;">{{ item.Address }}</span>
      <span style="display: inline-block; width: 120px; text-align: left; font-size: 12px;">{{ item.PlatformName }}</span>
      <span style="display: inline-block; width: 120px; text-align: right; color: red; font-size: 12px;">{{ item.BusinessName }}</span>
    </el-option>
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
  DeptName: string
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
  console.log("filterHostSet:",filterHostSet)
}

onMounted(() => {
  getRemoteHost()
})

</script>
