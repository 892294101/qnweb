<template>
  <el-card body-style="padding:15px; margin-top:5px;">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryUserFormRef" label-width="70px">
      <el-form-item label="用户" prop="UserName">
        <el-input id="UserName" class="searchList" placeholder="输入用户" clearable v-model="queryParams.UserName" @keydown.enter.capture="getUserListWhere(queryParams)"/>
      </el-form-item>
      <el-form-item label="角色" prop="RoleName">
        <el-input id="RoleName" class="searchList" placeholder="输入角色" clearable v-model="queryParams.RoleName" @keydown.enter.capture="getUserListWhere(queryParams)"/>
      </el-form-item>
      <el-form-item label="部门" prop="DeptName">
        <el-input id="DeptName" class="searchList" placeholder="输入部门" clearable v-model="queryParams.DeptName" @keydown.enter.capture="getUserListWhere(queryParams)"/>
      </el-form-item>
      <el-form-item label="岗位" prop="PostName">
        <el-input id="PostName" class="searchList" placeholder="输入岗位" clearable v-model="queryParams.PostName" @keydown.enter.capture="getUserListWhere(queryParams)"/>
      </el-form-item>
      <el-form-item label="号码" prop="Phone">
        <el-input id="Phone" class="searchList" placeholder="输入号码" clearable v-model="queryParams.Phone" @keydown.enter.capture="getUserListWhere(queryParams)"/>
      </el-form-item>
      <el-form-item label="状态" prop="Status">
        <el-select id="Status" class="searchList" placeholder="选择用户状态" v-model="queryParams.Status" clearable @keydown.enter.capture="getUserListWhere(queryParams)">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form :inline="true">
        <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="getUserListWhere(queryParams)">搜索</el-button>
        <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetQueryUserForm(queryUserFormRef)">重置</el-button>
      </el-form>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <div style="display: none;" v-permission="PermCodeAddUser">
        <el-row :gutter="10" class="mb8" style="margin-bottom: 15px;">
          <el-col :span="1.5">
            <el-button plain type="primary" size="small" icon="CirclePlus" @click="openAddUserEvent" :loading="Loading">新增</el-button>
          </el-col>
        </el-row>
      </div>

      <el-form :inline="true">
        <el-table size="small" v-loading="Loading" border stripe :data="userList" style="width: 100%;"
                  :header-cell-style="headerCellStyle" @cell-click="CopyText">
          <el-table-column label="ID" prop="Id" v-if="false"/>
          <el-table-column fixed label="用户" prop="UserName" min-width="120" width="auto" show-overflow-tooltip/>
          <el-table-column label="昵称" prop="NickName.String" min-width="120" width="auto" show-overflow-tooltip/>
          <el-table-column label="角色" prop="RoleName" min-width="120" width="auto" show-overflow-tooltip/>
          <el-table-column label="部门" prop="DeptName" min-width="120" width="auto" show-overflow-tooltip/>
          <el-table-column label="岗位" prop="PostName" min-width="120" width="auto" show-overflow-tooltip/>
          <el-table-column label="状态" prop="Status" min-width="120" width="auto" :formatter="formatUserStatus"/>
          <!--          <el-table-column label="头像" prop="Icon.String" min-width="120" width="auto"/>-->
          <el-table-column label="邮箱" prop="Email.String" min-width="120" width="auto" show-overflow-tooltip/>
          <el-table-column label="号码" prop="Phone.String" min-width="120" width="auto" show-overflow-tooltip/>
          <el-table-column label="创建时间" prop="CreateTime" min-width="220" width="auto"/>
          <el-table-column label="更多操作" fixed="right" min-width="200" width="auto">
            <template v-slot="scope">
              <div class="button-container">
                <div style="display: none" v-permission="PermCodeEditUser">
                  <el-button plain type="primary" size="small" :loading="editLoading" icon="Edit" @click="openEditUserEvent(scope.row)">编辑</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeDeleteUser">
                  <el-button plain type="danger" size="small" :loading="deleteLoading" icon="Delete" @click="deleteDBEvent(scope.row,queryUserFormRef)">删除</el-button>
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
      <el-dialog v-model="addUserDialogVisible" title="添加用户" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false" ref="AddUserFormRef">
        <el-form :inline="true" ref="AddUserFormRef" :model="addUserForm" :rules="AddEditUserFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="用户" prop="UserName">
            <el-input v-model="addUserForm.UserName" placeholder="输入用户" clearable/>
          </el-form-item>
          <el-form-item label="密码" prop="PassWord">
            <el-input v-model="addUserForm.PassWord" placeholder="输入密码" type="password" clearable/>
          </el-form-item>
          <el-form-item label="角色" prop="RoleId">
            <el-select v-model="addUserForm.RoleId" placeholder="选择角色" filterable clearable remote :loading="LoadRoleLoading"
                       :loading-text="'正在提取角色'" @visible-change="rmRequestRoleSet">
              <el-option v-for="item in filterRoleSet" :key="item.Id" :label="item.RoleName" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="DeptId">
            <el-tree-select v-model="addUserForm.DeptId" :data="filterDeptSet" check-strictly :render-after-expand="false" filterable clearable
                            :loading="LoadDeptLoading" :loading-text="'正在提取部门'" placeholder="选择部门"
                            @visible-change="getRemoteDeptSet" :props="{value:'Id', label: 'DeptName', children: 'ChildDeptTable'}"
                            default-expand-all/>
          </el-form-item>
          <el-form-item label="岗位" prop="PostId">
            <el-select v-model="addUserForm.PostId" placeholder="选择岗位" filterable clearable remote :loading="LoadPostLoading"
                       :loading-text="'正在提取岗位'" @visible-change="rmRequestPostSet">
              <el-option v-for="item in filterPostSet" :key="item.Id" :label="item.PostName" :value="item.Id"/>
            </el-select>
          </el-form-item>

<!--          <el-form-item label="项目" prop="ProjectId">
            <el-select v-model="value" multiple clearable collapse-tags placeholder="选择项目" popper-class="custom-header" :max-collapse-tags="1">
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">全选</el-checkbox>
              </template>
              <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>-->


<!--          <el-form-item label="项目" prop="ProjectId">
            <el-select v-model="value" multiple clearable collapse-tags placeholder="选择项目" popper-class="custom-header" :max-collapse-tags="1">
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">全选</el-checkbox>
              </template>
              <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>-->

          <el-form-item label="昵称" prop="Nickname">
            <el-input v-model="addUserForm.Nickname" placeholder="输入昵称" clearable/>
          </el-form-item>
          <el-form-item label="邮箱" prop="Email">
            <el-input v-model="addUserForm.Email" placeholder="输入邮箱" clearable/>
          </el-form-item>
          <el-form-item label="号码" prop="Phone">
            <el-input v-model="addUserForm.Phone" placeholder="输入号码" clearable/>
          </el-form-item>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelAddUserFormClose(AddUserFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitAddUserEvent(AddUserFormRef,queryUserFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>


      <!-- 编辑项目表单-->
      <el-dialog v-model="editUserDialogVisible" title="添加项目组" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="EditUserFormRef" :model="editUserForm" :rules="AddEditUserFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="用户" prop="UserName">
            <el-input v-model="editUserForm.UserName" placeholder="输入用户" clearable/>
          </el-form-item>
          <el-form-item label="角色" prop="RoleId">
            <el-select v-model="editUserForm.RoleId" placeholder="选择角色" filterable clearable remote :loading="LoadRoleLoading"
                       :loading-text="'正在提取角色'" @visible-change="rmRequestRoleSet">
              <el-option v-for="item in filterRoleSet" :key="item.Id" :label="item.RoleName" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="DeptId">
            <el-tree-select v-model="editUserForm.DeptId" :data="filterDeptSet" check-strictly :render-after-expand="false" filterable clearable
                            :loading-text="'正在提取部门'" placeholder="选择部门"
                            @visible-change="getRemoteDeptSet" :props="{value:'Id', label: 'DeptName', children: 'ChildDeptTable'}"
                            default-expand-all/>
          </el-form-item>
          <el-form-item label="岗位" prop="PostId">
            <el-select v-model="editUserForm.PostId" placeholder="选择岗位" filterable clearable remote :loading="LoadPostLoading"
                       :loading-text="'正在提取岗位'" @visible-change="rmRequestPostSet">
              <el-option v-for="item in filterPostSet" :key="item.Id" :label="item.PostName" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="昵称" prop="Nickname">
            <el-input v-model="editUserForm.Nickname" placeholder="输入昵称" clearable/>
          </el-form-item>
          <el-form-item label="邮箱" prop="Email">
            <el-input v-model="editUserForm.Email" placeholder="输入邮箱" clearable/>
          </el-form-item>
          <el-form-item label="号码" prop="Phone">
            <el-input v-model="editUserForm.Phone" placeholder="输入号码" clearable/>
          </el-form-item>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="editLoading" @click="cancelEditUserFormClose(EditUserFormRef)">取消</el-button>
                <el-button size="small" :loading="editLoading" type="primary" @click="CommitEditUserEvent(EditUserFormRef,queryUserFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>
    </el-card>
  </div>

</template>


<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from "vue";

import {CheckboxValueType, ElDialog, ElMessage, ElMessageBox, ElTable, ElTableColumn, FormInstance, type FormRules} from 'element-plus';
import {useRouter} from 'vue-router'
import {CopyText} from '@/utils/public'
import api from "@/api"
import {headerCellStyle} from '@/css/base.js'

const router = useRouter();


let PermCodeAddUser = ref<object>({"TargetPerm": '/base/user/add', "CurrentRouter": router.currentRoute.value.path})
let PermCodeEditUser = ref<object>({"TargetPerm": '/base/user/edit', "CurrentRouter": router.currentRoute.value.path})
let PermCodeDeleteUser = ref<object>({"TargetPerm": '/base/user/delete', "CurrentRouter": router.currentRoute.value.path})


interface ValueStruct {
  String: string,
  Valid: boolean,
}

// 项目查询表格对象接口
interface UserListStruct {
  Id: string
  UserName: string
  NickName: ValueStruct
  RoleName: string
  RoleId: string
  DeptName: string
  DeptId: string
  PostName: string
  PostId: string
  Status: string
  Icon: ValueStruct
  Email: ValueStruct
  Phone: ValueStruct
  CreateTime: string
}

// 项目查询表格对象
let userList = reactive<UserListStruct[]>([])

// 项目新增表格对象
interface AddUserStruct {
  UserName: string
  Nickname: string
  RoleId: string
  DeptId: string
  PostId: string
  PassWord: string
  Email: string
  Phone: string
  ProjectId: string
}

interface EditUserStruct {
  Id: string
  UserName: string
  Nickname: string
  RoleId: string
  DeptId: string
  PostId: string
  Email: string
  Phone: string
}

let addUserForm = reactive<AddUserStruct>({DeptId: "", Email: "", Nickname: "", Phone: "", PostId: "", RoleId: "", UserName: "", PassWord: "", ProjectId: ""})
let editUserForm = reactive<EditUserStruct>({DeptId: "", Email: "", Id: "", Nickname: "", Phone: "", PostId: "", RoleId: "", UserName: "", ProjectId: ""})


let Loading = ref<boolean>(false); // 搜索\重置、新增按钮,表格loading使用
let addLoading = ref<boolean>(false); // 添加弹出层加载按钮
let editLoading = ref<boolean>(false); // 编辑弹出层加载按钮
let deleteLoading = ref<boolean>(false); // 删除按钮加载

let statusList = [
  {value: '1', label: '启用',},
  {value: '0', label: '停用',}
]


interface queryParamsStruct {
  UserName: String
  RoleName: String
  DeptName: String
  PostName: String
  Status: String
  Phone: String
  pageNum: number,
  pageSize: number,
  totalSize: number,
}

let queryParams = reactive<queryParamsStruct>({
  UserName: "",
  RoleName: "",
  DeptName: "",
  PostName: "",
  Status: "",
  Phone: "",
  pageNum: 0,
  pageSize: 0,
  totalSize: 0,
})

let addUserDialogVisible = ref(false) // 添加图层显示
let editUserDialogVisible = ref(false)  // 编辑图层显示

const AddEditUserFormRules: FormRules = {
  UserName: [{required: true, message: "请输入用户名称", trigger: "blur", min: 4, max: 30}],
  Nickname: [{required: false}],
  RoleId: [{required: true, message: "请选择角色", trigger: "blur"}],
  DeptId: [{required: true, message: "请选择部门", trigger: "blur"}],
  PostId: [{required: true, message: "请选择岗位", trigger: "blur"}],
  Email: [{required: false}],
  PassWord: [{required: true, message: "密码必须输入并满足6~18位", trigger: "blur", min: 5, max: 30}],
  Phone: [{required: false}],
};

// 查询表单的Ref
const queryUserFormRef = ref<FormInstance>();
// add表单ref
const AddUserFormRef = ref<FormInstance>();
// edit表单ref
const EditUserFormRef = ref<FormInstance>();


const resetQueryUserForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getUserListWhere(queryParams)
}

// 打开添加图层. 清空form表单
const openAddUserEvent = () => {
  addUserDialogVisible.value = true
  addUserForm.UserName = ""
  addUserForm.Nickname = ""
  addUserForm.RoleId = ""
  addUserForm.DeptId = ""
  addUserForm.PostId = ""
  addUserForm.PassWord = ""
  addUserForm.Email = ""
}

// 打开编辑图层. 清空form表单
const openEditUserEvent = async <T extends UserListStruct>(row: T): Promise<void> => {
  await getRemoteDeptSet()
  await getRemoteRoleSet()
  await getRemotePostSet()
  editUserForm.UserName = ""
  editUserForm.Nickname = ""
  editUserForm.RoleId = ""
  editUserForm.DeptId = ""
  editUserForm.PostId = ""
  editUserForm.Email = ""
  editUserForm.Id = ""
  editUserForm.Phone = ""

  editUserForm.Id = row.Id
  editUserForm.UserName = row.UserName
  editUserForm.Nickname = row.NickName.String
  editUserForm.RoleId = row.RoleId
  editUserForm.DeptId = row.DeptId
  editUserForm.PostId = row.PostId
  editUserForm.Email = row.Email.String
  editUserForm.Phone = row.Phone.String
  editUserDialogVisible.value = true
}

// 删除行事件, 传参: 1、row数据. 2、查询表单的ref
const deleteDBEvent = async <T extends UserListStruct>(row: T, formE2: FormInstance | undefined): Promise<void> => {
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
    const {data: res} = await api.deleteUser(row)
    if (res.code !== 200) {
      ElMessage.error(res.message)
      deleteLoading.value = false
      return
    }
    deleteLoading.value = false
    ElMessage.success({center: true, message: "删除成功"})
    await resetQueryUserForm(formE2)
  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })


}

const handleSizeChange = (newSize) => {
  if (queryParams.pageSize !== newSize) {
    queryParams.pageSize = newSize;
    queryParams.pageNum = 0;
    getUserList(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.pageNum !== newPage) {
    queryParams.pageNum = newPage
    getUserList(queryParams)
  }
}

const getUserListWhere = (e) => {
  e.pageSize = 0
  e.pageNum = 0
  e.totalSize = 0
  getUserList(e)
}

const getUserList = (async (e: queryParamsStruct) => {
  console.log("get user")
  Loading.value = true
  const {data: res} = await api.getUser(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  //queryList.splice(0, queryList.length, ...res.data.list)
  userList = res.data.list
  e.totalSize = res.data.total
  e.pageNum = res.data.pageNum
  e.pageSize = res.data.pageSize
  Loading.value = false
})

const cancelAddUserFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  addUserDialogVisible.value = false
})

const cancelEditUserFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editUserDialogVisible.value = false
})

const CommitAddUserEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.addUser(addUserForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      addUserDialogVisible.value = false
      cancelAddUserFormClose(formEl) //  清空新增表单
      ElMessage.success({center: true, message: "添加成功"})
      await resetQueryUserForm(formE2) // 清空查询表单,并查询
    }
  })
})

const CommitEditUserEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      editLoading.value = true
      const {data: res} = await api.editUser(editUserForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        editLoading.value = false
        return
      }
      editLoading.value = false
      editUserDialogVisible.value = false
      cancelEditUserFormClose(formEl) //  清空新增表单
      ElMessage.success({center: true, message: "修改成功"})
      await resetQueryUserForm(formE2) // 清空查询表单,并查询
    }
  })
})


const formatUserStatus = (row, column, cellValue) => {
  const selectedType = statusList.find(item => item.value === cellValue);
  return selectedType ? selectedType.label : cellValue;
};


interface RoleSetStruct {
  Id: string
  RoleName: string
}

interface DeptSetStruct {
  Id: string
  DeptName: string
  ParentId: string
  DeptType: string
  CreateTime: string
  ChildDeptTable: DeptSetStruct[]
}

interface PostSetStruct {
  Id: string
  PostName: string
}


let filterRoleSet = reactive<RoleSetStruct[]>([])
let filterDeptSet = reactive<DeptSetStruct[]>([])
let filterPostSet = reactive<PostSetStruct[]>([])

let LoadRoleLoading = ref<boolean>(true);
let LoadDeptLoading = ref<boolean>(true);
let LoadPostLoading = ref<boolean>(true);


// 请求角色数据
const rmRequestRoleSet = visible => {
  if (visible) {
    getRemoteRoleSet()
  }
}

// 请求岗位数据
const rmRequestPostSet = visible => {
  if (visible) {
    getRemotePostSet()
  }
}

// 请求角色数据api
const getRemoteRoleSet = async () => {
  LoadRoleLoading.value = true
  const {data: res} = await api.getRoleSetDropDown()
  if (res.code !== 200) {
    LoadRoleLoading.value = false
    ElMessage.error(res.message)
    return
  }

  filterRoleSet.splice(0, filterRoleSet.length)
  for (let i = 0; i < res.data.list.length; i++) {
    filterRoleSet.push(res.data.list[i])
  }

  LoadRoleLoading.value = false
  console.log("filterRoleSet: ", filterRoleSet.length)
}

// 请求部门数据api
const getRemoteDeptSet = async () => {
  console.log("go getRemoteDeptSet")
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

  LoadDeptLoading.value = false
}

// 请求岗位数据api
const getRemotePostSet = async () => {
  LoadPostLoading.value = true
  const {data: res} = await api.getPostSetDropDown()
  if (res.code !== 200) {
    LoadPostLoading.value = false
    ElMessage.error(res.message)
    return
  }

  filterPostSet.splice(0, filterPostSet.length)
  for (let i = 0; i < res.data.list.length; i++) {
    filterPostSet.push(res.data.list[i])
  }
  LoadPostLoading.value = false
}

/*const checkAll = ref(false)
const indeterminate = ref(false)
const value = ref<CheckboxValueType[]>([])
const cities = ref([
  {
    value: 'Beijing',
    label: 'Beijing',
  },
  {
    value: 'Shanghai',
    label: 'Shanghai',
  },
])

watch(value, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === cities.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    value.value = cities.value.map((_) => _.value)
  } else {
    value.value = []
  }
}*/

onMounted(() => {
  getUserList(queryParams)
})


</script>

<style scoped>
.custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}
</style>