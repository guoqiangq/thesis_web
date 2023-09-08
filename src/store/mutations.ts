//mutations.ts
const mutations= {
  //loading
  changeLoading( state:any , data = false ) {
    state.loadingShow = data
  },
  //路由缓存list
  changeKeepAlive ( state:any, data = [] ) {
    /**
     * 注意:列表中数据匹配的是页面的名称name值不是路由配置的name
     **/
    state.keepAliveList = data
  },
  //面包屑list
  changeBreadcrumb ( state:any, data = [] ) {
    /**
     * 注意:列表中数据匹配的是页面的名称name值不是路由配置的name
     **/
    state.breadcrumbList = data
  },
};
export default mutations;