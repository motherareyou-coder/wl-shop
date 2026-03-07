<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-10 13:23:34
  * @Description: 轮播图组件
-->
<script setup lang="ts">
import type { Swiper as SwiperClass, SwiperOptions } from 'swiper/types'
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({ name: 'AppSwiper' })

interface Banner {
	id: string
	title: string
	url: string
	picUrl: string
	h5PicUrl: string
}

// 使用异步数据加载，避免阻塞渲染
const { data, pending } = await useAPI<Banner[]>(
	'promotion/banner/list',
	{
		params: { position: 1 },
		lazy: false,
		dedupe: 'defer',
	}
)

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

const router = useRouter()
function onClick({ id, url }: Banner) {
	if (id) {
		$api('promotion/banner/add-browse-count', {
			method: 'put',
			params: { id },
		}).then(() => {
			// 添加点击量,并跳转
			router.push($path(`${url}`))
		})
	}
}

const appStore = useAppStore()
</script>

<template>
	<div class="carousel-banner carousel-banner--light">
		<!-- 加载状态 -->
		<div v-if="pending" class="carousel-banner__skeleton">
			<div class="skeleton-banner" />
		</div>
		
		<div v-else class="carousel-banner__swiper">
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
					:key="item.id"
					style="height: var(--banner-height)"
					@click.prevent="onClick(item)"
				>
					<div class="carousel-banner__slide">
						<NuxtImg
							v-if="appStore.isPC"
							style="width: 100%; height: 100%"
							:src="item.picUrl"
							:alt="item.title"
							fit="cover"
							class="slide__background"
							loading="eager"
							preset="banner"
						/>
						<NuxtImg
							v-if="appStore.isMobile"
							style="width: 100%; height: 100%"
							:src="item.h5PicUrl"
							:alt="item.title"
							fit="cover"
							class="slide__background"
							loading="eager"
							preset="banner"
						/>
					</div>
				</SwiperSlide>
				<div
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
				<div class="carousel-banner__swiper-controller-wrapper">
					<div
						class="carousel-banner__swiper-controller site-container"
					>
						<button
							v-for="(item, i) in data"
							:key="item.id"
							:class="{
								'controller__bar--current': realIndex === i,
							}"
							class="controller__button controller__bar with-transition"
							aria-label="slide"
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
							aria-label="resume"
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

<style lang="scss">
@import url('./AppSwiper.scss');
</style>

<style lang="scss" scoped>
.carousel-banner {
	position: relative;
	width: 100%;
	overflow: hidden;
}

.carousel-banner__skeleton {
	width: 100%;
	height: var(--banner-height, 400px);
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: loading 1.5s infinite;
}

.skeleton-banner {
	width: 100%;
	height: 100%;
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
