<script setup lang="ts">
import { getFeaturedCases, type TourCase, tourCases } from '~/config/tour-cases'

definePageMeta({
	title: 'Customer Stories',
})

// SEO
const route = useRoute()
const { domain } = useRuntimeConfig().public
useSEO({
	routeKey: 'articleDetail',
	breadcrumbs: [
		{ name: 'Home', url: domain },
		{ name: 'Customer Stories', url: `${domain}${route.path}` },
	],
})

// 埋点
const { gtag } = useGtag()
gtag('event', 'screen_view', { screen_name: 'case-list' })

// ===== 数据 =====
const featuredCases = getFeaturedCases()

// ===== 筛选 + 排序状态 =====
const activeFilter = ref<string>('all')
const activeSort = ref<string>('latest')

const filterTabs = [
	{ key: 'all', labelKey: 'tour.caseList.filterAll' },
	{ key: 'business', labelKey: 'tour.caseList.filterBusiness' },
	{ key: 'family', labelKey: 'tour.caseList.filterFamily' },
	{ key: 'romantic', labelKey: 'tour.caseList.filterRomantic' },
	{ key: 'culture', labelKey: 'tour.caseList.filterCulture' },
	{ key: 'special', labelKey: 'tour.caseList.filterSpecial' },
	{ key: 'team', labelKey: 'tour.caseList.filterTeam' },
]

const sortTabs = [
	{ key: 'latest', labelKey: 'tour.caseList.sortLatest' },
	{ key: 'rating', labelKey: 'tour.caseList.sortRating' },
	{ key: 'daysAsc', labelKey: 'tour.caseList.sortDaysAsc' },
	{ key: 'daysDesc', labelKey: 'tour.caseList.sortDaysDesc' },
]

// 筛选 + 排序（computed 实现）
const filteredAndSortedCases = computed<TourCase[]>(() => {
	let list = tourCases
	// 筛选
	if (activeFilter.value !== 'all') {
		list = list.filter(c => c.type === activeFilter.value)
	}
	// 排序（拷贝避免影响源数组）
	const sorted = [...list]
	switch (activeSort.value) {
		case 'rating':
			sorted.sort((a, b) => b.rating - a.rating)
			break
		case 'daysAsc':
			sorted.sort((a, b) => a.days - b.days)
			break
		case 'daysDesc':
			sorted.sort((a, b) => b.days - a.days)
			break
		case 'latest':
		default:
			// 按 id 倒序（id 越大越新）
			sorted.sort((a, b) => b.id - a.id)
			break
	}
	return sorted
})

// type → 中文标签映射（用于卡片角标）
const typeLabelMap: Record<string, string> = {
	business: '商务',
	family: '家庭',
	romantic: '蜜月',
	culture: '文化',
	special: '特色',
	team: '团建',
}

// 数据横幅
const stats = [
	{ num: '5000+', labelKey: 'tour.caseList.statsReviews' },
	{ num: '98.6%', labelKey: 'tour.caseList.statsRating' },
	{ num: '200+', labelKey: 'tour.caseList.statsCities' },
	{ num: '50万+', labelKey: 'tour.caseList.statsDays' },
]

// 合作媒体占位
const mediaLogos = ['TripAdvisor', 'Lonely Planet', 'Forbes Travel', 'Condé Nast', 'Travel+Leisure']

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}

function destinationName(route: string) {
	// 从 route 提取主题作为占位图文字，取第一段
	return route.split('·')[0].trim() || route
}
</script>

<template>
	<div class="case-list-page">
		<!-- ① Hero + 数据横幅 -->
		<section class="case-list-hero">
			<div class="case-list-hero__bg"></div>
			<div class="case-list-hero__inner">
				<span class="case-list-hero__eyebrow">CUSTOMER STORIES</span>
				<h1 class="case-list-hero__title">
					{{ tr('tour.caseList.heroTitle', '客户真实案例分享') }}
				</h1>
				<p class="case-list-hero__subtitle">
					{{ tr('tour.caseList.heroSub', '他们的旅行故事，或许就是你的下一段旅程') }}
				</p>
			</div>
			<div class="case-list-stats">
				<div class="case-list-stats__inner">
					<div v-for="s in stats" :key="s.labelKey" class="case-list-stats__item">
						<span class="case-list-stats__num">{{ s.num }}</span>
						<span class="case-list-stats__label">{{ tr(s.labelKey, '') }}</span>
					</div>
				</div>
			</div>
		</section>

		<!-- ② 精选案例大卡片 -->
		<section class="case-list-featured">
			<div class="case-list-featured__inner">
				<h2 class="case-list-featured__heading">
					{{ tr('tour.caseList.featuredHeading', '每月精选') }}
				</h2>
				<p class="case-list-featured__sub">
					{{ tr('tour.caseList.heroSub', '真实订单 · 真实故事 · 真实体验') }}
				</p>

				<article
					v-for="c in featuredCases"
					:key="c.id"
					class="case-list-featured__card"
				>
					<!-- 左：渐变大图占位 -->
					<div class="case-list-featured__media">
						<span class="case-list-featured__media-tag">{{ tr('tour.caseList.featuredHeading', '精选') }}</span>
						<span class="case-list-featured__media-name">{{ destinationName(c.route) }}</span>
					</div>
					<!-- 右：Before/After 叙事 -->
					<div class="case-list-featured__body">
						<div class="case-list-featured__author">
							<div class="case-list-featured__avatar" :class="c.avatarCls">
								{{ c.avatar }}
							</div>
							<div class="case-list-featured__author-info">
								<p class="case-list-featured__name">
									{{ c.name }}
									<span class="case-list-featured__rating">★ {{ c.rating.toFixed(1) }}</span>
								</p>
								<p class="case-list-featured__author-meta">
									{{ c.meta }}
								</p>
							</div>
						</div>

						<p class="case-list-featured__route">
							{{ c.route }}
						</p>

						<div class="case-list-featured__narrative">
							<div class="case-list-featured__narrative-block">
								<span class="case-list-featured__narrative-label">
									{{ tr('tour.caseList.beforeLabel', 'Before') }}
								</span>
								<p class="case-list-featured__narrative-text">
									{{ c.beforeSharing }}
								</p>
							</div>
							<div class="case-list-featured__narrative-block case-list-featured__narrative-block--after">
								<span class="case-list-featured__narrative-label">
									{{ tr('tour.caseList.afterLabel', 'After') }}
								</span>
								<p class="case-list-featured__narrative-text">
									{{ c.afterSharing }}
								</p>
							</div>
						</div>

						<div class="case-list-featured__footer">
							<span class="case-list-featured__verified">
								<strong>✓</strong> {{ $t('tour.caseDetail.verifiedOrder') }} · {{ c.date }}
							</span>
							<NuxtLink :to="$path(`/case/${c.id}`)" class="case-list-featured__link">
								{{ tr('tour.caseList.viewStory', '查看完整故事') }} →
							</NuxtLink>
						</div>
					</div>
				</article>
			</div>
		</section>

		<!-- ③ 全部案例列表（筛选+排序） -->
		<section class="case-list-all">
			<div class="case-list-all__inner">
				<h2 class="case-list-all__heading">
					{{ tr('tour.caseList.heroTitle', '全部真实案例') }}
				</h2>

				<!-- 工具栏：筛选 + 排序 -->
				<div class="case-list-all__toolbar">
					<div class="case-list-all__filters">
						<button
							v-for="tab in filterTabs"
							:key="tab.key"
							class="case-list-all__filter"
							:class="{ 'case-list-all__filter--active': activeFilter === tab.key }"
							@click="activeFilter = tab.key"
						>
							{{ tr(tab.labelKey, tab.key) }}
						</button>
					</div>
					<div class="case-list-all__sorts">
						<span class="case-list-all__sort-label">排序：</span>
						<button
							v-for="s in sortTabs"
							:key="s.key"
							class="case-list-all__sort"
							:class="{ 'case-list-all__sort--active': activeSort === s.key }"
							@click="activeSort = s.key"
						>
							{{ tr(s.labelKey, s.key) }}
						</button>
					</div>
				</div>

				<!-- 卡片网格 -->
				<div v-if="filteredAndSortedCases.length" class="case-list-all__grid">
					<NuxtLink
						v-for="c in filteredAndSortedCases"
						:key="c.id"
						:to="$path(`/case/${c.id}`)"
						class="case-card"
					>
						<div class="case-card__media">
							<span class="case-card__type-tag">{{ typeLabelMap[c.type] }}</span>
							<span class="case-card__media-name">{{ destinationName(c.route) }}</span>
						</div>
						<div class="case-card__body">
							<div class="case-card__author">
								<div class="case-card__avatar" :class="c.avatarCls">
									{{ c.avatar }}
								</div>
								<div class="case-card__author-info">
									<p class="case-card__name">
										{{ c.name }}
									</p>
									<p class="case-card__meta">
										{{ c.meta }}
									</p>
								</div>
							</div>
							<p class="case-card__route">
								{{ destinationName(c.route) }}
								<span class="case-card__days">· {{ c.days }}天</span>
							</p>
							<p class="case-card__sharing">
								{{ c.sharing }}
							</p>
							<div class="case-card__footer">
								<div class="case-card__rating-wrap">
									<span class="case-card__stars">★★★★★</span>
									<span class="case-card__rating-num">{{ c.rating.toFixed(1) }}</span>
									<span class="case-card__verified">✓ {{ $t('tour.caseDetail.verifiedOrder') }}</span>
								</div>
								<span class="case-card__link">{{ tr('tour.caseList.viewStory', '查看') }} →</span>
							</div>
						</div>
					</NuxtLink>
				</div>
				<div v-else class="case-list-all__empty">
					{{ tr('tour.caseList.emptyHint', '暂无相关案例') }}
				</div>
			</div>
		</section>

		<!-- ④ 定制师说 -->
		<section class="case-list-planner">
			<div class="case-list-planner__inner">
				<h2 class="case-list-planner__heading">
					{{ tr('tour.caseList.plannerNotes', '定制师说') }}
				</h2>
				<div class="case-list-planner__card">
					<div class="case-list-planner__planner">
						<div class="case-list-planner__avatar">
							王
						</div>
						<div class="case-list-planner__planner-info">
							<p class="case-list-planner__planner-name">
								王规划师
							</p>
							<p class="case-list-planner__planner-meta">
								8年经验 · 擅长丝绸之路
							</p>
						</div>
					</div>
					<p class="case-list-planner__text">
						{{ tr('tour.caseList.plannerQuote', '每个客户的需求都是独一无二的。定制旅行不是把现成的行程卖给客户，而是先听懂他们的故事——为什么出发、和谁同行、期待怎样的回忆。张先生一家的丝绸之路，我们花了三天反复打磨节奏，就为了让孩子既不累又能真正触摸到千年文明。这份用心，是跟团游永远给不了的。') }}
					</p>
					<p class="case-list-planner__signature">
						— {{ tr('tour.caseList.plannerSignature', 'iswink 资深规划师团队') }}
					</p>
				</div>
			</div>
		</section>

		<!-- ⑤ 底部CTA + 社交信任 -->
		<section class="case-list-cta">
			<div class="case-list-cta__inner">
				<h2 class="case-list-cta__title">
					{{ tr('tour.caseList.bottomCtaTitle', '5000+ 位客户的共同选择') }}
				</h2>
				<p class="case-list-cta__desc">
					{{ tr('tour.caseList.bottomCtaDesc', '加入他们，开启你的专属旅程') }}
				</p>
				<NuxtLink :to="$path('/custom')" class="case-list-cta__btn">
					{{ tr('tour.cta.submit', '免费定制行程') }}
				</NuxtLink>
				<p class="case-list-cta__trust-label">
					{{ tr('tour.caseList.trustLabel', '权威媒体推荐') }}
				</p>
				<div class="case-list-cta__logos">
					<span v-for="logo in mediaLogos" :key="logo" class="case-list-cta__logo">{{ logo }}</span>
				</div>
			</div>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@import url('./case-list.scss');
</style>
