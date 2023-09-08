<template>
  <div class="back_fff pa-5" style="width:60%;min-height: 60vh;">
    <a-form
        name="horizontal_login"
        layout="inline"
        autocomplete="off"
        class="mb-4"
    >
      <a-form-item
          label="用户昵称"
          name="username"
      >
        <a-input v-model:value="seacthName"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="seacth">查询</a-button>
      </a-form-item>
    </a-form>
    <a-table bordered :data-source="dataSource" :columns="columns">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-popconfirm
              v-if="record.status==1"
              title="加入黑名单后将无法看到其相关作品,是否拉黑?"
              @confirm="onEdit(record.id,'-1')"
          >
            <a>加入黑名单</a>
          </a-popconfirm>
          <a-popconfirm
              v-if="record.status==-1"
              title="是否取消拉黑?"
              @confirm="onEdit(record.id,'1')"
          >
            <a>取消黑名单</a>
          </a-popconfirm>
          <a-popconfirm
              class="ml-4"
              title="是否删除好友?"
              @confirm="onDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
          <a-button type="link" style="margin-left: 12px;" @click="onDetails(record.friend_id)">详情</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref ,onMounted } from 'vue';
import type { Ref  } from 'vue';
import { UserOutlined, LockOutlined ,CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import {postFriendEdit , getFriendList , postFriendRemove} from '@/api'
import session from '@/plugins/storage.ts'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'

interface DataItem {
  id: any;
  friend_name: string;
  friend_id: string;
  gender: string;
  phone: string;
  age: number;
  remark: string;
}

export default defineComponent( {
  name : "FriendList",
  components: {
    UserOutlined,
    LockOutlined,
    CheckOutlined,
    EditOutlined,
  },
  setup() {
    const { proxy }= getCurrentInstance() as any;
    const router = useRouter();
    const store = useStore()
    const seacthName = ref('');
    const columns = [
      {
        title: '用户昵称',
        dataIndex: 'friend_name',
       
      },
      {
        title: '性别',
        dataIndex: 'gender',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '个人签名',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        dataIndex: 'operation',
      },
    ];
    const dataSource: Ref<DataItem[]> = ref([]);
    
    //查询
    const seacth = () => {
      console.log('查询:');
      let params = {
        name:seacthName.value,
        user_id: session.get("userId")
      }
      getFriendList(params).then((res:any)=>{
        if ( res.data.code !==0 ) return;
        dataSource.value = res.data.data;
      })
    };
    const onEdit = (key: string,status:string) => {
      let params = {
        id :key,
        status:status
      }
      postFriendEdit(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('操作成功!');
        seacth()
      })
    };
    const onDelete = (key: string) => {
      let params = {
        id :key
      }
      postFriendRemove(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('好友删除成功!');
        seacth()
      })
    };
    const onDetails = (key:any)=>{
      store.commit( "changeBreadcrumb" , [...store.state.breadcrumbList,...[ {
        title:'宝友详情',
        route:{name:'FriendDetails',query:{id:key}}
      } ] ])
      router.push({
        name:'FriendDetails',
        query:{
          id:key
        }
      })
    }
    onMounted(()=>{
      seacth()
    })
    return {
      seacthName,
      seacth,
      columns,
      onDelete,
      onEdit,
      dataSource,
      onDetails
    };
  },
} )
</script>

<style scoped>

</style>