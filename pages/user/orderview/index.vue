<script setup lang="ts">
import { statusText } from '../orderlist/utils'
import PC from './components/PC.vue'
import Mobile from './components/Mobile.vue'
import type { OrderDetail } from '~/types'

const route = useRoute()
const info = ref<OrderDetail>({})
if (route.query.orderId) {
	$api('trade/order/get-detail?apifoxApiId=219799959', { params: { id: route.query.orderId } }).then((res) => {
		info.value = res
	})
}
const appStore = useAppStore()
</script>

<template>
	<component
		:is="appStore.isPC ? PC : Mobile"
		v-if="info"
		:data="info"
		:status-text="(statusText[info.status] && $t(statusText[info.status])) || info.status"
	/>
</template>
