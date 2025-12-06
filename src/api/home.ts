import request from '@/config/axios';
import type { BannerType, GridType, TopicDisplayType, TopicType } from '@/types';

export const getHomeIndexApi = (): Promise<IResponse<{
    banners: BannerType[],
    grids: GridType[]
}>> => {
    return request.get({ url: 'v3/home/home/index', })
}


export const getHomeTopicListApi = (params:any): Promise<IResponse<{
    list:TopicDisplayType[]
}>> => {
    return request.get({ url: '/v2/home/topic',params })
}

export const getHomeGroundApi = (): Promise<IResponse<{
    banners: BannerType[],
    series: TopicType[],
    albums:TopicType[]
}>> => {
    return request.get({ url: '/v2/home/ground', })
}
export const getPlanType = (): Promise<IResponse<{
    list:{
        id:number,
        name:string
    }[]
}>> => {
    return request.get({ url: 'v3/plan/type/label', })
}
