<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <!-- <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small">添加权限</el-button>
        </div> -->
        <PageTools>
          <template #slot-left> <span /> </template>
          <template #slot-right>
            <el-button type="primary" size="small" @click="addPermissionFn(1, '0')">添加权限</el-button>
          </template>
        </PageTools>

        <el-table border class="table" :data="permissionList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button v-if="row.type === 1" type="text" @click="addPermissionFn(2, row.id)">添加</el-button>
              <el-button type="text" @click="editPromissionFn(row.id)">编辑</el-button>
              <el-button type="text" @click="deletePromissionFn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <perDialog ref="PerDialogRef" :is-edit="isEdit" :all-permission-list="allPermissionList" @addPremissionEv="addPerFn" />
    </div>
  </div>
</template>

<script>
import { getPermissionListAPI, addPermissionAPI, getPermissionByIdAPI, updatePermissionAPI, deletePremissionAPI } from '@/api'
import { transTree } from '@/utils'
import perDialog from './components/perDialog.vue'
export default {
  components: {
    perDialog
  },
  data() {
    return {
      permissionList: [], // 权限点列表(树形)，
      allPermissionList: [], // 扁平
      isEdit: false, // 是否编辑状态
      clickPremissionId: ''
    }
  },
  created() {
    this.getPermissionListFn()
  },
  methods: {
    // 获取所有权限点方法
    async getPermissionListFn() {
      const res = await getPermissionListAPI()
      // 扁平权限点数据
      this.allPermissionList = res.data
      // 树形权限点数据
      this.permissionList = transTree(res.data, '0')
    },
    // 添加权限按钮事件
    addPermissionFn(type, id) {
      this.isEdit = false
      this.$refs.PerDialogRef.formData.type = type
      this.$refs.PerDialogRef.formData.pid = id
      this.$refs.PerDialogRef.showPerDialog = true
    },
    // 确定添加事件
    async addPerFn(data) {
      if (this.isEdit) {
        const res = await updatePermissionAPI(this.clickPremissionId, data)
        this.$message.success(res.message)
      } else {
        const res = await addPermissionAPI(data)
        this.$message.success(res.message)
      }
      this.getPermissionListFn()
    },
    // 编辑权限按钮事件
    async editPromissionFn(id) {
      this.isEdit = true
      this.clickPremissionId = id
      const res = await getPermissionByIdAPI(id)
      console.log(res)
      this.$refs.PerDialogRef.formData = res.data
      this.$refs.PerDialogRef.showPerDialog = true
    },
    // 删除权限按钮事件
    async deletePromissionFn(id) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'confirm') {
        const res = await deletePremissionAPI(id)
        this.$message.success(res.message)
      } else {
        this.$message.info('已取消删除')
      }
      this.getPermissionListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-top: 10px;
}
</style>
