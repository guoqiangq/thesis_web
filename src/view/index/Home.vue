<template>
  <div style="padding: 40px 10%;" class="back_fff">
    <div style="margin-top: -20px;">
      <a-input-search
          v-model:value="searthValue"
          placeholder="查询标题"
          enter-button
          @search="table_Data"
      />
    </div>
    <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData" style="margin-top: 20px">
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
</template>

<script lang="ts">
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { defineComponent,onMounted,ref,getCurrentInstance } from 'vue';
import { useRouter } from "vue-router"
import {getPublishUnblackenAll , postPublishCollect,postPublishGiveLike,postPublishComment } from '@/api'
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
  name:"Home",
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
        name:searthValue.value,
        user_id: session.get("userId")
      }
      getPublishUnblackenAll(params).then((res:any)=>{
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
  height: calc(100vh - 135px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
}
.index-qrcode{
  position: relative;
}
.index-refresh{
  position:absolute;
  top:0;
  right: 0;
  bottom:0;
  left: 0;
  background:rgba(0,0,0,.6);
  color:#fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}
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