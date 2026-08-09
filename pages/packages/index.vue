<script setup lang="ts">
import {
	packagePlans,
	comparisonItems,
	packageAddons,
	tourPackages,
} from '~/config/tour-packages'

definePageMeta({
	title: 'Packages',
})

// SEO
const route = useRoute()
const { domain } = useRuntimeConfig().public
useSEO({
	routeKey: 'custom',
	breadcrumbs: [
		{ name: 'Home', url: domain },
		{ name: 'Packages', url: `${domain}${route.path}` },
	],
})

// 埋点
const { gtag } = useGtag()
gtag('event', 'screen_view', { screen_name: 'packages' })

// 锚点速览
function scrollToSection(target: string) {
	document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

const anchorLinks = [
	{ label: '行程定制', target: '#pkg-plan-explorer' },
	{ label: '情感陪伴', target: '#pkg-plan-companion' },
	{ label: '全套尊享', target: '#pkg-plan-premium' },
]

// 三大订购模式
const plans = packagePlans

// 对比矩阵
const compareItems = comparisonItems

function isGroupStart(index: number) {
	const item = compareItems[index]
	if (!item.group) return false
	if (index === 0) return true
	return compareItems[index - 1].group !== item.group
}

function compareMark(val: string) {
	switch (val) {
		case 'yes': return { cls: 'pkg-compare__mark--check', text: '✓' }
		case 'no': return { cls: 'pkg-compare__mark--dash', text: '—' }
		case 'optional': return { cls: 'pkg-compare__mark--opt', text: '可选' }
		case 'phone': return { cls: 'pkg-compare__mark--opt', text: '电话' }
		case '24h': return { cls: 'pkg-compare__mark--opt', text: '7×24' }
		default: return { cls: 'pkg-compare__mark--dash', text: '—' }
	}
}

// 热门路线
const routes = computed(() => tourPackages.slice(0, 4))

// 加购项
const addons = packageAddons
const selectedAddons = ref<string[]>([])

function toggleAddon(name: string) {
	if (selectedAddons.value.includes(name)) {
		selectedAddons.value = selectedAddons.value.filter(n => n !== name)
	}
	else {
		selectedAddons.value.push(name)
	}
}

// FAQ
const faqs = [
	{
		q: '三种模式可以中途切换吗？',
		a: '可以。我们支持灵活升级，您可以在行程的任何阶段升级到更高一级的模式，只需补足差价即可，无需重新签约。降级则视已发生的服务成本协商处理。',
	},
	{
		q: '定制行程大概需要多久出方案？',
		a: '提交需求后，规划师通常在 24 小时内匹配本地资源，3-5 个工作日内提供完整方案初稿。方案支持无限次修改，调整至您完全满意为止。',
	},
	{
		q: '陪侍服务如何保证安全？',
		a: '所有陪侍师均经过严格背景审查、持证上岗，服务全程由平台监管，可按需提供录音录像，紧急情况支持一键求助，7×24 管家即时响应。',
	},
	{
		q: '加购项目可以事后追加吗？',
		a: '可以。绝大多数加购项目支持行前追加，部分项目（如摄影跟拍、专车升级）甚至可在行程中临时预约，具体以资源可用性为准。',
	},
]
const openFaq = ref<number | null>(0)
function toggleFaq(i: number) {
	openFaq.value = openFaq.value === i ? null : i
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<div class="pkg-page">
		<!-- ① Hero 区 -->
		<section class="pkg-hero site-grid site-grid--vertical-100 site-grid--full">
			<div class="pkg-hero__bg" />
			<div class="pkg-hero__inner site-container">
				<h1 class="pkg-hero__title">
					{{ tr('tour.packagesPage.heroTitle', '灵活订购 · 按需选择') }}
				</h1>
				<p class="pkg-hero__subtitle">
					{{ tr('tour.packagesPage.heroSub', '拒绝捆绑销售，每个模块都可独立选择或自由组合') }}
				</p>
				<div class="pkg-hero__anchors">
					<button
						v-for="a in anchorLinks"
						:key="a.label"
						class="pkg-hero__anchor"
						@click="scrollToSection(a.target)"
					>
						{{ a.label }}
					</button>
				</div>
			</div>
		</section>

		<!-- ② 三大订购模式 -->
		<section id="pkg-plans" class="pkg-plans">
			<div class="pkg-plans__inner">
				<h2 class="pkg-plans__heading">
					{{ tr('tour.packagesPage.plansHeading', '三大订购模式') }}
				</h2>
				<p class="pkg-plans__sub">
					{{ tr('tour.packagesPage.plansSub', '模块化订购，按需组合，不花一分冤枉钱') }}
				</p>
				<div class="pkg-plans__grid">
					<article
						v-for="plan in plans"
						:id="`pkg-plan-${plan.id}`"
						:key="plan.id"
						class="pkg-plans__card"
						:class="{ 'pkg-plans__card--popular': plan.popular }"
					>
						<span v-if="plan.popular" class="pkg-plans__popular">⭐ {{ tr('tour.packagesPage.mostPopular', '最受欢迎') }}</span>
						<div class="pkg-plans__icon">
							<Icon :name="plan.id === 'explorer' ? 'icon:shop' : plan.id === 'companion' ? 'icon:like' : 'icon:menu'" />
						</div>
						<h3 class="pkg-plans__name">
							{{ tr(plan.nameKey, plan.nameFallback) }}
							<span class="pkg-plans__name-en">{{ plan.nameEn }}</span>
						</h3>
						<p class="pkg-plans__subtitle">
							{{ tr(plan.subtitleKey, plan.subtitleFallback) }}
						</p>
						<p class="pkg-plans__suitable">
							{{ tr(plan.suitableForKey, plan.suitableForFallback) }}
						</p>
						<ol class="pkg-plans__steps">
							<li v-for="(step, idx) in plan.steps" :key="idx" class="pkg-plans__step">
								<span class="pkg-plans__step-num">{{ idx + 1 }}</span>
								<div class="pkg-plans__step-body">
									<strong class="pkg-plans__step-title">{{ tr(step.titleKey, step.titleFallback) }}</strong>
									<span class="pkg-plans__step-desc">{{ tr(step.descKey, step.descFallback) }}</span>
								</div>
							</li>
						</ol>
						<div class="pkg-plans__price">
							<span class="pkg-plans__price-label">{{ tr('tour.packagesPage.priceFrom', '起价') }}</span>
							<span class="pkg-plans__price-num">{{ tr(plan.priceKey, plan.priceFallback) }}</span>
							<span class="pkg-plans__price-unit">{{ tr(plan.priceUnitKey, plan.priceUnit) }}</span>
						</div>
						<NuxtLink :to="$path(plan.ctaLink)" class="pkg-plans__cta">
							{{ tr(plan.ctaKey, plan.ctaFallback) }} →
						</NuxtLink>
					</article>
				</div>
			</div>
		</section>

		<!-- ③ 服务对比矩阵 -->
		<section class="pkg-compare">
			<div class="pkg-compare__inner">
				<h2 class="pkg-compare__heading">
					{{ tr('tour.packagesPage.compareHeading', '服务对比矩阵') }}
				</h2>
				<p class="pkg-compare__sub">
					{{ tr('tour.packagesPage.compareSub', '一目了然，清楚知道每一分钱花在哪里') }}
				</p>
				<div class="pkg-compare__table-wrap">
					<table class="pkg-compare__table">
						<thead>
							<tr>
								<th class="pkg-compare__th pkg-compare__th--name">
									{{ tr('tour.packagesPage.compareService', '服务项目') }}
								</th>
								<th class="pkg-compare__th">
									{{ tr('tour.packagesPage.plans.explorer.name', '探索家') }}
								</th>
								<th class="pkg-compare__th">
									{{ tr('tour.packagesPage.plans.companion.name', '陪伴家') }}
								</th>
								<th class="pkg-compare__th pkg-compare__th--premium">
									★ {{ tr('tour.packagesPage.plans.premium.name', '尊享家') }}
								</th>
							</tr>
						</thead>
						<tbody>
							<template v-for="(item, idx) in compareItems" :key="idx">
								<tr v-if="isGroupStart(idx)" class="pkg-compare__group-row">
									<td colspan="4">
										{{ item.group }}
									</td>
								</tr>
								<tr>
									<td class="pkg-compare__td pkg-compare__td--name">
										{{ tr(item.nameKey, item.nameFallback) }}
									</td>
									<td class="pkg-compare__td">
										<span class="pkg-compare__mark" :class="compareMark(item.explorer).cls">{{ compareMark(item.explorer).text }}</span>
									</td>
									<td class="pkg-compare__td">
										<span class="pkg-compare__mark" :class="compareMark(item.companion).cls">{{ compareMark(item.companion).text }}</span>
									</td>
									<td class="pkg-compare__td pkg-compare__td--premium">
										<span class="pkg-compare__mark" :class="compareMark(item.premium).cls">{{ compareMark(item.premium).text }}</span>
									</td>
								</tr>
							</template>
						</tbody>
					</table>
				</div>
			</div>
		</section>

		<!-- ④ 热门路线套餐推荐 -->
		<section class="pkg-routes">
			<div class="pkg-routes__inner">
				<h2 class="pkg-routes__heading">
					{{ tr('tour.packagesPage.routesHeading', '热门路线套餐推荐') }}
				</h2>
				<p class="pkg-routes__sub">
					{{ tr('tour.packagesPage.routesSub', '精选人气路线，可直接定制或在此基础上灵活调整') }}
				</p>
				<div class="pkg-routes__grid">
					<NuxtLink
						v-for="pkg in routes"
						:key="pkg.id"
						:to="$path(`/packages/${pkg.id}`)"
						class="pkg-routes__card"
					>
						<div class="pkg-routes__card-img">
							<span class="pkg-routes__card-name">{{ tr(pkg.titleKey, pkg.titleFallback) }}</span>
						</div>
						<div class="pkg-routes__card-body">
							<h3 class="pkg-routes__card-title">
								{{ tr(pkg.titleKey, pkg.titleFallback) }}
							</h3>
							<p class="pkg-routes__card-subtitle">
								{{ tr(pkg.subtitleKey, pkg.subtitleFallback) }}
							</p>
							<div class="pkg-routes__card-meta">
								<span class="pkg-routes__card-days">{{ pkg.days }}{{ tr('tour.packagesPage.daysUnit', '天') }}</span>
								<span class="pkg-routes__card-range">{{ pkg.routeRange }}</span>
							</div>
							<ul class="pkg-routes__card-includes">
								<li v-for="inc in pkg.includes.slice(0, 3)" :key="inc">{{ inc }}</li>
							</ul>
							<div class="pkg-routes__card-footer">
								<span class="pkg-routes__card-price">{{ tr(pkg.priceKey, pkg.priceFallback) }}</span>
								<span class="pkg-routes__card-link">{{ tr('tour.packagesPage.viewDetail', '查看详情') }} →</span>
							</div>
						</div>
					</NuxtLink>
				</div>
			</div>
		</section>

		<!-- ⑤ A la carte 加购模块 -->
		<section class="pkg-addons">
			<div class="pkg-addons__inner">
				<h2 class="pkg-addons__heading">
					{{ tr('tour.packagesPage.addonsHeading', 'A la carte 加购模块') }}
				</h2>
				<p class="pkg-addons__sub">
					{{ tr('tour.packagesPage.addonsSub', '所有加购均可独立选择，与任何套餐自由组合') }}
				</p>
				<div class="pkg-addons__grid">
					<label
						v-for="addon in addons"
						:key="addon.name"
						class="pkg-addons__item"
						:class="{ 'pkg-addons__item--active': selectedAddons.includes(addon.name) }"
					>
						<input
							type="checkbox"
							:checked="selectedAddons.includes(addon.name)"
							@change="toggleAddon(addon.name)"
						>
						<div class="pkg-addons__item-body">
							<div class="pkg-addons__item-head">
								<span class="pkg-addons__item-name">{{ tr(addon.nameKey, addon.nameFallback) }}</span>
								<span class="pkg-addons__item-price">
									{{ tr(addon.priceKey, addon.priceFallback) }}<small>{{ addon.unit }}</small>
								</span>
							</div>
							<p class="pkg-addons__item-desc">{{ tr(addon.descKey, addon.descFallback) }}</p>
						</div>
					</label>
				</div>
			</div>
		</section>

		<!-- ⑥ FAQ -->
		<section class="pkg-faq">
			<div class="pkg-faq__inner">
				<h2 class="pkg-faq__heading">
					{{ tr('tour.packagesPage.faqHeading', '常见问题') }}
				</h2>
				<div class="pkg-faq__list">
					<div
						v-for="(faq, i) in faqs"
						:key="i"
						class="pkg-faq__item"
						:class="{ 'pkg-faq__item--open': openFaq === i }"
					>
						<button class="pkg-faq__q" @click="toggleFaq(i)">
							<span>{{ faq.q }}</span>
							<span class="pkg-faq__icon">{{ openFaq === i ? '−' : '+' }}</span>
						</button>
						<div class="pkg-faq__a">
							<p>{{ faq.a }}</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ⑦ 底部CTA -->
		<section class="pkg-bottom-cta">
			<div class="pkg-bottom-cta__inner">
				<h2 class="pkg-bottom-cta__title">
					{{ tr('tour.packagesPage.bottomCtaTitle', '不确定选哪种？') }}
				</h2>
				<p class="pkg-bottom-cta__desc">
					{{ tr('tour.packagesPage.bottomCtaDesc', '添加微信 iswink_travel 免费咨询，顾问帮您找到最合适的方案') }}
				</p>
				<NuxtLink class="pkg-bottom-cta__btn" :to="$path('/custom')">
					{{ tr('tour.packagesPage.bottomCtaBtn', '免费咨询') }} →
				</NuxtLink>
				<p class="pkg-bottom-cta__wechat">
					{{ tr('tour.packagesPage.wechat', '或添加微信 iswink_travel 1对1咨询') }}
				</p>
			</div>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@import url('./packages.scss');
</style>
