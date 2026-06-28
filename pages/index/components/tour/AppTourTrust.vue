<script setup lang="ts">
defineOptions({ name: 'AppTourTrust' })

// 信任背书（4列・E-E-A-T 信号，见 SEO 规范 §4.4）
const trustItems = [
	{
		icon: 'icon:shop',
		titleKey: 'tour.trust.licensed',
		titleFallback: '正规资质',
		descKey: 'tour.trust.licensedDesc',
		descFallback: '持牌旅行社经营许可，合规合法',
	},
	{
		icon: 'icon:like',
		titleKey: 'tour.trust.payment',
		titleFallback: '安全保障',
		descKey: 'tour.trust.paymentDesc',
		descFallback: '资金第三方托管，行程满意才付款',
	},
	{
		icon: 'icon:user',
		titleKey: 'tour.trust.support',
		titleFallback: '7×24 支持',
		descKey: 'tour.trust.supportDesc',
		descFallback: '全程中文管家，紧急情况即时响应',
	},
	{
		icon: 'icon:menu',
		titleKey: 'tour.trust.refund',
		titleFallback: '灵活退改',
		descKey: 'tour.trust.refundDesc',
		descFallback: '行前无忧退改，保障您的权益',
	},
]

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<section class="tour-trust site-grid site-grid--vertical-100 site-grid--full">
		<header class="tour-trust__header">
			<h2 class="tour-trust__title">
				{{ tr('tour.trust.heading', '安心出行保障') }}
			</h2>
			<p class="tour-trust__subtitle">
				{{ tr('tour.trust.subheading', '多重保障，让您放心定制每一次旅程') }}
			</p>
		</header>

		<div class="tour-trust__grid site-container">
			<article
				v-for="item in trustItems"
				:key="item.titleFallback"
				class="tour-trust__item"
			>
				<Icon :name="item.icon" class="tour-trust__icon" />
				<h3 class="tour-trust__item-title">
					{{ tr(item.titleKey, item.titleFallback) }}
				</h3>
				<p class="tour-trust__item-desc">
					{{ tr(item.descKey, item.descFallback) }}
				</p>
			</article>
		</div>
	</section>
</template>

<style lang="scss">
@import url('./AppTourTrust.scss');
</style>
