<script setup lang="ts">
import ProductItem from './ProductItem.vue'
import type { Product } from '~/types'

const props = defineProps({
	params: { type: Object, default: () => ({}) },
	scopeValues: { type: Array },
})

const { data, load, reset } = useInfiteLoad<Product>(p =>
	props.scopeValues?.length
		? $api('product/spu/list-by-ids?apifoxApiId=221196568', {
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
		: $api('product/spu/page?apifoxApiId=211495718', {
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
