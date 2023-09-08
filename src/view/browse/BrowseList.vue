<template>
  <div class="back_fff pa-5">
    <a-tabs v-model:activeKey="activeKey" type="card" @change="tabChange">
      <a-tab-pane key="1" tab="赏宝足迹">
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData" style="background: #ffffff;padding: 20px;">
          <template #renderItem="{ item }">
            <a-list-item :key="item.id" @click="goDetails(item.essay_id)">
              <a-list-item-meta >
                <template #title>
                  <a href="javascript:void (0);" >{{ item.title }}标题</a>
                </template>
                <template #description>
                  <a-avatar :src="item.avatar" :size="18" /> {{ item.user_name }}发布 · {{ item.time }}
                </template>
                
                <!--<template #avatar><a-avatar :src="item.avatar" /></template>-->
              </a-list-item-meta>
              <template #actions>
                <span><component is="StarOutlined" style="margin-right: 8px" />{{ item.is_collect }}</span>
              <span><component is="LikeOutlined" style="margin-right: 8px" />{{ item.is_like }}</span>
              <span><component is="MessageOutlined" style="margin-right: 8px" />{{ item.comment }}</span>
              </template>
              <template #extra>
                <img
                    width="150"
                    alt="logo"
                    :src="item.imgList"
                />
              </template>
              
              <div>
                {{ item.description }}简介
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="2" tab="我的点赞">
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="browseGiveLikeList" style="background: #ffffff;padding: 20px;">
          <template #renderItem="{ item }">
            <a-list-item :key="item.id" @click="goDetails(item.essay_id)">
              <a-list-item-meta >
                <template #title>
                  <a href="javascript:void (0);" >{{ item.title }}标题</a>
                </template>
                <template #description>
                  <a-avatar :src="item.avatar" :size="18" /> {{ item.user_name }}发布 · {{ item.time }}
                </template>
                
                <!--<template #avatar><a-avatar :src="item.avatar" /></template>-->
              </a-list-item-meta>
              <template #actions>
                <span><component is="StarOutlined" style="margin-right: 8px" />{{ item.is_collect }}</span>
              <span><component is="LikeOutlined" style="margin-right: 8px" />{{ item.is_like }}</span>
              <span><component is="MessageOutlined" style="margin-right: 8px" />{{ item.comment }}</span>
              </template>
              <template #extra>
                <img
                    width="150"
                    alt="logo"
                    :src="item.imgList"
                />
              </template>
              
              <div>
                {{ item.description }}简介
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="3" tab="我的收藏">
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="browseCollectList" style="background: #ffffff;padding: 20px;">
          <template #renderItem="{ item }">
            <a-list-item :key="item.id" @click="goDetails(item.essay_id)">
              <a-list-item-meta >
                <template #title>
                  <a href="javascript:void (0);" >{{ item.title }}标题</a>
                </template>
                <template #description>
                  <a-avatar :src="item.avatar" :size="18" /> {{ item.user_name }}发布 · {{ item.time }}
                </template>
                
                <!--<template #avatar><a-avatar :src="item.avatar" /></template>-->
              </a-list-item-meta>
              <template #actions>
                <span><component is="StarOutlined" style="margin-right: 8px" />{{ item.is_collect }}</span>
              <span><component is="LikeOutlined" style="margin-right: 8px" />{{ item.is_like }}</span>
              <span><component is="MessageOutlined" style="margin-right: 8px" />{{ item.comment }}</span>
              </template>
              <template #extra>
                <img
                    width="150"
                    alt="logo"
                    :src="item.imgList"
                />
              </template>
              
              <div>
                {{ item.description }}简介
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted } from 'vue';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import {useRouter} from 'vue-router'
import {getBrowseCollectList , getBrowseGiveLikeList , getBrowseList} from '@/api'
import type {Ref} from 'vue'
import session from '@/plugins/storage.ts'
import {useStore} from 'vuex'

interface DataItem {
  id: number;
  title: string;
  description: string;
  content: string;
  is_collect:number;
  is_like:number;
  comment:number;
  user_name:string;
  time:string;
  img:any;
  imgList:any
}

export default defineComponent( {
  name : "BrowseList",
  components: {
    StarOutlined,
    LikeOutlined,
    MessageOutlined,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const activeKey = ref<any>('1');
    const listData: Ref<DataItem[]> = ref([]);
    const browseCollectList: Ref<DataItem[]> = ref([]);
    const browseGiveLikeList: Ref<DataItem[]> = ref([]);
    const pagination = {
      onChange: (page: number) => {
        console.log(page);
      },
      pageSize: 10,
    };
    // 切换
    const tabChange = ()=>{
      if ( activeKey.value==1 ){
        browseListData()
      }
      if ( activeKey.value==2 ){
        browseGiveLikeListData()
      }
      if ( activeKey.value==3 ){
        browseCollectListData()
      }
    }
    //浏览记录
    const browseListData = ()=>{
      let params = {
        user_id: session.get("userId")
      }
      getBrowseList(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return;
        listData.value = res.data.data;
        listData.value.forEach(i=>{
          if ( i.img ){
            i.imgList = i.img.split(',')[0]
          }
          
        })
      })
    }
    // 点赞记录
    const browseGiveLikeListData = ()=>{
      let params = {
        user_id: session.get("userId")
      }
      getBrowseGiveLikeList(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return;
        browseGiveLikeList.value = res.data.data;
        browseGiveLikeList.value.forEach(i=>{
          if ( i.img ){
            i.imgList = i.img.split(',')[0]
          }
          
        })
      })
    }
    // 收藏记录
    const browseCollectListData = ()=>{
      let params = {
        user_id: session.get("userId")
      }
      getBrowseCollectList(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return;
        browseCollectList.value = res.data.data;
        browseCollectList.value.forEach(i=>{
          if ( i.img ){
            i.imgList = i.img.split(',')[0]
          }
          
        })
      })
    }
    // 跳转详情
    const goDetails = (key:any)=>{
      store.commit( "changeBreadcrumb" , [...store.state.breadcrumbList,...[ {
        title:'炫宝详情',
        route:{name:'ShareDetails',query:{id:key}}
      } ] ])
      router.push({name:'ShareDetails',query:{id:key}})
    }
    
    onMounted(()=>{
      browseListData()
    })
    return {
      listData,
      browseCollectList,
      browseGiveLikeList,
      pagination,
      activeKey,
      goDetails,
      tabChange
    };
  },
} )
</script>

<style scoped>

</style>