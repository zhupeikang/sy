<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { getTicketSkuDetail, orderTicket } from '@/api/ticket';
import { useUserStore } from '@/store/User';
import { showLoading } from '@/utils';
import router from '@/router';
import decimal from 'decimal.js';
const userStore = useUserStore();

interface SkuItem {
  key: number;
  items: string[];
  items_a: string[];
  name: string;
}

interface Sku {
  sku: string;
  inventory: number;
  price: number;
  order_limit: number;
}

interface SkuInfo {
  cate: SkuItem[];
  sku: Sku[];
}

interface Info {
  price?: number;
  inventory?: number;
  order_limit?: number;
  id: number;
}

const showBottom = ref(false);
const props = defineProps<{
  data: {
    id: number;
  };
}>();

const buy = () => {
  showBottom.value = true;
};
const isLoading = ref(false);
const buyTicket = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  const loading = showLoading()

  orderTicket({
    sku_id: info.value.id,
    num: buyNum.value,
  }).then(res => {
    if (res.code === 200) {
      setTimeout(()=>{
        router.push({
          path: '/ticket/orderConfirm/'+res.data.no,
        });
      },100)

    }
  }).finally(() => {
    isLoading.value = false;
    loading.end();
  });

//   判断用户是否登录
};

const skuInfo = ref<SkuInfo>({ cate: [], sku: [] });
const choose = ref<Record<number, string>>({});
const skus = ref<string[]>([]);
const info = ref<Info>({});

const onOpen = async () => {
  const res = await getTicketSkuDetail({ event_id: props.data.id });
  res.data.cate.forEach((item: SkuItem, index: number) => {
    item.key = index;
    item.items_a = item.items;
  });
  skuInfo.value = res.data;
};

const setChoose = (item: SkuItem, v: string) => {
  if (!skuInfo.value.cate[item.key].items_a.includes(v)) return;
  if (choose.value[item.key] === v) {
    delete choose.value[item.key];
  } else {
    choose.value[item.key] = v;
  }
};

watchEffect(() => {
  if (skuInfo.value.sku.length) {
    skus.value = skuInfo.value.sku.map(item => item.sku);
  }
});

watchEffect(() => {
  console.log(skuInfo.value);
  if (Object.keys(choose.value).length === skuInfo.value.cate.length) {
    const arr=Object.values(choose.value).reverse()
    const str = arr.join('/');
    info.value = skuInfo.value.sku.find(item => item.sku === str) || {};
  } else {
    info.value = {
      price: undefined,
      inventory: undefined,
      order_limit: undefined,
    };
  }

});

watchEffect(() => {
  const chosenKeys = Object.keys(choose.value).map(Number);
  if (chosenKeys.length) {
    skuInfo.value.cate.forEach(cate => {
      cate.items_a = [];
    });
    skus.value.forEach((sku, i) => {
      const skuParts = sku.split('/');
      skuParts.reverse()
      const matchedKeys = skuParts.reduce((acc: number[], part: string, index: number) => {
        if (chosenKeys.includes(index) && part === choose.value[index]) {
          acc.push(index);
          skuInfo.value.cate[index].items_a.push(part);
        }
        return acc;
      }, []);

      if (matchedKeys.length === chosenKeys.length) {
        skuParts.forEach((part, index) => {
          if (!chosenKeys.includes(index) && !skuInfo.value.cate[index].items_a.includes(part)) {
            skuInfo.value.cate[index].items_a.push(part);
          }
        });
      } else if (matchedKeys.length + 1 === chosenKeys.length) {
        skuParts.forEach((part, index) => {
          if (chosenKeys.includes(index) && !matchedKeys.includes(index) && !skuInfo.value.cate[index].items_a.includes(part)) {
            skuInfo.value.cate[index].items_a.push(part);
          }
        });
      }
    });
  } else {
    skuInfo.value.cate.forEach(cate => {
      cate.items_a = cate.items;
    });
  }
});

const isChoose = computed(() => {
  return Object.keys(choose.value).length === skuInfo.value.cate.length;
});

const buyNum = ref(1);
const totalPrice=computed(()=>{
  return new decimal(info.value.price).mul(buyNum.value).toNumber()
})
</script>
<template>
  <div class="bottom-placeholder" >
    <div class="  van-submit-bar van-safe-area-bottom   ">
      <div class="p-20px bg-#222222">
        <div class="linear text-#1F1F1F text-40px b-rd-60px p-10px text-center font-bold " @click="buy">立即购票</div>
      </div>
    </div>
  </div>
  <van-popup
    v-model:show="showBottom"
    :style="{ height: '60%' }"
    close-icon="close"
    closeable
    position="bottom"
    safe-area-inset-bottom
    @open="onOpen"
  >

    <div class="w-full h-full overflow-hidden ">
      <div class="overflow-y-auto w-100% h-100% p-x-30px p-y-100px box-border ">
        <div>
          <div v-for="(item,index) in skuInfo.cate" :key="index">
            {{ item.name }}
            <div class="flex gap-4 mt-20px flex-wrap">
              <div v-for="(v,k)  in item.items" :key="k"
                   :class="{'linear text-#1F1F1F':v===choose[item.key],'disabled':(!skuInfo.cate[item.key].items_a.includes(v))}"
                   class=" text-26px  bg-#000000 p-x-20px  p-y-10px b-rd-8px" @click="setChoose(item,v)">
                {{ v }}
              </div>
            </div>
            <van-divider />
          </div>
        </div>
        <div v-if="isChoose">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between ">
              <div>剩余库存</div>
              <div class="text-white font-bold">{{ info.inventory }}</div>
            </div>
            <div class="flex justify-between items-center">
              <div>
                购买数量
              </div>
              <div>
                <span class="text-white text-25px">每笔订单限购{{ info.order_limit }}张</span>&nbsp;&nbsp;&nbsp;&nbsp;<van-stepper
                v-model="buyNum" :max="info.order_limit" disable-input integer />
              </div>
            </div>
          </div>
          <van-divider />
          <div class="  van-submit-bar van-safe-area-bottom">
            <div class=" bg-#222222">
              <div class="flex    p-20px justify-between items-center">
                <div class="text-white font-bold">合计: <span class="text-#DBB985 font-bold">￥{{ totalPrice }} </span> | {{ buyNum }} 张
                </div>

                <van-button :disabled="isLoading" class="linear p-x-60px!" loading-text="正在下单" round
                            @click="buyTicket">
                  {{ info.inventory ? '立即购票' : '暂无库存' }}
                </van-button>
                <!--                <div class="linear p-x-40px p-y-20px b-rd-60px  text-#1F1F1F" @click="buyTicket">-->
                <!--                  <span v-if="isLoading"><van-loading type="spinner" /></span>-->
                <!--                  <span v-else>-->
                <!--                  {{ info.inventory ? '立即购票' : '暂无库存' }}-->
                <!--                  </span>-->
                <!--                </div>-->
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


  </van-popup>
</template>
<style lang="less" scoped>
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
.disabled {
  color: #666666;
}
</style>
