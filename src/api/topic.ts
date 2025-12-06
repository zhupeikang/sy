import request from '@/config/axios';
import type { RootObjectData, TopicDisplayType, TopicItemType } from '@/types';

export const getTopicListApi = (params:any): Promise<IResponse<{
    list: TopicDisplayType[],
}>> => {
    return request.get({ url: '/v2/topic/list', params })
}

export const getTopicItemListApi = (params:any): Promise<IResponse<{
    topic?: TopicDisplayType,
    favored: boolean,
    list: TopicItemType[],
}>> => {
    return request.get({ url: '/v2/topic/item', params })
}




// topic/home
export const getTopicHomeApi = (): Promise<IResponse<RootObjectData>> => {
    return request.get({ url: '/v2/topic/home' })
}
