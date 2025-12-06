import request from '@/config/axios';

export const createCaptchaApi = (data: {
    scene: string
}): Promise<IResponse<{
    url:string
    scene:string
    token:string
    text:string
}>> => {
    return request.post({ url: '/v2/captcha/create', data })
}

export const verifyCaptchaApi = (data: {
    deg: number,
    token: string,
    scene: string,
}): Promise<IResponse<{
    success:boolean,
    refresh:boolean,
    token:string//此处token用于后续校验
}>> => {
    return request.post({ url: '/v2/captcha/verify', data })
}
