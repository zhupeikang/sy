import request from '@/config/axios';
import type { AssetLogType, AssetType, ContractType, PlanDisplayType, TransferType, UserType } from '@/types';

export const getAssetDetailApi = (params: any): Promise<IResponse<{
    asset: AssetType,
    contract: ContractType
    publisher: UserType
    plans: PlanDisplayType[]
    transfer?: TransferType
}>> => {
    return request.get({ url: '/v2/asset/detail', params })
}

export const getAssetContractApi = (params: any): Promise<IResponse<{
    contract: ContractType
    publisher: UserType
    plans: PlanDisplayType[]
}>> => {
    return request.get({ url: '/v2/asset/contract', params })
}

export const transferAssetApi = (data: any): Promise<IResponse<TransferType>> => {
    return request.post({ url: '/v2/asset/transfer', data })
}
export const cancelTransferAssetApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/asset/transfer_cancel', data })
}

export const getTransferAssetDetailApi = (params: any): Promise<IResponse<TransferType>> => {
    return request.get({ url: '/v2/asset/transfer_detail', params })
}

export const confirmTransferAssetApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/asset/transfer_confirm', data })
}
export const getAssetLogListApi = (params:any): Promise<IResponse<{
    list: AssetLogType[],
}>> => {
    return request.get({ url: '/v2/asset/log_list',params })
}

export const getAssetLogDetailApi = (params:any): Promise<IResponse<{
    asset: AssetType,
    log_list: AssetLogType[],
    publisher: UserType
}>> => {
    return request.get({ url: '/v2/asset/log_detail',params })
}
// 重新领取权益
export const applyAssetApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/asset/apply', data })
}
