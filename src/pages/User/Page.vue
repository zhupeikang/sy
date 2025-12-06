<script setup lang="ts" name="UserPage">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { UserType } from '@/types';
import Error from '@/components/Error.vue';
import Back from '@/components/Back.vue';
import Loading from '@/components/Loading.vue';
import UserInfo from '@/components/UserInfo.vue';
import UserCount from '@/components/UserCount.vue';
import { getUserPageApi } from '@/api/user';
import { useUserStore } from '@/store/User';
import UserDisplay from './components/UserDisplay.vue';

const route = useRoute()
//处理错误
const errorShow = ref(false)
const errorText = ref('')
//3D模型
const showModel = ref(false)

const user = ref<UserType>()
const followed = ref(false)
const _followed = ref(false)
const loading = ref(true)
watch(
    () => route.params.uid as string,
    (newData) => {
        if(!newData) return;
        console.log(newData)
        loading.value = true
        errorShow.value = false
        errorText.value = ''
        showModel.value = false
        user.value = undefined
        getUserPageApi({
            uid: newData,
            showError: true
        })
            .then(res => {
                loading.value = false
                if (res.code != 200) {
                    errorShow.value = true
                    errorText.value = res.msg
                    return
                }

                user.value = res.data.user
                followed.value = res.data.followed
                _followed.value = res.data.followed
            })
            .catch(e => {
                loading.value = false
                console.error(e)
                errorShow.value = true
                errorText.value = '发生了错误' + e.message
            })
    },
    {
        deep: true,
        immediate: true
    }
)

const userStore = useUserStore()

const onFollow = async () => {
    console.log('触发onfollow')
    userStore.followUser(user.value?.uid || 0).then(data => {
        followed.value = data.result
        if (data.result) {
            userStore.userInfo!.follows++
            user.value!.fans++
        } else {
            userStore.userInfo!.follows--
            user.value!.fans--
        }
    })
}
const isSelf = ref(false)
watch(() => userStore.userInfo?.uid, (newValue) => {
    if (!newValue) {
        isSelf.value = false
        return
    }
    isSelf.value = newValue == parseInt(route.params?.uid as string)
}, {
    immediate: true
})
</script>
<template>
    <Error :text="errorText" :show="errorShow" />
    <Loading mask v-if="loading" />
    <!--加载后-->
    <div v-else-if="user" class="user-main">
        <Back />
        <UserInfo :user="user">
            <template #right>
                <van-button class="follow-btn ignore-btn action ignore-theme-btn"
                    v-if="!isSelf && !followed"
                    @touchstart.stop="onFollow">{{ _followed ? '回关' : '关注' }}</van-button>
                <van-button size="small" type="primary" class="follow-btn ignore-btn action"
                    v-else-if="userStore.isLogin && !isSelf" @touchstart.stop="onFollow">取关</van-button>
            </template>
        </UserInfo>

        <UserCount :user="user" />
        <UserDisplay :user="user"/>
    </div>
</template>
<style scoped lang="less">
.follow-btn {
    position: absolute;
    top: 30px;
    cursor: pointer;
    z-index: 100;
}

.ignore-btn {
    right: 10px;
}
</style>
