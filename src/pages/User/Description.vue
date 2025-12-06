<script setup lang="ts" name="UserDescription">
import { onUnmounted, ref, watch } from 'vue';
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/store/User';
import { FormInstance, showToast } from 'vant';
import { saveUserDescriptionApi } from '@/api/user';
import { useRouter } from 'vue-router';

const router = useRouter()
const formRef = ref<FormInstance>();
const onSubmit = async () => {
    const res = await saveUserDescriptionApi({
        value: val.value
    })
    if (res) {
        showToast(res.msg)
        if (res.data.status == 'success') {
            userStore.updateUserInfo()
            router.back()
        } else if (res.data.status == 'pending') {
            router.back()
        }


    }
}
const userStore = useUserStore()

const val = ref('')
watch(() => userStore.userInfo?.description, newValue => {
    val.value = newValue || ''
}, {
    immediate: true,
    deep: true
})
onUnmounted(() => {
    console.log(123)
})
const onSave = async () => {
    onSubmit()

}

</script>
<template>
    <NavBar title="个人简介">
        <template #right>
            <van-button size="small" type="primary" @click="onSave">保存</van-button>
        </template>
    </NavBar>
    <van-form @submit="onSubmit" ref="formRef">
        <van-cell-group>
            <van-field v-model="val" placeholder="请输入个人简介" type="textarea" rows="10" maxlength="140" clearable
                show-word-limit />
        </van-cell-group>
    </van-form>
</template>
