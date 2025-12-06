<script setup lang="ts">

</script>

<template>
  <div class="bottom-placeholder van-safe-area-bottom">
    <div class="fixed-bottom ">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.bottom-placeholder {
  height: 100px; /* 占位元素的高度与固定元素相同 */
  padding: 20px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 20px;
  box-sizing: border-box;
  font-size: 26px;
  width: 100%;
  right: 0;
  z-index: 100;
  text-align: center;
  color: #000000;
}
</style>
