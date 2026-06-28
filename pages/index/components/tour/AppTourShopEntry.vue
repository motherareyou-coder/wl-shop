<script setup lang="ts">
defineOptions({ name: 'AppTourShopEntry' })

// 礼物商城入口（附属业务，次要位置，不抢主业务 CTA）
const shopItems = [
	{ src: '/product-list', labelKey: 'tour.shop.allProducts', labelFallback: '全部商品', icon: 'icon:shop' },
	{ src: '/seckill', labelKey: 'tour.shop.seckill', labelFallback: '每日秒杀', icon: 'icon:like' },
	{ src: '/combination', labelKey: 'tour.shop.groupBuy', labelFallback: '拼团优惠', icon: 'icon:user' },
	{ src: '/coupon', labelKey: 'tour.shop.coupon', labelFallback: '优惠券', icon: 'icon:menu' },
]

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<section class="tour-shop site-grid site-grid--vertical-100 site-grid--full">
		<header class="tour-shop__header">
			<h2 class="tour-shop__title">
				{{ tr('tour.shop.heading', '礼物商城') }}
			</h2>
			<p class="tour-shop__subtitle">
				{{ tr('tour.shop.subheading', '精选惊喜礼物，为旅程增添更多美好回忆') }}
			</p>
		</header>

		<div class="tour-shop__grid site-container">
			<NuxtLink
				v-for="item in shopItems"
				:key="item.src"
				:to="$path(item.src)"
				class="tour-shop__card"
			>
				<Icon :name="item.icon" class="tour-shop__icon" />
				<span class="tour-shop__label">{{ tr(item.labelKey, item.labelFallback) }}</span>
				<span class="tour-shop__arrow">→</span>
			</NuxtLink>
		</div>
	</section>
</template>

<style lang="scss">
@import url('./AppTourShopEntry.scss');
</style>
