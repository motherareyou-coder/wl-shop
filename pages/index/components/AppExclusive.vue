<script setup lang="ts">
import type {Swiper as SwiperClass, SwiperOptions} from 'swiper/types'
import CouponImg from '@/assets/imgs/gift3-3.webp'
import Picks from '@/assets/imgs/daily-picks-banner.webp'
import PicksH5 from '@/assets/imgs/daily-picks-banner--mobile.webp'
import {chunk} from 'lodash-es'
import {A11y, Autoplay, Navigation, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/vue'
import type {SeckillActivity, SeckillConfig} from '~/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({name: 'AppExclusive'})

const {t} = useI18n()
const appStore = useAppStore()

// 使用异步数据加载，避免阻塞渲染
const { data, pending, error, refresh: refreshData } = await useAsyncData(
	'exclusive-offers',
	async () => {
		try {
			const { $api } = useNuxtApp()
			const list = await Promise.all([
				$api<{ config: SeckillConfig, activities: [SeckillActivity] }>('promotion/seckill-activity/get-now')
					.then(res => {
						if (!res || !res.activities || !res.config) return null;
						return {
							picUrl: appStore.isPC ? Picks : PicksH5,
							url: '/seckill',
							startTime: res?.config?.startTime,
							endTime: res?.config?.endTime,
							name: t('Daily Seckill'),
							desc: res?.activities?.[0]?.name,
							icon: 'micon micon-lightning-solid',
						};
					})
					.catch(() => null),
				$api('promotion/combination-activity/page', {
					params: {pageNo: 1, pageSize: 1},
				}).then(res => {
					if (!res || !res.list || res.list.length === 0) return null;
					return {
						picUrl: res?.list?.[0]?.picUrl,
						desc: res?.list?.[0]?.name,
						url: '/combination',
						icon: 'micon micon-bag-solid',
						name: t('Group Buying Event'),
					};
				})
				.catch(() => null),
				$api('promotion/bargain-activity/page', {
					params: {pageNo: 1, pageSize: 1},
				}).then(res => {
					if (!res || !res.list || res.list.length === 0) return null;
					return {
						picUrl: res?.list?.[0]?.picUrl,
						desc: res?.list?.[0]?.name,
						icon: 'micon micon-calendar-solid',
						name: t('Bargin Event'),
						url: '/bargin',
					};
				})
				.catch(() => null),
				$api('promotion/coupon-template/page', {
					params: {pageNo: 1, pageSize: 1},
				}).then(res => {
					if (!res || !res.list || res.list.length === 0) return null;
					return {
						picUrl: CouponImg,
						desc: res?.list?.[0]?.description,
						icon: 'micon micon-calendar-solid',
						name: t('Coupon collection'),
						url: '/coupon',
					};
				})
				.catch(() => null),
			])
			return list.filter(item => item !== null)
		} catch (e) {
			console.error('Failed to fetch exclusive offers:', e)
			throw e
		}
	},
	{
		server: true,
		lazy: false,
		default: () => [],
	}
)

const finalData = computed(() => {
	if (!data.value) return []
	const validData = data.value.filter(item => item !== null);
	return chunk(validData, 3);
});

// 刷新数据
const refresh = () => {
	refreshData()
}

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
					<Icon name="icon:left"/>
				</el-icon>
				<el-icon
					class="exclusive-offers__header-arrow-right"
					:class="{
						'swiper-button-disabled':
							realIndex >= finalData.length - 1,
					}"
					@click="next"
				>
					<Icon name="icon:right"/>
				</el-icon>
			</div>
		</div>
		
		<!-- 加载状态 -->
		<div v-if="pending" class="exclusive-skeleton">
			<div class="skeleton-grid">
				<div v-for="i in 4" :key="i" class="skeleton-card">
					<div class="skeleton-image" />
					<div class="skeleton-info">
						<div class="skeleton-title" />
						<div class="skeleton-desc" />
					</div>
				</div>
			</div>
		</div>
		
		<!-- 错误状态 -->
		<div v-else-if="error" class="exclusive-error">
			<div class="error-content">
				<i class="micon micon-error error-icon"></i>
				<p class="error-text">{{ $t('Failed to load promotions') }}</p>
				<button class="error-retry" @click="refresh()">
					{{ $t('Retry') }}
				</button>
			</div>
		</div>
		
		<Swiper
			v-else-if="finalData.length > 0"
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
							<NuxtImg
								:src="item.picUrl"
								class="mi-image activity-customize__content-background"
								:alt="item.name"
								loading="lazy"
								preset="product"
							/>
							<div class="activity-customize__content-info">
								<div class="activity-customize__content-info-title">
									<i :class="item.icon"></i>
									<span>{{ item.name }}</span>
								</div>
								<div class="activity-customize__content-info-desc">
									{{ item.desc }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</SwiperSlide>
		</Swiper>
	</div>
</template>

<style lang="scss">
@import url('./AppExclusive.scss');
</style>

<style lang="scss" scoped>
.exclusive-skeleton {
	padding: 20px;
	
	.skeleton-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
	}
	
	.skeleton-card {
		background: #f5f5f5;
		border-radius: 8px;
		overflow: hidden;
	}
	
	.skeleton-image {
		height: 150px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}
	
	.skeleton-info {
		padding: 16px;
	}
	
	.skeleton-title {
		height: 20px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 4px;
		margin-bottom: 8px;
	}
	
	.skeleton-desc {
		height: 16px;
		width: 60%;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 4px;
	}
}

.exclusive-error {
	padding: 40px 20px;
	text-align: center;
	
	.error-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}
	
	.error-icon {
		font-size: 48px;
		color: #ff6900;
	}
	
	.error-text {
		font-size: 14px;
		color: #666;
		margin: 0;
	}
	
	.error-retry {
		padding: 8px 24px;
		background: #ff6900;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
		transition: background 0.3s;
		
		&:hover {
			background: #e55a00;
		}
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
