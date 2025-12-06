<template>
    <div v-show="step == 0">
        <LoginInput :logo="props.logo" :defaultMobile="useDefault ? props.defaultMobile : ''" @success="onInputSuccess" />
    </div>
    <div v-show="step == 1">
        <LoginAccount :logo="props.logo" @success="onSuccess" ref="accountRef" @last="step = 0" />
    </div>
    <van-cell-group :border="false" v-if="useDefault&&props.defaultMobile">
        <van-field :border="false">
            <template #input>
                <van-button block native-type="submit" @click="useDefault = false">
                    使用其它手机号
                </van-button>
            </template>
        </van-field>
    </van-cell-group>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/User';
import { LoginType } from '@/types';
import { closeToast } from 'vant';
import { ref } from 'vue';
import LoginInput from './LoginInput.vue';
import LoginAccount from './LoginAccount.vue';

const useDefault = ref(true)
const props = defineProps({
    logo: {
        type: Boolean,
        default: true
    },
    defaultMobile: {
        type: String,
        default: ''
    }
})
const emits = defineEmits(['success'])
console.log(emits)
const userStore = useUserStore()
const step = ref(0)
const accountRef = ref<InstanceType<typeof LoginAccount>>()

const onSuccess = (mobile: string, token: string) => {
    console.log('onSuccess')
    window.localStorage.setItem('mobile', mobile)
    userStore.login(token, () => {

        emits('success')
    })

}
const onInputSuccess = ({
    mobile,
    data
}: {
    mobile: string,
    data: LoginType
}) => {
    if (data.result == 'success') {
        console.log('onInputSuccess')
        onSuccess(mobile, data.token)
    } else {
        step.value = 1
        closeToast()
        accountRef.value?.init(mobile, data)
    }


}
</script>
