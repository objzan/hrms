<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker v-model="userInfo.timeOfEntry" style="width: 300px" type="date" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" readonly @focus="departmentNameFocus" />
            <div v-if="showTree">
              <el-tree :data="departmentsList" :props="{ label: 'name' }" default-expand-all @node-click="handleNodeClick"></el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <Upload-img ref="uploadImgRef" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUserStaffPhotoAPI, saveUserDetailByIdAPI, departmentsListAPI } from '@/api'
import EmployeeEnum from '@/api/constant/index'
import { transTree } from '@/utils'

export default {
  data() {
    return {
      userId: this.$route.query.id,
      EmployeeEnum, // 员工枚举数据
      userInfo: {},
      departmentsList: [], // 组织框架数据列表
      showTree: false // 属性控件显示状态
    }
  },
  created() {
    // 调用获取用户信息的 API
    this.loadUserInfoById()
    // 获取组织框架数据
    this.getDepartmentsListFn()
  },
  methods: {
    async loadUserInfoById() {
      const res = await getUserStaffPhotoAPI(this.userId).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.userInfo = res.data
      // 回显头像
      this.$refs.uploadImgRef.imageUrl = this.userInfo.staffPhoto
      // this.userInfo.formOfEmployment = parseInt(this.$route.query.form)
      // $set()vue内部提供一个专门更新数组/对象某个值（并额外添加数据劫持）
      // 参数1：数组、对象 目标
      // 参数2：下标、属性名
      // 参数3：值
      this.$set(this.userInfo, 'formOfEmployment', parseInt(this.$route.query.form))
    },
    // 更新用户方法
    async saveUser() {
      // 把上传的头像存到userinfo对象发给后台
      this.userInfo.staffPhoto = this.$refs.uploadImgRef.imageUrl
      const res = await saveUserDetailByIdAPI(this.userInfo)
      this.$message.success(res.message)
      this.$router.back()
    },
    // 获取组织框架方法
    async getDepartmentsListFn() {
      const { data: res } = await departmentsListAPI()
      console.log(res)
      this.departmentsList = transTree(res.depts, '')
    },
    // 树形控件点击子节点事件
    handleNodeClick(data) {
      if (data && data.children) {
        return
      }
      this.userInfo.departmentName = data.name
      // this.$set(this.userInfo, 'departmentName', data.name)
      this.showTree = false
    },
    // 部门输入框聚焦事件
    departmentNameFocus() {
      this.showTree = true
    }
  }
}
</script>

<style scoped lang="scss">
.user-info {
  padding-top: 20px;
}
</style>
