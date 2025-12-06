<script setup lang="ts" name="ManagePublish">
import { getArtworkDetailApi, publishArtworkApi } from '@/api/manage';
import NavBar from '@/components/NavBar.vue';
import { showLoading, toDatetime, toFixed, toTimestamp } from '@/utils';
import { CalendarInstance, showConfirmDialog, showToast } from 'vant';
import { ref } from 'vue';
import router from '@/router';
import { useRoute } from 'vue-router';

const item = ref<{
    [key: string]: any
}>({
    cover_url: [],
    main_url: [],
    desc_type: 'img',
    desc_img: [],
    status: 'pending',
    total_supply: 100,
    amount: 10,
    name: '',
    author: '',
    artwork_id: 0,
    plan: {
        begin_at: 0,
        end_at: 0
    }
})


const onSubmit = async (values: any) => {
    showConfirmDialog({
        title: '您确定要发布吗？',
        message: '发布后无法修改',
    })
        .then(async () => {
            showLoading('发布中')
            const res = await publishArtworkApi({
                ...values,
                artwork_id: route.query.artwork_id
            })
            if (res) {
                showToast(res.msg)
                router.back()
            }
        })
};
const route = useRoute()
const onInit = async () => {
    const loading = showLoading()
    const res = await getArtworkDetailApi({
        artwork_id: route.query.artwork_id
    })
    if (res) {
        if (res.data.status != 'success') {
            return showToast('您的艺术品未审核通过，无法发布')
        }
        loading.end()
        item.value = {
            ...res.data,
            plan: res.data.plan ? res.data.plan : {
                begin_at: '',
                end_at: ''
            }
        }
    } else {
        router.back()
    }
}
onInit()

const datetimeField = ref<{
    field: string
    date: string
    time: string[]
}>({
    field: '',
    date: '',
    time: []
})
const pickerVisible = ref(false)
const calendarVisible = ref(false)
const calendarRef = ref<CalendarInstance>();

const showCalender = (field: string) => {
    const timestamp = item.value.plan[field] || (field == 'begin_at' ? Date.now() : Date.now() + 86400000 * 90)
    calendarVisible.value = true
    datetimeField.value = {
        field,
        date: toDatetime(timestamp, 'YYYY-MM-DD'),
        time: toDatetime(timestamp, 'HH:mm').split(':'),
    }
    calendarRef.value?.reset(new Date(timestamp))
}
const onCalenderConfirm = (value: any) => {
    datetimeField.value!.date = toDatetime(value, 'YYYY-MM-DD')
    calendarVisible.value = false
    pickerVisible.value = true
}

const onPickerConfirm = ({
    selectedValues
}: {
    selectedValues: string[]
}) => {
    datetimeField.value.time = selectedValues
    pickerVisible.value = false
    //拼接时间
    const date = datetimeField.value.date + ' ' + datetimeField.value.time.join(':')+(datetimeField.value.field=='begin_at' ? '' : ':59')
    item.value.plan[datetimeField.value.field] = toTimestamp(date)
}
</script>
<template>
    <van-form @submit="onSubmit">
        <NavBar title="发布艺术品">
            <template #right>
                <van-button type="primary" size="small" class="ignore-theme-btn" native-type="submit">发布</van-button>
            </template>
        </NavBar>
        <van-notice-bar text="发布后将不可修改，请仔细核对内容。" />
        <van-cell-group class="margin-bottom" :border="false">
            <van-field v-model="item.name" label="艺术品名称" disabled />
            <van-field v-model="item.author" label="作者" disabled />
            <van-field v-model="item.total_supply" label="发行总数" disabled />
            <van-field label="价格" disabled>
                <template #input>
                    ￥{{ toFixed(item.amount / 100) }}
                </template>
            </van-field>

            <van-field v-model="item.plan.begin_at" is-link readonly name="begin_at" label="开售时间" placeholder="点击选择时间"
                @click="showCalender('begin_at')" :rules="[{ required: true, message: '请选择开售时间' }]">
                <template #input>
                    {{ item.plan.begin_at ? toDatetime(item.plan.begin_at) : '请选择' }}
                </template>
            </van-field>
            <van-field v-model="item.plan.end_at" is-link readonly name="end_at" label="下架时间" placeholder="点击选择时间"
                @click="showCalender('end_at')" :rules="[{ required: true, message: '请选择下架时间' }]">
                <template #input>
                    {{ item.plan.end_at ? toDatetime(item.plan.end_at) : '请选择' }}
                </template>
            </van-field>
            <van-calendar v-model:show="calendarVisible" @confirm="onCalenderConfirm" ref="calendarRef" title="请选择日期" />

            <van-popup v-model:show="pickerVisible" position="bottom">
                <van-time-picker @confirm="onPickerConfirm" @cancel="pickerVisible = false" v-model="datetimeField.time" />
            </van-popup>
        </van-cell-group>

    </van-form>
</template>
