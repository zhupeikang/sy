import request from '@/config/axios';
import type { OptionType } from '@/types';

export const getConfigApi = (): Promise<IResponse<{
    [key: string]: any,
}>> => {
    return request.get({ url: '/v2/common/config' })
}

export const getDictApi = (): Promise<IResponse<{
    [key: string]: OptionType[],
}>> => {
    return request.get({ url: 'v3/dict/dict/dict' })
}
