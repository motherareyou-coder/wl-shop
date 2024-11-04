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
useHead({
	title: `${info.value?.name} ${$t('appTitle')}`,
})
const curSku = ref()
const selected = ref({})
watch(
	info,
	(v) => {
		v?.skus.forEach((s) => {
			s.propertyMap = s.properties.reduce((t, p) => {
				t[p.propertyId] = p.valueId
				return t
			}, {})
		})
	},
	{ immediate: true },
)

watch(
	selected,
	(v) => {
		info.value?.skus.find((s) => {
			if (Object.entries(v).every(([k, v]) => s.propertyMap[k] === v)) {
				curSku.value = s
			}
		})
		console.log(v, curSku.value)
	},
	{ deep: true },
)
const properties = computed(() => {
	if (!info.value)
		return []
	if (isString(info.value.propertyList)) {
		return JSON.parse(info.value.propertyList)
	}
	if (isArray(info.value.propertyList))
		return info.value.propertyList
	const arr = info.value.skus.map(s => s.properties).flat()
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
	Object.entries(map).forEach(([k, v]) => {
		selected.value[k] = v.values[0]?.id
	})
	return Object.values(map)
})

const { data: stared } = await useAPI<boolean>(
	'product/favorite/exits?apifoxApiId=218963826',
	{ params: { spuId: id } },
)

const count = ref(1)

function toggleStar() {
	if (stared.value) {
		$api('product/favorite/delete?apifoxApiId=218963891', {
			method: 'delete',
			body: { spuId: id },
		}).then(() => {
			stared.value = false
		})
	}
	else {
		$api('product/favorite/create?apifoxApiId=218963858', {
			method: 'post',
			body: { spuId: id },
		}).then(() => {
			stared.value = true
		})
	}
}

function goCart() {
	$api('trade/cart/add?apifoxApiId=218995477', {
		method: 'post',
		body: {
			count: count.value,
			skuId: curSku.value?.id,
		},
	}).then(() => router.push($path('/user/cart')))
}

const appStore = useAppStore()
</script>

<template>
	<div class="product_v4">
		<div v-if="info" class="xm-page-area">
			<component
				:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
				v-model:count="count"
				v-model:sku="curSku"
				v-model:selected="selected"
				:info="info"
				:star="stared"
				:properties="properties"
				@star="toggleStar"
				@submit="goCart"
			/>
		</div>
	</div>
</template>
