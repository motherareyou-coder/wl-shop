<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-10 13:23:34
  * @Description: 轮播图组件
-->
<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules'
import type { PropType } from 'vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({ name: 'AppSwiper' })

const props = defineProps({
	imgUrls: {
		type: Array as PropType<UrlTypes[]>,
		default: () => [
			{ id: '1', url: '/imgs/1.jpg', desc: 'test' },
			{ id: '2', url: '/imgs/2.jpg', desc: 'test' },
			{ id: '3', url: '/imgs/3.jpg', desc: 'test' },
			{ id: '4', url: '/imgs/4.jpg', desc: 'test' },
		],
	},
})

interface UrlTypes {
	id: string
	url: string
	desc: string
}

const controlledSwiper = ref(null)
function setControlledSwiper(swiper: any) {
	controlledSwiper.value = swiper
}

function onSlideChange() {}

const modules = [A11y, Autoplay, Navigation, Pagination]

const pagination = {
	clickable: true,
	renderBullet(index: number, className: string) {
		return `
			<button class="${className} controller__indicator-container">
				<span class="controller__indicator-wrapper">
					<span class="controller__indicator"></span>
				</span>
			</button>`
	},
}

const indicatorWidth = ref(0)
function onAutoplayTimeLeft(s: any, time: number, progress: number) {
	indicatorWidth.value = 100 - Number.parseInt(`${progress * 100}`, 10)
}
</script>

<template>
	<Swiper
		class="swiper-container"
		:style="{ '--indicator-width': `${indicatorWidth}px` }"
		:slides-per-view="1"
		:modules="modules"
		:loop="true"
		:autoplay="{
			delay: 3000,
			disableOnInteraction: false,
		}"
		navigation
		:pagination="pagination"
		@autoplay-time-left="onAutoplayTimeLeft"
		@swiper="setControlledSwiper"
		@slide-change="onSlideChange"
	>
		<SwiperSlide
			v-for="item in props.imgUrls"
			:key="item.id"
			style="height: var(--banner-height)"
		>
			<el-image
				style="width: 100%; height: 100%"
				:src="item.url"
				:alt="item.desc"
				fit="cover"
			>
				<template #placeholder>
					<div>{{ item.desc }}</div>
				</template>
			</el-image>
		</SwiperSlide>
	</Swiper>
</template>

<style lang="scss">
.swiper-container {
	--swiper-theme-color: #fff;

	&:hover {
		.swiper-button-prev,
		.swiper-button-next {
			opacity: 1;
			transition: opacity 0.5s ease-in-out;
		}
	}

	.swiper-button-prev,
	.swiper-button-next {
		width: 48px;
		height: 48px;
		background: rgba(192, 192, 192, 0.5);
		border-radius: 18px;
		opacity: 0;
		transition: opacity 0.5s ease-in-out;

		&::after {
			transform: scale(0.5);
		}

		&:hover {
			background: silver;
		}
	}

	.swiper-button-prev {
		left: 50px;
	}

	.swiper-button-next {
		right: 50px;
	}

	.controller__indicator-container {
		width: 100px;
		height: 20px;
		background: none;

		.controller__indicator-wrapper {
			width: 100px;
			height: 2px;
			display: block;
			line-height: 20px;
			background: rgb(109, 109, 109);
		}

		&.swiper-pagination-bullet-active {
			.controller__indicator-wrapper {
				background: rgba(109, 109, 109, 0.2);
				.controller__indicator {
					height: 2px;
					width: var(--indicator-width);
					display: block;
					background: #ff6900;
				}
			}
		}
	}
}
</style>
