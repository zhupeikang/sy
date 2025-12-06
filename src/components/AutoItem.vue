<template>
    <Plan v-if="props.type=='plan'" :item="props.item" :size="props.size"/>
    <Contract v-else-if="props.type=='contract'" :item="props.item" :size="props.size"/>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import Plan from './Plan.vue';
import Contract from './Contract.vue';

const props = defineProps({
    item: {
        type: Object as PropType<any>,
        default: () => []
    },
    size: {
        type: Number,
        default: () => 330
    },
    type: {
        type: String,
        required: true
    }
})
</script>
