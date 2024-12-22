<script setup lang="ts">
import type { Article } from '~/types'
import ArticleItem from './components/ArticleItem.vue'
import './detail.scss'

const route = useRoute()
const id = route.params.id
const categoryId = Number(route.query.categoryId || '')
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
