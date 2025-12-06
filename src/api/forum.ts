import request from '@/config/axios';
import type { BannerType, ThreadType } from '@/types';

export const getForumHomeApi = (params: any): Promise<IResponse<{
    banners: BannerType[],
}>> => {
    return request.get({ url: '/v2/forum/home', params })
}

export const uploadForumImageApi = (data: any): Promise<IResponse<{
    url: string,
    attach_id: number
}>> => {
    return request.post({
        url: '/v2/forum/upload',
        data,
        headersType: 'multipart/form-data',
        params: {
            showError: true
        }
    })
}

export const chooseForumAssetApi = (data: any): Promise<IResponse<{
    list: {
        asset_no: string
        name: string
        contract: {
            cover_url: string
        }
    }[],
}>> => {
    return request.post({ url: '/v2/forum/asset', data })
}

export const createForumThreadApi = (data: any): Promise<IResponse<{
    thread_no: string,
    status: string
}>> => {
    return request.post({ url: 'v3/forum/forum/create', data })
}


export const replyForumThreadApi = (data: any): Promise<IResponse<ThreadType>> => {
    return request.post({ url: 'v3/forum/forum/reply', data })
}

export const getForumThreadApi = (params: any): Promise<IResponse<{
    thread: ThreadType
}>> => {
    return request.get({ url: 'v3/forum/forum/detail', params })
}

export const getForumReplyListApi = (params: any): Promise<IResponse<{
    list: ThreadType[],
}>> => {
    return request.get({ url: 'v3/forum/forum/reply_list', params })
}

export const likeForumThreadApi = (params: any): Promise<IResponse<{
    result: boolean
}>> => {
    return request.get({ url: '/v2/forum/thread/like', params })
}

export const getForumThreadListApi = (params: any): Promise<IResponse<{
    list: ThreadType[],
}>> => {
    return request.get({ url: 'v3/forum/forum/list', params })
}
