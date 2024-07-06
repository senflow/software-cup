<template>
  <div>
    <div class="editor1">

      <div class="editor1__container" v-if="content0">
        <!-- <editor-content class="editor1__content1" :editor="editor" /> -->
        <div class="editor1__content1" style="display: flex; flex-direction: column; align-items: center;">

          <div class="editor1__popover">
            <el-popover placement="left" width="200" trigger="click" :content="popoverContent" size="mini"
              style="float: left; width: 110px; margin-top: 3px;" class="left-pad1">
              <el-button :disabled="isPutDisabled" slot="reference" icon="el-icon-share" size="mini">分享链接</el-button>
            </el-popover>
            <!-- <el-button type="primary" :disabled="isDownloadDisabled" icon="el-icon-edit" @click="download">下载文件</el-button> -->
            <el-button :disabled="isLimitDisabled" icon="el-icon-edit" @click="changelimit" size="mini"
              style="width: 130px;" class="left-pad2">修改权限</el-button>
            <el-button :disabled="isTitleDisabled" @click="upload" icon="el-icon-upload" size="mini"
              style="width: 130px;" class="left-pad3">提交标题</el-button>


            <el-select v-model="value" placeholder="下载文档" @change="handleOptionChange" style="width: 130px;"
              class="no-arrow left-pad4">

              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

        </div>
      </div>
    </div>

    <div class="editor" v-if="editor">
      <el-input class="centered-text-input" placeholder="请输入内容" v-model="input" :disabled="isLiDisabled"
        style=" text-align: center; width: 800px; font-size: 30px;">
      </el-input>
      <menu-bar class="editor__header" :editor="editor" />
      <editor-content class="editor__content" :editor="editor" />
      <div class="editor__footer">
        <div :class="`editor__status editor__status--${status}`">
          <template v-if="true">
            {{ currentEditable }}
            <!-- 权限：可编辑 -->
            <!-- {{ editor.storage.collaborationCursor.users.length }} user{{ editor.storage.collaborationCursor.users.length === 1 ? '' : 's' }} online in {{ room }} -->
          </template>
          <template v-else>
            <!-- 权限：只读 -->
          </template>
        </div>
        <div class="editor__name">
          <!-- <button @click="setName">
            {{ currentUser.name }}
          </button> -->
          <button v-if="currentUser.name">
            {{ currentUser.name }}
          </button>
          <button v-else>
            游客
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { HocuspocusProvider } from '@hocuspocus/provider'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import CharacterCount from '@tiptap/extension-character-count'
import { getToken, setToken } from '../utils/setToken.js'
import Mention from '@tiptap/extension-mention'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import introJs from 'intro.js'
import 'intro.js/introjs.css';
import suggestion from '../utils/suggestion.js'
// import { getLimit } from '@/api/api';

import { changeDocument, getLimit, getDocumentByID, getRole, convertFormat } from '@/api/api';

// import { variables } from '../../variables.js'
// import MenuBar from './MenuBar.vue'

const getRandomElement = list => {
  return list[Math.floor(Math.random() * list.length)]
}


export default {
  components: {
    EditorContent,
  },
  props: ['documentid'],
  // props: {
  //   value: {
  //     type: String,
  //     default: '',
  //   },
  // },

  data() {
    return {
      options: [{
        value: 'option1',
        label: 'PDF'
      }, {
        value: 'option2',
        label: 'Markdown'
      }, {
        value: 'option3',
        label: 'Word'
      },],
      value: '',
      input: '',
      currentUser: JSON.parse(localStorage.getItem('currentUser')) || {
        name: localStorage.getItem('username'),
        color: this.getRandomColor(),
      },
      msg: {
        doc_name: '',
        doc_id: '',
        team_id: '',
        file_format: 'pdf',
        html: ''
      },
      currentEditable: "在线编辑",
      provider: null,
      editor: null,
      status: 'connecting',
      // room: getRandomRoom(),
      msg: {
        doc_template: '',
      },
      content0: false,//是否从后端获取文档标题
      isLiDisabled: true,
      isLimitDisabled: true, // 初始状态为禁用
      isTitleDisabled: true,
      isDownloadDisabled: true,
      isPutDisabled: true,
      content: [],
    }
  },

  // watch: {
  //   value(value) {
  //     // HTML
  //     const isSame = this.editor.getHTML() === value

  //     // JSON
  //     // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

  //     if (isSame) {
  //       return
  //     }

  //     this.editor.commands.setContent(value, false)
  //   },
  // },

  computed: {
    popoverContent() {
      // 获取当前页面的 URL
      const currentUrl = window.location.href;
      // 返回生成的内容
      return `${currentUrl}`;
    },
  },
  mounted() {
    const ydoc = new Y.Doc()
    // Store the Y document in the browser
    new IndexeddbPersistence(this.documentid, ydoc)
    setToken('doc_id', this.documentid);
    const provider = new HocuspocusProvider({
      url: 'ws://23.94.102.135:8002',
      name: this.documentid,
      document: ydoc,
    })

    this.editor = new Editor({
      // content: this.msg.doc_template,
      content: this.msg.doc_template,
      // editorProps: {
      //   attributes: {
      //     class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      //   },
      // },
      extensions: [
        StarterKit.configure({
          history: false,
        }),

        Highlight,
        TaskList,
        TaskItem,

        Collaboration.configure({
          // document: provider.document,
          document: ydoc,
          field: 'summary',
        }),
        // Register the collaboration cursor extension
        CollaborationCursor.configure({
          provider: provider,
          user: this.currentUser,
        }),

        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          renderLabel({ options, node }) {
            return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
          },
          suggestion,
        }),

        CharacterCount.configure({
          limit: 100000,
        }),
      ],
      editable: false,
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML())

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    })
    //this.startIntro()
  },

  async created() {
    try {
      const docResponse = await getDocumentByID(this.documentid);
      if (docResponse.data.status === 'success') {
        this.input = docResponse.data.data.doc_name;
        this.msg.doc_name = docResponse.data.data.doc_name;
      }
      const name = getToken('username');
      const limitResponse = await getLimit(this.documentid, name);
      if (limitResponse.data.status === 'success') {
        this.editor.setEditable(true);
        this.isLiDisabled = false;
        setToken('editable', true);
        this.isDownloadDisabled = false;
        this.isTitleDisabled = false;
      } else {
        this.editor.setEditable(false);
        this.isLiDisabled = true;
        this.isDownloadDisabled = true;
        this.isTitleDisabled = true;
      }

      if (docResponse.data.status === 'success') {
        this.msg.team_id = docResponse.data.data.team_id;
      }
      console.log(name)
      if (name === null) {
        this.isLimitDisabled = true;
        this.isPutDisabled = true;
      }
      else {
        const roleResponse = await getRole(this.msg.team_id, name);
        if (roleResponse.data.status === 'success') {
          if (roleResponse.data.role === 'Creator' || roleResponse.data.role === 'Admin') {
            this.isLimitDisabled = false;
            this.isPutDisabled = false;
          }
        }
      }
      this.content0 = true;

    } catch (error) {
      // 处理错误
      console.error(error);
    }
  },
  // created() {
  //   const name = getToken('username'); // 根据实际情况获取 token

  //   getLimit(this.documentid, name).then(res => {
  //     if (res.data.status === 'success') {
  //       this.editor.setEditable(true);
  //       this.editor.editable = true;
  //       setToken('editable',true)
  //     } else {
  //       this.editor.setEditable(false);
  //     }
  //   });
  // },

  methods: {
    startIntro() {
      //console.log("123321",localStorage.getItem("TeamNewB"))
      if (1) {
        //   intro.complete();
        const intro = introJs();
        intro.onbeforeexit(function () {
          if (confirm("确定结束当前页面教程?") === true) {
            //修改为“已结束teamaside新手教程”
            localStorage.setItem("DocumentNewB", true);
          } else {
            return false;
          }
        });
        intro.setOptions({
          exitOnOverlayClick: false,
          disableInteraction: true,
          steps: [
            {
              element: document.querySelector('.el-icon-share'),
              title: '文件操作',
              intro: '在此处可以进行多种文件操作，满足您的各种需求',
              position: 'bottom'
            },
            {
              element: document.querySelector('.el-icon-edit'),
              title: '文件操作',
              intro: '在此处可以进行多种文件操作，满足您的各种需求',
              position: 'bottom'
            },
            {
              element: document.querySelector('.component-container2'),
              title: '编辑器',
              intro: '灰常好用的编辑器！欢迎使用~',
              position: 'top'
            },],
          //overlayOpacity: 1.0, // 设置遮罩层透明度
          disableInteraction: true, // 禁止用户与遮罩层下方的元素进行交互
        }).start();
        changeyNewB(localStorage.getItem("username"));
      }
    },
    handleOptionChange() {
      // 在这里根据选项的值执行不同的方法
      if (this.value === 'option1') {
        this.methodForOption1();
      } else if (this.value === 'option2') {
        this.methodForOption2();
      } else if (this.value === 'option3') {
        this.methodForOption3();
      }
    },
    methodForOption1() {
      // 处理选项1的逻辑
      this.downloadPdf();
      console.log('选项1被选中');
    },
    methodForOption2() {
      // 处理选项2的逻辑
      this.downloadMd();
      console.log('选项2被选中');
    },
    methodForOption3() {
      // 处理选项3的逻辑
      this.downloadWord();
      console.log('选项3被选中');
    },
    setName() {
      const name = (window.prompt('Name') || '')
        .trim()
        .substring(0, 32)

      if (name) {
        return this.updateCurrentUser({
          name,
        })
      }
    },

    getRandomColor() {
      return getRandomElement([
        '#958DF1',
        '#F98181',
        '#FBBC88',
        '#FAF594',
        '#70CFF8',
        '#94FADB',
        '#B9F18D',
      ])
    },
    downloadPdf() {
      this.msg.doc_id = this.documentid;
      this.msg.file_format = "pdf";
      this.msg.html = this.editor.getHTML();
      console.log(this.editor.getHTML());
      convertFormat(this.msg).then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          // 构建文件下载链接
          const downloadLink = document.createElement('a');
          downloadLink.href = `http://se.leonardsaikou.top/trans_doc/${this.msg.doc_id}.${this.msg.file_format}`;
          downloadLink.download = `document.${this.msg.file_format}`;
          document.body.appendChild(downloadLink);

          // 模拟点击链接来触发下载
          downloadLink.click();

          // 清理 DOM 元素
          document.body.removeChild(downloadLink);

          this.$message({
            type: 'success',
            message: '下载成功'
          });
        } else {
          console.log("fail download")
        }
      }
      )
    },
    downloadWord() {
      this.msg.doc_id = this.documentid;
      this.msg.file_format = "docx";
      this.msg.html = this.editor.getHTML();
      console.log(this.editor.getHTML());
      convertFormat(this.msg).then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          // 构建文件下载链接
          const downloadLink = document.createElement('a');
          downloadLink.href = `http://se.leonardsaikou.top/trans_doc/${this.msg.doc_id}.${this.msg.file_format}`;
          downloadLink.download = `document.${this.msg.file_format}`;
          document.body.appendChild(downloadLink);

          // 模拟点击链接来触发下载
          downloadLink.click();

          // 清理 DOM 元素
          document.body.removeChild(downloadLink);

          this.$message({
            type: 'success',
            message: '下载成功'
          });
        } else {
          console.log("fail download")
        }
      }
      )
    },
    downloadMd() {
      this.msg.doc_id = this.documentid;
      this.msg.file_format = "md";
      this.msg.html = this.editor.getHTML();
      console.log(this.editor.getHTML());
      convertFormat(this.msg).then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          // 构建文件下载链接
          const downloadLink = document.createElement('a');
          downloadLink.href = `http://se.leonardsaikou.top/trans_doc/${this.msg.doc_id}.${this.msg.file_format}`;
          downloadLink.download = `document.${this.msg.file_format}`;
          document.body.appendChild(downloadLink);

          // 模拟点击链接来触发下载
          downloadLink.click();

          // 清理 DOM 元素
          document.body.removeChild(downloadLink);

          this.$message({
            type: 'success',
            message: '下载成功'
          });
        } else {
          console.log("fail download")
        }
      }
      )
    },
    //   download(){
    //   this.msg.doc_id = this.documentid;
    //   this.msg.file_format = "pdf";
    //   this.msg.html = this.editor.getHTML();
    //   console.log(this.editor.getHTML());
    //   convertFormat(this.msg).then(res => {
    //                     console.log(res)
    //                     if (res.data.status === 'success') {
    //                     // 构建文件下载链接
    //                     const downloadLink = document.createElement('a');
    //                     downloadLink.href = `http://se.leonardsaikou.top/trans_doc/${this.msg.doc_id}.${this.msg.file_format}`;
    //                     downloadLink.download = `document.${this.msg.file_format}`;
    //                     document.body.appendChild(downloadLink);

    //                     // 模拟点击链接来触发下载
    //                     downloadLink.click();

    //                     // 清理 DOM 元素
    //                     document.body.removeChild(downloadLink);

    //                         this.$message({
    //                             type: 'success',
    //                             message: '下载成功'
    //                         });
    //                     } else {      
    //                       console.log("fail download")
    //                     }
    //                 }
    //         )
    // },

    upload() {
      // 修改标题
      this.msg.doc_id = this.documentid;
      this.msg.doc_name = this.input;
      changeDocument(this.msg).then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          console.log("change title")
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        } else {
          console.log("fail change title")
        }
      }
      )

    },
    changelimit() {
      // 在这里编写上传的方法逻辑
      // 修改权限
      this.msg.doc_id = this.documentid;
      this.msg.doc_name = '';

      changeDocument(this.msg).then(res => {
        console.log(this.msg)
        console.log(res)
        if (res.data.status === 'success') {
          console.log("change limit")
          getDocumentByID(this.documentid).then(res => {
            if (res.data.status === 'success') {
              console.log("get limit")
              console.log(res.data.data.editable_by_guests)
              if (res.data.data.editable_by_guests === true) {
                this.$message({
                  type: 'success',
                  message: '修改游客权限为可编辑'
                });

              } else {
                this.$message({
                  type: 'success',
                  message: '修改游客权限为只读'
                });
              }
            } else {
              console.log("fail get limit")
            }
          }
          )
        } else {
          console.log("fail change limit")
        }
      }
      )
    },

  },

  beforeDestroy() {
    this.editor.destroy()
    this.provider.destroy()
  },


}
</script>


<style lang="scss" scoped>
.left-pad1 {
  margin-left: 20px;
}

.left-pad2 {
  margin-left: 20px;
}

.left-pad3 {
  margin-left: 20px;
}

.left-pad4 {
  margin-left: 20px;
}

.editor1__container {
  display: flex;
  align-items: center;
  /* 垂直居中 */
}

.editor1__popover {
  // margin-left: auto;
  /* 将 el-popover 推到右侧 */
}

.editor1 {
  background-color: #FFF;
  // border: 3px solid #444242;
  border-radius: 0.75rem;
  color: #0D0D0D;
  display: flex;
  // flex: 1; /* This sets the flex property to 1 */
  flex-direction: column;
  max-height: 26rem;
  // margin: 10px 10px; /* 设置上、左、右的间距 */
  // background-color: hsl(0, 0%, 96%); /* 设置背景色 */
  // background-color: #FFF;
  text-align: left;



  &__content1,
  &__content1 {
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1.25rem 1rem;
    -webkit-overflow-scrolling: touch;

    font-size: 30px;
    font-weight: bold;

    position: relative;
    /* 使得内部元素可以定位 */
  }


  /* Some information about the status */
  &__status {
    align-items: center;
    border-radius: 5px;
    display: flex;

    &::before {
      background: rgba(#0D0D0D, 0.5);
      border-radius: 50%;
      content: ' ';
      display: inline-block;
      flex: 0 0 auto;
      height: 0.5rem;
      margin-right: 0.5rem;
      width: 0.5rem;
    }

    &--connecting::before {
      background: #616161;
    }

    &--connected::before {
      background: #B9F18D;
    }
  }

  &__name {
    button {
      background: none;
      border: none;
      border-radius: 0.4rem;
      color: #0D0D0D;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      padding: 0.25rem 0.5rem;

      &:hover {
        background-color: #0D0D0D;
        color: #FFF;
      }
    }
  }
}


.editor {
  background-color: #FFF;
  border: 3px solid #444242;
  border-radius: 0.75rem;
  color: #0D0D0D;
  display: flex;
  // flex: 1; /* This sets the flex property to 1 */
  flex-direction: column;
  min-height: 80%;
  // max-height: 26rem;
  // margin: 10px 10px; /* 设置上、左、右的间距 */
  background-color: hsl(0, 0%, 96%);
  /* 设置背景色 */
  text-align: left;

  &__header {
    align-items: center;
    background: #0d0d0d;
    border-bottom: 3px solid #0d0d0d;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
  }

  &__content {
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1.25rem 1rem;
    -webkit-overflow-scrolling: touch;
    height: 330px;
  }

  &__footer {
    align-items: center;
    border-top: 3px solid #373636;
    color: #0D0D0D;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    font-size: 12px;
    font-weight: 600;
    justify-content: space-between;
    padding: 0.25rem 0.75rem;
    white-space: nowrap;
  }

  /* Some information about the status */
  &__status {
    align-items: center;
    border-radius: 5px;
    display: flex;

    &::before {
      background: rgba(#0D0D0D, 0.5);
      border-radius: 50%;
      content: ' ';
      display: inline-block;
      flex: 0 0 auto;
      height: 0.5rem;
      margin-right: 0.5rem;
      width: 0.5rem;
    }

    &--connecting::before {
      background: #616161;
    }

    &--connected::before {
      background: #B9F18D;
    }
  }

  &__name {
    button {
      background: none;
      border: none;
      border-radius: 0.4rem;
      color: #0D0D0D;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      padding: 0.25rem 0.5rem;

      &:hover {
        background-color: #0D0D0D;
        color: #FFF;
      }
    }
  }
}

.centered-text-input .el-input__inner {
  text-align: center !important;
}


/* Give a remote user a caret */
.collaboration-cursor__caret {
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  border-radius: 3px 3px 3px 0;
  color: #0D0D0D;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  left: -1px;
  line-height: normal;
  padding: 0.1rem 0.3rem;
  position: absolute;
  top: -1.4em;
  user-select: none;
  white-space: nowrap;
}

.mention {
  border: 1px solid #000;
  border-radius: 0.4rem;
  padding: 0.1rem 0.3rem;
  box-decoration-break: clone;
}

.no-arrow .el-input__suffix {
  display: none;
  /* 隐藏输入框右侧的箭头图标 */
}


/* Basic editor styles */
.tiptap {
  >*+* {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    border-radius: 0.5rem;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  mark {
    background-color: #FAF594;
  }

  img {
    height: auto;
    max-width: 100%;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    border-left: 2px solid rgba(#0D0D0D, 0.1);
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    li {
      align-items: center;
      display: flex;

      >label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      >div {
        flex: 1 1 auto;
      }
    }
  }
}

.ProseMirror:focus {
  outline: none !important;
}
</style>
