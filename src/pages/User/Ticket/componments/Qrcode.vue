<script lang="ts" setup>
import { useAttrs } from 'vue';
import { getCityByCode, rpxToPx } from '@/utils';
import QrcodeVue from 'qrcode.vue';

const attrs=useAttrs()
const {item,event,sku}=attrs
const emits=defineEmits(['prev','next'])
</script>

<template>
  <div class="p-y-100px   van-safe-area-bottom">
    <div class="flex flex-col justify-center items-center ">
      <div>使用时间：{{sku.use_date}}</div>
      <div class="mt-10px" >
        <div class="flex items-center justify-center gap-30px">
          <div>
            <van-icon @click="emits('prev')" size="40" name="arrow-left" />
          </div>
          <qrcode-vue :value="item.ticket.no" :size="rpxToPx(440)" level="H" class="b-rd-20px" />
          <div>
            <van-icon  size="40" @click="emits('next')" name="arrow" />
          </div>
        </div>
      </div>
      <div class="text-#666 text-34px">
        <div>姓名:{{item.ticket.real_bind.card_name}}</div>
        <div>票种:{{ sku.ticket_cate }}</div>
        <div>票号:{{item.ticket.no}}</div>
      </div>
      <van-divider hairline class="w-80% p-x-10px"></van-divider>
      <div class="flex text-white justify-between items-center w-80%">
        <div class="text-26px">
          <div>
            {{getCityByCode(event.city)}} | {{event.address}}
          </div>
          <div>
            {{event.address_detail}}
          </div>
        </div>
        <div>
          <van-icon size="28" color="#DBB985" name="location-o" />
        </div>
      </div>
    </div>

  </div>

</template>

<style lang="less" scoped>
.qrcode{
  border-radius: 10px;
}
</style>
