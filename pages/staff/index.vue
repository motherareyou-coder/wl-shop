<script setup lang="ts">
import { tourStaff, filterStaff, type TourStaff } from '~/config/tour-staff'

defineOptions({ name: 'StaffList' })
definePageMeta({ title: 'Service Team' })

// SEO
const route = useRoute()
const { domain } = useRuntimeConfig().public
useSEO({
	routeKey: 'articleDetail',
	breadcrumbs: [
		{ name: 'Home', url: domain },
		{ name: 'Service Team', url: `${domain}${route.path}` },
	],
})

// 埋点
const { gtag } = useGtag()
gtag('event', 'screen_view', { screen_name: 'staff-list' })

// ===== 筛选状态 =====
const activeCategory = ref('all')
const activeLanguage = ref('all')
const searchQuery = ref('')

// 类别选项（value 为传给 filterStaff 的值）
const categoryOptions = [
	{ label: '全部', value: 'all' },
	{ label: '商务陪同', value: 'business' },
	{ label: '文化导览', value: 'culture' },
	{ label: '惊喜策划', value: 'special' },
	{ label: '多语种', value: 'multilingual' },
	{ label: '商务礼仪', value: 'etiquette' },
]

const languageOptions = [
	{ label: '所有语言', value: 'all' },
	{ label: '中文', value: '中文' },
	{ label: '英语', value: '英语' },
	{ label: '日语', value: '日语' },
	{ label: '韩语', value: '韩语' },
]

// 多语种 / 商务礼仪 不在 category 字段，需特殊处理
const filteredStaff = computed<TourStaff[]>(() => {
	let list: TourStaff[]

	if (activeCategory.value === 'multilingual') {
		// 多语种：languages 数量 > 1
		list = tourStaff.filter(s => s.languages.length > 1)
	}
	else if (activeCategory.value === 'etiquette') {
		// 商务礼仪：映射到 business
		list = filterStaff({ category: 'business' })
	}
	else {
		list = filterStaff({ category: activeCategory.value })
	}

	// 语言筛选
	if (activeLanguage.value !== 'all') {
		list = list.filter(s => s.languages.includes(activeLanguage.value))
	}

	// 搜索
	if (searchQuery.value) {
		const q = searchQuery.value.toLowerCase()
		list = list.filter(s =>
			s.name.toLowerCase().includes(q)
			|| s.role.toLowerCase().includes(q)
			|| s.specialties.some(sp => sp.toLowerCase().includes(q))
			|| s.cities.some(c => c.toLowerCase().includes(q))
			|| s.skills.some(sk => sk.toLowerCase().includes(q)),
		)
	}

	return list
})

// ===== 数据徽章 =====
const avgRating = computed(() => {
	const sum = tourStaff.reduce((acc, s) => acc + s.rating, 0)
	return (sum / tourStaff.length).toFixed(1)
})
const totalOrders = computed(() => tourStaff.reduce((acc, s) => acc + s.orders, 0))
const avgYears = computed(() => {
	const sum = tourStaff.reduce((acc, s) => acc + s.years, 0)
	return Math.round(sum / tourStaff.length)
})

const heroBadges = computed(() => [
	{ num: avgRating.value, label: '平均评分' },
	{ num: `${totalOrders.value}+`, label: '累计服务' },
	{ num: `${avgYears.value}年`, label: '平均经验' },
	{ num: '100%', label: '认证通过' },
])

// ===== 团队实力 =====
const strengths = [
	{
		num: '01',
		title: '5轮严格筛选认证',
		items: ['简历初筛 & 资质审核', '专业面试 & 实操考核', '背景调查 & 信用核验', '试服务 & 客户评价'],
	},
	{
		num: '02',
		title: '持续在职专业培训',
		items: ['每月文化知识更新', '商务礼仪专项培训', '应急处理 & 安全演练', '语言能力持续精进'],
	},
	{
		num: '03',
		title: '客户驱动评价体系',
		items: ['每单结束即时评价', '评分透明公开展示', '末位淘汰优胜劣汰', '定期复盘优化服务'],
	},
	{
		num: '04',
		title: '隐私保护服务承诺',
		items: ['客户信息严格保密', '行程细节加密存储', '签署保密协议', '服务后数据及时清理'],
	},
]

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<div class="staff-list-page">
		<!-- ① Hero + 团队理念 -->
		<section class="staff-list-hero">
			<div class="staff-list-hero__bg" />
			<div class="staff-list-hero__inner">
				<h1 class="staff-list-hero__title">
					{{ tr('tour.staffList.heroTitle', '专属服务团队') }}
				</h1>
				<p class="staff-list-hero__subtitle">
					{{ tr('tour.staffList.heroSub', '每一位陪伴师都经过严格筛选与专业培训') }}
				</p>
				<div class="staff-list-hero__badges">
					<span
						v-for="badge in heroBadges"
						:key="badge.label"
						class="staff-list-hero__badge"
					>
						<strong>{{ badge.num }}</strong> {{ badge.label }}
					</span>
				</div>
				<div class="staff-list-hero__philosophy">
					<p class="staff-list-hero__philosophy-text">
						{{ tr('tour.staffList.philosophy', '我们相信，好的旅行体验离不开好的人。每一位陪伴师都经过5轮筛选+持续培训，只为给您最专业的旅行陪伴。') }}
					</p>
				</div>
			</div>
		</section>

		<!-- ② 多维筛选 + 搜索 -->
		<section class="staff-list-filter">
			<div class="staff-list-filter__inner">
				<div class="staff-list-filter__row">
					<span class="staff-list-filter__label">类别</span>
					<div class="staff-list-filter__tags">
						<button
							v-for="cat in categoryOptions"
							:key="cat.value"
							class="staff-list-filter__tag"
							:class="{ 'staff-list-filter__tag--active': activeCategory === cat.value }"
							@click="activeCategory = cat.value"
						>
							{{ cat.label }}
						</button>
					</div>
				</div>
				<div class="staff-list-filter__row">
					<span class="staff-list-filter__label">语言</span>
					<div class="staff-list-filter__tags">
						<button
							v-for="lang in languageOptions"
							:key="lang.value"
							class="staff-list-filter__tag"
							:class="{ 'staff-list-filter__tag--active': activeLanguage === lang.value }"
							@click="activeLanguage = lang.value"
						>
							{{ lang.label }}
						</button>
					</div>
					<div class="staff-list-filter__search">
						<Icon name="icon:search" class="staff-list-filter__search-icon" />
						<input
							v-model="searchQuery"
							class="staff-list-filter__search-input"
							:placeholder="tr('tour.staffList.searchPlaceholder', '搜索姓名 / 技能 / 城市')"
						>
					</div>
				</div>
				<p class="staff-list-filter__count">
					共找到 <strong>{{ filteredStaff.length }}</strong> 位陪伴师
				</p>
			</div>
		</section>

		<!-- ③ 团队成员丰富卡片 -->
		<section class="staff-list-grid-section">
			<div class="staff-list-grid-section__inner">
				<div v-if="filteredStaff.length === 0" class="staff-list-grid-section__empty">
					<div class="staff-list-grid-section__empty-icon">
						<Icon name="icon:user" />
					</div>
					<p class="staff-list-grid-section__empty-text">
						{{ tr('tour.staffList.empty', '没有找到符合条件的陪伴师，试试调整筛选条件吧') }}
					</p>
				</div>
				<div v-else class="staff-list-grid">
					<article
						v-for="staff in filteredStaff"
						:key="staff.id"
						class="staff-card"
					>
						<!-- 头部：头像 + 评分 -->
						<div class="staff-card__top">
							<div class="staff-card__avatar">
								<Icon name="icon:user" />
							</div>
							<span class="staff-card__rating-badge">★ {{ staff.rating }}</span>
						</div>
						<!-- 主体 -->
						<div class="staff-card__body">
							<h3 class="staff-card__name">
								{{ staff.name }}
							</h3>
							<p class="staff-card__role">
								{{ staff.years }}年经验 · {{ staff.cities[0] }}
							</p>
							<div class="staff-card__meta">
								<span class="staff-card__meta-stars">★★★★★</span>
								<span class="staff-card__meta-rating">{{ staff.rating }}</span>
								<span class="staff-card__meta-dot">·</span>
								<span class="staff-card__meta-orders">{{ staff.orders }}单</span>
							</div>
							<!-- 技能标签 -->
							<div class="staff-card__skills">
								<span
									v-for="skill in staff.skills"
									:key="skill"
									class="staff-card__skill"
								>{{ skill }}</span>
							</div>
							<!-- 擅长目的地 -->
							<div class="staff-card__info-row">
								<span class="staff-card__info-row-icon">📍</span>
								<span class="staff-card__info-row-label">擅长：</span>
								<span class="staff-card__info-row-value">{{ staff.cities.join('、') }}</span>
							</div>
							<!-- 语言能力 -->
							<div class="staff-card__info-row">
								<span class="staff-card__info-row-icon">🗣️</span>
								<span class="staff-card__info-row-label">语言：</span>
								<span class="staff-card__info-row-value">{{ staff.languages.join('、') }}</span>
							</div>
							<!-- bio 摘要 -->
							<p class="staff-card__bio">
								{{ staff.bio }}
							</p>
							<!-- 最新客户评价 -->
							<div v-if="staff.reviews.length" class="staff-card__review">
								<p class="staff-card__review-text">
									"{{ staff.reviews[0].text }}"
								</p>
							</div>
							<!-- 底部操作 -->
							<div class="staff-card__footer">
								<NuxtLink class="staff-card__link" :to="$path(`/staff/${staff.id}`)">
									查看完整资料 →
								</NuxtLink>
								<NuxtLink class="staff-card__btn" :to="$path('/companion')">
									预约
								</NuxtLink>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section>

		<!-- ④ 团队实力展示 -->
		<section class="staff-list-strength">
			<div class="staff-list-strength__inner">
				<h2 class="staff-list-strength__heading">
					{{ tr('tour.staffList.strengthHeading', '为什么值得托付') }}
				</h2>
				<p class="staff-list-strength__subheading">
					{{ tr('tour.staffList.strengthSub', '从筛选到培训，从评价到淘汰，每一个环节都用心打磨') }}
				</p>
				<div class="staff-list-strength__grid">
					<div
						v-for="item in strengths"
						:key="item.num"
						class="staff-list-strength__item"
					>
						<div class="staff-list-strength__item-num">
							{{ item.num }}
						</div>
						<h3 class="staff-list-strength__item-title">
							{{ item.title }}
						</h3>
						<ul class="staff-list-strength__item-list">
							<li v-for="sub in item.items" :key="sub">{{ sub }}</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- ⑤ 底部 CTA -->
		<section class="staff-list-cta">
			<div class="staff-list-cta__inner">
				<h2 class="staff-list-cta__title">
					{{ tr('tour.staffList.ctaTitle', '选择您的专属陪伴师') }}
				</h2>
				<p class="staff-list-cta__desc">
					{{ tr('tour.staffList.ctaDesc', '提交需求，我们将在24小时内为您匹配最合适的陪伴师，开启一段贴心专业的旅程') }}
				</p>
				<NuxtLink class="staff-list-cta__btn" :to="$path('/companion')">
					{{ tr('tour.staffList.ctaBtn', '立即预约咨询') }} →
				</NuxtLink>
			</div>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@import url('./staff-list.scss');
</style>
