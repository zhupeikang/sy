<script setup lang="ts">
import { UserAddressType } from '@/types';
import { PropType, useSlots } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const props = defineProps({
    item: {
        type: Object as PropType<UserAddressType>,
    },
    showTag: {
        type: Boolean,
        default: false,
    },
    tagText: {
        type: String,
        default: '默认',
    },
    icon: {
        type: String,
        default: '',
    }
})
const emits = defineEmits(['click'])
const slots = useSlots()
</script>
<template>
    <van-cell @click="emits('click', item)" class="cell align-center" :border="false">
        <template #icon>

            <slot name="icon" v-if="slots.icon" />
            <div class="round" v-else>
                <div class="main icon" v-if="!props.icon" />
                <div class="icon" v-else>
                    {{ item?.name.substring(0, 1) }}
                </div>
            </div>

        </template>
        <template #title>
            {{ props.item?.name }}
            {{ props.item?.mobile }}
            <span class="default" v-if="props.showTag">{{ props.tagText }}</span>
        </template>
        <template #label>
            <div class="address">
                {{ props.item?.area }} {{ props.item?.address }}
            </div>
        </template>
        <template #right-icon>
            <van-icon name="edit" size="24" @click.stop="router.push('/user/address/' + props.item?.address_id)" />
        </template>
    </van-cell>
</template>
<style scoped lang="less">
.cell {
    --van-cell-text-color: #ffffff;
    :deep(.van-cell__title){
        padding-left: 20px;
    }
    .default{
        color:var(--theme-deep-gold);
    }
    .round {
        background-color: #2f2f2f;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        .main{
            margin-top:24px;
            display: inline-block;
            width:34px;
            height:31px;
            background-repeat: no-repeat;
            background-position: center;
            background-size:cover;
            background-image:url(@/assets/imgs/icon_main.png)
        }
    }

    .address {
        word-break: break-all;
        max-width: 470px;
    }
}


</style>
