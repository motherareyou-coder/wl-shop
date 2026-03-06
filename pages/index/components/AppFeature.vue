<script setup lang="ts">
import type { Swiper as SwiperClass } from 'swiper/types'
import type { Category } from '~/types'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({ name: 'AppFeature' })

const { data: categories } = await useAPI<Category[]>(
	'product/category/list/featured/top',
	{ params: { num: 5 } },
)

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
								v-for="(c, i) in cat.childProduct"
								:key="c.id"
								:to="$path(`/product/${c.id}`)"
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
										:alt="c.name"
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
											<el-button type="info">
												{{ $t('Learn More') }}
											</el-button>
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

<style lang="scss">
@import url('./AppFeature.scss');
</style>
