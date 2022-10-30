<template>
  <el-upload class="avatar-uploader" action="#" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :http-request="uploadFn">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <el-progress class="progress" v-show="showProgress" type="circle" :percentage="percentage"></el-progress>
  </el-upload>
</template>

<script>
var COS = require('cos-js-sdk-v5')

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'xxxxxxxxxxx',
  SecretKey: 'xxxxxxxxxx'
})
export default {
  data() {
    return {
      imageUrl: '',
      percentage: 0,
      showProgress: false
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadFn(file) {
      this.showProgress = true
      cos.uploadFile(
        {
          Bucket: 'xxxxxxxxxxxx' /* 填写自己的bucket，必须字段 */,
          Region: 'ap-guangzhou' /* 存储桶所在地域，必须字段 */,
          Key: file.file.name /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */,
          Body: file.file, // 上传文件对象
          SliceSize: 1024 * 1024 * 5 /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */,
          onProgress: progressData => {
            console.log(progressData)
            this.percentage = parseInt(progressData.percent * 100)
          }
        },
        (err, data) => {
          console.log(data)
          if (err) {
            this.$message.error('上传图片失败')
          } else {
            this.imageUrl = 'http://' + data.Location
            this.showProgress = false
            this.$message.success('上传图片成功')
          }
        }
      )
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
}
</style>
