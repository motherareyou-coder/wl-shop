<script setup lang="ts">
import PC from './components/PC.vue'
import Mobile from './components/Mobile.vue'
import type { ExpressTrack, OrderDetail } from '~/types'

const route = useRoute()
const id = route.query.orderId
const info = ref<OrderDetail>({})
if (id) {
	$api('trade/order/get-detail?apifoxApiId=219799959', {
		params: { id },
	}).then((res) => {
		res.status = [0, 10, 20, 30, 40][Math.ceil(Math.random() * 5)]
		info.value = res
	})
}
const appStore = useAppStore()
const router = useRouter()
function handleCommand(type: string) {
	switch (type) {
		case 'cancel':
			ElMessageBox.confirm($t('Are you confirm to cancel?')).then(() => {
				$api('trade/order/cancel?apifoxApiId=225702258', {
					params: { id },
				})
			})
			break
		case 'delete':
			ElMessageBox.confirm($t('Are you confirm to delete?')).then(() => {
				$api('trade/order/delete?apifoxApiId=225702258', {
					params: { id },
				})
			})
			break
		case 'pay':
			router.push($path(`/user/checkout?orderId=${id}`))
			break
	}
}

const { data: tracks } = await useAPI<ExpressTrack[]>('trade/order/get-express-track-list?apifoxApiId=225701705', {
	params: { id },
})
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
		v-if="info"
		:data="info"
		:tracks="tracks"
		@cmmand="handleCommand"
	/>
</template>
