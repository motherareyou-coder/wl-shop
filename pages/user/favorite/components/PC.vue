<script setup lang="ts">
import ProductItem from './ProductItem.vue'
import type { Product } from '~/types'

const { data, pagination, getData } = useTablePagination<Product>((p = {}) =>
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
		getData()
	})
}
</script>

<template>
	<div class="mi-product__list">
		<ProductItem v-for="(item, i) in data" :key="item.id" :data="item" @cancel="handleCancel(item, i)" />
	</div>
	<el-pagination
		v-model:current-page="pagination.currentPage"
		v-model:page-size="pagination.pageSize"
		:total="pagination.total"
		layout="prev,pager,next,jumper"
		center
	/>
</template>

<style lang="scss" scoped>
.mi-pagination {
	margin: calc(var(--grid-gap) * 2) var(--grid-gap);
	justify-content: center;
	--mi-pagination-bg-color: transparent;
	--mi-pagination-button-disabled-bg-color: transparent;
}
</style>
