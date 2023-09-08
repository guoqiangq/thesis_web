<template>
  <div>
    <a-row type="flex" justify="space-between">
      <a-col flex="auto" style="padding-right: 10px;" :span="15">
        <a-card title="文宝详情" :bordered="false" >
          <template #extra>
            <div>
              <span><component is="StarOutlined" style="margin-right: 8px;font-size: 20px;" @click="onCollect()"/>{{ shareDetails.is_collect }}</span>
              <span style="margin-left: 20px;"><component is="LikeOutlined" style="margin-right: 8px;font-size: 20px;" @click="giveLike()"/>{{ shareDetails.is_like }}</span>
            </div>
          </template>
          <p><span>文宝标题 ：  </span> <span style="font-size: 16px;font-weight: 600;">{{ shareFind.title }}</span></p>
          <p><span>发布时间 ：  </span> <span style="font-size: 13px;font-weight: 400;color:#858484;">{{ shareFind.time }}</span></p>
          <p><span>文宝描述 ：  </span> <span style="font-size: 13px;font-weight: 400;color:#858484;">{{ shareFind.description }}</span></p>
          <p><span>文宝美图 ：  </span>
            <div style="padding: 10px 20px 30px 70px; ">
              <a-image-preview-group>
              <a-image :width="200" v-for="(item,index) in shareFind.imgList" :src="item" :key="index" style="border: 1px solid #dddddd;"/>
              </a-image-preview-group>
            </div>
          </p>
          <p><span>文宝内容 ：  </span>
            <div style="font-size: 14px;font-weight: 400;white-space: pre-wrap;padding: 10px 20px 30px 70px;">{{ shareFind.content }}</div>
          </p>
        </a-card>
      </a-col>
      <a-col flex="480px" :span="9">
        <a-card  style="width: 100%">
          <template #title>
            <span>评论</span>
            <a-popconfirm placement="bottom" ok-text="评论" cancel-text="取消" @confirm="onComment">
              <template #icon><span></span></template>
              <template #title>
                <div style="width: 300px;">
                  <a-textarea v-model:value="comment" placeholder="评论内容" auto-size/>
                </div>
              </template>
              <a-button size="small" type="link"><EditOutlined></EditOutlined></a-button>
            </a-popconfirm>
          </template>
          <template #extra>合计: {{ shareDetails.comment }} 条</template>
          <a-list
              class="demo-loadmore-list"
              item-layout="horizontal"
              :data-source="commentList"
          >
            <!--<template #loadMore>-->
            <!--  <div-->
            <!--      v-if="!initLoading && !loading"-->
            <!--      :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"-->
            <!--  >-->
            <!--    <a-button @click="onLoadMore">loading more</a-button>-->
            <!--  </div>-->
            <!--</template>-->
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <!--<a key="list-loadmore-edit">删除</a>-->
                  <a key="list-loadmore-more" style="color:red;">删除</a>
                </template>
                <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                  <a-list-item-meta
                      :description="item.content"
                  >
                    <template #title>
                      <div>
                        <span>{{ item.user_name }}</span>
                        <span style="float: right;color: #888888;font-weight: 400;font-size: 13px;">于 {{ item.time }} 评论</span>
                      </div>
                      
                    </template>
                    <template #avatar>
                      <a-avatar :src="item.avatar" />
                      <div style="padding: 15px 0;color:#ff4d4f;cursor: pointer;" v-if="!item.is_friend&&item.user_id!=userId" @click="addFriend(item.user_id)">加关注</div>
                      <div style="padding: 15px 0;color:#55ec5d;" v-if="item.is_friend&&item.user_id!=userId">已关注</div>
                    </template>
                  </a-list-item-meta>
                </a-skeleton>
              </a-list-item>
            </template>
          </a-list>
          <a-list
              class="demo-loadmore-list"
              :loading="initLoading"
              item-layout="horizontal"
              :data-source="list"
          >
            <template #loadMore>
              <div
                  v-if="!initLoading && !loading"
                  :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
              >
                <a-button @click="onLoadMore">loading more</a-button>
              </div>
            </template>
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <!--<a key="list-loadmore-edit">删除</a>-->
                  <a key="list-loadmore-more" style="color:red;">删除</a>
                </template>
                <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                  <a-list-item-meta
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  >
                    <template #title>
                      <div>
                        <span>{{ item.name.last }}</span>
                        <span style="float: right;color: #888888;font-weight: 400;font-size: 13px;">于 2023-06-14 12:14:51 评论</span>
                      </div>
                    
                    </template>
                    <template #avatar>
                      <a-avatar :src="item.picture.large" />
                      <div style="padding: 15px 0;color:#55ec5d;">已关注</div>
                    </template>
                  </a-list-item-meta>
                </a-skeleton>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import {defineComponent , onMounted , ref,nextTick ,getCurrentInstance } from 'vue'
import {useRouter} from 'vue-router'
import {
  getPublish ,
  getPublishCommentList ,
  postFriendAdd ,
  postPublishCollect ,
  postPublishComment ,
  postPublishGiveLike
} from '@/api'
import { StarOutlined, LikeOutlined, MessageOutlined , EditOutlined } from '@ant-design/icons-vue';
import session from '@/plugins/storage.ts'


const fakeDataUrl = `https://randomuser.me/api/?results=5&inc=name,gender,email,nat,picture&noinfo`;

export default defineComponent( {
  name : "ShareDetails" ,
  components: {
    StarOutlined,
    LikeOutlined,
    MessageOutlined,
    EditOutlined
  },
  setup () {
    const { proxy }= getCurrentInstance() as any;
    const router = useRouter();
    const router_query = router.currentRoute.value.query;
    const shareFind = ref( {
      content : "" ,
      description : "" ,
      id : 0 ,
      img : null ,
      time : null ,
      title : "" ,
      user_id : 0,
      imgList:[]
    } );
    const shareDetails = ref( {
      comment : 0 ,
      is_collect : 0 ,
      is_like : 0
    } );

    
    const comment = ref('');
    const userId = ref('');
    const initLoading = ref(true);
    const loading = ref(false);
    const data = ref([]);
    const list = ref([]);
    const commentList = ref([]);
    
    //详情
    const getDataDetails = () => {
      let params = {
        id : router_query.id,
        user_id: userId.value
      }
      getPublish( params ).then( ( res : any ) => {
        if ( res.data.code !== 0 ) return;
        let { data_find , data_details } = res.data.data;
        shareFind.value = data_find;
        if ( shareFind.value.img ){
          shareFind.value.imgList = data_find.img.split(',');
          console.log( shareFind.value.imgList )
        }
        shareDetails.value = data_details;
      } )
    }
    //评论列表
    const getCommentData = () => {
     
      let params = {
        id : router_query.id,
        user_id: userId.value
      }
      getPublishCommentList( params ).then( ( res : any ) => {
        if ( res.data.code !== 0 ) return;
        commentList.value = res.data.data;
       
      } )
    }
    //收藏
    const onCollect = ()=>{
      let params = {
        essay_id:shareFind.value.id,
        user_id: userId.value,
        is_collect:1
      }
      postPublishCollect(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('收藏成功!');
        getDataDetails()
      })
    }
    //点赞
    const giveLike = ()=>{
      let params = {
        essay_id:shareFind.value.id,
        user_id: userId.value,
        is_like:1
      }
      postPublishGiveLike(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('点赞成功!');
        getDataDetails()
      })
    }
    // 评论
    const onComment = ()=>{
      let params = {
        essay_id:shareFind.value.id,
        user_id: userId.value,
        comment:comment.value
      }
      postPublishComment(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('评论成功!');
        comment.value="";
        getDataDetails();
        getCommentData()
      })
    }
    
     // 添加好友
    const addFriend = (key:any)=>{
      let params = {
        friend_id:key,
        user_id: userId.value
      }
      postFriendAdd(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('添加好友成功!');
        getCommentData()
      })
    }
    
    
    const onLoadMore = () => {
      loading.value = true;
      // list.value = data.value.concat( [...new Array(5)].map(() => ({ loading: true, name: {}, picture: {} })), );
      fetch(fakeDataUrl)
          .then(res => res.json())
          .then(res => {
            const newData = data.value.concat(res.results);
            loading.value = false;
            data.value = newData;
            list.value = newData;
            nextTick(() => {
              // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
              // In real scene, you can using public method of react-virtualized:
              // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
              window.dispatchEvent(new Event('resize'));
            });
          });
    };
    
    onMounted( () => {
      // 打印
      userId.value = session.get("userId");
      getDataDetails()
      getCommentData()
      fetch(fakeDataUrl)
          .then(res => res.json())
          .then(res => {
            initLoading.value = false;
            data.value = res.results;
            list.value = res.results;
          });
    } )
    return {
      shareFind ,
      shareDetails,
      loading,
      initLoading,
      data,
      userId,
      list,
      comment,
      commentList,
      onLoadMore,
      onCollect,
      giveLike,
      onComment,
      addFriend
    }
  }
} )
</script>

<style scoped>

</style>