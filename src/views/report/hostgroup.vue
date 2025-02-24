<template>
  <el-card body-style="padding:15px; margin-top:5px;">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryHostGroupFormRef" label-width="70px">
      <el-form-item label="平台名" prop="PlatformName">
        <el-input id="PlatformName" class="searchList" placeholder="输入项目名" clearable v-model="queryParams.PlatformName" @keydown.enter.capture="getHostGroupWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="项目名" prop="ProjectName">
        <el-input id="ProjectName" class="searchList" placeholder="输入项目名" clearable v-model="queryParams.ProjectName" @keydown.enter.capture="getHostGroupWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="主机组" prop="GroupName">
        <el-input id="GroupName" class="searchList" placeholder="输入所属人" clearable v-model="queryParams.GroupName" @keydown.enter.capture="getHostGroupWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="IP地址" prop="Address">
        <el-input id="Address" class="searchList" placeholder="输入IP地址" clearable v-model="queryParams.Address" @keydown.enter.capture="getHostGroupWhere(queryParams)"/>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="getHostGroupWhere(queryParams)">搜索</el-button>
      <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetQueryHostGroupForm(queryHostGroupFormRef)">重置</el-button>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <div style="display: none" v-permission="PermCodeAddHostGroup">
        <el-row :gutter="10" class="mb8" style="margin-bottom: 15px;">
          <el-col :span="1.5">
            <el-button plain type="primary" size="small" icon="CirclePlus" @click="openAddHostGroupEvent(AddHostGroupFormRef)" :loading="Loading">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <el-form :inline="true">
        <el-table size="small" v-loading="Loading" border stripe :data="hostGroup" style="width: 100%;"
                  :header-cell-style="headerCellStyle" @cell-click="CopyText">
          <el-table-column label="ID" prop="Id" v-if="false"/>
          <el-table-column fixed label="项目名" prop="ProjectName" min-width="120" width="auto" show-overflow-tooltip  :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column fixed label="平台名" prop="PlatformName" min-width="180" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="主机组" prop="GroupName" min-width="120" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="主机组编码" prop="GroupCode" min-width="150" width="auto" v-if="false" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="IP地址" prop="Address" min-width="220" width="auto" show-overflow-tooltip :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="备注" prop="Note.String" width="150" show-overflow-tooltip/>
          <el-table-column label="更多操作" fixed="right" min-width="200" width="auto">
            <template v-slot="scope">
              <div class="button-container">
                <div style="display: none" v-permission="PermCodeEditHostGroup">
                  <el-button plain type="primary" size="small" :loading="editLoading" icon="Edit" @click="openEditHostGroupEvent(scope.row,EditHostGroupFormRef)">编辑</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeDeleteHostGroup">
                  <el-button plain type="danger" size="small" :loading="deleteLoading" icon="Delete" @click="deleteHostGroupEvent(scope.row,queryHostGroupFormRef)">删除</el-button>
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

      <!-- 添加表单-->
      <el-dialog v-model="addHostGroupDialogVisible" title="添加主机组" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="AddHostGroupFormRef" :model="addHostGroupForm" :rules="AddEditHostGroupFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="主机组" prop="HostGroupName">
            <el-input v-model="addHostGroupForm.HostGroupName" placeholder="输入主机组" clearable/>
          </el-form-item>
          <el-row>
            <el-form-item label="主机" prop="HostId">
              <div style="display: flex; justify-content: center; ">
                <el-table height="166px" max-height="166px" :data="addHostGroupForm.HostId" border style="width: 100%; font-size: 8px;" size="small">
                  <el-table-column prop="Host.Id" label="主机" width="120">
                    <template #default="{row}">
                      <el-form-item prop="Host.Id" size="small" style="width: 104px;">
                        <HostDropDownSet v-model="row.Host" :value-key="'Id'" @change="handleHostSelectForAdd(row.Host,row)"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Host.ProjectName" label="项目名称" width="75"/>
                  <el-table-column prop="Host.PlatformName" label="平台名称" width="75"/>
                  <el-table-column prop="Host.BusinessName" label="业务名称" width="82"/>
                  <el-table-column prop="Host.Address" label="主机地址" width="75"/>
                  <el-table-column width="45">
                    <template #header>
                      <div style="text-align: center;">
                        <el-button type="text" circle icon="CirclePlus" @click="addRowForAdd" size="small"/>
                      </div>
                    </template>
                    <template #default="{row}">
                      <div style="text-align: center;">
                        <el-button type="text" circle icon="Close" @click="deleteRowForAdd(row)" size="small"/>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="备注" prop="Note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="addHostGroupForm.Note"/>
            </el-form-item>
          </el-row>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelHostGroupAddFormClose(AddHostGroupFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitAddHostGroupEvent( AddHostGroupFormRef,queryHostGroupFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
          {{ ObjSet }}
        </el-form>
      </el-dialog>

      <!-- 编辑表单-->
      <el-dialog v-model="editHostGroupDialogVisible" title="编辑主机组" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="EditHostGroupFormRef" :model="editHostGroupForm" :rules="AddEditHostGroupFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="主机组" prop="HostGroupName">
            <el-input v-model="editHostGroupForm.HostGroupName" placeholder="输入主机组" clearable/>
          </el-form-item>
          <el-row>
            <el-form-item label="主机" prop="HostId">
              <div style="display: flex; justify-content: center; ">
                <el-table height="166px" max-height="166px" :data="editHostGroupForm.HostId" border style="width: 100%; font-size: 8px;" size="small">
                  <el-table-column prop="Host.Id" label="主机" width="120">
                    <template #default="{row}">
                      <el-form-item prop="Host.Id" size="small" style="width: 104px;">
                        <HostDropDownSet v-model="row.Host" :value-key="'Id'" @change="handleHostSelectForEdit(row.Host,row)"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Host.ProjectName" label="项目名称" width="75" show-overflow-tooltip/>
                  <el-table-column prop="Host.PlatformName" label="平台名称" width="75" show-overflow-tooltip/>
                  <el-table-column prop="Host.BusinessName" label="业务名称" width="82" show-overflow-tooltip/>
                  <el-table-column prop="Host.Address" label="主机地址" width="75" show-overflow-tooltip/>
                  <el-table-column width="45">
                    <template #header>
                      <div style="text-align: center;">
                        <el-button type="text" circle icon="CirclePlus" @click="addRowForEdit" size="small"/>
                      </div>
                    </template>
                    <template #default="{row}">
                      <div style="text-align: center;">
                        <el-button type="text" circle icon="Close" @click="deleteRowForEdit(row)" size="small"/>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="备注" prop="Note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="editHostGroupForm.Note"/>
            </el-form-item>
          </el-row>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelHostGroupEditFormClose(EditHostGroupFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitEditHostGroupEvent(EditHostGroupFormRef,queryHostGroupFormRef)">提交</el-button>
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
import {ElDialog, ElInput, ElMessage, ElMessageBox, ElTable, FormInstance, type FormRules} from 'element-plus';
import {useRouter} from 'vue-router'
import {CopyText} from '@/utils/public'
import api from "@/api";
import {headerCellStyle} from '@/css/base.js'
import HostDropDownSet from "@/views/components/HostDropDownSet.vue";

const router = useRouter();
const sortOrders = ['ascending', 'descending', null];

let PermCodeAddHostGroup = ref<object>({"TargetPerm": '/report/hostgroup/add', "CurrentRouter": router.currentRoute.value.path})
let PermCodeEditHostGroup = ref<object>({"TargetPerm": '/report/hostgroup/edit', "CurrentRouter": router.currentRoute.value.path})
let PermCodeDeleteHostGroup = ref<object>({"TargetPerm": '/report/hostgroup/delete', "CurrentRouter": router.currentRoute.value.path})

const currentRowNumber = ref<number>(0)

interface ValueStruct {
  String: string,
  Valid: boolean,
}

const initialValue: ValueStruct = {
  String: "",
  Valid: false
}

// 查询表格对象接口
interface HostGroupStruct {
  Id: string
  ProjectName: string
  PlatformName: string
  GroupName: string
  GroupCode: string
  Address: string
  Note: ValueStruct
}

// 查询表格对象
let hostGroup = reactive<HostGroupStruct[]>([])


interface HostStructTmp {
  Id: string
  ProjectName: string
  PlatformName: string
  BusinessName: string
  Address: string
  RemoteAddress: ValueStruct
}

let ObjSet = ref<HostStructTmp>()

/*
let HostTemp = reactive<HostStruct>({Number: 0, Address: "", BusinessName: "", Id: "", PlatformName: "", ProjectName: "", RemoteAddress: initialValue})
*/

interface AddressStruct {
  Id: string
  ProjectName: string
  PlatformName: string
  BusinessName: string
  Address: string
  RemoteAddress: ValueStruct
}

interface HostStruct {
  Number: number
  Host: AddressStruct
}

// 新增表格对象
interface AddHostGroupStruct {
  Id: string,
  HostGroupName: string
  HostId: HostStruct[]
  Note: string
}

interface EditHostGroupStruct {
  Id: string,
  HostGroupName: string
  GroupCode: string
  HostId: HostStruct[]
  Note: string
}


let addHostGroupForm = reactive<AddHostGroupStruct>({HostGroupName: "", HostId: [], Id: "", Note: ""})
let editHostGroupForm = reactive<EditHostGroupStruct>({GroupCode: "", HostGroupName: "", HostId: [], Id: "", Note: ""})

let Loading = ref<boolean>(false); // 搜索\重置、新增按钮,表格loading使用
let addLoading = ref<boolean>(false); // 添加弹出层加载按钮
let editLoading = ref<boolean>(false); // 编辑弹出层加载按钮
let deleteLoading = ref<boolean>(false); // 删除按钮加载

// 表单查询接口
interface queryParamsStruct {
  ProjectName: string
  PlatformName: string
  GroupName: string
  Address: string
  pageNum: number,
  pageSize: number,
  totalSize: number,
}

// 查询表单对象
let queryParams = reactive<queryParamsStruct>({
  ProjectName: "",
  PlatformName: "",
  GroupName: "",
  Address: "",
  pageNum: 0,
  pageSize: 0,
  totalSize: 0,
})

let addHostGroupDialogVisible = ref(false) // 添加图层显示
let editHostGroupDialogVisible = ref(false)  // 编辑图层显示


const AddEditHostGroupFormRules: FormRules = {
  HostGroupName: [
    {required: true, message: "请输入主机组名称", trigger: "blur", min: 2, max: 14},
    {
      validator: (rule, value, callback) => {
        if (value && /^[\u4e00-\u9fa5\u3040-\u30ff\u3130-\u318f\uac00-\ud7af\w-]*$/.test(value)) {
          callback();
        } else {
          callback(new Error("不能包含特殊符号"));
        }
      },
    },
  ],
  HostId: [
    {required: true, message: "主机至少有一个", trigger: "blur"},
    {
      validator: (rule, value, callback) => {
        let check = 0
        if (value.length === 0) {
          callback(new Error("主机至少有一个"));
        } else {
          for (let i = 0; i < value.length; i++) {
            switch (true) {
              case value[i].Host === undefined:
                check++
                break
              case value[i].Host.Id === undefined:
                check++
                break
              case value[i].Host.Id.length === 0:
                check++
                break
            }
          }
        }
        if (check > 0) {
          callback(new Error("主机地址不可以为空"));
        } else {
          callback()
        }

      },
      trigger: "blur"
    }
  ],
  Note: [{required: false, trigger: "blur", max: 150}],
};

// 查询表单的Ref
const queryHostGroupFormRef = ref<FormInstance>();

const resetQueryHostGroupForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  queryParams.pageNum = 0
  queryParams.pageSize = 0
  queryParams.totalSize = 0
  getHostGroup(queryParams)
}

// 打开添加图层. 清空form表单
const openAddHostGroupEvent = ((formEl: FormInstance | undefined) => {
  resetHostGroupFromTable(formEl) // 清空add弹出层的表单数据
  addHostGroupForm.HostId = []
  addHostGroupDialogVisible.value = true
})

// 打开编辑图层. 清空form表单
const openEditHostGroupEvent = (async <T extends HostGroupStruct>(row: T, formE2: FormInstance | undefined): Promise<void> => {
  resetHostGroupFromTable(formE2) // 清空edit弹出层的表单数据

  editHostGroupForm.Id = ""
  editHostGroupForm.HostGroupName = ""
  editHostGroupForm.HostId = []
  editHostGroupForm.Note = ""
  editHostGroupForm.GroupCode = ""

  editLoading.value = true
  const {data: res} = await api.getHostGroupDetail(row)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    editLoading.value = false
    return
  }

  editHostGroupForm.Id = res.data.Id
  editHostGroupForm.HostGroupName = res.data.HostGroupName
  editHostGroupForm.GroupCode = res.data.GroupCode
  editHostGroupForm.HostId = res.data.HostId
  editHostGroupForm.Note = res.data.Note
  editLoading.value = false
  console.log("editHostGroupForm: ", editHostGroupForm)
  editHostGroupDialogVisible.value = true
})

// 删除行事件, 传参: 1、row数据. 2、查询表单的ref
const deleteHostGroupEvent = async <T extends HostGroupStruct>(row: T, formE2: FormInstance | undefined): Promise<void> => {
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
    const {data: res} = await api.deleteHostGroup(row)
    if (res.code !== 200) {
      ElMessage.error(res.message)
      addLoading.value = false
      return
    }
    deleteLoading.value = false
    ElMessage.success({center: true, message: "删除成功"})
    await resetQueryHostGroupForm(formE2) // 清空查询表单,并查询*/
  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })


}

const handleSizeChange = (newSize) => {
  if (queryParams.pageSize !== newSize) {
    queryParams.pageSize = newSize;
    queryParams.pageNum = 0;
    getHostGroup(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.pageNum !== newPage) {
    queryParams.pageNum = newPage
    getHostGroup(queryParams)
  }
}

const getHostGroupWhere = (e) => {
  e.pageSize = 0
  e.pageNum = 0
  e.totalSize = 0
  getHostGroup(e)
}

const getHostGroup = (async (e: queryParamsStruct) => {
  Loading.value = true
  const {data: res} = await api.getHostGroup(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  hostGroup = res.data.list
  e.totalSize = res.data.total
  e.pageNum = res.data.pageNum
  e.pageSize = res.data.pageSize
  Loading.value = false
})

const addRowForAdd = (() => {
  let len = addHostGroupForm.HostId.length
  let addressSet: AddressStruct = {
    Id: "",
    ProjectName: "",
    PlatformName: "",
    BusinessName: "",
    Address: "",
    RemoteAddress: initialValue,
  }
  let data: HostStruct = {
    Number: len,
    Host: addressSet
  };
  addHostGroupForm.HostId.push(data)
})

const addRowForEdit = (() => {
  let len = editHostGroupForm.HostId.length
  let addressSet: AddressStruct = {
    Id: "",
    ProjectName: "",
    PlatformName: "",
    BusinessName: "",
    Address: "",
    RemoteAddress: initialValue,
  }
  let data: HostStruct = {
    Number: len,
    Host: addressSet
  };
  editHostGroupForm.HostId.push(data)
})


const deleteRowForAdd = ((row) => {
  for (let i = 0; i < addHostGroupForm.HostId.length; i++) {
    if (addHostGroupForm.HostId[i].Number == row.Number) {
      addHostGroupForm.HostId.splice(i, 1)
    }
  }
})


const deleteRowForEdit = ((row) => {
  for (let i = 0; i < editHostGroupForm.HostId.length; i++) {
    if (editHostGroupForm.HostId[i].Number == row.Number) {
      editHostGroupForm.HostId.splice(i, 1)
    }
  }
})


const handleHostSelectForEdit = ((selectedHostId: HostStruct, currentRow: HostStruct) => {
  let ct = 0;
  for (let i = 0; i < editHostGroupForm.HostId.length; i++) {
    if (currentRow !== null && currentRow.Host != null) {
      if (currentRow.Host.Id !== undefined &&
          editHostGroupForm.HostId[i].Host !== undefined &&
          editHostGroupForm.HostId[i].Host.Id !== undefined &&
          editHostGroupForm.HostId[i].Host.Id == currentRow.Host.Id) {
        ct++
      }
    }
  }

  if (ct > 1) {
    // 如果找到重复的.那么则清空, 不允许出现重复的主机
    let addressSet: AddressStruct = {
      Id: "",
      ProjectName: "",
      PlatformName: "",
      BusinessName: "",
      Address: "",
      RemoteAddress: initialValue,
    }
    editHostGroupForm.HostId[currentRow.Number] = {Host: addressSet, "Number": currentRow.Number}
    ElMessage.error({center: true, message: "无法添加重复主机"})
    return
  }

  // 主机组内的主机: 项目、平台必须相同
  for (let i = 0; i < editHostGroupForm.HostId.length; i++) {
    if (currentRow !== null && currentRow.Host != null) {
      if (currentRow.Host.Id !== undefined &&
          editHostGroupForm.HostId[i].Host !== undefined &&
          editHostGroupForm.HostId[i].Host.Id !== undefined &&
          editHostGroupForm.HostId[i].Host.Id.length > 0) {
        if (editHostGroupForm.HostId[i].Host.ProjectName !== currentRow.Host.ProjectName ||
            editHostGroupForm.HostId[i].Host.PlatformName !== currentRow.Host.PlatformName) {
          let addressSet: AddressStruct = {
            Id: "",
            ProjectName: "",
            PlatformName: "",
            BusinessName: "",
            Address: "",
            RemoteAddress: initialValue,
          }
          editHostGroupForm.HostId[currentRow.Number] = {Host: addressSet, "Number": currentRow.Number}
          ElMessage.error({center: true, message: "主机组内的主机必须具有共同业务属性"})
          return
        }
      }
    }
  }
})

const handleHostSelectForAdd = ((selectedHostId: HostStruct, currentRow: HostStruct) => {
  let ct = 0;
  for (let i = 0; i < addHostGroupForm.HostId.length; i++) {
    if (currentRow !== null && currentRow.Host != null) {
      if (currentRow.Host.Id !== undefined &&
          addHostGroupForm.HostId[i].Host !== undefined &&
          addHostGroupForm.HostId[i].Host.Id !== undefined &&
          addHostGroupForm.HostId[i].Host.Id == currentRow.Host.Id) {
        ct++
      }
    }
  }

  if (ct > 1) {
    // 如果找到重复的.那么则清空, 不允许出现重复的主机
    let addressSet: AddressStruct = {
      Id: "",
      ProjectName: "",
      PlatformName: "",
      BusinessName: "",
      Address: "",
      RemoteAddress: initialValue,
    }
    addHostGroupForm.HostId[currentRow.Number] = {Host: addressSet, "Number": currentRow.Number}
    ElMessage.error({center: true, message: "无法添加重复主机"})
    return
  }


  for (let i = 0; i < addHostGroupForm.HostId.length; i++) {
    if (currentRow !== null && currentRow.Host != null) {
      if (currentRow.Host.Id !== undefined &&
          addHostGroupForm.HostId[i].Host !== undefined &&
          addHostGroupForm.HostId[i].Host.Id !== undefined &&
          addHostGroupForm.HostId[i].Host.Id.length > 0) {
        if (addHostGroupForm.HostId[i].Host.ProjectName !== currentRow.Host.ProjectName ||
            addHostGroupForm.HostId[i].Host.PlatformName !== currentRow.Host.PlatformName) {
          let addressSet: AddressStruct = {
            Id: "",
            ProjectName: "",
            PlatformName: "",
            BusinessName: "",
            Address: "",
            RemoteAddress: initialValue,
          }
          addHostGroupForm.HostId[currentRow.Number] = {Host: addressSet, "Number": currentRow.Number}
          ElMessage.error({center: true, message: "主机组内的主机必须具有共同业务属性"})
          return
        }

      }
    }
  }
})


const AddHostGroupFormRef = ref<FormInstance>(); // 添加表单ref
const EditHostGroupFormRef = ref<FormInstance>(); // 编辑表单ref

// 清空图层表单
const resetHostGroupFromTable = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 添加图层取消按钮
const cancelHostGroupAddFormClose = (formEl: FormInstance | undefined) => {
  addLoading.value = true
  resetHostGroupFromTable(formEl) // 清空add弹出层的表单数据
  addHostGroupForm.HostId = []
  addHostGroupDialogVisible.value = false // 关闭弹出层
  addLoading.value = false
}

// 编辑图层取消按钮
const cancelHostGroupEditFormClose = (formEl: FormInstance | undefined) => {
  editLoading.value = true
  resetHostGroupFromTable(formEl) // 清空编辑弹出层的表单数据
  editHostGroupForm.HostId = []
  editHostGroupDialogVisible.value = false // 关闭弹出层
  editLoading.value = false
}


// 新增信息 提交事件
const CommitAddHostGroupEvent = async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {

  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.addHostGroup(addHostGroupForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      addHostGroupDialogVisible.value = false
      resetHostGroupFromTable(formEl) //  清空新增表单
      ElMessage.success({center: true, message: "添加成功"})
      await resetQueryHostGroupForm(formE2) // 清空查询表单,并查询*/
    }
  })
}


// 新增信息 提交事件
const CommitEditHostGroupEvent = async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.editHostGroup(editHostGroupForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      editHostGroupDialogVisible.value = false
      resetHostGroupFromTable(formEl) //  清空新增表单
      ElMessage.success({center: true, message: "修改成功"})
      await resetQueryHostGroupForm(formE2) // 清空查询表单,并查询
    }
  })
}


onMounted(() => {
  getHostGroup(queryParams)
})


</script>
