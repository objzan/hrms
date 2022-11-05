<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog :title="isEdit ? '编辑权限点' : '添加权限点'" :rules="rules" :visible="showPerDialog" @close="closePerDialogFn">
    <!-- 表单 -->
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width: 90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width: 90%" />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input v-model="formData.description" style="width: 90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="enterFn">确定</el-button>
        <el-button size="small" @click="cancelFn">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    allPermissionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validName = (rule, value, callback) => {
      let nameList = this.allPermissionList.filter(item => item.pid === this.formData.pid).map(item => item.name)

      if (this.isEdit) {
        nameList = this.allPermissionList.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).map(item => item.name)
      }
      nameList.includes(value) ? callback(new Error(`权限属性${value}已存在`)) : callback()
    }
    const validCode = (rule, value, callback) => {
      let codeList = this.allPermissionList.map(item => item.code)

      if (this.isEdit) {
        codeList = this.allPermissionList.filter(item => item.id !== this.formData.id).map(item => item.code)
      }
      codeList.includes(value) ? callback(new Error(`权限标识${value}已存在`)) : callback()
    }
    return {
      permissionList: [], // 权限管理列表数据
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      },
      showPerDialog: false,
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    closePerDialogFn() {
      this.showPerDialog = false
      // 置空表单
      this.$refs.perForm.resetFields()
      console.log(this.allPermissionList)
    },
    enterFn() {
      this.$refs.perForm.validate(valid => {
        if (valid) {
          this.$emit('addPremissionEv', { ...this.formData })
        }
      })
      this.showPerDialog = false
    },
    cancelFn() {
      this.showPerDialog = false
    }
  }
}
</script>
