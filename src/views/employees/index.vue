<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共19条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button type="danger" size="small" @click="importExcelBtnFn">导入excel</el-button>
          <el-button type="success" size="small" @click="exportExcelBtnFn">导出excel</el-button>
          <el-button type="primary" size="small" @click="showAddDialogFn">新增员工</el-button>
        </template>
      </PageTools>

      <!-- 卡片视图区域 -->
      <el-card style="margin-top: 10px">
        <el-table :data="employeesList" border>
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="staffPhoto">
            <template slot-scope="scope">
              <Image-holder class="staffPhoto" :src="scope.row.staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="工号" prop="workNumber" sortable :sort-method="workNumberSortFn" />
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="hireFormatterFn" />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" :formatter="timeFormatterFn" />
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="lookDetialFn(scope.row.id, scope.row.formOfEmployment)"> 查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small" @click="deleteEmpFn(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination :current-page="query.page" :page-sizes="[10, 15, 20, 25]" :page-size="query.size" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-row>
      </el-card>

      <!-- 添加员工对话框 -->
      <el-dialog title="新增员工" :visible.sync="dialogVisible" width="50%" @close="addEmpDialogCloseFn">
        <empDialogForm ref="addEmpDialogRef" :show-dialog.sync="dialogVisible" :tree-data="treeData" @addEmpEv="addEmpFn" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeListAPI, departmentsListAPI, addEmployeeAPI, deleteEmployeeAPI } from '@/api'
import { transTree } from '@/utils'
import Employees from '@/api/constant/index.js'
import dayjs from 'dayjs'
import empDialogForm from './components/empDialogForm.vue'
export default {
  components: {
    empDialogForm
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      allEmployeesList: [],
      total: 0, // 数据总条数
      hireTypeList: Employees.hireType,
      dialogVisible: false, // 添加对话框显示状态
      treeData: []
    }
  },

  created() {
    this.getEmployeeListFn()
    this.getDepartmentsList()
  },
  methods: {
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getEmployeeListFn()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getEmployeeListFn()
    },

    // 获取员工列表方法
    async getEmployeeListFn() {
      const { data: res } = await getEmployeeListAPI(this.query)
      console.log(res)
      this.employeesList = res.rows
      this.total = res.total

      const { data: allRes } = await getEmployeeListAPI({
        page: 1,
        size: res.total
      })
      this.allEmployeesList = allRes.rows
    },
    hireFormatterFn(row, column, cellValue, index) {
      const obj = this.hireTypeList.find(item => item.id === parseInt(cellValue))
      return obj ? obj.value : '未知'
    },
    // 工号排序方法
    workNumberSortFn(a, b) {
      return parseInt(a.workNumber) - parseInt(b.workNumber)
    },
    // 入职时间格式化方法
    timeFormatterFn(row) {
      return dayjs(row.timeOfEntry).format('YYYY-MM-DD')
    },
    // 添加对话框显示事件
    showAddDialogFn() {
      this.dialogVisible = true
    },
    async getDepartmentsList() {
      const { data: res } = await departmentsListAPI()
      this.treeData = transTree(res.depts, '')
    },
    // 添加员工方法
    async addEmpFn(formData) {
      const res = await addEmployeeAPI(formData)
      this.$message(res.message)
      this.getEmployeeListFn()
    },
    // 添加表单对话框关闭事件
    addEmpDialogCloseFn() {
      this.$refs.addEmpDialogRef.$refs.addForm.resetFields()
    },
    // 删除员工方法
    async deleteEmpFn(id) {
      const comfirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (comfirmResult === 'cancel') return this.$message.info('您取消了删除')
      const res = await deleteEmployeeAPI(id)
      this.$message.success(res.message)
      // 解决分页问题
      if (this.employeesList.length === 1) {
        this.query.page--
        if (this.query.page <= 0) {
          this.query.page = 1
        }
      }
      this.getEmployeeListFn()
    },
    // 导入Excel按钮事件
    importExcelBtnFn() {
      this.$router.push('/excel')
    },
    // 导出Excel按钮事件
    exportExcelBtnFn() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '姓名', '头像', '手机号', '工号', '聘用形式', '部门', '入职时间']

        const zhEmpObj = {
          姓名: 'username',
          头像: 'staffPhoto',
          手机号: 'mobile',
          工号: 'workNumber',
          聘用形式: 'formOfEmployment',
          部门: 'departmentName',
          入职时间: 'timeOfEntry'
        }

        // 遍历员工信息列表
        const data = this.allEmployeesList.map((empObj, index) => {
          // 定义空数组
          const newArr = []
          // 遍历Excel头部数组
          tHeader.forEach(zhKey => {
            // 判断是否是序号
            if (zhKey === '序号') {
              // 如果是则索引值 + 1
              newArr.push(index + 1)
            } else {
              // 把zhEmpObj值赋值给enkey
              const enKey = zhEmpObj[zhKey]
              // 把员工信息列表对象对应enKey的值赋值给value
              const value = empObj[enKey]
              // 格式化导出聘用形式
              if (enKey === 'formOfEmployment') {
                const obj = this.hireTypeList.find(item => item.id === parseInt(value))
                newArr.push(obj ? obj.value : '未知')
              } else {
                newArr.push(value)
              }
            }
          })
          return newArr
        })

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '员工信息',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    lookDetialFn(id, formOfEmployment) {
      this.$router.push(`/employees/detail?id=${id}&form=${formOfEmployment}`)
    }
  }
}
</script>

<style lang="scss" scoped></style>
