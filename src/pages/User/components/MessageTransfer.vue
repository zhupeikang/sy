<script setup lang="ts">
import { confirmTransferAssetApi, getTransferAssetDetailApi } from '@/api/asset';
import { TransferType } from '@/types';
import { showLoading, toDatetime } from '@/utils';
import { ref } from 'vue';
import { closeToast, showConfirmDialog } from 'vant';
import router from '@/router';

const show = ref(false)
const transfer = ref<TransferType>()
const onSuccess = (item: TransferType) => {
    showConfirmDialog({
        title: '转赠成功',
        message: '您已成功接收【' + item.asset.name + '】',
        confirmButtonText: '查看',
    })
        .then(() => {
            console.log('confirm')
            router.push('/asset/' + item.asset.asset_no)
        })
}
defineExpose({
    init: async (transfer_id: number) => {
        const loading = showLoading()
        const res = await getTransferAssetDetailApi({
            transfer_id: transfer_id
        })

        if (res) {
            loading.close()
            if (res.data.status == 'finish') {
                onSuccess(res.data)
                return
            }
            show.value = true
            transfer.value = res.data
        }
    }
})

const onCheck = async (transfer_id: number) => {
    const res = await getTransferAssetDetailApi({
        transfer_id: transfer_id
    })

    if (res) {
        if (res.data.status == 'finish') {
            closeToast(true)
            onSuccess(res.data)
            return
        }
        setTimeout(() => onCheck(transfer_id), 2000)
    }
}

const onConfirm = async (action: string) => {
    const loading = showLoading()
    const res = await confirmTransferAssetApi({
        transfer_id: transfer.value?.transfer_id,
        action,
    })
    if (res) {
        loading.close()
        show.value = false
        const transfer_id = transfer.value?.transfer_id as number
        transfer.value = undefined

        showLoading(res.msg)
        setTimeout(()=>{
            onCheck(transfer_id)
        },2000)


    }
}
</script>
<template>
    <van-dialog v-model:show="show" closeOnClickOverlay title="转赠接收确认" showCancelButton cancel-button-text="拒绝"
        @cancel="onConfirm('reject')" @confirm="onConfirm('receive')">
        <div class="content padding">
            <div>您有一个来自【{{ transfer?.send_address }}】的【{{ transfer?.asset.name }}】待接收。</div>
            <div>您需要在{{ toDatetime(transfer?.expired_at) }}前确认</div>
        </div>
    </van-dialog>
</template>
<style scoped lang="less">
.content {
    font-size: var(--size-info)
}
</style>
