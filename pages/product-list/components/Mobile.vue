<script setup lang="ts">
import ProductItem from './ProductItem.vue'
import type { Product } from '~/types'

const props = defineProps({
	params: { type: Object, default: () => ({}) },
})
const total = ref(Infinity)
const pagination = ref({
	pageNo: 1,
	pageSize: 10,
})
const data = ref<Product[]>([])
const loading = ref(false)
function getData() {
	if (loading.value)
		return
	loading.value = true
	$api('product/spu/page?apifoxApiId=211495718', {
		params: { ...pagination.value, ...props.params },
	}).then((res) => {
		total.value = res.total || Infinity
		data.value.push(...res.list)
	}).finally(() => {
		loading.value = false
	})
}
function load() {
	console.log('load')
	if (data.value.length < total.value) {
		getData()
	}
}
getData()

watch(() => props.params, () => {
	data.value = []
	total.value = Infinity
	pagination.value = {
		pageNo: 1,
		pageSize: 10,

	}
	getData()
})
</script>

<template>
	<div v-infinite-scroll="load">
		<ul class="mi-product__list">
			<ProductItem v-for="item in data" :key="item.id" :data="item" />
		</ul>
		<div v-loading="loading"></div>
	</div>
</template>
