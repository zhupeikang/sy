<script setup lang="ts">
import { rpxToPx } from '@/utils';


const props = defineProps({
    url:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        default:100
    }
})
</script>
<template>
    <div class="avatar" :style="{
        backgroundImage:`url(${props.url})`,
        width:rpxToPx(props.size)+'px',
        height:rpxToPx(props.size)+'px',
    }"></div>
</template>
<style scoped lang="less">
.avatar{
    display: inline-block;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
</style>