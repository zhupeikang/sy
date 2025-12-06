<script setup lang="ts">
import { chooseForumAssetApi } from '@/api/forum';
import { ref } from 'vue';

const loading = ref(false)
const finished = ref(false)
const show = ref(false)
const refreshing = ref(false)

const error = ref(false)
const errorText = ref('')
const list = ref<{
    asset_no: string
    name: string
    contract: {
        cover_url: string
    }
}[]>([])
/**
 * 加载数据
 */
const onLoad = async () => {
    loading.value = true
    const res = await chooseForumAssetApi({
        limit: 10,
        skip: list.value.length,
        showError: true
    })
    loading.value = false
    refreshing.value = false
    if (res) {
        if (res.code == 200) {
            if (res.data.list.length < 10) {
                finished.value = true
            }
            list.value = list.value.concat(res.data.list)
        } else {
            error.value = true
            errorText.value = res.msg
        }
    } else {
        error.value = true
        errorText.value = '加载失败'
    }
}
/**
 * 重新加载
 */
const onRefresh = async () => {
    finished.value = false
    list.value = []
    await onLoad()
}
const inited = ref(false)
const asset_no = ref('')
defineExpose({
    show: (asset?: string) => {
        show.value = true
        inited.value = true
        asset_no.value = asset || ''
    }
})
const onConfirm = () => {
    show.value = false
    emits('confirm', asset_no ? list.value.find(n => n.asset_no == asset_no.value) : null)
}
const onCancel = () => {
    show.value = false
}

const emits = defineEmits(['confirm'])
</script>
<template>
    <van-popup position="bottom" v-model:show="show" :style="{ height: 'calc(40vh + 50px)' }">
        <div class="box">
            <div class="flex justify-between ignore-action-bar">
                <van-button type="default" @click="onCancel" class="ignore-btn action">取消</van-button>
                <van-button type="primary" @click="onConfirm" class="ignore-theme-btn action">确定</van-button>
            </div>
            <van-radio-group v-model="asset_no">
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多资产了" @load="onLoad"
                        v-if="inited" :error="error" :error-text="errorText"
                        :style="{ height: '40vh', overflow: 'scroll' }">
                        <van-cell v-for="(item, index) in list" :key="index.toString()" :title="item.name"
                            :label="'资产编号：' + item.asset_no" clickable @click="asset_no = item.asset_no" :border="false" class="cell">
                            <template #icon>
                                <van-image width="46px" height="46px" fit="contain" :src="item.contract.cover_url" class="cover" />
                            </template>
                            <template #right-icon>
                                <van-radio :name="item.asset_no" class="radio"/>
                            </template>
                        </van-cell>
                    </van-list>
                </van-pull-refresh>
            </van-radio-group>
        </div>
    </van-popup>
</template>
<style scoped lang="less">
.box {
    position: relative;
    --van-cell-text-color:#666666;
    --van-cell-label-color:#ffffff;
    background-color: #0f0f0f;
    --van-radio-border-color: var(--theme-gold);
    // .radio{
    //     :deep(.van-icon){

    //         color: var(--theme-gold);
    //     }
    // }
    .ignore-action-bar {
        padding: var(--padding);
    }
    .cover{
        margin-right:5px;
    }
    .cell:nth-child(2n+1){
        --van-cell-background:#1f1f1f;
    }
    .cell:nth-child(2n){
        --van-cell-background:#0f0f0f;
    }

}
</style>