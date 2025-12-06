<script setup lang="ts" name="Profile">
import UserInfo from '@/components/UserInfo.vue';
import Menu from './components/Menu.vue';
import Count from '@/components/UserCount.vue';
import { useUserStore } from '@/store/User';
import Login from '@/components/Login.vue';
import router from '@/router';
import { onActivated, ref, watch } from 'vue';
import { getAssetURL, track } from '@/utils';
import UserDisplay from './components/UserDisplay.vue';
import { closeToast } from 'vant';
import { getUserAssetPendingCount } from '@/api/user';

const userStore = useUserStore()
const msgs = ref(0)
const rights=ref(0)
watch(() => userStore.userInfo?.msgs, (newValue) => {
    if (newValue) {
        msgs.value = Object.values(userStore.userInfo?.msgs || {}).reduce((a, b) => a + b, 0)
    } else {
        msgs.value = 0
    }
}, {
    immediate: true
})
track('profile', {
    action: 'index'
})
const onLogin = ()=>{
    closeToast()
}
onActivated(() => {
  getUserAssetPendingCount().then((res: any) => {
    rights.value = res.data.count
  })
})
const push = (name: string, action: string) => {
    track('profile', {
        action
    })
    router.push({
        name
    })
}
</script>
<template>
    <div v-if="userStore.isLogin && userStore.userInfo">
        <Menu />
        <UserInfo :user="userStore.userInfo" to="/user/setting">
            <template #right>
                <div class="arrow ignore-arrow">
                    <van-icon name="arrow" size="24px" />
                </div>
            </template>
        </UserInfo>
        <Count :user="userStore.userInfo" clickable />
        <van-grid clickable :border="false" class="bg-gradual-cell margin grid">
            <van-grid-item :icon="getAssetURL('assets/imgs/profile/msg.png')" text="消息中心"
                @click="push('UserMessage','message')" :badge="msgs > 0 ? (msgs>99 ?'99+' : msgs) : ''" />
<!--            <van-grid-item :icon="getAssetURL('assets/imgs/profile/favor.png')" text="我的收藏"-->
<!--                @click="push('UserFavor','like')" />-->
            <van-grid-item :icon="getAssetURL('assets/imgs/profile/rights.png')" text="权益背包"
                           :badge="rights > 0 ? (rights>99 ?'99+' : rights) : ''"  @click="push('UserRights','rightbag')" />
            <van-grid-item :icon="getAssetURL('assets/imgs/profile/log.png')" text="资产记录"
                @click="push('UserAssetlog','assetrecord')" />
          <van-grid-item :icon="getAssetURL('assets/imgs/v3/门票.png')" text="我的门票"
                         @click="push('UserTicket','ticket')" />
        </van-grid>
        <UserDisplay :user="userStore.userInfo"/>
    </div>
    <div v-else>
        <Login @success="onLogin"/>
    </div>
</template>
<style scoped lang="less">
.arrow {
    position: absolute;
    top: 90px;
    cursor: pointer;
    z-index: 100;
}

.ignore-arrow {
    right: 10px;
}

.grid {
    :deep(.van-grid-item__icon) {
        img {

            width: 58px;
            height: 65px;
        }
    }
}

</style>
