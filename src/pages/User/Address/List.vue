<script setup lang="ts" name="UserAddress">
import AddressList from '@/components/AddressList.vue';
import NavBar from '@/components/NavBar.vue';
import { UserAddressType } from '@/types';
import { useRouter } from 'vue-router';

const router = useRouter()

const onChoose = (item:UserAddressType)=>{
    console.log(item)
    router.push('/user/address/'+item.address_id)
}
</script>
<template>
    <div>
        <NavBar title="收货地址"/>
        <AddressList @choose="onChoose"/>
    </div>
</template>
