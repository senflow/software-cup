<template>
  <div class="outline__list">
    <h2 class="outline__title">图片转文字</h2>
    <div class="mainbody">
      <div class="uploadimage">
        <p class="commodity_img">
          <el-upload class="custom-upload" :on-success="handleSuccess" list-type="picture-card" :auto-upload="false"
            :on-change="handleChanges" :before-remove="beforeRemove" :on-preview="handlePictureCardPreview"
            :file-list="fileList" multiple limit="1" name="img">
            <el-icon class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </p>

        <el-dialog v-model="dialogVisible">
          <img w-full class="imageshow" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </div>
      <el-button class="upload-button" type="primary" @click="uploadimg">开始识别</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref<UploadFile[]>([])
const upload_btn = ref(false)
const boxdisplay = ref("show_box")

const handleSuccess = () => {
  upload_btn.value = true;
}

const handleChanges = (img: UploadFile) => {
  fileList.value.push(img)
  boxdisplay.value = "hide_box"
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
}

const beforeRemove = () => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm("此操作将删除该图片, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        boxdisplay.value = "show_box"
        fileList.value = []
        upload_btn.value = false
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
    })
  }
  
  const uploadimg = () => {
    let formData = new FormData()
    console.log(localStorage.getItem('email'))
    formData.append("email", "20101021@buaa.edu.cn")
  
    fileList.value.forEach((file) => {
      formData.append("file", file.raw)
      console.log(file.raw)
    })
  
    let url = 'http://10.193.208.112:5000/uploadimages'
    let method = 'post'
    axios({
      method,
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      fileList.value = []
      upload_btn.value = false
      alert(res.data.text)
      ElMessage({ message: '图片上传成功', type: 'success' })
    })
    .catch(() => {
      ElMessage({ message: '图片上传失败', type: 'error' })
    })
}

</script>

<style scoped>
.outline__list {
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 300px;
}

.outline__title {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.mainbody {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.uploadimage {
  margin-bottom: 20px;
}

.upload-button {
  width: 200px;
}

.headtitle {
  filter: drop-shadow(0 0 2em #646cffaa);
  margin: 0;
}

.hide_box {
  display: none;
}

.show_box {
  display: inline-flex;
}

.imageshow {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>
