<template>
  <div class="login__container">
    <el-row>
      <!-- 屏幕宽度小于768 则左侧不占12 而是占0列 -->
      <el-col :span="7" :xs="0"></el-col>
      <el-col :span="10" :xs="24">
        <el-form
          class="login__form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Congratulations on finding here</h1>
          <h2>Welcome to the program</h2>

          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              type="text"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              :show-password="true"
              type="password"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { ElNotification } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';

import { getTime } from '@/utils/time.js';
import useUserStore from '@/stores/modules/user.js';

// 控制按钮加载效果
let loading = ref(false);

// 获取 ElForm 组件
let loginForms = ref();

// 路由器
let router = useRouter();
let route = useRoute();

// piana
let userStore = useUserStore();

// 收集账号与密码的数据
let loginForm = reactive({ username: 'admin', password: '111111' });

// 获取当前时间,修改通知内容
const message = getTime();

// 登录按钮
async function login() {
  // 保证全部的表单项校验通过再发请求
  await loginForms.value.validate();

  // 按钮:显示开始加载效果
  loading.value = true;

  // 点击登录按钮以后干什么?

  // 1.通知仓库发登录请求
  // 2.请求成功:跳转到home
  // 3.请求失败:弹出登录失败的信息

  try {
    // 保证登录成功
    await userStore.userLogin(loginForm);
    // 2. 编程式导航跳转到首页
    let redirect = route.query.redirect;
    console.log(redirect);

    router.push({ path: redirect || '/' });

    // 登录成功提示信息
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `${message}`,
    });

    // 登录成功加载效果也消失
    loading.value = false;
  } catch (error) {
    // 3. 登录失败加载效果效果
    loading.value = false;
    ElNotification({
      type: 'error',
      message: '登录失败',
      title: `${message}`,
    });
  }
}

// 自定义校验规则函数
function validatorUserName(rule, value, callback) {
  // rule:校验规则对象  value:表单元素文本内容  callback:符合条件放行
  // 如果不符合条件,调用callback方法,注入错误提示信息
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error('账号长度至少有5位'));
  }
}

function validatorPassWord(rule, value, callback) {
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error('密码长度至少有6位'));
  }
}

// 定义表单校验需要配置对象
const rules = {
  username: [
    {
      // required: true, // 必须校验
      // min: 5, // 文本长度至少 5 位
      // message: '账号长度至少六位', // 错误提示信息
      trigger: 'blur', // 触发校验时机 --- 失去焦点时触发  --- change 文本发生变化触发
      validator: validatorUserName,
    },
  ],
  password: [
    {
      // required: true,
      // min: 6,
      // max: 16,
      // message: '密码长度至少6位',
      trigger: 'change',
      validator: validatorPassWord,
    },
  ],
};
</script>

<style scoped lang="scss">
.login__container {
  width: 100%;
  height: 100vh;
  background: url('https://act-upload.mihoyo.com/sr-wiki/2024/02/07/279865110/6751615f264fe2edd8657a5af181aefc_6494929803584231391.png')
    no-repeat;
  background-size: cover;

  .login__form {
    margin: 0 auto;
    position: relative;
    height: 290px;
    width: 77%;
    top: 25vh;
    padding: 40px;
    // #2668e2
    background-color: rgba(#333, 0.15);
    border-radius: 15px;

    h1,
    h2 {
      color: #2570fa;
      text-align: center;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }

    h1 {
      font-size: 24px;
    }
    h2 {
      font-size: 20px;
      margin: 20px 0;
    }

    button {
      margin: 0 auto;
      width: 96px;
      height: 32px;
      font-size: 18px;
      line-height: 32px;
      transition: all 0.12s linear;
    }
    button:hover {
      width: 108px;
      height: 42px;
      font-size: 20px;
      line-height: 42px;
    }
  }
}
</style>
