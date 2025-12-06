import request from '@/config/axios';

export const checkExploreApi = (params:any): Promise<IResponse<{
    type:string
}>> => {
    return request.get({ url: '/v2/explore/check', params })
}

export const accountExploreApi = (params:any): Promise<IResponse> => {
    return request.get({ url: '/v2/explore/account', params })
}

export const assetExploreApi = (params:any): Promise<IResponse> => {
    return request.get({ url: '/v2/explore/asset', params })
}

export const contractExploreApi = (params:any): Promise<IResponse> => {
    return request.get({ url: '/v2/explore/contract', params })
}

export const logExploreApi =  (params:any): Promise<IResponse> => {
    return request.get({ url: '/v2/explore/log', params })
}
