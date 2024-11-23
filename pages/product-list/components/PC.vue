<script setup lang="ts">
import type { Product } from '~/types'
import ProductItem from './ProductItem.vue'

const props = defineProps({
	params: { type: Object, default: () => ({}) },
	scopeValues: { type: Array },
})
const { data, pagination, resetData } = useTablePagination<Product>(
	(p = {}) =>
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
watch(() => props.params, resetData)
watch(() => props.scopeValues, resetData)
</script>

<template>
	<el-empty v-if="pagination.total === 0" :description="$t('No data')" />
	<div v-else class="mi-product__list">
		<ProductItem v-for="item in data" :key="item.id" :data="item" />
	</div>
	<el-pagination
		v-if="!props.scopeValues?.length && pagination.total"
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
