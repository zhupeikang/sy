<script setup lang="ts">
const emits = defineEmits(['transfer'])
</script>
<template>
    <div class="ignore-tabbar-box"></div>
    <div class="ignore-tabbar">

        <van-button type="primary" @click="emits('transfer')">转赠待您接收中...</van-button>

    </div>
</template>

<style scoped lang="less">
.ignore-tabbar {
    background-color: var(--theme-bar);
    padding-bottom: calc(constant(safe-area-inset-bottom) +10px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 10px);
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: calc(100vw - 40px);
    z-index: 100;
    text-align: right;
    color: #ffffff;

}

.ignore-tabbar-box {
    height: calc(64px + constant(safe-area-inset-bottom));
    height: calc(64px + env(safe-area-inset-bottom));
}
</style>