<template>
    <el-row class="document-card">
        <el-col :span="4" class="document-info">
            <el-checkbox v-if="checked" class="document-checkbox"></el-checkbox>
            <span class="document-name">{{ name }}</span>
        </el-col>
        <el-col :span="4" class="document-details">{{ recent }}</el-col>
        <el-col :span="4" class="document-details">{{ size }}</el-col>
    </el-row>
</template>

<script>
export default {
    name: "FileCard",
    props: {
        name: String,
        owner: String,
        location: String,
        recent: String,
        size: String,
        checked: Boolean
    }
};
</script>

<style scoped>
.document-card {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    transition: background-color 0.3s ease;
}

.document-card:hover {
    background-color: #f5f5f5;
}

.document-info {
    display: flex;
    align-items: center;
}

.document-checkbox {
    margin-right: 10px;
}

.document-name {
    font-size: 16px;
    font-weight: 600;
}

.document-details {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #666666;
}
</style>
