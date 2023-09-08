import axios from 'axios';
// @ts-ignore
import qs from "qs";
// import Message from '@/components/message/index.js'
import { ajax } from './http'
import store from '../store'
import session from '../plugins/storage'

// const $Message = Message;


/**
 * 拦截器
 */
function processUserToken() {
  // axios.defaults.withCredentials = false;
  axios.defaults.timeout = 180 * 1000;
  // axios.defaults.headers.post[ 'Content-Type' ] = 'application/x-www-form-urlencoded';
  axios.interceptors.request.use( function ( request ) {
    let usertoken = session.getLocal( 'assess_Token' ) || '';
    request.headers.Authorization = usertoken;
    return request;
  } , function () {
  
  } );
  
  axios.interceptors.response.use( function ( response ) {
    
    return response;
  } , function ( error ) {
    console.log( '异常' + error )
  } );
  
}

processUserToken();

/**
 * Get请求方法添加添加时间戳
 * @param url 完整url接口
 * @param params 需要传递的参数
 */

function getData( url:string , params:any ) {
  let nowTimestamp = new Date().getTime(); //时间戳，防止加载缓存
  if ( typeof ( params ) == "object" ) {
    params['_t'] = nowTimestamp;
  }
  else {
    params = {
      _t : nowTimestamp
    };
  }
  // let httpInput = {
  //   params : params
  // };
  let httpInput = params;

  return ajax( url , httpInput , "GET" );
}

//鉴权:
// function isDeny( r:string ) {
//   let storeState = store.state as any
//
//
//   if ( r && storeState.rules && storeState.rules.length ) {
//     if ( storeState.rules.findIndex( (rule:any) => r === rule ) === -1 ) {
//       alert( "禁止使用，扯呼……" )
//       return true;
//     }
//   }
//   return false;
// }

function postData( url:string , params:any , isQs = true ) {
  
  //鉴权
  //   if(isDeny(rule)){
  //     return;
  //   }
  
  let nowTimestamp = new Date().getTime();
  if ( typeof ( params ) == "object" ) {
    params[ "_t" ] = nowTimestamp;
  }
  else {
    params = {
      _t : nowTimestamp
    };
  }
  
  let formData = isQs ? qs.stringify( params ) : params
  return ajax( url , formData , 'POST' );
}

function putData( url:string , params:any ) {
  return axios.put( url , params );
}

function deleteData( url:string , params:any ) {
  
  return axios.delete( url , params );
}



/**
 * @returns {*}
 *  将 Date 转化为指定格式的String
 *  月(M)、日(d)、小时(h)、分(m)、秒(s) 可以用 1-2 个占位符
 *  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *  eg：
 *  DateFormat(new Date(), "yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *  DateFormat(new Date(), "yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param obj
 */
function dateFormat(obj={
  dates : new Date(), fmt : 'yyyy-MM-dd HH:mm:ss'
}) {
  let {dates = new Date(), fmt = 'yyyy-MM-dd HH:mm:ss'} = obj || {dates : new Date(), fmt:'yyyy-MM-dd HH:mm:ss'}
  
  
  let date = new Date(dates);
// dates.replace('T', " ")
  let o:any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let k:any;
  // const c = <T, K extends keyof T>(o: T, name: K): T[K] => {
  //   return o[name];
  // };
  for ( k in o) {
   
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}



/**
 * 加token的下载功能实现--后台为返回文件流
 */
function downloadData( url:string , params:object , data:{ type:'' , blob_type:'' ,suffix:''}) {
  let { type , blob_type ,suffix } = data || { type : "GET" , blob_type : 'application/vnd.ms-excel' ,suffix:".xlsx"}
  store.commit("changeLoading",true);
  axios( {
    method : type ? type : 'GET' ,
    url : url ,
    params : params ,
    responseType : 'blob'
  } ).then( ( res ) => {
    store.commit("changeLoading",false);
    let blob = new Blob( [res.data] , { type : blob_type ? blob_type : 'application/vnd.ms-excel' } );
    //获取heads中的filename文件名
    let content_disposition = res.headers[ "Content-Disposition" ] || res.headers[ "content-disposition" ];
    let temp = content_disposition ? content_disposition.split( ";" )[ 1 ].split( "filename=" )[ 1 ] : new Date().getTime() + suffix;
    let fileName = decodeURI( temp );//普通解码
    
    const link = document.createElement( 'a' )
    if ( 'download' in link ) {
      link.style.display = 'none'
      link.href = URL.createObjectURL( blob );
      link.setAttribute( 'download' , fileName )
      document.body.appendChild( link )
      link.click()
      document.body.removeChild( link )
    }
    else { // IE10+下载
      let navigator_s = navigator as any;
      navigator_s.msSaveBlob( blob , fileName );
    }
  } ).catch( error => {
    store.commit("changeLoading",false);
    let blobData = error.response;
    let reader = new FileReader(); // 创建读取文件对象
    reader.addEventListener( "loadend" , function () { //
      let res = JSON.parse( <string>reader.result ); // 返回的数据
      console.log( res , '返回结果数据' ) // { name: "小明" }
      // $Message.warning( '导出失败:' + res.msg )
    } );
    reader.readAsText( blobData.data , 'utf-8' ); // 设置读取的数据以及返回的数据类型为utf-8
    
  } )
}

export {
  getData ,
  postData ,
  putData ,
  deleteData ,
  downloadData,
  dateFormat
};
