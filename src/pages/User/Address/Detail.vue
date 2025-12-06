<script setup lang="ts" name="UserAddressDetail">
import { ref, watch } from 'vue';
import { areaList } from '@vant/area-data';
import { showLoading } from '@/utils';
import { getUserAddressApi, saveUserAddressApi } from '@/api/user';
import { showSuccessToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { useRoute, useRouter } from 'vue-router';
import { useRefreshStore } from '@/store/Refresh';
import { useUserStore } from '@/store/User';

const route = useRoute()
const router = useRouter()
const refreshStore = useRefreshStore()
const userStore = useUserStore()
const onSubmit = async (values: any) => {
    console.log('submit', values);
    const loading = showLoading('保存中')
    values.default_flag = values.default_flag ? 1 : 0
    const res = await saveUserAddressApi({
        ...values,
        address_id: route.params.id && route.params.id != 'add' ? route.params.id : 0
    })

    if (res) {
        loading.end()
        showSuccessToast(res.msg)
        refreshStore.userAddress = true

        if (res.data.default) {
            userStore.updateUserInfo()
        }
        router.back()
    }

};
const name = ref('')
const mobile = ref('')
const area = ref('');
const address = ref('')
const default_flag = ref(false)
const showArea = ref(false);
const showRights = ref(false)
const onConfirm = ({ selectedOptions }: any) => {
    showArea.value = false;
    area.value = selectedOptions.map((item: any) => item.text).join('/');
};
watch(() => route.params.id, newValue => {
    console.log('加载地址详情', newValue)
    if (newValue != 'add' && newValue) {
        const loading = showLoading()
        getUserAddressApi({
            address_id: newValue
        }).then(res => {
            loading.end()
            const data = res.data
            name.value = data.name
            mobile.value = data.mobile
            area.value = data.area
            address.value = data.address
            default_flag.value = res.data.address_id == userStore.userInfo?.address_id
        })
    } else {
        name.value = ''
        mobile.value = ''
        area.value = ''
        address.value = ''
        default_flag.value = false
    }
}, {
    immediate: true,
    deep: true
})
</script>
<template>
    <NavBar title="收货地址" />
    <van-notice-bar color="var(--theme-deep-gray)" background="var(--theme-gradual-cell)" left-icon="info"
        class="margin radius">
        请填写收货地址用于权益发放
    </van-notice-bar>
    <van-form @submit="onSubmit">
        <van-cell-group class="form" :border="false">
            <van-field v-model="name" name="name" label="收货人" placeholder="请填写收货人"
                :rules="[{ required: true, message: '请填写收货人' }]" :border="false"/>
            <van-field v-model="mobile" name="mobile" label="手机号" placeholder="请填写手机号"
                :rules="[{ required: true, message: '请填写手机号' }]" type="tel" maxlength="11" :border="false"/>
            <!-- <van-field v-model="email" name="email" label="邮箱" placeholder="请填写邮箱"
                                    :rules="[{ required: true, message: '请填写邮箱' }]" /> -->
            <van-field v-model="area" is-link readonly name="area" label="所在地区" placeholder="点击选择省市区"
                @click="showArea = true" :rules="[{ required: true, message: '请选择省市区' }]" :border="false"/>
            <van-field v-model="address" name="address" rows="2" autosize label="详细地址" type="textarea" maxlength="100"
                placeholder="请输入详细地址" :rules="[{ required: true, message: '请选择省市区' }]" :border="false"/>
            <van-field name="default_flag" label="设为默认地址" :border="false">
                <template #input>
                    <van-switch v-model="default_flag" />
                </template>
            </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit" class="bar-btn">保存</van-button>
        </div>
    </van-form>
    <van-popup v-model:show="showArea" position="bottom">
        <van-area :area-list="areaList" @confirm="onConfirm" @cancel="showArea = false" />
    </van-popup>
    <van-popup v-model:show="showRights" position="bottom">
        <van-area :area-list="areaList" @confirm="onConfirm" @cancel="showArea = false" />
    </van-popup>
</template>
<style lang="less" scoped>
.form {
    margin-top: var(--margin-outer);

    :deep(.van-field__control--custom) {
        justify-content: end;
    }
}
</style>
