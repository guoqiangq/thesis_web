<template>
  <div >
    <a-row type="flex" justify="space-between">
      <a-col flex="auto" style="padding-right: 20px;" :span="16" >
        <a-card style="width:100%;">
          <template #title>
            <div style="background: #ffffff;">宝友炫宝</div>
          </template>
          <div  style="display: flex;flex-wrap:wrap;background: #f5f5f5;margin: -24px;padding: 24px;">
            <a-card hoverable style="width: 31% ;margin:0 1% 20px;" :key="item.id" v-for="item in tableList" @click="goDetails(item.id)">
              <template #cover>
                <img height="200"
                    alt="example"
                    :src="item.imgList"
                />
              </template>
              <template #actions>
                发布时间 ： {{ item.time }}
              </template>
              <a-card-meta :title="item.title" :description="item.description">
              </a-card-meta>
            </a-card>
          </div>
        </a-card>
       
      </a-col>
      <a-col flex="400px" :span="8">
        <a-card title="宝友信息" >
        <div style="text-align: center;padding: 0 40px;">
          <a-avatar :src="userDetails.avatar" :size="80" />
          <div style="font-weight: 600;margin: 10px;padding-bottom:10px;font-size: 16px;border-bottom : 1px solid #eee;">
            {{ userDetails.user_name }}</div>
         <div style="text-align:left;min-height: 200px;">
           <a-row type="flex" justify="space-between">
             <a-col flex="60px" >性别</a-col>
             <a-col flex="20px" >:</a-col>
             <a-col flex="auto" >{{ userDetails.gender }}</a-col>
           </a-row>
           <a-row type="flex" justify="space-between">
             <a-col flex="60px" >手机号</a-col>
             <a-col flex="20px" >:</a-col>
             <a-col flex="auto" >{{ userDetails.phone }}</a-col>
           </a-row>
           <a-row type="flex" justify="space-between">
             <a-col flex="60px" >邮箱</a-col>
             <a-col flex="20px" >:</a-col>
             <a-col flex="auto" >{{ userDetails.email }}</a-col>
           </a-row>
           <a-row type="flex" justify="space-between">
             <a-col flex="60px" >简介</a-col>
             <a-col flex="20px" >:</a-col>
             <a-col flex="auto" >{{ userDetails.remark }}</a-col>
           </a-row>
         </div>
        </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import {defineComponent,onMounted ,ref} from 'vue'
import {useRouter} from 'vue-router'
import {getPublishList , getUserFind} from '@/api'
import type {Ref} from 'vue'
import {useStore} from 'vuex'

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
interface DataItem {
  id: number,
  time:string,
  title: string,
  description: number,
  content: string,
  img:any;
  imgList:any;
}
export default defineComponent( {
  name : "FriendDetails",
  components : {  } ,
  setup(){
    const router = useRouter();
    const store = useStore()
    const router_query = router.currentRoute.value.query;
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
    const tableList: Ref<DataItem[]> = ref([]);
    // 获取个人信息
    const meFind = () => {
      getUserFind( { id : router_query.id } ).then( ( res : any ) => {
        if ( res.data.code !==0 ) return;
        userDetails.value = res.data.data;
      } )
    };
    // 查询
    const seacth = () => {
      let params = {
        title : "",
        user_id:router_query.id
      }
      getPublishList(params).then((res:any)=>{
        if ( res.data.code !==0 ) return;
        tableList.value = res.data.data;
        tableList.value.forEach((i:any)=>{
          if ( i.img ){
            i.imgList = i.img.split(",")[0]
          }
        })
      })
    };
    const goDetails = (key: string) => {
      store.commit( "changeBreadcrumb" , [...store.state.breadcrumbList,...[ {
        title:'炫宝详情',
        route:{name:'ShareDetails',query:{id:key}}
      } ] ])
      
      router.push({name:'ShareDetails',query:{id:key}})
    };
    onMounted(()=>{
      meFind()
      seacth()
    })
    return {
      userDetails,
      tableList,
      goDetails
    }
  }
} )
</script>

<style scoped>

</style>