<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 卡片组件(分为头部和身体) -->
      <el-card class="box-card">
        <!-- 头部 -->
        <div slot="header" class="clearfix">
          <!-- tab导航 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织导航" name="first">
              <!-- class="tab-pane"设置左右padding, 把内容往中间挤压 -->
              <!-- 使用 Layout 布局绘制头部区域
                最外层一行, 2列
                  el-row: type布局模式
                          justify两端对齐
                          align交叉轴排列方式(垂直方向居中)
               -->
              <el-row type="flex" justify="space-between" align="middle" class="department-header">
                <!-- 第一列20份 -->
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">xxx有限公司</span>
                </el-col>
                <!-- 第二列4份 -->
                <el-col :span="4">
                  <!-- 在容器范围里, 一行再分2列 -->
                  <el-row type="flex" justify="end">
                    <el-col>负责人</el-col>
                    <el-col>
                      <!-- 这个之前在头部导航右侧下拉菜单讲过 -->
                      <el-dropdown>
                        <!-- 下拉菜单文字 -->
                        <span class="el-dropdown-link"> 操作<i class="el-icon-arrow-down el-icon--right" /> </span>
                        <!-- 下拉项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="add()">添加子部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

              <el-tree default-expand-all class="departments-tree" :data="departmentsList" :props="defaultProps" @node-click="handleNodeClick">
                <template #default="{ data }">
                  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
                    <!-- 部门名字 -->
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>
                    <!-- 功能操作区域 -->
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <!-- 两个内容 -->
                        <el-col>{{ data.manager }}</el-col>
                        <el-col>
                          <!-- 下拉菜单 element -->
                          <el-dropdown>
                            <span> 操作<i class="el-icon-arrow-down" /> </span>
                            <!-- 下拉菜单 -->
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                              <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                              <el-dropdown-item v-if="data && !data.children" @click.native="del(data)">删除部门</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>

      <!-- 添加部门对话框 -->
      <departDialog
        ref="departDialog"
        :dialog-visible.sync="showDepartDialog"
        :employees-list="employeesList"
        :origin-list="originList"
        :click-depart-id="clickDepartId"
        :is-edit="isEdit"
        @addDepartEV="addDepartmentsFn"
      />
    </div>
  </div>
</template>

<script>
import { departmentsListAPI, getEmployeeSimpleAPI, addDepartmentsAPI, getDepartDetailAPI, updateDepartmentsAPI, delDepartmentAPI } from '@/api'
import { transTree } from '@/utils'
import departDialog from './components/departDialog.vue'
export default {
  name: 'Departments',
  components: {
    departDialog
  },
  data() {
    return {
      activeName: 'first',
      departmentsList: [],
      // 定义结构显示
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDepartDialog: false,
      employeesList: [],
      clickDepartId: '',
      // departDetail: {}
      isEdit: false,
      originList: []
    }
  },
  created() {
    this.getDepartmentsList()
    this.getEmployeesListFn()
  },
  methods: {
    // 获取部门组织框架数据
    async getDepartmentsList() {
      const { data: res } = await departmentsListAPI()
      this.originList = res.depts.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        pid: item.pid
      }))
      this.departmentsList = transTree(res.depts, '')
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    // 添加子部门方法
    add(data = '') {
      this.isEdit = false
      this.showDepartDialog = true
      if (data) {
        this.clickDepartId = data.id
      } else {
        this.clickDepartId = ''
      }
    },
    // 编辑子部分方法
    async edit(data) {
      this.showDepartDialog = true
      this.clickDepartId = data.id
      const res = await getDepartDetailAPI(data.id)
      // this.departDetail = res.data
      this.$refs.departDialog.form = res.data
      this.isEdit = true
    },
    // 删除部部门方法
    del(data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await delDepartmentAPI(data.id)
          this.$message.success(res.message)
          this.getDepartmentsList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    async getEmployeesListFn() {
      const res = await getEmployeeSimpleAPI()
      console.log(res)
      this.employeesList = res.data
    },

    async addDepartmentsFn(fromObj) {
      if (this.isEdit) {
        const res = await updateDepartmentsAPI(fromObj)
        console.log(res)
      } else {
        fromObj.pid = this.clickDepartId
        const res = await addDepartmentsAPI(fromObj)
        console.log(res)
      }

      this.getDepartmentsList()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }

  .departments-tree {
    margin: 12px 0px;
  }
}
</style>
