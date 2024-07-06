
import service from "../service";
import { getToken } from "../utils/setToken"
//得到团队id相应的全体成员信息
export function getAllmember(id) {
    console.log(id)
    return service({
        method: 'get',
        url: '/v1/tm/get_team_members',
        params: { 'team_id': id },
        headers: {
            'Authorization': `Token ${getToken('token')}`,   //当前token
            //'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}

//查询团队
export function getGroupByID(id) {
    return service({
        method: 'get',
        url: 'v1/tm/get_team',
        params: {
            "team_id": id
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}

//创建团队
export function createteam(data) {
    console.log("create!", data)
    //data = JSON.stringify(data)
    console.log(data)
    return service({
        method: 'put',
        url: '/v1/tm/create_team',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,  //当前token
            //'Authorization':`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`, 
        }
    })
}

//添加成员
export function addmember(data) {
    //data = JSON.stringify(data)
    return service({
        method: 'post',
        url: '/v1/tm/add_team_member',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,  //当前token
            //'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}

//删除成员
export function removememebr(data) {
    //data = JSON.stringify(data)
    console.log(data)
    return service({
        method: 'post',
        url: '/v1/tm/remove_team_member',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,  //当前token
            //'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}

//寻找成员
export function findmember(data) {
    console.log(data)
    return service({
        method: 'get',
        url: '/v1/tm/get_user',
        params: { 'username': data },
        headers: {
            'Authorization': `Token ${getToken('token')}`,  //当前token
            //'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}

//修改成员
export function changemember(data) {
    //data = JSON.stringify(data)
    console.log(data)
    return service({
        method: 'post',
        url: '/v1/tm/set_member_role',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,  //当前token
            //'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}

//获取所在团队
export function allteam(name) {
    console.log('allteamin')
    return service({
        method: 'get',
        url: '/v1/tm/get_teams',
        params: { "username": name },
        headers: {
            'Authorization': `Token ${getToken('token')}`,  //当前token
            //'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}

//team_id和username获取身份
export function gettmrole(id){
    return service({
        method:'get',
        url:'/v1/tm/get_member_role',
        params:{
            "team_id":id,
            "username": localStorage.getItem("username")
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,  //当前token
            //'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}

export function login(data) {
    data = JSON.stringify(data)
    console.log(data)
    return service({
        method: 'post',
        url: '/v1/tm/login',
        data
    })
}

export function regist(data) {
    data = JSON.stringify(data)
    console.log(data)
    return service({
        method: 'post',
        url: '/v1/tm/register',
        data
    })
}
export function sendCode(email) {
    return service({
        method: 'post',
        url: `/v1/tm/verification`,
        params: {
            email
        }
    })
}

export function createProject(formData, token) {
    console.log(formData)
    return service({
        method: 'post',
        url: `/v1/pe/create_project`,
        data: formData,
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data'
        },

    })
}
//修改团队头像
export function changeteamimg(team_id,formData) {
    console.log("changeimgin", formData)
    return service({
        method: 'post',
        url: `/v1/tm/set_team_image`,
        data: formData,
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            'Content-Type': 'multipart/form-data'
        },
        params:{
            team_id
        }
    })
}


//修改个人头像
export function changemeimg(formData){
    return service({
        method: 'put',
        url: `/v1/tm/upload_avatar`,
        data: formData,
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            'Content-Type': 'multipart/form-data'
        },
    })
}

export function modifyProject(formData, token) {
    console.log(formData)
    return service({
        method: 'put',
        url: `/v1/pe/update_project`,
        data: formData,
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data'
        },

    })
}

export function getTeamproject(team_id, token, tag) {
    return service({
        method: 'get',
        url: `/v1/pe/get_team_projects`,
        params: {
            team_id,
            tag: tag
        },
        headers: {
            'Authorization': `Token ${token}`,
        },
    })

}

export function getProjectData(project_id, token) {
    return service({
        method: 'get',
        url: '/v1/pe/get_project',
        params: {
            project_id
        },
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
}

export function deleteProject(project_id, token) {
    project_id = JSON.stringify(project_id)
    console.log(project_id)
    return service({
        method: 'delete',
        url: '/v1/pe/delete_project',
        data: project_id,
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
}

export function recoverProject(project_id, token) {
    project_id = JSON.stringify(project_id)
    console.log(project_id)
    return service({
        method: 'put',
        url: '/v1/pe/restore_project',
        data: project_id,
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
}

export function copyProject(data, token) {
    data = JSON.stringify(data)
    return service({
        method: 'post',
        url: '/v1/pe/copy_project',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        data
    })
}

//设计原型所有接口
export function createPrototype(data, token) {
    return service({
        method: 'post',
        url: '/v1/pe/create_prototype',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data'
        },
        data: data
    })
}

export function getAllPrototype(project_id, tag, token) {
    return service({
        method: 'get',
        url: '/v1/pe/get_project_prototypes',
        params: {
            project_id,
            tag: tag
        },
        headers: {
            'Authorization': `Token ${token}`,
        },
    })
}

export function getPrototypeByID(prototype_id, token) {
    return service({
        method: 'get',
        url: '/v1/pe/get_prototype',
        params: {
            prototype_id
        },
        headers: {
            'Authorization': `Token ${token}`,
        },
    })
}

export function deletePrototype(data, token) {
    data = JSON.stringify(data)
    return service({
        method: 'delete',
        url: '/v1/pe/delete_prototype',
        data,
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
    })
}

export function editPrototype(data, token) {
    return service({
        method: 'put',
        url: '/v1/pe/update_prototype',
        data,
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data'
        },
    })
}

export function recoverPrototype(data, token) {
    data = JSON.stringify(data)
    return service({
        method: 'put',
        url: '/v1/pe/restore_prototype',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        data
    })
}

//演示接口
export function createPreview(data, token) {
    return service({
        method: 'post',
        url: '/v1/pe/save_prototype_preview',
        headers: {
            'Authorization': `Token ${token}`,
        },
        data: data
    })
}

export function getPreview(project_id) {
    return service({
        method: 'get',
        url: '/v1/pe/get_project_prototype_previews',
        params: {
            project_id
        }
    })
}


//获取一个人全部团队
export function getAllTeamByName(name, token) {
    console.log('allteamin')
    return service({
        method: 'get',
        url: '/v1/tm/get_teams',
        params: { "username": name },
        headers: {
            'Authorization': `Token ${token}`, //当前token
            // 'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}

//获取项目所有的文档
export function getProjectDocument(project_id) {
    return service({
        method: 'get',
        url: '/v1/pe/get_project_docs',
        params: {
            project_id
        }
    })
}


export function getLimit(doc_id, username) {
    // data = JSON.stringify(data)
    // console.log(data)
    return service({
        method: 'get',
        url: '/v1/pe/get_doc_permissions',
        params: {
            doc_id,
            username
        },
    })
}

// export function changeLimit(doc_id, editable_by_guests) {
//     // data = JSON.stringify(data)
//     // console.log(data)
//     return service({
//         method: 'put',
//         url: '/v1/pe/update_doc_permissions',
//         params: {
//             doc_id,
//             editable_by_guests
//         },
//     })
// }


export function createDocument(data) {
    // console.log(formData)
    //data = JSON.stringify(data)
    console.log(data)
    return service({
        method: 'post',
        url: `/v1/pe/create_doc`,
        data
    })
}

export function deleteDocument(doc_id) {
    // console.log(formData)
    return service({
        method: 'delete',
        url: `/v1/pe/delete_doc`,
        params: {
            "doc_id": doc_id
        }

    })
}

//查询用户所在群聊
export function getGroupByUser(username) {
    return service({
        method: 'get',
        url: '/v1/tm/get_user_groups',
        params: {
            "username": username
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,  //当前token
            // 'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}



//获取群聊消息
export function getMessageList(group_id) {
    return service({
        method: 'get',
        url: '/v1/tm/get_messages',
        params: {
            "group_id": group_id
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`, //当前token
            // 'Authorization': `Token e0c1d86cdf2ecf302a8390a39a9988d1e2a88eac`,
        }
    }).catch(error => {
        if (error.response.status === 400) {
            console.log('an empty message list');
        } else {
            console.error("Error in getMessageList:", error);
        }
        throw error; // 将错误继续抛出以便上层继续处理
    });
}


//查询文档
export function getDocumentByID(id) {
    return service({
        method: 'get',
        url: '/v1/pe/get_doc',
        params: {
            "doc_id": id
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}


//获取群成员列表
export function getGroupMemberList(group_id) {
    return service({
        method: 'get',
        url: '/v1/tm/get_group_members',
        params: {
            "group_id": group_id
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
        }
    }).catch(error => {
        console.error("Error in getGroupMemberList:", error);
        throw error;
    });
}

// 私聊
export function getPrivateChat(username) {
    return service({
        method: 'post',
        url: '/v1/tm/create_private_chat',
        params: {
            "username": username
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
        }
    }).catch(error => {
        console.error("Error in getPrivateChat:", error);
        throw error;
    }
    );
}


//完成新手教程返回true
export function AllNewB(data) {
    findmember(data).then(res => {
        console.log(res)
        if (res.data.data.has_completed_tutorial) {
            localStorage.setItem("MainNewB", true);
            localStorage.setItem("TeamListNewB", true);
            localStorage.setItem("TeamNewB", true);
            localStorage.setItem("ControlNewB", true);
            localStorage.setItem("ProjectListNewB", true);
            localStorage.setItem("ProjectNewB", true);
            localStorage.setItem("DesignListNewB", true);
            localStorage.setItem("DesignNewB", true);
            //localStorage.setItem("WendangListNewB",true);
            localStorage.setItem("WendangNewB", true);
            localStorage.setItem("MessageNewB", true);
            localStorage.setItem("InformationNewB", true);
            //return true;
        } else {
            localStorage.setItem("MainNewB", false);          //主页
            localStorage.setItem("TeamListNewB", false);      //团队列表over
            localStorage.setItem("TeamNewB", false);          //团队over
            localStorage.setItem("ControlNewB", false);       //成员管理over
            localStorage.setItem("ProjectListNewB", false);   //项目列表
            localStorage.setItem("ProjectNewB", false);       //项目over
            localStorage.setItem("DesignListNewB", false);  //原型列表
            localStorage.setItem("DesignNewB", false);      //原型设计
            //localStorage.setItem("WendangListNewB",false);  //文档列表（暂未分层处理）
            localStorage.setItem("WendangNewB", false);       //文档over
            localStorage.setItem("MessageNewB", false);       //群聊over
            localStorage.setItem("InformationNewB", false);   //消息中心
        }
    })
}

//修改用户Newb为Y
export function changeyNewB(name) {
    return service({
        method: 'put',
        url: '/v1/tm/update_user_tutorial',
        params: {
            "username": name,
            "has_completed_tutorial": "True"
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`, //当前token
            // 'Authorization': `Token e0c1d86cdf2ecf302a8390a39a9988d1e2a88eac`,
        }
    })
}
//n
export function changenNewB(name) {
    return service({
        method: 'put',
        url: '/v1/tm/update_user_tutorial',
        params: {
            "username": name,
            "has_completed_tutorial": "False"
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`, //当前token
            // 'Authorization': `Token e0c1d86cdf2ecf302a8390a39a9988d1e2a88eac`,
        }
    })
}


//修改文档
export function changeDocument(data) {
    // console.log(formData)
    //data = JSON.stringify(data)
    console.log(data)
    return service({
        method: 'put',
        url: `/v1/pe/update_doc`,
        data
    })
}

//转换文档格式
export function convertFormat(data) {
    return service({
        method: 'post',
        url: '/v1/pe/convert_format',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}

//消息通知接口
export function getUserNotification(username, type, token) {
    return service({
        method: 'get',
        url: '/v1/nc/get_user_notifications',
        params: {
            username: username,
            require_type: type
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
        }
    })

}

export function updateNotification(notification_id, is_read, token) {
    return service({
        method: 'put',
        url: '/v1/nc/update_notification',
        params: {
            notification_id,
            is_read
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
        }
    })
}

export function deleteAllRead(token) {
    return service({
        method: 'delete',
        url: '/v1/nc/delete_read_notifications',
        headers: {
            'Authorization': `Token ${getToken('token')}`,
        }
    })
}

export function readAll(token) {
    return service({
        method: 'put',
        url: '/v1/nc/read_all_notifications',
        headers: {
            'Authorization': `Token ${getToken('token')}`,
        }
    })
}


//获取成员身份
export function getRole(id, name) {
    return service({
        method: 'get',
        url: '/v1/tm/get_member_role',
        params: {
            "team_id": id,
            "username": name
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}

//创建节点
export function addNode(data) {
    return service({
        method: 'post',
        url: '/v1/pe/add_node',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}

//修改节点
export function changeNode(data) {
    return service({
        method: 'put',
        url: '/v1/pe/update_node',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}

//获取节点树
export function getAllNode(data) {
    return service({
        method: 'get',
        url: '/v1/pe/get_all_nodes',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}

//获取某节点所有子节点
export function getChildrenNode(node_id) {
    return service({
        method: 'get',
        url: '/v1/pe/get_children_nodes',
        params:{
            "node_id": node_id
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}


//删除节点
export function deleteNode(data) {
    return service({
        method: 'delete',
        url: '/v1/pe/delete_node',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}

//查询结点
export function getNode(id) {
    return service({
        method: 'get',
        url: '/v1/pe/get_node',
        params: { 'node_id': id },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            //"Authorization":`Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`
        },
    })
}

//生成文档@通知
export function createDocNoti(data) {
    //data = JSON.stringify(data)
    return service({
        method: 'post',
        url: '/v1/nc/create_doc_notification',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,  //当前token
            //'Authorization': `Token bf1c691009871c8a93e53cc1063bb76a4efc90fe`,
        }
    })
}

//获取群聊
export function getGroup(group_id) {
    return service({
        method: 'get',
        url: '/v1/tm/get_group',
        params: {
            "group_id": group_id
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
        }
    }).catch(error => {
        console.error("Error in getGroup:", error);
        throw error;
    }
    );
}

//创建群聊 
export function createGroupChat(groupName) {
    let data = {"group_name": groupName}
    data = JSON.stringify(data)
    return service({
        method: 'post',
        url: '/v1/tm/create_public_group',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            'Content-Type': 'application/json'
        }
    }).catch(error => {
        console.error("Error in createGroupChat:", error);
        throw error;
    }
    );
}

//删除群聊
export function deleteGroupChat(group_id) {
    return service({
        method: 'delete',
        url: '/v1/tm/delete_group',
        params: {
            "group_id": group_id
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
        }
    }).catch(error => {
        console.error("Error in deleteGroupChat:", error);
        throw error;
    });
}

//添加群聊成员
export function addGroupMember(group_id, username) {
    return service({
        method: 'post',
        url: '/v1/tm/add_group_member',
        params: {
            "group_id": group_id,
            "username": username
        },
        headers: {
            'Authorization': `Token ${getToken('token')}`,
        }
    }).catch(error => {
        console.error("Error in addGroupMember:", error);
        throw error;
    });
}

//删除群聊成员
export function deleteGroupMember(group_id, username) {
    let data = {
        "group_id": group_id,
        "username": username
    }
    data = JSON.stringify(data)
    return service({
        method: 'post',
        url: '/v1/tm/remove_group_member',
        data,
        headers: {
            'Authorization': `Token ${getToken('token')}`,
            'Content-Type': 'application/json'
        }
    }).catch(error => {
        console.error("Error in deleteGroupMember:", error);
        throw error;
    });
}