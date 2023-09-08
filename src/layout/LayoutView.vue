<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <div class="example" v-if="store.state.loadingShow">
      <a-spin size="large" tip="loading..." />
    </div>
    <!--<LeftMenu></LeftMenu>-->
    <a-layout>
      <header-main></header-main>
      <a-layout-content class="a_layout_conent index_back">
        <a-breadcrumb style="margin-bottom: 12px;">
          <a-breadcrumb-item v-for="( item , index ) in store.state.breadcrumbList">
            <a href="javascript:void (0);" v-if="index<store.state.breadcrumbList.length" @click="goRoute(item)">{{ item.title }}</a>
            <span v-else>{{ item.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
        <div class="a_layout_conent_router-view ">
            <router-view v-slot="{Component}">
              <keep-alive :include="store.state.keepAliveList">
                <component :is="Component"></component>
              </keep-alive>
            </router-view>
        </div>
      </a-layout-content>
    </a-layout>
    
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex' // 引入useStore 方法
import HeaderMain from '../components/HeadMenu.vue'
import {useRouter} from 'vue-router'


export default defineComponent({
  components: {
    HeaderMain,
  },
  
  setup() {
    const router = useRouter();
    const store = useStore()  // 该方法用于返回store 实例
    const goRoute = (item:any)=>{
      router.push(item.route)
    }
    return {
      store,
      goRoute
    };
  },
  
});
</script>
<style>
#components-layout-demo-custom-trigger{
  height: 100vh;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  color: white;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
  text-align: center;
  color: white;
}

/*.site-layout .site-layout-background {*/
/*  background: #fff;*/
/*}*/
.a_layout_conent{
  padding: 24px 16px;
  /**height: calc(100vh - 64px) ;
  overflow: auto;**/
}
.a_layout_conent_router-view{
  margin: 0 -16px;
  padding: 24px;
  height: calc(80vh) ;
  overflow: auto;
  padding-top: 0px;
}
.example {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>