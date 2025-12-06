<script setup lang="ts" name="UserNickname">
import { ref } from 'vue';
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/store/User';
import { FormInstance, showToast } from 'vant';
import { saveUserNicknameApi } from '@/api/user';
import { useRouter } from 'vue-router';
import { checkStr, getStrLength } from '@/utils';

const router = useRouter()
const formRef = ref<FormInstance>();
const onSubmit = async () => {
    const validate = await formRef.value?.validate()
    console.log(validate, formRef.value?.getValues())

    const length = getStrLength(val.value)
    if(length<4){
        showToast('昵称不能少于4个字符')
        return
    }
    if(length>20){
        showToast('昵称不能超过20个字符')
        return
    }
    if(!checkStr(val.value)){
        showToast('昵称不能包含特殊字符')
        return
    }

    const res = await saveUserNicknameApi({
        value:val.value
    })
    if(res){
        showToast(res.msg)
        if(res.data.status=='success'){
            userStore.updateUserInfo()
            router.back()
        }else if(res.data.status=='examine'){
            router.back()
        }
    }
}
const userStore = useUserStore()

const val = ref(userStore.userInfo?.nickname||'')

const onSave = async()=>{
    //触发onsubmit
    onSubmit()
}

</script>
<template>
    <NavBar title="昵称">
        <template #right>
            <van-button size="small" type="primary" @click="onSave" class="ignore-theme-btn action">保存</van-button>
        </template>
    </NavBar>
    <van-form @submit="onSubmit" ref="formRef">
        <van-cell-group class="cell margin" :border="false" inset>
            <van-field v-model="val" label="昵称" placeholder="请输入昵称" maxlength="20" clearable :border="false"/>
        </van-cell-group>
    </van-form>
</template>
<style scoped lang="less">
.cell {
    --van-cell-group-background: #333333;
    --van-cell-background: #333333;
    --van-cell-text-color:#ffffff;
}
</style>
