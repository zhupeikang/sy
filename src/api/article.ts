import request from '@/config/axios';
import type { ArticleType } from '@/types';

export const getArticleListApi = (params: any): Promise<IResponse<{
    list: ArticleType[],
}>> => {
    return request.get({ url: 'v3/article/article/list', params })
}

export const getArticleDetailApi = (params: any): Promise<IResponse<
    ArticleType
>> => {
    return request.get({ url: 'v3/article/article/detail', params })
}
