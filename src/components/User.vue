<script setup lang="ts">
import { UserDisplayType } from '@/types';
import { PropType } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    data: {
        type: Object as PropType<UserDisplayType>,
        default: () => []
    },
})
const router = useRouter()
</script>
<template>
    <div class="van-hairline--bottom van-hairline--top box" @click="router.push(`/u/${props.data.uid}`)">
        <div class="avatar" :style="{
            backgroundImage: `url(${props.data.avatar})`
        }">

        </div>
        <div class="info">
            <div class="nickname van-ellipsis">{{ props.data.nickname }}</div>
            <div class="desc van-ellipsis">{{ props.data.description }}</div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.box {
    display: block;
    .avatar{
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        display: inline-block;
        vertical-align: top;
        height:96px;
        width: 96px;
    }
    .info{
        width:630px;
        margin-left: 20px;
        display: inline-block;
        vertical-align: top;
        line-height: 48px;
        font-size:var(--size-info) ;
        .nickname{
            font-size:var(--size-subject) ;
        }
    }
}
</style>