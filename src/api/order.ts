import request from '@/config/axios';
import type { AssetType, OrderType, PlanDisplayType } from '@/types';

export const getOrderListApi = (params?: any): Promise<IResponse<{
    list: OrderType[],
}>> => {
    return request.get({ url: '/v2/order/list', params })
}

export const calOrderCouponApi = (data?: any): Promise<IResponse<{
    amount: number
}>> => {
    return request.post({ url: '/v2/order/coupon', data })
}
// 加载优先购资产列表
export  const getPriorityAssetListApi = (params?: any): Promise<IResponse<{
    plan_no: string,
    contract_no:string,
    skip: number,
    limit: number,
}>> => {
    return request.post({ url: '/v2/plan/preBuy', params })
}


export const createOrderApi = (data?: any): Promise<IResponse<{
    order_no: string
    expired_at: number
    coupon_no: string
    price: number
    amount: number,
    plan_no?: string
    pre_asset?: string
    allow_wepay: boolean
}>> => {
    return request.post({ url: 'v3/plan/order/create', data })
}

export const checkOrderApi = (params?: any): Promise<IResponse<{
    status: string
}>> => {
    return request.get({ url: '/v2/order/check', params })
}

export const payOrderApi = (params?: any): Promise<IResponse<{
    type: 'pending' | 'success'//此时为支付中，需要轮询check接口，直到status为success或者fail
} | {
    type: 'webview' | 'redirect',
    url: string
} | {
    type: 'jsapi',
    jsapi: any
}>> => {
    return request.get({ url: '/v2/order/pay', params })
}

export const getOrderDetailApi = (params?: any): Promise<IResponse<{
    order: OrderType
    plan: PlanDisplayType
    assets: AssetType[]
}>> => {
    return request.get({ url: '/v2/order/detail', params })
}
