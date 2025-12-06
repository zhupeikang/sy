import request from '@/config/axios';
import type {
  ActivityType,
  AssetType,
  PlanComposeType,
  PlanDisplayType,
  PlanItemType,
  PlanParamType,
  PlanType,
  RightsDisplayType,
  UserDisplayType,
} from '@/types';

export const getPlanListApi = (params:any): Promise<IResponse<{
    list: PlanDisplayType[],
}>> => {
    return request.get({ url: '/v2/plan/list', params })
}

export const getPlanApi = (params:any): Promise<IResponse<{
    plan: PlanType,
    children:PlanItemType[]
    params:PlanParamType[],
    rights:RightsDisplayType[],
    user:UserDisplayType,
    activities:ActivityType[]
}>> => {
    return request.get({ url: '/v2/plan/detail', params })
}

export const getPlanComposeHomeApi = (params:any): Promise<IResponse<{
    recommend: PlanComposeType[]
}>> => {
    return request.get({ url: '/v2/plan/compose/home',params })
}
export const getPlanComposeAssetApi = (params:any): Promise<IResponse<{
    list: AssetType[]
}>> => {
    return request.get({ url: '/v2/plan/compose/asset',params })
}

export const submitPlanComposeApi = (data:any): Promise<IResponse> => {
    return request.post({ url: '/v2/plan/compose/submit',data })
}

export const getPlanComposeListApi = (data:any): Promise<IResponse> => {
    return request.post({ url: '/v2/plan/compose/list',data })
}
