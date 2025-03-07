<template>
  <el-card body-style="padding:15px; margin-top:5px;">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryHostFormRef" label-width="70px">
      <el-form-item label="平台名" prop="PlatformName">
        <el-input id="PlatformName" class="searchList" placeholder="输入项目名" clearable v-model="queryParams.PlatformName" @keydown.enter.capture="getHostList(queryParams)"/>
      </el-form-item>

      <el-form-item label="项目组" prop="DeptName">
        <el-input id="DeptName" class="searchList" placeholder="输入项目名" clearable v-model="queryParams.DeptName" @keydown.enter.capture="getHostListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="所属人" prop="DeptPerson">
        <el-input id="DeptPerson" class="searchList" placeholder="输入所属人" clearable v-model="queryParams.DeptPerson" @keydown.enter.capture="getHostListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="业务名" prop="BusinessName">
        <el-input id="BusinessName" class="searchList" placeholder="输入业务名" clearable v-model="queryParams.BusinessName" @keydown.enter.capture="getHostListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="IP地址" prop="Address">
        <el-input id="Address" class="searchList" placeholder="输入IP地址" clearable v-model="queryParams.Address" @keydown.enter.capture="getHostListWhere(queryParams)"/>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="getHostListWhere(queryParams)">搜索</el-button>
      <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetQueryHostForm(queryHostFormRef)">重置</el-button>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <div style="display: none" v-permission="PermCodeAddHost">
        <el-row :gutter="10" class="mb8" style="margin-bottom: 15px;">
          <el-col :span="1.5">
            <el-button plain type="primary" size="small" icon="CirclePlus" @click="openAddHostEvent" :loading="Loading">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <el-form :inline="true">
        <el-table size="small" v-loading="Loading" border stripe :data="hostList" style="width: 100%;" :header-cell-style="headerCellStyle" @cell-click="CopyText">
          <el-table-column label="ID" prop="Id" v-if="false"/>
          <el-table-column fixed label="项目组" prop="DeptName" min-width="120" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column fixed label="平台名" prop="PlatformName" min-width="270" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="业务名称" prop="BusinessName" min-width="150" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="IP地址" prop="Address" min-width="150" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="用户名" prop="UserName.String" min-width="80" width="auto" show-overflow-tooltip  :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="密码" prop="PassWord.String" min-width="150" width="auto" show-overflow-tooltip />
          <el-table-column label="管理地址" prop="RemoteAddress.String" min-width="150" width="auto" show-overflow-tooltip  :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="管理用户" prop="RemoteUser.String" min-width="80" width="auto" show-overflow-tooltip />
          <el-table-column label="管理密码" prop="RemotePassword.String" min-width="80" width="auto" show-overflow-tooltip />
          <el-table-column label="所属人" prop="DeptPerson" min-width="80" width="auto" :sortable="true" show-overflow-tooltip  :sort-orders="sortOrders"/>
          <el-table-column label="备注" prop="Note.String" min-width="200" width="auto" show-overflow-tooltip />
          <el-table-column label="更多操作" fixed="right" min-width="250" width="auto">
            <template v-slot="scope">
              <div class="button-container">
                <div style="display: none" v-permission="PermCodeAddHost">
                  <el-button plain type="primary" size="small" :loading="cloneLoading" icon="Edit" @click="openCloneHostEvent(scope.row)">克隆</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeEditHost">
                  <el-button plain type="primary" size="small" :loading="editLoading" icon="Edit" @click="openEditHostEvent(scope.row)">编辑</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeDeleteHost">
                  <el-button plain type="danger" size="small" :loading="deleteLoading" icon="Delete" @click="deleteHostEvent(scope.row,queryHostFormRef)">删除</el-button>
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

      <!-- 添加项目表单-->
      <el-dialog v-model="addHostDialogVisible" title="添加主机" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="AddHostFormRef" :model="addHostForm" :rules="AddEditHostFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="平台名称" prop="PlatformId">
            <PlatformDropDown v-model="addHostForm.PlatformId"></PlatformDropDown>
          </el-form-item>
          <el-form-item label="业务名称" prop="BusinessName">
            <el-input v-model="addHostForm.BusinessName" placeholder="输入业务名称" clearable/>
          </el-form-item>
          <el-form-item label="主机地址" prop="Address">
            <el-input v-model="addHostForm.Address" placeholder="输入主机地址" clearable/>
          </el-form-item>
          <el-form-item label="主机用户" prop="UserName">
            <el-input v-model="addHostForm.UserName" placeholder="输入主机用户" clearable/>
          </el-form-item>
          <el-form-item label="主机密码" prop="PassWord">
            <el-input v-model="addHostForm.PassWord" placeholder="输入主机密码" clearable/>
          </el-form-item>
          <el-form-item label="管理地址" prop="RemoteAddress">
            <el-input v-model="addHostForm.RemoteAddress" placeholder="输入主机管理地址" clearable/>
          </el-form-item>
          <el-form-item label="管理用户" prop="RemoteUser">
            <el-input v-model="addHostForm.RemoteUser" placeholder="输入主机管理用户" clearable/>
          </el-form-item>
          <el-form-item label="管理密码" prop="RemotePassword">
            <el-input v-model="addHostForm.RemotePassword" placeholder="输入主机管理密码" clearable/>
          </el-form-item>
          <el-row>
            <el-form-item label="备注" prop="Note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="addHostForm.Note"/>
            </el-form-item>
          </el-row>

          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelHostAddFormClose(AddHostFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitHostAddEvent(AddHostFormRef,queryHostFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>

      <!-- 克隆表单. 克隆和添加共用表单-->
      <el-dialog v-model="cloneHostDialogVisible" title="克隆主机" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="AddHostFormRef" :model="addHostForm" :rules="AddEditHostFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="平台名称" prop="PlatformId">
            <PlatformDropDown v-model="addHostForm.PlatformId"></PlatformDropDown>
          </el-form-item>
          <el-form-item label="业务名称" prop="BusinessName">
            <el-input v-model="addHostForm.BusinessName" placeholder="输入业务名称" clearable/>
          </el-form-item>
          <el-form-item label="主机地址" prop="Address">
            <el-input v-model="addHostForm.Address" placeholder="输入主机地址" clearable/>
          </el-form-item>
          <el-form-item label="主机用户" prop="UserName">
            <el-input v-model="addHostForm.UserName" placeholder="输入主机用户" clearable/>
          </el-form-item>
          <el-form-item label="主机密码" prop="PassWord">
            <el-input v-model="addHostForm.PassWord" placeholder="输入主机密码" clearable/>
          </el-form-item>
          <el-form-item label="管理地址" prop="RemoteAddress">
            <el-input v-model="addHostForm.RemoteAddress" placeholder="输入主机管理地址" clearable/>
          </el-form-item>
          <el-form-item label="管理用户" prop="RemoteUser">
            <el-input v-model="addHostForm.RemoteUser" placeholder="输入主机管理用户" clearable/>
          </el-form-item>
          <el-form-item label="管理密码" prop="RemotePassword">
            <el-input v-model="addHostForm.RemotePassword" placeholder="输入主机管理密码" clearable/>
          </el-form-item>
          <el-row>
            <el-form-item label="备注" prop="Note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="addHostForm.Note"/>
            </el-form-item>
          </el-row>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="cloneLoading" @click="cancelHostCloneFormClose(AddHostFormRef)">取消</el-button>
                <el-button size="small" :loading="cloneLoading" type="primary" @click="CommitHostCloneEvent(AddHostFormRef,queryHostFormRef)">克隆</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>

      <!-- 编辑表单-->
      <el-dialog v-model="editHostDialogVisible" title="修改主机" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="EditHostFormRef" :model="editHostForm" :rules="AddEditHostFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <!--          <el-form-item label="平台名称" prop="PlatformId">
                      <PlatformDropDown v-model="editHostForm.PlatformId"></PlatformDropDown>
                    </el-form-item>-->
          <el-form-item label="平台名称" prop="PlatformId">
            <PlatformDropDown v-model="editHostForm.PlatformId"></PlatformDropDown>
          </el-form-item>
          <el-form-item label="业务名称" prop="BusinessName">
            <el-input v-model="editHostForm.BusinessName" placeholder="输入业务名称" clearable/>
          </el-form-item>
          <el-form-item label="主机地址" prop="Address">
            <el-input v-model="editHostForm.Address" placeholder="输入主机地址" clearable/>
          </el-form-item>
          <el-form-item label="主机用户" prop="UserName">
            <el-input v-model="editHostForm.UserName" placeholder="输入主机用户" clearable/>
          </el-form-item>
          <el-form-item label="主机密码" prop="PassWord">
            <el-input v-model="editHostForm.PassWord" placeholder="输入主机密码" clearable/>
          </el-form-item>
          <el-form-item label="管理地址" prop="RemoteAddress">
            <el-input v-model="editHostForm.RemoteAddress" placeholder="输入主机管理地址" clearable/>
          </el-form-item>
          <el-form-item label="管理用户" prop="RemoteUser">
            <el-input v-model="editHostForm.RemoteUser" placeholder="输入主机管理用户" clearable/>
          </el-form-item>
          <el-form-item label="管理密码" prop="RemotePassword">
            <el-input v-model="editHostForm.RemotePassword" placeholder="输入主机管理密码" clearable/>
          </el-form-item>
          <el-row>
            <el-form-item label="备注" prop="Note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="editHostForm.Note"/>
            </el-form-item>
          </el-row>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelHostEditFormClose(EditHostFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitHostEditEvent(EditHostFormRef,queryHostFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>

    </el-card>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {ElDialog, ElMessage, ElMessageBox, ElTable, FormInstance, type FormRules} from 'element-plus';
import {useRouter} from 'vue-router'
import {CopyText} from '@/utils/public'
import api from "@/api";
import {headerCellStyle} from '@/css/base.js'
import PlatformDropDown from "@/views/components/PlatformDropDown.vue";

const sortOrders = ['ascending', 'descending', null];

const router = useRouter();

// 添加和克隆全是相同
let PermCodeAddHost = ref<object>({"TargetPerm": '/report/hosts/add', "CurrentRouter": router.currentRoute.value.path})
let PermCodeEditHost = ref<object>({"TargetPerm": '/report/hosts/edit', "CurrentRouter": router.currentRoute.value.path})
let PermCodeDeleteHost = ref<object>({"TargetPerm": '/report/hosts/delete', "CurrentRouter": router.currentRoute.value.path})

const AddHostFormRef = ref<FormInstance>(); // 添加表单ref
const EditHostFormRef = ref<FormInstance>(); // 编辑表单ref


interface ValueStruct {
  String: string,
  Valid: boolean,
}

// 项目查询表格对象接口
interface HostListStruct {
  Id: string
  PlatformId: string
  PlatformName: string
  DeptName: string
  DeptPerson: string
  BusinessName: string
  Address: string
  UserName: ValueStruct
  PassWord: ValueStruct
  RemoteAddress: ValueStruct
  RemoteUser: ValueStruct
  RemotePassword: ValueStruct
  Note: ValueStruct
}

// 查询表格对象
let hostList = reactive<HostListStruct[]>([])

// 新增表格对象
interface AddEditHostStruct {
  Id: string,
  PlatformId: string,
  BusinessName: string,
  Address: string,
  UserName: string,
  PassWord: string,
  RemoteAddress: string,
  RemoteUser: string,
  RemotePassword: string,
  Note: string
}

let addHostForm = reactive<AddEditHostStruct>({Address: "", BusinessName: "", Id: "", Note: "", PassWord: "", PlatformId: "", RemoteAddress: "", RemotePassword: "", RemoteUser: "", UserName: ""})
let editHostForm = reactive<AddEditHostStruct>({Address: "", BusinessName: "", Id: "", Note: "", PassWord: "", PlatformId: "", RemoteAddress: "", RemotePassword: "", RemoteUser: "", UserName: ""})

let Loading = ref<boolean>(false); // 搜索\重置、新增按钮,表格loading使用
let addLoading = ref<boolean>(false); // 添加弹出层加载按钮
let cloneLoading = ref<boolean>(false); // 克隆弹出层加载按钮
let editLoading = ref<boolean>(false); // 编辑弹出层加载按钮
let deleteLoading = ref<boolean>(false); // 删除按钮加载

// 表单查询接口
interface queryParamsStruct {
  PlatformName: string
  DeptName: string
  DeptPerson: string
  BusinessName: string
  Address: string
  pageNum: number,
  pageSize: number,
  totalSize: number,
}

// 查询表单对象
let queryParams = reactive<queryParamsStruct>({
  PlatformName: "",
  DeptName: "",
  DeptPerson: "",
  BusinessName: "",
  Address: "",
  /*  pageNum: 0,
    pageSize: 0,*/
  pageNum: 1,
  pageSize: 10,
  totalSize: 0,
})

let addHostDialogVisible = ref(false) // 添加图层显示
let cloneHostDialogVisible = ref(false)  // 克隆图层显示
let editHostDialogVisible = ref(false)  // 编辑图层显示

const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const AddEditHostFormRules: FormRules = {
  PlatformId: [{required: true, message: "请选择平台名称", trigger: "blur"},],
  BusinessName: [
    {required: true, message: "最少2位，最长30位", trigger: "blur", min: 2, max: 30},
    {
      validator: (rule, value, callback) => {
        if (value && /^[\u4e00-\u9fa5a-zA-Z0-9\-\\.]+$/.test(value)) {
          callback();
        } else {
          callback(new Error("仅限中文、字母、数字、-、."));
        }
      },
    },
  ],
  Address: [
    {required: true, message: "请输入主机地址", trigger: "blur"},
    {pattern: ipPattern, message: "请输入有效的 IP 地址", trigger: "blur"}
  ],
  UserName: [
    {required: false, message: "请输入主机用户", trigger: "blur"},
    {
      validator: (rule, value, callback) => {
        if (!value && !/^[\u4e00-\u9fa5\u3040-\u30ff\u3130-\u318f\uac00-\ud7af\w-]*$/.test(value)) {
          callback(new Error("不能包含特殊符号"));
        } else {
          callback();
        }
      },
    },
  ],
  PassWord: [{required: false, message: "请输入主机密码", trigger: "blur"}],
  RemoteAddress: [
    {required: true, message: "请输入管理地址", trigger: "blur"},
    {pattern: ipPattern, message: "请输入有效的 IP 地址", trigger: "blur"}
  ],
  RemoteUser: [
    {required: false, message: "请输入管理用户", trigger: "blur"},
    {
      validator: (rule, value, callback) => {
        if (!value && !/^[\u4e00-\u9fa5\u3040-\u30ff\u3130-\u318f\uac00-\ud7af\w-]*$/.test(value)) {
          callback(new Error("不能包含特殊符号"));
        } else {
          callback();
        }
      },
    },
  ],
  RemotePassword: [{required: false, message: "请输入管理密码", trigger: "blur"}],
  Note: [{required: false, trigger: "blur", max: 150}],
};

// 查询表单的Ref
const queryHostFormRef = ref<FormInstance>();

const resetQueryHostForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  queryParams.totalSize = 0
  getHostList(queryParams)
}

const clearHostForm = ((t: AddEditHostStruct) => {
  t.Address = ""
  t.BusinessName = ""
  t.Id = ""
  t.Note = ""
  t.PassWord = ""
  t.PlatformId = ""
  t.RemoteAddress = ""
  t.RemotePassword = ""
  t.RemoteUser = ""
  t.UserName = ""
})

// 打开添加图层. 清空form表单
const openAddHostEvent = () => {
  clearHostForm(addHostForm)
  addHostDialogVisible.value = true
  addHostForm.UserName = 'root'
  addHostForm.RemoteUser = 'root'
}

// 打开克隆图层. 清空form表单
const openCloneHostEvent = async <T extends HostListStruct>(row: T): Promise<void> => {
  clearHostForm(addHostForm)
  addHostForm.PlatformId = row.PlatformId
  addHostForm.Address = row.Address
  addHostForm.BusinessName = row.BusinessName
  addHostForm.UserName = row.UserName.String
  addHostForm.PassWord = row.PassWord.String
  addHostForm.RemoteAddress = row.RemoteAddress.String
  addHostForm.RemotePassword = row.RemotePassword.String
  addHostForm.RemoteUser = row.RemoteUser.String
  addHostForm.Note = row.Note.String
  cloneHostDialogVisible.value = true
}

// 打开编辑图层. 清空form表单
const openEditHostEvent = async <T extends HostListStruct>(row: T): Promise<void> => {
  clearHostForm(editHostForm)
  editHostForm.Id = row.Id
  editHostForm.PlatformId = row.PlatformId
  editHostForm.Address = row.Address
  editHostForm.BusinessName = row.BusinessName
  editHostForm.UserName = row.UserName.String
  editHostForm.PassWord = row.PassWord.String
  editHostForm.RemoteAddress = row.RemoteAddress.String
  editHostForm.RemotePassword = row.RemotePassword.String
  editHostForm.RemoteUser = row.RemoteUser.String
  editHostForm.Note = row.Note.String
  editHostDialogVisible.value = true
}

// 删除行事件, 传参: 1、row数据. 2、查询表单的ref
const deleteHostEvent = async <T extends HostListStruct>(row: T, formE2: FormInstance | undefined): Promise<void> => {
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
    const {data: res} = await api.deleteHost(row)
    if (res.code !== 200) {
      deleteLoading.value = false
      ElMessage.error(res.message)
      return
    }
    deleteLoading.value = false
    ElMessage.success({center: true, message: "删除成功"})
    await resetQueryHostForm(formE2) // 清空查询表单,并查询
  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })


}

const handleSizeChange = (newSize) => {
  if (queryParams.pageSize !== newSize) {
    queryParams.pageSize = newSize;
    queryParams.pageNum = 1;
    getHostList(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.pageNum !== newPage) {
    queryParams.pageNum = newPage
    getHostList(queryParams)
  }
}

const getHostListWhere = (e) => {
  e.pageSize = 10
  e.pageNum = 1
  e.totalSize = 0
  getHostList(e)
}

const getHostList = (async (e: queryParamsStruct) => {
  Loading.value = true
  const {data: res} = await api.getHost(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  hostList = res.data.list
  e.totalSize = res.data.total
  e.pageNum = res.data.pageNum
  e.pageSize = res.data.pageSize
  Loading.value = false
})

// 清空图层表单
const resetHostFromTable = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 添加图层取消按钮
const cancelHostAddFormClose = (formEl: FormInstance | undefined) => {
  addLoading.value = true
  resetHostFromTable(formEl) // 清空add弹出层的表单数据
  addHostDialogVisible.value = false // 关闭弹出层
  addLoading.value = false
}

// 编辑图层取消按钮
const cancelHostEditFormClose = (formEl: FormInstance | undefined) => {
  editLoading.value = true
  resetHostFromTable(formEl) // 清空编辑弹出层的表单数据
  editHostDialogVisible.value = false // 关闭弹出层
  editLoading.value = false
}

// 克隆图层取消按钮
const cancelHostCloneFormClose = (formEl: FormInstance | undefined) => {
  cloneLoading.value = true
  resetHostFromTable(formEl) // 清空克隆弹出层的表单数据
  cloneHostDialogVisible.value = false // 关闭弹出层
  cloneLoading.value = false
}


onMounted(() => {
  getHostList(queryParams)
})

const CommitHostCloneEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      cloneLoading.value = true
      const {data: res} = await api.addHost(addHostForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        cloneLoading.value = false
        return
      }
      cloneLoading.value = false
      cloneHostDialogVisible.value = false
      formEl.resetFields() //  清空新增表单
      ElMessage.success({center: true, message: "添加成功"})
      await resetQueryHostForm(formE2) // 清空查询表单,并查询
    }
  })
})

const CommitHostAddEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.addHost(addHostForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      addHostDialogVisible.value = false
      formEl.resetFields() //  清空新增表单
      ElMessage.success({center: true, message: "添加成功"})
      await resetQueryHostForm(formE2) // 清空查询表单,并查询
    }
  })
})

const CommitHostEditEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      editLoading.value = true
      const {data: res} = await api.editHost(editHostForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        editLoading.value = false
        return
      }

      editLoading.value = false
      editHostDialogVisible.value = false
      formEl.resetFields() //  清空更新表单
      ElMessage.success({center: true, message: "修改成功"})
      await resetQueryHostForm(formE2) // 清空查询表单,并查询
    }
  })
})


</script>

<style scoped>

</style>
