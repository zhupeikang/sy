<script lang="ts" setup>

defineProps(['order']);
import { OrderStatusText } from '@/types';
</script>

<template>
  <div>
    <van-icon name="info">
      {{ OrderStatusText[order?.status] }}
    </van-icon>
  </div>
</template>

<style lang="less" scoped>

</style>
