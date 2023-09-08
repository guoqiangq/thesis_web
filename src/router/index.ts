//index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  // {
  //   path: "/home",
  //   name: "Home",
  //   component: () => import("../view/index/Home.vue"),
  // },
  {
    path: "/",
    name: "Index",
    component: () => import("../view/index/Index.vue"),
    children: []
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../view/user/Login.vue"),
    children: []
  },
  {
    path: "/sign",
    name: "SignIn",
    component: () => import("../view/user/SignIn.vue"),
    children: []
  },
  {
    path: "/password_reset",
    name: "PasswordReset",
    component: () => import("../view/user/PasswordReset.vue"),
    children: []
  },
  {
    path: "/home_layout",
    name: "HomeLayout",
    component: () => import("../layout/LayoutView.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("../view/index/Home.vue"),
      }
    ]
  },
  {
    path: "/friend",
    name: "Friend",
    component: () => import("../layout/LayoutView.vue"),
    children: [
      {
        path:'/list',
        name:'FriendList',
        component: () => import("../view/friend/FriendList.vue")
      },
      {
        path:'/details',
        name:'FriendDetails',
        component: () => import("../view/friend/FriendDetails.vue")
      },
      // {
      //   path:'/authority',
      //   name:'CompanyAuthority',
      //   component: () => import("../views/company/CompanyAuthority.vue")
      // },
      // {
      //   path:'/details',
      //   name:'CompanyDetails',
      //   component: () => import("../views/company/CompanyDetails.vue")
      // }
    ]
  },
  {
    path: "/share",
    name: "Share",
    component: () => import("../layout/LayoutView.vue"),
    children: [
      {
        path: "/share_list",
        name: "ShareList",
        component: () => import("../view/share/ShareList.vue"),
      },
      {
        path: "/shareAll_list",
        name: "ShareAllList",
        component: () => import("../view/share/ShareAllList.vue"),
      },
      {
        path: "/share_add",
        name: "ShareAdd",
        component: () => import("../view/share/ShareAdd.vue"),
      },
      {
        path: "/share_details",
        name: "ShareDetails",
        component: () => import("../view/share/ShareDetails.vue"),
      }
    ]
  },
  {
    path: "/browse",
    name: "Browse",
    component: () => import("../layout/LayoutView.vue"),
    children: [
      {
        path: "/browse_list",
        name: "BrowseList",
        meta : {
          title : '浏览记录' ,
          pos : 0 ,
          rule : 0 ,
          tos : [] ,
        } ,
        component: () => import("../view/browse/BrowseList.vue"),
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../layout/LayoutView.vue"),
    children: [
      {
        path: "/user_list",
        name: "UserList",
        meta : {
          title : '用户管理' ,
          pos : 0 ,
          rule : 0 ,
          tos : [] ,
        } ,
        component: () => import("../view/user/UserList.vue"),
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(), // 哈希模式
  routes,
});

export default router;
