<template>
  <div class="login-setting">
    <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top: 30px">
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width: 300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width: 300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updataUserInfoFn">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserStaffPhotoAPI, saveUserDetailByIdAPI } from '@/api'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
      }
    }
  },
  created() {
    this.getUserInfoFn()
  },
  methods: {
    // 获取用户信息方法
    async getUserInfoFn() {
      const { data: res } = await getUserStaffPhotoAPI(this.$route.query.id)
      this.userInfo = res
    },
    // 更新用户姓名、密码方法
    updataUserInfoFn() {
      this.$refs.userForm.validate(async valid => {
        if (!valid) return this.$message.error('请检查姓名和密码')
        const res = await saveUserDetailByIdAPI(this.userInfo)
        this.$message.success(res.message)
        this.getUserInfoFn()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
