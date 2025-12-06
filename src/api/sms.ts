import request from '@/config/axios';

export const sendLoginSmsApi = (data: any): Promise<IResponse<{
    code?: string
    interval: number
}>> => {
    return request.post({ url: '/v2/sms/login', data })
}

export const sendCheckSmsApi = (data: any): Promise<IResponse<{
    code?: string
    interval: number
}>> => {
    return request.post({ url: '/v2/sms/check', data })
}
export const sendBindSmsApi = (data: any): Promise<IResponse<{
    code?: string
    interval: number
}>> => {
    return request.post({ url: '/v2/sms/bind', data })
}

export const sendPublisherSmsApi = (data: any): Promise<IResponse<{
    code?: string
    interval: number
}>> => {
    return request.post({ url: '/v2/sms/publisher', data })
}
