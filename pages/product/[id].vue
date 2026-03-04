<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import type { BargainActivity, BargainHelp, CombinationActivityDetail, PayOrderSubmit, ProductDetail, SeckillActivity, SKU } from '~/types'
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'
import { useProperties } from './utils'
import {useProductSEO} from "~/composables/usePageSEO";

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const { shortDomain, domain } = useRuntimeConfig().public
const { gtag } = useGtag()
// 商品详情埋点
gtag('event', 'screen_view', {
	app_name: shortDomain,
	screen_name: 'product-detail',
})

const id = route.params.id ? Number(route.params.id) : null
provide('id', id)
const { data: info } = await useAPI<ProductDetail>('product/spu/get-detail', { params: { id } })
provide('info', info)
const curSku = ref<SKU | null>()
provide('curSku', curSku)
const selected = ref<Record<any, any>>({})

// 开团---start
const combinationActivityId = route.query.combinationActivityId ? Number(route.query.combinationActivityId) : null
const combinationActivity = ref<CombinationActivityDetail | null>(combinationActivityId ? { id: combinationActivityId } as CombinationActivityDetail : null)
if (combinationActivityId) {
	$api<CombinationActivityDetail>('promotion/combination-activity/get-detail', { params: { id: combinationActivityId } }).then((res) => {
		combinationActivity.value = res
	})
}
const skuDisabled = ref(false)
provide('combinationActivity', combinationActivity)
provide('combinationActivityId', combinationActivityId)
provide('skuDisabled', skuDisabled)
watch([info, combinationActivity], () => {
	const ps = combinationActivity.value?.products || []
	if (!ps.length)
		return
	info.value?.skus.forEach((sku) => {
		const item = ps.find(s => s.skuId === sku.id)
		if (item) {
			sku.marketPrice = sku.price
			sku.price = item.combinationPrice
			sku.combinationPrice = item.combinationPrice
		}
	})
	if (!ps.find(s => s.skuId === curSku.value?.id)) {
		info.value?.skus.find(s => s.id === ps[0].skuId)?.properties.forEach((p) => {
			selected.value[p.propertyId] = p.valueId
		})
	}
}, { immediate: true })
// 开团---end

// 秒杀---start
const seckillActivityId = route.query.seckillActivityId ? Number(route.query.seckillActivityId) : null
const seckillActivity = ref<SeckillActivity | null>(seckillActivityId ? { id: seckillActivityId } as SeckillActivity : null)
provide('seckillActivity', seckillActivity)
if (seckillActivityId) {
	$api<SeckillActivity>('promotion/seckill-activity/get-detail', { params: { id: seckillActivityId } }).then((res) => {
		seckillActivity.value = res
	})
}
watchEffect(() => {
	info.value?.skus.forEach((sku) => {
		const item = seckillActivity.value?.products?.find(s => s.skuId === sku.id)
		if (item) {
			sku.marketPrice = sku.price
			sku.price = item.seckillPrice
			sku.seckillPrice = item.seckillPrice
			sku.stock = item.stock
		}
	})
})
// 秒杀---end

// 砍价---start
const bargainActivityId = route.query.bargainActivityId ? Number(route.query.bargainActivityId) : null
const bargainRecordId = route.query.bargainRecordId ? Number(route.query.bargainRecordId) : null
const bargainActivity = ref<BargainActivity | null>(bargainActivityId ? { id: bargainActivityId } as BargainActivity : null)
const bargainRecord = ref<BargainActivity | null>()
const bargainHelpList = ref<BargainHelp[]>([])
const hasHelp = computed(() => !!bargainHelpList.value?.find(d => d.userId === userStore.id))
const isCurrentUser = computed(() => bargainRecord.value?.userId === userStore.id)
provide('bargainActivity', bargainActivity)
provide('bargainRecord', bargainRecord)
provide('bargainHelpList', bargainHelpList)
provide('hasHelp', hasHelp)
provide('isCurrentUser', isCurrentUser)
function getBargainRecord() {
	$api<BargainActivity>('promotion/bargain-record/get-detail', { params: { id: bargainRecordId, activityId: bargainActivityId } }).then((res) => {
		bargainRecord.value = res
	})
	$api<BargainHelp[]>('promotion/bargain-help/list', { params: { recordId: bargainRecordId } }).then((res) => {
		bargainHelpList.value = res
	})
}
if (bargainActivityId) {
	$api<BargainActivity>('promotion/bargain-activity/get-detail', { params: { id: bargainActivityId } }).then((res) => {
		bargainActivity.value = res
		curSku.value = info.value?.skus.find(s => s.id === res.skuId)
	})
	if (bargainRecordId === null) {
		$api<{ list: BargainActivity[] }>('promotion/bargain-record/page', { params: { pageNo: 1, pageSize: 1000, activityId: bargainActivityId } }).then((res) => {
			const d = res?.list.filter(dd => dd.activityId === bargainActivityId)[0]
			if (d) {
				if (d.status === 1 || (d.status === 2 && (!d.orderId || d.payStatus == false))) {
					router.replace({
						path: $path(`/product/${id}`),
						query: {
							bargainActivityId,
							bargainRecordId: d.id,
						},
					})
				}
			}
		})
	}
	else {
		getBargainRecord()
	}
}
watchEffect(() => {
	info.value?.skus.forEach((sku) => {
		const item = bargainActivity.value?.products?.find(s => s.skuId === sku.id)
		if (item) {
			sku.price = item.seckillPrice
			sku.seckillPrice = item.seckillPrice
			sku.stock = item.stock
		}
	})
})
// 砍价---end

const inTimerange = ref(true)
const isAcActivity = computed(() => !!(
	seckillActivity.value
	|| combinationActivity.value
	|| bargainActivity.value
))
provide('inTimerange', inTimerange)
provide('isAcActivity', isAcActivity)

watch(
	selected,
	(v) => {
		curSku.value = null
		info.value?.skus.find((s) => {
			if (Object.entries(v).every(([k, v]) => s.propertyMap[k] === v)) {
				curSku.value = s
			}
		})
	},
	{ deep: true },
)
watchEffect(() => {
	if (!inTimerange.value) {
		skuDisabled.value = true
	}
	else if (combinationActivity.value) {
		skuDisabled.value = !combinationActivity.value?.products?.find(p => p.skuId === curSku.value?.id)
	}
	else if (seckillActivity.value) {
		skuDisabled.value = !seckillActivity.value?.products?.find(p => p.skuId === curSku.value?.id)
	}
	else {
		skuDisabled.value = false
	}
})
const properties = useProperties(info)
watch(
	() => info.value?.skus,
	(v) => {
		if (v && !curSku.value) {
			selected.value = { ...(v[0]?.propertyMap || {}) }
		}
	},
	{ immediate: true },
)

const { data: stared } = await useAPI<boolean>(
	'product/favorite/exits',
	{ params: { spuId: id } },
)

const count = ref(1)
watchEffect(() => {
	if (curSku.value) {
		count.value = Math.min(count.value, curSku.value.stock)
	}
	else {
		count.value = 1
	}
})

function toggleStar() {
	if (stared.value) {
		$api('product/favorite/delete', {
			method: 'delete',
			body: { spuId: id },
		}).then(() => {
			stared.value = false
		})
	}
	else {
		$api('product/favorite/create', {
			method: 'post',
			body: { spuId: id },
		}).then(() => {
			stared.value = true
		})
	}
}

const appStore = useAppStore()
const cartStore = useCartStore()

function goCart() {
	if (!count.value || !curSku.value)
		return
	cartStore.addCart(info.value!, curSku.value, count.value).then(() =>
		router.push($path('/user/cart')),
	)
}

function goSeckill() {
	if (!count.value || !curSku.value)
		return
	if (seckillActivity.value) {
		localStorage.setItem(`seckillActivityId-${seckillActivity.value.id}`, JSON.stringify({
			...info.value,
			count: count.value,
			sku: curSku.value,
			skuId: curSku.value?.skuId,
			spuId: id,
		}))
		router.push({
			path: $path('/user/checkout'),
			query: { seckillActivityId: seckillActivity.value.id },
		})
	}
}
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
function goCombination({ combinationHeadId } = {}) {
	if (!count.value || !curSku.value)
		return
	if (!skuDisabled.value) {
		localStorage.setItem(`combinationActivityId-${combinationActivityId}`, JSON.stringify({
			...info.value,
			count: count.value,
			sku: curSku.value,
			skuId: curSku.value?.skuId,
			spuId: id,
		}))
		router.push({
			path: $path('/user/checkout'),
			query: { combinationActivityId, combinationHeadId },
		})
	}
}

function goNoraml() {
	router.push($path(`/product/${id}`))
}
const msg = t('Please sign in first')
function goBargain() {
	// 需要先登陆
	if (!userStore.id) {
		ElMessage.info(msg)
		router.push(`${$path(`/login`)}?redirect=${encodeURIComponent(route.fullPath)}`)
	}
	$api<number>('promotion/bargain-record/create', {
		method: 'post',
		body: { activityId: bargainActivityId },
	}).then((bargainRecordId: number) => {
		ElMessage.info(t('参与成功，请邀请好友砍价'))
		router.push({
			path: $path(`/product/${id}`),
			query: {
				bargainActivityId,
				bargainRecordId,
			},
		})
	})
}

watch(() => route.fullPath, () => window.location.reload())

const { copy } = useClipboard()
function checkUser() {
	if (!userStore.id) {
		ElMessage.info(t('Please sign in first'))
		router.push(`${$path(`/login`)}?redirect=${encodeURIComponent(route.fullPath)}`)
		return false
	}
	return true
}
const { currency } = useRuntimeConfig().public
function handleCommand(type: string, data: any) {
	switch (type) {
		case 'star':
			toggleStar()
			break
		case 'submit':
			goCart()
			break
		case 'seckill':
			goSeckill()
			break
		case 'combination':
			goCombination(data)
			break
		case 'normal':
			goNoraml()
			break
		case 'bargain':
			goBargain()
			break
		case 'invite':
			copy(window.location.href)
			ElMessage.info(t('链接已复制'))
			break
		case 'help':
			if (!checkUser())
				return
			if (bargainRecord.value) {
				$api<number>('promotion/bargain-help/create', { method: 'post', body: { recordId: bargainRecordId } }).then((res) => {
					res && ElMessage.info(`${t('恭喜帮砍成功')} ${currency}${res / 100}`)
					bargainRecord.value!.helpCount = (bargainRecord.value!.helpCount || 0) + 1
					getBargainRecord()
				})
			}
			break
		case 'bargain-buy':
			localStorage.setItem(`bargainRecordId-${bargainRecordId}`, JSON.stringify({
				...info.value,
				count: count.value,
				sku: curSku.value,
				skuId: curSku.value?.id,
				spuId: info.value?.id,
			}))
			router.push($path(`/user/checkout?bargainRecordId=${bargainRecordId}&activityId=${bargainActivityId}`))
			break
		case 'bargin-pay':
			bargainRecord.value && router.push($path(`/user/checkout?orderId=${bargainRecord.value.orderId}&payOrderId=${bargainRecord.value.payOrderId}`))
			break
		case 'bargin-order':
			bargainRecord.value?.orderId && router.push($path(`/user/orderview/${bargainRecord.value.orderId}`))
			break
	}
}

// 使用统一的 SEO composable
const { title, description, keywords, canonicalUrl } = useProductSEO(info)
</script>

<template>
	<div class="product_v4">
		<div v-if="info" class="xm-page-area">
			<component
				:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
				v-model:count="count"
				v-model:sku="curSku"
				v-model:selected="selected"
				:info="info"
				:star="stared"
				:properties="properties"
				@command="handleCommand"
			/>
		</div>
	</div>
</template>
