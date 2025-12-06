<template>
    <van-dialog :show="userStore.verifyVisible" title="实名认证" show-cancel-button @cancel="onCancel" @confirm="onConfirm"
        :show-confirm-button="verified_flag == 'N'" cancel-button-text="关闭">
        <van-form @submit="onSubmit" ref="formRef" :disabled="verified_flag == 'Y'">
            <div class="font-info text-center margin-tb">
                您需要年满18周岁才能进行实名认证
                <!-- 实名认证通过后，您可通过人脸识别找回账号 -->
            </div>
            <van-cell-group :border="false">
                <van-field v-model="real_name" name="real_name" label="姓名" placeholder="请输入姓名"
                    :rules="[{ required: true, message: '请输入姓名' }]" maxlength="18" :border="false"/>
                <van-field v-model="identity_card" name="identity_card" label="身份证号" placeholder="请输入身份证号"
                    :rules="[{ required: true, message: '请输入身份证号' }]" maxlength="18" :border="false"/>
            </van-cell-group>

        </van-form>
    </van-dialog>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/User';
import type { FormInstance } from 'vant';
import { showToast } from 'vant';
import { ref, watch } from 'vue';
import { verifyUserApi } from '@/api/user';
import { showLoading } from '@/utils';

const userStore = useUserStore()
const real_name = ref('')
const identity_card = ref('')
const verified_flag = ref('N')
const formRef = ref<FormInstance>();
watch(() => userStore.verifyVisible, newValue => {
    if (newValue) {
        real_name.value = userStore.userInfo?.real_name || ''
        identity_card.value = userStore.userInfo?.identity_card || ''
        verified_flag.value = userStore.userInfo?.verified_flag || 'N'
    }
}, {
    immediate: true
})
const onConfirm = () => {
    formRef.value?.submit();
}
const onCancel = () => {
    userStore.hideVerify()
}
const onSubmit = async () => {
    const validate = await formRef.value?.validate()
    console.log(validate, formRef.value?.getValues())
    showLoading('认证中')
    const res = await verifyUserApi(formRef.value?.getValues())
    if (res) {
        showToast(res.msg)
        userStore.updateUserInfo()
        userStore.hideVerify()
        typeof userStore.verifyCallback == 'function' && userStore.verifyCallback()
    }

}
</script>
