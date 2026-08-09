<script setup lang="ts">
import { fmtYuan, parseItinerary, PRE_ORDER_STATUS_NUM_MAP } from '~/types/travel'

const route = useRoute()
const id = Number(route.params.id)
definePageMeta({ title: 'Pre-Order Details', showBread: true })
useSEO({ title: $t('travel.preorder.seo'), noIndex: true })

const dayjs = useDayjs()
const { get: getPreOrder, confirm, cancel } = usePreOrderApi()
const { listByPreOrder } = useCommunicationLogApi()

const loading = ref(true)
const error = ref(false)
const detail = ref<any>()
const logs = ref<any[]>([])

const confirming = ref(false)
const cancelling = ref(false)
const confirmRemark = ref('')
const confirmProof = ref('')

async function load() {
	loading.value = true
	error.value = false
	try {
		detail.value = await getPreOrder(id)
		logs.value = (await listByPreOrder(id)) || []
	}
	catch {
		error.value = true
	}
	finally { loading.value = false }
}
await load()

const statusNum = computed(() => Number(detail.value?.status ?? 0))
// 状态色取自 map，label 走 i18n
const statusInfo = computed(() => ({
	label: $t(`travel.status.po_${statusNum.value}`),
	color: PRE_ORDER_STATUS_NUM_MAP[statusNum.value]?.color || '#898989',
}))
const lines = computed(() => detail.value?.lines || [])
const canConfirm = computed(() => statusNum.value === 1) // SENT
const canCancel = computed(() => [0, 1, 2].includes(statusNum.value)) // DRAFT/SENT/USER_CONFIRMED

async function doConfirm() {
	confirming.value = true
	try {
		await confirm({ id, userRemark: confirmRemark.value || undefined, paymentProof: confirmProof.value || undefined })
		await load()
	}
	catch {}
	finally { confirming.value = false }
}
async function doCancel() {
	cancelling.value = true
	try {
		await cancel(id)
		await load()
	}
	catch {}
	finally { cancelling.value = false }
}
function lineTypeLabel(t: number) {
	return $t(`travel.status.lt_${t}`)
}
function payTypeLabel(t: number) {
	return $t(`travel.status.pt_${t}`)
}
function slotLabel(t: number) {
	return $t(`travel.status.ts_${t}`)
}
function itineraryDays(json?: string) {
	return parseItinerary(json)
}
function fmtDate(d?: string) {
	return d ? dayjs(d).format('YYYY-MM-DD') : '--'
}
function fmtDateTime(d?: string) {
	return d ? dayjs(d).format('YYYY-MM-DD HH:mm') : '--'
}
</script>

<template>
	<div class="user-order-list miv4 mb-10">
		<div class="user-layout__container miv4">
			<div class="user-main">
				<div v-if="loading" class="sk-block sk-block--lg"></div>
				<div v-else-if="error" class="empty">
			<p>{{ $t('travel.common.loadFailed') }}</p><button class="ghost-btn" @click="load">
				{{ $t('travel.common.retry') }}
			</button>
		</div>

		<template v-else-if="detail">
			<!-- 头部 -->
			<section class="info-block">
				<header class="info-block__header">
					<div>
						<h1>{{ $t('travel.preorder.titlePrefix') }} {{ detail.no || `#${detail.id}` }}</h1>
						<span class="meta-text">{{ fmtDateTime(detail.createTime) }}</span>
					</div>
					<span class="status-badge" :style="{ color: statusInfo.color, borderColor: statusInfo.color }">{{ statusInfo.label }}</span>
				</header>
				<NuxtLink class="ghost-btn ghost-btn--sm" :to="$path('/user/my-travel?tab=preorder')">
					← {{ $t('travel.common.backToList') }}
				</NuxtLink>
			</section>

			<!-- 行程概览 -->
			<section v-if="detail.itinerarySummary" class="info-block">
				<h2 class="block-title">
					{{ $t('travel.common.itineraryOverview') }}
				</h2>
				<p class="block-text">
					{{ detail.itinerarySummary }}
				</p>
			</section>

			<!-- 第三方收款信息 -->
			<section v-if="detail.thirdPartyName" class="info-block">
				<h2 class="block-title">
					{{ $t('travel.common.thirdParty') }}
				</h2>
				<div class="info-row">
					<span>{{ $t('travel.common.payee') }}</span><span>{{ detail.thirdPartyName }}</span>
				</div>
				<div v-if="detail.thirdPartyInfo" class="info-row">
					<span>{{ $t('travel.common.payeeInfo') }}</span><span>{{ detail.thirdPartyInfo }}</span>
				</div>
			</section>

			<!-- 订单行明细 -->
			<section v-if="lines.length" class="info-block">
				<h2 class="block-title">
					{{ $t('travel.common.serviceDetails') }}
				</h2>
				<div v-for="line in lines" :key="line.id" class="line-section">
					<div class="line-section__head">
						<span class="line-type-tag">{{ lineTypeLabel(line.lineType) }}</span>
						<span v-if="line.destination" class="line-dest">{{ line.destination }}</span>
						<span v-if="line.startDate" class="line-date">{{ fmtDate(line.startDate) }} ~ {{ fmtDate(line.endDate) }}</span>
					</div>

					<!-- 行程详情（JSON 按天展示） -->
					<div v-if="itineraryDays(line.itineraryDetail).length" class="itinerary-days">
						<div v-for="(day, di) in itineraryDays(line.itineraryDetail)" :key="di" class="day-item">
							<span class="day-item__no">Day{{ day.day || di + 1 }}</span>
							<div class="day-item__content">
								<span v-if="day.title" class="day-item__title">{{ day.title }}</span>
								<span v-if="day.desc" class="day-item__desc">{{ day.desc }}</span>
							</div>
						</div>
					</div>

					<!-- 自有行程描述 -->
					<p v-if="line.ownItineraryDesc" class="block-text">
						{{ line.ownItineraryDesc }}
					</p>

					<!-- 随行人员分配 -->
					<div v-if="line.assignments?.length" class="assign-table">
						<div class="assign-table__head">
							<span>{{ $t('travel.preorder.date') }}</span><span>{{ $t('travel.preorder.timeSlot') }}</span><span>{{ $t('travel.preorder.staff') }}</span><span>{{ $t('travel.preorder.serviceType') }}</span><span>{{ $t('travel.preorder.price') }}</span>
						</div>
						<div v-for="a in line.assignments" :key="a.id" class="assign-table__row">
							<span>{{ fmtDate(a.serviceDate) }}</span>
							<span>{{ slotLabel(a.timeSlot) }}</span>
							<span>{{ a.serviceProviderId ? `${$t('travel.preorder.staffNo')}#${a.serviceProviderId}` : $t('travel.preorder.toBeAssigned') }}</span>
							<span>{{ a.serviceType || '--' }}</span>
							<span class="price-cell">{{ a.actualPrice ? fmtYuan(a.actualPrice) : '--' }}</span>
						</div>
					</div>

					<!-- 金额信息 -->
					<div class="line-amount">
						<div class="amount-row">
							<span>{{ $t('travel.preorder.amount') }}</span><span class="amount-val">{{ fmtYuan(line.amount) }}</span>
						</div>
						<div class="amount-row">
							<span>{{ $t('travel.preorder.payMethod') }}</span><span>{{ payTypeLabel(line.paymentType) }}</span>
						</div>
						<div v-if="line.paymentType === 2" class="amount-row">
							<span>{{ $t('travel.preorder.prepayRatio') }}</span><span>{{ line.prepaymentRatio }}%</span>
						</div>
						<div v-if="line.prepaymentAmount" class="amount-row">
							<span>{{ $t('travel.preorder.prepayAmount') }}</span><span class="amount-val">{{ fmtYuan(line.prepaymentAmount) }}</span>
						</div>
						<div v-if="line.remainingAmount" class="amount-row">
							<span>{{ $t('travel.preorder.remainingAmount') }}</span><span class="amount-val">{{ fmtYuan(line.remainingAmount) }}</span>
						</div>
						<div v-if="line.thirdPartyName" class="amount-row">
							<span>{{ $t('travel.preorder.thirdPartyPayee') }}</span><span>{{ line.thirdPartyName }}</span>
						</div>
					</div>

					<!-- ESCORT 行的支付按钮（状态为用户确认后且需要线上支付） -->
					<div v-if="(line.lineType === 2 || line.lineType === 3) && (line.paymentType === 2 || line.paymentType === 3) && canConfirm" class="line-pay">
						<NuxtLink class="pay-btn" :to="$path(`/user/payment/${line.id}?preOrderId=${detail.id}`)">
							{{ $t('travel.preorder.goPay') }}
						</NuxtLink>
					</div>
				</div>
			</section>

			<!-- 总金额 -->
			<section v-if="detail.totalAmount" class="info-block">
				<h2 class="block-title">
					{{ $t('travel.common.feeSummary') }}
				</h2>
				<div class="amount-row amount-row--total">
					<span>{{ $t('travel.common.total') }}</span><span class="amount-val amount-val--lg">{{ fmtYuan(detail.totalAmount) }}</span>
				</div>
			</section>

			<!-- 沟通记录 -->
			<section class="info-block">
				<h2 class="block-title">
					{{ $t('travel.common.communicationLog') }}
				</h2>
				<TravelTimeline :logs="logs" />
			</section>

			<!-- 用户操作 -->
			<section v-if="canConfirm || canCancel" class="info-block actions-block">
				<h2 class="block-title">
					{{ $t('travel.common.actions') }}
				</h2>
				<div v-if="canConfirm" class="confirm-form">
					<input v-model="confirmRemark" class="text-input" :placeholder="$t('travel.preorder.remark')">
					<input v-model="confirmProof" class="text-input" :placeholder="$t('travel.preorder.proofUrl')">
				</div>
				<div class="actions-btns">
					<button v-if="canConfirm" class="btn btn--primary" :disabled="confirming" @click="doConfirm">
						{{ confirming ? $t('travel.preorder.confirming') : $t('travel.preorder.confirm') }}
					</button>
					<button v-if="canCancel" class="btn btn--danger" :disabled="cancelling" @click="doCancel">
						{{ cancelling ? $t('travel.preorder.cancelling') : $t('travel.preorder.cancel') }}
					</button>
				</div>
			</section>

			<!-- 已转订单 -->
			<section v-if="statusNum === 4 && detail.orderId" class="info-block">
				<div class="order-notice">
					✓ {{ $t('travel.preorder.convertedNotice') }} <NuxtLink class="order-link" :to="$path(`/user/travel-order/${detail.orderId}`)">
						{{ $t('travel.preorder.viewOrder') }} →
					</NuxtLink>
				</div>
			</section>
		</template>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
/* 复用 orderlist/orderview 的布局容器：居中限宽 + 白底卡片 */
.user-layout__container {
	display: flex;
	margin: 0 auto;
	max-width: 100%;
	width: var(--max-width-1400);
}
.user-main {
	background-color: var(--title-primary-variant-2, #fff);
	flex: 1 1;
	margin-left: 12px;
	padding: 50px;
}
.info-block { background: var(--background-white, #fff); border: 1px solid #eee; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.05);
	&__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px;
		h1 { font-size: 22px; font-weight: 700; color: var(--text-base, #191919); margin: 0; }
		.meta-text { font-size: 13px; color: var(--text-secondary, #898989); }
	}
}
.block-title { font-size: 16px; font-weight: 600; color: var(--brand-orange, #A16207); margin: 0 0 16px; padding-left: 10px; border-left: 3px solid var(--brand-orange, #A16207); }
.block-text { font-size: 15px; color: var(--text-base, #191919); line-height: 1.7; margin: 0; white-space: pre-wrap; }
.status-badge { font-size: 13px; font-weight: 600; padding: 4px 12px; border: 1px solid; border-radius: 999px; white-space: nowrap; }
.info-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #f5f5f5;
	span:first-child { color: var(--text-secondary, #898989); } span:last-child { color: var(--text-base, #191919); font-weight: 500; }
}

/* 订单行 */
.line-section { padding: 16px 0; border-bottom: 1px solid #f0f0f0;
	&:last-child { border-bottom: none; }
	&__head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
}
.line-type-tag { font-size: 12px; font-weight: 600; color: var(--brand-orange, #A16207); background: var(--background-primary-light, #FAF2E0); padding: 3px 10px; border-radius: 999px; }
.line-dest { font-size: 15px; font-weight: 600; color: var(--text-base, #191919); }
.line-date { font-size: 13px; color: var(--text-secondary, #898989); }

/* 行程天数 */
.itinerary-days { margin: 12px 0; }
.day-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px dashed #f0f0f0;
	&__no { font-size: 13px; font-weight: 700; color: var(--brand-orange, #A16207); min-width: 50px; }
	&__content { flex: 1; }
	&__title { font-size: 14px; font-weight: 500; color: var(--text-base, #191919); display: block; }
	&__desc { font-size: 13px; color: var(--text-secondary, #898989); display: block; margin-top: 2px; }
}

/* 分配表 */
.assign-table { margin: 12px 0; border: 1px solid #eee; border-radius: 8px; overflow: hidden;
	&__head { display: grid; grid-template-columns: 1fr 60px 1fr 1fr 80px; gap: 4px; padding: 8px 12px; background: var(--background-light-grey, #f5f5f5); font-size: 12px; font-weight: 600; color: var(--text-secondary, #898989); }
	&__row { display: grid; grid-template-columns: 1fr 60px 1fr 1fr 80px; gap: 4px; padding: 8px 12px; font-size: 13px; border-top: 1px solid #f0f0f0; color: var(--text-base, #191919); }
}
.price-cell { color: var(--brand-orange, #A16207); font-weight: 600; text-align: right; }

/* 金额 */
.line-amount { margin-top: 12px; padding: 12px; background: var(--background-light-grey, #f5f5f5); border-radius: 8px; }
.amount-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px;
	span:first-child { color: var(--text-secondary, #898989); }
	&--total { font-size: 18px; font-weight: 700; border-top: 2px solid #ddd; padding-top: 12px; margin-top: 4px;
		span:first-child { color: var(--text-base, #191919); }
	}
}
.amount-val { color: var(--brand-orange, #A16207); font-weight: 600;
	&--lg { font-size: 20px; }
}
.line-pay { margin-top: 12px; text-align: right; }
.pay-btn { display: inline-flex; align-items: center; padding: 10px 24px; background: linear-gradient(135deg, #A16207, #CA8A04); color: #fff; border-radius: 999px; font-size: 15px; font-weight: 600; text-decoration: none; transition: transform .2s;
	&:hover { transform: translateY(-1px); }
}

/* 操作 */
.confirm-form { margin-bottom: 16px; }
.text-input { width: 100%; padding: 10px 14px; border: 1px solid #d6d0c0; border-radius: 8px; font-size: 14px; margin-bottom: 8px; box-sizing: border-box; }
.actions-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.btn { padding: 12px 28px; font-size: 15px; font-weight: 600; border-radius: 8px; border: none; cursor: pointer;
	&--primary { background: var(--brand-orange, #A16207); color: #fff; &:hover { opacity: .9; } }
	&--danger { background: transparent; color: #dc2626; border: 1px solid #dc2626; &:hover { background: #fef2f2; } }
	&:disabled { opacity: .5; cursor: not-allowed; }
}
.ghost-btn { font-size: 14px; font-weight: 600; border-radius: 8px; padding: 8px 18px; background: transparent; color: var(--brand-orange, #A16207); border: 1px solid var(--brand-orange, #A16207); cursor: pointer; text-decoration: none; display: inline-block; }
.ghost-btn--sm { font-size: 13px; padding: 6px 14px; }
.order-notice { text-align: center; font-size: 16px; color: #16a34a; font-weight: 600; padding: 16px; }
.order-link { color: var(--brand-orange, #A16207); text-decoration: none; margin-left: 8px; }
.empty { text-align: center; padding: 80px 20px; p { color: var(--text-secondary, #898989); margin: 0 0 16px; } }
.sk-block { height: 120px; border-radius: 12px; background: var(--background-light-grey, #f5f5f5); }
.sk-block--lg { height: 200px; }
@media (max-width: 720px) {
	.user-main { margin-left: 0; padding: 16px; }
	.assign-table__head, .assign-table__row { grid-template-columns: 1fr 50px 1fr; font-size: 12px; }
	.assign-table__head span:nth-child(4), .assign-table__head span:nth-child(5),
	.assign-table__row span:nth-child(4), .assign-table__row span:nth-child(5) { display: none; }
}
</style>
