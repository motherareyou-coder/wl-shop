<script setup lang="ts">
import type { Product } from '~/types'
import ProductItem from './ProductItem.vue'

const { data, load, loading } = useInfiteLoad<Product>(p =>
	$api('product/favorite/page', {
		params: p,
	}),
)

function handleCancel(item: Product, i) {
	$api('product/favorite/delete', {
		method: 'delete',
		body: { spuId: item.spuId },
	}).then(() => {
		data.value.splice(i, 1)
	})
}
</script>

<template>
	<div v-infinite-scroll="load">
		<ul class="mi-product__list">
			<ProductItem v-for="(item, i) in data" :key="item.id" :data="item" @cancel="handleCancel(item, i)" />
		</ul>
		<div v-loading="loading"></div>
	</div>
</template>
