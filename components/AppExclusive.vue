<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({ name: 'AppExclusive' })

const list = ref([
	{
		label: 'Daily Picks',
		img: '/imgs/1.jpg',
		desc: 'Boost your business with Xiaomi products.',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
	},
	{
		label: 'Daily Picks',
		img: '/imgs/2.jpg',
		desc: 'Boost your business with Xiaomi products.',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
	},
	{
		label: 'Daily Picks',
		img: '/imgs/3.jpg',
		desc: 'Boost your business with Xiaomi products.',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
	},
	{
		label: 'Daily Picks',
		img: '/imgs/4.jpg',
		desc: 'Boost your business with Xiaomi products.',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
	},
	{
		label: 'Daily Picks',
		img: '/imgs/4.jpg',
		desc: 'Boost your business with Xiaomi products.',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
	},
])

let swiper = null
const activeIndex = ref(0)
function setControlledSwiper(d) {
	swiper = d
}
function next() {
	swiper?.slideNext()
	swiper?.slideNext()
	swiper?.slideNext()
	activeIndex.value = swiper.activeIndex
}
function prev() {
	swiper?.slidePrev()
	swiper?.slidePrev()
	swiper?.slidePrev()
	activeIndex.value = swiper.activeIndex
}
</script>

<template>
	<div class="app-exclusive">
		<div class="header">
			<div></div>
			<div class="title">
				Exclusive Offers
			</div>
			<div class="arrow">
				<el-icon :class="{ disabled: activeIndex === 0 }" @click="prev">
					<ElIconArrowLeft />
				</el-icon>
				<el-icon
					:class="{ disabled: activeIndex + 3 >= list.length }"
					@click="next"
				>
					<ElIconArrowRight />
				</el-icon>
			</div>
		</div>
		<div class="swipper-wrapper">
			<Swiper
				:slides-per-view="3"
				:modules="[A11y, Autoplay, Navigation, Pagination]"
				:allow-touch-move="false"
				:simulate-touch="false"
				@swiper="setControlledSwiper"
			>
				<SwiperSlide v-for="item in list" :key="item.img">
					<nuxt-link :to="item.url">
						<picture>
							<img :src="item.img">
						</picture>
						<div class="item-info">
							<div class="title">
								{{ item.label }}
							</div>
							<div class="item-info__translate">
								<div class="desc">
									{{ item.desc }}
								</div>
								<div class="item-info__button-wrapper">
									<button>Learn More</button>
								</div>
							</div>
						</div>
					</nuxt-link>
				</SwiperSlide>
			</Swiper>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.app-exclusive {
	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 32px;
		margin-bottom: var(--title-content-gap);
		position: relative;
		.title {
			color: #000;
			font-weight: 700;
			line-height: 1;
			font-size: 32px;
		}
		.arrow {
			position: absolute;
			right: 0;
			.el-icon {
				cursor: pointer;
				font-size: 16px;
				width: 30px;
				height: 30px;
				background-color: #d1d1d1;
				border-radius: 10px;
				color: var(--text-reverse);
				margin-inline-start: 25px;
				&.disabled {
					background-color: #e1e1e1;
					cursor: auto;
				}
			}
		}
	}
	.swipper-wrapper {
		.swiper-slide {
			display: inline-block;
			background-color: #fff;
			flex-shrink: 0;
			margin-inline-end: 20px;
			width: calc(33.3333% - 14px) !important;
			position: relative;
			padding: 16px;
			box-sizing: border-box;
			img {
				--mi-image-height: 258px;
				border-radius: 10px;
				transition: 0.5s;
				height: var(--mi-image-height);
				object-fit: cover;
				object-position: center;
				width: 100%;
				@media screen and (min-width: 1025px) and (max-width: 1440px) {
					height: 258px;
				}
			}
			.item-info {
				text-align: center;
				margin-top: 32px;
				@media screen and (min-width: 1025px) and (max-width: 1440px) {
					margin-top: 32px;
				}
				.title {
					@media screen and (min-width: 1025px) and (max-width: 1440px) {
						font-size: 18px;
					}
					line-clamp: 1;
					color: #191919;
					display: flex;
					font-weight: 700;
					overflow: hidden;
					text-align: center;
					text-overflow: ellipsis;
					word-break: break-word;
					z-index: 2;
				}
			}
			.item-info__translate {
				margin-top: 12px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				position: relative;
				width: 100%;
				text-align: center;
				align-items: center;
			}
			.item-info__button-wrapper {
				left: 0;
				opacity: 0;
				position: absolute;
				top: 100%;
				transition: all 0.3s;
				width: 100%;
				button {
					background: #191919;
					border-radius: 10.5px;
					color: #fff;
					display: inline-block;
					font-weight: 700;
					margin-top: 7px;
					padding: 6px 12px;
					transition: 0.3s;
					cursor: pointer;
					@media screen and (min-width: 1025px) and (max-width: 1440px) {
						font-size: 12px;
					}
				}
			}
			.desc {
				line-clamp: 2;
				display: flex;
				height: 50px;
				opacity: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				transition: 0.3s;
				word-break: break-word;
				z-index: 1;
			}
			&:hover {
				.item-info__button-wrapper {
					opacity: 1;
					top: 50%;
					transform: translateY(-50%);
					transition-delay: 0.2s;
				}
				.desc {
					opacity: 0;
					transform: translateY(-10px);
				}
			}
		}
	}
}
</style>
