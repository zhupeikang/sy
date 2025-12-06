import request from '@/config/axios';
import type { ArtworkType } from '@/types';


export const uploadManageImageApi = (data: any): Promise<IResponse<{
    url: string,
    attach_id: number
}>> => {
    return request.post({
        url: '/v2/manage/upload',
        data,
        headersType: 'multipart/form-data',
        params: {
            showError: true
        }
    })
}

export const saveArtworkApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/manage/save', data })
}


export const getArtworkListApi = (params: any): Promise<IResponse<{
    list: ArtworkType[],

}>> => {
    return request.get({ url: '/v2/manage/list', params })
}


export const getArtworkDetailApi = (params: any): Promise<IResponse<ArtworkType>> => {
    return request.get({ url: '/v2/manage/detail', params })
}


export const publishArtworkApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/manage/publish', data })
}

export const changeArtworkStatusApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/manage/status', data })
}
