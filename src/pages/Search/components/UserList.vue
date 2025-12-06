<script setup lang="ts">
import { UserType } from '@/types';
import { PropType } from 'vue';
import User from './User.vue';

const props = defineProps({
    list: {
        type: Array as PropType<UserType[]>,
        default: []
    }
})
</script>
<template>
    <div class="list-user">
        <User :item="item" v-for="(item, index) in props.list" :key="index.toString()" />
    </div>
</template>
