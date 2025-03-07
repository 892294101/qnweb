<template>
  <el-card body-style="padding:15px; margin-top:5px;">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryRoleFormRef" label-width="70px" @submit.native.prevent>
      <el-form-item label="角色" prop="RoleName">
        <el-input id="RoleName" class="searchList" placeholder="输入角色" clearable v-model="queryParams.RoleName" @keydown.enter.capture="getRoleListWhere(queryParams)"/>
      </el-form-item>
      <el-form :inline="true">
        <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="getRoleListWhere(queryParams)">搜索</el-button>
        <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetQueryRoleForm(queryRoleFormRef)">重置</el-button>
      </el-form>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <div style="display: none;" v-permission="PermCodeAddRole">
        <el-row :gutter="10" class="mb8" style="margin-bottom: 15px;">
          <el-col :span="1.5">
            <el-button plain type="primary" size="small" icon="CirclePlus" @click="openAddRoleEvent" :loading="Loading">新增</el-button>
          </el-col>
        </el-row>
      </div>

      <el-form :inline="true">
        <el-table size="small" v-loading="Loading" border stripe :data="roleList" style="width: 100%;"
                  :header-cell-style="headerCellStyle" @cell-click="CopyText">
          <el-table-column label="ID" prop="Id" v-if="false"/>
          <el-table-column label="角色" prop="RoleName" min-width="120" width="auto"/>
          <el-table-column label="创建时间" prop="CreateTime" min-width="220" width="auto"/>
          <el-table-column label="更多操作" fixed="right" min-width="130" width="auto">
            <template v-slot="scope">
              <div class="button-container">
                <div style="display: none" v-permission="PermCodeEditRole">
                  <el-button plain type="primary" size="small" :loading="editLoading" icon="Edit" @click="openEditRoleEvent(scope.row)">编辑</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeACLRole">
                  <el-button plain type="primary" size="small" :loading="aclLoading" icon="User" @click="ACLRoleEvent(scope.row)">分配</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeDeleteRole">
                  <el-button plain type="danger" size="small" :loading="deleteLoading" icon="Delete" @click="deleteDBEvent(scope.row,queryRoleFormRef)">删除</el-button>
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
      <el-dialog v-model="addRoleDialogVisible" title="添加角色" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false" ref="AddRoleFormRef">
        <el-form :inline="true" ref="AddRoleFormRef" :model="addRoleForm" :rules="AddEditRoleFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="角色名称" prop="RoleName">
            <el-input v-model="addRoleForm.RoleName" placeholder="输入角色名称" clearable/>
          </el-form-item>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelAddRoleFormClose(AddRoleFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitAddRoleEvent(AddRoleFormRef,queryRoleFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>


      <!-- 编辑表单-->
      <el-dialog v-model="editRoleDialogVisible" title="编辑角色" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="EditRoleFormRef" :model="editRoleForm" :rules="AddEditRoleFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="角色" prop="RoleName">
            <el-input v-model="editRoleForm.RoleName" placeholder="输入岗位名称" clearable/>
          </el-form-item>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelEditRoleFormClose(EditRoleFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitEditRoleEvent(EditRoleFormRef,queryRoleFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>
      <!--分配权限-->
      <el-dialog title="分配权限" v-model="aclDialogVisible" :show-close="false">
        <div class="align-right-all-checked">
          <el-button id="allChecked" size="small" :loading="aclLoading" :type="allCheckType" :icon="allCheckIcon" circle @click.native.stop="allChecked"/>
        </div>
        <div class="Permission-Assignment ">
          <el-tree class="Permission-Assignment-tree"
                   :data="menuList"
                   :props="treeProps"
                   :default-checked-keys="BaseRoleAclList"
                   show-checkbox
                   node-key="Id"
                   ref="treeRef"
                   check-strictly
                   default-expand-all @check-change="handleNodeCheck">
          </el-tree>
        </div>

        <el-row class="align-right">
          <div class="dialog-footer">
            <div class="dialog-buttons-left">
              <el-button size="small" :loading="aclLoading" @click="aclDialogVisible = false">取 消</el-button>
              <el-button size="small" :loading="aclLoading" type="primary" @click="saveAclMenuList">保 存</el-button>
            </div>
          </div>
        </el-row>
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

const router = useRouter();


let PermCodeAddRole = ref<object>({"TargetPerm": '/base/role/add', "CurrentRouter": router.currentRoute.value.path})
let PermCodeEditRole = ref<object>({"TargetPerm": '/base/role/edit', "CurrentRouter": router.currentRoute.value.path})
let PermCodeDeleteRole = ref<object>({"TargetPerm": '/base/role/delete', "CurrentRouter": router.currentRoute.value.path})
let PermCodeACLRole = ref<object>({"TargetPerm": '/base/role/acl', "CurrentRouter": router.currentRoute.value.path})


interface ValueStruct {
  String: string,
  Valid: boolean,
}

// 项目查询表格对象接口
interface RoleListStruct {
  Id: string
  RoleName: string
  CreateTime: string
}

// 项目查询表格对象
let roleList = reactive<RoleListStruct[]>([])

// 项目新增表格对象
interface AddEditRoleStruct {
  Id: string
  RoleName: string
}

interface aclMenuList {
  Id: string
  MenuName: string
  ParentId: string
  MenuType: string
  ChildMenuTable: aclMenuList[]
}

let addRoleForm = reactive<AddEditRoleStruct>({Id: "", RoleName: ""})
let editRoleForm = reactive<AddEditRoleStruct>({Id: "", RoleName: ""})

let menuList = reactive<aclMenuList[]>([])
let BaseRoleAclList = reactive<[]>([])
let treeProps = ref({id: 'Id', label: 'MenuName', children: 'ChildMenuTable'})
let checkedNodeKeys = reactive(new Map()) // 新选中的节点
let uncheckedNodeKeys = reactive(new Map()) // 取消选中的节点


let Loading = ref<boolean>(false); // 搜索\重置、新增按钮,表格loading使用
let addLoading = ref<boolean>(false); // 添加弹出层加载按钮
let editLoading = ref<boolean>(false); // 编辑弹出层加载按钮
let deleteLoading = ref<boolean>(false); // 删除按钮加载
let aclLoading = ref<boolean>(false); // 分配按钮加载

let statusList = [
  {value: '1', label: '启用',},
  {value: '0', label: '停用',}
]


interface queryParamsStruct {
  RoleName: String
  pageNum: number,
  pageSize: number,
  totalSize: number,
}

let queryParams = reactive<queryParamsStruct>({
  RoleName: "",
  pageNum: 0,
  pageSize: 0,
  totalSize: 0,
})

let addRoleDialogVisible = ref(false) // 添加图层显示
let editRoleDialogVisible = ref(false)  // 编辑图层显示
let aclDialogVisible = ref(false)  // 分配权限图层显示

const AddEditRoleFormRules: FormRules = {
  RoleName: [{required: true, message: "请输入角色名称", trigger: "blur"}],
};

// 查询表单的Ref
const queryRoleFormRef = ref<FormInstance>();
// add表单ref
const AddRoleFormRef = ref<FormInstance>();
// edit表单ref
const EditRoleFormRef = ref<FormInstance>();

// 分配权限ref
const treeRef = ref<FormInstance>();

let allCheckType = ref("success")
let allCheckIcon = ref("Check")
let allMark = ref<number>(0);
let RoleID = ref<string>("");


const resetQueryRoleForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getRoleListWhere(queryParams)
}

// 打开添加图层. 清空form表单
const openAddRoleEvent = () => {
  addRoleDialogVisible.value = true
  addRoleForm.RoleName = ""
  addRoleForm.Id = ""
}

// 打开编辑图层. 清空form表单
const openEditRoleEvent = async <T extends RoleListStruct>(row: T): Promise<void> => {
  editRoleForm.RoleName = ""
  editRoleForm.Id = ""
  editRoleForm.Id = row.Id
  editRoleForm.RoleName = row.RoleName
  editRoleDialogVisible.value = true
}

const ACLRoleEvent = async <T extends RoleListStruct>(row: T): Promise<void> => {
  RoleID.value = ""
  await getAclMenuList(row)
  RoleID.value = row.Id
  // 分配权限之前, 必须清空选中节点和未选中节点的map
  checkedNodeKeys.clear()
  uncheckedNodeKeys.clear()

  // 初始化全选状态
  allMark.value = 0
  allCheckType.value = "success"
  allCheckIcon.value = "Check"
}


// 删除行事件, 传参: 1、row数据. 2、查询表单的ref
const deleteDBEvent = async <T extends RoleListStruct>(row: T, formE2: FormInstance | undefined): Promise<void> => {
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
    const {data: res} = await api.deleteRole(row)
    if (res.code !== 200) {
      ElMessage.error(res.message)
      deleteLoading.value = false
      return
    }
    deleteLoading.value = false
    ElMessage.success({center: true, message: "删除成功"})
    await resetQueryRoleForm(formE2) // 清空查询表单,并查询
  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })


}

const handleSizeChange = (newSize) => {
  if (queryParams.pageSize !== newSize) {
    queryParams.pageSize = newSize;
    queryParams.pageNum = 0;
    getRoleList(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.pageNum !== newPage) {
    queryParams.pageNum = newPage
    getRoleList(queryParams)
  }
}

const getRoleListWhere = (e) => {
  e.pageSize = 0
  e.pageNum = 0
  e.totalSize = 0
  getRoleList(e)
}

const getRoleList = (async (e: queryParamsStruct) => {
  Loading.value = true
  const {data: res} = await api.getRole(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  //queryList.splice(0, queryList.length, ...res.data.list)
  roleList = res.data.list
  e.totalSize = res.data.total
  e.pageNum = res.data.pageNum
  e.pageSize = res.data.pageSize
  Loading.value = false
})

const getAclMenuList = (async (e: RoleListStruct) => {

  Loading.value = true
  const {data: res} = await api.getAclMenuList(e)
  if (res.code !== 200) {
    Loading.value = false
    ElMessage.error(res.message)
    return
  }
  menuList = []
  BaseRoleAclList = []

  if (res.data.BaseRoleAclList != undefined) {
    for (let i = 0; i < res.data.BaseRoleAclList.length; i++) {
      BaseRoleAclList.push(res.data.BaseRoleAclList[i].MenuId)
    }
  }
  menuList.splice(0, menuList.length, ...res.data.menuList)

  //BaseRoleAclList.splice(0, BaseRoleAclList.length, ...res.data.BaseRoleAclList)
  //menuList = res.data.menuList
  Loading.value = false
  aclDialogVisible.value = true
})

// 保存权限列表
const saveAclMenuList = (async () => {
  Loading.value = true
  aclLoading.value = true

  if (checkedNodeKeys.size !== 0 || uncheckedNodeKeys.size !== 0) {

    let checkedList = {
      Checked: [],
      Unchecked: [],
      RoleID: ""
    }

    for (const key of checkedNodeKeys.keys()) {
      checkedList.Checked.push(`${key}`)
    }

    for (const key of uncheckedNodeKeys.keys()) {
      checkedList.Unchecked.push(`${key}`)
    }

    checkedList.RoleID = RoleID.value

    const {data: res} = await api.saveAclMenuList(checkedList)
    if (res.code !== 200) {
      Loading.value = false
      aclLoading.value = false
      ElMessage.error(res.message)
      return
    }
    aclDialogVisible.value = false
    ElMessage.success({center: true, message: "保存成功"})
  } else {
    ElMessage.warning({center: true, message: "权限列表未改变"})
  }
  Loading.value = false
  aclLoading.value = false
})

const cancelAddRoleFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  addRoleDialogVisible.value = false
})

const cancelEditRoleFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editRoleDialogVisible.value = false
})

const CommitAddRoleEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.addRole(addRoleForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      addRoleDialogVisible.value = false
      cancelAddRoleFormClose(formEl) //  清空新增表单
      ElMessage.success({center: true, message: "添加成功"})
      await resetQueryRoleForm(formE2) // 清空查询表单,并查询
    }
  })
})

const CommitEditRoleEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      editLoading.value = true
      const {data: res} = await api.editRole(editRoleForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        editLoading.value = false
        return
      }
      editLoading.value = false
      editRoleDialogVisible.value = false
      cancelEditRoleFormClose(formEl) //  清空新增表单
      ElMessage.success({center: true, message: "修改成功"})
      await resetQueryRoleForm(formE2) // 清空查询表单,并查询
    }
  })
})


const formatRoleStatus = (row, column, cellValue) => {
  const selectedType = statusList.find(item => item.value === cellValue);
  return selectedType ? selectedType.label : cellValue;
};

// 判断节点在默认选中节点中是否存在
const isNodeExist = ((id: string) => {
  for (let i = 0; i < BaseRoleAclList.length; i++) {
    if (BaseRoleAclList[i] === id) {
      return true
    }
  }
  return false
})

// 三个参数: 当前选中的节点. 节点是否呗选中, 子节点是否被选中
const handleNodeCheck = ((checkedKeys: aclMenuList, checkedNodes, childCheckedNode) => {
  const CurrentAllCheckedNode = treeRef.value.getCheckedKeys()
  let ParentNodeIsChecked = ref<Boolean>(false)

  // 选中
  if (checkedNodes) {
    if (!isNodeExist(checkedKeys.Id)) {
      checkedNodeKeys.set(checkedKeys.Id, checkedKeys.MenuName)
      uncheckedNodeKeys.delete(checkedKeys.Id)
    } else {
      // 如果节点选中. 但是默认中已经存在.
      checkedNodeKeys.delete(checkedKeys.Id)
      uncheckedNodeKeys.delete(checkedKeys.Id)
    }
  } else { // 取消选中
    if (isNodeExist(checkedKeys.Id)) {
      // 如果默认选中的节点中. 存在该节点. 此时节点如果取消选中
      uncheckedNodeKeys.set(checkedKeys.Id, checkedKeys.MenuName) // 放置到未选中
      checkedNodeKeys.delete(checkedKeys.Id) // 而选中的则要清空
    } else {
      // 如果默认选中的节点不存在. 清空所有
      checkedNodeKeys.delete(checkedKeys.Id)
      uncheckedNodeKeys.delete(checkedKeys.Id)
    }
  }

  // 节点选中. 无视是否为0节点 ==== 暂时不用
  /*if (checkedNodes && checkedKeys.ChildMenuTable !== null) {
    for (let i = 0; i < checkedKeys.ChildMenuTable.length; i++) {
      if (checkedKeys.ChildMenuTable[i].MenuType !== '2') {
        //treeRef.value?.setChecked(checkedKeys.ChildMenuTable[i].Id, true, false);
       console.log("childNode: ", checkedKeys.ChildMenuTable[i].Id, checkedKeys.ChildMenuTable[i].MenuType)
      }
    }
  }*/

  // 节点被选中
  if (checkedNodes && checkedKeys.ParentId !== '0') {
    // 根据当前节点的父节点, 查找所有被选中节点中是否有该父节点ID.
    for (const checked of CurrentAllCheckedNode) {
      if (checked === checkedKeys.ParentId) {
        ParentNodeIsChecked.value = true
        break
      }
    }
  }
  // 如果父节点如果没有选中. 那么将自动选中父节点.
  if (checkedNodes && !ParentNodeIsChecked.value && checkedKeys.ParentId !== '0') {
    treeRef.value?.setChecked(checkedKeys.ParentId, true, false);
  }

  // 判断是否取消选中
  if (!checkedNodes) {
    if (checkedKeys.ChildMenuTable !== null) {
      cancelChildNodeChecked(checkedKeys.ChildMenuTable)
    }
  }
})

// 取消所有节点选中
const cancelChildNodeChecked = ((childNode: aclMenuList[]) => {
  for (let i = 0; i < childNode.length; i++) {
    // 如果存在自节点,那么子节点的ID, 需要取消选中.
    treeRef.value?.setChecked(childNode[i].Id, false, true);
    // 如果子节点存在子节点. 那么也需要取消子节点的选中
    if (childNode[i].ChildMenuTable !== null) {
      cancelChildNodeChecked(childNode[i].ChildMenuTable)
    }
  }
})

// 所有节点选中
const executeChecked = ((childNode: aclMenuList[]) => {
  if (childNode !== null) {
    for (let i = 0; i < childNode.length; i++) {
      if (allMark.value === 0) {
        treeRef.value?.setChecked(childNode[i].Id, true, true);
      } else {
        treeRef.value?.setChecked(childNode[i].Id, false, true);
      }
      if (childNode[i].ChildMenuTable !== null) {
        executeChecked(childNode[i].ChildMenuTable)
      }
    }
  }
  /* if (list !== null) {
     for (let i = 0; i < list.length; i++) {
       if (allMark.value === 0) {
         treeRef.value?.setChecked(list[i].Id, true, false);
       } else {
         treeRef.value?.setChecked(list[i].Id, false, false);
       }
       if (list[i].ChildMenuTable !== null) {
         allChecked(list[i].ChildMenuTable)
       }
     }
   }*/
})


const allChecked = (() => {
  Loading.value = true
  aclLoading.value = true
  // 执行选中操作.
  executeChecked(menuList)
  if (allMark.value === 0) {
    allMark.value = 1
    allCheckType.value = "danger"
    allCheckIcon.value = "Delete"
  } else {
    allMark.value = 0
    allCheckType.value = "success"
    allCheckIcon.value = "Check"
  }
  Loading.value = false
  aclLoading.value = false
})


onMounted(() => {
  getRoleList(queryParams)
})


</script>

<style lang="less" scoped>
.Permission-Assignment {
  width: auto;
  height: 50vh;
  display: block;
  overflow-y: scroll;
  background-color: #F5F5F5;

  .Permission-Assignment-tree {
    width: auto;
    height: auto;
    background-color: #F5F5F5;
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
</style>