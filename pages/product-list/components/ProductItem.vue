<script setup lang="ts">
import SkuSelect from '~/pages/product-list/components/SkuSelect.vue'
import type { Activity, Product } from '~/types'

const data = defineModel<Product>('data', { default: () => ({}) })

const router = useRouter()
function onClick() {
	router.push($path(`/product/${data.value.id}`))
}
const appStore = useAppStore()

const { loading, wrapLoading } = useLoading()
const skuState = ref<Product | null>()
function handleAdd() {
	skuState.value = null
	wrapLoading(nextTick(() => {
		skuState.value = data.value
	}))
}

const { data: activities } = await useAPI<Activity[]>('promotion/activity/list-by-spu-id', { params: {	spuId: data.value.id } })
const first5 = computed(() => activities.value?.findIndex(a => a.type === 5))
</script>

<template>
	<li class="mi-product__item-wrapper">
		<div
			class="mi-product__item"
		>
			<app-image
				class="shrink-0"
				:class="[appStore.isPC ? 'w-60 h-60' : 'w-28 h-28']"
				:src="data.picUrl"
				@click="onClick"
			/>
			<div class="item__info">
				<div v-if="appStore.isPC || activities?.length" class="item__info-section">
					<div class="mi-marketing-label__tags item__marketing-tags">
						<ul class="tag__list">
							<template v-for="(a, i) in activities" :key="a.type">
								<template v-if="a.type === 5">
									<ActivityTag v-if="i === first5" class="tag__item" :name="a.name" />
								</template>
								<ActivityTag v-else class="tag__item" :type="a.type" />
							</template>
							<el-tag	v-if="data.marketPrice != data.price" class="tag__item">
								{{ Math.ceil(100 * (data.marketPrice - data.price) / data.marketPrice) }}% off
							</el-tag>
						</ul>
					</div>
				</div>
				<div class="item__info-section">
					<h3 class="item__title" @click="onClick">
						<bdi>
							{{ data.name }}
						</bdi>
					</h3>
				</div>
				<div class="item__info-section">
					<div class="mi-price item__price item__price--on-sale">
						<product-price
							:data="data.price"
						/>
						<del v-if="data.marketPrice != data.price" class="notranslate">
							<product-price
								:data="data.marketPrice"
								plain
							/>
						</del>
					</div>
				</div>
			</div>
			<div v-if="appStore.isPC" class="item__action">
				<el-button :disabled="loading" plain @click.prevent="handleAdd">
					{{ $t('Add to cart') }}
				</el-button>
				<el-button type="info" @click.prevent="onClick">
					{{ $t('Shop Now') }}
				</el-button>
			</div>
		</div>
		<SkuSelect v-if="skuState" :data="skuState" />
	</li>
</template>
