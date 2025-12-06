<template>
  <div class="item" @click="onClick">
    <div class="cover" :style="{
            backgroundImage: `url(${item?.cover_url})`,
        }">
        <div :class="{'conflux':item.isConflux}"></div>
      <div class="tags">
        <div class="appoint" v-if="item?.begin_at > 0 && item.begin_at * 1000 > Date.now()" />
        <div class="hot" v-else-if="item?.hot_flag == 'Y'&&item.status!=='out'" />
        <div class="out" v-else-if="item.status==='out'" />
      </div>

    </div>
    <div class="info">
      <div class="van-ellipsis subject">{{ item?.subject }}</div>
      <div class="flex justify-between align-center ">
        <Tag title="限量" :value="`${item?.total_supply}份`" />
        <div class="price">
          <Price :value="item?.price / 100" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PlanDisplayType } from '@/types';
import { PropType, ref, watch } from 'vue';
import Price from './Price.vue';
import Tag from './Tag.vue';
import router from '@/router';

const onClick = () => {
  router.push({
    name: 'PlanDetail',
    params: {
      plan_no: props.item.plan_no,
    },
  });
};

const props = defineProps({
  item: {
    type: Object as PropType<PlanDisplayType>,
    default: () => [],
  },
});
// 将props转换为响应式变量
const item = ref<PlanDisplayType>();
watch(
  () => props.item,
  (newData) => {
    item.value = newData;
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>
<style lang="less" scoped>
.item {
  cursor: pointer;
  display: block;
  margin: var(--margin-outer) auto 0;
  --width: 341px;
  --height: 438px;
  height: var(--height);
  width: var(--width);
  box-sizing: border-box;
  border-radius: 10px;
  color: #fff;
  position: relative;
  background-image: url(../assets/imgs/bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .cover {
    border-radius: 10px 10px 0 0;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    width: var(--width);
    height: var(--width);

    .tags {
      position: absolute;
      right: 10px;
      top: 10px;

      .hot {
        width: 102px;
        height: 37px;
        background-image: url(../assets/imgs/hot.png);
        background-size: contain;
        background-repeat: no-repeat;
      }

      .appoint {
        width: 102px;
        height: 37px;
        background-image: url(../assets/imgs/appoint.png);
        background-size: contain;
        background-repeat: no-repeat;
      }

      .out {
        width: 102px;
        height: 37px;
        background-image: url(../assets/imgs/out.png);
        background-size: contain;
        background-repeat: no-repeat;
      }

      :deep(.van-tag) {
        margin-left: 10px;
      }
    }
    .conflux {
      position: absolute;
      left: 10px;
      padding: 5px;
      top: 10px;
      width: 100px;
      height: 20px;
      background-image: url(../assets/pc/conflux.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position:center  ;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 6px;
    }
  }

  .info {
    box-sizing: border-box;
    width: var(--base-size);
    padding: 0 20px 10px;
    border-radius: 0 0 10px 10px;

    .subject {
      font-size: var(--size-subject);
    }

  }
}

.item:hover,
.item:focus {
  box-shadow: 0 0 10px 0 var(--theme-gold);
}</style>
