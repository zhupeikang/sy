<script setup lang="ts">
const props = defineProps({
    mobile:{
        type:String
    }
})
const emits = defineEmits(['bind'])
</script>
<template>
    <div class="main font-info">
        <div class="title">
            当前手机号
        </div>
        <div class="mobile">
            {{ props.mobile }}
        </div>
        <div class="tips">
            手机号可以用于登录和帐号管理
        </div>
        <div class="margin-top">
            <van-button type="primary" round block class="ignore-theme-btn" @click="emits('bind')">更换绑定手机</van-button>
        </div>
    </div>
</template>

<style scoped lang="less">
.main {
    padding: 50px 20px;
    text-align: center;

    .mobile {
        padding: 100px 0;
        font-size: 64px;
    }
}
</style>