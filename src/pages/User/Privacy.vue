<script setup lang="ts" name="UserPrivacy">
import { saveUserApi } from '@/api/user';
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/store/User';
import { showLoading } from '@/utils';
import { ref, watch } from 'vue';

const userStore = useUserStore()
const privacy_collection_flag = ref(false)
const changeSwitch = async (value: Boolean, name: string) => {
    console.log(name, value);
    const loading = showLoading('保存中')
    const res = await saveUserApi({
        key: name,
        value: value ? 'Y' : 'N'
    })
    if (res) {
        loading.close()
        userStore.updateUserInfo()
    }

};
watch(() => userStore.userInfo?.privacy_collection_flag, newValue => {
    privacy_collection_flag.value = newValue == 'Y'
}, {
    immediate: true
})
</script>
<template>
    <NavBar title="隐私设置" />
    <van-cell-group :border="false" inset class="setting shadow-gold">
        <van-cell :border="false" class="setting-item" title="对外展示拥有资产" center label="访客是否可看到您持有的资产数量以及公开展示资产">
            <van-switch v-model="privacy_collection_flag"
                @change="value => changeSwitch(value, 'privacy_collection_flag')" />
        </van-cell>
    </van-cell-group>
</template>
<style lang="less" scoped>
.setting{
    --van-cell-group-background:var(--theme-gradual-cell);
    margin-top:20px;
}
.setting-item {
    --van-cell-text-color:#ffffff;
    --van-cell-background:var(--theme-gradual-cell);
    :deep(.van-cell__title) {
        flex: 5;
    }
}
</style>
