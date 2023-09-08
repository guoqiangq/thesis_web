<template>
  <div class="back_fff pa-5">
      <a-row type="flex" class="mb-4 ">
        <a-col flex="auto">
          <a-form
              name="horizontal_login"
              layout="inline"
              autocomplete="off"
          >
            <a-form-item
                label="标题"
                name="username"
            >
              <a-input v-model:value="seatchName"></a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="seacth">查询</a-button>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col flex="200px" class="text-right">
          <a-button @click="setAdd">炫宝发布</a-button>
        </a-col>
      </a-row>
    <a-table bordered :data-source="tableList" :columns="tableColumns">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'content'">
          <div class="white_space">{{ record.content }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <!--<a href="javascript:void (0);" @click="onDetails(record.id)">详情</a>-->
          <!--<a href="javascript:void (0);" @click="onDetails(record.id)">删除</a>-->
          <a-button type="link" style="margin-right: 12px;" @click="onDetails(record.id)">详情</a-button>
          <a-button type="link" danger  @click="onDetect(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref,onMounted,getCurrentInstance } from 'vue';
import type { Ref } from 'vue';
import { UserOutlined, LockOutlined ,CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import {useRouter} from 'vue-router'
import {getPublishList , postPublishDelete} from '@/api'
import session from '@/plugins/storage'
import {useStore} from 'vuex'

interface DataItem {
  id: number,
  time:string,
  title: string,
  description: number,
  content: string
}

export default defineComponent( {
  name : "ShareList",
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
    const seatchName = ref<string>('');
    const tableColumns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '时间',
        dataIndex: 'time',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '25%',
      },
      {
        title: '内容',
        dataIndex: 'content',
        width: '25%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '200px',
      },
    ];
    const tableList: Ref<DataItem[]> = ref([]);
    
    
    const onFinish = (values: any) => {
      console.log('Success:', values);
    };
    // 查询
    const seacth = () => {
      let params = {
        title : seatchName.value,
        user_id:session.get("userId")
      }
      getPublishList(params).then((res:any)=>{
        if ( res.data.code !==0 ) return;
        tableList.value = res.data.data;
      })
    };
    //删除
    const onDetect = (key: any) => {
      let params = {
        id : key,
        user_id:session.get("userId")
      }
      postPublishDelete(params).then((res:any)=>{
        if ( res.data.code !==0 ) return;
        proxy.$message.success('删除成功!');
        seacth()
      })
    };
    //新建
    const setAdd = () =>{
      store.commit( "changeBreadcrumb" , [...store.state.breadcrumbList,...[ {
        title:'新增炫宝',
        route:{name:'ShareAdd',query:{}}
      } ] ])
      router.push({name:'ShareAdd'})
    };
    const onDetails = (key: string) => {
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
      seatchName,
      onFinish,
      seacth,
      setAdd,
      tableColumns,
      onDetails,
      onDetect,
      tableList,
    };
  },
} )
</script>

<style scoped>

</style>