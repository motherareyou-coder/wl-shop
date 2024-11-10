<script setup lang="ts">
import type { ArticleCategory } from '~/types'
import ArticleItem from './components/ArticleItem.vue'

definePageMeta({
	title: 'Discover',
})

const { data: categories } = await useAPI<ArticleCategory>(
	'promotion/article-category/mall/page',
)

const categoryId = ref(categories.value?.[0]?.id)

function method(params) {
	return $api('promotion/article/mall/page', {
		params: { ...params, categoryId: categoryId.value },
	})
}
</script>

<template>
	<div class="app-articles">
		<div class="site-container-1400 mx-auto w-full mb-10">
			<div class="tab-box mb-5">
				<div class="flex justify-center">
					<div
						v-for="cat in categories"
						:key="cat.id"
						class="tab-item"
						:class="{ active: categoryId === cat.id }"
						@click="categoryId = cat.id"
					>
						{{ cat.name }}
					</div>
				</div>
			</div>
			<app-list :key="categoryId" class="list-content" :method="method">
				<template #default="{ row }">
					<ArticleItem :data="row" :category-id="categoryId" />
				</template>
			</app-list>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.app-articles:deep {
	.tab-box {
		overflow: auto;
		.tab-item {
			color: #222;
			font-size: 14px;
			font-weight: 700;
			cursor: pointer;
			padding: 30px;
			position: relative;
			white-space: nowrap;
			&:not(:first-child) {
				&::before {
					background-color: #dedede;
					content: '';
					height: 10px;
					left: 0;
					margin-top: -5px;
					position: absolute;
					top: 50%;
					width: 1px;
				}
			}
		}
		.active {
			color: var(--mi-color-primary);
		}
	}
	.list-content {
		padding: 0 10px;
		> div > ul {
			margin: 0 -10px;
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			align-items: stretch;
			li {
				width: 50%;
				padding: 10px;
			}
			@media screen and (max-width: 800px) {
				li {
					width: 100%;
				}
			}
		}
	}
}
</style>
