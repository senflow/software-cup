import { VueRenderer } from '@tiptap/vue-3' // 使用 Vue 2 版本的 VueRenderer
import tippy from 'tippy.js'

import MentionList from '../components/MentionList.vue'
import { getDocumentByID } from '@/api/api';
import { getAllmember } from '@/api/api';
import { getToken } from '../utils/setToken.js'

export default {
  items: async ({ query }) => {
    try {
      
      const res = await getDocumentByID(getToken('doc_id'));
      
      if (res.data.status === 'success') {
        const teamID = res.data.data.team_id;
        const membersResponse = await getAllmember(teamID);
        if (membersResponse.data.data) {
          const namesArray = membersResponse.data.data.map(member => member.username);
          console.log(namesArray);
          
          // 返回你的数组或者根据业务需要返回其它内容
          return namesArray.filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
        }
      } else {
        // 处理不成功的情况
      }
    } catch (error) {
      console.error(error);
      // 处理错误
    }
  },

  render: () => {
    let component
    let popup


    return {
      onStart: props => {
        component = new VueRenderer(MentionList, {
          parent: this,
          propsData: props,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate: function(props) { // 使用 function 关键字定义函数
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          })
        },
  
        onUpdate(props) {
          component.updateProps(props)
  
          if (!props.clientRect) {
            return
          }
  
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          })
        },
  
        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup[0].hide()
  
            return true
          }
  
          return component.ref?.onKeyDown(props)
        },
  
        onExit() {
          popup[0].destroy()
          component.destroy()
        },
      }
    },
  }