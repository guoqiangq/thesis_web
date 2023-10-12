<template>
  <div>
    <a-card style="width:100%;">
      <template #title>
        <div style="background: #ffffff;">炫宝管理</div>
      </template>
      <div  style="display: flex;flex-wrap:wrap;background: #f5f5f5;margin: -24px;padding: 24px;" >
        <div style="width: 23% ;margin:0 1% 20px;position:relative;" v-for="item in tableList" class="card_divboy">
          <a-card hoverable  :key="item.id"  @click="goDetails(item.id)">
            <template #cover>
              <img height="200"
                   alt="example"
                   :src="item.imgList"
              />
            </template>
            <template #actions>
              <div style="text-align: left;padding:0 10px;">
                <a-avatar :src="item.avatar" :size="18" /> {{ item.user_name }}
                <span style="padding-left: 40px;float: right;">  {{ item.time }}</span>
              </div>
            </template>
            <a-card-meta :title="item.title" :description="item.description">
            </a-card-meta>
          </a-card>
          <div class="card_divboy_remve" @click="removeItem(item)">
            <span>删除</span>
          </div>
        </div>

      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import {defineComponent , onMounted , Ref , ref} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {getPublishAllList, postPublishDelete} from '@/api'

interface DataItem {
  id: number,
  time:string,
  title: string,
  description: number,
  content: string,
  img:any;
  imgList:any;
  avatar:string,
  user_name:string,
}
export default defineComponent( {
  name : "ShareAllList",
  components : {  } ,
  setup(){
    const router = useRouter();
    const store = useStore()
    const router_query = router.currentRoute.value.query;
    const tableList: Ref<DataItem[]> = ref([]);
    // 查询
    const seacth = () => {
      let params = {
        name : "",
        user_id:router_query.id
      }
      getPublishAllList(params).then((res:any)=>{
        if ( res.data.code !==0 ) return;
        tableList.value = res.data.data;
        tableList.value.forEach((i:any)=>{
          if ( i.img ){
            i.imgList = i.img.split(",")[0]
          }
        })
      })
    };
    // 查询
    const removeItem = (item:any) => {
      let params = {
        id:item.id,
        user_id:item.user_id
      }
      postPublishDelete(params).then((res:any)=>{
        if ( res.data.code !==0 ) return;
        seacth()
      })
    };
    const goDetails = (key: any) => {
      store.commit( "changeBreadcrumb" , [...store.state.breadcrumbList,...[ {
        title:'炫宝详情',
        route:{name:'ShareDetails',query:{id:key}}
      } ] ])
      
      router.push({name:'ShareDetails',query:{id:key}})
    };
    onMounted(()=>{
      seacth()
    })
    return {
      tableList,
      goDetails,
      removeItem
    }
  }
} )
</script>

<style >
.card_divboy_remve{
  display: none;
  position: absolute;
  bottom:0;
  left:0;
  right:0;
  height:100px;
  background: rgba(0,0,0,0.5);
  color: red;
  line-height: 100px;
  text-align: center;
  font-size: 18px;
}
.card_divboy:hover .card_divboy_remve{
    display: block;

}
</style>