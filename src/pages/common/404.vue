<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
console.log(router)
</script>

<template>
  <van-empty description="当前页面走丢了" style="padding-top:20vh">
    <van-button round type="primary" class="bottom-button" @click="()=>router.back()">返回上一页</van-button>
  </van-empty>

</template>