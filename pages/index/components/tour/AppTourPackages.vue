<script setup lang="ts">
defineOptions({ name: 'AppTourPackages' })

// 特色玩法套餐（静态，固定 4 卡片）
const packages = [
	{
		image: '/images/tour/pkg-silkroad.jpg',
		altKey: 'tour.packages.silkroad.alt',
		altFallback: '丝绸之路文化深度游',
		titleKey: 'tour.packages.silkroad.title',
		titleFallback: '丝绸之路文化之旅',
		descKey: 'tour.packages.silkroad.desc',
		descFallback: '西安至敦煌 12 天，穿越千年丝路文明',
		days: '12',
	},
	{
		image: '/images/tour/pkg-yunnan.jpg',
		altKey: 'tour.packages.yunnan.alt',
		altFallback: '云南少数民族风情游',
		titleKey: 'tour.packages.yunnan.title',
		titleFallback: '云南秘境探索',
		descKey: 'tour.packages.yunnan.desc',
		descFallback: '昆明大理丽江 8 天，感受少数民族风情',
		days: '8',
	},
	{
		image: '/images/tour/pkg-tibet.jpg',
		altKey: 'tour.packages.tibet.alt',
		altFallback: '西藏高原心灵之旅',
		titleKey: 'tour.packages.tibet.title',
		titleFallback: '西藏心灵朝圣',
		descKey: 'tour.packages.tibet.desc',
		descFallback: '拉萨林芝 10 天，高原圣境的心灵洗礼',
		days: '10',
	},
	{
		image: '/images/tour/pkg-jiangnan.jpg',
		altKey: 'tour.packages.jiangnan.alt',
		altFallback: '江南水乡古镇游',
		titleKey: 'tour.packages.jiangnan.title',
		titleFallback: '江南水乡雅韵',
		descKey: 'tour.packages.jiangnan.desc',
		descFallback: '苏州杭州乌镇 6 天，诗画江南的慢生活',
		days: '6',
	},
]

const router = useRouter()
function goCustom() {
	router.push($path('/custom'))
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<section class="tour-packages site-grid site-grid--vertical-100 site-grid--full">
		<header class="tour-packages__header">
			<h2 class="tour-packages__title">
				{{ tr('tour.packages.heading', '特色玩法套餐') }}
			</h2>
			<p class="tour-packages__subtitle">
				{{ tr('tour.packages.subheading', '精选热门路线，可直接定制或作为灵感参考') }}
			</p>
		</header>

		<div class="tour-packages__grid site-container">
			<article
				v-for="item in packages"
				:key="item.titleFallback"
				class="tour-packages__card"
				@click="goCustom"
			>
				<div class="tour-packages__image-wrap tour-packages__image-wrap--placeholder">
					<span class="tour-packages__placeholder-text">{{ tr(item.altKey, item.altFallback) }}</span>
					<span class="tour-packages__days">{{ item.days }} {{ tr('tour.packages.days', '天') }}</span>
				</div>
				<div class="tour-packages__info">
					<h3 class="tour-packages__card-title">
						{{ tr(item.titleKey, item.titleFallback) }}
					</h3>
					<p class="tour-packages__card-desc">
						{{ tr(item.descKey, item.descFallback) }}
					</p>
					<span class="tour-packages__link">
						{{ tr('tour.packages.customize', '定制此路线') }} →
					</span>
				</div>
			</article>
		</div>
	</section>
</template>

<style lang="scss">
@import url('./AppTourPackages.scss');
</style>
