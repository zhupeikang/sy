export interface GetTicketListAPIResponse {
  current_page: number;
  data: Datum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: null;
  path: string;
  per_page: string;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface Datum {
  id: number;
  name: string;
  type_id: number;
  province: string;
  city: string;
  address: string;
  date_begin_at: Date;
  date_end_at: Date;
  img: string;
  created_at: Date;
  favor_count: number;
  min_sku: Sku;
  early_sku: Sku;
  type: TypeTicket;
}

export interface Sku {
  id: number;
  event_id: number;
  sku: string;
  price: string;
  show_price: string;
  ticket_cate: string;
  use_date: Date;
  sale_begin_at: Date;
  sale_end_at: Date;
  inventory: number;
  inventory_total: number;
  order_limit: number;
  sit_info: SitInfo[];
  created_at: Date;
  updated_at: Date;
}

export interface SitInfo {
  tag: string;
  between: number[];
}

export interface TypeTicket {
  id: number;
  name: string;
  created_at: null;
  updated_at: null;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface ipRequest {
  method: string,
  path: string,
  params?: {
    ip: string
  },
  showError?: boolean
}

export interface GetIPAPIResponse {
  status: number;
  message: string;
  request_id: string;
  result: Result;
}

export interface Result {
  ip: string;
  location: Location;
  ad_info: AdInfo;
}

export interface AdInfo {
  nation: string;
  province: string;
  city: string;
  district: string;
  adcode: number;
  nation_code: number;
}

export interface Location {
  lat: number;
  lng: number;
}

export enum PAY_TYPE {
  WECHAT = '1'
}

export const PAY_TYPE_TEXT = {
  [PAY_TYPE.WECHAT]: '微信支付',
};
