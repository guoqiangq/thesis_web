
import config from './config';
import {getData,postData} from "@/util/utils"
// let configUrl:String = "324"
//
// export const  imagePuload = ( params:object ) => {
//
//   return configUrl
//   // return postData( staffingUrl + '/v1/upload/file' , params,false )
// };
export const  getQrcode = ( params:object ) => {
  return getData( config.domainUrl + '/test/demo' , params )
};
//图片上传
export const imagePuload = ( params ) => {
  return postData( config.domainUrl + '/file/upload' , params,false )
};

export const  getUserList = ( params:object ) => {
  return getData( config.domainUrl + '/user/getUsers' , params )
};
// 注册用户
export const  postUserAdd = ( params:object ) => {
  return postData( config.domainUrl + '/user/addUser' , params )
};
// 编辑用户
export const  posEditUser = ( params:object ) => {
  return postData( config.domainUrl + '/user/editUser' , params )
};
// 用户状态修改
export const  posEditStatusUser = ( params:object ) => {
  return postData( config.domainUrl + '/user/editStatusUser' , params )
};
// 编辑用户
export const  posEditPassword = ( params:object ) => {
  return postData( config.domainUrl + '/user/editUserPassword' , params )
};
// 查询用户
export const getUserFind = ( params:object ) => {
  return getData( config.domainUrl + '/user/findUser' , params )
};
// 登录
export const checkLogin = (params:object)=>{
  return postData(config.domainUrl + '/user/getUser',params)
}
// 新增文宝
export const postPublishAdd = ( params:object ) => {
  return postData( config.domainUrl + '/publish/addPublish' , params )
};
//删除文宝
export const postPublishDelete = ( params:object ) => {
  return postData( config.domainUrl + '/publish/removePublish' , params )
};
// 自己的文宝
export const getPublishList = ( params:object ) => {
  return getData( config.domainUrl + '/publish/listPublish' , params )
};
//所有文宝-全部
export const getPublishAllList = ( params:object ) => {
  return getData( config.domainUrl + '/publish/listPublishAll' , params )
};
//所有文宝-自己所有
export const getPublish = ( params:object ) => {
  return getData( config.domainUrl + '/publish/getPublish' , params )
};
//所有文宝-处登录好友黑名单外所有
export const getPublishUnblackenAll = ( params:object ) => {
  return getData( config.domainUrl + '/publish/listUnblackenPublishAll' , params )
};

//收藏文宝
export const postPublishCollect = ( params:object ) => {
  return postData( config.domainUrl + '/publish/addCollectPublish' , params )
};
//点赞文宝
export const postPublishGiveLike = ( params:object ) => {
  return postData( config.domainUrl + '/publish/addGiveLikePublish' , params )
};
//点赞文宝
export const postPublishComment = ( params:object ) => {
  return postData( config.domainUrl + '/publish/addCommentPublish' , params )
};
//获取文宝评论列表
export const getPublishCommentList = ( params:object ) => {
  return getData( config.domainUrl + '/publish/getCommentListPublish' , params )
};

//添加好友
export const postFriendAdd = ( params:object ) => {
  return postData( config.domainUrl + '/friend/addFriend' , params )
};
//修改好友-变更状态 -1加入黑名单
export const postFriendEdit = ( params:object ) => {
  return postData( config.domainUrl + '/friend/editFriend' , params )
};
//删除
export const postFriendRemove = ( params:object ) => {
  return postData( config.domainUrl + '/friend/removeFriend' , params )
};
// 列表
export const getFriendList = ( params:object ) => {
  return getData( config.domainUrl + '/friend/getListFriend' , params )
};


export const getBrowseList = ( params:object ) => {
  return getData( config.domainUrl + '/browse/getBrowseList' , params )
};
export const postBrowseRemove = ( params:object ) => {
  return postData( config.domainUrl + '/browse/removeBrowse' , params )
};
export const getBrowseCollectList = ( params:object ) => {
  return getData( config.domainUrl + '/publish/collectUserListPublish' , params )
};
export const getBrowseGiveLikeList = ( params:object ) => {
  return getData( config.domainUrl + '/publish/giveLikeUserListPublish' , params )
};



