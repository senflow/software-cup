<template>
  <div class="EditMain" ref="filecont" @mousedown="notsee()">
    <div class="lefttools">
      <Outline @select-heading="goToHeading"></Outline>
    </div>
    <div class="editor">
      <div class="editorcard">
        <div class="toptools">
          <EditorMenu :editor="editor" />
        </div>
        <div class="editcont">
          <EditorContent @scroll="hasscroll()" @mousemove="mousemove()" @mouseup="selecttext($event)"
            style="padding: 16px; overflow-y: hidden" :editor="editor" />
        </div>
        <div class="bottomcount">
          字数统计: {{ editor?.storage.characterCount.characters() }}
        </div>
      </div>
    </div>
    <div class="righttools">
      <OCR />
      <br />
      <div class="outline__list">
        <h2 class="outline__title">润色</h2>
        <p class="index_p">
          <el-icon>
            <Brush />
          </el-icon>
          选中文字开始润色
          <el-icon>
            <Brush />
          </el-icon>
        </p>
        <el-button class="item" @click="polish()">
          <el-icon>
            <Brush />
          </el-icon>
          润色
        </el-button>
        <h2 class="outline__title">续写</h2>
        <p class="index_p">
          <el-icon>
            <EditPen />
          </el-icon>
          选中文字开始续写
          <el-icon>
            <EditPen />
          </el-icon>
        </p>
        <el-button class="item" @click="continuation()">
          <el-icon>
            <EditPen />
          </el-icon>
          续写
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Brush, EditPen } from '@element-plus/icons-vue';
import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { Editor, EditorContent, useEditor, BubbleMenu } from '@tiptap/vue-3';
import { storeToRefs } from 'pinia'
import Underline from '@tiptap/extension-underline'
// 列表
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
// 代码
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { common, createLowlight } from 'lowlight'
// 字数统计
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import Heading from '@tiptap/extension-heading'
import StarterKit from '@tiptap/starter-kit'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import Placeholder from '@tiptap/extension-placeholder'
import { UndoRound, MoreHorizOutlined } from '@vicons/material'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Outline from './Outline/index.vue'
import OCR from './OCR/index.vue'
// 使用Pinia
import { useEditorStore } from '@/store'
import EditorMenu from './EditorMenu/index.vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus';

import axios from 'axios'

const lowlight = createLowlight()
lowlight.register({ html, ts, css, js })

const aipolish = ref("")
const filecont = ref(null);
const aicontinuation = ref("")
const visiblemenu = ref(false)
const position = ref({
  top: 0,
  left: 0
})
var hasmove = ref(false);
var hisstring: any;
var selection: any;
//进行润色的函数
const polish = () => {
  console.log("Polish button clicked");
  visiblemenu.value = false;
  let formData = new FormData();
  // formData.append("username","xxxxxx");
  // formData.append("key","xxxxxx");
  formData.append("cont", hisstring);
  let url = 'http://120.46.53.94:888/getpolish' //访问后端接口的url
  let method = 'post'
  axios({
    method,
    url,
    data: formData,
  }).then(res => {
    console.log('Response received:', res); // 打印完整响应
    alert(res.data.answer);
    console.log('Processed response:', res.data); // 打印处理后的响应数据
  }).catch(error => {
    console.error('Error during API call:', error); // 捕捉错误并打印
  });
}
//进行aiaireview
const continuation = () => {
  visiblemenu.value = false;
  let formData = new FormData();
  // formData.append("username","123456");
  // formData.append("key","xxxxxxx");
  formData.append("cont", hisstring);
  let url = 'http://120.46.53.94:888/getcontinuation' //访问后端接口的url
  let method = 'post'
  axios({
    method,
    url,
    data: formData,
  }).then(res => {
    alert(res.data.answer)
    console.log(res.data.answer);
  });
}

// 获取选中的文字
const selecttext = (e: MouseEvent) => {
  selection = window.getSelection();
  if (selection != null && hisstring != selection) {
    var content = selection.toString();
    if (content != "") {
      var rect = filecont.value.getBoundingClientRect();
      visiblemenu.value = true
      // alert(e.clientY)
      // alert(e.clientX)
      position.value.top = e.clientY;
      position.value.left = e.clientX;
      hisstring = content
    }
    // alert(content)
  }
  else {
    hisstring = ""
  }
}
//鼠标移动
const mousemove = () => {
  hasmove.value = true;
}
//鼠标点击
const notsee = () => {
  visiblemenu.value = false;
  // selection.value="";
}
const see = () => {
  visiblemenu.value = true;
  // selection.value="";
}
//滚轮滚动
const hasscroll = () => {
  visiblemenu.value = false;
  // window.getSelection().removeAllRanges()
}


const editorStore = useEditorStore()
// 加载headings
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const loadHeadings = () => {
  const headings = [] as any[]
  if (!editor.value) return
  const transaction = editor.value.state.tr
  if (!transaction) return

  editor.value?.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      console.log(pos, node)
      const start = pos
      const end = pos + node.content.size
      // const end = pos + node
      const id = `heading-${headings.length + 1}`
      if (node.attrs.id !== id) {
        transaction?.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          id
        })
      }

      headings.push({
        level: node.attrs.level,
        text: node.textContent,
        start,
        end,
        id
      })
    }
  })

  transaction?.setMeta('addToHistory', false)
  transaction?.setMeta('preventUpdate', true)

  editor.value?.view.dispatch(transaction)
  editorStore.setHeadings(headings)
}

// 滚动到指定的 heading
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
const goToHeading = (id: string) => {
  router.push({ name: 'Editor', params: { id } });
};
// 定义 Props
const props = defineProps({
  documentid: {
    type: String,
    required: true
  }
});
const ydoc = new Y.Doc()
// 使用ref创建可变的响应式引用
// 编辑器初始化
const documentName = props.documentid
new IndexeddbPersistence(documentName, ydoc)
// Splitting the document name into separate parts
const [entityType, entityID] = documentName.split('.')

console.log(entityType) // Output: "article"
console.log(entityID) // Output: "123"
const editor = useEditor({
  content: ``,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5],
      },
    }),
    TaskList,
    TaskItem,
    Placeholder.configure({
      placeholder: '开始输入文本 …'
    }),
    OrderedList,
    BulletList,
    ListItem,
    CharacterCount.configure({
      limit: 10000
    }),
    Collaboration.configure({
      document: ydoc,
      field: 'content',
    })
  ],
  onUpdate({ }) {
    loadHeadings()
    editorStore.setEditorInstance(editor.value)
  },
  onCreate({ }) {
    loadHeadings()
    editorStore.setEditorInstance(editor.value)
  },
  injectCSS: false,

})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      scrollToHeading(newId as string);
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (route.params.id) {
    scrollToHeading(route.params.id as string);
  }
});
</script>

<style>
.index_p {
  font-size: 12px;
}

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

/* .EditMain {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 20% 60% 20%;
} */
/* 没右边黄的 */
.EditMain {
  position: relative;
  width: 98vw;
  height: 98vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.lefttools {
  background-color: rgba(111, 118, 177, 0.6);
  height: 90vh;
  width: 20%;
  padding: 10px;
  margin-top: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;
}

.righttools {
  background-color: rgba(218, 245, 42, 0.8);
  height: 90vh;
  width: 20%;
  margin-top: 20px;
  padding: 10px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.editor {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.editorcard {
  position: relative;
  width: 90%;
  height: 90vh;
  /* 确保编辑器的高度为一屏 */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 16px;
  border: 1px solid rgba(79, 92, 87, 0.4);
  overflow: hidden;
  /* 防止外部滚动条 */
}

.editcont {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  /* 内部滚动 */
  padding: 8px;
}

.toptools {
  background-color: rgba(207, 220, 245, 0.2);
  border-bottom: 1px solid rgba(156, 161, 159, 0.4);
  padding: 8px;
  border-radius: 8px 8px 0 0;
  z-index: 10;
  /* 确保快捷栏在滚动时保持在顶层 */
}

.bottomcount {
  margin-top: 20px;
  background-color: rgba(207, 220, 245, 0.2);
  border-top: 1px solid rgba(156, 161, 159, 0.4);
  padding: 8px;
  text-align: center;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  /* 确保字数统计在滚动时保持在底部 */
}
</style>

<style lang="scss" scoped>
b {
  font-weight: bold;
}

.ProseMirror {
  overflow-y: visible;
}

.ProseMirror p {
  margin: 0;
}

.ProseMirror:focus {
  outline: none;
}

.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content:
    attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap {
  >*+* {
    margin-top: 0.75em;
  }

  ul {
    padding: 0 2rem;
    list-style: square;
  }

  ol {
    padding: 0 2rem;
    list-style: decimal;
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      >* {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #fbbc88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #b9f18d;
    }

    .hljs-title,
    .hljs-section {
      color: #faf594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70cff8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }
}

.tableWrapper {
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

.contextmenu {
  width: 180px;
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px;
  padding-left: 15px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-columns: 50% 50%;

  .item {
    height: 35px;
    width: 100%;
    line-height: 35px;
    color: rgb(29, 33, 41);
    cursor: pointer;
  }

  .item:hover {
    background: rgb(229, 230, 235);
  }
}
</style>