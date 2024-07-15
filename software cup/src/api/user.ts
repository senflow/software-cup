import { ElMessage } from "element-plus";

const url = "http://120.46.53.94:8080"

export async function userLogin(email: string, password: string) {
    return fetch(url + '/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "email": email, "password": password }),
    });
}

export async function fetchUserDataByemail(email: string | string[]) {
    let response = await fetch(url + '/user/list/email/' + email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    let userInfo = data.data[0];
    return userInfo;
}


export async function changePassword(email: string, password: string) {
    return fetch(url + '/user/email/' + email + '/password?password=' + password, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
// 实现这个接口，用于修改个人信息
export async function updateUserInfo(email: string, name: string, signature: string, gender: number) {
    return await fetch(url + '/user/email/' + email + '/update?name='+name+'&signature='+signature+'&gender='+gender , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": email,
            "name": name,
            "signature": signature,
            "gender": gender,
        }),
    });
}

export async function updateAvatar(email: string, avatar: any) {
    const formdata = new FormData();
    formdata.set('file', avatar);

    let response = await fetch(url + '/user/email/'+email+'/avatar' , {
        method: 'POST',
        body: formdata,
    });

    let data = await response.json();
    return data.code;
}

export async function sendVerificationCode(email: string) {
    let response = await fetch(url + '/mail/send/' + email, {
        method: 'POST',
    });
    return response;
}

export async function userRegister(email: string, name: string, password: string, activeCode:string) {
    return fetch(url + '/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": email,
            "name": name,
            "password": password,
            "activeCode": activeCode,
        }),
    });
}
