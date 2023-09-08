<template>
  <div style="padding-top: 10%;height: 100vh;" class="index_back">
    <a-button style="position: fixed;top: 20px;left: 20px;" @click="goLogin">返回登录</a-button>
    <div style="background:#fff;width: 500px;padding: 40px;margin: auto 25%;border-radius: 8px;">
      
      <p style="text-align: center;font-size: 18px; margin: -20px 0 30px;">用户注册</p>
      <a-form
          :model="formState"
          v-bind="layout"
          name="nest-messages"
      >
        <a-form-item name="name" label="用户姓名" :rules="[{ required: true }]">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item name="email" label="Email" :rules="[{ type: 'email' }]">
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item name="phone" label="手机号" :rules="[{ required: true }]">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item name="website" label="登录账号" :rules="[{ required: true }]">
          <a-input v-model:value="formState.website" />
        </a-form-item>
        <a-form-item name="password" label="登录密码" :rules="[{ required: true }]">
          <a-input v-model:value="formState.password" />
        </a-form-item>
        <a-form-item name="password_two" label="密码确认" :rules="[{ required: true }]">
          <a-input v-model:value="formState.password_two" />
        </a-form-item>
        
        <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 4 }">
          <a-button type="primary" @click="onFinish" style="width: 100%;">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>

</template>
<script lang="ts">
import { defineComponent, reactive,getCurrentInstance } from 'vue';
import {useRouter} from 'vue-router'
import {postUserAdd} from '@/api'

export default defineComponent({
  name:'SignIn',
  setup() {
    const { proxy }= getCurrentInstance() as any;
    const router = useRouter();
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 20 },
    };
    
    const formState = reactive({
        name: '',
        age: undefined,
        email: '',
        phone: '',
        website: '',
        password: '',
        password_two:''
    });
    const onFinish = () => {
      if ( !formState.name ){
        return proxy.$message.warning('用户名称不能为空');
      }
      if ( !formState.website ){
        return proxy.$message.warning('登录名不能为空');
      }
      if ( !formState.password ){
        return proxy.$message.warning('密码不能为空');
      }
      let params = {
        user_name : formState.name,
        login_name : formState.website,
          password:formState.password,
        phone:formState.phone,
        email:formState.email,
        gender:'1'
      }
 
      postUserAdd(params).then((res:any)=>{
        if ( res.data.code !==0 ) return
        proxy.$message.success('注册成功跳转到登录页面!');
        goLogin()
      })
    };
    const goLogin = ()=>{
      router.push({
        name: 'Login'
      })
    }
    return {
      formState,
      onFinish,
      layout,
      goLogin
    };
  },
});
</script>

<style scoped>

</style>