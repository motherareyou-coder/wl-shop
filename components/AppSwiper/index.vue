<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-10 13:23:34
  * @Description: 轮播图组件
-->
<script setup lang="ts">
import type { Swiper as SwiperClass, SwiperOptions } from 'swiper/types'
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import './index.scss'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({ name: 'AppSwiper' })
const props = defineProps({
	data: { type: Array },
})
const data = toRef(props, 'data') as Ref<string[]>

let swiper: SwiperClass | null = null
const realIndex = ref(0)
const paused = ref(false)
function setSwiper(s: SwiperClass) {
	swiper = s
}

function onSlideChange() {
	realIndex.value = swiper?.realIndex as number
}
function slideTo(i: number) {
	swiper?.slideTo(i)
}
function pause() {
	if (!swiper)
		return
	swiper.autoplay.pause()
}
function resume() {
	if (!swiper)
		return
	swiper.autoplay.resume()
}
function prev() {
	swiper?.slidePrev()
}
function next() {
	swiper?.slideNext()
}
function updatePause() {
	if (!swiper)
		return
	paused.value = swiper.autoplay.paused
}

const modules = [Autoplay]

const indicatorWidth = ref(0)
function onAutoplayTimeLeft(s: any, time: number, progress: number) {
	indicatorWidth.value = 100 - Number.parseInt(`${progress * 100}`, 10)
}
</script>

<template>
	<div class="carousel-banner carousel-banner--light">
		<div class="carousel-banner__swiper">
			<Swiper
				class="swiper-container"
				:style="{ '--indicator-progress-width': `${indicatorWidth}px` }"
				:slides-per-view="1"
				:modules="modules"
				:loop="true"
				:autoplay="{
					delay: 3000,
					disableOnInteraction: false,
				}"
				@autoplay-pause="updatePause"
				@autoplay-resume="updatePause"
				@autoplay-time-left="onAutoplayTimeLeft"
				@swiper="setSwiper"
				@slide-change="onSlideChange"
			>
				<SwiperSlide
					v-for="item in data"
					:key="item"
					style="height: var(--banner-height)"
				>
					<div class="carousel-banner__slide">
						<app-image
							style="width: 100%; height: 100%"
							:src="item"
							fit="cover"
              :alt="item.title"
							class="slide__background"
						/>
					</div>
				</SwiperSlide>
				<div
					v-if="data.length > 1"
					class="carousel-banner__swiper-navigator carousel-banner__swiper-navigator--prev"
				>
					<button
						class="controller__button navigator__button navigator__button--prev with-transition"
            aria-label="prev"
						@click="prev"
					>
						<i
							class="micon micon-fill-arrow-left navigator__icon with-transition mirror"
						>
						</i>
					</button>
				</div>
				<div
					v-if="data.length > 1"
					class="carousel-banner__swiper-navigator carousel-banner__swiper-navigator--next"
				>
					<button
						class="controller__button navigator__button navigator__button--next with-transition"
            aria-label="next"
						@click="next"
					>
						<i
							class="micon micon-fill-arrow-right navigator__icon with-transition mirror"
						>
						</i>
					</button>
				</div>
				<div v-if="data.length > 1" class="carousel-banner__swiper-controller-wrapper">
					<div
						class="carousel-banner__swiper-controller site-container"
					>
						<button
							v-for="(item, i) in data"
							:key="item"
							:class="{
								'controller__bar--current': realIndex === i,
							}"
							class="controller__button controller__bar with-transition"
							@click.prevent="slideTo(i)"
						>
							<span
								class="controller__indicator-container with-transition"
							>
								<span class="controller__indicator"></span>
							</span>
						</button>
						<button
							class="controller__button controller__icon-container with-transition"
						>
							<el-icon class="controller__icon with-transition">
								<ElIconVideoPlay
									v-if="paused"
									@click.prevent="resume"
								/>
								<ElIconVideoPause v-else @click.prevent="pause" />
							</el-icon>
						</button>
					</div>
				</div>
			</Swiper>
		</div>
	</div>
</template>
