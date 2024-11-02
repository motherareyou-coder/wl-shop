<script setup lang="ts">
import ProductItem from './ProductItem.vue'
import type { Product } from '~/types'

const props = defineProps({
	params: { type: Object, default: () => ({}) },
	scopeValues: { type: Array },
})
const { data, pagination, resetData } = useTablePagination<Product>(
	(p = {}) =>
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
watch(() => props.params, resetData)
watch(() => props.scopeValues, resetData)
</script>

<template>
	<div class="mi-product__list">
		<ProductItem v-for="item in data" :key="item.id" :data="item" />
	</div>
	<el-pagination
		v-if="!scopeValues.length"
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
