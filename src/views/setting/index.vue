<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="addRoleFn">新增角色</el-button>
            </el-row>
            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table :data="rolesList" border style="width: 100%">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column label="角色名" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRoles(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination :current-page="query.page" :page-sizes="[10, 15, 20, 25]" :page-size="query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </el-tab-pane>
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon :closable="false" />
            <el-form :model="companyInfo" label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyInfo.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInfo.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyInfo.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width: 400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 新增弹框 -->
      <el-dialog :title="isEdit ? '编辑角色' : '新增角色'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="showDialog" @close="colseDialogFn">
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancleRoles">取消</el-button>
            <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolesAPI, getCompanyInfoAPI, addRolesAPI, getRolesInfoAPI, editRolesAPI, deleRolesAPI } from '@/api'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'first',
      query: {
        page: 1, // 当前页面
        pagesize: 10 // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      companyInfo: {}, // 公司信息
      showDialog: false, // 控制弹框的隐藏和展示
      // 添加角色
      roleForm: {
        name: '',
        description: ''
      },
      // 添加角色验证
      roleRules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      isEdit: false // 对话框编辑状态
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRolesListFn()
    this.getCompanyInfoFn()
  },
  methods: {
    // 每页显示的条数发生改变时触发
    handleSizeChange(newPageSize) {
      this.query.pagesize = newPageSize
      this.getRolesListFn()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getRolesListFn()
    },

    // 设置角色
    setRoles() {},

    // 编辑角色
    async editRoles(row) {
      this.isEdit = true
      this.showDialog = true
      const res = await getRolesInfoAPI(row.id)
      this.roleForm = res.data
    },

    // 删除角色
    async delRoles(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (this.rolesList.length === 1) {
            this.query.page--
            if (this.query.page === 0) {
              this.query.page = 1
            }
          }
          const res = await deleRolesAPI(row.id)
          this.$message.success(res.message)
          this.getRolesListFn()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取角色数据方法
    async getRolesListFn() {
      const { data: res } = await getRolesAPI(this.query)
      console.log(res)
      this.rolesList = res.rows
      this.total = res.total
    },
    // 根据用户id获取用户公司信息方法
    async getCompanyInfoFn() {
      const res = await getCompanyInfoAPI(this.companyId)
      this.companyInfo = res.data
    },
    // 角色弹框-> 确定按钮
    roleSubmit() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            const res = await editRolesAPI(this.roleForm)
            this.$message.success(res.message)
          } else {
            const res = await addRolesAPI(this.roleForm)
            console.log(res)
            this.$message.success(res.message)
          }
          this.showDialog = false
          this.getRolesListFn()
        }
      })
    },

    // 角色弹框-> 取消按钮
    cancleRoles() {
      this.showDialog = false
    },
    // 新增角色按钮事件
    addRoleFn() {
      this.isEdit = false
      this.showDialog = true
    },
    // 关闭对话框回调
    colseDialogFn() {
      this.$refs.roleForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
