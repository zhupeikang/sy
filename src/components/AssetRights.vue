<script setup lang="ts">
const props = defineProps({
  a: {
    type: Boolean,
    default: false,
  },
  x: {
    type: Boolean,
    default: false,
  },
  s: {
    type: Boolean,
    default: false,
  },
  u: {
    type: Boolean,
    default: false,
  },
  isConflux: {
    type: Boolean,
    default: false,
  }
});
console.log(props);
</script>
<template>
  <div class="rights">
    <div class="item rights_s" v-if="props.s">
      实物礼品
    </div>
    <div class="item rights_x" v-if="props.x">
      虚拟礼包
    </div>
    <div class="item rights_c">
      链上编码
    </div>
    <div class="item rights_n">
      数字资产
    </div>
    <div class="item rights_cn" v-if="props.isConflux">
      Conflux
    </div>
    <div class="item rights_a" v-if="props.a">
      动态头像
    </div>
    <div class="item rights_u" v-if="props.u">
      使用权
    </div>
  </div>
</template>
<style scoped lang="less">
.rights {

  margin-top: 20px;
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;
  /* Firefox */
  -ms-overflow-style: none;

  /* IE 10+, edge */

  .item {
    text-align: center;
    box-sizing: border-box;
    display: inline-block;
    width: 100px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: 87px 97.5px;
    background-position: top center;
    font-size: 20px;
    text-align: center;
    padding-top: 97.5px;
    color: var(--theme-deep-gray);
    margin-left: 10px;
  }

  .rights_c {
    background-image: url(@/assets/imgs/rights/chain.png);
  }

  .rights_a {
    background-image: url(@/assets/imgs/rights/a.png);
  }

  .rights_n {
    background-image: url(@/assets/imgs/rights/asset.png);
  }

  .rights_s {
    background-image: url(@/assets/imgs/rights/s.png);
  }

  .rights_x {
    background-image: url(@/assets/imgs/rights/x.png);
  }

  .rights_u {
    background-image: url(@/assets/imgs/rights/use.png);
  }

  .rights_cn {
    background-image: url(@/assets/imgs/rights/20240529-180041.png)
  }
}

.rights::-webkit-scrollbar {
  display: none;
}
</style>
