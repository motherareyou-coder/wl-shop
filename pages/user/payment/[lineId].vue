<script setup lang="ts">
import { fmtYuan } from '~/types/travel'

const route = useRoute()
const lineId = Number(route.params.lineId)
definePageMeta({ title: 'Payment' })
useSEO({ title: $t('travel.payment.seo'), noIndex: true })

const { create } = useTravelPaymentApi()
const { get: getPreOrder } = usePreOrderApi()

const loading = ref(true)
const lineInfo = ref<any>(null)
const paying = ref(false)
const paid = ref(false)
const errorMsg = ref('')

// 从预订单详情中找到对应的行（需要知道哪个预订单包含这个 lineId）
// 由于没有 lineId → preOrderId 的直接查询，从 URL query 传入 preOrderId
const preOrderId = Number(route.query.preOrderId) || 0
// preOrderId 缺失时给出友好提示（避免空白死状态）
const missingPreOrder = computed(() => !preOrderId)

async function loadLineInfo() {
	loading.value = true
	if (!preOrderId) {
		loading.value = false
		return
	}
	try {
		const preOrder = await getPreOrder(preOrderId)
		lineInfo.value = preOrder?.lines?.find((l: any) => l.id === lineId) || null
	}
	catch {}
	finally { loading.value = false }
}
await loadLineInfo()

const payAmount = computed(() => {
	if (!lineInfo.value)
		return null
	const pt = Number(lineInfo.value.paymentType)
	if (pt === 3)
		return lineInfo.value.amount // 全款
	if (pt === 2)
		return lineInfo.value.prepaymentAmount // 预付
	return lineInfo.value.amount
})
const isPrepay = computed(() => Number(lineInfo.value?.paymentType) === 2)

async function doPay() {
	paying.value = true
	errorMsg.value = ''
	try {
		const result = await create(lineId)
		if (result?.payOrderId) {
			// TODO: 对接微信/支付宝 SDK（H5/JSAPI）
			// 目前先模拟支付成功（后续接入真实 SDK 后替换）
			// 实际流程：调起支付 → 轮询 pay/order/get → 确认支付状态
			startPolling(result.payOrderId)
		}
	}
	catch (e: any) {
		errorMsg.value = e?.message || $t('travel.payment.initFailed')
		paying.value = false
	}
}

let pollTimer: ReturnType<typeof setInterval> | null = null
let timeoutTimer: ReturnType<typeof setTimeout> | null = null
let settled = false // 防止超时与成功竞态

function clearTimers() {
	if (pollTimer) {
		clearInterval(pollTimer)
		pollTimer = null
	}
	if (timeoutTimer) {
		clearTimeout(timeoutTimer)
		timeoutTimer = null
	}
}

function startPolling(payOrderId: number) {
	settled = false
	// 轮询支付状态（复用商城的 pay/order/get）
	pollTimer = setInterval(async () => {
		if (settled)
			return
		try {
			const res = await $api<any>('pay/order/get', { method: 'get', params: { id: payOrderId } })
			// status: 10=成功 20=已退款（此处仅判定成功语义，后续按后端确认）
			if (res?.status === 10) {
				settled = true
				clearTimers()
				paid.value = true
				paying.value = false
			}
		}
		catch {}
	}, 2000)
	// 超时（2 分钟）
	timeoutTimer = setTimeout(() => {
		if (settled)
			return
		settled = true
		clearTimers()
		paying.value = false
		errorMsg.value = $t('travel.payment.timeout')
	}, 120000)
}

onBeforeUnmount(clearTimers)
</script>

<template>
	<div class="pay-page">
		<div v-if="loading" class="sk-block"></div>
		<div v-else-if="missingPreOrder" class="pay-form">
			<div class="pay-error">
				{{ $t('travel.payment.missingParam') }}
			</div>
			<NuxtLink class="ghost-link" :to="$path('/user/my-travel?tab=preorder')">
				{{ $t('travel.payment.backToPreorder') }}
			</NuxtLink>
		</div>
		<div v-else-if="paid" class="pay-result">
			<div class="pay-result__icon">
				✓
			</div>
			<h1 class="pay-result__title">
				{{ $t('travel.payment.success') }}
			</h1>
			<p class="pay-result__desc">
				{{ $t('travel.payment.successDesc') }}
			</p>
			<NuxtLink class="btn btn--pay" :to="$path('/user/my-travel?tab=order')">
				{{ $t('travel.payment.viewMyOrders') }}
			</NuxtLink>
		</div>
		<div v-else class="pay-form">
			<h1 class="pay-form__title">
				{{ $t('travel.payment.orderPayment') }}
			</h1>
			<div v-if="lineInfo" class="pay-form__info">
				<div class="pay-info-row">
					<span>{{ $t('travel.payment.serviceType') }}</span><span>{{ lineInfo.lineType === 1 ? $t('travel.payment.travelArrangement') : $t('travel.payment.escortService') }}</span>
				</div>
				<div class="pay-info-row">
					<span>{{ $t('travel.payment.payMethod') }}</span><span>{{ isPrepay ? $t('travel.payment.onlinePrepay') : $t('travel.payment.onlineFull') }}</span>
				</div>
				<div v-if="isPrepay && lineInfo.prepaymentRatio" class="pay-info-row">
					<span>{{ $t('travel.payment.prepayRatio') }}</span><span>{{ lineInfo.prepaymentRatio }}%</span>
				</div>
				<div class="pay-info-row pay-info-row--amount">
					<span>{{ $t('travel.payment.payAmount') }}</span><span class="pay-amount">{{ fmtYuan(payAmount) }}</span>
				</div>
			</div>
			<div v-else class="pay-form__info">
				<p>{{ $t('travel.payment.preOrderLine') }} #{{ lineId }}</p>
			</div>

			<div v-if="errorMsg" class="pay-error">
				{{ errorMsg }}
			</div>

			<div class="pay-form__notice">
				<p>{{ $t('travel.payment.clickToPay') }}</p>
				<p v-if="isPrepay">
					{{ $t('travel.payment.remainingOfflineNotice') }}
				</p>
			</div>

			<button class="btn btn--pay" :disabled="paying" @click="doPay">
				{{ paying ? $t('travel.payment.initiating') : `${$t('travel.payment.pay')} ${fmtYuan(payAmount)}` }}
			</button>
			<NuxtLink v-if="preOrderId" class="ghost-link" :to="$path(`/user/preorder/${preOrderId}`)">
				{{ $t('travel.payment.backToPreorderDetail') }}
			</NuxtLink>
			<NuxtLink v-else class="ghost-link" :to="$path('/user/my-travel?tab=preorder')">
				{{ $t('travel.payment.backToPreorder') }}
			</NuxtLink>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.pay-page { max-width: 500px; margin: 0 auto; padding: 60px var(--site-horizontal-padding, 32px) 80px; }
.pay-result { text-align: center;
	&__icon { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #A16207, #CA8A04); color: #fff; font-size: 36px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
	&__title { font-size: 24px; font-weight: 700; margin: 0 0 8px; }
	&__desc { font-size: 15px; color: #898989; margin: 0 0 24px; }
}
.pay-form { text-align: center; &__title { font-size: 24px; font-weight: 700; margin: 0 0 32px; }
	&__info { background: #f5f5f5; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
	&__notice { margin-bottom: 32px; p { font-size: 14px; color: #898989; margin: 0 0 4px; } }
}
.pay-info-row { display: flex; justify-content: space-between; font-size: 15px; padding: 8px 0;
	span:first-child { color: #898989; } &--amount { border-top: 1px solid #ddd; margin-top: 8px; padding-top: 16px; font-size: 18px; font-weight: 700; }
}
.pay-amount { color: var(--brand-orange, #A16207); font-size: 24px; }
.pay-error { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; color: #dc2626; font-size: 14px; margin-bottom: 20px; }
.btn { display: inline-flex; justify-content: center; width: 100%; padding: 14px; font-size: 16px; font-weight: 600; border-radius: 999px; border: none; cursor: pointer; text-decoration: none;
	&--pay { background: linear-gradient(135deg, #A16207, #CA8A04); color: #fff; margin-bottom: 16px;
		&:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(161,98,7,.3); }
		&:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; } }
}
.ghost-link { font-size: 14px; color: #898989; text-decoration: none; &:hover { color: var(--brand-orange, #A16207); } }
.sk-block { height: 200px; border-radius: 12px; background: #f5f5f5; }
@media (max-width: 720px) { .pay-page { padding: 32px 16px 60px; } }
</style>
