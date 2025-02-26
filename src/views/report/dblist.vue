<template>
  <el-card body-style="padding:15px; margin-top:5px; ">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryDBFormRef" label-width="70px">
      <el-form-item label="项目名" prop="projectName">
        <el-input id="projectName" class="searchList" placeholder="输入项目名称" clearable v-model="queryParams.projectName" @keydown.enter.capture="queryDBListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="平台名" prop="platformName">
        <el-input id="platformName" class="searchList" placeholder="输入平台名称" clearable v-model="queryParams.platformName" @keydown.enter.capture="queryDBListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="主机组" prop="hostGroup">
        <el-input id="hostGroup" class="searchList" placeholder="输入主机组" clearable v-model="queryParams.hostGroup" @keydown.enter.capture="queryDBListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="IP地址" prop="ipAddress">
        <el-input id="ipAddress" class="searchList" placeholder="输入IP地址" clearable v-model="queryParams.ipAddress" @keydown.enter.capture="queryDBListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="类型" prop="dbType">
        <el-select id="dbType" class="searchList" placeholder="选择数据类型" v-model="queryParams.dbType" clearable @keydown.enter.capture="queryDBListWhere(queryParams)">
          <el-option v-for="item in dbType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select id="state" class="searchList" placeholder="选择业务状态" v-model="queryParams.state" clearable @keydown.enter.capture="queryDBListWhere(queryParams)">
          <el-option v-for="item in onlineStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="queryDBListWhere(queryParams)">搜索</el-button>
      <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetDbQueryForm(queryDBFormRef)">重置</el-button>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <div style="display: none" v-permission="PermCodeAddDB">
        <el-row :gutter="10" class="mb8" style="margin-bottom: 15px;">
          <el-col :span="1.5">
            <el-button plain type="primary" size="small" icon="CirclePlus" @click="openAddDBEvent" :loading="Loading">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <el-form :inline="true">
        <el-table size="small" v-loading="Loading" border stripe :data="queryList" style="width: 100%;"  :header-cell-style="headerCellStyle"
                  @cell-click="CopyText">
          <el-table-column label="ID" prop="Id" v-if="false"/>
          <el-table-column fixed label="项目组" prop="ProjectName" min-width="120" width="auto" show-overflow-tooltip  :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column fixed label="平台" prop="PlatformName" min-width="200" width="auto" show-overflow-tooltip  :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column fixed label="主机组" prop="GroupName" min-width="150" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="主机组编码" prop="GroupCode" v-if="false" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="类型" prop="DbType" min-width="80" width="auto" :formatter="formatDbType" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="用户" prop="UserName.String" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="密码" prop="PassWord.String" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="IP地址" prop="Address" min-width="230" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="状态" prop="OnlineStatus.String" width="70" :formatter="formatOnlineStatusType" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="备注" prop="Note.String" width="200" show-overflow-tooltip/>
          <el-table-column label="更多操作" fixed="right" min-width="200" width="auto">
            <template v-slot="scope">
              <div class="button-container">
                <div style="display: none" v-permission="PermCodeEditDB">
                  <el-button plain type="primary" size="small" :loading="editLoading" icon="Edit" @click="openEditDBEvent(scope.row)">编辑</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeDeleteDB">
                  <el-button plain type="danger" size="small" :loading="deleteLoading" icon="Delete" @click="deleteDBEvent(scope.row,queryDBFormRef)">删除</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>


        <el-pagination @update:current-page="handleCurrentChange" @update:page-size="handleSizeChange"
                       :current-page="queryParams.pageNum" :page-sizes="[10, 50, 100, 500, 1000]" :page-size="queryParams.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="queryParams.totalSize">
        </el-pagination>
      </el-form>

      <!-- 添加数据库表单-->
      <el-dialog v-model="addDbDialogVisible" title="添加数据库信息" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="AddDBFormRef" :model="addDBForm" :rules="AddEditCloneDBFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="主机组" prop="hostGroup">
            <el-select v-model="addDBForm.hostGroup" placeholder="选择主机组" filterable clearable remote :loading="LoadHostGroupLoading"
                       :remote="true" :loading-text="'正在提取主机组'" @visible-change="rmRequestHostGroup" @change="listenerHostGroup">
              <el-option v-for="item in filterHostGroupSet" :key="item.GroupCode" :label="item.GroupName" :value="item.GroupCode"/>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="dbType">
            <el-select id="dbType" placeholder="选择数据库类型" v-model="addDBForm.dbType" clearable>
              <el-option v-for="item in dbType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户" prop="user">
            <el-input v-model="addDBForm.user" placeholder="输入数据库用户名" clearable/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addDBForm.password" placeholder="输入数据库密码" clearable/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch class="ml-2" size="large" v-model="addDBForm.status" inline-prompt
                       :active-value='"1"' :inactive-value='"0"' style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="在线"
                       inactive-text="下线"/>
          </el-form-item>
          <el-row v-if="HostBody.GroupName.length > 0">
            <el-form-item label="主机信息">
              <div style="display: flex; justify-content: center; ">
                <el-row>
                  <el-table :data="[HostBody]" border style="width: 100%; font-size: 8px; " size="small">
                    <el-table-column prop="ProjectName" label="项目组" width="100" show-overflow-tooltip/>
                    <el-table-column prop="PlatformName" label="平台" width="100" show-overflow-tooltip/>
                    <el-table-column prop="GroupName" label="主机组" width="80" show-overflow-tooltip/>
                    <el-table-column prop="Address" label="地址" width="192" show-overflow-tooltip/>
                  </el-table>
                </el-row>
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="备注" prop="note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="addDBForm.note"/>
            </el-form-item>
          </el-row>

          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelDBAddFormClose(AddDBFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitAddDBEvent(addDBForm,AddDBFormRef,queryDBFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>

      <!-- 编辑数据库表单 -->
      <el-dialog v-model="editDbDialogVisible" title="编辑数据库信息" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="EditDBFormRef" :model="editDBForm" :rules="AddEditCloneDBFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="主机组" prop="hostGroup">
            <el-select v-model="editDBForm.hostGroup" placeholder="选择主机组" filterable clearable remote :loading="LoadHostGroupLoading"
                       :remote="true" :loading-text="'正在提取主机组'" @visible-change="rmRequestHostGroup" @change="listenerHostGroup">
              <el-option v-for="item in filterHostGroupSet" :key="item.GroupCode" :label="item.GroupName" :value="item.GroupCode"/>
            </el-select>
          </el-form-item>

          <el-form-item label="类型" prop="dbType">
            <el-select id="dbType" placeholder="选择数据库类型" v-model="editDBForm.dbType" clearable>
              <el-option v-for="item in dbType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户" prop="user">
            <el-input v-model="editDBForm.user" placeholder="输入数据库用户名" clearable/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editDBForm.password" placeholder="输入数据库密码" clearable/>
          </el-form-item>


          <el-form-item label="状态" prop="status">
            <el-switch class="ml-2" size="large" v-model="editDBForm.status" inline-prompt
                       :active-value='"1"' :inactive-value='"0"' style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="在线"
                       inactive-text="下线"/>
          </el-form-item>
          <el-row v-if="HostBody.GroupName.length > 0">
            <el-form-item label="主机信息">
              <div style="display: flex; justify-content: center; ">
                <el-row>
                  <el-table :data="[HostBody]" border style="width: 100%; font-size: 8px; " size="small">
                    <el-table-column prop="ProjectName" label="项目组" width="100"/>
                    <el-table-column prop="PlatformName" label="平台" width="100"/>
                    <el-table-column prop="GroupName" label="主机组" width="80"/>
                    <el-table-column prop="Address" label="地址" width="192"/>
                  </el-table>
                </el-row>
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="备注" prop="note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="editDBForm.note"/>
            </el-form-item>
          </el-row>

          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="editLoading" @click="cancelDBEditFormClose(EditDBFormRef)">取消</el-button>
                <el-button size="small" :loading="editLoading" type="primary" @click="CommitEditDBEvent(editDBForm,EditDBFormRef,queryDBFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>

    </el-card>
  </div>
</template>

<script lang="ts" setup>

import {onBeforeMount, onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {ElDialog, ElMessage, ElMessageBox, ElTable, FormInstance, type FormRules} from 'element-plus';
import api from "@/api";
import {useRouter} from 'vue-router'
import {CopyText} from '@/utils/public'
import {headerCellStyle} from '@/css/base.js'
const router = useRouter();

let PermCodeAddDB = ref<object>({"TargetPerm": '/report/database/add', "CurrentRouter": router.currentRoute.value.path})
let PermCodeEditDB = ref<object>({"TargetPerm": '/report/database/edit', "CurrentRouter": router.currentRoute.value.path})
let PermCodeDeleteDB = ref<object>({"TargetPerm": '/report/database/delete', "CurrentRouter": router.currentRoute.value.path})

const sortOrders = ['ascending', 'descending', null];

interface queryParamsStruct {
  projectName: string,
  platformName: string,
  hostGroup: string,
  dbType: string,
  ipAddress: string,
  state: string,
  pageNum: number;
  pageSize: number;
  totalSize: number;
}

interface ValueStruct {
  String: string,
  Valid: boolean,
}

interface dbListStruct {
  Id: string,
  ProjectName: string,
  PlatformName: string,
  GroupCode: string,
  GroupName: string,
  DbType: string,
  UserName: ValueStruct,
  PassWord: ValueStruct,
  OnlineStatus: ValueStruct,
  Address: string,
  Note: ValueStruct,
}


let dbType = [
  {value: '1', label: 'Oracle',},
  {value: '2', label: 'MySQL',},
  {value: '3', label: 'MongoDB',},
  {value: '4', label: 'Postgres',}
]

let onlineStatus = [
  {value: '1', label: '在线',},
  {value: '0', label: '下线',}
]


let queryParams = reactive<queryParamsStruct>({
  projectName: "",
  platformName: "",
  hostGroup: "",
  dbType: "",
  ipAddress: "",
  state: "",
  pageNum: 1,
  pageSize: 10,
  totalSize: 0,
})

const AddEditCloneDBFormRules: FormRules = {
  hostGroup: [{required: true, message: "请选择主机组", trigger: "blur"}],
  dbType: [{required: true, message: "请选择数据库类型", trigger: "blur"}],
  user: [
    {required: false, trigger: "blur", max: 18},
    {
      validator: (rule, value, callback) => {
        if (value && /[\u4e00-\u9fa5\u3040-\u309f\uac00-\ud7af]/.test(value)) {
          callback(new Error("不能包含中、日、韩字符"));
        } else {
          callback();
        }
      },
    }],
  password: [{required: false, trigger: "blur", max: 18},
    {
      validator: (rule, value, callback) => {
        if (value && /[\u4e00-\u9fa5\u3040-\u309f\uac00-\ud7af]/.test(value)) {
          callback(new Error("不能包含中、日、韩字符"));
        } else {
          callback();
        }
      },
    }],
  status: [{required: false, trigger: "blur"}],
  note: [{required: false, trigger: "blur", max: 150}],
};

interface AddEditCloneDBStruct {
  id: string,
  hostGroup: string,
  dbType: string,
  user: string,
  password: string,
  status: string,
  note: string,
}

let addDBForm = reactive<AddEditCloneDBStruct>({
  id: "",
  hostGroup: "",
  dbType: "",
  user: "",
  password: "",
  status: "1",
  note: "",
})

const clearAddDBForm = <T extends AddEditCloneDBStruct>(e: T): void => {
  e.id = ""
  e.hostGroup = ""
  e.dbType = ""
  e.user = ""
  e.password = ""
  e.status = "1"
  e.note = ""
}

let editDBForm = reactive<AddEditCloneDBStruct>({
  id: "",
  hostGroup: "",
  dbType: "",
  user: "",
  password: "",
  status: "",
  note: "",
})

const clearEditDBForm = <T extends AddEditCloneDBStruct>(e: T): void => {
  e.id = ""
  e.hostGroup = ""
  e.dbType = ""
  e.user = ""
  e.password = ""
  e.status = ""
  e.note = ""
}


let queryList = reactive<dbListStruct[]>([]) // 查询表格结构

let LoadHostGroupLoading = ref<boolean>(true);

let Loading = ref<boolean>(false); // 搜索、重置、新增, Table列表加载
let addLoading = ref<boolean>(false); // 添加弹出层加载按钮
let editLoading = ref<boolean>(false); // 编辑弹出层加载按钮
let deleteLoading = ref<boolean>(false); // 删除加载按钮

let addDbDialogVisible = ref(false) // 添加图层显示
let editDbDialogVisible = ref(false)  // 编辑图层显示

const queryDBFormRef = ref<FormInstance>(); // 查询参数表单ref
const AddDBFormRef = ref<FormInstance>(); // 添加表单ref
const EditDBFormRef = ref<FormInstance>(); // 编辑表单ref


const formatDbType = (row, column, cellValue) => {
  const selectedType = dbType.find(item => item.value === cellValue);
  return selectedType ? selectedType.label : cellValue;
};

const formatOnlineStatusType = (row, column, cellValue) => {
  const selectedType = onlineStatus.find(item => item.value === cellValue);
  return selectedType ? selectedType.label : cellValue;
};


const resetDbQueryForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  queryParams.totalSize = 0
  queryDBListWhere(queryParams)
}


const queryDBListWhere = (e) => {
  e.pageSize = 10
  e.pageNum = 1
  e.totalSize = 0
  getDBList(e)
}

const getDBList = (async (e) => {
  Loading.value = true
  const {data: res} = await api.getDBList(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  //queryList.splice(0, queryList.length, ...res.data.list)
  queryList = []
  queryList = res.data.list
  e.totalSize = res.data.total
  e.pageNum = res.data.pageNum
  e.pageSize = res.data.pageSize
  Loading.value = false
})


// 清空图层表单
const resetDBFromTable = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  clearHostBody(HostBody)
}

// 添加图层取消按钮
const cancelDBAddFormClose = (formEl: FormInstance | undefined) => {
  addLoading.value = true
  resetDBFromTable(formEl) // 清空add弹出层的表单数据
  addDbDialogVisible.value = false // 关闭弹出层
  addLoading.value = false
}

// 编辑图层取消按钮
const cancelDBEditFormClose = (formEl: FormInstance | undefined) => {
  editLoading.value = true
  resetDBFromTable(formEl) // 清空编辑弹出层的表单数据
  clearHostBody(HostBody)  // 清空编辑弹出层中的主机信息
  editDbDialogVisible.value = false // 关闭弹出层
  editLoading.value = false
}

// 编辑数据库信息 提交事件
const CommitEditDBEvent = async (data, formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      editLoading.value = true
      const {data: res} = await api.editDBInfo(data)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        editLoading.value = false
        return
      }

      editLoading.value = false
      editDbDialogVisible.value = false
      resetDBFromTable(formEl) //  清空更新表单
      ElMessage.success({center: true, message: "修改成功"})
      await resetDbQueryForm(formE2) // 清空查询表单,并查询
    }
  })
}

// 新增数据库信息 提交事件
const CommitAddDBEvent = async (data, formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.addDBInfo(data)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      addDbDialogVisible.value = false
      resetDBFromTable(formEl) //  清空新增表单
      ElMessage.success({center: true, message: "添加成功"})
      await resetDbQueryForm(formE2) // 清空查询表单,并查询
    }
  })
}

// 删除行事件, 1、row数据. 2、查询表单的ref
const deleteDBEvent = async <T extends dbListStruct>(row: T, formE2: FormInstance | undefined): Promise<void> => {
  ElMessageBox.confirm(
      '确认删除?',
      'Warning',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
        //center: true,
      }
  ).then(async () => {
    deleteLoading.value = true
    const {data: res} = await api.deleteDBInfo(row)
    if (res.code !== 200) {
      deleteLoading.value = false
      ElMessage.error(res.message)
      return
    }
    deleteLoading.value = false
    ElMessage.success({center: true, message: "删除成功"})
    await resetDbQueryForm(formE2) // 清空查询表单,并查询

  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })


}

// 打开添加图层. 清空form表单
const openAddDBEvent = async () => {
  addDbDialogVisible.value = true
  clearAddDBForm(addDBForm) // 清除新增表单
  clearHostBody(HostBody) // 清除新增表单中的主机信息
}

// 打开编辑图层. 清空form表单
const openEditDBEvent = async <T extends dbListStruct>(row: T): Promise<void> => {
  // 提前获取主机组下拉菜单,否则无法正常显示.
  await getRemoteHostGroup()


  clearEditDBForm(editDBForm) // 清除编辑表单
  clearHostBody(HostBody) // 清除编辑表单中的主机信息
  listenerHostGroup(row.GroupCode) // 手动调用并加载编辑表单中的主机信息

  // 从行中的数据读取数据并传递给弹出层.
  editDBForm.id = row.Id
  editDBForm.hostGroup = row.GroupCode
  editDBForm.dbType = row.DbType
  editDBForm.user = row.UserName.String
  editDBForm.password = row.PassWord.String
  editDBForm.status = row.OnlineStatus.String
  editDBForm.note = row.Note.String

  editDbDialogVisible.value = true
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

// 请求主机组函数
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

// 请求主机组数据的事件
const rmRequestHostGroup = visible => {
  if (visible) {
    getRemoteHostGroup()
  }
}

interface HostBodyStruct {
  GroupCode: string,
  ProjectName: string,
  PlatformName: string,
  GroupName: string,
  Address: string,
}

let HostBody = reactive<HostBodyStruct>({
  GroupCode: "",
  Address: "",
  GroupName: "",
  PlatformName: "",
  ProjectName: ""
});

const clearHostBody = <T extends HostBodyStruct>(e: T): void => {
  e.GroupCode = ""
  e.ProjectName = ""
  e.PlatformName = ""
  e.GroupName = ""
  e.Address = ""

}

const listenerHostGroup = (selectedItem) => {
  if (selectedItem === undefined) {
    HostBody.GroupCode = ""
    HostBody.ProjectName = ""
    HostBody.PlatformName = ""
    HostBody.GroupName = ""
    HostBody.Address = ""
  }
  // 当下拉菜单值发生变化时. 重新显示主机信息.
  if (selectedItem.length > 0) {
    for (let i = 0; i < filterHostGroupSet.length; i++) {
      let GroupCode = filterHostGroupSet[i].GroupCode
      let ProjectName = filterHostGroupSet[i].ProjectName
      let PlatformName = filterHostGroupSet[i].PlatformName
      let GroupName = filterHostGroupSet[i].GroupName
      let Address = filterHostGroupSet[i].Address
      if (GroupCode === selectedItem) {
        HostBody.GroupCode = GroupCode
        HostBody.ProjectName = ProjectName
        HostBody.PlatformName = PlatformName
        HostBody.GroupName = GroupName
        HostBody.Address = Address
      }
    }
  }
}


const handleSizeChange = (newSize) => {
  if (queryParams.pageSize !== newSize) {
    console.log("进handleSizeChange")
    queryParams.pageSize = newSize;
    queryParams.pageNum = 1;
    getDBList(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.pageNum !== newPage) {
    console.log("进 handleCurrentChange", "原页码: ", queryParams.pageNum, "新页码: ", newPage)
    queryParams.pageNum = newPage
    getDBList(queryParams)
  }
}


/*let tableHeight: number = 345;

const handleResize = () => {
  const windowHeight = window.innerHeight;
  console.log("高度: ", windowHeight)
  tableHeight = windowHeight * 2.5;
}*/


onMounted(() => {
  //window.addEventListener('resize', handleResize);
  getDBList(queryParams)
})

onBeforeUnmount(() => {
  //window.removeEventListener('resize', this.handleResize);
})


onBeforeMount(() => {

})


</script>

<style scoped>


</style>