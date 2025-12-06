<script setup lang="ts">
import { getPlanComposeAssetApi } from '@/api/plan';
import { PlanComposeChildType } from '@/types';
import { showLoading } from '@/utils';
import { ref } from 'vue';

const compose_id = ref(0)
const child = ref<PlanComposeChildType>()
const show = ref(false)
const selected = ref<string[]>([])
const assetList = ref<{
    asset_no: string
    lock_flag: string
}[]>([])
defineProps({
  select: {
    type: Array,
    default: () => [],
  },
})

defineExpose({
    onInit: async (id: number, item: PlanComposeChildType) => {
        const loading = showLoading()
        const res = await getPlanComposeAssetApi({
            compose_id,
            contract_id: item.contract_id
        })
        if (res) {
            loading.end()
            compose_id.value = id
            child.value = item
            selected.value = child.value.selected || []
            show.value = true
            assetList.value = res.data.list
        }
    }
})
const emits = defineEmits(['confirm'])
const onConfirm = async () => {
    if (!child.value) return
    show.value = false
    emits('confirm', selected.value)
}

const onChoose = (item: {
    asset_no: string
    lock_flag: string
}) => {
  if (select.value.includes(item.asset_no)) return
    if (!child.value || item.lock_flag != 'no') return
    if (selected.value.includes(item.asset_no)) {
        selected.value = selected.value.filter(v => v != item.asset_no)
    } else {
        if (selected.value.length >= child.value?.nums) return
        selected.value.push(item.asset_no)
    }
}
</script>
<template>
    <van-popup v-model:show="show" :style="{ minHeight: '30vh' }" position="bottom" class="dialog">
        <van-nav-bar :title="`已选择${selected.length}/${child?.nums}`" :border="false" class="popup-nav-bar">
            <template #right>
                <van-button size="small" type="primary" @click="onConfirm"
                    :disabled="child?.nums != selected.length">确认</van-button>
            </template>
            <template #left>
                <van-button size="small" @click="show = false">取消</van-button>
            </template>
        </van-nav-bar>
        <van-checkbox-group v-model="selected" :max="child?.nums">
            <div class="assetList">
                <div class="item" v-for="(item, index) in assetList" :key="index.toString()" @click="onChoose(item)">
                    <div class="cover" :style="{ backgroundImage: `url(${child?.contract.cover_url})` }">
                        <van-checkbox  :disabled="select.includes(item.asset_no)" :name="item.asset_no" v-if="item.lock_flag == 'no'" class="choose" @click.stop />
                        <van-icon name="lock" class="choose" v-else />
                    </div>
                    <div class="name">{{ item.asset_no }}</div>
                </div>
            </div>
        </van-checkbox-group>
    </van-popup>
</template>
<style scoped lang="less">


.assetList {
    background-color:#222222;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 9px;
    max-height: 60vh;
    overflow-y: scroll;
    padding:20px;

    .item {
        margin-right:10px;
        width:223px;
        box-sizing: border-box;
        background-image: url(../../../assets/imgs/bg.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 10px;

        .cover {
            width: 100%;
            padding-top: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            position: relative;

            .choose {
                position: absolute;
                right: 0px;
                top: 0px;
            }
        }
        .name{
            padding:0 20px;
            font-size: var(--size-info);
            height:75px;
            line-height: 75px;
        }
    }
    .item:nth-child(3n){
        margin-right:0px;
    }
}
</style>
