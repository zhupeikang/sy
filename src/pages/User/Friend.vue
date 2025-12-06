<script setup lang="ts" name="UserFriend">
import { useRoute } from 'vue-router';
import Back from '@/components/Back.vue';
import { ref, watch } from 'vue';
import FriendList from './components/FriendList.vue';

const route = useRoute()

const tab = ref(0)
const actives = ref([false, false, false])
watch(() => route.params.type, (newValue) => {
    if (newValue == 'follow') tab.value = 1
    else if (newValue == 'fan') tab.value = 2
    else if (newValue == 'friend') tab.value = 0
}, {
    immediate: true
})
watch(() => tab.value, (newValue) => {
    actives.value[newValue] = true
}, {
    immediate: true
})
</script>
<template>
    <Back />
    <van-tabs v-model:active="tab" sticky class="ignore-tabs">
        <van-tab title="朋友" to="/user/friend/friend" replace>
            <FriendList type="friend" v-if="actives[0]" />
        </van-tab>
        <van-tab title="关注" to="/user/friend/follow" replace>
            <FriendList type="follow" v-if="actives[1]" />
        </van-tab>
        <van-tab title="粉丝" to="/user/friend/fan" replace>
            <FriendList type="fan" v-if="actives[2]" />
        </van-tab>
    </van-tabs>
</template>
<style scoped lang="less">
:deep(.van-tabs__nav) {
    padding-left: 50px;
    padding-right: 50px;
}
</style>
