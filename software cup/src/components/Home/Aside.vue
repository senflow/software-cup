<template>
    <el-aside width="200px" class="aside">
        <div class="logo">
            <img src="@/assets/img/logo.png" alt="logo" />
            <span>智能编辑器</span>
        </div>

        <el-input v-model="search" placeholder="搜索" class="search-input"></el-input>
        <el-tree style="max-width: 600px" :data="data" :props="defaultProps" @node-click="handleNodeClick" />
    </el-aside>
</template>

<script lang="ts">
export default {
    name: 'Aside',
}
</script>

<script setup lang="ts">
import { ElAside, ElInput, ElTree } from 'element-plus';
import { ref } from 'vue';
interface Tree {
    label: string
    children?: Tree[]
}
const handleNodeClick = (data: Tree) => {
    console.log(data)
}

const data: Tree[] = [
    {
        label: '首页',
        children: [
            {
                label: '我的云文档',
            }, {
                label: '我的收藏',
            },
        ],
    },
    {
        label: '回收站',
    },
    // {
    //     label: '',
    //     children: [
    //         {
    //             label: 'Level two 2-1',
    //         },
    //         {
    //             label: 'Level two 2-2',
    //         },
    //     ],
    // },
]

const defaultProps = {
    children: 'children',
    label: 'label',
}


const search = ref('');

</script>

<style scoped>
.aside {
    padding: 20px;
    background-color: #f5f5f5;
}

.logo {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.logo img {
    height: 24px;
    margin-right: 10px;
}

.logo span {
    font-size: 16px;
    font-weight: bold;
}

.search-input {
    margin-bottom: 20px;
}

.el-menu-vertical-demo {
    border: none;
}
</style>
