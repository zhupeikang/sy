<script lang="ts" setup>
import { useKeepAliverStore } from '@/store/KeepAliver';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    color: {
        type: String,
        default: 'var(--color-primary)'
    },
});
const router = useRouter()
const route = useRoute()
const KeepAliverStore = useKeepAliverStore()
const back = () => {
    console.log('back remove router', route.name)
    KeepAliverStore.remove(route.name as string)
    if (history.length == 1) {
        router.replace('/home')
    } else {
        router.back()
    }
}
</script>
<template>
    <van-icon name="arrow-left" size="24px" class="ignore-back" :color="props.color" @click="back" />
</template>
<style lang="less" scoped>
.ignore-back {
    position: fixed;
    top: 10px;
    left: 10px;
    cursor: pointer;
    z-index: 100;
}
</style>