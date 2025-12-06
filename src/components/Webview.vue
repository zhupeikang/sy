<script setup lang="ts">import { ref, watch } from 'vue';

const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    show: {
        type: Boolean,
        default: false
    },
    maxHeight:{
        type: String,
        default: '50vh'
    }
})
const show = ref(false)
const emit = defineEmits(['update:show'])
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

</script>
<template>
    <van-popup v-model:show="show" round position="bottom" :style="{ maxHeight: props.maxHeight }">
        <iframe :src="src" frameborder="0" style="width: 100%; height: 100%;"></iframe>
    </van-popup>
</template>