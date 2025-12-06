<script setup lang="ts">
import {rpxToPx} from '@/utils';


const props = defineProps({
  url: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 100
  },
  lock: {
    type: Boolean,
    default: true
  }
})
</script>
<template>
  <div class="avatar relative" :style="{
        backgroundImage:`url(${props.url})`,
        width:rpxToPx(props.size)+'px',
        height:rpxToPx(props.size)+'px',
    }">
    <div v-if="lock"
         class="absolute flex-col flex justify-center items-center bottom-0 w-full h-full right-0 bg-black bg-opacity-50">
      <van-icon  size="20" name="lock"></van-icon>
      <span class="text-16px">已锁定</span>
    </div>

  </div>
</template>
<style scoped lang="less">
.avatar {
  display: inline-block;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
