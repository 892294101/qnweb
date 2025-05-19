<template>
  <el-card body-style="padding:15px; margin-top:5px;">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryPlatformFormRef" label-width="70px">
      <el-form-item label="平台名" prop="PlatformName">
        <el-input id="PlatformName" class="searchList" placeholder="输入平台" clearable v-model="queryParams.PlatformName" @keydown.enter.capture="getPlatformListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="项目组" prop="DeptName">
        <el-input id="DeptName" class="searchList" placeholder="输入项目组" clearable v-model="queryParams.DeptName" @keydown.enter.capture="getPlatformListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="所属人" prop="DeptPerson">
        <el-input id="DeptPerson" class="searchList" placeholder="输入所属人" clearable v-model="queryParams.DeptPerson" @keydown.enter.capture="getPlatformListWhere(queryParams)"/>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="getPlatformListWhere(queryParams)">搜索</el-button>
      <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetQueryPlatformForm(queryPlatformFormRef)">重置</el-button>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <div style="display: none;" v-permission="PermCodeAddPlatform">
        <el-row :gutter="10" class="mb8" style="margin-bottom: 15px; ">
          <el-col :span="1.5">
            <el-button plain type="primary" size="small" icon="CirclePlus" @click="openAddPlatformEvent" :loading="Loading">新增</el-button>
          </el-col>
        </el-row>
      </div>

      <el-form :inline="true">
        <el-table size="small" v-loading="Loading" border stripe :data="platformList" style="width: 100%;"
                  :header-cell-style="headerCellStyle" @cell-click="CopyText">
          <el-table-column label="ID" prop="Id" v-if="false"/>
          <el-table-column label="项目名" prop="DeptName" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="平台名" prop="PlatformName" min-width="300" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="所属人" prop="DeptPerson" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="创建时间" prop="CreateTime" min-width="200" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="备注" prop="Note.String" width="250"/>
          <el-table-column label="更多操作" fixed="right" min-width="150" width="auto">
            <template v-slot="scope">
              <div class="button-container">
                <div style="display: none" v-permission="PermCodeEditPlatform">
                  <el-button plain type="primary" size="small" :loading="editLoading" icon="Edit" @click="openEditPlatformEvent(scope.row)">编辑</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeDeletePlatform">
                  <el-button plain type="danger" size="small" :loading="deleteLoading" icon="Delete" @click="deletePlatformEvent(scope.row,queryPlatformFormRef)">删除</el-button>
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
      <el-dialog v-model="addPlatformDialogVisible" title="添加平台" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="AddPlatformFormRef" :model="addPlatformForm" :rules="AddEditPlatformFormRules"
                 class="demo-form-inline" status-icon label-width="100px">

          <el-form-item label="平台名称" prop="PlatformName">
            <el-input v-model="addPlatformForm.PlatformName" placeholder="输入平台名称" clearable/>
          </el-form-item>

          <el-form-item label="项目名称" prop="ProjectId">
            <ProjectDropDown v-model="addPlatformForm.ProjectId"></ProjectDropDown>
          </el-form-item>

          <el-row>
            <el-form-item label="备注" prop="Note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="addPlatformForm.Note"/>
            </el-form-item>
          </el-row>

          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelPlatformAddFormClose(AddPlatformFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitPlatformAddEvent(AddPlatformFormRef,queryPlatformFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>


      <!-- 编辑项目表单-->
      <el-dialog v-model="editPlatformDialogVisible" title="修改项目组" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="EditPlatformFormRef" :model="editPlatformForm" :rules="AddEditPlatformFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="项目名称" prop="PlatformName">
            <el-input v-model="editPlatformForm.PlatformName" placeholder="输入项目名称" clearable/>
          </el-form-item>
          <el-form-item label="项目名称" prop="ProjectId">
            <ProjectDropDown v-model="editPlatformForm.ProjectId"></ProjectDropDown>
          </el-form-item>
          <el-row>
            <el-form-item label="备注" prop="Note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="addPlatformForm.Note"/>
            </el-form-item>
          </el-row>

          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelPlatformEditFormClose(EditPlatformFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitPlatformEditEvent(EditPlatformFormRef,queryPlatformFormRef)">提交</el-button>
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
import ProjectDropDown from "@/views/components/ProjectDropDown.vue";

const router = useRouter();

const sortOrders = ['ascending', 'descending', null];

let PermCodeAddPlatform = ref<object>({"TargetPerm": '/report/platform/add', "CurrentRouter": router.currentRoute.value.path})
let PermCodeEditPlatform = ref<object>({"TargetPerm": '/report/platform/edit', "CurrentRouter": router.currentRoute.value.path})
let PermCodeDeletePlatform = ref<object>({"TargetPerm": '/report/platform/delete', "CurrentRouter": router.currentRoute.value.path})


interface ValueStruct {
  String: string,
  Valid: boolean,
}

// 项目查询表格对象接口
interface PlatformListStruct {
  Id: string,
  PlatformName: string
  ProjectId: string
  ProjectName: string,
  ProjectPerson: string
  CreateTime: string
  Note: ValueStruct
}

// 项目查询表格对象
let platformList = reactive<PlatformListStruct[]>([])

// 项目新增表格对象
interface AddEditPlatformStruct {
  Id: string,
  PlatformName: string
  ProjectId: string
  Note: string
}

let addPlatformForm = reactive<AddEditPlatformStruct>({Id: "", PlatformName: "", ProjectId: "", Note: ""})
let editPlatformForm = reactive<AddEditPlatformStruct>({Id: "", PlatformName: "", ProjectId: "", Note: ""})

let Loading = ref<boolean>(false); // 搜索\重置、新增按钮,表格loading使用
let addLoading = ref<boolean>(false); // 添加弹出层加载按钮
let editLoading = ref<boolean>(false); // 编辑弹出层加载按钮
let deleteLoading = ref<boolean>(false); // 删除按钮加载

// 表单查询接口
interface queryParamsStruct {
  PlatformName: string,
  DeptName: string,
  DeptPerson: string,
  pageNum: number,
  pageSize: number,
  totalSize: number,
}

// 查询表单对象
let queryParams = reactive<queryParamsStruct>({
  PlatformName: "",
  DeptName: "",
  DeptPerson: "",
  pageNum: 1,
  pageSize: 10,
  totalSize: 0,
})

let addPlatformDialogVisible = ref(false) // 添加图层显示
let editPlatformDialogVisible = ref(false)  // 编辑图层显示

const AddEditPlatformFormRules: FormRules = {
  PlatformName: [
    {required: true, message: "最少2位，最长30位", trigger: "blur", min: 2, max: 30},
    {
      validator: (rule, value, callback) => {
        if (value && /^[\u4e00-\u9fa5a-zA-Z0-9\-\\.]+$/.test(value)) {
          callback();
        } else {
          callback(new Error("仅限中文、字母、数字、-、."));
        }
        /*if (value && /^[\u4e00-\u9fa5\u3040-\u30ff\u3130-\u318f\uac00-\ud7af\w-]*$/.test(value)) {
          callback();
        } else {
          callback(new Error("不能包含特殊符号"));
        }*/
      },
    },
  ],
  ProjectId: [{required: true, message: "请选择项目名称", trigger: "blur"}],
  Note: [{required: false, trigger: "blur", max: 150}],
};

// 查询表单的Ref
const queryPlatformFormRef = ref<FormInstance>();
const AddPlatformFormRef = ref<FormInstance>();
const EditPlatformFormRef = ref<FormInstance>();

const resetQueryPlatformForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  queryParams.totalSize = 0
  getPlatformList(queryParams)
}

// 打开添加图层. 清空form表单
const openAddPlatformEvent = () => {
  addPlatformDialogVisible.value = true
  addPlatformForm.PlatformName = ""
  addPlatformForm.ProjectId = ""
  addPlatformForm.Note = ""
  addPlatformForm.Id = ""
}

// 打开编辑图层. 清空form表单
const openEditPlatformEvent = async <T extends PlatformListStruct>(row: T): Promise<void> => {
  editPlatformDialogVisible.value = true
  editPlatformForm.PlatformName = row.PlatformName
  editPlatformForm.ProjectId = row.ProjectId
  editPlatformForm.Id = row.Id
  editPlatformForm.Note = row.Note.String
}

// 删除行事件, 传参: 1、row数据. 2、查询表单的ref
const deletePlatformEvent = async <T extends PlatformListStruct>(row: T, formE2: FormInstance | undefined): Promise<void> => {
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
    const {data: res} = await api.deletePlatform(row)
    if (res.code !== 200) {
      deleteLoading.value = false
      ElMessage.error(res.message)
      return
    }
    deleteLoading.value = false
    ElMessage.success({center: true, message: "删除成功"})
    await resetQueryPlatformForm(formE2) // 清空查询表单,并查询
  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })


}

const cancelPlatformAddFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  addPlatformDialogVisible.value = false
})

const cancelPlatformEditFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editPlatformDialogVisible.value = false
})

const handleSizeChange = (newSize) => {
  if (queryParams.pageSize !== newSize) {
    queryParams.pageSize = newSize;
    queryParams.pageNum = 1;
    getPlatformList(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.pageNum !== newPage) {
    queryParams.pageNum = newPage
    getPlatformList(queryParams)
  }
}
const getPlatformListWhere = (e) => {
  e.pageSize = 10
  e.pageNum = 1
  e.totalSize = 0
  getPlatformList(e)
}

const getPlatformList = (async (e: queryParamsStruct) => {
  Loading.value = true
  const {data: res} = await api.getPlatform(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  platformList = res.data.list
  e.totalSize = res.data.total
  e.pageNum = res.data.pageNum
  e.pageSize = res.data.pageSize
  Loading.value = false
})


const CommitPlatformAddEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.addPlatform(addPlatformForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      addPlatformDialogVisible.value = false
      formEl.resetFields() //  清空新增表单
      ElMessage.success({center: true, message: "添加成功"})
      await resetQueryPlatformForm(formE2) // 清空查询表单,并查询
    }
  })
})

const CommitPlatformEditEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      editLoading.value = true
      const {data: res} = await api.editPlatform(editPlatformForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        editLoading.value = false
        return
      }

      editLoading.value = false
      editPlatformDialogVisible.value = false
      formEl.resetFields() //  清空更新表单
      ElMessage.success({center: true, message: "修改成功"})
      await resetQueryPlatformForm(formE2) // 清空查询表单,并查询
    }
  })
})

onMounted(() => {
  getPlatformList(queryParams)
})


</script>

<style scoped>

</style>
