<template>
  <div >
    <a-layout>
      <!--<a-layout-header style="background: green;color: #ffffff;text-align: center;">欢迎来到 宝友炫赏平台</a-layout-header>-->
      <a-layout-content class="laoutBody index_back">
        <div style="position: fixed;left: 50px;top: 40px;font-size: 20px;" @click="goIndex"><span >宝友炫赏</span>LOGO</div>
        <div id="components-form-demo-normal-login">
          <a-form
              :model="formState"
              name="normal_login"
              class="login-form"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
          >
            <p style="text-align: center;font-size: 18px; margin: -20px 0 30px;">用户登录</p>
            <a-form-item
                label="账号"
                name="username"
                :rules="[{ required: true, message: '登录账号不能为空!' }]"
            >
              <a-input v-model:value="formState.username">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>
            
            <a-form-item
                label="密码"
                name="password"
                :rules="[{ required: true, message: '登录密码不能为空!' }]"
            >
              <a-input-password v-model:value="formState.password">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>
            
            <a-form-item>
              <a-form-item name="remember" no-style>
                <!--<a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>-->
              </a-form-item>
              <a class="login-form-forgot" href="javascript:void (0);" @click="goPassword">忘记密码</a>
            </a-form-item>
            
            <a-form-item>
              <a-button type="primary" html-type="submit" class="login-form-button">
                登录
              </a-button>
              <p></p>
              <br>
              Or
              <a href="javascript:void (0);" @click="goSign">去注册</a>
            </a-form-item>
          </a-form>
        </div>
      </a-layout-content>
      <a-layout-footer style="background:#f5f5f5;text-align: center;">
        Baoyou show reward platform ©2023 Created by Ant UED</a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
//optipn API
//引入
import { defineComponent, getCurrentInstance, onMounted,reactive,computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import {checkLogin } from "../../api"
import {useRouter} from 'vue-router'
import session from '../../plugins/storage'

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
//导出
export default defineComponent({
  name:'Login',
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup(){
    const { proxy }= getCurrentInstance() as any;
    const router = useRouter();
    
    const formState = reactive<FormState>({
      username: '',
      password: '',
      remember: true,
    });
    const onFinish = () => {
      if ( !formState.username ){
        return proxy.$message.warning('登录名不能为空');
      }
      if ( !formState.password ){
        return proxy.$message.warning('密码不能为空');
      }
      let params = {
        login_name : formState.username,
        password : formState.password
      }
      checkLogin(params).then((res:any) => {
        if(res.data.code!==0) return
        proxy.$message.success('登录成功!');
        session.set("userName",res.data.data.user_name)
        session.set("userId",res.data.data.id)
        router.push({
          name: 'Home'
        })
      });
     
    };
    
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    const disabled = computed(() => {
      return !(formState.username && formState.password);
    })
    
    //去注册页面
    const goPassword = () => {
      router.push({
        name: 'PasswordReset'
      })
    }
    //去注册页面
    const goSign = () => {
      router.push({
        name: 'SignIn'
      })
    }
    //去首页页面
    const goIndex = () => {
      router.push({
        name: 'Index'
      })
    }
    onMounted(()=>{})
    return {
      formState,
      onFinish,
      onFinishFailed,
      disabled,
      goPassword,
      goSign,
      goIndex
    }
  }
})
</script>

<style scoped>
.laoutBody{
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
}
#components-form-demo-normal-login .login-form {
  border: 1px solid #f9f9f9;
  padding: 50px;
  width: 430px;
  background: #ffffff;
  border-radius: 6px;
  margin-left: -300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>