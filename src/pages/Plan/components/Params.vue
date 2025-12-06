<script setup lang="ts">
import { PlanParamType } from '@/types';
import { showFailToast, showToast } from 'vant';
import { PropType, ref, watch } from 'vue';
import useClipboard from 'vue-clipboard3';
import { useRouter } from 'vue-router';

const props = defineProps({
    dataList: {
        type: Array as PropType<PlanParamType[]>,
        default: () => []
    },
    show: {
        type: Boolean,
        default: false,
    },
})
const emit = defineEmits(['update:show'])
const show = ref(false)
const { toClipboard } = useClipboard();
//实现父子孙值同步
watch(() => props.show, (val) => {
    if (val != show.value) {
        show.value = val
        console.log('监听到props.show值变化')
    }
})
watch(() => show.value, (val) => {
    if (val != props.show) {
        console.log('监听到show.value值变化')
        emit('update:show', val)
    }
})
const router = useRouter()
const onClick = async (item: PlanParamType) => {
    if(!item.value) return
    if (item.type == 'copy') {
        try {
            await toClipboard(item.value);
            showToast('复制成功');
        } catch (e) {
            showFailToast('复制失败');
            console.error(e);
        }
    }else if(item.type=='link'){
        window.open(item.value)
    }else if(item.type=='push'){
        router.push(item.value)
    }
}
</script>
<template>
    <van-popup v-model:show="show" round position="bottom" :style="{ maxHeight: '50vh' }">
        <van-cell-group>
            <van-cell :title="item.label" :value="item.text" v-for="(item, index) in dataList" :key="index.toString()"
                :is-link="item.type == 'link' || item.type == 'push'" @click="onClick(item)">
                <template #right-icon v-if="item.type == 'copy'">
                    <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon" />
                </template>
            </van-cell>
        </van-cell-group>
    </van-popup>
</template>
<style lang="less" scoped>
.right-icon {
    font-size: 29px;
    line-height: inherit;
}
</style>
