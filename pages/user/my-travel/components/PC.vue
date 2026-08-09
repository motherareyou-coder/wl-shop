<script setup lang="ts">
import { fmtYuan, ORDER_STATUS_NUM_MAP, PRE_ORDER_STATUS_NUM_MAP } from '~/types/travel'

const route = useRoute()
const dayjs = useDayjs()

// 4 个分类 tab，复用 orderlist 的 .order-list__nav .title 样式
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

// ===== 旅行诉求 =====
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

// ===== 随行诉求 =====
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

// ===== 预订单 =====
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

// ===== 旅行订单 =====
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

// 初始加载第一个 tab
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
	return d ? dayjs(d).format('YYYY-MM-DD HH:mm:ss') : '--'
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

// 旅行诉求 CRM 状态
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

// 状态颜色 → orderlist 状态色一致映射
function statusClass(color: string) {
	if (color === '#A16207')
		return 'paying' // 待处理/进行中（金）
	if (color === '#16a34a')
		return 'paid' // 已完成/已确认（绿）
	if (color === '#dc2626')
		return 'close' // 已取消（红）
	if (color === '#2563eb')
		return 'ship' // 进行中（蓝）
	if (color === '#898989')
		return 'close' // 已关闭（灰）
	return ''
}
</script>

<template>
	<div class="user-order-list miv4 mb-10">
		<div class="user-layout__container miv4">
			<div class="user-main">
				<section>
					<div class="user-order-list-container">
						<h1 class="user-order-list-container_title">
							{{ $t('My Travel Service') }}
						</h1>

						<!-- 顶部一级导航（与 orderlist 的 .tag-nav 一致） -->
						<div class="user-order-list miv4">
							<div class="tag-nav">
								<li class="active">
									{{ $t('My Travel Service') }}
								</li>
							</div>
						</div>

						<!-- 4 个分类 tab（复用 orderlist 的 .order-list__nav .title 样式） -->
						<ul class="order-list__nav">
							<li
								v-for="option in tabs"
								:key="option.value"
								class="title"
								@click="onTabChange(option.value)"
							>
								<span :class="{ 'title-active': activeTab === option.value }">
									{{ $t(option.label) }}
								</span>
							</li>
						</ul>

						<!-- Tab 1: 旅行诉求 -->
						<ul v-if="activeTab === 'travel'">
							<div v-if="travelLoading" class="travel-loading">
								{{ $t('Loading') }}
							</div>
							<div v-else-if="!travelList.length" class="order-list--no-order travel-empty">
								<p>{{ $t('No travel inquiries yet') }}</p>
								<nuxt-link :to="$path('/custom')">
									<el-button type="info" class="travel-empty__btn">
										{{ $t('Submit a Request') }}
									</el-button>
								</nuxt-link>
							</div>
							<section v-for="item in travelList" v-else :key="item.id">
								<li
									class="order-item"
									:class="`order-item--${statusClass(crmStatus(item.status).color)}`"
								>
									<div class="order-item-header">
										<p class="order-item-header--title show-tag">
											{{ crmStatus(item.status).label }}
										</p>
										<p class="info">
											{{ item.destination || '--' }}
										</p>
									</div>
									<div class="order-item-info info">
										<ul class="info-left">
											<li class="info-left_time">
												{{ fmtDate(item.createTime) }}
											</li>
											<li class="info-left-order-id order-id">
												{{ $t('Travelers') }}: {{ item.travelerCount || 1 }}
											</li>
											<li class="info-left-order-id order-id">
												{{ dateRange(item.startDate, item.endDate) }}
											</li>
										</ul>
									</div>
									<div class="order-item-goodslist goods-list">
										<div class="goods-list-order-btn">
											<nuxt-link
												:to="$path(`/user/travel/${item.id}`)"
												class="goods-list-order-btn--white order-btn"
											>
												{{ $t('View Details') }}
											</nuxt-link>
										</div>
										<div class="goods-list-gooods-info">
											<div class="goods-list-gooods-info__container my-2">
												<div class="goods-list-gooods-info__wrap">
													<div class="goods-list-gooods-info__information information">
														<div>{{ item.destination || '--' }}</div>
														<div v-if="item.budget">
															{{ item.budget }}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</li>
							</section>
						</ul>

						<!-- Tab 2: 随行诉求 -->
						<ul v-if="activeTab === 'escort'">
							<div v-if="escortLoading" class="travel-loading">
								{{ $t('Loading') }}
							</div>
							<div v-else-if="!escortList.length" class="order-list--no-order travel-empty">
								<p>{{ $t('No companion inquiries yet') }}</p>
								<nuxt-link :to="$path('/companion')">
									<el-button type="info" class="travel-empty__btn">
										{{ $t('Book a Companion') }}
									</el-button>
								</nuxt-link>
							</div>
							<section v-for="item in escortList" v-else :key="item.id">
								<li class="order-item">
									<div class="order-item-header">
										<p class="order-item-header--title show-tag">
											{{ item.destination || '--' }}
										</p>
										<p class="info">
											{{ dateRange(item.startDate, item.endDate) }}
										</p>
									</div>
									<div class="order-item-info info">
										<ul class="info-left">
											<li class="info-left_time">
												{{ fmtDate(item.createTime) }}
											</li>
											<li class="info-left-order-id order-id">
												{{ $t('Travelers') }}: {{ item.travelerCount || 1 }}
											</li>
										</ul>
									</div>
									<div class="order-item-goodslist goods-list">
										<div class="goods-list-order-btn">
											<nuxt-link
												:to="$path(`/user/escort/${item.id}`)"
												class="goods-list-order-btn--white order-btn"
											>
												{{ $t('View Details') }}
											</nuxt-link>
										</div>
									</div>
								</li>
							</section>
						</ul>

						<!-- Tab 3: 预订单 -->
						<ul v-if="activeTab === 'preorder'">
							<div v-if="preOrderLoading" class="travel-loading">
								{{ $t('Loading') }}
							</div>
							<div v-else-if="!preOrderList.length" class="order-list--no-order travel-empty">
								<p>{{ $t('No pre-orders yet') }}</p>
								<nuxt-link :to="$path('/custom')">
									<el-button type="info" class="travel-empty__btn">
										{{ $t('Submit a Request') }}
									</el-button>
								</nuxt-link>
							</div>
							<section v-for="item in preOrderList" v-else :key="item.id">
								<li
									class="order-item"
									:class="`order-item--${statusClass(poStatus(Number(item.status)).color)}`"
								>
									<div class="order-item-header">
										<p class="order-item-header--title show-tag">
											{{ poStatus(Number(item.status)).label }}
										</p>
										<p class="info">
											{{ $t('Pre-Order') }} {{ item.no || `#${item.id}` }}
										</p>
									</div>
									<div class="order-item-info info">
										<ul class="info-left">
											<li class="info-left_time">
												{{ fmtDate(item.createTime) }}
											</li>
										</ul>
										<div class="info-right">
											<div class="info__detail">
												<span class="info-right-total__title">
													{{ $t('Total') }}:
												</span>
												<span class="info-right-total__num">
													{{ fmtYuan(item.totalAmount) }}
												</span>
											</div>
										</div>
									</div>
									<div class="order-item-goodslist goods-list">
										<div class="goods-list-order-btn">
											<nuxt-link
												:to="$path(`/user/preorder/${item.id}`)"
												class="goods-list-order-btn--white order-btn"
											>
												{{ $t('View Details') }}
											</nuxt-link>
										</div>
									</div>
								</li>
							</section>
						</ul>

						<!-- Tab 4: 旅行订单 -->
						<ul v-if="activeTab === 'order'">
							<div v-if="orderLoading" class="travel-loading">
								{{ $t('Loading') }}
							</div>
							<div v-else-if="!orderList.length" class="order-list--no-order travel-empty">
								<p>{{ $t('No travel orders yet') }}</p>
								<nuxt-link :to="$path('/custom')">
									<el-button type="info" class="travel-empty__btn">
										{{ $t('Submit a Request') }}
									</el-button>
								</nuxt-link>
							</div>
							<section v-for="item in orderList" v-else :key="item.id">
								<li
									class="order-item"
									:class="`order-item--${statusClass(ordStatus(Number(item.status)).color)}`"
								>
									<div class="order-item-header">
										<p class="order-item-header--title show-tag">
											{{ ordStatus(Number(item.status)).label }}
										</p>
										<p class="info">
											{{ $t('Travel Order') }} {{ item.orderNo || `#${item.id}` }}
										</p>
									</div>
									<div class="order-item-info info">
										<ul class="info-left">
											<li class="info-left_time">
												{{ fmtDate(item.createTime) }}
											</li>
										</ul>
										<div class="info-right">
											<div class="info__detail">
												<span class="info-right-total__title">
													{{ $t('Total') }}:
												</span>
												<span class="info-right-total__num">
													{{ fmtYuan(item.totalAmount) }}
												</span>
											</div>
										</div>
									</div>
									<div class="order-item-goodslist goods-list">
										<div class="goods-list-order-btn">
											<nuxt-link
												:to="$path(`/user/travel-order/${item.id}`)"
												class="goods-list-order-btn--white order-btn"
											>
												{{ $t('View Details') }}
											</nuxt-link>
										</div>
									</div>
								</li>
							</section>
						</ul>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import url('./PC.scss');
</style>
