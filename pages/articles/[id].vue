<script setup lang="ts">
import type { Article } from '~/types'
import ArticleItem from './components/ArticleItem.vue'

const route = useRoute()
const id = route.params.id
const { shortDomain, domain } = useRuntimeConfig().public
const categoryId = Number(route.query.categoryId || '')

const { gtag } = useGtag()
// 文章详情页面埋点
gtag('event', 'screen_view', {
	app_name: shortDomain,
	screen_name: 'articles-detail',
})
const { data } = await useAPI<Article>(
	'promotion/article/get',
	{ params: { id } },
)

$api('promotion/article/add-browse-count', {
	method: 'put',
	params: { id },
})

const { data: recommends } = await useAsyncData<Article>(() =>
	$api('promotion/article/mall/page', {
		params: { pageNo: 1, pageSize: 4, categoryId },
	}).then(res => res.list),
)
useHead({
	// title: `${t('home')} ${t('appTitle')}`,
	// title: ` ${t('appTitle')}`,
	title: `${shortDomain} ${data.value?.title}`,
	link: [{ rel: 'canonical', href: `${domain} ${route.path}` }],
	meta: [
		{ name: 'keywords', content: `${data.value?.keyWords}` },
		{ name: 'description', content: `${data.value?.introduction}` },
	],
})
</script>

<template>
	<div class="site-container-1400 mx-auto w-full">
		<div class="new-detail">
			<section class="new-detail__main">
				<div class="new-detail__main-content">
					<div class="new-detail__title">
						{{ data?.title }}
					</div>
					<div class="new-detail__info">
						<app-time :data="data?.createTime" />
						<span class="view-count">
							<el-icon class="view-count-icon"><ElIconView /></el-icon>
							{{ data?.browseCount }}
						</span>
					</div>
					<div
						class="new-detail__content"
						v-html="data?.content"
					></div>
				</div>
			</section>
			<section class="new-detail__read-more">
				<div class="new-detail__read-more-title">
					{{ $t('Read more') }}
				</div>
				<div class="new-detail__read-more-item list-content">
					<ul>
						<li
							v-for="item in recommends"
							:key="item.id"
							class="item-new"
						>
							<ArticleItem
								:data="item"
								:category-id="categoryId"
							/>
						</li>
					</ul>
				</div>
			</section>
		</div>
	</div>
</template>

<style lang="scss">
@import url( './detail.scss');
</style>
