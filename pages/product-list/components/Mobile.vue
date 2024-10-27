<script setup lang="ts">
import ProductItem from './ProductItem.vue'
import type { Product } from '~/types'

const props = defineProps({
	params: { type: Object, default: () => ({}) },
})

const { data, load, reset } = useInfiteLoad<Product>(params =>
	$api('product/spu/page?apifoxApiId=211495718', {
		params: { ...params, ...props.params },
	}),
)

watch(() => props.params, reset)
</script>

<template>
	<div v-infinite-scroll="load">
		<ul class="mi-product__list">
			<ProductItem v-for="item in data" :key="item.id" :data="item" />
		</ul>
		<div v-loading="loading"></div>
	</div>
</template>
