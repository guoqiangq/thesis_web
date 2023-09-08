<template>
  <a-layout-header style="color: #ffffff;text-align: center;" id="components-layout-demo-top">
    <a-row type="flex">
      <a-col flex="150px">
        <div class="logo" @click="goHome">宝友炫赏平台 LOGO</div>
      </a-col>
      <a-col flex="auto">
        <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="dark"
            mode="horizontal"
            :style="{ lineHeight: '64px' }"
            @click="selClick()"
        >
          <a-menu-item key="ShareList">我的炫宝</a-menu-item>
          <a-menu-item key="FriendList">我的宝友</a-menu-item>
          <a-menu-item key="BrowseList">我的赏宝</a-menu-item>
          <a-menu-item key="UserList" v-if="userDetails.rules=='admin'">用户管理</a-menu-item>
          <a-menu-item key="ShareAllList" v-if="userDetails.rules=='admin'">炫宝管理</a-menu-item>
        </a-menu>
      </a-col>
      <a-col flex="150px">
        <div style="line-height: 40px;">
          <!--<a-avatar :src="userDetails.avatar"/>-->
          
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              <a-avatar :src="userDetails.avatar"/>
              <p style="line-height: 20px;margin-bottom: 0px;">欢迎 {{ userDetails.user_name }} 用户</p>
            </a>
            <template #overlay>
              <a-menu style="text-align: center!important;">
                <a-menu-item key="0" style="line-height: 30px;" @click="showModalUser">
                  个人信息
                </a-menu-item>
                <a-menu-item key="1" @click="showModalPassword">
                  修改密码
                </a-menu-item>
                <a-menu-divider/>
                <a-menu-item key="3" @click="goEtin">退出</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-col>
    </a-row>
    <a-modal v-model:visible="visible_user" title="个人信息">
      <a-form  :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="用户昵称">
          <a-input v-model:value="formState.user_name" />
        </a-form-item>
        <a-form-item label="用户性别">
          <a-radio-group v-model:value="formState.gender">
            <a-radio value="男">男</a-radio>
            <a-radio value="女">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="用户头像">
          <a-radio-group v-model:value="formState.avatar">
            <a-radio-button value="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png">
              <a-avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
            </a-radio-button>
            <a-radio-button value="https://randomuser.me/api/portraits/men/76.jpg">
              <a-avatar src="https://randomuser.me/api/portraits/men/76.jpg" />
            </a-radio-button>
            <a-radio-button value="https://randomuser.me/api/portraits/men/78.jpg">
              <a-avatar src="https://randomuser.me/api/portraits/men/78.jpg" />
            </a-radio-button>
            <a-radio-button value="https://randomuser.me/api/portraits/women/17.jpg">
              <a-avatar src="https://randomuser.me/api/portraits/women/17.jpg" />
            </a-radio-button>
            <a-radio-button value="https://randomuser.me/api/portraits/women/78.jpg">
              <a-avatar src="https://randomuser.me/api/portraits/women/78.jpg" />
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item label="邮箱号码">
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item label="个性签名">
          <a-input v-model:value="formState.remark" type="textarea" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOkUserEdit">保存</a-button>
      </template>
    </a-modal>
    <a-modal v-model:visible="visible_password" title="修改密码">
      <a-form :model="formPassword" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="手机号码">
          <a-input v-model:value="formPassword.phone" />
        </a-form-item>
        <a-form-item label="短信验证码">
          <a-row type="flex">
            <a-col flex="auto">
              <a-input v-model:value="formPassword.code" />
            </a-col>
            <a-col flex="100px">
              <a-button key="back" @click="check" style="width: 100px;" :disabled="times!=60">{{ times<60?`已发送(${times})`:'发送验证码' }}</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="旧密码">
          <a-input v-model:value="formPassword.password" />
        </a-form-item>
        <a-form-item label="新密码">
          <a-input v-model:value="formPassword.password" />
        </a-form-item>
        <a-form-item label="密码确认">
          <a-input v-model:value="formPassword.password_two" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOkPasswordEdit">确认更改</a-button>
      </template>
    </a-modal>
  </a-layout-header>
</template>

<script lang="ts">
import {defineComponent , ref , nextTick , getCurrentInstance , onMounted} from 'vue';
import {useRouter , onBeforeRouteUpdate} from 'vue-router';
import {useStore} from 'vuex'
import {getUserFind , posEditPassword , posEditUser} from '@/api'
import session from '@/plugins/storage.ts'

interface UserDetails {
  id:any,
  user_name: string,
  gender: string,
  avatar: string,//头像
  email: string,
  phone:any,
  remark: string,
  rules: string,
}
interface FormState {
  id:any,
  user_name: string,
  gender: string,
  avatar: string,//头像
  email: string,
  phone:any,
  remark: string,
  rules: string,
}
interface FormPassword {
  id:any,
  phone:any,
  code: string,
  password: string,
  password_two: string,
}

export default defineComponent( {
  name : "HeadMenu" ,
  components : {} ,
  
  setup () {
    const router = useRouter();
    const store = useStore();
    const { proxy } = getCurrentInstance() as any;
    let times = ref(60);
    let timeoutID:any = null;
    let selectedKeys = ref<string[]>( [ 'ShareList' ] );
    const loading = ref<boolean>(false);
    const visible_user = ref<boolean>(false);
    const visible_password = ref<boolean>(false);
    const userDetails = ref<UserDetails>({
      id:'',
      user_name: '',
      gender: '',
      avatar: '',
      email: '',
      phone:'',
      remark: '',
      rules: '',
    });
    const formState = ref<FormState>({
      id:'',
      user_name: '',
      gender: '',
      avatar: '',
      email: '',
      phone:'',
      remark: '',
      rules: '',
    });
    const formPassword = ref<FormPassword>({
      id:'',
      phone:'',
      code: '',
      password: '',
      password_two: ''
    });
    const showModalUser = () => {
      formState.value = userDetails.value;
      visible_user.value = true;
    };
    const showModalPassword = () => {
      formPassword.value = {
        id:userDetails.value.id,
        phone:userDetails.value.phone,
        code: '',
        password: '',
        password_two: ''
      }
      visible_password.value = true;
    };
    //修改个人信息
    const handleOkUserEdit = () => {
      let params = formState.value;
      loading.value = true;
      posEditUser(params).then((res:any)=>{
        loading.value = false;
        if ( res.data.code !==0 ) return;
        visible_user.value = false;
        proxy.$message.success( '个人信息修改成功!' );
        meFind()
      })
    };
        //修改密码
    const handleOkPasswordEdit = () => {
      let params = formPassword.value;
      loading.value = true;
      posEditPassword(params).then((res:any)=>{
        loading.value = false;
        if ( res.data.code !==0 ) return;
        visible_password.value = false;
        proxy.$message.success( '密码修改成功,请重新登录!' );
        goEtin();
      })
    };
    //取消
    const handleCancel = () => {
      visible_user.value = false;
      visible_password.value = false;
    };
    const check =()=> {
      timeoutID = setInterval(() => {
        if (times.value <1) {
          clearTimeout(timeoutID);
          times.value = 60;
          return;
        }
        times.value--;
      }, 1000);
    }
    // 获取个人信息
    const meFind = () => {
      getUserFind( { id : session.get( "userId" ) } ).then( ( res : any ) => {
        if ( res.data.code !==0 ) return;
        userDetails.value = res.data.data;
      } )
    };
    // 跳转路由
    const selClick = () => {
      nextTick( () => {
        let title = "";
        if ( selectedKeys.value[0]=='ShareList' ){
          title = '我的炫宝'
        }
        if ( selectedKeys.value[0]=='FriendList' ){
          title = '我的宝友'
        }
        if ( selectedKeys.value[0]=='BrowseList' ){
          title = '我的赏宝'
        }
        if ( selectedKeys.value[0]=='UserList' ){
          title = '用户管理'
        }
        if ( selectedKeys.value[0]=='ShareAllList' ){
          title = '炫宝管理'
        }
        session.set("menuKeys",selectedKeys.value[0])
        store.commit( "changeBreadcrumb" , [ {
          title,
          route:{
            name:selectedKeys.value[0],
            query:{}
          }
        } ] )
        store.commit( "changeKeepAlive" , [ selectedKeys.value[0] ] )
        router.push( {
          name : selectedKeys.value[0]
        } )
      } )
    }
    // 退出登录
    const goEtin = () => {
      router.push( {
        name : 'Index'
      } )
      proxy.$message.success( '已退出登录!' );
    }
    // 到首页
    const goHome = () => {
      store.commit( "changeBreadcrumb" , [ {
        title:'首页',
        route:{
          name:'Home',
          query:{}
        }
      } ] )
      session.set("menuKeys","Home")
      router.push( {
        name : 'Home'
      } )
    }
    // watchEffect(()=>{
    //   console.log( 'watchEffect',selectedObj.selectedKeys[0]  )
    //
    // })
    onBeforeRouteUpdate( ( r , m ) => {
      console.log( r , m )
    } )
    onMounted( () => {
      if ( session.get("menuKeys") ){
        selectedKeys.value = [session.get("menuKeys")]
      }
      meFind()
    } )
    return {
      // selectedObj,
      selectedKeys ,
      selClick ,
      goEtin,
      loading,
      times,
      visible_user,
      visible_password,
      userDetails,
      formState,
      formPassword,
      showModalUser,
      showModalPassword,
      handleOkUserEdit,
      handleOkPasswordEdit,
      handleCancel,
      check,
      goHome,
      labelCol: { style: { width: '100px' } },
      wrapperCol: { span: 17 }
    };
  } ,
  
} );

</script>

<style scoped>
#components-layout-demo-top .logo {
  float: left;
  width: 150px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
  line-height: 30px;
}

.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}
</style>