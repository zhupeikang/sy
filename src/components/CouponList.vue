<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import { getCouponList, getCouponListByPlatform } from '@/api/ticket';
import Rmb from '@/components/Rmb.vue';
import { useCouponStore } from '@/store/UseCoupon';

const props = defineProps(['type', 'orderNo', 'order', 'sku']);
const list = ref([]);
const checked = ref('');
const getData = () => {
  checked.value = '';
  if (props.type === 1) {
    getCouponListByPlatform({
      sku_ids:[props.sku.id]
    }).then(r => {
      list.value = r.data;
    });
  } else {
    getCouponList(
      {sku_ids:[props.sku.id]}
    ).then(r => {
      list.value = r.data;
    });
  }
};


// 获取当前使用的优惠券


watch(() => props.type, (v) => {
  getData();
}, {
  immediate: true,
});
const emits = defineEmits(['setCoupon']);
watch(() => checked.value, (v) => {
  if (!v) return;
  useCouponStore().selectOption(props.orderNo, props.type, v);
  emits('setCoupon');
});
watch(() => props.type, value => {
  useCouponStore().removeOption(props.orderNo);
});
onUnmounted(() => {
  useCouponStore().removeOption(props.orderNo);
});
const disabledOptions = computed(() =>
  useCouponStore().getDisabledOptions(props.orderNo),
);
const discountInfo = computed(() => {
  let obj = {
    discount: '无折扣',
    amount: 0,
    pay: props.sku.price,
  };
  if (checked.value) {
    const coupon = list.value.find(v => v.id == checked.value);
    const { cost_type, cost_price } = coupon.type;
    if (cost_type) {
      obj.pay = (props.sku.price * cost_price).toFixed(2);
      obj.discount = cost_price * 10 + '折';
      obj.amount = (props.sku.price - obj.pay).toFixed(2);
    } else {
      obj.pay = Math.max((props.sku.price - cost_price).toFixed(2), 0);
      obj.amount = cost_price;
    }
  }

  return obj;
});

defineExpose({
  refresh: getData,
  discountInfo,
});

</script>

<template>
  <div>
    <div v-if="props.type" class="flex gap-10px overflow-x-scroll ">
      <div v-for="(item,index) in list"
           :key="index"
           class=" flex b-rd-20px flex-col  items-center justify-center  shrink-0 w-200px h-200px linear ">
        <div class="font-bold text-30px">
          {{ item.type.cost_type ? '打折券' : '立减券' }}
          <div class="text-42px">
            {{ !item.type.cost_type ? item.type.cost_price : `${item.type.cost_price * 10}折` }}
          </div>
        </div>
        <div class="text-25px  text-black " style="--van-radio-label-color:black">
          <van-radio v-model="checked" :disabled="disabledOptions.includes(item.id)" :name="item.id" icon-size="medium">
            立即使用
          </van-radio>
        </div>
      </div>

    </div>

    <van-cell-group>
      <van-cell title="优惠折扣">{{ discountInfo.discount }}</van-cell>
      <van-cell title="优惠金额">
        <Rmb></Rmb>
        {{ discountInfo.amount }}
      </van-cell>
      <van-cell title="应付总额">
               <span class="text-deep-gold">
               <Rmb></Rmb> {{ discountInfo.pay }}
             </span>
      </van-cell>
    </van-cell-group>
  </div>

</template>

<style lang="less" scoped>

</style>
