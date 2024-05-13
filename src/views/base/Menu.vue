<template>
  <el-card>
<!--    <el-form size="mini" :inline="true" :model="queryParams">
      <el-form-item prop="menuName" label="菜单名称">
        <el-input class="searchList" placeholder="请输入菜单名称" clearable size="mini" @keyup.enter.native="handleQuery"
                  v-model="queryParams.menuName"/>
      </el-form-item>
      <el-form-item prop="menuStatus" label="菜单状态">
        <el-select class="searchList" size="mini" placeholder="请选择菜单状态" v-model="queryParams.menuStatus" clearable>
          <el-option v-for="item in menuStatusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addMenuDialogVisible = true" v-authority="['base:menu:add']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠
        </el-button>
      </el-col>
    </el-row>
    <el-table size="mini" border stripe :header-cell-style="{ background: '#eef1f6', color: '#606266' }" v-if="refreshTable"
              v-loading="loading" :data="menuList" row-key="id" :default-expand-all="isExpandAll"
              :tree-props="{ children: 'children' }">
      <el-table-column prop="menuName" label="菜单名称" width="auto" min-width="120"/>
      <el-table-column prop="icon" label="图标" width="auto" min-width="35">
        <template slot-scope="scope">
          <i :class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="auto" min-width="35"/>
      <el-table-column prop="value" label="权限标识" width="auto" min-width="120"/>
      <el-table-column prop="url" label="组件路径" width="auto" min-width="90"/>
      <el-table-column prop="menuType" label="菜单类型" width="auto" min-width="50">
        &lt;!&ndash;                <template slot-scope="scope">
                            <div v-if="scope.row.menuType === 1">目录</div>
                            <div v-else-if="scope.row.menuType === 2" type="success">菜单</div>
                            <div v-else-if="scope.row.menuType === 3" type="danger">按钮</div>
                        </template>&ndash;&gt;
        <template slot-scope="scope">
          <div v-if="scope.row.menuType === 1">目录</div>
          <div v-else-if="scope.row.menuType === 2">菜单</div>
          <div v-else-if="scope.row.menuType === 3">按钮</div>
        </template>
      </el-table-column>
      <el-table-column prop="menuStatus" label="状态" width="auto" min-width="40">
        &lt;!&ndash;                <template slot-scope="scope">
                            <el-tag v-if="scope.row.menuStatus === 2" type="success">启用</el-tag>
                            <el-tag v-else-if="scope.row.menuStatus === 1" type="danger">禁用</el-tag>
                        </template>&ndash;&gt;
        <template slot-scope="scope">
          <div v-if="scope.row.menuStatus === 2">启用</div>
          <div v-else-if="scope.row.menuStatus === 1">禁用</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="auto" min-width="110"/>
      <el-table-column label="更多操作" fixed="right" width="auto" min-width="90">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="showEditMenuDialog(scope.row.id)" v-authority="['base:menu:edit']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleMenuDelete(scope.row)" v-authority="['base:admin:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    &lt;!&ndash;新增菜单&ndash;&gt;
    <el-dialog title="新增菜单" :visible.sync="addMenuDialogVisible" width="30%" @close="addMenuDialogClosed">
      <el-form size="mini" :model="menuForm" :rules="addMenuFormRules" ref="addMenuFormRefForm" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuForm.menuType">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item size="mini" label="上级菜单" prop="parentId" v-if="menuForm.menuType != 1">
              <treeselect :options="treeList" placeholder="请选择上级菜单" v-model="menuForm.parentId"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单图标" prop="icon" v-if="menuForm.menuType != 3">
              <el-select v-model="menuForm.icon">
                <el-option v-for="item in iconList" :key="item.value" :label="item.label"
                           :value="item.value">
                  <i :class="item.value" style="font-size: 25px;"/>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="menuForm.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col v-if="menuForm.menuType != 3">
            <el-form-item label="菜单url" prop="url">
              <el-input v-model="menuForm.url" placeholder="请输入菜单url"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuForm.menuType != 1" label="权限标识" prop="value">
              <el-input v-model="menuForm.value" placeholder="请权限标识" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuForm.menuType != 3" label="显示状态" prop="menuStatus">
              <el-radio-group v-model="menuForm.menuStatus">
                <el-radio :label="1">停用</el-radio>
                <el-radio :label="2">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMenu">确 定</el-button>
        <el-button type="primary" @click="addMenuDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    &lt;!&ndash;修改菜单&ndash;&gt;
    <el-dialog title="修改菜单" :visible.sync="editMenuDialogVisible" width="30%" @close="editMenuDialogClosed">
      <el-form size="mini" :model="menuInfo" :rules="editMenuFormRules" ref="editMenuFormRefForm" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuInfo.menuType">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item size="mini" label="上级菜单" prop="parentId" v-if="menuInfo.menuType != 1">
              <treeselect :options="treeList" placeholder="请选择上级菜单" v-model="menuInfo.parentId"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单图标" prop="icon" v-if="menuInfo.menuType != 3">
              <el-select v-model="menuInfo.icon">
                <el-option v-for="item in iconList" :key="item.value" :label="item.label"
                           :value="item.value">
                  <i :class="item.value" style="font-size: 25px;"/>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuInfo.menuName" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="menuInfo.sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col v-if="menuInfo.menuType != 3">
            <el-form-item label="菜单url" prop="url">
              <el-input v-model="menuInfo.url" placeholder="请输入菜单url"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuInfo.menuType != 1" label="权限标识" prop="value">
              <el-input v-model="menuInfo.value" placeholder="请权限标识" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuInfo.menuType != 3" label="显示状态" prop="menuStatus">
              <el-radio-group v-model="menuInfo.menuStatus">
                <el-radio :label="1">停用</el-radio>
                <el-radio :label="2">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editMenu">确 定</el-button>
        <el-button type="primary" @click="editMenuDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>-->
  </el-card>
</template>

<script>
</script>

<style lang="less" scoped></style>