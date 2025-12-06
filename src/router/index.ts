import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    name: 'index',
    path: '/',
    redirect: '/home',
  },
  {
    name: 'Ticket',
    path: '/ticket',
    component: () => import('@/pages/Ticket/List.vue'),
    meta: {
      keepAlive: true,
      showCopyRight: false,

    },
  },
  {
    name: 'Purchaser',
    path: '/purchaser',
    component: () => import('@/pages/Purchaser/List.vue'),
    meta: {
      keepAlive: true,
      showCopyRight: false,
    },
  },
  {
    name: 'PurchaserSelect',
    path: '/purchaser/select',
    component: () => import('@/pages/Purchaser/List.vue'),
    meta: {
      keepAlive: true,
      showCopyRight: false,
    },
  },
  {
    name: 'PurchaserEdit',
    // 可选参数
    path: '/purchaser/edit/:id?',
    component: () => import('@/pages/Purchaser/Edit.vue'),
    meta: {
      keepAlive: true,
      showCopyRight: false,
    },
  },
  {
    name: 'TicketOrder',
    path: '/ticket/orderConfirm/:no',
    component: () => import('@/pages/Ticket/components/Confirm.vue'),
    meta: {
      keepAlive: true,
      showCopyRight: false,
    },
  },
  {
    name: 'TicketOrderPayInfo',
    path: '/ticket/orderPay/:no',
    component: () => import('@/pages/Ticket/components/Result.vue'),
    meta: {
      keepAlive: true,
      showCopyRight: false,
    },
  },
  {
    name: 'selectCity',
    path: '/ticket/city',
    component: () => import('@/pages/Ticket/components/City.vue'),
    meta: {
      keepAlive: true,

    },
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/pages/User/Login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    name: 'Auth',
    path: '/auth',
    component: () => import('@/pages/Auth/index.vue'),
    meta: {
      title: '跳转中',
    },
  },
  {
    name: 'Home',
    path: '/home',
    component: () => import('@/pages/Home/Index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'PlanDetail',
    path: '/plan/:plan_no',
    component: () => import('@/pages/Plan/Detail.vue'),
    meta: {
      keepAlive: false,
      title: '套餐详情',
    },
  },
  {
    name: 'TicketDetail',
    path: '/ticket/:id',
    component: () => import('@/pages/Ticket/Detail.vue'),
    meta: {
      keepAlive: false,
      title: '票务详情',
      showCopyRight: false,
    },
  },
  {
    name: 'ArticleCate',
    path: '/article-:cate',
    component: () => import('@/pages/Article/List.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'ArticleDetail',
    path: '/article/:article_no',
    component: () => import('@/pages/Article/Detail.vue'),
    meta: {
      keepAlive: false,
      title: '文章详情',
    },
  },
  {
    name: 'ArticleList',
    path: '/article',
    component: () => import('@/pages/Article/List.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'GameDetail',
    path: '/game/:game_id',
    component: () => import('@/pages/Game/Detail.vue'),
    meta: {
      keepAlive: false,
      title: '游戏详情',
    },
  },
  {
    name: 'Game',
    path: '/game',
    component: () => import('@/pages/Game/List.vue'),
    meta: {
      keepAlive: true,
      title: '游戏',
    },
  },
  {
    name: 'Ground',
    path: '/ground',
    component: () => import('@/pages/Ground/Index.vue'),
    meta: {
      keepAlive: true,
      title: '创意中心',
    },
  },
  {
    name: 'TopicList',
    path: '/topic-:type',
    component: () => import('@/pages/Topic/List.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'BrandList',
    path: '/brand-:cate',
    component: () => import('@/pages/Brand/List.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'TopicCate',
    path: '/brand',
    component: () => import('@/pages/Topic/Index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'TopicDetail',
    path: '/topic/:topic_no',
    component: () => import('@/pages/Topic/Detail.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'Profile',
    path: '/profile',
    component: () => import('@/pages/User/Profile.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'OrderDetail',
    path: '/order/:order_no',
    component: () => import('@/pages/Order/Detail.vue'),
    meta: {
      keepAlive: false,
    },
  },
  {
    name: 'OrderList',
    path: '/order',
    component: () => import('@/pages/Order/List.vue'),
    meta: {
      keepAlive: true,
    },
  },

  {
    name: 'UserPage',
    path: '/u/:uid',
    component: () => import('@/pages/User/Page.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'ThreadDetail',
    path: '/thread/:thread_no',
    component: () => import('@/pages/Forum/Thread.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'ForumAdd',
    path: '/forum/add',
    component: () => import('@/pages/Forum/Add.vue'),
    meta: {
      keepAlive: false,
    },
  },
  {
    name: 'Forum',
    path: '/forum',
    component: () => import('@/pages/Forum/Home.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'AssetDetail',
    path: '/asset/:asset_no',
    component: () => import('@/pages/Asset/Detail.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'ContractDetail',
    path: '/contract/:contract_no',
    component: () => import('@/pages/Asset/Contract.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'PublisherApply',
    path: '/publisher/apply',
    component: () => import('@/pages/Publisher/Apply.vue'),
    meta: {
      keepAlive: false,
    },
  },
  {
    name: 'ComposeHome',
    path: '/compose',
    component: () => import('@/pages/Compose/Home.vue'),
    meta: {
      keepAlive: false,
    },
  },
  {
    name: 'Search',
    path: '/search',
    component: () => import('@/pages/Search/Index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    name: 'Rank',
    path: '/rank',
    component: () => import('@/pages/Rank/Index.vue'),
    meta: {
      keepAlive: false,
    },
  },
  {
    name: 'User',
    path: '/user',
    redirect: '/profile',
    children: [
      {
        name: 'UserThread',
        path: '/user/thread',
        component: () => import('@/pages/User/Thread.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'InviteList',
        path: '/user/invite',
        component: () => import('@/pages/User/components/Invite.vue'),
        meta: {
          keepAlive: true,
        },

      },
      {
        name: 'RankList',
        path: '/user/invite/rank',
        component: () => import('@/pages/User/components/Rank.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'UserMessageForum',
        path: '/message/forum',
        component: () => import('@/pages/User/MessageForum.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserMessageAnnounce',
        path: '/message/announce',
        component: () => import('@/pages/User/MessageAnnounce.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserMessage',
        path: '/message',
        component: () => import('@/pages/User/Message.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserAddressDetail',
        path: '/user/address/:id',
        component: () => import('@/pages/User/Address/Detail.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserAddress',
        path: '/user/address',
        component: () => import('@/pages/User/Address/List.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'UserPrivacy',
        path: '/user/privacy',
        component: () => import('@/pages/User/Privacy.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'UserSetting',
        path: '/user/setting',
        component: () => import('@/pages/User/Setting.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserAvatar',
        path: '/user/avatar',
        component: () => import('@/pages/User/Avatar.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserNickname',
        path: '/user/nickname',
        component: () => import('@/pages/User/Nickname.vue'),
        meta: {
          keepAlive: false,
        },
      },

      {
        name: 'UserCode',
        path: '/user/code',
        component: () => import('@/pages/User/Code.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserDescription',
        path: '/user/description',
        component: () => import('@/pages/User/Description.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserQrcode',
        path: '/user/qrcode',
        component: () => import('@/pages/User/Qrcode.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserMobile',
        path: '/user/mobile',
        component: () => import('@/pages/User/Mobile.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserFriend',
        path: '/user/friend/:type',
        component: () => import('@/pages/User/Friend.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserFavor',
        path: '/user/favor',
        component: () => import('@/pages/User/Favor.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'UserRights',
        path: '/user/rights',
        component: () => import('@/pages/User/Rights.vue'),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'UserAssetlogDetail',
        path: '/user/assetlog/:asset_no',
        component: () => import('@/pages/User/AssetLogDetail.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserAssetlog',
        path: '/user/assetlog',
        component: () => import('@/pages/User/AssetLog.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'UserTicket',
        path: '/user/ticket/event',
        component: () => import('@/pages/User/Ticket/List.vue'),
        meta: {
          keepAlive: false,
          showCopyRight:false
        },
      },
      {
        name: 'UserTicketRefundList',
        path: '/user/ticket/refund',
        component: () => import('@/pages/User/Ticket/RefundList.vue'),
        meta: {
          keepAlive: false,
          showCopyRight:false
        },
      },
      {
        name: 'UserTicketRefund',
        path: '/user/ticket/refund/:master_order_no',
        component: () => import('@/pages/User/Ticket/componments/Refund.vue'),
        meta: {
          keepAlive: false,
          showCopyRight:false
        },
      },
      {
        name: 'UserTicketRefundDetail',
        path: '/user/ticket/refund/:master_order_no/detail',
        component: () => import('@/pages/User/Ticket/componments/RefundDetail.vue'),
        meta: {
          keepAlive: false,
          showCopyRight:false
        },
      },
      {
        name: 'UserTicketDetail',
        path: '/user/ticket/:master_order_no',
        component: () => import('@/pages/User/Ticket/Detail.vue'),
        meta: {
          keepAlive: false,
          showCopyRight:false
        },
      },
    ],
  },
  {
    name: 'App',
    path: '/app',
    redirect: '/home',
    children: [
      {
        name: 'AppAuthor',
        path: '/app/author',
        component: () => import('@/pages/App/Author.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'AppRongmei',
        path: '/app/rongmei',
        component: () => import('@/pages/App/Rongmei.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'Rongmei',
        path: '/rongmei',
        component: () => import('@/pages/App/Rongmei.vue'),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'Dep',
        path: '/dep',
        component: () => import('@/pages/App/Dep.vue'),
        meta: {
          keepAlive: false,
        },
      },
    ],
  },
  {
    name: 'Link',
    path: '/l/:link_no',
    component: () => import('@/pages/Link/Index.vue'),
  },
  {
    name: 'Activity',
    path: '/activity',
    redirect: '/home',
    children: [
      {
        name: 'ActivityVerify',
        path: '/activity/verify',
        component: () => import('@/pages/Activity/Verify.vue'),
        meta: {
          keepAlive: false,
        },
      },
    ],
  },
  {
    name: 'Gallery',
    path: '/gallery',
    component: () => import('@/pages/User/Gallery.vue'),
  },
  {
    name: 'PreBuy',
    path: '/prebuy',
    component: () => import('@/pages/User/PreBuy.vue'),
  },
  {
    name: 'Explore',
    path: '/explore',
    redirect: '/explore-index',
    children: [
      {
        name: 'ExploreIndex',
        path: '/explore-index',
        component: () => import('@/pages/Explore/Index.vue'),
      },
      {
        name: 'ExploreAccount',
        path: '/explore-account',
        component: () => import('@/pages/Explore/Account.vue'),
      },
      {
        name: 'ExploreAsset',
        path: '/explore-asset',
        component: () => import('@/pages/Explore/Asset.vue'),
      },
      {
        name: 'ExploreContract',
        path: '/explore-contract',
        component: () => import('@/pages/Explore/Contract.vue'),
      },
      {
        name: 'ExploreLog',
        path: '/explore-log',
        component: () => import('@/pages/Explore/Log.vue'),
      },
    ],
  },
  {
    name: 'Manage',
    path: '/manage',
    redirect: '/manage/index',
    children: [
      {
        name: 'ManageIndex',
        path: '/manage/index',
        component: () => import('@/pages/Manage/Index.vue'),
      },
      {
        name: 'ManageAdd',
        path: '/manage/add',
        component: () => import('@/pages/Manage/Add.vue'),
      },
      {
        name: 'ManageEdit',
        path: '/manage/edit',
        component: () => import('@/pages/Manage/Add.vue'),
      },
      {
        name: 'ManagePublish',
        path: '/manage/publish',
        component: () => import('@/pages/Manage/Publish.vue'),
      },
    ],
  },
  // {
  //   name:'Login',
  //   path: '/login',
  //   component: () => import('@/pages/User/Login.vue'),
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/pages/common/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes,
});

export default router;
