<script setup lang="ts">
import type { BargainActivity, BargainHelp, PayOrderSubmit, ProductDetail, SKU } from '~/types'

const router = useRouter()
const route = useRoute()

const { shortDomain } = useRuntimeConfig().public
const { gtag } = useGtag()
// 砍价详情页面埋点
gtag('event', 'screen_view', {
	app_name: shortDomain,
	screen_name: 'bargin-detail',
})

const activityId = Number(route.params.id)
const recordId = ref()
const recordInfo = ref<BargainActivity>({})
const helpList = ref<BargainHelp[]>([])
watchEffect(() => {
	recordId.value = route.query.recordId ? Number(route.query.recordId) : null
	getRecordInfo()
})

const appStore = useAppStore()
const userStore = useUserStore()

const { data } = await useAPI<BargainActivity>('promotion/bargain-activity/get-detail', { params: { id: activityId } })

function getRecordInfo() {
	if (!recordId.value)
		return
	$api<BargainActivity>('promotion/bargain-record/get-detail', { params: { activityId, id: recordId.value } }).then((res) => {
		recordInfo.value = res
	})
	$api<BargainHelp[]>('promotion/bargain-help/list', { params: { recordId: recordId.value } }).then((res) => {
		helpList.value = res
	})
}

// TODO: 需要根据activityId查询
if (!recordId.value) {
	$api('promotion/bargain-record/page', { params: { pageNo: 1, pageSize: 1000, activityId } }).then((res) => {
		const d = res?.list.filter(dd => dd.activityId == activityId)[0]
		if (d) {
			router.push($path(`/bargin/${activityId}?recordId=${d.id}`))
		}
	})
}

const hasHelp = computed(() => !!helpList.value?.find(d => d.userId === userStore.id))
const isCurrentUser = computed(() => recordInfo.value.userId == userStore.id)

const sku = ref<SKU>()
const productInfo = ref<ProductDetail>({})
watchEffect(() => {
	if (data.value?.spuId) {
		$api<ProductDetail>('product/spu/get-detail', { params: {
			id: data.value.spuId,
		} }).then((res) => {
			productInfo.value = res
			sku.value = res.skus.find(s => s.id === data.value?.skuId)
		})
	}
})

const { t } = useI18n()
function checkUser() {
	if (!userStore.id) {
		ElMessage.info(t('Please sign in first'))
		router.push(`${$path(`/login`)}?redirect=${encodeURIComponent(route.fullPath)}`)
		return false
	}
	return true
}

function handleCreate() {
	if (!checkUser())
		return
	$api('promotion/bargain-record/create', {
		method: 'post',
		body: { activityId },
	}).then((id) => {
		router.push($path(`/bargin/${activityId}?recordId=${id}`))
	})
}
const successVisible = ref(false)
function handleHelp() {
	if (!checkUser())
		return
	$api('promotion/bargain-help/create', { method: 'post', body: { recordId: recordId.value } }).then(() => {
		successVisible.value = true
		getRecordInfo()
	})
}

const { copy } = useClipboard()
function invite() {
	copy(window.location.href)
	ElMessage.info(t('链接已复制'))
}

function handleCreateOrder() {
	localStorage.setItem(`bargainRecordId-${recordId.value}`, JSON.stringify({
		...productInfo.value,
		count: 1,
		sku: sku.value,
		skuId: data.value?.skuId,
		spuId: data.value?.spuId,
	}))
	router.push($path(`/user/checkout?bargainRecordId=${recordId.value}&activityId=${activityId}`))
	return
	$api('trade/order/create', { method: 'post', body: {
		items: [{ skuId: productInfo.value.id, count: 1 }],
		deliveryType: 1,
		bargainRecordId: recordId.value,
		pointStatus: false,
	} }).then((res) => {
		handlePay(res.id, res.payOrderId)
	})
}
function handlePayOrder() {
	if (recordInfo.value.orderId && recordInfo.value.payOrderId)
		handlePay(recordInfo.value.orderId, recordInfo.value.payOrderId)
}
function handleGoOrder() {
	if (recordInfo.value.orderId)
		router.push($path(`/user/orderview/${recordInfo.value.orderId}`))
}

function handlePay(orderId: string | number, payOrderId: string | number) {
	return payOrderId && $api<PayOrderSubmit>('pay/order/submit', {
		method: 'post',
		body: {
			id: payOrderId,
			channelCode: 'mock',
			channelExtras: {},
		},
	})
		.then(payDisplay)
		.finally(() => router.push($path(`/user/review/${orderId}?payOrderId=${payOrderId}`)))
}

function payDisplay({ status, displayMode, displayContent }: PayOrderSubmit) {
	// 获取屏幕宽度和高度
	const screenWidth = window.screen.width
	const screenHeight = window.screen.height

	const width = 800
	const height = 650
	// 计算新窗口的左边距和上边距，以便居中显示
	const left = (screenWidth - width) / 2
	const top = (screenHeight - height) / 2
	let newWindow
	if (displayMode === 'iframe') {
		newWindow = window.open(displayContent, '_blank', `width=${width},height=${height},top=${top},left=${left}`)
	}
	else if (displayMode === 'url') {
		newWindow = window.open(displayContent, '_blank', `width=${width},height=${height},top=${top},left=${left}`)
	}
	// 确保新窗口获得焦点（可选）
	if (newWindow) {
		newWindow.focus()
	}
}
</script>

<template>
	<div class="site-container-1400 w-full mx-auto">
		<section class="my-5" :class="[appStore.isPC ? 'py-5' : 'px-2']">
			<div v-if="data" class="bargin-item flex bg-white rounded">
				<app-image :src="data.picUrl" :class="[appStore.isPC ? 'w-60 h-60' : 'w-28 h-28']" :alt="data.name" />
				<div class="flex flex-col justify-around flex-1 pl-0" :class="[appStore.isPC ? 'p-5' : 'p-2']">
					<div class="my-1">
						{{ data.name }}
					</div>
					<div>
						<div class="flex  my-2 text-sm " :class="appStore.isPC ? 'items-center' : 'flex-col '">
							<app-time :data="data.startTime" />
							<span v-if="appStore.isPC">-</span>
							<app-time :data="data.endTime" />
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm">
								{{ $t('最低价') }}:
								<product-price :data="data.bargainMinPrice" />
							</span>
						</div>
					</div>
				</div>
			</div>
			<div v-if="!recordId" class="text-center bg-white p-5">
				<el-button type="primary" round @click="handleCreate">
					{{ $t('立即参与砍价') }}
				</el-button>
			</div>
			<div v-else-if="recordInfo" class="text-center bg-white p-5">
				<!-- 砍价中 -->
				<div v-if="recordInfo.status === 1">
					{{ $t('已砍') }}
					<product-price :data="recordInfo.bargainPrice" />
					{{ $t('还差') }}
					<product-price :data="recordInfo.bargainFirstPrice - recordInfo.bargainPrice" />
					<div class="mt-2 px-2">
						<el-button v-if="isCurrentUser" type="primary" round @click="invite">
							{{ $t('邀请好友帮砍价') }}
						</el-button>
						<el-button v-else-if="!hasHelp" type="primary" round @click="handleHelp">
							{{ $t('帮好友砍价') }}
						</el-button>
					</div>
				</div>
				<div v-if="hasHelp" class="mt-2 px-2">
					{{ $t('已帮砍') }}
					<div class="mt-2 px-2">
						<div v-if="recordInfo.status === 2">
							{{ $t('砍价成功') }}
						</div>
						<el-button v-else type="primary" round @click="invite">
							{{ $t('邀请好友帮砍价') }}
						</el-button>
					</div>
				</div>
				<!-- 砍价成功 -->
				<div v-if="isCurrentUser && recordInfo.status === 2">
					<div v-if="recordInfo.orderId">
						{{ $t('恭喜砍价成功') }}
					</div>
					<div v-else>
						{{ $t('恭喜砍价成功，快去支付吧') }}
					</div>
					<div class="mt-2 px-2 flex justify-center">
						<el-button round @click="router.push($path('/'))">
							{{ $t('继续选购') }}
						</el-button>
						<el-button v-if="!recordInfo.orderId " type="primary" round @click="handleCreateOrder">
							{{ $t('立即下单') }}
						</el-button>
						<el-button v-else-if="recordInfo.payStatus === 10" type="primary" round @click="handlePayOrder">
							{{ $t('立即支付') }}
						</el-button>
						<el-button v-else type="primary" round @click="handleGoOrder">
							{{ $t('查看订单') }}
						</el-button>
					</div>
				</div>
				<!-- 砍价失败 -->
				<div v-if="recordInfo.status === 3">
					<div>{{ $t('砍价失败') }}</div>
					<div v-if="isCurrentUser" class="mt-2 px-2">
						<el-button type="primary" round @click="handleCreate">
							{{ $t('重新砍价') }}
						</el-button>
					</div>
				</div>
			</div>
		</section>
		<section class="my-5">
			<h2 class="text-center mb-2 text-lg">
				{{ $t('砍价记录') }}
			</h2>
			<div class="bg-white" :class="[appStore.isPC ? '' : 'mx-2']">
				<ul
					v-if="helpList.length"
					class="p-2"
				>
					<li v-for="item in helpList" :key="item.id" class="my-2">
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<app-image :src="item.avatar" class="'w-12 h-12 rounded-full" :alt="item.nickname" />
								<div class="flex flex-col justify-between m-2">
									<div class="text-sm">
										{{ item.nickname }}
									</div>
									<div class="text-sm" style="color:var(--title-light)">
										<app-time :data="item.createTime" />
									</div>
								</div>
							</div>
							<div class="flex items-center ">
								<span class="mr-2">{{ $t('已砍') }} </span>
								<product-price style="color:var(--mi-color-priamry)" :data="item.reducePrice" />
							</div>
						</div>
					</li>
				</ul>
				<el-empty v-else :description="$t('No data')" />
			</div>
		</section>
		<section class="my-5">
			<h2 class="text-center mb-2 text-lg">
				{{ $t('商品详情') }}
			</h2>
			<div class="bg-white" :class="[appStore.isPC ? '' : 'mx-2']">
				<div v-if="productInfo" class="flex items-center">
					<app-image :src="productInfo.picUrl" :class="[appStore.isPC ? 'w-60 h-60' : 'w-28 h-28']" :alt="productInfo.name" />
					<div class="flex flex-col justify-between">
						<div class="my-2">
							{{ productInfo.name }}
						</div>
						<div v-if="sku" class="my-2" style="color:var(--brand-black-60)">
							{{ sku?.properties.map(p => p.valueName).join(' ') }}
						</div>
						<div class="my-2" style="color:var(--title-light)">
							{{ productInfo.introduction }}
						</div>
					</div>
				</div>
				<el-empty v-else :description="$t('No data')" />
			</div>
		</section>
	</div>
</template>
