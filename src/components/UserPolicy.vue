<script lang="ts" setup>
import { ref } from 'vue';

const checked = ref(false);
const activeNames = ref(['1']);
defineExpose({
  checked,
});
</script>

<template>
    <van-collapse  :border="false" v-model="activeNames">
      <van-collapse-item value-class="content"  name="1">
        <template #title>
          <van-checkbox v-model="checked" shape="square">
            我已阅读并同意以下内容
          </van-checkbox>
        </template>
        <div class=" text-25px bg-transparent ">
          请您理解并同意，根据相关法律法规以及国内公安部门对大型活动中购票用户或观演用户实名制的要求，实名制的项目在购票时需要您提供您的实名信息，包括但不限于姓名、身份证、护照、港澳居民往来内地通行证、台湾居民往来大陆通行证。为保证信息的真实性和唯一性，会员购有权基于您所提供的信息通过第三方机构(包含信用服务机构和数据服务机构等)进行验证等相关处理(包括但不限于收集、整理、保存、提供)。您所提供的身份信息仅用于实名验证，未经本人许可不做任何他用。
        </div>
      </van-collapse-item>
    </van-collapse>
</template>

<style lang="less" scoped>
:deep(.van-collapse-item__content){
  @apply bg-transparent;
}
</style>
