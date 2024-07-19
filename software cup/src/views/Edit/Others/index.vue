<template>
    <div class="outline__list">
        <h2 class="outline__title">图片转文字</h2>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'


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
