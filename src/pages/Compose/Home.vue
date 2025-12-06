<script setup lang="ts" name="ComposeHome">
import NavBar from '@/components/NavBar.vue';
import { computed, ref } from 'vue';
import Loading from '@/components/Loading.vue';
import Error from '@/components/Error.vue';
import { getPlanComposeHomeApi, submitPlanComposeApi } from '@/api/plan';
import { PlanComposeChildType, PlanComposeType } from '@/types';
import { showLoading } from '@/utils';
import ChooseAsset from './components/ChooseAsset.vue';
import router from '@/router';
import { showToast } from 'vant';
import { checkOrderApi } from '@/api/order';
import ChooseCompose from './components/ChooseCompose.vue';
//处理错误
const errorShow = ref(false);
const errorText = ref('');
const loading = ref(true);
const recommends = ref<PlanComposeType[]>([]);
const onInit = () => {
  loading.value = true;
  errorShow.value = false;
  errorText.value = '';

  getPlanComposeHomeApi({
    showError: true,
  })
    .then(res => {
      loading.value = false;
      if (res.code != 200) {
        errorShow.value = true;
        errorText.value = res.msg;
        return;
      }
      recommends.value = res.data.recommend;
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
  compose.value = item;
};
const chooseAssetRef = ref<InstanceType<typeof ChooseAsset>>();
const childIndex = ref(-1);
const chooseAsset = async (item: PlanComposeChildType, index: number) => {
  if (compose.value) {
    childIndex.value = index;
    chooseAssetRef.value?.onInit(compose.value.compose_id, item);
  }
};

const onConfirm = (asset_no: string[]) => {
  if (compose.value) {
    const child = compose.value.children[childIndex.value];
    if (child) {
      child.selected = asset_no;
      s.value[childIndex.value] =[...asset_no]

    }
  }
};
const onCompose = async () => {

  if (hasSelected.value.num < compose.value?.rule_nums) {
    return showToast('请选择' + compose.value?.rule_nums + '个合成条件');
  }

  //查询每个套餐是否选择了充足的数量
  for (let item of compose.value!.children) {
    // if (!item.selected) {
    //     return showToast('请选择' + item.contract.name)
    // }
    if (item.selected && item.selected.length < item.nums) {
      return showToast(item.contract.name + '数量不足');
    }
  }
  const children = compose.value?.children.map(item => item.selected || []);
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
};

const s=ref({})
const canChoose=computed(()=>{
//   去除s中下标为childIndex的元素 然后合并
  let obj={...s.value}
  delete obj[childIndex.value]
  return Object.values(obj).flat()
})
const hasSelected = computed(() => {
  let obj = {
    num: 0,
    arr: {},
  };
  compose.value?.children.map(item => {
    if (item.selected?.length === item.nums) {
      obj.num++;
    //   去重
    }
  });
  return obj;
});
</script>
<template>
  <NavBar title="合成大厅" />
  <ChooseAsset ref="chooseAssetRef" :select="canChoose" @confirm="onConfirm" />
  <ChooseCompose ref="chooseComposeRef" @choose="chooseCompose" />
  <Error :text="errorText" :show="errorShow" />
  <Loading mask v-if="loading" />
  <div v-else class="text-deep-gold">

    <div v-if="recommends.length > 0">
      <div class="title">推荐合成</div>
      <div class="recommendList">
        <div class="item clickable bg" v-for="(item, index) in recommends" :key="index.toString()"
             @click="onChoose(item)">
          <div class="cover" :style="{
                            backgroundImage: `url(${item.plan.cover_url})`,
                            backgroundSize:'contain'
                        }"></div>
        </div>
      </div>
    </div>
    <div class="main">
      <div v-if="compose" class="choose"
           :style="{ backgroundImage: `url(${compose.plan.cover_url})`,   backgroundSize:'contain' }">
        <van-icon name="cross" class="close" @click.stop="compose = undefined" />
      </div>
      <div v-else class="add clickable">
        <div class="addicon" @click="onChooseCompose" />
        <div>请选择合成</div>
      </div>
      <div v-if="compose">{{ compose.plan.subject }}</div>
      <div class="view" @click="router.push('/plan/' + compose?.plan.plan_no)" v-if="compose">
        查看详情
        <van-icon name="arrow" />
      </div>
    </div>
    <div v-if="compose">
      <div class="title">合成条件 {{ hasSelected.num }}/{{ compose.rule_nums }}</div>
      <div class="composeList">
        <div class="item" v-for="(item, index) in compose.children" :key="index.toString()"
             @click="chooseAsset(item, index)">
          <div class="cover" :style="{
                            backgroundImage: `url(${item.contract.cover_url})`
                        }"></div>
          <div class="info">
            <div>{{ item.contract.name }}</div>
            <div>已选择 {{ item.selected?.length || 0 }}/{{ item.nums }}</div>
          </div>
        </div>

      </div>
      <div class="bar-btn-box"></div>
      <van-button type="primary" @click="onCompose" block class="bar-btn">合成</van-button>

    </div>
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
