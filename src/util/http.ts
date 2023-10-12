import axios from 'axios'
import apiConfig from "../api/config"
import router from '../router'
import session from '../plugins/storage'
import { message } from 'ant-design-vue';

const $message= message;
let Axios = axios;
let Router = router;
let isRefreshing = true; // 请求锁
let pendings:any[] = []; // 请求列表


const API_HOST = import.meta.env.VITE_NODE_ENV


function ajax ( url:String, data:Object, method = 'POST', type = 'application/x-www-form-urlencoded' ) {
  
  let token = session.get( 'assess_Token' );
  console.log(token);
  let options = {
    url : url,
    header : {
      'Accept' : "*/*",
      "content-type" : type ? type : 'application/json',
      "Authorization":token,
      "referer":''
    },
    method,
    data,
    timeout : 180 * 1000,
    params:{}
  }
  if ( method === 'GET' ) options.params = data
  if ( token ) options.header.Authorization = token;
  // console.log(process.env,'-qww')
  if ( API_HOST!= 'production' ){
    // console.log(API_HOST)
    options.header.referer = 'https://api.songshu.cloud'
  }
  // console.log( 'header',options.header )
  return new Promise( ( resolve, reject ) => {
    let a = {};
    a = options
    Axios( a ).then( res => {
      
      if ( res.data.code === 0 || res.data.code === 404 ) { // 请求正常
        resolve( res )
      }
      else if ( res.data.code === 908||res.data.code === 401 ) {
        if ( isRefreshing ) { // 第一个接受到的token失效请求 重新登录
          toLogin()
        }
        isRefreshing = false; // 拦截其他请求防止多次跳转首页
        pendings.push( () => {
          resolve( ajax( url, data, method, type ) )
        } )
      }
      else if ( res.data.code === 909 || res.data.code === 911 || res.data.code === 980 ) { // token 失效
        if ( isRefreshing ) { // 第一个接受到的token过期请求 刷新token
          refreshTokenRequst()
        }
        isRefreshing = false; // 正在刷新token 将其他请求放到请求列表中
        pendings.push( () => {
          resolve( ajax( url, data, method, type ) )
        } )
      }
      else if(res&&res.data){
        $message.error( res.data.data?.message || res.data.message|| res.data.msg );
        resolve( res );
      }
      else {
        reject( { msg : '未返回数据:error' } );
      }
    } ).catch( err => {
      reject( err );
    } )
  } )
}

// 刷新token函数
function refreshTokenRequst () {
  let token = session.get( 'refresh_Token' );
  session.set( 'assess_Token', token );
  let type = 'application/x-www-form-urlencoded';
  let a = {
    url : apiConfig.domainUrl + '/v1/sign/auto',
    method : "POST",
    header : {
      'Accept' : "*/*",
      "content-type" : type ? type : 'application/json',
      "Authorization" : token
    }
  }
  Axios( a ).then( ( res ) => {
    if ( res.data.code == 0 ) {
      // 刷新完成后,将刷新token存储到本地1
      let { access_token } = res.data.token;
      session.set( 'assess_Token', access_token );

      
      // 并且将所有存储到观察者数组中的请求重新执行。
      onAccessTokenFetched();
      isRefreshing = true;
    } else {
      toLogin();
    }
    
  } ).catch(err=>{
    console.log(err)
    toLogin();
  })
}

// 刷新token后执行请求列表
function onAccessTokenFetched () {
  pendings.forEach( ( callback ) => {
    callback();
  } )
  pendings = [];
}

// 前往登录页面 清空状态
function toLogin () {
  // 登录
  $message.warning('登录已过期,请重新登录!!');
  session.clear();
  Router.replace( { name : 'Index' } );
  
  setTimeout( () => {
    isRefreshing = true;
    pendings = [];
    window.location.reload()
  }, 500 )
}

export {
  ajax
};