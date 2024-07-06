import { ElMessage } from "element-plus";

const url = "http://120.46.53.94:8080"
export async function checkAandBGuanzhu(Asid: string, Bsid:string){
    let response = await fetch(url + '/follow/is-followed?sid_from=' + Asid + '&sid_to=' + Bsid, {
        method: 'GET',
    });
    let data = await response.json();
    return data.data;
}

export async function guanzhuAtoB(Asid: string, Bsid:string){
    let response = await fetch(url + '/follow/add?sid_from=' + Asid + '&sid_to=' + Bsid, {
        method: 'POST',
    });
    let data = await response.json();
    let code = data.code;
    return code;
}

export async function userLogin(sid: string, password: string) {
    return fetch(url + '/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "sid": sid, "password": password }),
    });
}

export async function fetchUserDataBySid(sid: string | string[]) {
    let response = await fetch(url + '/user/list/sid/' + sid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    let userInfo = data.data[0];
    return userInfo;
}

export async function userRegister(sid: string, name: string, password: string) {
    return fetch(url + '/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "sid": sid,
            "name": name,
            "password": password,
        }),
    });
}

export async function changePassword(sid: string, password: string) {
    return fetch(url + '/user/sid/' + sid + '/password?password=' + password, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
// 实现这个接口，用于修改个人信息
///user/sid/{sid}/update
export async function updateUserInfo(sid: string, name: string, signature: string, gender: number) {
    return await fetch(url + '/user/sid/' + sid + '/update?name='+name+'&signature='+signature+'&gender='+gender , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "sid": sid,
            "name": name,
            "signature": signature,
            "gender": gender,
        }),
    });
}

export async function updateAvatar(sid: string, avatar: any) {
    const formdata = new FormData();
    formdata.set('file', avatar);

    let response = await fetch(url + '/user/sid/'+sid+'/avatar' , {
        method: 'POST',
        body: formdata,
    });

    let data = await response.json();
    return data.code;
}
export async function updateSignature(sid: string, signature: string) {
    return await fetch(url + '/user/sid/' + sid + '/signature?signature=' + signature, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function fetchFavoriteVideoBySid(sid:string|string[]|undefined){
    let response = await fetch(url + '/user/collect-all?sid=' +sid,{
       method: 'POST',
    });
    let data = await response.json();
    if (data.code == 200) {
        return data.data;
    }else{
        ElMessage.error("服务器出问题了!")
        return null;
    }
}

export async function fetchAttentionList(sid: string | string[]) {
    let response = await fetch(url + '/follow/follows?sid=' + sid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    let userInfo = data.data;
    return userInfo;
}

export async function fetchFansList(sid: string | undefined) {
    let response = await fetch(url + '/follow/fans?sid=' + sid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    let userInfo = data.data;
    return userInfo;
}

export async function fetchGuankan1Data(sid:string){
    let response = await fetch(url + '/daily/sid-watch/' + sid, {
        method: 'GET',
    });
    let data = await response.json();
    let weekInfo = data.data;
    return weekInfo;
}
export async function fetchGuankan2Data(sid:string){
    let response = await fetch(url + '/daily/sid/' + sid, {
        method: 'GET',
    });
    let data = await response.json();
    let weekInfo = data.data;
    return weekInfo;
}

export async function deleteVideoFromFavorite(sid: string | undefined, vidList: string | string[]) {
    let response = await fetch(url + '/user/collect-delete?sid=' + sid+'&vidListString='+vidList, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    if (data.code == 200) {
        return data.code;
    }else{
        return null;
    }
}