<script setup lang="ts" name="UserQrcode">
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/store/User';
import Avatar from '@/components/Avatar.vue';
import QrcodeVue from 'qrcode.vue';
import { rpxToPx } from '@/utils';

const userStore = useUserStore()
const location = window.location.origin
//完成保存二维码功能
const onSave = ()=>{
    const canvas = document.querySelector('.qrcode') as HTMLCanvasElement
    if(canvas){
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = '二维码.png'
        a.click()
    }
}
</script>
<template>
    <NavBar>
    </NavBar>
    <div class="main">
        <div class="userinfo align-center">
            <Avatar :url="userStore.userInfo?.avatar||''"  :size="128"/>
            <div class="info">
                <div class="nickname">{{ userStore.userInfo?.nickname }}</div>
                <div class="text">ID：{{ userStore.userInfo?.user_code }}</div>
            </div>
        </div>

        <qrcode-vue :value="location + '/u/'+userStore.userInfo?.uid" :size="rpxToPx(500)" level="H" class="qrcode" />

        <van-button type="primary" round block class="ignore-theme-btn" @click="onSave">保存二维码</van-button>
    </div>
</template>
<style lang="less" scoped>
.main {
    margin: 100px auto;
    width: 600px;

    .userinfo {

        display: flex;
        gap:20px;

        .info {
            flex: 452px;
            >*{
                width: 452px;
            }
            .text{
                font-size: var(--size-info);
                color:#ffffff;
            }
        }
    }
    .qrcode{
        display: block;
        margin:100px auto;
        width:500px;
    }
    .save{
        background-color: var(--theme-gradual-btn);
    }
}
</style>
