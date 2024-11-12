<script setup lang="ts">
import type { ExpressTrack, OrderDetail } from '~/types'
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const payOrderId = route.query.payOrderId

definePageMeta({
	title: 'ORDER DETAILS',
	showBread: true,
})
useHead({
	title: `${id} ${$t('OrderView')} ${$t('appTitle')}`,
})
const { data: info, refresh } = await useAPI<OrderDetail>(
	'trade/order/get-detail',
	{ params: { id } },
)
if (payOrderId && !info.value?.payTime) {
	let timer: any
	const getPayStatus = () => {
		if (info.value?.payTime)
			return
		$api('pay/order/get', {
			params: { id: payOrderId },
		})
			.then((res) => {
				if (res.payTime) {
					refresh()
					clearTimeout(timer)
					router.push(route.path)
				}
				else {
					timer = setTimeout(getPayStatus, 2000)
				}
			})
			.catch(() => {
				timer = setTimeout(getPayStatus, 2000)
			})
	}
	onBeforeUnmount(() => {
		clearTimeout(timer)
	})
	getPayStatus()
}

const appStore = useAppStore()
const loading = ref(false)
const { t } = useI18n()
const msg1 = 'Are you confirm to cancel?'
const msg2 = 'Are you confirm to delete?'
const msg3 = 'Are you confirm to receive?'
function delMsgBox(delMsg: string) {
	return ElMessageBox.confirm(t(delMsg), {
		confirmButtonClass: 'mi-button--info',
	})
}
function handleCommand(type: string, data: any) {
	switch (type) {
		case 'cancel':
			delMsgBox(msg1).then(() => {
				loading.value = true
				$api('trade/order/cancel', {
					method: 'delete',
					params: { id },
				})
					.then(refresh)
					.finally(() => {
						loading.value = false
					})
			})
			break
		case 'delete':
			delMsgBox(msg2).then(() => {
				loading.value = true
				$api('trade/order/delete', {
					method: 'delete',
					params: { id },
				})
					.then(() => router.go(-1))
					.finally(() => {
						loading.value = false
					})
			})
			break
		case 'receive':
			delMsgBox(msg3).then(() => {
				loading.value = true
				$api('trade/order/receive', {
					method: 'put',
					params: { id },
				})
					.then(refresh)
					.finally(() => {
						loading.value = false
					})
			})
			break
		case 'pay':
			if (payOrderId) {
				$api('pay/order/submit', {
					method: 'post',
					body: {
						id: payOrderId,
						channelCode: 'mock',
						channelExtras: {},
					},
				}).then(refresh)
			}
			// router.push($path(`/user/checkout?orderId=${id}`))
			break
		case 'aftersale':
			localStorage.setItem('after-sale-apply', JSON.stringify(info.value))
			router.push($path(`/user/aftersale/apply?item=${data.id}`))
			break
	}
}

const { data: tracks } = await useAPI<ExpressTrack[]>(
	'trade/order/get-express-track-list',
	{
		params: { id },
	},
)
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
		v-if="info"
		:data="info"
		:tracks="tracks"
		:loading="loading"
		@command="handleCommand"
	/>
</template>
