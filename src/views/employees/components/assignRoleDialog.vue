<template>
  <div>
    <!-- 渲染角色列表 -->
    <el-checkbox-group v-model="checkRolesList">
      <el-checkbox v-for="item in allRolesList" :key="item.id" :label="item.id">
        <span>{{ item.name }}</span>
      </el-checkbox>
    </el-checkbox-group>

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirmFn"> 确定</el-button>
        <el-button size="small" @click="cancleDialog">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignRole',
  props: {
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    },
    // 所有角色
    allRolesList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkRolesList: []
    }
  },
  methods: {
    // 取消弹框
    cancleDialog() {
      this.$emit('update:show', false)
    },
    confirmFn() {
      this.$emit('addRolesEv', this.checkRolesList)
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
