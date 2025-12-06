<script setup lang="ts">
import { UserType } from '@/types';
import Avatar from './Avatar.vue';
import { showFailToast, showToast } from 'vant';
import { PropType, ref, watch } from 'vue';
import useClipboard from 'vue-clipboard3';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/User';
import BindWallet from '@/components/BindWallet.vue';

const userStore = useUserStore()
const router = useRouter()
const props = defineProps({
    user: {
        type: Object as PropType<UserType>,
        required: true
    },
    to: {
        type: String
    }
});
let timer: ReturnType<typeof setTimeout> | null = null

const isSelf = ref(false)
watch(() => userStore.userInfo?.uid, (newValue) => {
    if (!newValue) {
        isSelf.value = false
        return
    }
    isSelf.value = newValue == props.user?.uid
}, {
    immediate: true
})
const showBind =ref(false);
const bind= () => {
  showBind.value=true
}
const startTimer = (event: TouchEvent) => {
    console.log('startTimer')
    timer = setTimeout(async () => {
        event.stopPropagation()
        try {
            await toClipboard(props.user?.wallet?.address || '');
            showToast('复制成功');
        } catch (e) {
            showFailToast('复制失败');
            console.error(e);
        }
        timer = null
    }, 1000)
}

const clearTimer = () => {
    if (timer !== null) {
        clearTimeout(timer)
        timer = null
        if (props.to) {
            router.push(props.to)
        }
    }
}

const startLongPress = (event: TouchEvent) => {
    event.preventDefault()
    startTimer(event)
}

const endLongPress = (event: TouchEvent) => {
    event.preventDefault()
    clearTimer()
    timer = null
}
const toSetting = () => {
    if (props.to) {
        router.push(props.to)
    }
}

const descHide = ref(true)
const { toClipboard } = useClipboard();
 const onCopy = async (text: string) => {
    try {
        await toClipboard(text);
        showToast('复制成功');
    } catch (e) {
        showFailToast('复制失败');
        console.error(e);
    }
}
</script>
<template>
    <div class="profile-bg">
        <!-- <div class="user-head" @click="toSetting" @touchstart.prevent="startTimer" @touchend.prevent="clearTimer"> -->
        <div class="user-head" @click="toSetting">
            <Avatar :size="120" :url="props.user?.avatar" />
            <div class="info">
                <div class="nickname van-ellipsis">{{ props.user?.nickname }}</div>
                <div class="id van-ellipsis">ID:{{ props.user?.user_code }}</div>
                <div class="address van-ellipsis" v-if="isSelf">
                    <div class="van-ellipsis address-value">区块链地址:{{ props.user?.wallet?.address || '生成中' }}</div>
                    <van-icon size="20" name="file-copy" v-if="props.user?.wallet?.address" class="right-icon" class-prefix="sylf-icon"
                        @click.stop="onCopy(props.user?.wallet?.address)" />
                </div>
                <div class="address van-ellipsis" v-if="isSelf">
                    <div v-if="props.user?.wallet?.cfx_address" class="van-ellipsis address-value">
                      Fluent Wallet: {{ props.user?.wallet?.cfx_address }}
                    </div>
                    <div v-else >
                      <van-button size="mini" icon="plus" type="primary" block @click.stop="bind">绑定Conflux钱包</van-button>
                    </div>
                    <van-icon  size="20" name="file-copy" v-if="props.user?.wallet?.cfx_address" class="right-icon" class-prefix="sylf-icon" @click.stop="onCopy(props.user?.wallet?.cfx_address)" />
                </div>
            </div>
            <slot name="right" />
        </div>
        <div class="description">
            <!-- <van-text-ellipsis :content="'我到底个is对股市对粉碎是干活水电费博附会哦第三方瑞大护法I地方 群文件而肥厚的我'" expand-text="[展开]" collapse-text="[收起]" class="text"/> -->

            <p class="text" v-if="!props.user.description || props.user.description.length == 0">{{ isSelf ? '您还没有填写个人简介'
                : 'Ta还没有填写个人简介' }}</p>
            <p class="text" v-else-if="props.user.description.length > 50" @click="descHide = !descHide">{{ descHide ?
                props.user?.description.substring(0, 50) : props.user.description }}&nbsp;&nbsp;&nbsp;&nbsp;<span
                    class="expand">[{{ descHide ? '展开' : '收起' }}]</span></p>
            <p class="text" v-else>{{ props.user?.description }}</p>
        </div>
      <div v-if="isSelf">
        <BindWallet v-model:show="showBind"></BindWallet>
      </div>
    </div>
</template>
<style lang="less" scoped>
.profile-bg {
    width: 750px;
    padding-top: 40px;
    padding-bottom:20px;
    background-image: url(@/assets/imgs/profile-bg-3.jpg);
    background-size: 750px auto;
    background-repeat: no-repeat;
    background-position: top center;
    border-radius: 0 0 10px 10px;
}

.user-head {
    padding: 40px 20px 0;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    position: relative;


    .info {
        flex-basis: 200px;

        .address,
        .nickname,
        .id {
            width: 500px;
            font-size: 24px;
        }
        .address-value{
            width:400px;
            display: inline-block;
            vertical-align: middle;
        }
        .right-icon{
            display: inline-block;
            vertical-align: middle;
        }

        .nickname {
            font-size: 34px;
        }
    }
}

.description {
    padding: 5px 25px;
    position: relative;

    .text {
        text-align: justify;
        line-height: 1.5;
        display: -webkit-box;
        word-break: break-all;
        font-size: 20px;
        --van-text-ellipsis-action-color	: #ffffff;

        .expand {
            color: #ffffff;
        }
    }
}</style>
