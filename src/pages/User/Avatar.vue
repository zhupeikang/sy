<script setup lang="ts" name="UserAvatar">
import { ref, watch } from 'vue';
import NavBar from '@/components/NavBar.vue';
import { showLoading } from '@/utils';
import { getUserAvatarListApi, saveUserAvatarApi } from '@/api/user';
import Avatar from '@/components/Avatar.vue';
import { useUserStore } from '@/store/User';

const userStore = useUserStore()
const tab = ref(0)

const commonList = ref<string[]>([])
const ownerList = ref<string[]>([])
const selected = ref('')

watch(() => userStore.userInfo?.avatar, newValue => {
    selected.value = newValue || ''
}, {
    immediate: true
})

const onLoad = async () => {
    const loading = showLoading()
    const res = await getUserAvatarListApi()
    loading.end()
    if (res) {
        commonList.value = res.data.common
        ownerList.value = res.data.owner
    }

}
const onSubmit = async () => {
    if (selected.value) {
        const loading = showLoading()
        const res = await saveUserAvatarApi({
            value: selected.value
        })
        loading.end()
        if (res) {
            userStore.updateUserInfo()
            history.back()
        }
    }
}
onLoad()
</script>
<template>
    <NavBar title="头像">
        <template #right>
            <van-button size="small" type="primary" @click="onSubmit" class="ignore-theme-btn action">保存</van-button>
        </template>
    </NavBar>
    <van-tabs v-model:active="tab" swipeable offset-top="46" sticky class="ignore-tabs">
        <van-tab title="默认头像">
            <div class="list grid col-3">
                <div :class="selected == item ? 'item selected' : 'item'" v-for="(item, index) in commonList"
                    :key="index.toString()">
                    <Avatar :size="150" :url="item" class="avatar" @click="selected = item" />
                </div>
            </div>
        </van-tab>
        <van-tab title="权益头像">
            <div class="list grid col-3">
                <div :class="selected == item ? 'item selected' : 'item'" v-for="(item, index) in ownerList"
                    :key="index.toString()">
                    <Avatar :size="150" :url="item" class="avatar" @click="selected = item" />
                </div>
            </div>
        </van-tab>
    </van-tabs>
</template>
<style lang="less" scoped>
.list {
    padding: var(--padding-box);

    .item {
        text-align: center;

        .avatar {
            box-sizing: border-box;
            border-radius: 50%;
            border: 1px solid var(--grey)
        }
    }

    .item.selected {
        .avatar {
            border-width: 5px;
            border-color: var(--theme-gold)
        }
    }

}
</style>