<template>
  <el-card body-style="padding:15px; margin-top:5px;">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryProjectFormRef" label-width="70px">
      <el-form-item label="项目名" prop="projectName">
        <el-input id="projectName" class="searchList" placeholder="输入项目名" clearable v-model="queryParams.projectName" @keydown.enter.capture="getProjectListWhere(queryParams)"/>
      </el-form-item>

      <el-form-item label="所属人" prop="projectPerson">
        <el-input id="projectPerson" class="searchList" placeholder="输入所属人" clearable v-model="queryParams.projectPerson" @keydown.enter.capture="getProjectListWhere(queryParams)"/>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="getProjectListWhere(queryParams)">搜索</el-button>
      <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetQueryProjectForm(queryProjectFormRef)">重置</el-button>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <div style="display: none;" v-permission="PermCodeAddProject">
        <el-row :gutter="10" class="mb8" style="margin-bottom: 15px;">
          <el-col :span="1.5">
            <el-button plain type="primary" size="small" icon="CirclePlus" @click="openAddProjectEvent" :loading="Loading">新增</el-button>
          </el-col>
        </el-row>
      </div>

      <el-form :inline="true">
        <el-table size="small" v-loading="Loading" border stripe :data="projectList" style="width: 100%;"
                  :header-cell-style="headerCellStyle" @cell-click="CopyText">
          <el-table-column label="ID" prop="Id" v-if="false"/>
          <el-table-column fixed label="项目组" prop="ProjectName" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column fixed label="所属人" prop="ProjectPerson.String" min-width="120" width="auto" :sortable="true" :sort-orders="sortOrders"/>
          <el-table-column label="备注" prop="Note.String" width="400"/>
          <el-table-column label="更多操作" fixed="right" min-width="120" width="auto">
            <template v-slot="scope">
              <div class="button-container">
                <div style="display: none" v-permission="PermCodeEditProject">
                  <el-button plain type="primary" size="small" :loading="editLoading" icon="Edit" @click="openEditProjectEvent(scope.row)">编辑</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeDeleteProject">
                  <el-button plain type="danger" size="small" :loading="deleteLoading" icon="Delete" @click="deleteDBEvent(scope.row,queryProjectFormRef)">删除</el-button>
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
      <el-dialog v-model="addProjectDialogVisible" title="添加项目组" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false" ref="AddProjectFormRef">
        <el-form :inline="true" ref="AddProjectFormRef" :model="addProjectForm" :rules="AddEditProjectFormRules"
                 class="demo-form-inline" status-icon label-width="100px">

          <el-form-item label="项目名称" prop="ProjectName">
            <el-input v-model="addProjectForm.ProjectName" placeholder="输入项目名称" clearable/>
          </el-form-item>
          <el-form-item label="所属人" prop="ProjectPerson">
            <el-input v-model="addProjectForm.ProjectPerson" placeholder="输入项目所属人" clearable/>
          </el-form-item>
          <el-row>
            <el-form-item label="备注" prop="Note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="addProjectForm.Note"/>
            </el-form-item>
          </el-row>

          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelAddProjectFormClose(AddProjectFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitAddProjectEvent(AddProjectFormRef,queryProjectFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>


      <!-- 编辑项目表单-->
      <el-dialog v-model="editProjectDialogVisible" title="添加项目组" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="EditProjectFormRef" :model="editProjectForm" :rules="AddEditProjectFormRules"
                 class="demo-form-inline" status-icon label-width="100px">

          <el-form-item label="项目名称" prop="ProjectName">
            <el-input v-model="editProjectForm.ProjectName" placeholder="输入项目名称" clearable/>
          </el-form-item>
          <el-form-item label="所属人" prop="ProjectPerson">
            <el-input v-model="editProjectForm.ProjectPerson" placeholder="输入项目所属人" clearable/>
          </el-form-item>

          <el-row>
            <el-form-item label="备注" prop="Note" style="width: 572px;">
              <el-input type="textarea" :rows="3" placeholder="可选" v-model="editProjectForm.Note"/>
            </el-form-item>
          </el-row>

          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelEditProjectFormClose(EditProjectFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitEditProjectEvent(EditProjectFormRef,queryProjectFormRef)">提交</el-button>
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
import {CopyText} from '@/utils/public.js'
import api from "@/api/index.js";
import {headerCellStyle} from '@/css/base.js'

const router = useRouter();

let PermCodeAddProject = ref<object>({"TargetPerm": '/report/project/add', "CurrentRouter": router.currentRoute.value.path})
let PermCodeEditProject = ref<object>({"TargetPerm": '/report/project/edit', "CurrentRouter": router.currentRoute.value.path})
let PermCodeDeleteProject = ref<object>({"TargetPerm": '/report/project/delete', "CurrentRouter": router.currentRoute.value.path})

const sortOrders = ['ascending', 'descending', null];


interface ValueStruct {
  String: string,
  Valid: boolean,
}

// 项目查询表格对象接口
interface ProjectListStruct {
  Id: string,
  ProjectName: string
  ProjectPerson: ValueStruct
  Note: ValueStruct
}

// 项目查询表格对象
let projectList = reactive<ProjectListStruct[]>([])

// 项目新增表格对象
interface AddEditProjectStruct {
  Id: string,
  ProjectName: string
  ProjectPerson: string
  Note: string
}

let addProjectForm = reactive<AddEditProjectStruct>({Id: "", ProjectName: "", ProjectPerson: "", Note: ""})
let editProjectForm = reactive<AddEditProjectStruct>({Id: "", ProjectName: "", ProjectPerson: "", Note: ""})

let Loading = ref<boolean>(false); // 搜索\重置、新增按钮,表格loading使用
let addLoading = ref<boolean>(false); // 添加弹出层加载按钮
let editLoading = ref<boolean>(false); // 编辑弹出层加载按钮
let deleteLoading = ref<boolean>(false); // 删除按钮加载

// 表单查询接口
interface queryParamsStruct {
  projectName: string,
  projectPerson: string,
  pageNum: number,
  pageSize: number,
  totalSize: number,
}

// 查询表单对象
let queryParams = reactive<queryParamsStruct>({
  projectName: "",
  projectPerson: "",
  pageNum: 0,
  pageSize: 0,
  totalSize: 0,
})

let addProjectDialogVisible = ref(false) // 添加图层显示
let editProjectDialogVisible = ref(false)  // 编辑图层显示

const AddEditProjectFormRules: FormRules = {
  ProjectName: [
    {required: true, message: "请输入项目名称", trigger: "blur", min: 2, max: 8},
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
  ProjectPerson: [
    {required: true, message: "请输入项目所属人", trigger: "blur", min: 2, max: 8},
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
  Note: [{required: false, trigger: "blur", max: 150}],
};

// 查询表单的Ref
const queryProjectFormRef = ref<FormInstance>();
// add表单ref
const AddProjectFormRef = ref<FormInstance>();
// edit表单ref
const EditProjectFormRef = ref<FormInstance>();


const resetQueryProjectForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getProjectListWhere(queryParams)
}

// 打开添加图层. 清空form表单
const openAddProjectEvent = () => {
  addProjectDialogVisible.value = true
  addProjectForm.ProjectName = ""
  addProjectForm.ProjectPerson = ""
  addProjectForm.Id = ""
  addProjectForm.Note = ""
}

// 打开编辑图层. 清空form表单
const openEditProjectEvent = async <T extends ProjectListStruct>(row: T): Promise<void> => {
  editProjectDialogVisible.value = true
  editProjectForm.ProjectName = row.ProjectName
  editProjectForm.ProjectPerson = row.ProjectPerson.String
  editProjectForm.Id = row.Id
  editProjectForm.Note = row.Note.String
}

// 删除行事件, 传参: 1、row数据. 2、查询表单的ref
const deleteDBEvent = async <T extends ProjectListStruct>(row: T, formE2: FormInstance | undefined): Promise<void> => {
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
    const {data: res} = await api.deleteProject(row)
    if (res.code !== 200) {
      deleteLoading.value = false
      ElMessage.error(res.message)
      return
    }
    deleteLoading.value = false
    ElMessage.success({center: true, message: "删除成功"})
    await resetQueryProjectForm(formE2) // 清空查询表单,并查询

  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })


}

const handleSizeChange = (newSize) => {
  if (queryParams.pageSize !== newSize) {
    queryParams.pageSize = newSize;
    queryParams.pageNum = 0;
    getProjectList(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.pageNum !== newPage) {
    queryParams.pageNum = newPage
    getProjectList(queryParams)
  }
}

const getProjectListWhere = (e) => {
  e.pageSize = 0
  e.pageNum = 0
  e.totalSize = 0
  getProjectList(e)
}

const getProjectList = (async (e: queryParamsStruct) => {
  console.log("get project")
  Loading.value = true
  const {data: res} = await api.getProject(e)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    return
  }
  //queryList.splice(0, queryList.length, ...res.data.list)
  projectList = res.data.list
  e.totalSize = res.data.total
  e.pageNum = res.data.pageNum
  e.pageSize = res.data.pageSize
  Loading.value = false
})

const cancelAddProjectFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  addProjectDialogVisible.value = false
})

const cancelEditProjectFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editProjectDialogVisible.value = false
})

const CommitAddProjectEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.addProject(addProjectForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      addProjectDialogVisible.value = false
      formEl.resetFields() //  清空新增表单
      ElMessage.success({center: true, message: "添加成功"})
      await resetQueryProjectForm(formE2) // 清空查询表单,并查询
    }
  })
})

const CommitEditProjectEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      editLoading.value = true
      const {data: res} = await api.editProject(editProjectForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        editLoading.value = false
        return
      }

      editLoading.value = false
      editProjectDialogVisible.value = false
      formEl.resetFields() //  清空更新表单
      ElMessage.success({center: true, message: "修改成功"})
      await resetQueryProjectForm(formE2) // 清空查询表单,并查询
    }
  })
})

onMounted(() => {
  getProjectList(queryParams)
})


</script>

<style scoped>

</style>
