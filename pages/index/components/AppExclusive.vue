<script setup lang="ts">
import type { Swiper as SwiperClass } from 'swiper/types'
import type { SeckillActivity, SeckillConfig } from '~/types'
import { chunk } from 'lodash-es'
import { Swiper, SwiperSlide } from 'swiper/vue'
import PicksH5 from '@/assets/imgs/daily-picks-banner--mobile.webp'
import Picks from '@/assets/imgs/daily-picks-banner.webp'
import CouponImg from '@/assets/imgs/gift3-3.webp'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({ name: 'AppExclusive' })

const { t } = useI18n()
const data = ref([])
const appStore = useAppStore()
Promise.all([
	$api<{ config: SeckillConfig, activities: [SeckillActivity] }>('promotion/seckill-activity/get-now')
		.then((res) => {
			if (!res || !res.activities || !res.config)
				return null // 校验返回值
			return {
				// picUrl: res?.activities?.[0]?.picUrl || res?.config?.sliderPicUrls,
				picUrl: appStore.isPC ? Picks : PicksH5,
				url: '/seckill',
				startTime: res?.config?.startTime,
				endTime: res?.config?.endTime,
				name: t('Daily Seckill'),
				desc: res?.activities?.[0]?.name,
				icon: 'micon micon-lightning-solid',
			}
		},
			// ({
			//   picUrl: res?.activities?.[0]?.picUrl || res?.config?.sliderPicUrls,
			//   // spuId: res?.activities[0]?.spuId,
			//   url: '/seckill',
			//   startTime: res?.config?.startTime,
			//   endTime: res?.config?.endTime,
			//   name: t('Daily Seckill'),
			//   desc: res?.activities?.[0]?.name,
			//   icon: 'micon micon-lightning-solid',
			// })
		),
	$api('promotion/combination-activity/page', {
		params: { pageNo: 1, pageSize: 1 },
	}).then((res) => {
		if (!res || !res.list || res.list.length === 0)
			return null // 校验返回值
		return {
			picUrl: res?.list?.[0]?.picUrl,
			desc: res?.list?.[0]?.name,
			url: '/combination',
			icon: 'micon micon-bag-solid',
			name: t('Group Buying Event'),
		}
	},
		// ({
		//   picUrl: res?.list?.[0]?.picUrl,
		//   desc: res?.list?.[0]?.name,
		//   // spuId: res.list[0]?.spuId,
		//   url: '/combination',
		//   icon: 'micon micon-bag-solid',
		//   name: t('Group Buying Event'),
		// })
	),
	$api('promotion/bargain-activity/page', {
		params: { pageNo: 1, pageSize: 1 },
	}).then((res) => {
		if (!res || !res.list || res.list.length === 0)
			return null // 校验返回值
		return {
			picUrl: res?.list?.[0]?.picUrl,
			desc: res?.list?.[0]?.name,
			icon: 'micon micon-calendar-solid',
			name: t('Bargin Event'),
			url: '/bargin',
		}
	},
		//     ({
		// 	picUrl: res?.list?.[0]?.picUrl,
		// 	desc: res?.list?.[0]?.name,
		// 	icon: 'micon micon-calendar-solid',
		// 	name: t('Bargin Event'),
		// 	url: '/bargin',
		// })
	),
	$api('promotion/coupon-template/page', {
		params: { pageNo: 1, pageSize: 1 },
	}).then((res) => {
		if (!res || !res.list || res.list.length === 0)
			return null // 校验返回值
		return {
			picUrl: CouponImg,
			desc: res?.list?.[0]?.description,
			icon: 'micon micon-calendar-solid',
			name: t('Coupon collection'),
			url: '/coupon',
		}
	},
		// ({
		// 		picUrl: CouponImg,
		// 		desc: res?.list?.[0]?.description,
		// 		icon: 'micon micon-calendar-solid',
		// 		name: t('Coupon collection'),
		// 		url: '/coupon',
		// 	})
	),
]).then((list) => {
	// data.value = list
	// console.log(data)
	// console.log(data.value)
	data.value = list.filter(item => item !== null)
	// console.log(data.value)
})

// const finalData = computed(() => chunk(data.value, 3))
const finalData = computed(() => {
	const validData = data.value.filter(item => item !== null) // 再次过滤无效数据
	return chunk(validData, 3)
	// return chunk(validData, validData.length);
})

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

const router = useRouter()

function goDetail(item) {
	// console.log(item)
	if (item.spuId)
		router.push($path(`/produtct/${item.spuId}`))
	else if (item.url)
		router.push($path(item.url))
}
</script>

<template>
	<div class="exclusive-offers exclusive-offers--full">
		<div class="exclusive-offers__header">
			<div class="exclusive-offers__header-text">
				{{ $t('All Promotions') }}
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
			v-if="finalData.length > 0"
			:slides-per-view="1"
			:allow-touch-move="false"
			:simulate-touch="false"
			class="exclusive-offers__list"
			@swiper="setSwiper"
		>
			<SwiperSlide v-for="(c, i) in finalData" :key="i">
				<div v-for="(item, j) in c" :key="j" class="exclusive-offers__item">
					<div class="activity-customize" @click="goDetail(item)">
						<div class="activity-customize__content">
							<!-- class="mi-image activity-customize__content-background" -->
							<app-image
								:src="item.picUrl"
								class="mi-image activity-customize__content-background"
								:alt="item.name"
							/>
						</div>
						<div class="exclusive-offers-footer-bar">
							<div class="exclusive-offers-footer-bar__title">
								<i v-if="item.icon" :class="item.icon"></i>
								{{ item.name }}
							</div>
							<div class="exclusive-offers-footer-bar__content">
								<div
									class="exclusive-offers-footer-bar__content-desc"
								>
									{{ item.desc }}
								</div>
								<div
									class="exclusive-offers-footer-bar__content-button"
								>
									{{ $t('Learn More') }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</SwiperSlide>
		</Swiper>
		<div v-else class="exclusive-offers__no-data">
			{{ $t('No promotions available') }}
		</div>
	</div>
</template>

<style lang="scss">
@import url('./AppExclusive.scss');
</style>
