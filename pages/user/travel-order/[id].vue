<script setup lang="ts">
import { fmtYuan, LINE_STATUS_MAP, ORDER_STATUS_NUM_MAP, ORDER_TYPE_MAP, parseItinerary, REMAINING_AUDIT_MAP } from '~/types/travel'

const route = useRoute()
const id = Number(route.params.id)
definePageMeta({ title: 'Order Details', showBread: true })
useSEO({ title: $t('travel.order.seo'), noIndex: true })

const dayjs = useDayjs()
const { get: getOrder, confirmRemaining, cancel } = useTravelOrderApi()

const loading = ref(true)
const error = ref(false)
const detail = ref<any>()
const cancelling = ref(false)
const confirmingRemaining = ref<number | null>(null)
const remainingProofInput = ref('')
const remainingDialogLine = ref<number | null>(null)
const shareCopied = ref(false)

async function load() {
	loading.value = true
	error.value = false
	try {
		detail.value = await getOrder(id)
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
	label: $t(`travel.status.ord_${statusNum.value}`),
	color: ORDER_STATUS_NUM_MAP[statusNum.value]?.color || '#898989',
}))
const orderTypeLabel = computed(() => ORDER_TYPE_MAP[Number(detail.value?.orderType)] || '--')
const lines = computed(() => detail.value?.lines || [])
const canCancel = computed(() => [0, 1].includes(statusNum.value)) // CREATED, IN_SERVICE

function lineTypeLabel(t: number) {
	return $t(`travel.status.lt_${t}`)
}
function lineStatusLabel(s: number) {
	return { label: $t(`travel.status.line_${s}`), color: LINE_STATUS_MAP[s]?.color || '#898989' }
}
function payTypeLabel(t: number) {
	return $t(`travel.status.pt_${t}`)
}
function slotLabel(t: number) {
	return $t(`travel.status.ts_${t}`)
}
function auditLabel(s: number) {
	return { label: $t(`travel.status.audit_${s}`), color: REMAINING_AUDIT_MAP[s]?.color || '#898989' }
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

function canConfirmRemaining(line: any) {
	return line.lineType !== 1 && Number(line.lineStatus) === 5 && line.remainingAuditStatus !== 0 && line.remainingAuditStatus !== 1
}

async function doConfirmRemaining(lineId: number) {
	confirmingRemaining.value = lineId
	try {
		await confirmRemaining(lineId, remainingProofInput.value || undefined)
		remainingDialogLine.value = null
		remainingProofInput.value = ''
		await load()
	}
	catch {}
	finally { confirmingRemaining.value = null }
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

function shareOrder() {
	const url = `${window.location.origin}${$path(`/share/travel-order/${id}`)}`
	if (navigator.share) {
		navigator.share({ title: $t('travel.order.titlePrefix'), url }).catch(() => {})
	}
	else {
		navigator.clipboard.writeText(url).then(() => {
			shareCopied.value = true
			setTimeout(() => shareCopied.value = false, 2000)
		})
	}
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
						<h1>{{ $t('travel.order.titlePrefix') }} {{ detail.orderNo || `#${detail.id}` }}</h1>
						<span class="meta-text">{{ orderTypeLabel }} · {{ fmtDateTime(detail.createTime) }}</span>
					</div>
					<div class="header-actions">
						<span class="status-badge" :style="{ color: statusInfo.color, borderColor: statusInfo.color }">{{ statusInfo.label }}</span>
						<button class="share-btn" @click="shareOrder">
							{{ shareCopied ? `✓ ${$t('travel.order.copied')}` : $t('travel.order.share') }}
						</button>
					</div>
				</header>
				<NuxtLink class="ghost-btn ghost-btn--sm" :to="$path('/user/my-travel?tab=order')">
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

			<!-- 第三方收款 -->
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
						<span class="line-status-tag" :style="{ color: lineStatusLabel(line.lineStatus).color }">{{ lineStatusLabel(line.lineStatus).label }}</span>
						<span v-if="line.destination" class="line-dest">{{ line.destination }}</span>
						<span v-if="line.startDate" class="line-date">{{ fmtDate(line.startDate) }} ~ {{ fmtDate(line.endDate) }}</span>
					</div>

					<!-- 行程天数 -->
					<div v-if="itineraryDays(line.itineraryDetail).length" class="itinerary-days">
						<div v-for="(day, di) in itineraryDays(line.itineraryDetail)" :key="di" class="day-item">
							<span class="day-item__no">Day{{ day.day || di + 1 }}</span>
							<div class="day-item__content">
								<span v-if="day.title" class="day-item__title">{{ day.title }}</span>
								<span v-if="day.desc" class="day-item__desc">{{ day.desc }}</span>
							</div>
						</div>
					</div>
					<p v-if="line.ownItineraryDesc" class="block-text">
						{{ line.ownItineraryDesc }}
					</p>

					<!-- 随行人员日程 -->
					<div v-if="line.assignments?.length" class="assign-table">
						<div class="assign-table__head">
							<span>{{ $t('travel.preorder.date') }}</span><span>{{ $t('travel.preorder.timeSlot') }}</span><span>{{ $t('travel.order.staffShort') }}</span><span>{{ $t('travel.order.typeShort') }}</span><span>{{ $t('travel.preorder.price') }}</span>
						</div>
						<div v-for="a in line.assignments" :key="a.id" class="assign-table__row">
							<span>{{ fmtDate(a.serviceDate) }}</span><span>{{ slotLabel(a.timeSlot) }}</span>
							<span>{{ a.serviceProviderId ? `#${a.serviceProviderId}` : '--' }}</span>
							<span>{{ a.serviceType || '--' }}</span>
							<span class="price-cell">{{ a.actualPrice ? fmtYuan(a.actualPrice) : '--' }}</span>
						</div>
					</div>

					<!-- 金额 -->
					<div class="line-amount">
						<div class="amount-row">
							<span>{{ $t('travel.preorder.amount') }}</span><span class="amount-val">{{ fmtYuan(line.amount) }}</span>
						</div>
						<div class="amount-row">
							<span>{{ $t('travel.preorder.payMethod') }}</span><span>{{ payTypeLabel(line.paymentType) }}</span>
						</div>
						<div v-if="line.prepaymentAmount" class="amount-row">
							<span>{{ $t('travel.order.prepay') }}</span><span class="amount-val">{{ fmtYuan(line.prepaymentAmount) }}</span>
						</div>
						<div v-if="line.remainingAmount" class="amount-row">
							<span>{{ $t('travel.order.remaining') }}</span><span class="amount-val">{{ fmtYuan(line.remainingAmount) }}</span>
						</div>
						<!-- 尾款审核状态 -->
						<div v-if="line.remainingAuditStatus != null" class="amount-row">
							<span>{{ $t('travel.order.remainingAudit') }}</span>
							<span :style="{ color: auditLabel(line.remainingAuditStatus).color }">{{ auditLabel(line.remainingAuditStatus).label }}</span>
						</div>
						<div v-if="line.remainingAuditRemark" class="amount-row">
							<span>{{ $t('travel.order.auditRemark') }}</span><span>{{ line.remainingAuditRemark }}</span>
						</div>
					</div>

					<!-- 尾款确认按钮 -->
					<div v-if="canConfirmRemaining(line)" class="line-action">
						<button class="btn btn--primary" :disabled="confirmingRemaining === line.id" @click="remainingDialogLine = line.id">
							{{ $t('travel.order.confirmRemaining') }}
						</button>
					</div>

					<!-- 尾款确认弹窗 -->
					<div v-if="remainingDialogLine === line.id" class="remaining-dialog">
						<h3>{{ $t('travel.order.confirmRemainingTitle') }}</h3>
						<p>{{ $t('travel.order.remainingAmount') }}{{ fmtYuan(line.remainingAmount) }}</p>
						<input v-model="remainingProofInput" class="text-input" :placeholder="$t('travel.order.proofOptional')">
						<div class="dialog-btns">
							<button class="btn btn--ghost" @click="remainingDialogLine = null">
								{{ $t('travel.order.cancel') }}
							</button>
							<button class="btn btn--primary" :disabled="confirmingRemaining === line.id" @click="doConfirmRemaining(line.id)">
								{{ confirmingRemaining === line.id ? $t('travel.preorder.confirming') : $t('travel.order.confirm') }}
							</button>
						</div>
					</div>
				</div>
			</section>

			<!-- 金额汇总 -->
			<section v-if="detail.totalAmount" class="info-block">
				<h2 class="block-title">
					{{ $t('travel.order.amountSummary') }}
				</h2>
				<div v-if="detail.onlineAmount" class="amount-row">
					<span>{{ $t('travel.order.onlinePay') }}</span><span class="amount-val">{{ fmtYuan(detail.onlineAmount) }}</span>
				</div>
				<div v-if="detail.thirdPartyAmount" class="amount-row">
					<span>{{ $t('travel.order.thirdPartyPay') }}</span><span class="amount-val">{{ fmtYuan(detail.thirdPartyAmount) }}</span>
				</div>
				<div class="amount-row amount-row--total">
					<span>{{ $t('travel.common.total') }}</span><span class="amount-val amount-val--lg">{{ fmtYuan(detail.totalAmount) }}</span>
				</div>
			</section>

			<!-- 取消 -->
			<section v-if="canCancel" class="info-block">
				<button class="btn btn--danger" :disabled="cancelling" @click="doCancel">
					{{ cancelling ? $t('travel.order.cancelling') : $t('travel.order.cancelOrder') }}
				</button>
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
.info-block { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.05);
	&__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px;
		h1 { font-size: 22px; font-weight: 700; margin: 0; } .meta-text { font-size: 13px; color: #898989; }
	}
}
.header-actions { display: flex; align-items: center; gap: 10px; }
.share-btn { font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 999px; background: var(--background-primary-light, #FAF2E0); color: var(--brand-orange, #A16207); border: 1px solid var(--brand-orange, #A16207); cursor: pointer; white-space: nowrap; }
.block-title { font-size: 16px; font-weight: 600; color: var(--brand-orange, #A16207); margin: 0 0 16px; padding-left: 10px; border-left: 3px solid var(--brand-orange, #A16207); }
.block-text { font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap; }
.status-badge { font-size: 13px; font-weight: 600; padding: 4px 12px; border: 1px solid; border-radius: 999px; }
.info-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #f5f5f5;
	span:first-child { color: #898989; } span:last-child { font-weight: 500; }
}

/* 订单行 */
.line-section { padding: 16px 0; border-bottom: 1px solid #f0f0f0; &:last-child { border-bottom: none; }
	&__head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
}
.line-type-tag { font-size: 12px; font-weight: 600; color: var(--brand-orange, #A16207); background: #FAF2E0; padding: 3px 10px; border-radius: 999px; }
.line-status-tag { font-size: 12px; font-weight: 600; }
.line-dest { font-size: 15px; font-weight: 600; }
.line-date { font-size: 13px; color: #898989; }
.itinerary-days { margin: 12px 0; }
.day-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px dashed #f0f0f0;
	&__no { font-size: 13px; font-weight: 700; color: var(--brand-orange, #A16207); min-width: 50px; }
	&__title { font-size: 14px; font-weight: 500; display: block; }
	&__desc { font-size: 13px; color: #898989; display: block; margin-top: 2px; }
}
.assign-table { margin: 12px 0; border: 1px solid #eee; border-radius: 8px; overflow: hidden;
	&__head { display: grid; grid-template-columns: 1fr 60px 1fr 1fr 80px; gap: 4px; padding: 8px 12px; background: #f5f5f5; font-size: 12px; font-weight: 600; color: #898989; }
	&__row { display: grid; grid-template-columns: 1fr 60px 1fr 1fr 80px; gap: 4px; padding: 8px 12px; font-size: 13px; border-top: 1px solid #f0f0f0; }
}
.price-cell { color: var(--brand-orange, #A16207); font-weight: 600; text-align: right; }
.line-amount { margin-top: 12px; padding: 12px; background: #f5f5f5; border-radius: 8px; }
.amount-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px;
	span:first-child { color: #898989; }
	&--total { font-size: 18px; font-weight: 700; border-top: 2px solid #ddd; padding-top: 12px; margin-top: 4px; span:first-child { color: #191919; } }
}
.amount-val { color: var(--brand-orange, #A16207); font-weight: 600; &--lg { font-size: 20px; } }
.line-action { margin-top: 12px; text-align: right; }
.remaining-dialog { margin-top: 12px; padding: 16px; border: 1px solid var(--brand-orange, #A16207); border-radius: 8px; background: #FAF2E0;
	h3 { font-size: 16px; margin: 0 0 8px; } p { font-size: 14px; margin: 0 0 12px; }
}
.text-input { width: 100%; padding: 10px 14px; border: 1px solid #d6d0c0; border-radius: 8px; font-size: 14px; margin-bottom: 8px; box-sizing: border-box; }
.dialog-btns { display: flex; gap: 8px; }
.btn { padding: 10px 24px; font-size: 15px; font-weight: 600; border-radius: 8px; border: none; cursor: pointer;
	&--primary { background: var(--brand-orange, #A16207); color: #fff; &:hover { opacity: .9; } }
	&--danger { background: transparent; color: #dc2626; border: 1px solid #dc2626; &:hover { background: #fef2f2; } }
	&--ghost { background: transparent; color: #898989; border: 1px solid #d6d0c0; }
	&:disabled { opacity: .5; }
}
.ghost-btn { font-size: 14px; font-weight: 600; border-radius: 8px; padding: 8px 18px; background: transparent; color: var(--brand-orange, #A16207); border: 1px solid var(--brand-orange, #A16207); cursor: pointer; text-decoration: none; display: inline-block; }
.ghost-btn--sm { font-size: 13px; padding: 6px 14px; }
.empty { text-align: center; padding: 80px 20px; p { color: #898989; margin: 0 0 16px; } }
.sk-block { height: 120px; border-radius: 12px; background: #f5f5f5; &--lg { height: 200px; } }
@media (max-width: 720px) {
	.user-main { margin-left: 0; padding: 16px; }
	.assign-table__head, .assign-table__row { grid-template-columns: 1fr 50px 1fr; font-size: 12px; }
	.assign-table__head span:nth-child(4), .assign-table__head span:nth-child(5),
	.assign-table__row span:nth-child(4), .assign-table__row span:nth-child(5) { display: none; }
}
</style>
