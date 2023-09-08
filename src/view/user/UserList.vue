<template>
  <div class="back_fff pa-5">
    <a-form
        name="horizontal_login"
        layout="inline"
        autocomplete="off"
        class="mb-4"
    >
      <a-form-item
          label="用户名"
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
        <template v-if="column.dataIndex === 'status'">
          <span>{{record.status=='-1'?'禁用':'启用'}}</span>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-popconfirm
              v-if="record.status!=='-1'&&record.rules!='admin'"
              title="禁用后用户将无法登录,是否禁用?"
              @confirm="onEdit(record.id)"
          >
            <a-button type="link" >禁用</a-button>
          </a-popconfirm>
          <a-popconfirm
              v-if="record.status=='-1'&&record.rules!='admin'"
              title="请确保用户处于禁用状态,是否进行启用操作?"
              @confirm="onDelete(record.id)"
          >
            <a-button type="link" >启用</a-button>
          </a-popconfirm>
          <a-button type="link"  @click="onDetails(record.id)">详情</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref ,onMounted } from 'vue';
import type { Ref  } from 'vue';
import { UserOutlined, LockOutlined ,CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { getUserList, posEditStatusUser} from '@/api'
import session from '@/plugins/storage.ts'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

interface DataItem {
  id: any;
  user_name: string;
  gender: string;
  age: number;
  remark: string;
  phone: string;
  email: string;
  status: string;
}

export default defineComponent( {
  name : "UserList",
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
        title: '用户',
        dataIndex: 'user_name',
        
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
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '个人签名',
        dataIndex: 'remark',
      },
      {
        title: '账号状态',
        dataIndex: 'status',
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
      getUserList(params).then((res:any)=>{
        if ( res.data.code !==0 ) return;
        dataSource.value = res.data.data;
      })
    };
    const onEdit = (key: string) => {
      let params = {
        id :key,
        status:'-1'
      }
      posEditStatusUser(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('禁用成功!');
        seacth()
      })
    };
    const onDelete = (key: string) => {
      let params = {
        id :key,
        status:'1'
      }
      posEditStatusUser(params).then((res:any)=>{
        if ( res.data.code !== 0 ) return
        proxy.$message.success('启用成功!');
        seacth()
      })
    };
    const onDetails = (key:any)=>{
      store.commit( "changeBreadcrumb" , [...store.state.breadcrumbList,...[ {
        title:'用户详情',
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