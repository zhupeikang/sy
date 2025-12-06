<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { UserAddressType } from '@/types';
import { showLoading } from '@/utils';
import { defaultUserAddressApi, deleteUserAddressApi } from '@/api/user';
import { useRouter } from 'vue-router';
import { useRefreshStore } from '@/store/Refresh';
import { useUserStore } from '@/store/User';
import { Empty, showConfirmDialog, showToast } from 'vant';
import Address from './Address.vue';

const userStore = useUserStore()
const refreshStore = useRefreshStore()
const router = useRouter()
const props = defineProps({
    height: {
        type: String,
        default: 'calc(100vh - var(--van-nav-bar-height))'

    },
    page: {
        type: String,
        default: 'list',
    },
    address: {
        type: Number,
        default: 0
    }
})

const list = ref<UserAddressType[]>([])

const isManage = ref(false)

const onLoad = async () => {
    list.value = []
    const loading = showLoading('加载中')
    await userStore.updateAddressList()
    loading.end()
}
onLoad()
watch(() => userStore.addressList, newValue => {
    list.value = newValue
}, {
    immediate: true,
    deep: true
})
watch(() => refreshStore.userAddress, (newValue) => {
    //监听是否需要刷新页面
    if (newValue) {
        onLoad()
        refreshStore.userAddress = false
    }
}, {
    immediate: true,
    deep: true
})

const default_address_id = ref(0)
watch(() => userStore.userInfo?.address_id, newValue => {
  console.log(newValue,'newValue');
    default_address_id.value = newValue || 0
}, {
    immediate: true,
    deep: true
})
console.log('重新加载')
const onDelete = async (address_id: number) => {
    showConfirmDialog({
        title: '删除确认',
        message: '您确认要删除该地址吗？'
    })
        .then(async () => {
            showLoading('删除中')
            const res = await deleteUserAddressApi({ address_id })
            if (res) {
                showToast(res.msg)
                refreshStore.userAddress = true
                userStore.updateUserInfo()
            }
        })

}
const onDefault = async () => {
    if (default_address_id.value == userStore.userInfo?.address_id) {
        isManage.value = false
        return;
    }
    showLoading('设置中')
    const res = await defaultUserAddressApi({ address_id: default_address_id.value })
    if (res) {
        showToast(res.msg)
        refreshStore.userAddress = true
        userStore.updateUserInfo()
        isManage.value = false
    }
}
const emits = defineEmits(['choose'])

</script>
<template>
    <div :style="{
        marginBottom: `var(--van-button-default-height))`
    }" class="padding">
        <div class="flex justify-between header">
            <div>常用地址</div>
            <div v-if="props.page == 'component'" @click="router.push('/user/address')">
                <van-icon name="edit" />
                管理
            </div>
            <div @click="isManage = true" v-else-if="!isManage">
                <van-icon name="edit" />
                管理
            </div>
            <div v-else @click="onDefault">
                <van-icon name="edit" />
                完成
            </div>
        </div>
        <div class="list">
            <van-radio-group :value="props.address" v-if="props.page == 'component'">
                <div v-if="list.length > 0 && list.findIndex(n => n.address_id == userStore.userInfo?.address_id) >= 0">
                    <Address :item="list.find(n => n.address_id == userStore.userInfo?.address_id)" show-tag @click="emits('choose', list.find(n => n.address_id == userStore.userInfo?.address_id))">
                        <template #icon>
                            <van-radio :name="userStore.userInfo?.address_id" />
                        </template>
                    </Address>
                </div>
                <div v-for="(item, index) in list" :key="index.toString()"
                    v-show="item.address_id != userStore.userInfo?.address_id">
                    <Address :item="item" :icon="item.name.substring(0, 1)"
                        @click="emits('choose',item)">
                        <template #icon>
                            <van-radio :name="item?.address_id" />
                        </template>
                    </Address>
                </div>
            </van-radio-group>
            <van-radio-group v-model="default_address_id" v-else>
                <div v-if="list.length > 0 && list.findIndex(n => n.address_id == userStore.userInfo?.address_id) >= 0">
                    <Address :item="list.find(n => n.address_id == userStore.userInfo?.address_id)" show-tag
                        @click="emits('choose', list.find(n => n.address_id == userStore.userInfo?.address_id))">
                    </Address>
                </div>
                <div v-for="(item, index) in list" :key="index.toString()"
                    v-show="item.address_id != userStore.userInfo?.address_id">
                    <Address :item="item" :icon="item.name.substring(0, 1)"
                        @click="emits('choose', item)">
                    </Address>

                    <div class="padding-lr padding-bottom flex justify-between align-center margin-lr text-sm"
                        v-if="isManage">
                        <div class="flex align-center">
                            <van-radio :name="item.address_id">
                                <span class="text-white">默认地址</span>
                            </van-radio>
                        </div>
                        <div @click="onDelete(item.address_id)" class="text-red">删除</div>
                    </div>
                </div>
            </van-radio-group>

            <Empty v-if="list.length == 0" description="您还没有设置过收货地址" />
        </div>

    </div>
    <div class="bar-btn-box"></div>
    <van-button class="bar-btn" type="primary" block @click="onDefault"
        v-if="props.page != 'component' && isManage">保存</van-button>
    <van-button icon="plus" class="bar-btn" type="primary" block v-else
        @click="router.push('/user/address/add')">添加收货地址</van-button>
</template>
<style lang="less" scoped>
.list {
    background-color: #1f1f1f;
    color: #ffffff;
}

.header {
    font-size: var(--size-info);
    padding: var(--padding-box);
    color: #ffffff;
}
</style>
