<template>
  <div>
    <el-dialog ref="DialogRef" title="提示" :visible.sync="dialogVisible" width="50%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeDialogFn">
      <template>
        <div>
          <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" style="width: 80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item label="部门编码" prop="code">
              <el-input v-model="form.code" style="width: 80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item label="部门负责人" prop="manager">
              <el-select v-model="form.manager" style="width: 80%" placeholder="请选择">
                <el-option v-for="item in employeesList" :key="item.id" :value="item.username" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门介绍" prop="introduce">
              <el-input v-model="form.introduce" style="width: 80%" placeholder="1-300个字符" type="textarea" :rows="3" />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="enterFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    employeesList: {
      type: Array,
      default: () => []
    },
    originList: {
      type: Array,
      default: () => []
    },
    clickDepartId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    }
    // departDetail: {
    //   type: Object,
    //   default: () => ({})
    // }
  },
  data() {
    const validCode = (rules, value, callback) => {
      let codeList = this.originList.map(item => item.code)
      if (this.isEdit) {
        const newArr = this.originList.filter(item => item.code !== this.clickDepartId)
        codeList = newArr.map(item => item.code)
      }
      codeList.includes(value) ? callback(new Error('部门已存在')) : callback()
    }

    const validName = (rules, value, callback) => {
      let nameList = this.originList.filter(item => item.pid === this.clickDepartId).map(item => item.name)

      if (this.isEdit) {
        // 找正在编辑的所有对象
        const obj = this.originList.find(item => (item.id = this.clickDepartId))
        // 编辑对象pid
        const pid = obj.id
        nameList = this.originList.filter(item => item.pid === pid && item.id !== this.clickDepartId).map(item => item.name)
      }
      nameList.includes(value) ? callback(new Error(`部门${value}已存在`)) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'change' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // watch: {
  //   departDetail() {
  //     this.form = this.departDetail
  //   }
  // },
  methods: {
    cancelFn() {
      this.$emit('update:dialogVisible', false)
    },
    enterFn() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          this.$emit('update:dialogVisible', false)
          this.$emit('addDepartEV', { ...this.form })
        }
      })
    },
    closeDialogFn() {
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style></style>
