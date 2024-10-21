<script setup lang="ts">
import ProductItem from './ProductItem.vue'
import type { Product } from '~/types'

const props = defineProps({
	params: { type: Object, default: () => ({}) },
})
const { data, pagination, getData, resetData } = useTablePagination<Product>(
	(p = {}) =>
		$api('product/spu/page?apifoxApiId=211495718', {
			params: { ...p, ...props.params },
		}),
)
watch(
	() => props.params,
	() => {
		resetData()
		getData()
	},
)
</script>

<template>
	<div class="mi-product__list">
		<ProductItem v-for="item in data" :key="item.id" :data="item" />
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
.el-pagination {
	margin: calc(var(--grid-gap) * 2) var(--grid-gap);
	justify-content: center;
	--el-pagination-bg-color: transparent;
	--el-pagination-button-disabled-bg-color: transparent;
}
</style>
