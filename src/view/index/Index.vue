<template>
  <!--<div style="padding: 20px;">-->
  <!--  -->
  <!--</div>-->
  <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      
      <a-row justify="space-between">
        <a-col :span="4">
          <span style="color: #f9f9f9">宝友炫赏广场</span>
        </a-col>
        <a-col :span="4">
        
        </a-col>
        <a-col :span="4" class="text-right">
          <a-button type="text" style="color: #646cff;" @click="goLogin">登录</a-button>
          <a-button type="text" class="ml-4" style="color: darkgoldenrod;" @click="goSign">注册</a-button>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content :style="{ marginTop: '64px' }" class="laoutBody">
      <div  class="index_back" style="padding: 40px 10%;">
        <div style="margin-top: -20px;">
          <a-input-search
              v-model:value="searthValue"
              placeholder="查询标题"
              enter-button
              @search="table_Data"
          />
        </div>
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData" style="margin-top: 20px;background: #ffffff;padding-bottom: 20px;">
          <template #renderItem="{ item }">
            <a-list-item :key="item.id" style="background: #ffffff;">
              <a-list-item-meta >
                <template #title>
                  <a href="javascript:void (0);"  @click="goDetails(item.id)">{{ item.title }}标题</a>
                </template>
                <template #description>
                  <a-avatar :src="item.avatar" :size="18" /> {{ item.user_name }}发布 · {{ item.time }}
                </template>
              </a-list-item-meta>
              <template #actions>
                <span><component is="StarOutlined" style="margin-right: 8px" @click="onCollect(item.id)"/>{{ item.is_collect }}</span>
                <span><component is="LikeOutlined" style="margin-right: 8px" @click="giveLike(item.id)"/>{{ item.is_like }}</span>
                <span><component is="MessageOutlined" style="margin-right: 8px" @click="onComment(item.id)"/>{{ item.comment }}</span>
              </template>
              <template #extra>
                <img
                    width="150"
                    :src="item.imgList"
                />
              </template>
              
              <div @click="goDetails(item.id)">
                {{ item.description }}简介
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>
      
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts">
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { defineComponent,onMounted,ref,getCurrentInstance } from 'vue';
import { useRouter } from "vue-router"
import {getPublishAllList , postPublishCollect,postPublishGiveLike,postPublishComment } from '@/api'
import type { Ref } from 'vue';
import session from '@/plugins/storage.ts'



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
  imgList:any;
}

export default defineComponent({
  components: {
    StarOutlined,
    LikeOutlined,
    MessageOutlined,
  },
  setup() {
    const { proxy }= getCurrentInstance() as any;
    const router = useRouter();
    const listData: Ref<DataItem[]> = ref([]);
    const searthValue = ref("")
    const pagination = {
      onChange: (page: number) => {
        console.log(page);
      },
      pageSize: 10,
    };
    const actions: Record<string, string>[] = [
      { type: 'StarOutlined', text: '156' },
      { type: 'LikeOutlined', text: '156' },
      { type: 'MessageOutlined', text: '2' },
    ];
    
    // 获取数据
    const table_Data = ()=>{
      let params = {
        name:searthValue.value
      }
      getPublishAllList(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        listData.value = res.data.data;
        listData.value.forEach((i:any)=>{
          if ( i.img ){
            i.imgList = i.img.split(",")[0]
          }
        })
        console.log( listData.value )
      })
    }
    //收藏
    const onCollect = (key:any)=>{
      let params = {
        essay_id:key,
        user_id : session.get("userId"),
        is_collect:1
      }
      postPublishCollect(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('收藏成功!');
        table_Data()
      })
    }
    //点赞
    const giveLike = (key:any)=>{
      let params = {
        essay_id:key,
        user_id : session.get("userId"),
        is_like:1
      }
      postPublishGiveLike(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('点赞成功!');
        table_Data()
      })
    }
    // 评论
    const onComment = (key:any)=>{
      let params = {
        essay_id:key,
        user_id : session.get("userId"),
        comment:'评论内容'
      }
      postPublishComment(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('评论成功!');
        table_Data()
      })
    }
    // 跳转详情
    const goDetails = (key:any)=>{
      router.push({name:'ShareDetails',query:{id:key}})
    }
    // 登录
    const goLogin = ()=>{
      router.push({name:'Login'})
    }
    //注册
    const goSign = () => {
      router.push({
        name: 'SignIn'
      })
    }
    onMounted(()=>{
      table_Data()
    })
    return {
      searthValue,
      listData,
      pagination,
      actions,
      table_Data,
      goLogin,
      goSign,
      onCollect,
      giveLike,
      onComment,
      goDetails
    };
  },
});
</script>
<style scoped>
.laoutBody{
  height: calc(100vh - 134px);
  overflow: auto;
}
</style>