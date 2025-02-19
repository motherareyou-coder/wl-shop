<script setup lang="ts">
import type { SeckillActivity, SeckillConfig } from '~/types'
import Picks from './components/Picks.vue'
import './index.scss'

useHead({
	title: `${$t('Daily Picks')} ${$t('appTitle')}`,
})

const { shortDomain } = useRuntimeConfig().public
const { gtag } = useGtag()
//秒杀活动页面埋点
gtag('event', 'screen_view', {
  app_name: shortDomain,
  screen_name: 'seckill-list'
})
const appStore = useAppStore()

const { data: timeList } = await useAPI<SeckillConfig[]>('promotion/seckill-config/list')
const { data } = await useAPI<{ config: SeckillConfig, activities: [SeckillActivity] }>('promotion/seckill-activity/get-now')

const currentIndex = ref(0)
const current = ref<SeckillConfig>()

function handleClick(item: SeckillConfig, i: number) {
	current.value = item
	currentIndex.value = i
}

const dayjs = useDayjs()
const today = dayjs().format('YYYY-MM-DD')
const ulRef = ref()
watch([timeList, data], () => {
	current.value = timeList.value[currentIndex.value]
	timeList.value?.forEach((d, i) => {
		d.startTimeStamp = new Date(`${today} ${d.startTime}`).getTime()
		d.endTimeStamp = new Date(`${today} ${d.endTime}`).getTime()
		if (d.id === data.value?.config?.id) {
			handleClick(d, i)
			nextTick(() => {
				ulRef.value?.children[currentIndex.value]?.scrollIntoView()
			})
		}
	})
}, { immediate: true })

onMounted(() => {
	ulRef.value?.children[currentIndex.value]?.scrollIntoView()
})

const now = ref(0)
provide('now', now)
const timer = setInterval(() => {
	now.value = new Date().getTime()
}, 1000)
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
	<div class="daily-picks">
		<section class="site-grid site-grid--none site-grid--full">
			<div
				class="site-banner site-banner--dark site-banner--right site-banner--full site-banner--links site-banner--links--undefined site-banner--links--style-1"
			>
				<AppSwiper v-if="current" :key="current.id" :data="current.sliderPicUrls" />
				<img v-else-if="appStore.isPC" class="site-banner__image" src="@/assets/imgs/daily-picks-banner.webp">
				<img
					v-else-if="appStore.isMobile" class="site-banner__image"
					src="@/assets/imgs/daily-picks-banner--mobile.webp"
				>
			</div>
		</section>
		<section class="site-grid site-grid--store-large-special site-grid--full " style="margin-top: 0;">
			<div class="daily-picks-area">
				<aside class="daily-picks-area__aside">
					<div role="heading" style="padding:0">
						<el-scrollbar>
							<ul ref="ulRef" class="daily-picks-area__date-list">
								<li
									v-for="(item, i) in timeList" :key="item.id" class="daily-picks-area__date-item"
									:class="{ 'daily-picks-area__date-item--active': current === item }"
									@click="handleClick(item, i)"
								>
									<a>
										{{ item.startTime }}
										<template v-if="item.endTimeStamp < now ">{{ $t('ENDED') }}</template>
										<template v-else-if="item.startTimeStamp > now">{{ $t('NOT STARTED') }}</template>
										<template v-else>{{ $t('IN PRORESS') }}</template>
									</a>
								</li>
							</ul>
						</el-scrollbar>
					</div>
				</aside>
				<keep-alive>
					<Picks v-if="current" :id="current.id" :key="current.id" :end-time="current.endTimeStamp" :start-time="current.startTimeStamp" />
				</keep-alive>
			</div>
		</section>
	</div>
</template>
