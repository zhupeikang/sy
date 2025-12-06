import request from '@/config/axios';
import { GetIPAPIResponse, GetTicketListAPIResponse, ipRequest } from '@/types/ticket';


type getTicketListApiRequest = {
  page: number,
  size: number,
  city?:number
}

export const getTicketListApi = (params: getTicketListApiRequest): Promise<IResponse<GetTicketListAPIResponse>> => {
  return request.post({ url: '/v3/ticket/ticketEvent/list', params });
};
export const getTicketDetail = (params: any) => {
  return request.get({ url: '/v3/ticket/ticketEvent/detail', params, method: 'get' });
};
export const getTicketSkuDetail = (params: any) => {
  return request.post({ url: '/v3/ticket/ticketSku/detailMulti', data: params, method: 'post' });
};

// 下单两个参数 一个sku_id 一个数量
interface OrderTicketParams {
  sku_id: number;
  num: number;
}

export const orderTicket = (params: OrderTicketParams) => {
  return request.post({ url: '/v3/ticket/ticketOrder/order', data: params, method: 'post' });
};

// 获取订单详情
interface OrderDetailParams {
  master_order_no: string;
}

export const getOrderDetail = (data: any): Promise<IResponse<{
  event: any,
  sku: any,
  master_order: any
}>> => {
  return request.post({ url: '/v3/ticket/ticketOrder/detail', data });
};

//获取购票人列表
export const getBuyerList = () => {
  return request.post({ url: 'v3/realBind/realBind/getByUser' });
};
//新增购票人
export const addBuyer = (data: any) => {
  return request.post({ url: 'v3/realBind/realBind/add', data });
};
// 编辑购票人
export const editBuyer = (data: any) => {
  return request.post({ url: 'v3/realBind/realBind/edit', data });
};

// 详情
export const getBuyerDetail = (data: any) => {
  return request.post({ url: 'v3/realBind/realBind/detail', data });
};
// 删除
export const deleteBuyer = (data: any) => {
  return request.post({ url: 'v3/realBind/realBind/delete', data });
};
// 通过用户获取所有优惠券
export const getCouponList = (data:any) => {
  return request.post({ url: 'v3/ticket/ticketCoupon/getByUser',data });
};
//兑换优惠券 v3/ticket/ticketCoupon/change
export const exchangeCoupon = (data: any) => {
  return request.post({ url: 'v3/ticket/ticketCoupon/change', data });
};
// 通过用户获取所有平台资产优惠券
export const getCouponListByPlatform = (data:any) => {
  return request.post({ url: 'v3/ticket/ticketCoupon/getNftCouponByUser',data});
};

// 更新订单信息
export const updateOrder = (data: any) => {
  return request.post({ url: 'v3/ticket/ticketOrder/updateOrder', data });
};
export const payOrderApiTicket = (data: any) => {
  return request.post({ url: 'v3/masterOrder/masterOrder/pay', data });
};
// 获取定位
export const getLocation = (data: ipRequest): Promise<IResponse<GetIPAPIResponse>> => {
  return request.post({ url: 'v3/thirdPart/wechat/cityCode', data });
};
//获取IP地址

export const getIpAddress = (): Promise<IResponse<{}>> => {
  return request.post({ url: 'v3/thirdPart/third/ip' });
};

//获取用户订单列表
// v3/ticket/ticketOrder/list

export const getOrderList= (data:any): Promise<IResponse> => {
  return request.post({ url: 'v3/ticket/ticketOrder/list' ,data});
};
export const getOrderRefundList= (data:any): Promise<IResponse> => {
  return request.post({ url: 'v3/ticket/ticketOrderRefund/list' ,data});
};
//订单详情
export const getTicketOrderDetail= (data:any): Promise<IResponse> => {
  return request.post({ url: 'v3/ticket/ticketOrder/detail' ,data});
};
// 申请售后
export const getTicketOrderRefund= (data:any): Promise<IResponse> => {
  return request.post({ url: 'v3/ticket/ticketOrderRefund/refund' ,data});
};
// 取消售后
export const getTicketOrderRefundCancel= (data:any): Promise<IResponse> => {
  return request.post({ url: 'v3/ticket/ticketOrderRefund/cancel' ,data});
};
// 申请售后详情
export const getTicketOrderRefundDetail= (data:any): Promise<IResponse> => {
  return request.post({ url: 'v3/ticket/ticketOrderRefund/detail' ,data});
};
// 收藏（已收藏则取消）

export const favor= (data:any): Promise<IResponse> => {
  return request.post({ url: 'v2/favor/favor' ,data});
};
// 领取nft
// v3/ticket/ticketOrder/getNftPlan

export const getNft=(data:any)=>{
  return request.post({ url: 'v3/ticket/ticketOrder/getNftPlan' ,data});
}
