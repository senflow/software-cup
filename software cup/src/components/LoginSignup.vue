<template>
    <div class="body">
        <div class="main-box">
            <div :class="['container', 'container-register', { 'is-txl': isLoginHome }]">
                <form>
                    <h2 class="title">注册</h2>
                    <div class="form-icons">
                        <img class="form-icon" src="@/assets/img/wechat.png" alt="微信登录" />
                        <img class="form-icon" src="@/assets/img/alipay.png" alt="支付宝登录" />
                        <img class="form-icon" src="@/assets/img/QQ.png" alt="QQ登录" />
                    </div>
                    <br /><br />
                    <input v-model="email" class="form-input" type="text" placeholder="请输入邮箱"
                        @keyup.enter="registerOperation()" />
                    <div class="form-input-group">
                        <input v-model="verificationCode" class="form-input-left" type="text" placeholder="请输入验证码" />
                        <el-button size="large" @click="mySendVerificationCode"
                            :disabled="isSending || countdown > 0">{{
                                countdown > 0
                                    ? countdown + 's 后重新发送' : '获取验证码' }}</el-button>
                    </div>
                    <input v-model="username" class="form-input" type="text" placeholder="请输入用户名" />
                    <input v-model="password" class="form-input" type="password" placeholder="请输入密码" />
                    <input v-model="checkPwd" class="form-input" type="password" placeholder="请再次输入密码"
                        @keyup.enter="registerOperation()" />
                    <div class="form-button" @click="registerOperation()">立即注册</div>
                </form>
            </div>
            <div :class="['container', 'container-login', { 'is-txl is-z200': isLoginHome }]">
                <form>
                    <h2 class="title">登录</h2>
                    <div class="form-icons">
                        <img class="form-icon" src="@/assets/img/wechat.png" alt="微信登录" />
                        <img class="form-icon" src="@/assets/img/alipay.png" alt="支付宝登录" />
                        <img class="form-icon" src="@/assets/img/QQ.png" alt="QQ登录" />
                    </div>
                    <!-- <span class="text">或使用用户名登录</span> -->
                    <br /><br /><br /><br /><br />
                    <input v-model="email" class="form-input" type="text" placeholder="请输入邮箱" />
                    <input v-model="password" class="form-input" type="password" placeholder="请输入密码"
                        @keyup.enter="loginOperation()" />
                    <div class="form-button" @click="loginOperation()">立即登录</div>
                </form>
            </div>
            <div :class="['switch', { login: isLoginHome }]">
                <div class="switch-circle"></div>
                <div class="switch-circle switch-circle_top"></div>
                <div class="switch-container">
                    <h2>{{ isLoginHome ? "欢迎回来！" : "您好！" }}</h2>
                    <p>
                        {{ isLoginHome ? "如果您还没有账号" : "如果您已经注册过账号" }}
                        <br />
                        {{
                            isLoginHome
                                ? "请点击下方立即登录按钮进行登录"
                                : "请点击下方立即注册按钮进行注册"
                        }}
                    </p>
                    <div class="form-button" @click="isLoginHome = !isLoginHome">
                        {{ isLoginHome ? "立即注册" : "立即登录" }}
                    </div>
                    <!-- <div class="cancel-button" @click="adminLogin">管理员登录</div> -->
                    <div class="cancel-button" @click="cancel">取消</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoginSignup",
};
</script>

<script setup>
import { isLoginVisible } from "@/globalVariables";
import { ref } from "vue";
import { userLogin, userRegister, sendVerificationCode } from "@/api/user"
import { useUserStore } from '@/store/modules/user.ts'
import { ElMessage } from "element-plus";


const email = ref('');
const username = ref('');
const password = ref('');
const checkPwd = ref('');
const verificationCode = ref('');
const countdown = ref(0);
const isSending = ref(false);
const isLoginHome = ref(true); // 前端使用，判断注册还是登录

const mySendVerificationCode = async () => {
    if (!validateEmail(email.value)) {
        ElMessage.error('请输入合法的邮箱地址');
        return;
    }

    isSending.value = true;
    const response = await sendVerificationCode(email.value);
    console.log(response);
    const data = await response.json();
    console.log(data);
    if (data.code == 200) {
        ElMessage.success('发送成功');
        startCountdown();
    }
    else ElMessage.error('发送失败，请稍后重试');

};

const startCountdown = () => {
    countdown.value = 60;
    const interval = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(interval);
        }
    }, 1000);
};

const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
};


function cancel() {
    isLoginVisible.value = false;
}

const loginOperation = async () => {
    try {
        let response = await userLogin(email.value, password.value);
        let data = await response.json();
        if (data.code == 200) {
            useUserStore().setUser({ email: email.value });
            isLoginVisible.value = false;
            window.location.reload();
            ElMessage.success("登录成功")
        } else if (data.message == '用户不存在') {
            ElMessage.error('登录失败，用户不存在');
        } else {
            ElMessage.error('登录失败，请检查账户名和密码');
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('登录失败，请稍后重试');
    }
}

const registerOperation = async () => {
    console.log(username.value, password.value, checkPwd.value, verificationCode.value);

    // 检查邮箱格式
    if (!validateEmail(email.value)) {
        ElMessage.error('请输入合法的邮箱地址');
        return;
    }

    // 检查密码是否一致
    if (password.value != checkPwd.value) {
        ElMessage.error('密码不一致，请重新输入！');
        password.value = "";
        checkPwd.value = "";
        return;
    }

    if (email.value == '' || username.value == '' || password.value == '' || checkPwd.value == '' || verificationCode.value == '') {
        ElMessage.error('请填写完整信息！');
        return;
    }

    if (verificationCode == '') {
        ElMessage.error('请输入验证码！');
        return;
    }


    if (password.value.length < 6) {
        ElMessage.error('密码长度必须大于等于6!');
        return;
    }

    try {
        const response = await userRegister(email.value, username.value, password.value, verificationCode.value);
        const data = await response.json();
        console.log(data);
        if (data.code == 200) {
            useUserStore().setUser({ email: email.value });
            isLoginVisible.value = false;
            ElMessage.success("注册成功！");
        }
        else if (data.code == 506) {
            ElMessage.error('邮箱已注册！');
        } else if (data.code == 507) {
            ElMessage.error('验证码错误！');
        }
        else {
            ElMessage.error('注册失败，请重试！');
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('注册失败，请重试！');
    }
};
</script>

<style scoped>
.body {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    color: #a0a5a8;
}

.main-box {
    position: relative;
    width: 1000px;
    min-width: 1000px;
    min-height: 600px;
    height: 600px;
    padding: 25px;
    background-color: #ecf0f3;
    box-shadow: 1px 1px 100px 10px #ecf0f3;
    border-radius: 12px;
    overflow: hidden;
}

.main-box .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 600px;
    height: 100%;
    padding: 25px;
    background-color: #ecf0f3;
    transition: all 1.25s;
}

.main-box .container form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: #a0a5a8;
}

.main-box .container form .form-icon {
    object-fit: contain;
    width: 30px;
    margin: 0 5px;
    opacity: 0.5;
    transition: 0.15s;
}

.main-box .container form .form-icon:hover {
    opacity: 1;
    transition: 0.15s;
    cursor: pointer;
}

.main-box .container form .title {
    font-size: 34px;
    font-weight: 700;
    line-height: 3;
    color: #181818;
    size: 30px;
}

.main-box .container form .text {
    margin-top: 30px;
    margin-bottom: 12px;
    font-size: 18px;
}

.main-box .container form .form-input {
    width: 350px;
    height: 40px;
    margin: 4px 0;
    padding-left: 25px;
    font-size: 13px;
    letter-spacing: 0.15px;
    border: none;
    outline: none;
    background-color: #ecf0f3;
    transition: 0.25s ease;
    border-radius: 8px;
    box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
}

.main-box .container form .form-input-left {
    width: 248px;
    height: 40px;
    margin: 4px 0;
    padding-left: 25px;
    font-size: 13px;
    letter-spacing: 0.15px;
    border: none;
    outline: none;
    background-color: #ecf0f3;
    transition: 0.25s ease;
    border-radius: 8px;
    box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
}

.main-box .container form .form-input::placeholder {
    color: #a0a5a8;
}

.main-box .container-register {
    z-index: 100;
    left: calc(100% - 650px);
}

.main-box .container-login {
    left: calc(100% - 600px);
    z-index: 0;
}

.main-box .is-txl {
    left: 0;
    transition: 1.25s;
    transform-origin: right;
}

.main-box .is-z200 {
    z-index: 200;
    transition: 1.25s;
}

.main-box .switch {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 300px;
    padding: 50px;
    z-index: 200;
    transition: 1.25s;
    background-color: #ecf0f3;
    overflow: hidden;
    box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
    color: #a0a5a8;
}

.main-box .switch .switch-circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background-color: #ecf0f3;
    box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
    bottom: -60%;
    left: -60%;
    transition: 1.25s;
}

.main-box .switch .switch-circle_top {
    top: -30%;
    left: 60%;
    width: 300px;
    height: 300px;
}

.main-box .switch .switch-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    width: 400px;
    padding: 50px 55px;
    transition: 1.25s;
}

.main-box .switch .switch-container h2 {
    font-size: 34px;
    font-weight: 700;
    line-height: 3;
    color: #181818;
}

.main-box .switch .switch-container p {
    font-size: 16px;
    letter-spacing: 0.25px;
    text-align: center;
    line-height: 1.6;
}

.main-box .login {
    left: calc(100% - 400px);
}

.main-box .login .switch-circle {
    left: 0;
}

.main-box .cancel-button {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    letter-spacing: 2px;
    background-color: #e74c3c;
    margin-top: 20px;
    color: #f9f9f9;
    cursor: pointer;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
}

.main-box .cancel-button:hover {
    box-shadow: 2px 2px 3px 0 rgba(255, 255, 255, 0.5),
        -2px -2px 3px 0 rgba(116, 125, 136, 0.5),
        inset -2px -2px 3px 0 rgba(255, 255, 255, 0.2), inset 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.main-box .form-button {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 15px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    letter-spacing: 2px;
    background-color: #4b70e2;
    color: #f9f9f9;
    cursor: pointer;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
}

.main-box .form-button:hover {
    box-shadow: 2px 2px 3px 0 rgba(255, 255, 255, 0.5),
        -2px -2px 3px 0 rgba(116, 125, 136, 0.5),
        inset -2px -2px 3px 0 rgba(255, 255, 255, 0.2), inset 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
</style>
