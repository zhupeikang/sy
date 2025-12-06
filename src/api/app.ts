import request from '@/config/axios';

export const preAuthorAppApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/app/author/pre', data })
}

export const rongmeiAuthorAppApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/app/author/rongmei', data })
}

export const depAuthorAppApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/app/author/dep', data })
}

export const getAppRedirect = (params: any): Promise<IResponse> => {
    return request.get({ url: '/v2/app/author', params })
}
