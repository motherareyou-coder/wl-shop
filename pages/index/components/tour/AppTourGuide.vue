<script setup lang="ts">
import type { Article } from '~/types'

defineOptions({ name: 'AppTourGuide' })

// 对接现有文章体系（SEO 长尾关键词主力）―― 遵守 API 规范：SSR + 三分支
const { data, pending, error, refresh } = await useAPI<Article[]>(
	'promotion/article/page',
	{
		params: { pageNo: 1, pageSize: 4 },
		server: true,
		lazy: false,
	},
)

// 降级兜底：接口未就绪时用静态数据（SEO 规范 §7.6 数据缺失降级）
const articles = computed(() => {
	const list = (data.value as any)?.list || []
	if (list.length > 0)
		return list
	// 静态兜底（后端旅游文章接口未就绪时）
	return [
		{ id: 1, title: '北京故宫深度游览指南', introduction: '紫禁城 600 年，一文读懂游览精华', picUrl: '/images/tour/guide-beijing.jpg', keyWords: '北京,故宫' },
		{ id: 2, title: '云南大理丽江自由行攻略', introduction: '风花雪月，少数民族风情全体验', picUrl: '/images/tour/guide-yunnan.jpg', keyWords: '云南,大理' },
		{ id: 3, title: '西藏高原旅行注意事项', introduction: '高反预防与最佳旅行季节详解', picUrl: '/images/tour/guide-tibet.jpg', keyWords: '西藏,高原' },
		{ id: 4, title: '丝绸之路历史文化全解', introduction: '从西安到敦煌，重走千年丝路', picUrl: '/images/tour/guide-silkroad.jpg', keyWords: '丝绸之路,敦煌' },
	]
})

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}

// 图片 404 时回退到渐变占位块（与特色玩法 packages 同款）
function onImgError(_e: Event, item: Article) {
	item.picUrl = ''
}
</script>

<template>
	<section class="tour-guide site-grid site-grid--vertical-100 site-grid--full">
		<header class="tour-guide__header">
			<h2 class="tour-guide__title">
				{{ tr('tour.guide.heading', '中国旅行指南') }}
			</h2>
			<p class="tour-guide__subtitle">
				{{ tr('tour.guide.subheading', '深度目的地攻略，让旅行更有底气') }}
			</p>
			<NuxtLink :to="$path('/articles')" class="tour-guide__more">
				{{ tr('tour.guide.viewAll', '查看全部') }} →
			</NuxtLink>
		</header>

		<!-- 加载中：骨架屏 -->
		<div v-if="pending" class="tour-guide__grid site-container">
			<div v-for="i in 4" :key="i" class="tour-guide__skeleton"></div>
		</div>

		<!-- 错误：重试 -->
		<div v-else-if="error" class="tour-guide__error">
			<p>{{ tr('tour.guide.loadFailed', '加载失败') }}</p>
			<button class="tour-guide__retry" @click="() => refresh()">
				{{ tr('tour.guide.retry', '重试') }}
			</button>
		</div>

		<!-- 成功：文章卡片 -->
		<div v-else class="tour-guide__grid site-container">
			<NuxtLink
				v-for="item in articles"
				:key="item.id"
				:to="$path(`/articles/${item.id}`)"
				class="tour-guide__card"
			>
				<div
					class="tour-guide__card-image-wrap"
					:class="{ 'tour-guide__card-image-wrap--placeholder': !item.picUrl }"
				>
					<span v-if="!item.picUrl" class="tour-guide__placeholder-text">
						{{ item.keyWords || item.title }}
					</span>
					<NuxtImg
						v-else
						:src="item.picUrl"
						:alt="item.title"
						class="tour-guide__card-image"
						width="400"
						height="240"
						preset="product"
						loading="lazy"
						@error="(e: Event) => onImgError(e, item)"
					/>
				</div>
				<div class="tour-guide__card-info">
					<h3 class="tour-guide__card-title">
						{{ item.title }}
					</h3>
					<p class="tour-guide__card-desc">
						{{ item.introduction }}
					</p>
				</div>
			</NuxtLink>
		</div>
	</section>
</template>

<style lang="scss">
@import url('./AppTourGuide.scss');
</style>
