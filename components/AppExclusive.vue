<script setup lang="ts">
import type { Swiper as SwiperClass, SwiperOptions } from 'swiper/types'
import { chunk } from 'lodash-es'
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import './AppExclusive.scss'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({ name: 'AppExclusive' })

interface Bargin {
	id: number
	name: string
	startTime: string
	endTime: string
	spuId: number
	skuId: number
	stock: number
	picUrl: string
	marketPrice: number
	bargainMinPrice: number
}

const { data } = await useAsyncData<Bargin[]>(() =>
	$api('promotion/bargain-activity/page').then(
		res => res.list,
	),
)

const finalData = computed(() => chunk(data.value, 3))

let swiper: SwiperClass | null = null
const realIndex = ref(0)
function setSwiper(d: SwiperClass) {
	swiper = d
}
function next() {
	if (!swiper)
		return
	swiper.slideNext()
	swiper.slideNext()
	swiper.slideNext()
	realIndex.value = swiper.realIndex
}
function prev() {
	if (!swiper)
		return
	swiper.slidePrev()
	swiper.slidePrev()
	swiper.slidePrev()
	realIndex.value = swiper.realIndex
}
</script>

<template>
	<div class="exclusive-offers exclusive-offers--full">
		<div class="exclusive-offers__header">
			<div class="exclusive-offers__header-text">
				Exclusive Offers
			</div>
			<div class="exclusive-offers__header-arrow">
				<el-icon
					class="exclusive-offers__header-arrow-left"
					:class="{ 'swiper-button-disabled': realIndex === 0 }"
					@click="prev"
				>
					<Icon name="icon:left" />
				</el-icon>
				<el-icon
					class="exclusive-offers__header-arrow-right"
					:class="{
						'swiper-button-disabled':
							realIndex >= finalData.length - 1,
					}"
					@click="next"
				>
					<Icon name="icon:right" />
				</el-icon>
			</div>
		</div>
		<Swiper
			:slides-per-view="1"
			:allow-touch-move="false"
			:simulate-touch="false"
			class="exclusive-offers__list"
			@swiper="setSwiper"
		>
			<SwiperSlide v-for="(c, i) in finalData" :key="i">
				<nuxt-link
					v-for="item in c"
					:key="item.id"
					:to="$path(`/product/${item.id}`)"
					class="exclusive-offers__item"
				>
					<div class="activity-customize">
						<div class="activity-customize__content">
							<app-image
								:src="item.picUrl"
								class="activity-customize__content-background"
							/>
						</div>
						<div class="exclusive-offers-footer-bar">
							<div class="exclusive-offers-footer-bar__title">
								{{ item.name }}
							</div>
							<div class="exclusive-offers-footer-bar__content">
								<div
									class="exclusive-offers-footer-bar__content-desc"
								>
									{{ item.bargainMinPrice }}
								</div>
								<div
									class="exclusive-offers-footer-bar__content-button"
								>
									{{ $t('Learn More') }}
								</div>
							</div>
						</div>
					</div>
				</nuxt-link>
			</SwiperSlide>
		</Swiper>
	</div>
</template>
