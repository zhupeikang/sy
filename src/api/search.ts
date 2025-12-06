import request from '@/config/axios';
import { SearchType } from '@/types';

export const gerSearchListApi = (type: string, params: any): Promise<IResponse<{
    list: SearchType[]
}>> => {
    return request.get({ url: '/v2/search/' + type, params })
}
