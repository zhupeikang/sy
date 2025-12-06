
<script setup lang="ts" name="UserFavor">
import NavBar from '@/components/NavBar.vue';
import { ref } from 'vue';
import FavorList from './components/FavorList.vue';

const active = ref(0)
</script>
<template>
    <NavBar title="我的收藏" />
    <van-tabs v-model:active="active" sticky offset-top="46" class="ignore-tabs">
        <van-tab title="预约提醒">
            <FavorList type="remind"/>
        </van-tab>
        <van-tab title="我的喜欢">
            <FavorList type="plan"/>
        </van-tab>
        <van-tab title="品牌收藏">
            <FavorList type="topic"/>
        </van-tab>
    </van-tabs>
</template>
