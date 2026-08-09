<script setup lang="ts">
import { ORDER_STATUS_NUM_MAP, ORDER_TYPE_MAP, fmtYuan, parseItinerary } from '~/types/travel'

const route = useRoute()
const id = Number(route.params.id)
definePageMeta({ title: '旅行订单分享' })

const { domain } = useRuntimeConfig().public
useSEO({
	title: 'iswink 旅行服务',
	description: '查看这个精彩的旅行行程，来 iswink 定制您的专属中国之旅',
	breadcrumbs: [{ name: 'Home', url: domain }],
})

const { get: getOrder } = useTravelOrderApi()
const loading = ref(true)
const detail = ref<any>()

async function load() {
	try { detail.value = await getOrder(id) } catch {}
	finally { loading.value = false }
}
// 分享页不要求登录，但后端需要归属校验——匿名访问可能返回空
// 后续后端需提供匿名可访问的分享详情接口
await load()

const orderTypeLabel = computed(() => ORDER_TYPE_MAP[Number(detail.value?.orderType)] || '旅行服务')
function itineraryDays(json?: string) { return parseItinerary(json) }
const firstLine = computed(() => detail.value?.lines?.[0])
</script>

<template>
	<div class="share-page">
		<div v-if="loading" class="share-loading">加载中...</div>
		<div v-else-if="!detail" class="share-fallback">
			<div class="share-fallback__icon">✈️</div>
			<h1>精彩的旅行行程</h1>
			<p>来 iswink 定制您的专属中国之旅</p>
			<NuxtLink class="cta-btn" :to="$path('/custom')">免费定制行程</NuxtLink>
		</div>
		<div v-else class="share-content">
			<!-- Hero -->
			<div class="share-hero">
				<div class="share-hero__bg" />
				<div class="share-hero__inner">
					<span class="share-hero__type">{{ orderTypeLabel }}</span>
					<h1 class="share-hero__title">{{ detail.itinerarySummary || '精彩旅行行程' }}</h1>
					<div v-if="firstLine" class="share-hero__meta">
						<span>{{ firstLine.destination }}</span>
						<span v-if="firstLine.startDate">{{ firstLine.startDate }}</span>
					</div>
				</div>
			</div>

			<!-- 行程安排 -->
			<div v-if="firstLine && itineraryDays(firstLine.itineraryDetail).length" class="share-section">
				<h2 class="share-section__title">行程安排</h2>
				<div v-for="(day, di) in itineraryDays(firstLine.itineraryDetail)" :key="di" class="share-day">
					<span class="share-day__no">Day{{ day.day || di + 1 }}</span>
					<div><span v-if="day.title" class="share-day__title">{{ day.title }}</span><span v-if="day.desc" class="share-day__desc">{{ day.desc }}</span></div>
				</div>
			</div>

			<!-- CTA -->
			<div class="share-cta">
				<h2>想要这样的旅行？</h2>
				<p>iswink 专业定制您的专属中国之旅</p>
				<NuxtLink class="cta-btn" :to="$path('/custom')">免费定制行程 →</NuxtLink>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.share-page { min-height: 100vh; background: #f5f5f5; }
.share-loading, .share-fallback { text-align: center; padding: 120px 20px; }
.share-fallback {
	&__icon { font-size: 64px; margin-bottom: 16px; }
	h1 { font-size: 24px; font-weight: 700; margin: 0 0 8px; }
	p { font-size: 15px; color: #898989; margin: 0 0 24px; }
}
.share-hero { position: relative; padding: 60px 32px 48px; overflow: hidden;
	&__bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1C1917, #292524);
		&::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 30%, rgba(161,98,7,.25), transparent 50%); } }
	&__inner { position: relative; z-index: 1; text-align: center; }
	&__type { font-size: 13px; color: #CA8A04; padding: 4px 14px; border: 1px solid rgba(202,138,4,.4); border-radius: 999px; }
	&__title { font-size: clamp(22px, 4vw, 32px); font-weight: 800; color: #fff; margin: 16px 0 12px; }
	&__meta { display: flex; gap: 16px; justify-content: center; font-size: 15px; color: rgba(255,255,255,.7); }
}
.share-section { max-width: 600px; margin: 0 auto; padding: 32px 20px;
	&__title { font-size: 20px; font-weight: 700; margin: 0 0 16px; color: #191919; }
}
.share-day { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #eee;
	&__no { font-size: 14px; font-weight: 700; color: #A16207; min-width: 50px; }
	&__title { font-size: 15px; font-weight: 500; display: block; }
	&__desc { font-size: 13px; color: #898989; display: block; margin-top: 2px; }
}
.share-cta { text-align: center; padding: 48px 20px 80px;
	h2 { font-size: 22px; font-weight: 700; margin: 0 0 8px; } p { font-size: 15px; color: #898989; margin: 0 0 24px; }
}
.cta-btn { display: inline-flex; padding: 14px 32px; background: linear-gradient(135deg, #A16207, #CA8A04); color: #fff; border-radius: 999px; font-size: 16px; font-weight: 600; text-decoration: none; transition: transform .2s;
	&:hover { transform: translateY(-2px); }
}
</style>
