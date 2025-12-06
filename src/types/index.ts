/**
 * 用户
 */
export type UserType = {
  uid: number,
  qrcode?: string
  address_id: number
  user_code: string
  publisher_flag: 'Y' | 'N'
  zone: string
  mobile: string
  bind_zone: string
  bind_mobile: string
  nickname: string
  avatar: string
  description: string
  chain_address: string
  white_flag: 'Y' | 'N'
  fans: number
  threads: number
  follows: number
  friends: number
  verified_flag: 'Y' | 'N'
  privacy_collection_flag: 'Y' | 'N'
  real_name?: string
  identity_card?: string
  wallet?: {
    address: string
  },
  msgs: {
    announce: number
    forum: number
    system: number
  },
  invite_code: string
  followed: boolean
  _followed: boolean
}
/**
 * Banner
 */
export type BannerType = {
  src_url: string;
  click_event: string;
  click_params: {
    [key: string]: any
  };
  banner_id: number
}
/**
 * 宫格
 */
export type GridType = {
  grid_id: number;
  name: string;
  src_url: string;
  page: string;
  click_event: string;
  click_params: {
    [key: string]: any
  };
  displayorder: number;
  display_flag: string;
  remark?: any;
  begin_at: number;
  end_at: number;
  created_at: string;
  created_ip: string;
  updated_at: string;
  updated_ip: string;
  deleted_at?: any;
}
/**
 * 合约列表展示
 */
export type ContractDisplayType = {
  contract_no: string;
  name: string;
  total_supply: number;
  amount: number;
  cover_url: string;
}
export type ContractType = ContractDisplayType & {
  contract_id: number;
  uid: number;
  appid: number;
  author: string;
  desc_type: string;
  desc_img: string;
  desc_html: string;
  display_flag: string;
  main_url: string;
  cover_url: string
  model_url?: string;
  transfer_flag: string;
  transfer_day: number;
  chain_service_provider_id: number;
  chain_contract_id: string;
  chain_created_at: number;
  created_at: number;
  created_ip: string;
  updated_at: number;
  updated_ip: string;
  model_scale: number;
  extends: string
}
/**
 * 套餐列表展示
 */
export type PlanDisplayType = {
  begin_at: number
  plan_no: string;
  subject: string;
  total_supply: number;
  orig_price: number;
  price: number;
  hot_flag: string;
  status: string;
  cover_url: string;
  wepay_flag: string;
}

export type TicketDisplayType = {
    begin_at: number
    plan_no: string;
    subject: string;
    total_supply: number;
    orig_price: number;
    price: number;
    hot_flag: string;
    status: string;
    cover_url: string;
    wepay_flag: string;
}

export type PlanType = PlanDisplayType & {
  type: string;
  limits: number;
  status: string;
  display_flag: string;
  main_url: string;
  model_url: string;
  htmls: string[];
  activity_html: string;
  rights_html: string;
  desc_html: string;
  agree_html: string;
  begin_at: number;
  end_at: number;
  hot_flag: string;
  recommend_flag: string;
  sold_supply: number;
  favored: boolean
  reminded: boolean
  extends: string,
}
export type PlanItemType = {
  contract_id: number;
  value: number;
  total_supply: number;
  sold_supply: number;
  rights: {
    rights_id: number;
    name: string;
    tag: string
  }[];
  contract: {
    name: string;
    contract_no: string
    contract_id: number;
    chain_contract_id: string;
    total_supply: number;
    amount: number;
    uid: number;
    author: string;
    cover_url: string;
    transfer_flag: string;
    is_trade: string;
    platform: string;
    user: {
      uid: number;
      nickname: string;
    }

  }
}
export type PlanParamType = {
  label: string
  text: string
  type?: 'text' | 'copy' | 'push' | 'link'
  value?: string
}
export type RightsDisplayType = {
  summary: any
  name: string;
  type: string;
  action: string;
  tag: string
  exchange_begin_at: number
  exchange_end_at: number
  exchange_flag: string
  content_flag: string
  content: string
  config: {
    [key: string]: any
  }
}


export type AssetRightsType = {
  asset_rights_id: number;
  rights: RightsDisplayType
  status: string;
  asset_id: number;
  name: string;
  asset_no: string;
  cover_url: string;
  nickname: string;
  uid: number;
  pending: number;
  content: {
    [key: string]: any
  }
}
/**
 * 系列列表展示
 */

export type TopicItemType = {
  topic_id: number
} & (
  {
    type: 'contract',
    contract_id: number
    contract: ContractDisplayType
  } | {
  type: 'plan',
  plan_id: number
  plan: PlanDisplayType
}
  )
export type TopicDisplayType = {
  logo: string
  favors: number
  topic_no: string
  name: string
  description: string
  children: TopicItemType[]
  background?: string,
  tag_text: string
}
export type RootObjectDataList = {
  url: string;
  img_src: string;
}
export type RootObjectData = {
  list: RootObjectDataList[];
}
/**
 * 用户展示
 */
export type UserDisplayType = {
  uid: number
  nickname: string
  avatar: string
  user_code: string
  description: number
}
/**
 * 活动
 */
export type ActivityType = {
  params: {
    image_url: string
  }
}
/**
 * 文章公告
 */
export type ArticleType = {
  article_no: string
  type: 'link' | 'push' | 'article' | 'page' | 'single'
  url?: string
  subject: string
  summary?: string
  cover_url?: string
  content?: string
  publish_at: number
}
/**
 * 游戏
 */
export type GameType = {
  game_id: number;
  displayorder: number;
  name: string;
  icon_url: string;
  cover_url: string;
  status: string;
  type: string;
  description: string;
  imgs: string[];
  download_url: string;
  ios_download_url: string;
  android_download_url: string;
  updated_at: number;
  created_at: number;
  children: {
    item_id: number;
    game_id: number;
    displayorder: number;
    summary: string;
    cover_url: string;
    created_at: number;
    updated_at: number;
    deleted_at?: any;
    click_event: string;
    click_url: string;
    status: string;
  }[];
}

/**
 * 专题
 */
export type TopicType = {
  topic_id: number;
  topic_no: string;
  displayorder: number;
  name: string;
  logo: string;
  description: string;
  display_flag: string;
  recommend_flag: string;
  created_at: string;
  created_ip: string;
  updated_at: string;
  updated_ip: string;
  deleted_at?: any;
}
/**
 * 订单详情
 */
export type OrderType = {

  order_no: string;
  status: 'pending' | 'success' | 'expire' | 'refunding' | 'refund' | 'cancel'
  price: number
  amount: number
  plan_id: number
  uid: number
  created_at: number,
  plan?: PlanDisplayType,
  expired_at: number
  coupon_amount: number
  coupon_no?: string
  payment_at?: number
  payment_id?: string
}
/**
 * 收货地址
 */
export type UserAddressType = {
  address_id: number;
  uid: number;
  name: string;
  mobile: string;
  email: string;
  area: string;
  address: string;
  created_at: string;
  updated_at: string;
  is_default: false
}

export type OptionType = {
  label: string
  value: string
}
/**
 * 资产
 */
export type AssetType = {
  count: number;
  nickname?: string
  asset_id: number;
  asset_no: string;
  order_id: number;
  uid: number;
  publisher_uid: number;
  appid: number;
  status: string;
  plan_id: number;
  plan_item_id: number;
  contract_id: number;
  name: string;
  author: string;
  main_url: string;
  lock_flag: string;
  minted_at: number;
  token_id: string;
  tx_id: string;
  compose_asset_id?: any;
  compose_at?: any;
  destory: string;
  destoryed_at?: any;
  created_at: number;
  updated_at: number;
  platform: string;
  contract: {
    chain_contract_id: string
    amount: number
    total_supply: number
    contract_no: string
    cover_url: string
  }
  asset_rights: AssetRightsType[]
  cover_url: string
}
export type ThreadType = {
  thread_no: string;
  uid: number;
  status: string;
  content: string;
  publish_at: number;
  replies: number;
  liked: boolean,
  asset_no: string;
  created_at: number;
  official_flag: string;
  recommend_flag: string;
  parent_id: number;
  images: string[]
  shares: number
  likes: number
  asset: {
    asset_no: string;
    contract_id: number;
    name: string;
    main_url: string
  }
  user: {
    nickname: string,
    avatar: string
  };
}
export type FavorType = {
  favor_id: number;
  uid: number
  value: number;
  created_at: number
} & ({
  type: 'plan' | 'remind'
  plan: PlanType
} | {
  type: 'topic'
  topic: TopicDisplayType
})
export type TransferType = {
  transfer_id: number;
  uid: number;
  receive_uid: number;
  type: string
  asset_id: number;
  status: string;
  created_at: number;
  created_ip: string;
  deleted_at?: any;
  expired_at: number;
  received_at: number;
  received_ip: number;
  transaction_id?: any;
  channel: string;
  receive_address: string
  send_address: string
  receive_nickname: string
  send_nickname: string

  asset: {
    asset_no: string
    name: string
  }
}
export type MsgType = {
  msg_id: number;
  content: string;
  created_at: number;
  scene: string;
  scene_id: number;
  url?: any;
  status: string;
  user?: {
    nickname: string;
    avatar: string;
    uid: number
  }
}
export type MsgTypeDetete = {
  code: number;
  type: string;
  msg: string;
  data: any[];
}

export type AssetLogType = {
  type: string;
  action: string;
  asset_id: number;
  created_at: number;
  name: string;
  asset_no: string;
  contract_id: number;
  cover_url: string;
}
export type PlanComposeType = {
  compose_id: number;
  plan_id: number;
  displayorder: number;
  status: string;
  recommend_flag: string;
  begin_at: number;
  end_at: number;
  config: {
    nums: number;
    action: string;
    contract_id: number;
  }[];
  created_at: number;
  updated_at: number;
  deleted_at?: any;
  plan: PlanType;
  children: PlanComposeChildType[];
  rule_nums: number
}
export type PlanComposeChildType = {
  contract: ContractType,
  contract_id: number
  nums: number
  selected?: string[]
}

export type SearchType = (UserType & {
  searchType: 'user' | 'publisher',
}) | ({
  searchType: 'series' | 'brand' | 'album',
} & TopicDisplayType)
  | ({
  searchType: 'plan',
} & PlanType)
  | ({
  searchType: 'contract',
} & ContractType) | ({
  searchType: 'article',
} & ArticleType)

export type RankType = {
  publisher_uid: number;
  uid: number;
  nickname: string
  avatar: string
  cnt: number
}
export type UserAccountType = {
  uid: number
  nickname: string
  created_at: number,
  verified_flag: string
  identity_card?: string
  real_name?: string
}
export type LoginAccountType = {
  result: 'account' | 'verify',
  list: UserAccountType[],
  code: string
}
export type LoginType = {
  result: 'success',
  token: string
} | LoginAccountType

export type LinkType = {
  url: string
  type: string
}
export type ArtworkType = {
  artwork_id: number;
  status: string;
  cover_url: string;
  main_url: string;
  total_supply: number;
  name: string;
  author: string;
  desc_type: string;
  desc_img: string;
  desc_html?: any;
  amount: number;
  admin_at?: any;
  admin_remark?: any;
  contract_id?: any;
  plan_id?: any;
  plan?: any;
}


export type BrandListDataList = {
  topic_no: string;
  name: string;
  logo: string;
  favors: number;
  tag_text: string;
}
export type BrandListData = {
  list: BrandListDataList[];
}
export  enum OrderStatus {
  MASTER_ORDER_STATUS_ORDERED = 0,
  MASTER_ORDER_STATUS_WAIT_PAY = 10,
  MASTER_ORDER_STATUS_PAYED = 20,
  MASTER_ORDER_STATUS_WAIT_SEND = 30,
  MASTER_ORDER_STATUS_SEND = 40,
  MASTER_ORDER_STATUS_FINISH = 70,
  MASTER_ORDER_CANCELED = 80,
  MASTER_ORDER_PAY_FAILED = 81,
  MASTER_ORDER_STATUS_REFUND = 82
}

export const OrderStatusText = {
  [OrderStatus.MASTER_ORDER_STATUS_ORDERED]: '支付锁票中',
  [OrderStatus.MASTER_ORDER_STATUS_WAIT_PAY]: '待支付',
  [OrderStatus.MASTER_ORDER_STATUS_PAYED]: '已支付',
  [OrderStatus.MASTER_ORDER_STATUS_WAIT_SEND]: '待发货',
  [OrderStatus.MASTER_ORDER_STATUS_SEND]: '已发货',
  [OrderStatus.MASTER_ORDER_STATUS_FINISH]: '已完成',
  [OrderStatus.MASTER_ORDER_CANCELED]: '已取消',
  [OrderStatus.MASTER_ORDER_PAY_FAILED]: '支付失败',
  [OrderStatus.MASTER_ORDER_STATUS_REFUND]: '全额退款',
};
export enum TicketStatus {
  TICKET_STATUS_UNRECEIVED = 10,
  TICKET_STATUS_RECEIVED=20,
  TICKET_STATUS_REFUNDING=60,
  TICKET_STATUS_USED=70,
  TICKET_STATUS_REFUND=80,
}
export const TicketStatusText = {
  [TicketStatus.TICKET_STATUS_UNRECEIVED]: '未出票',
  [TicketStatus.TICKET_STATUS_RECEIVED]: '已出票',
  [TicketStatus.TICKET_STATUS_REFUNDING]: '退票中',
  [TicketStatus.TICKET_STATUS_USED]: '已使用',
  [TicketStatus.TICKET_STATUS_REFUND]: '已退票',
};
export  enum RefundStatus {
  TICKET_ORDER_REFUND_STATUS_APPLY = 0,
  TICKET_ORDER_REFUND_STATUS_WAIT_REFUND=10,
  TICKET_ORDER_REFUND_STATUS_REFUNDING=20,
  TICKET_ORDER_REFUND_STATUS_REFUND=70,
  TICKET_ORDER_REFUND_STATUS_CANCELED=80,
  TICKET_ORDER_REFUND_STATUS_REJECT=81,
}
export const RefundStatusText = {
  [RefundStatus.TICKET_ORDER_REFUND_STATUS_APPLY]: '待审核',
  [RefundStatus.TICKET_ORDER_REFUND_STATUS_WAIT_REFUND]: '待退款',
  [RefundStatus.TICKET_ORDER_REFUND_STATUS_REFUNDING]: '退款中',
  [RefundStatus.TICKET_ORDER_REFUND_STATUS_REFUND]: '已退款',
  [RefundStatus.TICKET_ORDER_REFUND_STATUS_CANCELED]: '已取消',
  [RefundStatus.TICKET_ORDER_REFUND_STATUS_REJECT]: '已拒绝',
};
