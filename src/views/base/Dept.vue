<template>
  <!--  <el-card body-style="padding:15px; margin-top:5px;">
      &lt;!&ndash;搜索区域&ndash;&gt;
      <el-form :inline="true" :model="queryParams" ref="queryDeptFormRef" label-width="70px">
        <el-form-item label="部门" prop="DeptName">
          <el-input id="DeptName" class="searchList" placeholder="输入岗位" clearable v-model="queryParams.DeptName"/>
        </el-form-item>
        <el-form :inline="true">
          <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="getDeptListWhere(queryParams)">搜索</el-button>
          <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetQueryDeptForm(queryDeptFormRef)">重置</el-button>
        </el-form>
      </el-form>
    </el-card>-->


  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <el-row :gutter="10" class="mb8" style="margin-bottom: 15px;">
        <el-col :span="1.5">
          <el-button plain type="info" icon="Sort" size="small" @click="toggleExpandAll" v-loading="Loading"/>
        </el-col>
      </el-row>

      <el-table size="small" border stripe :header-cell-style="headerCellStyle" v-loading="Loading" :data="deptList" row-key="Id"
                :tree-props="{ children: 'ChildDeptTable', hasChildren: 'hasChildren'  }" :default-expand-all="isExpandAll" v-if="refreshTable"
                highlight-current-row filters @row-contextmenu="showMouseMenu" @cell-click="CopyText">
        <el-table-column label="Id" prop="Id" width="auto" min-width="200" v-if="false"/>
        <el-table-column label="部门名称" prop="DeptName" width="auto" min-width="200"/>
        <el-table-column label="父ID" prop="ParentId" width="auto" min-width="100" v-if="false"/>
        <el-table-column label="部门类型" prop="DeptType" min-width="30" width="auto" :formatter="formatDeptType"/>
        <el-table-column label="创建时间" prop="CreateTime" width="auto" min-width="55"/>
      </el-table>


      <!-- 添加表单-->
      <el-dialog v-model="addDeptDialogVisible" title="添加部门" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="AddDeptFormRef" :model="addDeptForm" :rules="AddEditDeptFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="部门名称" prop="DeptName">
            <el-input v-model="addDeptForm.DeptName" placeholder="输入部门名称" clearable/>
          </el-form-item>
          <el-form-item label="部门类型" prop="DeptType">
            <el-select id="DeptType" placeholder="选择部门类型" v-model="addDeptForm.DeptType" clearable>
              <el-option v-for="item in deptType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelAddDeptFormClose(AddDeptFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitAddDeptEvent(AddDeptFormRef,queryDeptFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>


      <!-- 编辑表单-->
      <el-dialog v-model="editDeptDialogVisible" title="修改部门" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="EditDeptFormRef" :model="editDeptForm" :rules="AddEditDeptFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="部门" prop="DeptName">
            <el-input v-model="editDeptForm.DeptName" placeholder="输入部门名称" clearable/>
          </el-form-item>
          <el-form-item label="部门类型" prop="DeptType">
            <el-select id="DeptType" placeholder="选择部门类型" v-model="editDeptForm.DeptType" clearable>
              <el-option v-for="item in deptType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="editLoading" @click="cancelEditDeptFormClose(EditDeptFormRef)">取消</el-button>
                <el-button size="small" :loading="editLoading" type="primary" @click="CommitEditDeptEvent(EditDeptFormRef,queryDeptFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>
    </el-card>
  </div>

</template>


<script lang="ts" setup>
import {nextTick, onBeforeMount, onMounted, reactive, ref} from "vue";
import {ElDialog, ElMessage, ElMessageBox, ElTable, FormInstance, type FormRules} from 'element-plus';
import {useRouter} from 'vue-router'
import api from "@/api";
import {CopyText} from '@/utils/public'
import {CustomMouseMenu} from '@howdyjs/mouse-menu';
import {headerCellStyle} from '@/css/base.js'

const router = useRouter()


interface ValueStruct {
  String: string,
  Valid: boolean,
}

// 查询表格对象接口
interface DeptListStruct {
  Id: string
  DeptName: string
  ParentId: string
  DeptType: string
  CreateTime: string
  ChildDeptTable: DeptListStruct[]
}

// 查询表格对象
let deptList = reactive<DeptListStruct[]>([])
let selectedRow = reactive<DeptListStruct>({ChildDeptTable: [], CreateTime: "", DeptName: "", DeptType: "", Id: "", ParentId: ""});

// 新增表格对象
interface AddEditDeptStruct {
  DeptName: string
  DeptType: string
  BaseDeptName: string
  BaseDeptType: string
  BaseId: string
  BaseParentId: string
}

let addDeptForm = reactive<AddEditDeptStruct>({BaseParentId: "", BaseDeptName: "", BaseDeptType: "", BaseId: "", DeptName: "", DeptType: ""})
let editDeptForm = reactive<AddEditDeptStruct>({BaseParentId: "", BaseDeptName: "", BaseDeptType: "", BaseId: "", DeptName: "", DeptType: ""})

let Loading = ref<boolean>(false); // 搜索\重置、新增按钮,表格loading使用
let editLoading = ref<boolean>(false);
let addLoading = ref<boolean>(false);

let isExpandAll = ref<boolean>(false);
let refreshTable = ref<boolean>(true);

const PermCodeAddDept = "/base/dept/add"
const PermCodeEditDept = "/base/dept/edit"
const PermCodeDeleteDept = "/base/dept/delete"

const deptType = [
  {value: '0', label: '公司',},
  {value: '1', label: '中心',},
  {value: '2', label: '部门',},
  {value: '3', label: '项目',},
  {value: '4', label: '小组',},
]

const formatDeptType = (row, column, cellValue) => {
  const selectedType = deptType.find(item => item.value === cellValue);
  return selectedType ? selectedType.label : cellValue;
};


interface queryParamsStruct {
  DeptName: String
}

let queryParams = reactive<queryParamsStruct>({
  DeptName: ""
})

let menuVisible = ref<boolean>(false);

let addDeptDialogVisible = ref(false) // 添加图层显示
let editDeptDialogVisible = ref(false)  // 编辑图层显示

const AddEditDeptFormRules: FormRules = {
  DeptName: [{required: true, message: "请输入部门名称", trigger: "change"}],
  DeptType: [{required: true, message: "请选择部门类型", trigger: "change"}]
};

// 查询表单的Ref
const queryDeptFormRef = ref<FormInstance>();
// add表单ref
const AddDeptFormRef = ref<FormInstance>();
// edit表单ref
const EditDeptFormRef = ref<FormInstance>();


const resetQueryDeptForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getDeptListWhere(queryParams)
}

// 打开添加图层
const openAddDeptEvent = (row: DeptListStruct, column) => {
  addDeptForm.DeptType = ""
  addDeptForm.DeptName = ""
  addDeptForm.BaseId = ""
  addDeptForm.BaseDeptName = ""
  addDeptForm.BaseDeptType = ""
  addDeptForm.BaseParentId = ""

  addDeptForm.BaseId = row.Id
  addDeptForm.BaseDeptName = row.DeptName
  addDeptForm.BaseDeptType = row.DeptType
  addDeptForm.BaseParentId = row.ParentId
  addDeptDialogVisible.value = true
  console.log(addDeptForm)
}

// 打开编辑图层
const openEditDeptEvent = async <T extends DeptListStruct>(row: T, column): Promise<void> => {
  editDeptForm.DeptType = ""
  editDeptForm.DeptName = ""
  editDeptForm.BaseId = ""
  editDeptForm.BaseDeptName = ""
  editDeptForm.BaseDeptType = ""
  editDeptForm.BaseParentId = ""

  editDeptForm.DeptType = row.DeptType
  editDeptForm.DeptName = row.DeptName
  editDeptForm.BaseId = row.Id
  editDeptForm.BaseDeptName = row.DeptName
  editDeptForm.BaseDeptType = row.DeptType
  editDeptForm.BaseParentId = row.ParentId
  editDeptDialogVisible.value = true
}

const getDeptListWhere = (e) => {
  getDeptList(e)
  refreshTable.value = false
  isExpandAll.value = false
  nextTick(() => {
    refreshTable.value = true
  })
}

const getButtonPermSets = (async (e) => {
  const {data: res} = await api.getButtonPermSets(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }

  for (let i = 0; i < res.data.length; i++) {
    switch (res.data[i].url) {
      case PermCodeAddDept:
        PermSet.set(PermCodeAddDept, false)
        break
      case PermCodeEditDept:
        PermSet.set(PermCodeEditDept, false)
        break
      case  PermCodeDeleteDept :
        PermSet.set(PermCodeDeleteDept, false)
        break
    }
  }
})

const getDeptList = (async (e: queryParamsStruct) => {
  Loading.value = true
  const {data: res} = await api.getDept(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    Loading.value = false
    return
  }
  //queryList.splice(0, queryList.length, ...res.data.list)
  deptList = res.data
  Loading.value = false
})

const cancelAddDeptFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  addDeptDialogVisible.value = false
})

const cancelEditDeptFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editDeptDialogVisible.value = false
})


const CommitAddDeptEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.addDept(addDeptForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      addDeptDialogVisible.value = false
      cancelAddDeptFormClose(formEl) //  清空新增表单
      getDeptListWhere(queryParams)
      ElMessage.success({center: true, message: "添加成功"})

    }
  })
})

const CommitEditDeptEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      editLoading.value = true
      const {data: res} = await api.editDept(editDeptForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        editLoading.value = false
        return
      }
      editLoading.value = false
      editDeptDialogVisible.value = false
      cancelEditDeptFormClose(formEl) //  清空编辑表单
      getDeptListWhere(queryParams)
      ElMessage.success({center: true, message: "修改成功"})

    }
  })
})

const CommitDeleteDeptEvent = ((row: DeptListStruct | undefined, column) => {
  ElMessageBox.confirm(
      '确认删除?',
      'Warning',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
      }
  ).then(async () => {
    const {data: res} = await api.deleteDept(row)
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }

    getDeptListWhere(queryParams)
    ElMessage.success({center: true, message: "删除成功"})
  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })
})


const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })

}


const PermRequestObjectSet = {
  "CurrentRouter": router.currentRoute.value.path,
  "RequestPerms": [PermCodeAddDept, PermCodeEditDept, PermCodeDeleteDept],
}


const PermMap = new Map
PermMap.set("PermCodeAddDept", new Map())

let PermSet = new Map([
  [PermCodeAddDept, true],
  [PermCodeEditDept, true],
  [PermCodeDeleteDept, true],
])


const showMouseMenu = ((row: DeptListStruct | undefined, column, event) => {
  let menuOptions = reactive({
        menuList: [
          {
            label: '新增',
            disabled: PermSet.get(PermCodeAddDept),
            tips: '',
            fn: (row, column) => openAddDeptEvent(row, column)
          },
          {
            label: '删除',
            disabled: PermSet.get(PermCodeDeleteDept),
            tips: '',
            fn: (row, column) => CommitDeleteDeptEvent(row, column)
          },
          {
            label: '编辑',
            disabled: PermSet.get(PermCodeEditDept),
            tips: '',
            fn: (row, column) => openEditDeptEvent(row, column)
          },
          {
            label: '刷新',
            fn: (row, column) => getDeptListWhere(queryParams)
          }
        ]
      }
  )

  const {x, y} = event
  const ctx = CustomMouseMenu({
        el: event.currentTarget,
        params: row,
        menuWidth: 100,
        hasIcon: false,
        customClass: 'custom-howdy-menu', // 通过注入类名实现更多样式效果
        menuWrapperCss: {
          background: '#ffffff',
          borderRadius: '3px',
          padding: '8px 6px',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,.1)',
          lineColor: '#eee',
          lineMargin: '5px 10px',
        },
        menuItemCss: {
          arrowSize: '10px',
          iconFontSize: '18px',
          labelColor: '#5E6370',
          iconColor: '#5E6370',
          height: '25px',
          labelFontSize: '12',
        },
        ...menuOptions
      }
  )

  ctx.show(x, y)
  event.preventDefault()
})

onMounted(() => {
  getDeptList(queryParams)
})

onBeforeMount(() => {
  getButtonPermSets(PermRequestObjectSet)
})


</script>
<style scoped>
.box {
  width: 500px;
  width: min(90vw, 500px);
  height: 500px;
  background: #ffe0e0;
  margin: 0 auto;
}

.text {
  font-size: 12px;
  color: #889;
  padding: 5px;
}
</style>

<style lang="scss">
// 覆盖菜单CSS
.__menu__wrapper.custom-howdy-menu {
  .__menu__item,
  .__menu__sub__item {
    border-radius: 3px;

    &:not(.disabled):hover {
      color: rgb(31, 54, 128) !important;
      background: rgb(98, 166, 255) !important;
    }

    &.delete {
      &:hover {
        color: rgb(216, 94, 94) !important;
        background: rgba(216, 94, 94, 0.2) !important;
      }
    }
  }
}
</style>