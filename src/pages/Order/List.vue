<template>
    <NavBar title="我的订单"  />
    <van-tabs v-model:active="active" sticky offset-top="46" class="ignore-tabs">
        <van-tab title="全部">
            <List/>
        </van-tab>
        <van-tab :title="dictStore.getDictLabel('order_status','pending')">
            <List status="pending" v-if="list_available.pending"/>
        </van-tab>
        <van-tab :title="dictStore.getDictLabel('order_status','success')">
            <List status="success" v-if="list_available.success"/>
        </van-tab>
    </van-tabs>
</template>
<script setup lang="ts" name="OrderList">
import NavBar from '@/components/NavBar.vue';
import { useDictStore } from '@/store/Dict';
import { reactive, ref, watch } from 'vue';
import List from './components/List.vue';

const dictStore = useDictStore()
const active = ref(0)
const list_available = reactive({
    pending: false,
    success: false
})
watch(()=>active.value, (val) => {
    if (val == 1) {
        list_available.pending = true
    } else if (val == 2) {
        list_available.success = true
    }
})

</script>
