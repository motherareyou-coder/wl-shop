<script setup lang="ts">
import type { Article } from '~/types'
import { useArticleSEO } from '~/composables/usePageSEO'
import ArticleItem from './components/ArticleItem.vue'

const { t } = useI18n()
const route = useRoute()
const id = route.params.id
const { shortDomain, domain } = useRuntimeConfig().public
const categoryId = Number(route.query.categoryId || '')

const { data: info } = await useAPI<Article>(
	'promotion/article/get',
	{ params: { id } },
)
// 使用useAsyncData获取文章详情
// const { data: info } = await useAsyncData<Article>(`article-detail-${id}`,() =>
//     $api('promotion/article/get', { params: { id } })
// )

const { data: recommends } = await useAsyncData<Article>(`recommends-${Date.now()}`, () =>
	$api('promotion/article/mall/page', {
		params: { pageNo: 1, pageSize: 4, categoryId },
	}).then(res => res.list))

// const head = computed(() => {
//   const appTitle = t('appTitle')
//   let title = `${info.value?.title} ${appTitle}`
//   // 关键修改：将路径中的语言前缀替换为 'en'
//   const enPath = route.fullPath.replace(/^\/[a-z]{2}\//, '/en/');
//   const canonicalUrl = `${domain}${enPath}`;
//   return {
//     // title: `${info.value?.title} ${$t('appTitle')}`,
//     // title: `${info.value?.title} ${$t('appTitle')}`,
//     title,
//     link: [{ rel: 'canonical', href: canonicalUrl }],
//     meta: [
//       { name: 'keywords', content: `${info.value?.keyWords}` },
//       { name: 'description', content: `${info.value?.introduction}` },
//     ],
//   }
// })
// useHead(head)
// 使用统一的 SEO composable
const { title, description, keywords, canonicalUrl } = useArticleSEO(info)

onMounted(() => {
	const { gtag } = useGtag()
	// 文章详情页面埋点（只应在客户端执行）
	gtag('event', 'screen_view', {
		app_name: shortDomain,
		screen_name: 'articles-detail',
	})

	// 增加浏览量的API调用（只应在客户端执行）
	$api('promotion/article/add-browse-count', {
		method: 'put',
		params: { id },
	})
})
</script>

<template>
	<div class="site-container-1400 mx-auto w-full">
		<div class="new-detail">
			<section class="new-detail__main">
				<div class="new-detail__main-content">
					<div class="new-detail__title">
						{{ info?.title }}
					</div>
					<div class="new-detail__info">
						<app-time :data="info?.createTime" />
						<span class="view-count">
							<el-icon class="view-count-icon"><ElIconView /></el-icon>
							{{ info?.browseCount }}
						</span>
					</div>
					<div
						class="new-detail__content"
						v-html="info?.content"
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
