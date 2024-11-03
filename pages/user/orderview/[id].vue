<script setup lang="ts">
import PC from './components/PC.vue'
import Mobile from './components/Mobile.vue'
import type { ExpressTrack, OrderDetail } from '~/types'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const payOrderId = route.query.payOrderId

useHead({
	title: `${id} ${$t('OrderView')} ${$t('appTitle')}`,
})
const { data: info, refresh } = await useAPI<OrderDetail>(
	'trade/order/get-detail?apifoxApiId=219799959',
	{ params: { id } },
)
if (payOrderId && !info.value?.payTime) {
	let timer: any
	const getPayStatus = () => {
		if (info.value?.payTime)
			return
		$api('pay/order/get?apifoxApiId=220062937', {
			params: { id: payOrderId },
		})
			.then((res) => {
				if (res.successTime) {
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
	console.log(type)
	switch (type) {
		case 'cancel':
			delMsgBox(msg1).then(() => {
				loading.value = true
				$api('trade/order/cancel?apifoxApiId=225702258', {
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
				$api('trade/order/delete?apifoxApiId=225702264', {
					method: 'delete',
					params: { id },
				})
					.then(refresh)
					.finally(() => {
						loading.value = false
					})
			})
			break
		case 'receive':
			delMsgBox(msg3).then(() => {
				loading.value = true
				$api('trade/order/receive?apifoxApiId=220053696', {
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
			router.push($path(`/user/checkout?orderId=${id}`))
			break
		case 'aftersale':
			localStorage.setItem('after-sale-apply', JSON.stringify(info.value))
			router.push($path(`/user/aftersale/apply?item=${data.id}`))
			break
	}
}

const { data: tracks } = await useAPI<ExpressTrack[]>(
	'trade/order/get-express-track-list?apifoxApiId=225701705',
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
