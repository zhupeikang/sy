import { followUserApi, getUserAddressListApi, getUserProfileApi, userProfileLogoutApi } from '@/api/user';
import { UserAddressType, UserType } from '@/types';
import { showLoading } from '@/utils';
import { defineStore } from 'pinia';
import { showToast } from 'vant';
import { ref } from 'vue';


export const useUserStore = defineStore('user', () => {
    const userInfo = ref<UserType>()
    const token = ref<string>('')
    const isLogin = ref<boolean>(false)

    const verifyVisible = ref(false)
    const verifyCallback = ref<() => void>()

    const addressInited = ref(false)
    const addressList = ref<UserAddressType[]>([])

    const addressLoading = ref(false)
    const updateAddressList = async()=>{

        if(addressLoading.value){
            return
        }
        addressLoading.value = true
        const res = await getUserAddressListApi()
        if(res){
            addressLoading.value = false
            addressInited.value = true
            addressList.value = res.data.list
            return res.data.list
        }
        return []
    }

    const getUserAddress = async(address_id:number)=>{

        if(!addressInited.value){
            await updateAddressList()
        }
        return addressList.value.find(item=>item.address_id == address_id)
    }

    const messageNum = ref({
        system: 0,
        announce:0,
        forum:0
    })

    const logout = () => {
        if (!token.value) {
            isLogin.value = false
            userInfo.value = undefined
            localStorage.removeItem('user-token')
            return
        }
        //退出登录
        userProfileLogoutApi()
        isLogin.value = false
        userInfo.value = undefined
        token.value = ''
        localStorage.removeItem('user-token')
    }

    const setUserInfo = (data: UserType) => {
        userInfo.value = data
    }
    let userInfoLock = false
    const updateUserInfo = async (callback?: () => void) => {

        if(userInfoLock){
            return
        }
        userInfoLock = true
        setTimeout(()=>{
            userInfoLock = false
        },1000)

        const res = await getUserProfileApi({
            showError: true
        })
        if (res) {
            if (res.code == 200) {
                isLogin.value = true
                setUserInfo(res.data)
                typeof callback == 'function' && callback()
            } else {
                logout()
            }
        } else {
            logout()
        }

    }
    const login = (tk: string, callback?: () => void) => {
        localStorage.setItem('user-token', tk)
        token.value = tk
        updateUserInfo(callback)
    }
    if (localStorage.getItem('user-token')) {
        login(localStorage.getItem('user-token') as string)
    }
    const showVerify = (cb?: () => void) => {
        verifyCallback.value = cb
        verifyVisible.value = true
    }

    const followUser:(uid:number)=>Promise<{
        result:boolean
    }> = (uid: number) => {
        //关注用户
        return new Promise((resolve, reject) => {
            showLoading()
            followUserApi({
                uid
            }).then(res => {
                if (res) {
                    showToast(res.msg)
                    resolve(res.data)
                } else {
                    reject('关注失败')
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
    return {
        userInfo,
        token,
        isLogin,
        updateUserInfo,
        setUserInfo,
        login,
        logout,
        verifyVisible,
        verifyCallback,
        addressList,
        updateAddressList,
        getUserAddress,
        checkVerify: (cb?: () => void) => {
            //若已经实名认证过则执行回调函数，否则弹出实名认证弹窗
            if (userInfo.value?.verified_flag == 'Y') {
                typeof cb == 'function' && cb()
            } else {
                showVerify(cb)
            }
        },
        showVerify,
        hideVerify: () => {
            verifyVisible.value = false
        },
        isVerified: () => {
            return userInfo.value?.verified_flag == 'Y'
        },
        followUser,
        messageNum,
    }
})
