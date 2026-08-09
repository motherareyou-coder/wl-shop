<script setup lang="ts">
import { fmtYuan, ORDER_STATUS_NUM_MAP, PRE_ORDER_STATUS_NUM_MAP } from '~/types/travel'

const route = useRoute()
const dayjs = useDayjs()

const tabs = [
	{ value: 'travel', label: 'Travel Inquiry' },
	{ value: 'escort', label: 'Escort Inquiry' },
	{ value: 'preorder', label: 'Pre-Order' },
	{ value: 'order', label: 'Travel Order' },
] as const
type TabValue = (typeof tabs)[number]['value']

const activeTab = ref<TabValue>((route.query.tab as TabValue) || 'travel')

const { myList } = useTravelInquiryApi()
const { myPage: escortPage } = useEscortInquiryApi()
const { myPage: preOrderPage } = usePreOrderApi()
const { myPage: orderPage } = useTravelOrderApi()

const travelList = ref<any[]>([])
const travelLoading = ref(false)
const travelLoaded = ref(false)
async function loadTravel() {
	travelLoading.value = true
	try {
		travelList.value = (await myList()) || []
	}
	catch {
		travelList.value = []
	}
	finally {
		travelLoading.value = false
		travelLoaded.value = true
	}
}

const escortList = ref<any[]>([])
const escortLoading = ref(false)
const escortLoaded = ref(false)
async function loadEscort() {
	escortLoading.value = true
	try {
		const res = await escortPage({ pageNo: 1, pageSize: 20 })
		escortList.value = res?.list || []
	}
	catch {
		escortList.value = []
	}
	finally {
		escortLoading.value = false
		escortLoaded.value = true
	}
}

const preOrderList = ref<any[]>([])
const preOrderLoading = ref(false)
const preOrderLoaded = ref(false)
async function loadPreOrder() {
	preOrderLoading.value = true
	try {
		const res = await preOrderPage({ pageNo: 1, pageSize: 20 })
		preOrderList.value = res?.list || []
	}
	catch {
		preOrderList.value = []
	}
	finally {
		preOrderLoading.value = false
		preOrderLoaded.value = true
	}
}

const orderList = ref<any[]>([])
const orderLoading = ref(false)
const orderLoaded = ref(false)
async function loadOrder() {
	orderLoading.value = true
	try {
		const res = await orderPage({ pageNo: 1, pageSize: 20 })
		orderList.value = res?.list || []
	}
	catch {
		orderList.value = []
	}
	finally {
		orderLoading.value = false
		orderLoaded.value = true
	}
}

await loadTravel()

function onTabChange(v: TabValue) {
	activeTab.value = v
	if (v === 'escort' && !escortLoaded.value)
		loadEscort()
	else if (v === 'preorder' && !preOrderLoaded.value)
		loadPreOrder()
	else if (v === 'order' && !orderLoaded.value)
		loadOrder()
}

function fmtDate(d?: string) {
	return d ? dayjs(d).format('YYYY-MM-DD') : '--'
}
function dateRange(s?: string, e?: string) {
	if (!s && !e)
		return '--'
	const fmt = (d?: string) => (d ? dayjs(d).format('YYYY-MM-DD') : '')
	return s && e ? `${fmt(s)} ~ ${fmt(e)}` : fmt(s || e)
}
function poStatus(s: number) {
	return { label: $t(`travel.status.po_${s}`), color: PRE_ORDER_STATUS_NUM_MAP[s]?.color || '#898989' }
}
function ordStatus(s: number) {
	return { label: $t(`travel.status.ord_${s}`), color: ORDER_STATUS_NUM_MAP[s]?.color || '#898989' }
}

const crmStatusColorMap: Record<string, string> = {
	NEW: '#A16207',
	CONTACTING: '#2563eb',
	PRE_ORDER_CREATED: '#16a34a',
	CLOSED: '#898989',
}
const crmStatusKeyMap: Record<string, string> = {
	NEW: 'new',
	CONTACTING: 'contacting',
	PRE_ORDER_CREATED: 'preOrderCreated',
	CLOSED: 'closed',
}
function crmStatus(s?: string) {
	if (!s)
		return { label: $t('travel.status.pending'), color: '#898989' }
	return { label: crmStatusKeyMap[s] ? $t(`travel.status.${crmStatusKeyMap[s]}`) : s, color: crmStatusColorMap[s] || '#898989' }
}
</script>

<template>
	<div class="order-list-wrapper--mobile">
		<!-- 顶部 sticky tab 导航，复用 orderlist 的 .order-list-header--mobile 样式 -->
		<div class="order-list-header--mobile overflow-y-auto">
			<ul class="flex my-1">
				<li
					v-for="option in tabs"
					:key="option.value"
					class="whitespace-nowrap"
					:class="{ 'is-active': activeTab === option.value }"
					@click="onTabChange(option.value)"
				>
					{{ $t(option.label) }}
				</li>
			</ul>
		</div>

		<div class="order-list">
			<!-- ====== 旅行诉求 ====== -->
			<template v-if="activeTab === 'travel'">
				<div v-if="travelLoading" class="travel-m-loading">
					{{ $t('Loading') }}
				</div>
				<div v-else-if="!travelList.length" class="travel-m-empty">
					<p>{{ $t('No travel inquiries yet') }}</p>
					<nuxt-link :to="$path('/custom')">
						<el-button type="info" class="travel-empty__btn">
							{{ $t('Submit a Request') }}
						</el-button>
					</nuxt-link>
				</div>
				<li v-for="item in travelList" v-else :key="item.id" class="order-item">
					<div class="order-item__header">
						<div class="order-item__header__left">
							<div class="order-item__time">
								{{ fmtDate(item.createTime) }}
							</div>
						</div>
						<div class="order-item__header__right">
							<span class="order-item__status" :style="{ color: crmStatus(item.status).color }">
								{{ crmStatus(item.status).label }}
							</span>
						</div>
					</div>
					<div class="order-item__content">
						<nuxt-link class="order-item__link" :to="$path(`/user/travel/${item.id}`)">
							<div class="commodity-item">
								<div class="commodity-item__info">
									<p>{{ item.destination || '--' }}</p>
									<p class="travel-m-sub">
										{{ dateRange(item.startDate, item.endDate) }} · {{ $t('Travelers') }} {{ item.travelerCount || 1 }}
									</p>
								</div>
							</div>
						</nuxt-link>
					</div>
					<div class="order-item__footer">
						<div class="order-item__footer__left"></div>
						<div class="order-item__footer__right">
							<nuxt-link :to="$path(`/user/travel/${item.id}`)">
								<el-button class="order-item__button order-item__button--normal" size="small">
									{{ $t('View Details') }}
								</el-button>
							</nuxt-link>
						</div>
					</div>
				</li>
			</template>

			<!-- ====== 随行诉求 ====== -->
			<template v-if="activeTab === 'escort'">
				<div v-if="escortLoading" class="travel-m-loading">
					{{ $t('Loading') }}
				</div>
				<div v-else-if="!escortList.length" class="travel-m-empty">
					<p>{{ $t('No companion inquiries yet') }}</p>
					<nuxt-link :to="$path('/companion')">
						<el-button type="info" class="travel-empty__btn">
							{{ $t('Book a Companion') }}
						</el-button>
					</nuxt-link>
				</div>
				<li v-for="item in escortList" v-else :key="item.id" class="order-item">
					<div class="order-item__header">
						<div class="order-item__header__left">
							<div class="order-item__time">
								{{ fmtDate(item.createTime) }}
							</div>
						</div>
					</div>
					<div class="order-item__content">
						<nuxt-link class="order-item__link" :to="$path(`/user/escort/${item.id}`)">
							<div class="commodity-item">
								<div class="commodity-item__info">
									<p>{{ item.destination || '--' }}</p>
									<p class="travel-m-sub">
										{{ dateRange(item.startDate, item.endDate) }} · {{ $t('Travelers') }} {{ item.travelerCount || 1 }}
									</p>
								</div>
							</div>
						</nuxt-link>
					</div>
					<div class="order-item__footer">
						<div class="order-item__footer__left"></div>
						<div class="order-item__footer__right">
							<nuxt-link :to="$path(`/user/escort/${item.id}`)">
								<el-button class="order-item__button order-item__button--normal" size="small">
									{{ $t('View Details') }}
								</el-button>
							</nuxt-link>
						</div>
					</div>
				</li>
			</template>

			<!-- ====== 预订单 ====== -->
			<template v-if="activeTab === 'preorder'">
				<div v-if="preOrderLoading" class="travel-m-loading">
					{{ $t('Loading') }}
				</div>
				<div v-else-if="!preOrderList.length" class="travel-m-empty">
					<p>{{ $t('No pre-orders yet') }}</p>
					<nuxt-link :to="$path('/custom')">
						<el-button type="info" class="travel-empty__btn">
							{{ $t('Submit a Request') }}
						</el-button>
					</nuxt-link>
				</div>
				<li v-for="item in preOrderList" v-else :key="item.id" class="order-item">
					<div class="order-item__header">
						<div class="order-item__header__left">
							<div class="order-item__time">
								{{ $t('Pre-Order') }} {{ item.no || `#${item.id}` }}
							</div>
						</div>
						<div class="order-item__header__right">
							<span class="order-item__status" :style="{ color: poStatus(Number(item.status)).color }">
								{{ poStatus(Number(item.status)).label }}
							</span>
						</div>
					</div>
					<div class="order-item__content">
						<nuxt-link class="order-item__link" :to="$path(`/user/preorder/${item.id}`)">
							<div class="commodity-item">
								<div class="commodity-item__info">
									<p class="travel-m-sub">
										{{ fmtDate(item.createTime) }}
									</p>
								</div>
							</div>
						</nuxt-link>
					</div>
					<div class="order-item__footer">
						<div class="order-item__footer__left">
							<span class="order-item__totalprice">
								{{ $t('Total') }} {{ fmtYuan(item.totalAmount) }}
							</span>
						</div>
						<div class="order-item__footer__right">
							<nuxt-link :to="$path(`/user/preorder/${item.id}`)">
								<el-button class="order-item__button order-item__button--normal" size="small">
									{{ $t('View Details') }}
								</el-button>
							</nuxt-link>
						</div>
					</div>
				</li>
			</template>

			<!-- ====== 旅行订单 ====== -->
			<template v-if="activeTab === 'order'">
				<div v-if="orderLoading" class="travel-m-loading">
					{{ $t('Loading') }}
				</div>
				<div v-else-if="!orderList.length" class="travel-m-empty">
					<p>{{ $t('No travel orders yet') }}</p>
					<nuxt-link :to="$path('/custom')">
						<el-button type="info" class="travel-empty__btn">
							{{ $t('Submit a Request') }}
						</el-button>
					</nuxt-link>
				</div>
				<li v-for="item in orderList" v-else :key="item.id" class="order-item">
					<div class="order-item__header">
						<div class="order-item__header__left">
							<div class="order-item__time">
								{{ $t('Travel Order') }} {{ item.orderNo || `#${item.id}` }}
							</div>
						</div>
						<div class="order-item__header__right">
							<span class="order-item__status" :style="{ color: ordStatus(Number(item.status)).color }">
								{{ ordStatus(Number(item.status)).label }}
							</span>
						</div>
					</div>
					<div class="order-item__content">
						<nuxt-link class="order-item__link" :to="$path(`/user/travel-order/${item.id}`)">
							<div class="commodity-item">
								<div class="commodity-item__info">
									<p class="travel-m-sub">
										{{ fmtDate(item.createTime) }}
									</p>
								</div>
							</div>
						</nuxt-link>
					</div>
					<div class="order-item__footer">
						<div class="order-item__footer__left">
							<span class="order-item__totalprice">
								{{ $t('Total') }} {{ fmtYuan(item.totalAmount) }}
							</span>
						</div>
						<div class="order-item__footer__right">
							<nuxt-link :to="$path(`/user/travel-order/${item.id}`)">
								<el-button class="order-item__button order-item__button--normal" size="small">
									{{ $t('View Details') }}
								</el-button>
							</nuxt-link>
						</div>
					</div>
				</li>
			</template>
		</div>
	</div>
</template>

<style lang="scss">
@import url('./Mobile.scss');
.order-list-header--mobile {
	position: sticky;
	top: var(--header-height);
	background: #fff;
	z-index: 20;
	margin-top: -2px;
	li {
		margin: 10px 16px;
	}
	.is-active {
		color: var(--text-primary);
	}
}
</style>
