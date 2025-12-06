<script setup lang="ts" name="ComposeHome">
import NavBar from '@/components/NavBar.vue';
import {computed, ref} from 'vue';
import Loading from '@/components/Loading.vue';
import Error from '@/components/Error.vue';
import {getPlanComposeHomeApi, submitPlanComposeApi} from '@/api/plan';
import {PlanComposeChildType, PlanComposeType} from '@/types';
import {showLoading} from '@/utils';
import ChooseAsset from './components/ChooseAsset.vue';
import router from '@/router';
import {showToast} from 'vant';
import {checkOrderApi} from '@/api/order';
import ChooseCompose from './components/ChooseCompose.vue';
import {hasSubscribers} from "node:diagnostics_channel";
//处理错误
const errorShow = ref(false);
const errorText = ref('');
const loading = ref(true);
const recommends = ref<PlanComposeType[]>([]);
const currentComposePage = ref<number>(1);
const onInit = () => {
  loading.value = true;
  errorShow.value = false;
  errorText.value = '';

  getPlanComposeHomeApi({
    showError: true,
    recommend_flag:'Y',
    page: currentComposePage.value,
    size:20
  })
      .then(res => {
        loading.value = false;
        if (res.code != 200) {
          errorShow.value = true;
          errorText.value = res.msg;
          return;
        }
        recommends.value = res.data.data;
      })
      .catch(e => {
        loading.value = false;
        console.error(e);
        errorShow.value = true;
        errorText.value = '发生了错误' + e.message;
      });
};
onInit();
const compose = ref<PlanComposeType>();
const onChoose = async (item: PlanComposeType) => {

  // 如果已经选择了同一个 则取消选择
  if (compose.value && compose.value.compose_id === item.compose_id) {
    compose.value = undefined;
    return;
  }
  compose.value = item;
  showComposePopup.value = true;
};
const onChooseFromList = (item: PlanComposeType) => {
  compose.value = item;
  showComposePopup.value = true;
}
const chooseAssetRef = ref<InstanceType<typeof ChooseAsset>>();
const childIndex = ref(-1);
const chooseAsset = async (item: PlanComposeChildType, index: number) => {
  if (compose.value) {
    // 判断是否已经选择了足够的数量
    if (hasSelected.value.num>=compose.value.nums && (!item.selected || item.selected.length < item.nums)) {
      return showToast('已选择足够的合成条件');
    }

    childIndex.value = index;
    chooseAssetRef.value?.onInit(compose.value.compose_id, item);
  }
};

const onConfirm = (asset_no: string[]) => {
  if (compose.value) {
    const child = compose.value.config[childIndex.value];
    if (child) {
      child.selected = asset_no;
      s.value[childIndex.value] = [...asset_no]
    }
  }
};
const onCompose = async () => {
  if (hasSelected.value.num < compose.value?.nums) {
    return showToast('请选择' + compose.value?.nums + '个合成条件');
  }
  //查询每个套餐是否选择了充足的数量
  for (let item of compose.value!.config) {
    // if (!item.selected) {
    //     return showToast('请选择' + item.contract.name)
    // }
    if (item.selected && item.selected.length < item.nums) {
      return showToast(item.contract.name + '数量不足');
    }
  }
  const children = compose.value?.config.map(item => item.selected || []);
  //计算总和
  const total = children?.reduce((prev, cur) => {
    return prev + cur.length;
  }, 0) || 3;
  showLoading('合成中，预计需要' + (total * 2 + 5) + '~' + (total * 3 + 10) + '秒');
  const res = await submitPlanComposeApi({
    compose_id: compose.value!.compose_id,
    children,
  });
  if (res) {
    console.log(res.msg, res.data);
    const onCheck = () => {
      setTimeout(async () => {
        const checkRes = await checkOrderApi({
          order_no: res.data.order_no,
        });
        if (checkRes) {
          if (checkRes.data.status == 'pending') {
            onCheck();
          } else if (checkRes.data.status == 'success') {
            showToast('合成成功');
            router.push('/order/' + res.data.order_no);
          } else {
            showToast('订单已超时');
          }
        }
      }, 2000);
    };
    onCheck();
  }


};


const chooseComposeRef = ref<InstanceType<typeof ChooseCompose>>();

const onChooseCompose = () => {
  chooseComposeRef.value?.show();
};
const chooseCompose = (item: PlanComposeType) => {
  compose.value = item;
  showComposePopup.value = true;

};

const s = ref({})
const canChoose = computed(() => {
//   去除s中下标为childIndex的元素 然后合并
  let obj = {...s.value}
  delete obj[childIndex.value]
  return Object.values(obj).flat()
})
const hasSelected = computed(() => {
  let obj = {
    num: 0,
    arr: {},
  };
  compose.value?.config.map(item => {
    if (item.selected?.length === item.nums) {
      obj.num++;
      //   去重
    }
  });
  return obj;
});
const showComposePopup = ref(false);
const closeShowComposePopup=()=>{
  compose.value=null
}
</script>
<template>
  <NavBar title="合成大厅"/>
  <ChooseAsset ref="chooseAssetRef" :select="canChoose" @confirm="onConfirm"/>
  <ChooseCompose ref="chooseComposeRef" @choose="chooseCompose"/>
  <Error :text="errorText" :show="errorShow"/>
  <Loading mask v-if="loading"/>
  <div v-else class="text-deep-gold">

    <div v-if="recommends.length > 0">
      <div class="title">推荐合成</div>
      <!--      <div class="recommendList">-->
      <van-cell-group>
        <van-cell v-for="(item, index) in recommends" :key="index.toString()">
          <template #title>
            <div class="ml-2 ">
             {{ item.plan.subject }}
            </div>
          </template>
          <template #label>
            <div class="ml-2">
              剩余：{{item.total_supply===0?'无限制': `${item.supply}/${item.total_supply}` }}
            </div>
          </template>
          <template #icon>
            <div class="w-100px  flex items-center justify-center ">
              <img class="w-full  rounded-md" :src="item.plan.cover_url" alt="">
            </div>

          </template>
          <template #value>
            <div class="flex gap-20px justify-end items-center">
              <van-button @click="onChoose(item)" type="primary w-150px text-black! h-60px!">
                {{item.compose_id===compose?.compose_id?'取消':'合成'}}
              </van-button>
              <van-icon  @click="router.push('/plan/' + item?.plan.plan_no)" name="arrow" class="mr-10px"></van-icon>
            </div>
          </template>
        </van-cell>

      </van-cell-group>
      <!--        <div class="item clickable bg" v-for="(item, index) in recommends" :key="index.toString()"-->
      <!--             @click="onChoose(item)">-->
      <!--          <div class="cover" :style="{backgroundImage: `url(${item.plan.cover_url})`,backgroundSize:'contain'}"></div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div class="main">
<!--      <div v-if="compose" class="choose" :style="{ backgroundImage: `url(${compose.plan?.cover_url})`,   backgroundSize:'contain' }">-->
<!--        <van-icon name="cross" class="close" @click.stop="compose = undefined"/>-->
<!--      </div>-->
      <div  class="add clickable">
        <div class="addicon" @click="onChooseCompose"/>
        <div>请选择合成</div>
      </div>
<!--      <div v-if="compose">{{ compose.plan.subject }}</div>-->
<!--      <div class="view" @click="router.push('/plan/' + compose?.plan.plan_no)" v-if="compose">-->
<!--        查看详情-->
<!--        <van-icon name="arrow"/>-->
<!--      </div>-->
    </div>
    <van-popup @close="closeShowComposePopup" v-model:show="showComposePopup" position="bottom" :style="{ height: '70vh' }">
      <!--    <div v-if="compose">-->

    <div v-if="compose" >
      <div class="title">合成条件 {{ hasSelected.num }}/{{ compose.nums }}</div>
      <div class="composeList">
        <div class="item" v-for="(item, index) in compose.config" :key="index.toString()"
             @click="chooseAsset(item, index)">
          <div class="cover" :style="{backgroundImage: `url(${item?.cover_url})`}"></div>
          <div class="info">
            <div>{{ item?.name }}</div>
            <div>已选择 {{ item.selected?.length || 0 }}/{{ item.nums }}</div>
          </div>
        </div>

      </div>
      <div class="bar-btn-box"></div>
      <van-button type="primary" @click="onCompose" block class="bar-btn">合成</van-button>
    </div>

  <!--  </div>-->
    </van-popup>
  </div>

</template>
<style scoped lang="less">
.main {
  text-align: center;
  margin: 50px 20px;
  position: relative;
  background-color: #2f2f2f;
  padding: 20px;
  border-radius: 20px;

  .view {
    position: absolute;
    bottom: 0px;
    right: 20px;
    font-size: var(--size-info);
  }

  .choose {
    width: 200px;
    height: 200px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin: 0 auto;
    position: relative;

    .close {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 30px;
    }
  }

  .add {
    margin: 0 auto;
  }

  .addicon {
    width: 120px;
    height: 120px;
    background-size: contain;
    background-repeat: no-repeat;
    margin: 0 auto 20px;
    background-image: url(../../assets/imgs/compose-add.png);
  }
}

.title {
  padding: var(--padding);
  color: var(--theme-deep-gold);
}

.recommendList {
  //超出后支持横向滚动，所有元素横排，每个元素宽度为150px，间隔为10px
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 var(--padding);

  .item {
    display: inline-block;
    width: 200px;
    height: 200px;
    box-sizing: border-box;
    margin-right: 10px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(../../assets/imgs/bg-grid.png);

    .cover {
      width: 200px;
      height: 200px;

      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
  }
}

.composeList {
  //每行三个 从左往右排 超出自动换行 间隔为10px
  padding: 0 var(--padding);

  .item {
    display: inline-block;
    width: 230px;
    height: 295px;
    margin-right: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    background-image: url(../../assets/imgs/bg.png);
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    //添加边框

    .cover {
      margin: 0 auto;
      width: 230px;
      height: 230px;
      background-size: cover;
      background-position: center;
    }

    .info {
      padding: 0px 10px;
      font-size: 24px;
      line-height: 28px;
    }
  }

  //每三个元素，margin-right为0
  .item:nth-child(3n) {
    margin-right: 0;
  }

}
</style>
