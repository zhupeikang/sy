<script setup lang="ts">
import { checkExploreApi } from '@/api/explore';
import NavBar from '@/components/NavBar.vue';
import router from '@/router';
import { showLoading } from '@/utils';
import { ref } from 'vue';

const value = ref('')

const onSearch = async()=>{
    const loading = showLoading('查询中')
    const res = await checkExploreApi({
        hash:value.value
    })

    if(res){
        loading.end()
        router.push({
            path:'/explore-'+res.data.type,
            query:{
                hash:value.value
            }
        })
    }

}
</script>
<template>
    <NavBar title="区块链浏览器" />
    <div class="text-center margin">支持账户哈希值、合约哈希值、资产哈希值、交易ID查询</div>
    <van-cell-group inset>
        <van-field v-model="value" placeholder="请输入哈希值" type="textarea" rows="3"  class="input" :border="false"/>
        <van-button class="ignore-theme-btn margin-top" type="primary" block :disabled="value.length==0" @click="onSearch">查询</van-button>
    </van-cell-group>
    
</template>
<style scoped lang="less">
.input{
    background-color: var(--theme-deep-gray);
    border-radius: 10px;
}
</style>