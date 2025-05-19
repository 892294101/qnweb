<template>
  <el-card body-style="padding:15px; margin-top:5px; ">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryFormRef" label-width="70px" :rules="QueryFormRules">
      <el-form-item label="号码" prop="Phone">
        <el-input id="Phone" class="searchList" placeholder="输入号码" clearable v-model="queryParams.Phone" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>
      <el-form-item label="企业ID" prop="EntID">
        <el-input id="EntID" class="searchList" placeholder="输入企业ID" clearable v-model="queryParams.EntID" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>
      <el-form-item label="客户名称" prop="CustomerName">
        <el-input id="CustomerName" class="searchList" placeholder="输入客户名称" clearable v-model="queryParams.CustomerName" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>
      <el-form-item label="话批名称" prop="BatchName">
        <el-input id="BatchName" class="searchList" placeholder="输入话批名称" clearable v-model="queryParams.BatchName" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>
      <el-form-item label="客户经理" prop="AccountManager">
        <el-input id="AccountManager" class="searchList" placeholder="输入客户经理" clearable v-model="queryParams.AccountManager" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>
      <el-form-item label="日期" prop="StartTime">
        <el-date-picker v-model="queryParams.StartTime" type="monthrange" unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>
      <br>
      <el-form-item label="呼叫次数" prop="CAllNumber">
        <el-input id="CAllNumberOperator" v-model="queryParams.CAllNumberOperator" style="width: 30px; margin-right: 5px;" disabled/>
        <!--        <el-tooltip class="box-item" >
                  <template #content>
                    <div>
                      有效值:<br>1、数字.<br>2、is not null<br>3、is null
                    </div>
                  </template>
                </el-tooltip>-->
        <el-input id="CAllNumber" class="searchList" placeholder="输入呼叫次数" clearable v-model="queryParams.CAllNumber" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>
      <el-form-item label="计费时长" prop="FeeTime">
        <el-input id="FeeTimeOperator" v-model="queryParams.FeeTimeOperator" style="width: 30px; margin-right: 5px;" disabled/>
        <el-input id="FeeTime" class="searchList" placeholder="输入计费时长" clearable v-model="queryParams.FeeTime" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>
      <el-form-item label="接通次数" prop="ConnectedNumber">
        <el-input id="ConnectedNumberOperator" v-model="queryParams.ConnectedNumberOperator" style="width: 30px; margin-right: 5px;" disabled/>
        <el-input id="ConnectedNumber" class="searchList" placeholder="输入接通次数" clearable v-model="queryParams.ConnectedNumber" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>
      <el-form-item label="接通率" prop="ConnectedRate">
        <el-input id="ConnectedRateOperator" v-model="queryParams.ConnectedRateOperator" style="width: 30px; margin-right: 5px;" disabled/>
        <el-input id="ConnectedRate" class="searchList" placeholder="输入接通率" clearable v-model="queryParams.ConnectedRate" @keydown.enter.capture="queryCDR(queryFormRef,queryParams)"/>
      </el-form-item>


    </el-form>
    <el-form :inline="true">
      <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="queryCDR(queryFormRef,queryParams)">搜索</el-button>
      <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetCDR(queryFormRef)">重置</el-button>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <div style="display: none" v-permission="PermCodeAddCallState">
        <el-row :gutter="10" class="mb8" style="margin-bottom: 15px;">
          <el-col :span="1.5">
            <el-button plain type="primary" size="small" icon="Download" @click="DownloadCallState(queryFormRef)" :loading="Loading">下载</el-button>
          </el-col>
        </el-row>
      </div>
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
          <el-table-column label="登记日期" prop="CreateTime.String" min-width="200" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="企业ID" prop="EntID.String" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="客户名称" prop="CustomerName.String" min-width="300" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="号码" prop="PHONE.String" min-width="150" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="青牛号码" prop="QingniuTel.String" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="话批名称" prop="BatchName.String" min-width="200" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="客户经理" prop="AccountManager.String" min-width="120" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="业务模型" prop="BusinessModel.String" min-width="120" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="地区" prop="Area.String" min-width="200" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
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

import {onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import {ElMessage, ElTable, FormInstance} from 'element-plus';
import {useRouter} from 'vue-router'
import {CopyText} from '@/utils/public'
import {headerCellStyle} from '@/css/base.js'
import api from "@/api";
import streamSaver from 'streamsaver'
import storage from "@/utils/storage.js";


const router = useRouter();


let PermCodeAddCallState = ref<object>({"TargetPerm": '/cdr/state/download', "CurrentRouter": router.currentRoute.value.path})

const sortOrders = ['ascending', 'descending', null];

const QueryFormRules = reactive({
  // 企业ID字段验证 (可选，通常是字符串，可能有限长)
  EntID: [
    {max: 50, message: '企业ID长度不能超过50个字符', trigger: 'change'},
  ],

  // 客户名称字段验证 (可选，通常是字符串，可能有限长)
  CustomerName: [{max: 100, message: '客户名称长度不能超过100个字符', trigger: 'change'},],
  BatchName: [{max: 100, message: '话批名称长度不能超过100个字符', trigger: 'change'},],
  AccountManager: [{max: 50, message: '客户经理长度不能超过50个字符', trigger: 'change'},],

  CAllNumber: [
    {
      validator: (rule, value, callback) => {
        if (value === null || value === '' || value === undefined) {
          callback();
          return;
        }
        const stringValue = String(value);
        const pattern = /^[a-zA-Z0-9 ]*$/;
        if (pattern.test(stringValue)) {
          console.log('queryParams.CAllNumberOperator', queryParams.CAllNumberOperator)
          const num = Number(stringValue);
          if (queryParams.CAllNumberOperator.length > 0 && Number.isNaN(num)) {
            callback(new Error('存在操作符时,必须为数字'));
          } else if (stringValue !== 'is null' && stringValue !== 'is not null' && Number.isNaN(num)) {
            callback(new Error('非法字符'));
          } else {
            callback();
          }
        } else {
          callback(new Error('只能输入字母、数字和空格'));
        }
      },
      trigger: 'change',
    },
  ],
  FeeTime: [
    {
      validator: (rule, value, callback) => {
        if (value === null || value === '' || value === undefined) {
          callback();
          return;
        }
        const stringValue = String(value);
        const pattern = /^[a-zA-Z0-9 ]*$/;
        if (pattern.test(stringValue)) {
          console.log('queryParams.FeeTimeOperator', queryParams.FeeTimeOperator)
          const num = Number(stringValue);
          if (queryParams.FeeTimeOperator.length > 0 && Number.isNaN(num)) {
            callback(new Error('存在操作符时,必须为数字'));
          } else if (stringValue !== 'is null' && stringValue !== 'is not null' && Number.isNaN(num)) {
            callback(new Error('非法字符'));
          } else {
            callback();
          }
        } else {
          callback(new Error('只能输入字母、数字和空格'));
        }
      },
      trigger: 'change',
    },
  ],
  ConnectedNumber: [
    {
      validator: (rule, value, callback) => {
        if (value === null || value === '' || value === undefined) {
          callback();
          return;
        }
        const stringValue = String(value);
        const pattern = /^[a-zA-Z0-9 ]*$/;
        if (pattern.test(stringValue)) {
          console.log('queryParams.ConnectedNumberOperator', queryParams.ConnectedNumberOperator)
          const num = Number(stringValue);
          if (queryParams.ConnectedNumberOperator.length > 0 && Number.isNaN(num)) {
            callback(new Error('存在操作符时,必须为数字'));
          } else if (stringValue !== 'is null' && stringValue !== 'is not null' && Number.isNaN(num)) {
            callback(new Error('非法字符'));
          } else {
            callback();
          }
        } else {
          callback(new Error('只能输入字母、数字和空格'));
        }
      },
      trigger: 'change',
    },
  ],
  ConnectedRate: [
    {
      validator: (rule, value, callback) => {
        if (value === null || value === '' || value === undefined) {
          callback();
          return;
        }
        const stringValue = String(value);
        const pattern = /^[a-zA-Z0-9 ]*$/;
        if (pattern.test(stringValue)) {
          console.log('queryParams.ConnectedRateOperator', queryParams.ConnectedRateOperator)
          const num = Number(stringValue);
          if (queryParams.ConnectedRateOperator.length > 0 && Number.isNaN(num)) {
            callback(new Error('存在操作符时,必须为数字'));
          } else if (stringValue !== 'is null' && stringValue !== 'is not null' && Number.isNaN(num)) {
            callback(new Error('非法字符'));
          } else {
            callback();
          }
        } else {
          callback(new Error('只能输入字母、数字和空格'));
        }
      },
      trigger: 'change',
    },
  ],

});


let StateType = [
  {value: 1, label: '开通',},
  {value: 2, label: '关闭',},
  {value: 0, label: '缺失',},
]

const operatorOptions = ref([
  {label: '>', value: '>'},
  {label: '<', value: '<'},
  {label: '=', value: '='},
  {label: '>=', value: '>='},
  {label: '<=', value: '<='},
  {label: 'is not null', value: 'is not null'},
  {label: 'is null', value: 'is null'},
]);

const formatState = (row, column, cellValue) => {
  const selectedType = StateType.find(item => item.value === cellValue);
  return selectedType ? selectedType.label : cellValue;
};


interface queryParamsStruct {
  StartTime: [],
  Phone: string
  EntID: string,
  CustomerName: string,
  CAllNumberOperator: string,
  CAllNumber: string,
  FeeTimeOperator: string,
  FeeTime: string,
  ConnectedNumberOperator: string,
  ConnectedNumber: string,
  ConnectedRateOperator: string,
  ConnectedRate: string,
  BatchName: string,
  AccountManager: string,
  PageNum: number;
  PageSize: number;
  TotalSize: number;
}

let queryParams = reactive<queryParamsStruct>({
  StartTime: [],
  Phone: "",
  EntID: "",
  CustomerName: "",
  CAllNumberOperator: "<",
  CAllNumber: "",
  FeeTimeOperator: "<",
  FeeTime: "",
  ConnectedNumberOperator: "<",
  ConnectedNumber: "",
  ConnectedRateOperator: "<",
  ConnectedRate: "",
  BatchName: "",
  AccountManager: "",
  PageNum: 1,
  PageSize: 50,
  TotalSize: 0,
})

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
  CreateTime: ValueStruct,
  EntID: ValueStruct,
  CustomerName: ValueStruct,
  PHONE: ValueStruct,
  QingniuTel: ValueStruct,
  PhoneStatus: Number,
  BatchName: ValueStruct,
  AccountManager: ValueStruct,
  BusinessModel: ValueStruct,
  Area: ValueStruct
}


let queryList = reactive<CDRListStruct[]>([]) // 查询表格结构

let Loading = ref<boolean>(false); // 搜索、重置、新增, Table列表加载

const queryFormRef = ref<FormInstance>(); // 查询参数表单ref

const DownloadCallState = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean) => {
        if (valid) {
          Loading.value = true;
          const currentDate = new Date();
          const year = currentDate.getFullYear(); // 获取完整的年份 (例如：2025)
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const day = currentDate.getDate().toString().padStart(2, '0');
          const hours = currentDate.getHours().toString().padStart(2, '0');
          const minutes = currentDate.getMinutes().toString().padStart(2, '0');
          const seconds = currentDate.getSeconds().toString().padStart(2, '0');
          const formattedString = `${year}${month}${day}${hours}${minutes}${seconds}`;
          const uInt8 = new TextEncoder().encode('StreamSaver is awesome')

          // streamSaver.createWriteStream() returns a writable byte stream
          // The WritableStream only accepts Uint8Array chunks
          // (no other typed arrays, arrayBuffers or strings are allowed)

          const url = import.meta.env.VITE_APP_BASE_API + '/cdr/state/download';
          const token = storage.getVCookie('token') || {}


          let request = <RequestInit>({});
          request.method = 'POST'
          request.headers = new Headers();
          request.headers.set('Authorization', `Bearer ${token}`)
          request.headers.set('Content-Type', 'application/json')
          request.body = JSON.stringify(queryParams)

          try {
            const res = await fetch(url, request)
            if (res.status !== 200) {
              ElMessage({type: 'error', message: '下载文件出错，请联系管理员'})
              return
            }

            const fileStream = streamSaver.createWriteStream(formattedString + '-CDR-Data.csv', {size: uInt8.byteLength,})
            const readableStream = res.body
            if (window.WritableStream && readableStream.pipeTo) {
              return readableStream.pipeTo(fileStream).then(
                  () => console.log('完成写入')
              )
            }

            const writer = fileStream.getWriter()
            const reader = res.body.getReader()
            const pump = () => reader.read().then(
                res => res.done ? writer.close() : writer.write(res.value).then(pump)
            )
            pump()

          } catch (writeError) {
            console.error('  手动 Piping - 写入数据块失败:', writeError);
            throw writeError;
          } finally {
            Loading.value = false;
          }


          /* const fetchOptions = {
             method: 'POST',
             cache: 'no-cache',
             headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json',
             },
             body: JSON.stringify(queryParams),
           };
           await fetch(url, fetchOptions).then(res => {
                 Loading.value = false;
                 if (res.ok) {
                   ElMessage({type: 'success', message: '开始下载'})
                   const fileStream = streamSaver.createWriteStream(formattedString + '-CDR-Data.csv', {size: uInt8.byteLength,})
                   const readableStream = res.body
                   if (window.WritableStream && readableStream.pipeTo) {
                     return readableStream.pipeTo(fileStream).then(
                         () => console.log('完成写入')
                     )
                   }

                   window.writer = fileStream.getWriter()
                   const reader = res.body.getReader()
                   const pump = () => reader.read().then(
                       res => res.done ? writer.close() : writer.write(res.value).then(pump)
                   )
                   pump()
                 } else {
                   ElMessage({type: 'error', message: '下载发生错误，请联系管理员'})
                 }
               }
           )*/


          /*  try {
              Loading.value = true;
              const res = await api.getCDRStateDownload(queryParams)
              if (res.status == 200) {
                const blob = res.data;
                const contentDisposition = res.headers['Content-Disposition'];
                let fileName = 'download.csv';
                if (contentDisposition) {
                  const filenameMatch = contentDisposition.match(/filename\*?=([^;]+)|filename="([^"]+)"/i);
                  if (filenameMatch && filenameMatch[1]) {
                    try {
                      fileName = decodeURIComponent(filenameMatch[1].replace(/^utf-8''/i, '')).replace(/['"]/g, '');
                    } catch (e) {
                      console.warn("无法解码文件名:", e);
                    }
                  } else if (filenameMatch && filenameMatch[2]) {
                    fileName = filenameMatch[2];
                  } else {
                    console.warn("无法从 Content-Disposition 头中解析文件名:", contentDisposition);
                  }
                  if (!fileName.toLowerCase().endsWith('.csv')) {
                    fileName = fileName + '.csv';
                    console.warn("解析文件名未以 .csv 结尾，已尝试添加:", fileName);
                  }
                } else {
                  console.warn("响应头中没有 Content-Disposition 头，使用默认文件名:", fileName);
                }


                // 2. 创建临时下载链接
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);

                link.download = fileName;

                // 3. 模拟点击触发下载
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);


              }
            } catch (error) {
              console.error(error)
              ElMessage({
                type: 'error',
                message: '下载文件出错，请联系管理员cache'
              })
            } finally {
              Loading.value = false;
            }*/

        }

      }
  )
}

const resetCDR = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  queryParams.PageNum = 1
  queryParams.PageSize = 50
  queryParams.TotalSize = 0
  queryParams.CAllNumberOperator = '<'
  queryParams.FeeTimeOperator = '<'
  queryParams.ConnectedNumberOperator = '<'
  queryParams.ConnectedRateOperator = '<'
  queryCDR(formEl, queryParams)
}


const queryCDR = (async (formEl: FormInstance | undefined, e) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      e.PageSize = 50
      e.PageNum = 1
      e.TotalSize = 0
      getCDRDayList(e)
    }
  })

})

const getCDRDayList = (async (e) => {
  Loading.value = true
  const {data: res} = await api.getCDRStateList(e)
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

function isStringValidNumber(str) {
  // 1. 首先检查输入是否为字符串类型，并处理 null/undefined
  if (typeof str !== 'string' || str === null || str === undefined) {
    return false; // 不是字符串，或为 null/undefined，则不是有效数字字符串
  }

  // 2. 检查去除首尾空白后是否为空字符串
  //    Number('') 是 0，Number('   ') 也是 0。
  //    如果空字符串或只含空白的字符串不应被视为数字 0，则需要进行额外检查。
  const trimmedStr = str.trim();
  if (trimmedStr === '') {
    return false; // 空字符串或只含空白的字符串不是有效数字字符串
  }

  // 3. 尝试将去除空白后的字符串转换为数字
  const num = Number(trimmedStr);

  // 4. 检查转换结果：不是 NaN (非数字) 且是有限的 (排除 Infinity, -Infinity)
  //    Number.isNaN() 严格检查是否是 NaN
  //    Number.isFinite() 严格检查是否是有限数字
  return !Number.isNaN(num) && Number.isFinite(num);
}

watch(
    // *** 第一个参数：要侦听的源数组 ***
    // 数组中的每个元素都是一个 getter 函数，返回一个你想侦听的属性值
    [
      () => queryParams.CAllNumber,
      () => queryParams.FeeTime,
      () => queryParams.ConnectedNumber,
      () => queryParams.ConnectedRate,
    ],
    (
        [CAllNumberNewValue, FeeTimeNewValue, ConnectedNumberNewValue, ConnectedRateNewValue,],
        [CAllNumberOldValue, FeeTimeOldValue, ConnectedNumberOldValue, ConnectedRateOldValue,]) => {

      console.log("watch 触发")
      console.log("CAllNumber变化,  new: ", CAllNumberNewValue, "old: ", CAllNumberOldValue)
      if (CAllNumberNewValue !== CAllNumberOldValue) {
        const rawChar = CAllNumberNewValue.trim().toLowerCase().replace(/\s+/g, ' ');
        const firstChar = rawChar.charAt(0)
        if ((firstChar === '>' || firstChar === '<') && firstChar !== queryParams.CAllNumberOperator) {
          queryParams.CAllNumberOperator = firstChar
          queryParams.CAllNumber = CAllNumberNewValue.slice(1, CAllNumberNewValue.length)
        } else {
          if (rawChar === 'is null' || rawChar === 'is not null') {
            queryParams.CAllNumberOperator = ''
            queryParams.CAllNumber = rawChar
          } else if (CAllNumberNewValue.length === 0 && queryParams.CAllNumberOperator.length === 0) {
            queryParams.CAllNumberOperator = '<'
          } else if (queryParams.CAllNumberOperator.length === 0 && isStringValidNumber(queryParams.CAllNumber)) {
            queryParams.CAllNumberOperator = '<'
          }
        }
      }

      console.log("FeeTime变化,  new: ", FeeTimeNewValue, "old: ", FeeTimeOldValue)
      if (FeeTimeNewValue !== FeeTimeOldValue) {
        const rawChar = FeeTimeNewValue.trim().toLowerCase().replace(/\s+/g, ' ');
        const firstChar = rawChar.charAt(0)
        if ((firstChar === '>' || firstChar === '<') && firstChar !== queryParams.FeeTimeOperator) {
          queryParams.FeeTimeOperator = firstChar
          queryParams.FeeTime = FeeTimeNewValue.slice(1, FeeTimeNewValue.length)
        } else {
          if (rawChar === 'is null' || rawChar === 'is not null') {
            queryParams.FeeTimeOperator = ''
            queryParams.FeeTime = rawChar
          } else if (FeeTimeNewValue.length === 0 && queryParams.FeeTimeOperator.length === 0) {
            queryParams.FeeTimeOperator = '<'
          } else if (queryParams.FeeTimeOperator.length === 0 && isStringValidNumber(queryParams.FeeTime)) {
            queryParams.FeeTimeOperator = '<'
          }
        }
      }

      console.log("ConnectedNumber变化,  new: ", ConnectedNumberNewValue, "old: ", ConnectedNumberOldValue)
      if (ConnectedNumberNewValue !== ConnectedNumberOldValue) {
        const rawChar = ConnectedNumberNewValue.trim().toLowerCase().replace(/\s+/g, ' ');
        const firstChar = rawChar.charAt(0)
        if ((firstChar === '>' || firstChar === '<') && firstChar !== queryParams.ConnectedNumberOperator) {
          queryParams.ConnectedNumberOperator = firstChar
          queryParams.ConnectedNumber = ConnectedNumberNewValue.slice(1, ConnectedNumberNewValue.length)
        } else {
          if (rawChar === 'is null' || rawChar === 'is not null') {
            queryParams.ConnectedNumberOperator = ''
            queryParams.ConnectedNumber = rawChar
          } else if (ConnectedNumberNewValue.length === 0 && queryParams.ConnectedNumberOperator.length === 0) {
            queryParams.ConnectedNumberOperator = '<'
          } else if (queryParams.ConnectedNumberOperator.length === 0 && isStringValidNumber(queryParams.ConnectedNumber)) {
            queryParams.ConnectedNumberOperator = '<'
          }
        }
      }

      console.log("ConnectedRate变化,  new: ", ConnectedRateNewValue, "old: ", ConnectedRateOldValue)
      if (ConnectedRateNewValue !== ConnectedRateOldValue) {
        const rawChar = ConnectedRateNewValue.trim().toLowerCase().replace(/\s+/g, ' ');
        const firstChar = rawChar.charAt(0)
        if ((firstChar === '>' || firstChar === '<') && firstChar !== queryParams.ConnectedRateOperator) {
          queryParams.ConnectedRateOperator = firstChar
          queryParams.ConnectedRate = ConnectedRateNewValue.slice(1, ConnectedRateNewValue.length)
        } else {
          if (rawChar === 'is null' || rawChar === 'is not null') {
            queryParams.ConnectedRateOperator = ''
            queryParams.ConnectedRate = rawChar
          } else if (ConnectedRateNewValue.length === 0 && queryParams.ConnectedRateOperator.length === 0) {
            queryParams.ConnectedRateOperator = '<'
          } else if (queryParams.ConnectedRateOperator.length === 0 && isStringValidNumber(queryParams.ConnectedRate)) {
            queryParams.ConnectedRateOperator = '<'
          }
        }
      }


    }, {
      // immediate: true, // 如果想在侦听器创建时立即运行一次回调
      // deep: false,     // 这里侦听的是属性的原始值（基本类型或引用的改变），通常不需要 deep
      // 只有当你要侦听的属性本身是一个对象/数组，并且想侦听它内部属性的变化时才需要 deep
    }
);

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