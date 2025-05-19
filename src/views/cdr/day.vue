<template>
  <el-card body-style="padding:15px; margin-top:5px; ">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryFormRef" label-width="70px">
      <el-form-item label="日期" prop="StartTime">
        <el-date-picker
            v-model="queryParams.StartTime"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts" @keydown.enter.capture="queryCDR(queryParams)"
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
          <el-table-column fixed label="日期" prop="StartTime" min-width="120" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column fixed label="号码" prop="Phone" min-width="200" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column fixed label="呼叫次数" prop="CAllNumber" min-width="150" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="计费时长" prop="FeeTime" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="接通次数" prop="ConnectedNumber" min-width="80" width="auto" :sortable="true" :sort-orders="sortOrders"/>
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
import {string} from "fast-glob/out/utils";

const router = useRouter();

const sortOrders = ['ascending', 'descending', null];

const shortcuts = [
  {
    text: '近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
  {
    text: '近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '今天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime())
      return [start, end]
    },
  },
]


interface queryParamsStruct {
  StartTime: [],
  Phone: string
  PageNum: number;
  PageSize: number;
  TotalSize: number;
}

let queryParams = reactive<queryParamsStruct>({
  StartTime: [],
  Phone: "",
  PageNum: 1,
  PageSize: 50,
  TotalSize: 0,
})

interface CDRListStruct {
  StartTime: string,
  Phone: string,
  CAllNumber: Number,
  FeeTime: Number,
  ConnectedNumber: Number,
}


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
  getCDRDayList(e)
}

const getCDRDayList = (async (e) => {
  Loading.value = true
  const {data: res} = await api.getCDRDayList(e)
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
    getCDRDayList(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.PageNum !== newPage) {
    console.log("进 handleCurrentChange", "原页码: ", queryParams.PageNum, "新页码: ", newPage)
    queryParams.PageNum = newPage
    getCDRDayList(queryParams)
  }
}


onMounted(() => {
  getCDRDayList(queryParams)
})

onBeforeUnmount(() => {

})


onBeforeMount(() => {

})


</script>

<style scoped>


</style>