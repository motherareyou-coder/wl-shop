<script setup lang="ts">
import type { Swiper as SwiperClass, SwiperOptions } from 'swiper/types'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Category } from '~/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({ name: 'AppFeature' })

// 使用异步数据加载，避免阻塞渲染
const { data: categories, pending } = await useAPI<Category[]>(
	'product/category/list/featured/top',
	{
		params: { num: 5 },
		lazy: false,
		dedupe: 'defer',
	}
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
		
		<!-- 加载状态 -->
		<div v-if="pending" class="feature-skeleton">
			<div class="skeleton-tabs">
				<div v-for="i in 5" :key="i" class="skeleton-tab" />
			</div>
			<div class="skeleton-content">
				<div class="skeleton-main" />
				<div class="skeleton-items">
					<div v-for="i in 4" :key="i" class="skeleton-item" />
				</div>
			</div>
		</div>
		
		<div v-else class="feature-tab__container">
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
									<NuxtImg
										class="mi-image item-image"
										:src="c.picUrl"
										:alt="c.name"
										loading="lazy"
										:preset="i === 0 ? 'product' : 'thumbnail'"
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

<style lang="scss" scoped>
.feature-skeleton {
	padding: 20px;
	
	.skeleton-tabs {
		display: flex;
		gap: 16px;
		margin-bottom: 24px;
		overflow-x: auto;
	}
	
	.skeleton-tab {
		height: 40px;
		width: 100px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 4px;
		flex-shrink: 0;
	}
	
	.skeleton-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}
	
	.skeleton-main {
		height: 400px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 8px;
	}
	
	.skeleton-items {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	
	.skeleton-item {
		height: 190px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 8px;
	}
}

@keyframes loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}
</style>
