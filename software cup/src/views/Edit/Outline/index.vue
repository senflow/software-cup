<template>
  <div class="outline__list">
    <h2 class="outline__title">大纲</h2>
    <template v-for="(heading, index) in headings" :key="index">
      <el-popover trigger="click" placement="right">
        <template #reference>
          <span @click="handleHeadingClick(heading)" text class="outline__item"
            :class="`outline__item--${heading.level}`">
            {{ heading.text }}
          </span>
        </template>
      </el-popover>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/store'
import { storeToRefs } from 'pinia'

const editorStore = useEditorStore()
const { headings } = storeToRefs(editorStore)

const handleHeadingClick = (heading) => {
  const { start } = heading
  editorStore.editorInstance.commands.scrollTo({
    pos: start,
    behavior: 'smooth'
  })
}
</script>

<style scoped lang="scss">
.outline__list {
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.outline__title {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.outline__item {
  color: #333;
  cursor: pointer;
  padding: 5px 0;

  &--1 {
    font-size: 1rem;
    font-weight: bold;
    padding-left: 0;
    /* 一级标题与大纲两个字对齐 */
  }

  &--2 {
    padding-left: 10px;
    font-size: 0.9rem;
  }

  &--3 {
    padding-left: 20px;
    font-size: 0.8rem;
  }

  &--4 {
    padding-left: 30px;
    font-size: 0.7rem;
  }

  &--5 {
    padding-left: 40px;
    font-size: 0.6rem;
  }

  &--6 {
    padding-left: 50px;
    font-size: 0.5rem;
  }
}
</style>
