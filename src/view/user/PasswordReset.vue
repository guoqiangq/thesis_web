<template>
  <div style="padding-top: 10%;height: 100vh;" class="index_back">
    <a-button style="position: fixed;top: 20px;left: 20px;" @click="goLogin">返回登录</a-button>
    <div style="width: 500px;padding: 40px;margin: auto 25%;background: #f9f9f9">
      <a-form
          :model="formState"
          v-bind="layout"
          name="nest-messages"
      >
        <a-form-item name="phone" label="手机号" :rules="[{ required: true }]">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item name="website" label="短信验证码" :rules="[{ required: true }]">
          <a-row type="flex">
            <a-col flex="auto">
              <a-input v-model:value="formState.code" />
            </a-col>
            <a-col flex="100px">
              <a-button key="back" @click="check" style="width: 100px;" :disabled="times!=60">{{ times<60?`已发送(${times})`:'发送验证码' }}</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item name="password" label="登录密码" :rules="[{ required: true }]">
          <a-input v-model:value="formState.password" />
        </a-form-item>
        <a-form-item name="password_two" label="密码确认" :rules="[{ required: true }]">
          <a-input v-model:value="formState.password_two" />
        </a-form-item>
        
        <a-form-item :wrapper-col="{ ...layout.wrapperCol}">
          <a-button type="primary" @click="onFinish" style="width: 100%;margin-top: 50px;">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>

</template>
<script lang="ts">
import { defineComponent, reactive,getCurrentInstance , ref } from 'vue';
import {useRouter} from 'vue-router'
import {posEditPassword} from '@/api'

export default defineComponent({
  name:'PasswordReset',
  setup() {
    const { proxy }= getCurrentInstance() as any;
    const router = useRouter();
    let times = ref(60);
    let timeoutID:any = null;
    const layout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 24 },
    };
    
    const formState = reactive({
      phone: '',
      code: '',
      password: '',
      password_two:''
    });
    const check =()=> {
      timeoutID = setInterval(() => {
        if (times.value <1) {
          clearTimeout(timeoutID);
          times.value = 60;
          return;
        }
        times.value--;
      }, 1000);
    };
    const onFinish = () => {
      if ( !formState.code ){
        return proxy.$message.warning('短信验证码不能为空');
      }
      if ( !formState.password ){
        return proxy.$message.warning('密码不能为空');
      }
      let params = {
        code:formState.code,
        password:formState.password,
        phone:formState.phone,
      }
      posEditPassword(params).then((res:any)=>{
        if ( res.data.code !==0 ) return
        proxy.$message.success('密码修改成功跳转到登录页面!');
        goLogin()
      })
    };
    const goLogin = ()=>{
      router.push({
        name: 'Login'
      })
    }
    return {
      times ,
      timeoutID,
      formState,
      layout,
      check,
      onFinish,
      goLogin
    };
  },
});
</script>

<style scoped>

</style>