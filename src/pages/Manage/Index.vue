<template>
    <NavBar title="发行中心" >
        <template #right>
            <van-icon name="plus" size="18" @click="router.push('/manage/add')"/>
        </template>
    </NavBar>
    <van-tabs v-model:active="active" sticky offset-top="46" class="ignore-tabs">
        <van-tab title="全部">
            <List/>
        </van-tab>
        <!-- <van-tab title="编辑中">
            <List status="pending" v-if="list_available.pending"/>
        </van-tab> -->
        <van-tab title="审核中" name="pending">
            <List status="pending" v-if="list_available.pending"/>
        </van-tab>
        <van-tab title="审核通过" name="success">
            <List status="success" v-if="list_available.success"/>
        </van-tab>
        <van-tab title="审核失败" name="fail">
            <List status="fail" v-if="list_available.fail"/>
        </van-tab>
    </van-tabs>
</template>
<script setup lang="ts" name="ManageIndex">
import NavBar from '@/components/NavBar.vue';
import { reactive, ref, watch } from 'vue';
import router from '@/router';
import List from './components/List.vue';

const active = ref('')
const list_available = reactive({
    pending: false,
    success: false,
    fail:false
})
watch(()=>active.value as 'pending'|'success'|'fail', (val ) => {
    list_available[val] = true
})

</script>
