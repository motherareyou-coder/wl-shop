<script setup lang="ts">
import ProductItem from '~/pages/product-list/components/ProductItem.vue'
import type { ProductBrowseHistory } from '~/types'

const emit = defineEmits(['send'])
const { data, load, loading } = useInfiteLoad<ProductBrowseHistory>(p =>
	$api('product/browse-history/page', {
		params: p,
	}),
)
const appStore = useAppStore()
</script>

<template>
	<app-modal
		:model-value="true"
		:title="$t('选择商品')"
		:style="appStore.isMobile ? 'min-height: 100vh' : ''"
	>
		<div
			v-loading="loading"
			class="overflow-y-auto"
			:style="appStore.isMobile ? '' : 'height:40rem'"
		>
			<ul v-infinite-scroll="load" class="flex flex-col p-2">
				<li v-for="item in data" :key="item.id" class="order-item">
					<div
						class="flex bg-white w-full items-center"
					>
						<app-image
							class="shrink-0 cursor-pointer w-28 h-28"
							:src="item.picUrl"
              :alt="item.spuName"
						/>
						<div
							class="w-full flex flex-col"
							:class="[
								appStore.isPC ? '' : 'h-20 pl-2 justify-between h-full p-3',
							]"
						>
							<div
								class="overflow-hidden flex h-10"
								:class="[appStore.isPC ? 'my-3' : '']"
							>
								<span
									class="overflow-hidden text-ellipsis cursor-pointer"
									style="
							display: box;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						"
								>
									{{ item.spuName }}
								</span>
							</div>
							<div class="flex justify-between">
								<product-price class="font-medium" :data="item.price" />
								<el-button type="info" @click="emit('send', item.spuId)">
									{{ $t('发送') }}
								</el-button>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</app-modal>
</template>

<style scoped>

</style>
