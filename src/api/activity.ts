import request from '@/config/axios';

export const getVerifyActivityApi = (params: any): Promise<IResponse> => {
    return request.get({ url: '/v2/activity/verify', params })
}

export const postVerifyActivityApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/activity/verify', data })
}
export const xgwShareActivityApi = (): Promise<IResponse> => {
    return request.get({ url: '/v2/activity/xgw', data:{} })
}
