<script setup lang="ts">
import type { Product } from '~/types'
import ProductItem from './ProductItem.vue'

const props = defineProps({
	params: { type: Object, default: () => ({}) },
	scopeValues: { type: Array },
})

const { data, load, reset, loading } = useInfiteLoad<Product>(p =>
	props.scopeValues?.length
		? $api('product/spu/list-by-ids', {
			params: {
				...props.params,
				ids: props.scopeValues,
			},
		}).then((res) => {
			return {
				list: res,
				total: res.length,
			}
		})
		: $api('product/spu/page', {
			params: { ...p, ...props.params },
		}),
)

watch(() => props.params, reset)
watch(() => props.scopeValues, reset)
</script>

<template>
	<div v-infinite-scroll="load">
		<ul class="mi-product__list">
			<ProductItem v-for="item in data" :key="item.id" :data="item" />
		</ul>
		<div v-loading="loading"></div>
	</div>
</template>
