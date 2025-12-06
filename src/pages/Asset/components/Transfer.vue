<script setup lang="ts">
import {
  cancelTransferAssetApi,
  confirmTransferAssetApi,
  getTransferAssetDetailApi,
  transferAssetApi,
} from '@/api/asset';
import { getFriendListApi } from '@/api/user';
import Avatar from '@/components/Avatar.vue';
import { AssetType, TransferType, UserType } from '@/types';
import { showLoading, toDatetime } from '@/utils';
import { closeToast, showConfirmDialog, showDialog, showToast } from 'vant';
import { PropType, ref, watch } from 'vue';
import router from '@/router';
import { useUserStore } from '@/store/User';

const userStore = useUserStore()
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    asset: {
        type: Object as PropType<AssetType>,
        default: () => {
        }
    },
    transfer: {
        type: Object as PropType<TransferType>,
        default: () => {
        }
    }
})

const emits = defineEmits(['update:show', 'success'])

const error = ref(false)
const errorText = ref('')
const loading = ref(false)
const finished = ref(false)
const address = ref('')
const list = ref<{
    uid: number
    follow_uid: number
    follow: UserType
}[]>([])
const limit = 20
const onLoad = async () => {
    if (loading.value) return
    loading.value = true
    getFriendListApi({
        skip: list.value.length,
        limit,
        showError: true
    })
        .then(res => {
            if (res.code != 200) {
                error.value = true
                errorText.value = res.msg
                return
            }
            if (res.data.list.length < limit) {
                finished.value = true
            }
            if (res.data.list.length > 0) {
                list.value = list.value.concat(res.data.list)
            }
        })
        .catch(err => {
            error.value = true
            errorText.value = err.message
        })
        .finally(() => {
            loading.value = false
        })
}

const toAddress = () => {
    if (address.value.length <= 0) {
        return showToast('请输入钱包地址')
    }

    onTransfer({ address: address.value })
}
const toFriend = (item: any) => {
    onTransfer({ uid: item.follow.uid })
}
const onTransfer = async (params: any) => {
    showLoading()
    const res = await transferAssetApi({
        ...params,
        asset_no: props.asset.asset_no,
    })
    if (res) {
        showToast(res.msg)
        emits('success', res.data)
    }
}

const onCancel = async () => {
    showConfirmDialog({
        title: '取消转赠',
        message:
            '您确认要取消转赠吗？',
    })
        .then(async () => {
            showLoading()
            const res = await cancelTransferAssetApi({
                transfer_id: props.transfer.transfer_id
            })
            if (res) {
                showToast(res.msg)
                emits('success', res.data)
            }
        })

}

const onReject = async () => {
    showConfirmDialog({
        title: '拒绝转赠',
        message:
            '您确认要拒绝转赠吗？',
    })
        .then(async () => {
            showLoading()
            const res = await confirmTransferAssetApi({
                transfer_id: props.transfer.transfer_id,
                action:'reject'
            })
            if (res) {
                showToast(res.msg)
                emits('success', res.data)
            }
        })

}
const onSuccess = (item: TransferType) => {
    emits('success')
    showDialog({
        title: '接收成功',
        message: '您已成功接收【' + item.asset.name + '】',
        confirmButtonText: '关闭',
    })
}
const onCheck = async (times:number) => {
    if(times>30) return showToast('转赠超时')
    const res = await getTransferAssetDetailApi({
        transfer_id: props.transfer.transfer_id
    })

    if (res) {
        if (res.data.status == 'finish') {
            closeToast(true)
            onSuccess(res.data)
            return
        }
        setTimeout(() => onCheck(times+1), 2000)
    }
}
const onConfirm = async () => {

    showLoading()
    const res = await confirmTransferAssetApi({
        transfer_id: props.transfer.transfer_id,
        action:'receive'
    })
    if (res) {
        showLoading(res.msg)
        setTimeout(()=>{
            onCheck(0)
        },2000)

    }

}
watch(() => props.show, (newValue) => {
    if (newValue) {
        if (list.value.length == 0) onLoad()
    }
})
</script>
<template>
    <van-popup @close="emits('update:show', false)" :show="props.show" closeable position="bottom"
        :style="{ minHeight: '30vh', maxHeight: '60vh' }">
        <div v-if="asset.lock_flag == 'no'">
            <div class="text-center padding">转赠选择({{asset.platform}})</div>
            <van-field v-model="address" center clearable placeholder="输入钱包地址转赠" maxlength="50">
                <template #button>
                    <van-button size="small" class="ignore-theme-btn action" @click="toAddress">转赠</van-button>
                </template>
            </van-field>
            <div class="text-center padding ">好友转赠</div>
            <van-list v-model:loading="loading" :finished="finished" v-model:error="error" :error-text="errorText"
                @load="onLoad" v-if="props.show" finished-text="没有更多了">
                <div class="list margin-bottom">
                    <div class="item flex align-center justify-between margin-lr" v-for="(item, index) in list"
                        :key="index.toString()">
                        <div class="flex align-center">

                            <Avatar :url="item.follow.avatar" />
                            <div class="margin-left">
                                <div>{{ item.follow.nickname }}</div>
                                <div class="van-ellipsis text-sm">ID：{{ item.follow.user_code }}</div>
                            </div>
                        </div>

                        <van-button size="small" class="ignore-theme-btn action" @click="toFriend(item)">转赠</van-button>
                    </div>
                </div>
            </van-list>
        </div>
        <div v-else-if="asset.lock_flag == 'transfer'">
            <div class="text-center padding">转赠接收中</div>
            <van-steps :active="1" active-icon="more-o">
                <van-step>发起转赠</van-step>
                <van-step>转赠接收中</van-step>
                <van-step>转赠完成</van-step>
            </van-steps>
            <van-cell-group v-if="userStore?.userInfo?.uid == transfer.uid">
                <van-cell title="接收地址" :value="transfer.receive_address" v-if="transfer.type == 'address'" />
                <van-cell title="接收人" :value="transfer.receive_nickname" v-else is-link
                    @click="router.push('/u/' + transfer.receive_uid)" />
                <van-cell title="有效期" :value="toDatetime(transfer.expired_at)" />
                <div class="padding">
                    <van-button type="primary" @click="onCancel" class="ignore-theme-btn action">取消转赠</van-button>
                </div>
            </van-cell-group>
            <van-cell-group v-else-if="userStore?.userInfo?.uid == transfer.receive_uid">
                <van-cell title="转出地址" :value="transfer.send_address" v-if="transfer.type == 'address'" />
                <van-cell title="转出人" :value="transfer.send_nickname" v-else is-link
                    @click="router.push('/u/' + transfer.uid)" />
                <van-cell title="有效期" :value="toDatetime(transfer.expired_at)" />
                <div class="padding flex justify-between">
                    <van-button type="danger" @click="onReject" class="ignore-default-btn action">拒绝转赠</van-button>
                    <van-button type="primary" @click="onConfirm" class="ignore-theme-btn action">确认接收</van-button>
                </div>
            </van-cell-group>
        </div>
    </van-popup>
</template>
<style scoped lang="less">
.list {
    .item {
        gap: 20px;
        color: #ffffff;

    }
}
</style>
