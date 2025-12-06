<script setup lang="ts">
import { colorPrimary } from '@/utils/const';

const props = defineProps({
    mask:{
        type:Boolean,
        default:false
    },
    navbar:{
        type:Boolean,
        default:false
    }
})
</script>
<template>
    <van-overlay show :class-name="props.navbar ? 'ignore-background' :  'background'" v-if="props.mask">
        <div class="wrapper" @click.stop>
            <Loading />
        </div>
    </van-overlay>
    <van-loading type="spinner" :color="colorPrimary" size="60px" v-else />
</template>
<style lang="less" scoped>
    .background{
        text-align:center;
        line-height: 100vh;
    }
    .ignore-background{
        text-align:center;
        line-height: calc(100vh - var(--van-nav-bar-height));
        height: calc(100vh - var(--van-nav-bar-height));
        top:var(--van-nav-bar-height);
    }
</style>
