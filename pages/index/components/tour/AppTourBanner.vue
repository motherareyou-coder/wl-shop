<script setup lang="ts">
import type { Swiper as SwiperClass } from 'swiper/types'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

defineOptions({ name: 'AppTourBanner' })

// 黑金版静态配置（后端接口就绪后替换为 useAPI）
// 支持任意数量的 slide（动态数据友好）
const slides = [
	{
		key: 'custom',
		badgeKey: 'tour.banner.custom.badge',
		badgeFallback: '✦ 中国私人定制旅行专家',
		titleKey: 'tour.banner.custom.title',
		titleFallback: '私人定制中国行程 · 专属您的尊贵体验',
		subtitleKey: 'tour.banner.custom.subtitle',
		subtitleFallback: '从行程规划到落地接待，我们连接最优质的本地旅行社',
		ctaKey: 'tour.banner.custom.cta',
		ctaFallback: '免费定制行程',
		link: '/custom',
	},
	{
		key: 'companion',
		badgeKey: 'tour.banner.companion.badge',
		badgeFallback: '✦ 专业情感陪伴服务',
		titleKey: 'tour.banner.companion.title',
		titleFallback: '私人情感助理 · 让旅程更有温度',
		subtitleKey: 'tour.banner.companion.subtitle',
		subtitleFallback: '专业陪侍团队，为您的特殊时刻增添色彩',
		ctaKey: 'tour.banner.companion.cta',
		ctaFallback: '预约专属服务',
		link: '/companion',
	},
]

let swiper: SwiperClass | null = null
function setSwiper(instance: SwiperClass) {
	swiper = instance
}
function getSwiper() {
	return swiper
}
defineExpose({ getSwiper })

const router = useRouter()
function handleCta(link: string) {
	router.push($path(link))
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<section class="tour-banner">
		<Swiper
			class="tour-banner__swiper"
			:modules="[Autoplay, EffectFade, Pagination]"
			:slides-per-view="1"
			:rewind="true"
			:autoplay="{ delay: 5000, disableOnInteraction: false }"
			effect="fade"
			:pagination="{ clickable: true }"
			@swiper="setSwiper"
		>
			<SwiperSlide
				v-for="slide in slides"
				:key="slide.key"
				class="tour-banner__slide"
			>
				<div class="tour-banner__content">
					<div class="tour-banner__overlay">
						<div class="tour-banner__text site-container">
							<div class="tour-banner__badge">
								{{ tr(slide.badgeKey, slide.badgeFallback) }}
							</div>
							<h2 class="tour-banner__title">
								{{ tr(slide.titleKey, slide.titleFallback) }}
							</h2>
							<p class="tour-banner__subtitle">
								{{ tr(slide.subtitleKey, slide.subtitleFallback) }}
							</p>
							<button
								class="tour-banner__cta"
								@click="handleCta(slide.link)"
							>
								{{ tr(slide.ctaKey, slide.ctaFallback) }}
							</button>
						</div>
					</div>
				</div>
			</SwiperSlide>
		</Swiper>
	</section>
</template>

<style lang="scss">
@import url('./AppTourBanner.scss');
</style>
