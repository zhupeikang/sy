<template>
  <div v-for="(item, index) in dataList" :key="index.toString()" class="p-1 b-solid b-1px b-rd-1 mb-10px">
    <Ticket :item="item" />
  </div>
</template>
<script lang="ts" setup>
import Ticket from '@/components/Ticket.vue';

defineProps({
  dataList: {
    type: Array,
    default: () => [],
  },
});
</script>
<style lang="less" scoped>

</style>
