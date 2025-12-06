import request from '@/config/axios';
import type { LinkType, RankType } from '@/types';

export const getRankListApi = (params: any): Promise<IResponse<{
    list: RankType[],
}>> => {
    return request.get({ url: '/v2/utils/rank', params })
}

export const getLinkApi = (params: any): Promise<IResponse<LinkType>> => {
    return request.get({ url: '/v2/utils/link', params })
}
