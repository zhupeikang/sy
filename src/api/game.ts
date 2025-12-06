import request from '@/config/axios';
import type { GameType } from '@/types';

export const getGameListApi = (params: any): Promise<IResponse<{
    list: GameType[],
}>> => {
    return request.get({ url: '/v3/game/game/list', params })
}
export const getGameDetailApi = (params: any): Promise<IResponse<GameType>> => {
    return request.get({ url: 'v3/game/game/detail', params })
}
