<script setup lang="ts">
import { TopicDisplayType } from '@/types';
import { PropType } from 'vue';
import router from '@/router';
import Tag from '@/components/Tag.vue';

const props = defineProps({
  item: {
    type: Object as PropType<TopicDisplayType>,
    required: true,
  },
  favor: {
    type: Boolean,
    default: false,
  },
});

const onClick = () => {
  router.push(`/topic/` + props.item.topic_no);
};
</script>
<template>
  <div @click="onClick" class="item clickable">
    <div class="cover" :style="{backgroundImage: `url(${item.logo})`,}">
      <div class="likes" v-if="props.favor">
        {{ item.favors }}
      </div>
      <div style="margin-left: 4px">
        <Tag :title="item.tag_text"  />
      </div>
    </div>
    <div class="van-ellipsis subject">{{ item.name }}</div>
    <slot name="extend" />
  </div>
</template>
<style scoped lang="less">
.item {
  position: relative;
  --width: 345px;
  --height: 403px;
  background-image: url(@/assets/imgs/bg-topic.png);
  background-size: var(--width) var(--height);
  background-repeat: no-repeat;
  border-radius: 10px;
  box-sizing: border-box;
  flex-basis: var(--width);
  width: var(--width);
  height: var(--height);

  .cover {
    --cover-width: calc(var(--width) - 6px);
    margin: 0 auto;
    border-radius: 10px;
    width: var(--cover-width);
    height: var(--cover-width);
    background-position: center;
    background-size: var(--cover-width) var(--cover-width);
    background-repeat: no-repeat;
    position: relative;

    .likes {
      font-size: var(--size-info);
      position: absolute;
      left: 20px;
      bottom: 0px;
      padding-left: calc(50px * 0.75);
      background-image: url(@/assets/imgs/liked.png);
      background-size: calc(41px * 0.75) calc(39px * 0.75);
      background-repeat: no-repeat;
      background-position: left center;
    }
  }


  .subject {
    color: #fff;
    padding: 5px 20px;
    font-size: var(--size-info);
    color: var(--theme-gold);
  }
}
</style>
