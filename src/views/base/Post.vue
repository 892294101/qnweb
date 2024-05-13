<template>
  <el-card body-style="padding:15px; margin-top:5px;">
    <!--搜索区域-->
    <el-form :inline="true" :model="queryParams" ref="queryPostFormRef" label-width="70px" @submit.native.prevent>
      <el-form-item label="岗位" prop="PostName">
        <el-input id="PostName" class="searchList" placeholder="输入岗位" clearable v-model="queryParams.PostName" @keydown.enter.capture="getPostListWhere(queryParams)"/>
      </el-form-item>
      <el-form :inline="true">
        <el-button type="primary" size="small" icon="Search" :loading="Loading" @click="getPostListWhere(queryParams)">搜索</el-button>
        <el-button type="primary" size="small" icon="Delete" :loading="Loading" @click="resetQueryPostForm(queryPostFormRef)">重置</el-button>
      </el-form>
    </el-form>
  </el-card>

  <div style="margin-top:5px; ">
    <el-card body-style="padding:15px; margin-top:5px;">
      <div style="display: none;" v-permission="PermCodeAddPost">
        <el-row :gutter="10" class="mb8" style="margin-bottom: 15px;">
          <el-col :span="1.5">
            <el-button plain type="primary" size="small" icon="CirclePlus" @click="openAddPostEvent" :loading="Loading">新增</el-button>
          </el-col>
        </el-row>
      </div>

      <el-form :inline="true">
        <el-table size="small" v-loading="Loading" border stripe :data="postList" style="width: 100%;"
                  :header-cell-style="headerCellStyle" @cell-click="CopyText">
          <el-table-column label="ID" prop="Id" v-if="false"/>
          <el-table-column label="岗位" prop="PostName" min-width="120" width="auto"/>
          <el-table-column label="创建时间" prop="CreateTime" min-width="220" width="auto"/>
          <el-table-column label="更多操作" fixed="right" min-width="80" width="auto">
            <template v-slot="scope">
              <div class="button-container">
                <div style="display: none" v-permission="PermCodeEditPost">
                  <el-button plain type="primary" size="small" :loading="editLoading" icon="Edit" @click="openEditPostEvent(scope.row)">编辑</el-button>
                </div>
                <div style="display: none" v-permission="PermCodeDeletePost">
                  <el-button plain type="danger" size="small" :loading="deleteLoading" icon="Delete" @click="deleteDBEvent(scope.row,queryPostFormRef)">删除</el-button>
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

      <!-- 添加岗位-->
      <el-dialog v-model="addPostDialogVisible" title="添加岗位" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false" ref="AddPostFormRef">
        <el-form :inline="true" ref="AddPostFormRef" :model="addPostForm" :rules="AddEditPostFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="岗位名称" prop="PostName">
            <el-input v-model="addPostForm.PostName" placeholder="输入岗位名称" clearable/>
          </el-form-item>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="addLoading" @click="cancelAddPostFormClose(AddPostFormRef)">取消</el-button>
                <el-button size="small" :loading="addLoading" type="primary" @click="CommitAddPostEvent(AddPostFormRef,queryPostFormRef)">提交</el-button>
              </div>
            </div>
          </el-row>
        </el-form>
      </el-dialog>


      <!-- 修改岗位-->
      <el-dialog v-model="editPostDialogVisible" title="修改岗位" destroy-on-close left width="650" style="border-radius: 4px;" :show-close="false">
        <el-form :inline="true" ref="EditPostFormRef" :model="editPostForm" :rules="AddEditPostFormRules"
                 class="demo-form-inline" status-icon label-width="100px">
          <el-form-item label="岗位" prop="PostName">
            <el-input v-model="editPostForm.PostName" placeholder="输入岗位名称" clearable/>
          </el-form-item>
          <el-row class="align-right">
            <div class="dialog-footer">
              <div class="dialog-buttons-left">
                <el-button size="small" :loading="editLoading" @click="cancelEditPostFormClose(EditPostFormRef)">取消</el-button>
                <el-button size="small" :loading="editLoading" type="primary" @click="CommitEditPostEvent(EditPostFormRef,queryPostFormRef)">提交</el-button>
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

const router = useRouter();


let PermCodeAddPost = ref<object>({"TargetPerm": '/base/post/add', "CurrentRouter": router.currentRoute.value.path})
let PermCodeEditPost = ref<object>({"TargetPerm": '/base/post/edit', "CurrentRouter": router.currentRoute.value.path})
let PermCodeDeletePost = ref<object>({"TargetPerm": '/base/post/delete', "CurrentRouter": router.currentRoute.value.path})


interface ValueStruct {
  String: string,
  Valid: boolean,
}

// 项目查询表格对象接口
interface PostListStruct {
  Id: string
  PostName: string
  CreateTime: string
}

// 项目查询表格对象
let postList = reactive<PostListStruct[]>([])

// 项目新增表格对象
interface AddEditPostStruct {
  Id: string
  PostName: string
}

let addPostForm = reactive<AddEditPostStruct>({Id: "", PostName: ""})
let editPostForm = reactive<AddEditPostStruct>({Id: "", PostName: ""})

let Loading = ref<boolean>(false); // 搜索\重置、新增按钮,表格loading使用
let addLoading = ref<boolean>(false); // 添加弹出层加载按钮
let editLoading = ref<boolean>(false); // 编辑弹出层加载按钮
let deleteLoading = ref<boolean>(false); // 删除按钮加载

let statusList = [
  {value: '1', label: '启用',},
  {value: '0', label: '停用',}
]


interface queryParamsStruct {
  PostName: String
  pageNum: number,
  pageSize: number,
  totalSize: number,
}

let queryParams = reactive<queryParamsStruct>({
  PostName: "",
  pageNum: 0,
  pageSize: 0,
  totalSize: 0,
})

let addPostDialogVisible = ref(false) // 添加图层显示
let editPostDialogVisible = ref(false)  // 编辑图层显示

const AddEditPostFormRules: FormRules = {
  PostName: [{required: true, message: "请输入岗位名称", trigger: "blur"}],
};

// 查询表单的Ref
const queryPostFormRef = ref<FormInstance>();
// add表单ref
const AddPostFormRef = ref<FormInstance>();
// edit表单ref
const EditPostFormRef = ref<FormInstance>();


const resetQueryPostForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getPostListWhere(queryParams)
}

// 打开添加图层. 清空form表单
const openAddPostEvent = () => {
  addPostDialogVisible.value = true
  addPostForm.PostName = ""
}

// 打开编辑图层. 清空form表单
const openEditPostEvent = async <T extends PostListStruct>(row: T): Promise<void> => {
  editPostForm.PostName = ""
  editPostForm.Id = ""
  editPostForm.PostName = row.PostName
  editPostForm.Id = row.Id
  editPostDialogVisible.value = true
}

// 删除行事件, 传参: 1、row数据. 2、查询表单的ref
const deleteDBEvent = async <T extends PostListStruct>(row: T, formE2: FormInstance | undefined): Promise<void> => {
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
    const {data: res} = await api.deletePost(row)
    if (res.code !== 200) {
      ElMessage.error(res.message)
      deleteLoading.value = false
      return
    }
    deleteLoading.value = false
    ElMessage.success({center: true, message: "删除成功"})
    resetQueryPostForm(formE2)
  }).catch(() => {
    ElMessage({type: 'info', message: '取消退出操作', center: true})
  })
}

const handleSizeChange = (newSize) => {
  if (queryParams.pageSize !== newSize) {
    queryParams.pageSize = newSize;
    queryParams.pageNum = 0;
    getPostList(queryParams)
  }
}

const handleCurrentChange = (newPage) => {
  if (queryParams.pageNum !== newPage) {
    queryParams.pageNum = newPage
    getPostList(queryParams)
  }
}

const getPostListWhere = (e) => {
  e.pageSize = 0
  e.pageNum = 0
  e.totalSize = 0
  getPostList(e)
}

const getPostList = (async (e: queryParamsStruct) => {
  Loading.value = true
  const {data: res} = await api.getPost(e)
  if (res.code !== 200) {
    Loading.value = false
    ElMessage.error(res.message)
    return
  }
  postList = res.data.list
  e.totalSize = res.data.total
  e.pageNum = res.data.pageNum
  e.pageSize = res.data.pageSize
  Loading.value = false
})

const cancelAddPostFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  addPostDialogVisible.value = false
})

const cancelEditPostFormClose = ((formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editPostDialogVisible.value = false
})

const CommitAddPostEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      const {data: res} = await api.addPost(addPostForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        addLoading.value = false
        return
      }
      addLoading.value = false
      addPostDialogVisible.value = false
      cancelAddPostFormClose(formEl) //  清空新增表单
      ElMessage.success({center: true, message: "添加成功"})
      await resetQueryPostForm(formE2) // 清空查询表单,并查询
    }
  })
})

const CommitEditPostEvent = (async (formEl: FormInstance | undefined, formE2: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      editLoading.value = true
      const {data: res} = await api.editPost(editPostForm)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        editLoading.value = false
        return
      }
      editLoading.value = false
      editPostDialogVisible.value = false
      cancelAddPostFormClose(formEl) //  清空新增表单
      ElMessage.success({center: true, message: "修改完成"})
      await resetQueryPostForm(formE2) // 清空查询表单,并查询
    }
  })
})


onMounted(() => {
  getPostList(queryParams)
})


</script>

<style scoped>

</style>