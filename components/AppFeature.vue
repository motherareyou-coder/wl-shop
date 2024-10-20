<script setup lang="ts">
import './AppFeature.scss'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperClass, SwiperOptions } from 'swiper/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import type { Category } from '~/types'

defineOptions({ name: 'AppFeature' })
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: categories } = await useAPI<Category[]>(
	'product/category/list/featured/top?apifoxApiId=211955118',
	{ params: { num: 5 } },
)
watch(categories, (v) => {
	v?.forEach(async (d) => {
		$api('product/spu/page?apifoxApiId=211495718', {
			params: {
				categoryId: d.id,
				pageNo: 1,
				pageSize: 5,
			},
		}).then((res) => {
			d.children = res.list
		})
	})
}, { immediate: true })

let swiper: SwiperClass | null = null
const realIndex = ref(0)
function setSwiper(s: SwiperClass) {
	swiper = s
}
function slideTo(i: number) {
	if (!swiper)
		return
	swiper.slideTo(i)
	realIndex.value = swiper.realIndex
}
</script>

<template>
	<div class="feature-tab feature-tab--full">
		<div class="feature-tab-title">
			{{ $t('Featured Products') }}
		</div>
		<div class="feature-tab__container">
			<div class="feature-tab__header">
				<div class="tab-header__wrapper">
					<div
						v-for="(c, i) in categories"
						:key="c.id"
						class="feature-tab__item"
						:class="{ 'feature-tab--active': realIndex === i }"
						@click="slideTo(i)"
					>
						<div>{{ c.name }}</div>
					</div>
				</div>
			</div>
			<div class="feature-tab__pane">
				<Swiper
					:slides-per-view="1"
					:allow-touch-move="false"
					:simulate-touch="false"
					@swiper="setSwiper"
				>
					<SwiperSlide
						v-for="cat in categories"
						:key="cat.id"
						class="swiper-wrapper"
					>
						<div
							class="feature-tab-content feature-tab-content--1left4 feature-tab-content--1C-4S"
						>
							<nuxt-link
								v-for="(c, i) in cat.children"
								:key="c.id"
								:to="localePath(`/product/${c.id}`, locale)"
								class="feature-tab--item"
								:class="[
									i === 0
										? 'feature-tab--item-main'
										: 'feature-tab--item-other',
								]"
							>
								<div class="image-block">
									<app-image
										class="mi-image item-image"
										:src="c.picUrl"
									/>
								</div>
								<div class="item-info">
									<h2 class="item-info__title">
										{{ c.name }}
									</h2>
									<div class="item-info__translate">
										<product-price
											v-if="i !== 0"
											class="mi-price item-info__price"
											:data="c.price"
										/>
										<div class="item-info__button-wrapper">
											<button class="mi-btn app-button">
												{{ t('Learn More') }}
											</button>
										</div>
									</div>
								</div>
							</nuxt-link>
						</div>
					</SwiperSlide>
				</Swiper>
			</div>
		</div>
	</div>
</template>
