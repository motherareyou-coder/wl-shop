<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)
definePageMeta({ title: 'Escort Inquiry Details', showBread: true })
useSEO({ title: $t('travel.escort.seo'), noIndex: true })

const dayjs = useDayjs()
const { get: getEscort } = useEscortInquiryApi()
const { listByPreOrder } = useCommunicationLogApi()
const loading = ref(true)
const error = ref(false)
const detail = ref<any>()
const logs = ref<any[]>([])

async function load() {
	loading.value = true
	error.value = false
	try {
		detail.value = await getEscort(id)
		const preOrderId = detail.value?.preOrderId
		if (preOrderId)
			logs.value = (await listByPreOrder(preOrderId)) || []
	}
	catch { error.value = true }
	finally { loading.value = false }
}
await load()

const languageNeeds = computed(() => {
	try {
		return detail.value?.languageNeeds ? JSON.parse(detail.value.languageNeeds) : []
	}
	catch { return [] }
})
const serviceTypes = computed(() => {
	try {
		return detail.value?.serviceTypes ? JSON.parse(detail.value.serviceTypes) : []
	}
	catch { return [] }
})
function dateRange() {
	if (!detail.value)
		return ''
	const s = detail.value.startDate ? dayjs(detail.value.startDate).format('YYYY-MM-DD') : '--'
	const e = detail.value.endDate ? dayjs(detail.value.endDate).format('YYYY-MM-DD') : ''
	return e ? `${s} ~ ${e}` : s
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
				<section v-else-if="detail" class="info-block">
					<header class="info-block__header">
						<h1>{{ detail.destination }}</h1>
						<NuxtLink class="ghost-btn" :to="$path('/user/my-travel?tab=escort')">
							{{ $t('travel.common.backToList') }}
						</NuxtLink>
					</header>
					<dl class="info-grid">
						<div class="info-grid__item">
							<dt>{{ $t('travel.inquiry.destination') }}</dt><dd>{{ detail.destination }}</dd>
						</div>
						<div class="info-grid__item">
							<dt>{{ $t('travel.escort.serviceDate') }}</dt><dd>{{ dateRange() }}</dd>
						</div>
						<div class="info-grid__item">
							<dt>{{ $t('travel.inquiry.travelers') }}</dt><dd>{{ detail.travelerCount || 1 }}{{ $t('travel.inquiry.people') }}</dd>
						</div>
						<div class="info-grid__item">
							<dt>{{ $t('travel.escort.itinerary') }}</dt><dd>{{ detail.isOwnItinerary ? $t('travel.escort.ownItinerary') : $t('travel.escort.needArrange') }}</dd>
						</div>
					</dl>
					<div v-if="languageNeeds.length" class="info-row">
						<span class="info-row__label">{{ $t('travel.escort.languageNeeds') }}</span>
						<div class="info-row__tags">
							<span v-for="(l, i) in languageNeeds" :key="i" class="info-tag">{{ l }}</span>
						</div>
					</div>
					<div v-if="serviceTypes.length" class="info-row">
						<span class="info-row__label">{{ $t('travel.escort.serviceType') }}</span>
						<div class="info-row__tags">
							<span v-for="(s, i) in serviceTypes" :key="i" class="info-tag">{{ s }}</span>
						</div>
					</div>
					<div v-if="detail.ownItineraryDesc" class="info-row">
						<span class="info-row__label">{{ $t('travel.escort.itineraryDesc') }}</span>
						<p class="info-row__text">
							{{ detail.ownItineraryDesc }}
						</p>
					</div>
					<div v-if="detail.specialRequirements" class="info-row">
						<span class="info-row__label">{{ $t('travel.escort.specialReq') }}</span>
						<p class="info-row__text">
							{{ detail.specialRequirements }}
						</p>
					</div>
				</section>

				<!-- 关联预订单 -->
				<section v-if="detail.preOrderId" class="info-block">
					<header class="info-block__header">
						<h2 class="info-block__title info-block__title--sm">
							{{ $t('travel.common.relatedPreOrder') }}
						</h2>
					</header>
					<NuxtLink class="related-link" :to="$path(`/user/preorder/${detail.preOrderId}`)">
						<span>{{ $t('travel.common.viewPreOrderDetail') }}</span><span>→</span>
					</NuxtLink>
				</section>

				<!-- 沟通记录 -->
				<section v-if="logs.length" class="info-block">
					<header class="info-block__header">
						<h2 class="info-block__title info-block__title--sm">
							{{ $t('travel.common.communicationLog') }}
						</h2>
					</header>
					<TravelTimeline :logs="logs" />
				</section>
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
.info-block { background: var(--background-white); border: 1px solid #eee; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.05);
	&__header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 20px; h1 { font-size: 22px; font-weight: 700; color: var(--text-base); margin: 0; } }
}
.info-grid { margin: 0; display: grid; grid-template-columns: repeat(2,1fr); gap: 18px 24px; dt { font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; } dd { margin: 0; font-size: 16px; font-weight: 500; } }
.info-row { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; &__label { display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; } &__tags { display: flex; flex-wrap: wrap; gap: 8px; } &__text { margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-wrap; } }
.info-tag { font-size: 12px; color: var(--brand-orange); background: var(--background-primary-light, #FAF2E0); border: 1px solid var(--brand-orange); border-radius: 999px; padding: 3px 10px; }
.ghost-btn { font-size: 14px; font-weight: 600; border-radius: 8px; padding: 8px 18px; background: transparent; color: var(--brand-orange); border: 1px solid var(--brand-orange); cursor: pointer; text-decoration: none; }
.empty { text-align: center; padding: 80px 20px; p { color: var(--text-secondary); margin: 0 0 16px; } }
.sk-block { height: 120px; border-radius: 12px; background: var(--background-light-grey); }
.sk-block--lg { height: 180px; }
@media (max-width: 720px) {
	.user-main { margin-left: 0; padding: 16px; }
	.info-grid { grid-template-columns: 1fr; }
}
.related-link { display: flex; justify-content: space-between; padding: 14px 16px; border: 1px solid var(--brand-orange, #A16207); border-radius: 8px; color: var(--brand-orange, #A16207); font-weight: 600; text-decoration: none; transition: background .2s;
	&:hover { background: var(--background-primary-light, #FAF2E0); }
}
.info-block__title--sm { font-size: 18px; }
</style>
