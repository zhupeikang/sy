<template>
    <div :class="!props.component ? 'bg-gradual-cell margin shadow-gold' : ''">
        <van-card :desc="`艺术品编号：` + asset.asset_no" :title="asset.name" class="goods-card" :thumb="asset.cover_url"
            @click="router.push('/asset/' + asset?.asset_no)" v-if="!props.component">
        </van-card>
        <van-cell title="资产哈希值" class="rights-item">
            <template #label>
                可在区块链浏览器中查询，唯一且不可篡改
            </template>
            <template #value>
                <van-button size="small" @click="copyToken" type="primary">复制</van-button>
            </template>
        </van-cell>
        <van-cell title="数字资产" class="rights-item">
            <template #label>
                资产以数字形式存在，存储在区块链上，并可在展览馆中展示
            </template>
        </van-cell>
        <van-cell v-for="(item, index) in asset.asset_rights" :key="index.toString()" :title="`${item.rights.name}`"
            class="rights-item">
            <template #title>
                {{ item.rights.name }}
                <InfoTips>
                    <template #content>
                        <div class="text-sm padding">
                            <div>兑换时间</div>
                            <div>{{ toDatetime(item.rights.exchange_begin_at, 'YYYY-MM-DD HH:mm') }} 至 {{
                                toDatetime(item.rights.exchange_end_at, 'YYYY-MM-DD HH:mm') }}</div>
                        </div>
                    </template>
                </InfoTips>
            </template>
            <template #label>
                <div>{{ item.rights.summary }}</div>
            </template>
            <template #value>
                <van-button size="small" v-if="item.rights.type == 'use'" @click="showRights(item)" type="primary">下载</van-button>
                <van-button size="small" v-if="item.rights.type == 'api'&&item.status==='pending'" @click="showRights(item)" type="primary">待核销</van-button>
                <van-button size="small" v-else-if="item.status == 'draw' || item.status == 'assign'" @click="showRights(item)" class="text-grey">已兑换</van-button>
                <van-button size="small" type="danger" v-else-if="item.rights.exchange_flag != 'Y'" disabled>未开启</van-button>
                <van-button size="small" type="success" v-else-if="item.rights.exchange_begin_at * 1000 > Date.now()" disabled>未开启</van-button>
                <van-button size="small" type="danger" v-else-if="item.rights.exchange_end_at * 1000 < Date.now()" disabled>已关闭</van-button>
                <van-button size="small" type="primary" v-else-if="item.status == 'pending'&&item.rights.type!=='api'" @click="showRights(item)">兑换</van-button>
            </template>
        </van-cell>
    </div>
    <RightsShow ref="rightsShowRef" @success="success" />
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AssetRightsType, AssetType } from '@/types';
import { toDatetime } from '@/utils';
import RightsShow from './RightsShow.vue';
import useClipboard from 'vue-clipboard3';
import { showToast } from 'vant';
import InfoTips from './InfoTips.vue';

const emits = defineEmits(['success'])
const props = defineProps({
    asset: {
        type: Object as PropType<AssetType & {
            asset_rights: AssetRightsType[]
        }>,
        required: true,
    },
    component: {
        type: Boolean,
        value: false,//是否以组件形式，如果是组件形式，则不显示编号和外边框
    }
})
const router = useRouter()
//处理错误
const success = (update: any) => {
    console.log('rightsDetail success',update)
    emits('success', update)
}
const rightsShowRef = ref<InstanceType<typeof RightsShow>>()
const showRights = (item: AssetRightsType) => {

    rightsShowRef.value?.init(item)
}

const { toClipboard } = useClipboard();
const copyToken = async () => {
    try {
        await toClipboard(props.asset.token_id);
        showToast('复制成功');
    } catch (e) {
        showToast('复制失败');
        console.error(e);
    }
}

</script>
<style scoped lang="less">
.goods-card {
    --van-card-background: transparent;
    --van-card-thumb-size: 100px;

    :deep(.van-card__title) {
        max-height: 96px;
        font-size: 32px;
        line-height: 48px;
        color: #ffffff;
    }
}

.token_id {
    max-width: 690px;
}

.rights-item {
    --van-cell-text-color: #ffffff;

    :deep(.van-cell__title) {
        flex: 4;
    }
}
</style>
