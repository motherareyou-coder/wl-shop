<script setup lang="ts">
import { isArray, isString, sortBy, uniqBy } from 'lodash-es'
import PC from './components/PC.vue'
import Mobile from './components/Mobile.vue'
import { useAppStore } from '@/stores/app'
// import './index.scss'
import type { ProductDetail } from '~/types'

const router = useRouter()
const route = useRoute()
const id = route.params.id
provide('id', id)

const { data: info } = await useAPI<ProductDetail>(
	'product/spu/get-detail?apifoxApiId=218881713',
	{ params: { id } },
)

const properties = computed(() => {
	if (!info.value)
		return []
	if (isString(info.value.propertyList)) {
		return JSON.parse(info.value.propertyList)
	}
	if (isArray(info.value.propertyList))
		return info.value.propertyList
	const arr = info.value.skus.map(sku => sku.properties).flat()
	const map: Record<any, any> = {}
	arr.forEach((c) => {
		const { propertyId, propertyName, valueId, valueName } = c
		const property = map[propertyId] || {
			id: propertyId,
			name: propertyName,
			values: [],
		}
		property.values.push({ id: valueId, name: valueName })
		property.values = uniqBy(property.values, 'id')
		map[propertyId] = property
	})
	return Object.values(map)
})

const { data: stared } = await useAPI<boolean>(
	'product/favorite/exits?apifoxApiId=218963826',
	{ params: { spuId: id } },
)

const data = ref({
	skuId: 3,
	count: 2,
})

function toggleStar() {
	if (stared.value) {
		$api('product/favorite/delete?apifoxApiId=218963891', {
			method: 'delete',
		}).then(() => {
			stared.value = false
		})
	}
	else {
		$api('product/favorite/create?apifoxApiId=218963858', {
			method: 'post',
		}).then(() => {
			stared.value = true
		})
	}
}

function goCart() {
	$api('trade/cart/add?apifoxApiId=218995477', {
		method: 'post',
		body: data.value,
	}).then(() => router.push($path('/cart')))
}

const appStore = useAppStore()
</script>

<template>
	<div class="product_v4">
		<div v-if="info" class="xm-page-area">
			<component
				:is="appStore.isPC ? PC : Mobile"
				v-model="data"
				:info="info"
				:star="stared"
				:properties="properties"
				@star="toggleStar"
				@submit="goCart"
			/>
		</div>
	</div>
</template>
