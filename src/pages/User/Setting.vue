<script setup lang="ts" name="UserSetting">
import NavBar from '@/components/NavBar.vue';
import Avatar from '@/components/Avatar.vue';
import { useUserStore } from '@/store/User';
import { showConfirmDialog } from 'vant';
import { useRouter } from 'vue-router';

const userStore = useUserStore()

const router = useRouter()
const onLogout = () => {
    showConfirmDialog({
        title: '退出登录',
        message: '您确认要退出登录吗？',
    })
        .then(() => {
            userStore.logout()
            router.back()
        })
}
</script>
<template>
    <NavBar title="编辑信息" />
    <van-cell-group :border="false" class="cell margin" inset>
        <van-cell title="头像" center is-link to="/user/avatar" :border="false">
            <Avatar :url="userStore.userInfo?.avatar||''" />
        </van-cell>
        <van-cell title="昵称" center is-link to="/user/nickname" :border="false">
            {{ userStore.userInfo?.nickname }}
        </van-cell>
        <van-cell title="个人主页" center is-link :to="'/u/'+userStore.userInfo?.uid" :border="false">
        </van-cell>
        <van-cell title="ID" center is-link to="/user/code" :border="false">
            {{ userStore.userInfo?.user_code || '未设置' }}
        </van-cell>
        <van-cell title="我的二维码" center is-link to="/user/qrcode" :border="false">
            <template #value>
                <van-icon name="qr" size="28" />
            </template>
        </van-cell>
        <van-cell title="关联手机号" center is-link to="/user/mobile" :border="false">
            {{ userStore.userInfo?.mobile }}
        </van-cell>
        <van-cell title="简介" center is-link to="/user/description" :border="false">
            {{ !userStore.userInfo?.description ? '未设置' : (userStore.userInfo?.description.substring(0, 10) +
                (userStore.userInfo?.description.length > 10 ? '...' : '')) }}
        </van-cell>
    </van-cell-group>
    <div class="logout">
        <van-button type="danger" block @click="onLogout">退出当前登录</van-button>
    </div>
</template>
<style lang="less" scoped>
.logout {
    padding: var(--padding-box)
}

.cell {
    --van-cell-group-background: #333333;
    --van-cell-background: #333333;
    --van-cell-text-color:#ffffff;
}
</style>
