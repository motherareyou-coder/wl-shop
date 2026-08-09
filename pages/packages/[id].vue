<script setup lang="ts">
import { getPackageById } from '~/config/tour-packages'

defineOptions({ name: 'PackageDetail' })
definePageMeta({ title: 'Package Detail' })

const route = useRoute()
const { domain } = useRuntimeConfig().public
const id = Number(route.params.id)

// 数据加载：当前用本地静态数据，后续替换为 API
const pkg = ref(getPackageById(id))

if (!pkg.value) {
	// 找不到套餐，抛 404
	throw createError({ statusCode: 404, statusMessage: 'Package not found', fatal: true })
}

// 动态面包屑：首页 > 灵活订购 > [套餐名]
route.meta.breadcrumb = [
	{ label: $t('tour.packagesPage.heroTitle') !== 'tour.packagesPage.heroTitle' ? $t('tour.packagesPage.heroTitle') : '灵活订购', to: '/packages' },
	{ label: pkg.value.title },
]

useSEO({
	routeKey: 'articleDetail',
	title: pkg.value.title,
	description: pkg.value.desc.slice(0, 120),
	keywords: pkg.value.highlights,
	type: 'article',
	breadcrumbs: [
		{ name: 'Home', url: domain },
		{ name: 'Packages', url: `${domain}/packages` },
		{ name: pkg.value.title, url: `${domain}${route.path}` },
	],
})

const { gtag } = useGtag()
onMounted(() => {
	gtag('event', 'screen_view', { screen_name: 'package-detail', package_id: id })
})

// 灵活选项 toggle 状态
const enabledAddons = ref<string[]>([...(pkg.value?.addons || [])])

function toggleAddon(name: string) {
	if (enabledAddons.value.includes(name)) {
		enabledAddons.value = enabledAddons.value.filter(n => n !== name)
	}
	else {
		enabledAddons.value.push(name)
	}
}

// 行程概要信息
const summaryInfo = computed(() => {
	if (!pkg.value) return []
	return [
		{
			icon: '🗓️',
			label: '行程天数',
			value: `${pkg.value.days} 天`,
		},
		{
			icon: '⛰️',
			label: '难度',
			value: tr(pkg.value.difficultyKey, pkg.value.difficultyFallback),
		},
		{
			icon: '🌤️',
			label: '最佳季节',
			value: tr(pkg.value.bestSeasonKey, pkg.value.bestSeasonFallback),
		},
		{
			icon: '👥',
			label: '适合人群',
			value: pkg.value.audience.join('、'),
		},
	]
})

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<div v-if="pkg" class="pkg-detail-page">
		<div class="pkg-detail__container">
			<!-- ① 返回链接 -->
			<nav class="pkg-detail__breadcrumb">
				<NuxtLink class="pkg-detail__back" :to="$path('/')">
					{{ $t('tour.caseDetail.backToHome') }}
				</NuxtLink>
				<span class="pkg-detail__sep">/</span>
				<NuxtLink class="pkg-detail__back" :to="$path('/packages')">
					{{ tr('tour.packagesPage.heroTitle', '灵活订购') }}
				</NuxtLink>
				<span class="pkg-detail__sep">/</span>
				<span class="pkg-detail__current">{{ tr(pkg.titleKey, pkg.titleFallback) }}</span>
			</nav>

			<!-- ② 套餐头部 -->
			<header class="pkg-detail__header">
				<div class="pkg-detail__hero">
					<div class="pkg-detail__hero-img">
						<span class="pkg-detail__hero-name">{{ tr(pkg.titleKey, pkg.titleFallback) }}</span>
					</div>
				</div>
				<div class="pkg-detail__header-body">
					<div class="pkg-detail__header-top">
						<div class="pkg-detail__header-info">
							<h1 class="pkg-detail__title">
								{{ tr(pkg.titleKey, pkg.titleFallback) }}
							</h1>
							<p class="pkg-detail__subtitle">
								{{ tr(pkg.subtitleKey, pkg.subtitleFallback) }}
							</p>
						</div>
						<div class="pkg-detail__days">
							<span class="pkg-detail__days-num">{{ pkg.days }}</span>
							<span class="pkg-detail__days-unit">天</span>
						</div>
					</div>
					<p class="pkg-detail__desc">
						{{ tr(pkg.descKey, pkg.descFallback) }}
					</p>
					<div class="pkg-detail__route-range">
						<span class="pkg-detail__route-label">{{ tr('tour.packagesPage.routeRange', '路线范围') }}</span>
						<span class="pkg-detail__route-text">{{ pkg.routeRange }}</span>
					</div>
				</div>
			</header>

			<!-- ③ 行程概要 -->
			<section class="pkg-detail__summary">
				<h2 class="pkg-detail__section-heading">
					{{ tr('tour.caseDetail.summaryTitle', '行程概要') }}
				</h2>
				<div class="pkg-detail__summary-grid">
					<div v-for="item in summaryInfo" :key="item.label" class="pkg-detail__summary-item">
						<span class="pkg-detail__summary-icon">{{ item.icon }}</span>
						<span class="pkg-detail__summary-label">{{ item.label }}</span>
						<span class="pkg-detail__summary-value">{{ item.value }}</span>
					</div>
				</div>
			</section>

			<!-- ④ 每日行程时间线 -->
			<section class="pkg-detail__itinerary">
				<h2 class="pkg-detail__section-heading">
					{{ tr('tour.packagesPage.itineraryHeading', '每日行程') }}
				</h2>
				<div class="pkg-detail__timeline">
					<div
						v-for="(day, idx) in pkg.itinerary"
						:key="idx"
						class="pkg-detail__timeline-item"
						:class="{ 'pkg-detail__timeline-item--last': idx === pkg.itinerary.length - 1 }"
					>
						<div class="pkg-detail__timeline-circle">
							<span class="pkg-detail__timeline-day">D{{ day.day }}</span>
						</div>
						<div class="pkg-detail__timeline-content">
							<h3 class="pkg-detail__timeline-title">
								{{ tr(day.titleKey, day.titleFallback) }}
							</h3>
							<p v-if="tr(day.descKey, day.descFallback)" class="pkg-detail__timeline-desc">
								{{ tr(day.descKey, day.descFallback) }}
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- ⑤ 服务包含/不包含 -->
			<section class="pkg-detail__service">
				<h2 class="pkg-detail__section-heading">
					{{ tr('tour.packagesPage.serviceHeading', '服务说明') }}
				</h2>
				<div class="pkg-detail__service-grid">
					<div class="pkg-detail__service-col pkg-detail__service-col--include">
						<h3 class="pkg-detail__service-title">
							✓ {{ tr('tour.packagesPage.includes', '费用包含') }}
						</h3>
						<ul class="pkg-detail__service-list">
							<li v-for="inc in pkg.includes" :key="inc">{{ inc }}</li>
						</ul>
					</div>
					<div class="pkg-detail__service-col pkg-detail__service-col--exclude">
						<h3 class="pkg-detail__service-title pkg-detail__service-title--exclude">
							✗ {{ tr('tour.packagesPage.excludes', '费用不包含') }}
						</h3>
						<ul class="pkg-detail__service-list pkg-detail__service-list--exclude">
							<li v-for="exc in pkg.excludes" :key="exc">{{ exc }}</li>
						</ul>
					</div>
				</div>
			</section>

			<!-- ⑥ 灵活选项 -->
			<section class="pkg-detail__addons">
				<h2 class="pkg-detail__section-heading">
					{{ tr('tour.packagesPage.flexOptions', '灵活选项') }}
				</h2>
				<p class="pkg-detail__addons-sub">
					{{ tr('tour.packagesPage.flexOptionsSub', '按需勾选，与套餐自由组合') }}
				</p>
				<div class="pkg-detail__addons-list">
					<label
						v-for="addon in pkg.addons"
						:key="addon"
						class="pkg-detail__addon"
						:class="{ 'pkg-detail__addon--on': enabledAddons.includes(addon) }"
					>
						<span class="pkg-detail__addon-name">{{ addon }}</span>
						<button
							type="button"
							class="pkg-detail__toggle"
							:class="{ 'pkg-detail__toggle--on': enabledAddons.includes(addon) }"
							@click.prevent="toggleAddon(addon)"
						>
							<span class="pkg-detail__toggle-knob" />
						</button>
						<input
							type="checkbox"
							:checked="enabledAddons.includes(addon)"
							hidden
						>
					</label>
				</div>
			</section>

			<!-- ⑦ CTA -->
			<section class="pkg-detail__cta">
				<h2 class="pkg-detail__cta-title">
					{{ tr('tour.packagesPage.customizeRoute', '定制此路线') }}
				</h2>
				<p class="pkg-detail__cta-desc">
					{{ tr('tour.packagesPage.ctaDesc', '基于此路线灵活调整，规划师为您量身打造专属方案') }}
				</p>
				<div class="pkg-detail__cta-price">
					<span class="pkg-detail__cta-price-label">{{ tr('tour.packagesPage.priceFrom', '起价') }}</span>
					<span class="pkg-detail__cta-price-num">{{ tr(pkg.priceKey, pkg.priceFallback) }}</span>
				</div>
				<NuxtLink class="pkg-detail__cta-btn" :to="$path('/custom')">
					{{ tr('tour.packagesPage.customizeRoute', '定制此路线') }} →
				</NuxtLink>
			</section>
		</div>
	</div>
</template>

<style lang="scss" scoped>
/* ===== 通用变量 ===== */
$gold: #A16207;
$gold-light: #CA8A04;
$gold-lighter: #D4A437;
$gold-bg: #FAF2E0;
$dark-bg: #1C1917;
$dark-bg-2: #292524;
$text-base: #191919;
$text-secondary: #6b6b6b;
$text-tertiary: #898989;
$border-warm: #f0ebe0;
$bg-light-grey: #f5f5f5;

.pkg-detail-page {
	background: $bg-light-grey;
	min-height: 100vh;
}

.pkg-detail__container {
	max-width: 1000px;
	margin: 0 auto;
	padding: 24px 24px 80px;

	@media (max-width: 720px) {
		padding: 16px 16px 60px;
	}
}

/* 通用 section 标题 */
.pkg-detail__section-heading {
	font-size: 22px;
	font-weight: 800;
	color: $text-base;
	margin: 0 0 24px;
	padding-left: 12px;
	border-left: 4px solid $gold;
}

/* ① 面包屑 */
.pkg-detail {
	&__breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		margin-bottom: 20px;
		font-size: 13px;
	}

	&__back {
		color: $text-tertiary;
		text-decoration: none;
		transition: color 0.2s;

		&:hover {
			color: $gold;
		}
	}

	&__sep {
		color: $text-tertiary;
		opacity: 0.5;
	}

	&__current {
		color: $text-base;
		font-weight: 500;
	}

	/* ② 套餐头部 */
	&__header {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		overflow: hidden;
		margin-bottom: 24px;
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
	}

	&__hero {
		position: relative;
	}

	&__hero-img {
		position: relative;
		aspect-ratio: 21 / 9;
		background: linear-gradient(135deg, #44403C, #1C1917);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: radial-gradient(circle at 50% 50%, rgba(161, 98, 7, 0.35), transparent 60%);
		}
	}

	&__hero-name {
		position: relative;
		z-index: 1;
		font-size: clamp(24px, 4vw, 36px);
		font-weight: 800;
		color: #fff;
		text-align: center;
		padding: 0 24px;
		letter-spacing: 0.04em;
	}

	&__header-body {
		padding: 28px 32px 32px;

		@media (max-width: 720px) {
			padding: 24px 20px;
		}
	}

	&__header-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
		margin-bottom: 16px;
	}

	&__header-info {
		flex: 1;
		min-width: 0;
	}

	&__title {
		font-size: clamp(22px, 3.5vw, 28px);
		font-weight: 800;
		color: $text-base;
		margin: 0 0 8px;
	}

	&__subtitle {
		font-size: 15px;
		font-weight: 600;
		color: $gold;
		margin: 0;
	}

	&__days {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 64px;
		height: 64px;
		border-radius: 14px;
		background: $gold-bg;
		color: $gold;
	}

	&__days-num {
		font-size: 26px;
		font-weight: 800;
		line-height: 1;
	}

	&__days-unit {
		font-size: 12px;
		margin-top: 2px;
	}

	&__desc {
		font-size: 15px;
		line-height: 1.8;
		color: $text-secondary;
		margin: 0 0 20px;
	}

	&__route-range {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		padding: 12px 16px;
		background: $bg-light-grey;
		border-radius: 10px;
	}

	&__route-label {
		font-size: 13px;
		color: $text-tertiary;
		flex-shrink: 0;
	}

	&__route-text {
		font-size: 14px;
		font-weight: 600;
		color: $text-base;
	}

	/* ③ 行程概要 */
	&__summary {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		padding: 32px;
		margin-bottom: 24px;
	}

	&__summary-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}

	&__summary-item {
		text-align: center;
		padding: 20px 12px;
		background: $bg-light-grey;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__summary-icon {
		font-size: 28px;
		line-height: 1;
		margin-bottom: 4px;
	}

	&__summary-label {
		font-size: 12px;
		color: $text-tertiary;
	}

	&__summary-value {
		font-size: 14px;
		font-weight: 700;
		color: $text-base;
		line-height: 1.4;
	}

	/* ④ 每日行程时间线 */
	&__itinerary {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		padding: 32px;
		margin-bottom: 24px;
	}

	&__timeline {
		position: relative;
		padding-left: 8px;
	}

	&__timeline-item {
		position: relative;
		display: flex;
		gap: 20px;
		padding-bottom: 28px;

		&::before {
			content: '';
			position: absolute;
			left: 19px;
			top: 40px;
			bottom: 0;
			width: 2px;
			background: linear-gradient($gold, $border-warm);
		}

		&--last {
			padding-bottom: 0;

			&::before {
				display: none;
			}
		}
	}

	&__timeline-circle {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, $gold, $gold-light);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(161, 98, 7, 0.3);
		z-index: 1;
	}

	&__timeline-day {
		font-size: 12px;
		font-weight: 700;
	}

	&__timeline-content {
		flex: 1;
		padding-top: 4px;
	}

	&__timeline-title {
		font-size: 16px;
		font-weight: 700;
		color: $text-base;
		margin: 0 0 6px;
	}

	&__timeline-desc {
		font-size: 14px;
		color: $text-secondary;
		line-height: 1.6;
		margin: 0;
	}

	/* ⑤ 服务包含/不包含 */
	&__service {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		padding: 32px;
		margin-bottom: 24px;
	}

	&__service-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	&__service-col {
		&--include {
			background: rgba(250, 242, 224, 0.5);
			border-radius: 12px;
			padding: 24px;
		}

		&--exclude {
			background: $bg-light-grey;
			border-radius: 12px;
			padding: 24px;
		}
	}

	&__service-title {
		font-size: 16px;
		font-weight: 700;
		color: $gold;
		margin: 0 0 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid $border-warm;

		&--exclude {
			color: $text-tertiary;
		}
	}

	&__service-list {
		list-style: none;
		padding: 0;
		margin: 0;

		li {
			font-size: 14px;
			color: $text-base;
			margin-bottom: 10px;
			display: flex;
			align-items: flex-start;
			gap: 8px;
			line-height: 1.5;

			&::before {
				content: '✓';
				color: $gold;
				font-weight: 700;
				flex-shrink: 0;
			}
		}

		&--exclude li {
			color: $text-secondary;

			&::before {
				content: '✗';
				color: $text-tertiary;
			}
		}
	}

	/* ⑥ 灵活选项 */
	&__addons {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		padding: 32px;
		margin-bottom: 24px;
	}

	&__addons-sub {
		font-size: 14px;
		color: $text-secondary;
		margin: -16px 0 20px;
		padding-left: 12px;
	}

	&__addons-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__addon {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 18px;
		background: $bg-light-grey;
		border: 2px solid transparent;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s;

		&:hover {
			background: $gold-bg;
		}

		&--on {
			background: $gold-bg;
			border-color: $gold;
		}
	}

	&__addon-name {
		font-size: 15px;
		font-weight: 600;
		color: $text-base;
	}

	&__toggle {
		position: relative;
		width: 44px;
		height: 24px;
		border-radius: 999px;
		background: #d6d0c0;
		border: none;
		cursor: pointer;
		transition: background 0.3s;
		flex-shrink: 0;
		padding: 0;

		&--on {
			background: linear-gradient(135deg, $gold, $gold-light);
		}
	}

	&__toggle-knob {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 0.3s;
	}

	&__toggle--on &__toggle-knob {
		transform: translateX(20px);
	}

	/* ⑦ CTA */
	&__cta {
		background: linear-gradient(135deg, $dark-bg, $dark-bg-2);
		border-radius: 16px;
		padding: 48px 32px;
		text-align: center;
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: radial-gradient(circle at 50% 50%, rgba(161, 98, 7, 0.2), transparent 50%);
		}
	}

	&__cta-title {
		position: relative;
		z-index: 1;
		color: #fff;
		font-size: clamp(22px, 3.5vw, 28px);
		font-weight: 800;
		margin: 0 0 10px;
	}

	&__cta-desc {
		position: relative;
		z-index: 1;
		color: rgba(255, 255, 255, 0.7);
		font-size: 15px;
		margin: 0 0 20px;
		line-height: 1.6;
	}

	&__cta-price {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 24px;
	}

	&__cta-price-label {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.6);
	}

	&__cta-price-num {
		font-size: 28px;
		font-weight: 800;
		color: $gold-lighter;
	}

	&__cta-btn {
		position: relative;
		z-index: 1;
		display: inline-block;
		background: linear-gradient(135deg, $gold, $gold-light);
		border-radius: 999px;
		color: #fff;
		font-size: 16px;
		font-weight: 600;
		padding: 14px 40px;
		text-decoration: none;
		transition: transform 0.2s, box-shadow 0.2s;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 24px rgba(161, 98, 7, 0.4);
		}
	}
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
	.pkg-detail {
		&__summary-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		&__service-grid {
			grid-template-columns: 1fr;
		}
	}
}

@media (max-width: 720px) {
	.pkg-detail {
		&__summary,
		&__itinerary,
		&__service,
		&__addons {
			padding: 24px 20px;
		}

		&__header-top {
			flex-direction: column-reverse;
			gap: 16px;
		}

		&__days {
			align-self: flex-start;
		}

		&__summary-grid {
			grid-template-columns: 1fr;
		}

		&__timeline-item {
			gap: 14px;
		}

		&__timeline-circle {
			width: 36px;
			height: 36px;
		}

		&__timeline-item::before {
			left: 17px;
		}

		&__cta {
			padding: 36px 20px;
		}
	}
}
</style>
