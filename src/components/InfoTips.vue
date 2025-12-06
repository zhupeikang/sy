<script setup lang="ts">
import { ref, useSlots } from 'vue';

const show = ref(false)

const slots = useSlots()
const props = defineProps({
    text:{
        type:String,
        default:''
    }
})
</script>
<template>
    <van-popover v-model:show="show" placement="bottom-start">
        <slot name="content" v-if="slots.content"/>
        <div v-else class="text-sm padding">{{props.text}}</div>
        <template #reference>
            <van-icon name="info-o" />
        </template>
    </van-popover>
</template>