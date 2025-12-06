import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';


export const usePurchaser = defineStore('purchaser', () => {

  const checkedIds = ref([]);
  const list = ref([]);
  const setData = (data: any) => {
    list.value = data;
  };
  const setCheckedById = (data: any) => {
    //   设置选中的id 如果ID不存在则添加
    if (checkedIds.value.includes(data)) {
      checkedIds.value = checkedIds.value.filter((item: any) => item !== data);
    } else {
      checkedIds.value.push(data);
    }
  };

  // 返回选中的数据

  const getCheckedData = computed(() => {
    if (checkedIds.value.length === 0) {
      return [];
    }
    return list.value.filter((item: any) => checkedIds.value.includes(item.id));
  });
  // 设置默认
  const defaultPurchaser = computed(() => {
    return list.value.find((item: any) => item.is_default == 1);
  });

  // 如果没有选中的数据则设置默认选中的数据
  watch(defaultPurchaser, (val) => {
    if (val && checkedIds.value.length === 0) {
      checkedIds.value.push(val.id);
    }
  },{
    immediate: true,
  });

  return {
    defaultPurchaser,
    setCheckedById,
    checkedIds,
    getCheckedData,
    setData,
    list
  };

});
