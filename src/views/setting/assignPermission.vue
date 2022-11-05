<template>
  <div>
    <el-tree ref="tree" :data="permissionList" :props="{ label: 'name' }" show-checkbox default-expand-all check-strictly node-key="id" />
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignPermission',
  props: {
    permissionList: {
      type: Array,
      default: _ => []
    },
    permIdsList: {
      type: Array,
      default: () => []
    }
    // roleId: {
    //   type: [Number, String],
    //   required: true
    // }
  },
  data() {
    return {}
  },
  watch: {
    permIdsList() {
      this.$refs.tree.setCheckedKeys(this.permIdsList)
    }
  },
  created() {
    console.log(this.roleId)
  },
  methods: {
    // 取消按钮
    cancelButton() {
      this.$emit('input', false)
    },

    // 设置权限按钮
    setRolesBtn() {
      this.$emit('assignPremEv', this.$refs.tree.getCheckedKeys())
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
