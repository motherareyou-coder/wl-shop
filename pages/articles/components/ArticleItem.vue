<script setup lang="ts">
import type { Article } from '~/types'

const props = defineProps({
	categoryId: { type: [Number, String] },
})
const data = defineModel<Article>('data')
</script>

<template>
	<nuxt-link
		v-if="data"
		:to="$path(`/articles/${data.id}?categoryId=${props.categoryId}`)"
		class="h-full"
	>
		<div class="article-item">
			<app-image :src="data.picUrl" :alt="data.title"/>
			<div class="info">
				<div>
					<p class="mb-2 title">
						{{ data.title }}
					</p>
					<p class="mb-2 whitespace-nowrap overflow-hidden">
						{{ data.introduction }}
					</p>
				</div>
				<div class="flex justify-between whitespace-nowrap">
					<p>
						<app-time :data="data?.createTime" />
					</p>
					<p class="flex items-center">
						<el-icon class="mr-2">
							<ElIconView />
						</el-icon>
						{{ data.browseCount }}
					</p>
				</div>
			</div>
		</div>
	</nuxt-link>
</template>

<style lang="scss" scoped>
.article-item {
	height: 100%;
	background-color: #fff;
	box-shadow: 0 0 .41667rem 0 rgba(0, 0, 0, .1);
	cursor: pointer;
	position: relative;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border-radius: 10px;
	.mi-image {
		width: 100%;
		height: 280px;
		img {
			object-fit: cover;
		}
	}
	.info {
		padding: 32px;
		color: var(--title-light);
		font-size: 14px;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		p {
			text-overflow: ellipsis;
		}
		.title {
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			word-wrap: break-word;
			color: #222;
			display: -webkit-box;
			font-size: 22px;
			max-height: 75px;
			line-height: 25px;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	@media screen and (max-width: 800px) {
		.info {
			padding: 16px;
			font-size: 10px;
			.title {
				font-size: 16px;
			}
		}
	}
}
</style>
