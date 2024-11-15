<script setup lang="ts">
import type { Product } from '~/types'
import ProductItem from './ProductItem.vue'

const { data, pagination, getData } = useTablePagination<Product>((p = {}) =>
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
		getData()
	})
}
</script>

<template>
	<div class="mi-product__list" style="margin: 0">
		<ProductItem v-for="(item, i) in data" :key="item.id" :data="item" @cancel="handleCancel(item, i)" />
	</div>
	<el-pagination
		v-model:current-page="pagination.currentPage"
		v-model:page-size="pagination.pageSize"
		:total="pagination.total"
		layout="prev,pager,next,jumper"
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
