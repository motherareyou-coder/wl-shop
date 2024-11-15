<script setup lang="ts">
import type { Review } from '~/types'
import Mobile from './Mobile.vue'
import PC from './PC.vue'
import './index.scss'

const route = useRoute()
const id = route.params.id
const tags = ref([
	{ label: 'All', value: 0 },
	{ label: 'Good', value: 1 },
	{ label: 'Neutral', value: 2 },
	{ label: 'Bad', value: 3 },
])
const tag = ref(0)

const { data, load, reset } = useInfiteLoad<Review>(params =>
	$api('product/comment/page', {
		params: { ...params, spuId: id, type: tag.value },
	}),
)

watch(tag, reset)

const appStore = useAppStore()
</script>

<template>
	<div
		class="review-container"
		:class="{ 'site-container-1400': appStore.isPC }"
	>
		<ul class="review-tags">
			<li
				v-for="t in tags"
				:key="t.value"
				class="review-tag"
				:class="{ active: tag === t.value }"
				@click="tag = t.value"
			>
				{{ t.label }}
			</li>
		</ul>
		<div
			v-infinite-scroll="load"
			class="infinite-scroll"
			:class="{ 'infinite-scroll--mobile': appStore.isMobile }"
		>
			<component
				:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
				:data="data"
			/>
		</div>
	</div>
</template>
