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
let timer: any
if (payOrderId && !info.value?.payTime) {
	const getPayStatus = () => {
		if (info.value?.payTime)
			return
		$api('pay/order/get', {
			params: { id: payOrderId },
		})
			.then((res) => {
				if (res.no) {
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
	getPayStatus()
}
onBeforeUnmount(() => {
	clearTimeout(timer)
})

const appStore = useAppStore()
const loading = ref(false)
const { t } = useI18n()
const msg1 = 'Are you confirm to cancel?'
const msg2 = 'Are you confirm to delete?'
const msg3 = 'Are you confirm to receive?'
function delMsgBox(delMsg: string) {
	return ElMessageBox.confirm(t(delMsg), {
		center: true,
		confirmButtonClass: 'mi-button--info',
	})
}

const trackVisible = ref(false)
const tracks = ref<ExpressTrack[]>([])
let track_get = false
function handleCommand(type: string, data: any) {
	switch (type) {
		case 'cancel':
			delMsgBox(msg1).then(() => {
				loading.value = true
				$api('trade/order/cancel', {
					method: 'delete',
					params: { id },
				})
					.then(() => clearTimeout(timer))
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
			router.push($path(`/user/checkout?orderId=${id}`))
			break
		case 'aftersale':
			localStorage.setItem('after-sale-apply', JSON.stringify(info.value))
			router.push($path(`/user/aftersale/apply?item=${data.id}`))
			break
		case 'aftersale-view':
			router.push($path(`/user/aftersaleview/${data.afterSaleId}`))
			break
		case 'track':
			if (track_get) {
				trackVisible.value = true
			}
			else {
				$api<ExpressTrack[]>(
					'trade/order/get-express-track-list',
					{ params: { id } },
				).then((res) => {
					tracks.value = (res || []).reverse()
					trackVisible.value = true
					track_get = true
				})
			}
			break
		case 'review':
			localStorage.setItem(`orderItem-${data.id}`, JSON.stringify(data))
			router.push($path(`/user/orderview/review/${data.id}`))
			break
	}
}
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
		v-if="info"
		:data="info"
		:loading="loading"
		@command="handleCommand"
	/>
	<app-modal v-model="trackVisible">
		<el-timeline>
			<el-timeline-item
				v-for="(track, i) in tracks"
				:key="i"
				:timestamp="track.time"
			>
				{{ track.content }}
			</el-timeline-item>
		</el-timeline>
	</app-modal>
</template>
