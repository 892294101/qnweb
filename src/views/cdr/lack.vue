<template>
  <el-card body-style="padding:15px; margin-top:5px; ">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryFormRef" label-width="70px">
      <el-form-item label="日期" prop="StartTime">
        <el-date-picker
            v-model="queryParams.StartTime"
            type="monthrange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @keydown.enter.capture="queryCDR(queryParams)"
        />
      </el-form-item>

      <el-form-item label="号码" prop="Phone">
        <el-input id="Phone" class="searchList" placeholder="输入号码" clearable v-model="queryParams.Phone" @keydown.enter.capture="queryCDR(queryParams)"/>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="queryCDR(queryParams)">搜索</el-button>
      <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetCDR(queryFormRef)">重置</el-button>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <el-form :inline="true">
        <el-table size="small" v-loading="Loading" border stripe :data="queryList" style="width: 100%;" :header-cell-style="headerCellStyle" @cell-click="CopyText">
          <el-table-column label="ID" prop="Id" v-if="false"/>
          <el-table-column fixed label="日期" prop="StartTime.String" min-width="120" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column fixed label="话单号码" prop="CDRPhone.String" min-width="120" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="呼叫次数" prop="CAllNumber.String" min-width="100" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="计费时长" prop="FeeTime.String" min-width="100" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="接通次数" prop="ConnectedNumber.String" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="接通率%" prop="ConnectedRate.String" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="号码状态" prop="PhoneStatus" :formatter="formatState" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
        </el-table>
        <el-pagination @update:current-page="handleCurrentChange" @update:page-size="handleSizeChange"
                       :current-page="queryParams.PageNum" :page-sizes="[10, 50, 100, 500, 1000]" :page-size="queryParams.PageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="queryParams.TotalSize">
        </el-pagination>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>

import {onBeforeMount, onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {ElMessage, ElTable, FormInstance} from 'element-plus';
import {useRouter} from 'vue-router'
import {CopyText} from '@/utils/public'
import {headerCellStyle} from '@/css/base.js'
import api from "@/api";

const router = useRouter();

const sortOrders = ['ascending', 'descending', null];

let StateType = [
  {value: 1, label: '开通',},
  {value: 2, label: '关闭',},
  {value: 0, label: '缺失',},
]

const formatState = (row, column, cellValue) => {
  const selectedType = StateType.find(item => item.value === cellValue);
  return selectedType ? selectedType.label : cellValue;
};


interface queryParamsStruct {
  StartTime: [],
  Phone: string
  PageNum: number;
  PageSize: number;
  TotalSize: number;
}

interface ValueStruct {
  String: string,
  Valid: boolean,
}


interface CDRListStruct {
  StartTime: ValueStruct,
  CDRPhone: ValueStruct,
  CAllNumber: ValueStruct,
  FeeTime: ValueStruct,
  ConnectedNumber: ValueStruct,
  ConnectedRate: ValueStruct,
  PhoneStatus: Number,
}


let queryParams = reactive<queryParamsStruct>({
  StartTime: [],
  Phone: "",
  PageNum: 1,
  PageSize: 50,
  TotalSize: 0,
})


let queryList = reactive<CDRListStruct[]>([]) // 查询表格结构

let Loading = ref<boolean>(false); // 搜索、重置、新增, Table列表加载

const queryFormRef = ref<FormInstance>(); // 查询参数表单ref


const resetCDR = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  queryParams.PageNum = 1
  queryParams.PageSize = 50
  queryParams.TotalSize = 0
  queryCDR(queryParams)
}


const queryCDR = (e) => {
  e.PageSize = 50
  e.PageNum = 1
  e.TotalSize = 0
  getCDRLackList(e)
}

const getCDRLackList = (async (e) => {
  Loading.value = true
  const {data: res} = await api.getCDRLackList(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  queryList = []
  queryList = res.data.list
  e.TotalSize = res.data.TotalSize
  e.PageNum = res.data.PageNum
  e.PageSize = res.data.PageSize
  Loading.value = false
})


const handleSizeChange = (newSize) => {
  if (queryParams.PageSize !== newSize) {
    console.log("进handleSizeChange")
    queryParams.PageSize = newSize;
    queryParams.PageNum = 1;
    getCDRLackList(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.PageNum !== newPage) {
    console.log("进 handleCurrentChange", "原页码: ", queryParams.PageNum, "新页码: ", newPage)
    queryParams.PageNum = newPage
    getCDRLackList(queryParams)
  }
}


onMounted(() => {
  getCDRLackList(queryParams)
})

onBeforeUnmount(() => {

})


onBeforeMount(() => {

})


</script>

<style scoped>


</style>