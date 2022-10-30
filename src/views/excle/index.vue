<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%; margin-top: 20px">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { importEmployeeAPI } from '@/api'
import { formatExcelDate } from '@/utils'
export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header

      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName',
        聘用形式: 'formOfEmployment'
      }

      const newArr = results.map(obj => {
        const newObj = {}
        const zhKey = Object.keys(obj)

        zhKey.forEach(zhKey => {
          const enKey = userRelations[zhKey]

          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            newObj[enKey] = formatExcelDate(obj[zhKey])
          } else {
            newObj[enKey] = obj[zhKey]
          }
        })
        return newObj
      })
      console.log(newArr)
      const res = await importEmployeeAPI(newArr)
      console.log(res)
      this.$router.back()
      this.$message.success('操作成功')
    }
  }
}
</script>
