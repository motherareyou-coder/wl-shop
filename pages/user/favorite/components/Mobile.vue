<script setup lang="ts">
import ProductItem from './ProductItem.vue'
import type { Product } from '~/types'

const { data, load, loading } = useInfiteLoad<Product>(p =>
	$api('product/favorite/page?apifoxApiId=221197514', {
		params: p,
	}),
)

function handleCancel(item: Product, i) {
	$api('product/favorite/delete?apifoxApiId=218963891', {
		method: 'delete',
		body: { spuId: item.id },
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
