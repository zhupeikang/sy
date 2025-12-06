import request from '@/config/axios';
import {
  AssetRightsType,
  AssetType,
  ContractType,
  LoginType,
  MsgType,
  MsgTypeDetete,
  ThreadType,
  TopicType,
  UserAddressType,
  UserType,
} from '@/types';

export const getUserAddressListApi = (): Promise<IResponse<{
    list: UserAddressType[],
}>> => {
    return request.get({ url: '/v2/user/address/list' })
}
export const saveUserAddressApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/address/save', data })
}
export const deleteUserAddressApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/address/delete', data })
}
export const defaultUserAddressApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/address/default', data })
}
export const getUserAddressApi = (params: any): Promise<IResponse<UserAddressType>> => {
    return request.get({ url: '/v2/user/address/detail', params })
}
//登录注册及个人资料
export const userProfileLoginApi = (data: any): Promise<IResponse<LoginType>> => {
    return request.post({ url: '/v2/user/profile/login', data })
}
export const userProfileRegisterApi = (data: any): Promise<IResponse<LoginType>> => {
    return request.post({ url: '/v2/user/profile/register', data })
}
export const userProfileLogoutApi = (): Promise<IResponse> => {
    return request.get({ url: '/v2/user/profile/logout' })
}
export const getUserProfileApi = (params?: any): Promise<IResponse<UserType>> => {
    return request.get({ url: '/v2/user/profile', params })
}
export const userProfileBind = (data: any): Promise<IResponse<UserType>> => {
    return request.post({ url: '/v2/user/profile/bind', data })
}
export const saveUserNicknameApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/profile/nickname', data })
}
export const saveUserCodeApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/profile/code', data })
}
export const saveUserDescriptionApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/profile/description', data })
}
export const verifyUserApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/profile/verify', data })
}
export const saveUserApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/profile/save', data })
}
export const loginVerifyProfileUserApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/profile/login_verify', data })
}
//头像
export const getUserAvatarListApi = (): Promise<IResponse<{
    common: string[],
    owner: string[]
}>> => {
    return request.get({ url: '/v2/user/avatar/list' })
}
export const saveUserAvatarApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/avatar/save', data })
}
/**
 * 换绑手机号
 */
export const checkUserMobileApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/mobile/check', data })
}
export const saveUserMobileApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/mobile/save', data })
}

export const getUserAssetListApi = (params: any): Promise<IResponse<{
    list: AssetType[],
}>> => {
    return request.get({ url: '/v2/user/profile/asset', params })
}

export const getUserAssetListApiV2 = (params: any): Promise<IResponse<{
    list: AssetType[],
}>> => {
    return request.get({ url: '/v2/user/profile/asset_aggregate', params })
}

// /v2/user/profile/user_asset_pending_count
export const getUserAssetPendingCount =()=>{
    return request.get({ url: '/v2/user/profile/user_asset_pending_count' })
}
//
export const getUserAssetGroup = (params: any): Promise<IResponse<{
    list: AssetType[],
}>> => {
    return request.get({ url: '/v2/user/profile/asset_under_contract', params })
}

export const getUserPageApi = (params: any): Promise<IResponse<{
        uid:number
    follow_uid:number
    followed:boolean
    _followed:boolean,
    user?:UserType,
    follow?:UserType
}>> => {
    return request.get({ url: '/v2/user/profile/page', params })
}

export const followUserApi = (data: any): Promise<IResponse<{
    result:boolean
}>> => {
    return request.post({ url: '/v2/user/profile/follow', data })
}

export const getFollowListApi = (params: any): Promise<IResponse<{
    list:{    uid:number
        follow_uid:number
        followed:boolean
        _followed:boolean,
        user?:UserType,
        follow?:UserType}[],
}>> => {
    return request.get({ url: '/v2/user/profile/follow_list', params })
}
export const getFriendListApi = (params: any): Promise<IResponse<{
    list:{
        uid:number
        follow_uid:number
        follow:UserType
    }[],
}>> => {
    return request.get({ url: '/v2/user/profile/friend', params })
}

export const getUserMsgListApi = (params: any): Promise<IResponse<{
    list:MsgType[]
}>> => {
    return request.get({ url: '/v2/user/msg/list', params })
}
export const readAllUserMessage = (params: any): Promise<IResponse> => {
    return request.get({ url: '/v2/user/msg/readAll', params })
}

type MsgTypeDeteteParams = {
    msg_id: number;
}
// 删除消息
export const deleteUserMessage = (params: MsgTypeDeteteParams): Promise<MsgTypeDetete> => {
    return request.get({ url: '/v2/user/msg/delete', params })
}
// 已读消息
export const readUserMessage = (params: MsgTypeDeteteParams): Promise<MsgTypeDetete> => {
    return request.get({ url: '/v2/user/msg/read', params })
}
export const getUserRightsListApi = (params: any): Promise<IResponse<{
    list:(AssetType & {
        asset_rights:AssetRightsType[]
    })[]
}>> => {
    return request.get({ url: '/v2/user/rights/list', params })
}

export const getUserRightsDetailApi = (params: any): Promise<IResponse<{
    asset:AssetType&{
        asset_rights:AssetRightsType[]
    },
}>> => {
    return request.get({ url: '/v2/user/rights/detail', params })
}

export const drawUserRightsApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/rights/draw', data })
}

export const saveUserPublisherApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/publisher/save', data })
}

export const getUserPublisherApi = (params: any): Promise<IResponse> => {
    return request.get({ url: '/v2/publisher/detail', params })
}

export const getUserThreadListApi = (params: any): Promise<IResponse<{
    list:ThreadType[]
}>> => {
    return request.get({ url: '/v2/user/profile/thread', params })
}

export const getUserTopicListApi = (params: any): Promise<IResponse<{
    list:TopicType[]
}>> => {
    return request.get({ url: '/v2/user/profile/topic', params })
}
export const getUserContractListApi = (params: any): Promise<IResponse<{
    list:ContractType[]
}>> => {
    return request.get({ url: '/v2/user/profile/contract_list', params })
}

export const getUserPlatformApi = (params: any): Promise<IResponse> => {
    return request.get({ url: '/v2/user/profile/platform', params })
}
export const loginUserPlatformApi = (data: any): Promise<IResponse> => {
    return request.post({ url: '/v2/user/profile/platform', data })
}
export const getJsApi = (): Promise<IResponse> => {
    return request.post({ url: '/v2/user/profile/jsapi' })
}
export const inviteBuild = (): Promise<IResponse> => {
    return request.get({ url: '/v2/user/invite/build' })
}
export const inviteList = (params: any): Promise<IResponse> => {
    return request.get({ url: '/v2/user/invite/list', params })
}
export const inviteRank = (params: any): Promise<IResponse> => {
    return request.get({ url: '/v2/user/invite/rank', params })
}
