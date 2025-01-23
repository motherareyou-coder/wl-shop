<script setup lang="ts">
import { isObject } from 'lodash-es'
import type { ProductDetail } from '~/types'

const data = defineModel<ProductDetail>({ required: true })

if (!isObject(data.value)) {
	data.value = (await $api<ProductDetail>(
		'product/spu/get-detail',
		{ params: { id: data.value } },
	))
}
const appStore = useAppStore()
</script>

<template>
	<div v-if="data" class="order-item">
		<div class="flex bg-white w-full items-center">
			<app-image class="shrink-0 cursor-pointer w-28 h-28" :src="data.picUrl" />
			<div
				class="w-full flex flex-col" :class="[
					appStore.isPC ? '' : 'h-20 pl-2 justify-between h-full p-3',
				]"
			>
				<div class="overflow-hidden flex h-10" :class="[appStore.isPC ? 'my-3' : '']">
					<span
						class="overflow-hidden text-ellipsis cursor-pointer" style="
							display: box;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						"
					>
						{{ data.name }}
					</span>
				</div>
				<div class="flex justify-between">
					<product-price class="font-medium" :data="data.price" />
				</div>
			</div>
		</div>
	</div>
</template>
