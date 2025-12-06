<script setup lang="ts" name="UserCode">
import { ref, watch } from 'vue';
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/store/User';
import { FormInstance, showToast } from 'vant';
import { saveUserCodeApi } from '@/api/user';
import { useRouter } from 'vue-router';
import { checkIdStr } from '@/utils';

const router = useRouter()
const formRef = ref<FormInstance>();
const onSubmit = async () => {
    const validate = await formRef.value?.validate()
    console.log(validate, formRef.value?.getValues())
    if (val.value.length < 6) {
        showToast('ID不能少于6个字符')
        return
    }

    if (val.value.length > 20) {
        showToast('ID不能超过20个字符')
        return
    }

    if(!checkIdStr(val.value)){
        showToast('ID不能包含特殊字符，并且不得以数字开头')
        return
    }



    const res = await saveUserCodeApi({
        value: val.value
    })
    if (res) {
        showToast(res.msg)
        userStore.updateUserInfo()
        router.back()

    }
}
const userStore = useUserStore()

const val = ref('')
watch(() => userStore.userInfo?.user_code, newValue => {
    val.value = newValue || ''
}, {
    immediate: true,
    deep: true
})

const onSave = async () => {
    onSubmit()

}

</script>
<template>
    <NavBar title="帐号ID">
        <template #right>
            <van-button size="small" type="primary" @click="onSave" class="ignore-theme-btn action">保存</van-button>
        </template>
    </NavBar>
    <van-form @submit="onSubmit" ref="formRef">
        <van-cell-group class="cell margin" :border="false" inset>
            <van-field v-model="val" label="ID" placeholder="请输入ID" maxlength="20" clearable :border="false"/>
        </van-cell-group>
        <div class="text-default margin">ID规则</div>
        <div class="text-sm margin-lr text-white">
            <div>1.ID长度为6-20个字符</div>
            <div>2.ID仅能包含英文、数字、-、_</div>
            <div>3.ID不得以数字开头</div>
        </div>
    </van-form>
</template>
<style scoped lang="less">
.cell {
    --van-cell-group-background: #333333;
    --van-cell-background: #333333;
    --van-cell-text-color:#ffffff;
}
</style>