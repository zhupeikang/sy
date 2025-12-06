<script setup lang="ts" name="ContractDetail">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ContractType, PlanDisplayType, UserType } from '@/types';
import Error from '@/components/Error.vue';
import Share from '@/components/Share.vue';
import Loading from '@/components/Loading.vue';
import { useEventListener } from '@vant/use';
import PlanList from '@/components/PlanList.vue';
import { amountFormatter, rpxToPx } from '@/utils';
import { getAssetContractApi } from '@/api/asset';
import NavBar from '@/components/NavBar.vue';
import AssetMain from '@/components/AssetMain.vue';
import router from '@/router';
import { useConfigStore } from '@/store/Config';
import Tag from '@/components/Tag.vue';

import QrcodeVue from 'qrcode.vue';

const config = useConfigStore()
const route = useRoute()
const active = ref(0)
const plans = ref<PlanDisplayType[]>([])
const tabOpacity = ref(0)
//处理错误
const errorShow = ref(false)
const errorText = ref('')
//3D模型
const showModel = ref(false)
const shareUrl = ref(window.location.origin + route.path)
const showShare = ref(false);
const contract = ref<ContractType>()
const publisher = ref<UserType>()
const loading = ref(true)
watch(
    () => route.params.contract_no,
    (newData) => {
        if (!newData) return;
        console.log('contract_no', newData)
        loading.value = true
        errorShow.value = false
        errorText.value = ''
        showModel.value = false
        contract.value = undefined
        publisher.value = undefined
        plans.value = []

        getAssetContractApi({
            contract_no: newData,
            showError: true
        })
            .then(res => {
                loading.value = false
                if (res.code != 200) {
                    errorShow.value = true
                    errorText.value = res.msg
                    return
                }
                contract.value = res.data.contract
                plans.value = res.data.plans
                publisher.value = res.data.publisher
                shareUrl.value = window.location.origin + route.path
            })
            .catch(e => {
                loading.value = false
                console.error(e)
                errorShow.value = true
                errorText.value = '发生了错误' + e.message
            })
    },
    {
        deep: true,
        immediate: true
    }
)
useEventListener('scroll', () => {
    tabOpacity.value = window.scrollY > window.innerWidth ? 1 : window.scrollY / window.innerWidth
}, {
    capture: true
});
const planVisible = ref(false)
const showPlan = () => {
    planVisible.value = true
}

</script>
<template>
    <Error :text="errorText" :show="errorShow" />
    <Loading mask v-if="loading" />
    <!--加载后-->
    <div v-else>
        <Share v-model:show="showShare" :url="shareUrl" :name="contract?.name" :img="contract?.main_url"
            v-if="contract?.extends?.substring(0, 4) == 'xgw:'" :background="contract?.extends?.substring(4)"
            :showImg="false" :showQrcode="false" :height="rpxToPx(1171)" :width="rpxToPx(786)">
            <template #content>
                <div class="xgw-qrcode">
                    <qrcode-vue value="https://v2.jimutang.com/plan/Q3ZP2KNF" :size="rpxToPx(150)" level="H" />
                </div>
            </template>
        </Share>
        <Share v-model:show="showShare" :url="shareUrl" :name="contract?.name" :img="contract?.main_url" v-else>
            <template #content>

                <div>
                    {{ contract?.name }}
                </div>

                <div>{{ contract?.author }}</div>
                <Tag title="限量" :value="contract?.total_supply + '份'" />
            </template>
        </Share>

        <!-- <Share v-model:show="showShare" :url="shareUrl" :name="contract?.name" :img="contract?.main_url"/> -->
        <van-popup v-model:show="planVisible" position="bottom" :style="{ minHeight: '30vh', maxHeight: '60vh' }"
            class="dialog">
            <van-nav-bar title="相关套餐" :border="false" class="popup-nav-bar">
                <template #right>
                    <van-icon name="cross" @click="planVisible = false" />
                </template>
            </van-nav-bar>
            <van-empty description="暂时还没有相关套餐" v-if="plans.length == 0" />

            <PlanList :dataList="plans" />
        </van-popup>
        <NavBar :title="tabOpacity >= 1 ? contract?.name : ''">
            <template #right>
                <div class="ignore-share" @click="showShare = true"></div>
            </template>
        </NavBar>
        <van-tabs v-model:active="active" scrollspy sticky :style="{
            '--tab-opacity': tabOpacity
        }" class="top-tabs ignore-tabs" offset-top="46" v-if="contract">
            <van-tab title="合约">
                <asset-main :title="contract?.name" :img="contract?.main_url" :limit="contract?.total_supply"
                    limitText="限量" />
                <div class="params bg-gradual-cell margin padding text-default radius">
                    <div class="text-deep-gold">资产参数：</div>
                    <div>资产价值：{{ amountFormatter((contract.amount) / 100) }}</div>
                    <div @click="router.push('/u/' + publisher?.uid)">发行商：{{ publisher?.nickname }}</div>
                    <div>作者：{{ contract.author }}</div>
                    <div class="van-ellipsis">合约编号：{{ contract.contract_no }}</div>
                    <div class="van-ellipsis">合约地址：{{ contract.chain_contract_id }}</div>


                    <div class="text-center text-deep-gold" @click="showPlan">查看相关套餐 <van-icon name="arrow" /></div>
                </div>


            </van-tab>
            <van-tab title="详情">
                <div v-html="contract.desc_html" v-if="contract.desc_type == 'html'" class="html"></div>
                <img :src="contract.desc_img" v-else-if="contract.desc_img" class="desc_img" />
            </van-tab>
        </van-tabs>
    </div>
</template>
<style scoped lang="less">
@import url('./style.less');

.xgw-qrcode {
    position: absolute;
    left: 138px;
    bottom: -115px;
    box-sizing: border-box;
}
</style>
