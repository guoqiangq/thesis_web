<template>
  <div class="back_fff pa-5" style="margin: 0 40% 0 5%;">
    <p style="text-align: center;font-size: 18px; margin: 10px 0 40px;">新增炫宝</p>
    <a-form name="nest-messages" :label-col="labelCol" :model="formState" v-bind="layout">
      <a-form-item label="标题" :rules="[{ required: true }]">
        <a-input v-model:value="formState.title"  />
      </a-form-item>
      <a-form-item label="描述" :rules="[{ required: true }]">
        <a-input v-model:value="formState.description" />
      </a-form-item>
      <a-form-item label="赏图" :rules="[{ required: true }]">
        <a-upload
            accept="image/png, image/jpeg, image/jpg, image/webp"
            v-model:file-list="fileList"
            list-type="picture-card"
            @preview="handlePreview"
            :customRequest="customRequest"
        >
          <div>
            <plus-outlined />
            <div style="margin-top: 8px">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="内容">
        <a-textarea v-model:value="formState.content" placeholder="内容" :rows="4" />
      </a-form-item>
      <a-form-item :wrapper-col="{offset: 6 }">
        <a-button type="primary" @click="subClick">发布</a-button>
      </a-form-item>
    </a-form>
    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import {defineComponent , reactive,ref ,getCurrentInstance } from 'vue'
import type { UploadProps } from 'ant-design-vue';
import {imagePuload,postPublishAdd} from '@/api'
import {useRouter} from 'vue-router'
import session from '@/plugins/storage.ts'

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

interface formState {
  title:'',
  description:'',
  content:''
}
export default defineComponent( {
  name : "ShareAdd",
  components: {
    PlusOutlined,
  },
  setup(){
    const { proxy }= getCurrentInstance() as any;
    const router = useRouter();
    const layout = {
      // labelCol: { span: 6 ,offset:0},
      wrapperCol: { span: 10 },
    };
    const formState = reactive<formState>({
      title:'',
      description:'',
      content:''
    });
    const previewVisible = ref(false);
    const previewImage = ref('');
    const previewTitle = ref('');
    const fileList = ref([]);
    
    const handleCancel = () => {
      previewVisible.value = false;
      previewTitle.value = '';
    };
    const handlePreview = async (file: UploadProps['fileList'][number]) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
      previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
    };
    //上传图片
    const customRequest = ( options:any )=>{
      let { file, onProgress,onSuccess,onError } = options;
      let f = file;
      f.status = "uploading";
      console.log( f )
      let time:any = new Date().getTime();
      let formData = new window.FormData();
      formData.append( 'file' , f );
      formData.append( 'name' , f.name );
      formData.append( 'time' , time );
      imagePuload(formData).then((res:any)=>{
        console.log( res )
        onProgress( { percent:100 });
        if ( res.data.code === 0 ){
          f.status = "success";
          onSuccess(res.data.data[0],f);
          // onError()
          proxy.$message.success('上传成功!');
          console.log( fileList.value )
          // fileList.value.push({
          //   uid: '-1',
          //   name: 'image.jpg',
          //   status: 'done',
          //   url: res.data.data[0],
          // })
        }else{
          onError()
        }
       
      })
    }
    
    // 提交
    const subClick = ()=>{
      
      let params = {
        title:formState.title,
        description:formState.description,
        content:formState.content,
        img:fileList.value.map((i:any)=>i.response).toString(),
        user_id:session.get("userId")
      }
      postPublishAdd(params).then((res:any)=>{
        console.log( res )
        proxy.$message.success('新增成功!');
        router.go(-1)
      })
    }
    
    
    return {
      layout,
      formState,
      labelCol: { style: { width: '150px' } },
      previewVisible,
      previewImage,
      fileList,
      handleCancel,
      handlePreview,
      previewTitle,
      customRequest,
      subClick
    }
  }
} )
</script>

<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>