<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { addBuyer, deleteBuyer, editBuyer, getBuyerDetail } from '@/api/ticket';
import { PickerConfirmEventParams, showConfirmDialog, showToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import UserPolicy from '@/components/UserPolicy.vue';
import router from '@/router';

const showPicker = ref(false);
const columns = ref([
  {
    text: '身份证号码',
    value: 0,
  },
]);
const pickerShow = (value: any) => {
  return columns.value.find(item => item.value === value)?.text;
};

const formData = ref({
  card_name: '',
  mobile: '',
  card_type: [0],
  card_type_name: '',
  card_code: '',
  is_default: 0,
});

watch(() => formData.value.card_type, (value) => {
  const val = value[0];
  formData.value.card_type_name = pickerShow(val);
}, {
  immediate: true,
});
const onConfirm = (value:PickerConfirmEventParams) => {
  formData.value.card_type = value.selectedValues;
  showPicker.value = false;
};
const isEdit = computed(() => {
  return !!router.currentRoute.value.query.id;
});
const policyRef = ref<any>(null);

const back = () => {
  setTimeout(() => {
    router.back()
  }, 1000);
};

const onSubmit = () => {
  if (isLoading.value) return;
  if (!policyRef.value?.checked) {
    showToast('请先阅读并同意用户协议');
    return false;
  }
  const data=Object.assign({},formData.value)
  delete data.card_type_name
  data.card_type=data.card_type[0]
  isLoading.value = true;
  if (isEdit.value) {
    editBuyer(data).then(res => {
      if (res.code === 200) {
        showToast('修改成功')
        back()
      }
    }).finally(() => {
      isLoading.value = false;
    });
    return false
  }
  addBuyer(data).then(res=>{
    if(res.code===200){
      showToast('添加成功')
      back()
    }
  }).finally(() => {
    isLoading.value = false;
  });
};

const getDetail = () => {
  if (!isEdit.value) return;
  getBuyerDetail({
    id: router.currentRoute.value.query.id,
  }).then(res => {
    if (res.code === 200) {
      const {card_type,...obj} = res.data;
      const card_type_name = pickerShow(card_type);
      formData.value = {
        ...obj,
        card_type: [card_type],
        card_type_name,
      };
    }
  });
};
onMounted(() => {
  getDetail();
});
const isLoading = ref(false);

const deletePurchaser = () => {
  showConfirmDialog({
    title: '删除购票人',
    message: '确定删除该购票人吗？',
  }).then(() => {
    deleteBuyer({
      id: router.currentRoute.value.query.id,
    }).then(res => {
      if (res.code === 200) {
        showToast('删除成功');
        back()
      }
    });
  });
};
const confirmBack = () => {
  return new Promise<void>((resolve, reject) => {
    showConfirmDialog({
      title: '提示',
      message: '当前实名认证信息尚未保存，\n' +
        '是否继续进行完善\n' +
        '退出后信息将不会保存？',
    }).then(() => {
      resolve();  // 用户确认，继续操作
    }).catch((error) => {
      reject(error);  // 用户取消或者发生错误
    });
  });
};

</script>

<template>
  <NavBar :async-action="confirmBack" :title="isEdit?'编辑购票人':'新增购票人'">
    <template #right v-if="isEdit">
      <van-button type="danger" @click="deletePurchaser"  icon="delete" size="mini">删除</van-button>
    </template>
  </NavBar>
  <van-form error-message-align="right" input-align="right" validate-first @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="formData.card_name"
        :rules="[{ required: true, message: '请输入姓名' }]"
        label="姓名"
        name="姓名"
        placeholder="请输入您的真实姓名"
      />
      <van-field
        v-model="formData.mobile"
        :rules="[{ required: true, message: '请输入手机号' }]"
        label="手机号"
        name="手机号"
        placeholder="请输入手机号"
        type="tel"
      />
      <van-field
        v-model="formData.card_type_name"
        :rules="[{ required: true, message: '请选择证件类型' }]"
        is-link
        label="证件类型"
        name="picker"
        placeholder="选择证件类型"
        readonly
        @click="showPicker = true"

      />
      <van-field
        v-model="formData.card_code"
        :rules="[{ required: true, message: '请输入证件号码' }]"
        label="证件号码"
        name="证件号码"
        placeholder="请输入真实证件号码"
      />
      <van-field label="设为默认购买人" name="switch">
        <template #input>
          <van-switch :active-value="1" :inactive-value="0" v-model="formData.is_default" size="medium" />
        </template>
      </van-field>

    </van-cell-group>
    <van-divider />
    <div class="p-30px">
      <UserPolicy  ref="policyRef" ></UserPolicy>
    </div>
    <div style="margin: 16px;">
      <van-button :loading="isLoading"  block native-type="submit" round type="primary">
        提交
      </van-button>
    </div>
  </van-form>
  <div class="p-30px">
    <h2>温馨提示</h2>
    <ul>
      <li>1.请提购票人供真实有效的联系方式</li>
      <li>2.互联网售票为实名制，请准确填写购票人的基本信息</li>
      <li>3.为不影响正常购买，请勿频繁添加/删除同一购票人</li>
      <li>4.每个账号最多允许添加9名购票人</li>
    </ul>
  </div>
  <van-popup v-model:show="showPicker" destroy-on-close position="bottom" round>
    <van-picker
      :columns="columns"
      :model-value="formData.card_type"
      @cancel="showPicker = false"
      @confirm="onConfirm"
    />
  </van-popup>
</template>

<style lang="less" scoped>


</style>
