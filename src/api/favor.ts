import request from '@/config/axios';
import { FavorType } from '@/types';

export const favorPlanApi = (data:any): Promise<IResponse<{
    result:boolean
}>> => {
    return request.post({ url: '/v2/favor/plan', data })
}
export const favorTopicApi = (data:any): Promise<IResponse<{
    result:boolean
}>> => {
    return request.post({ url: '/v2/favor/topic', data })
}
export const favorRemindApi = (data:any): Promise<IResponse<{
    result:boolean
}>> => {
    return request.post({ url: '/v2/favor/remind', data })
}

export const getFavorListApi = (params?: any): Promise<IResponse<{
    list: FavorType[],
}>> => {
    return request.get({ url: '/v2/favor/list', params })
}


export const cancelFavorApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/favor/cancel', data })
}
