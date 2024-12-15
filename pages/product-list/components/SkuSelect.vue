<script setup lang="ts">
import { uniqBy } from 'lodash-es'
import type { ProductBrowseHistory, ProductDetail, SKU } from '~/types'
import '~/pages/product/components/PC.scss'

const props = defineProps({
	data: { type: Object, required: true },
})
const visible = defineModel<boolean>()
const info = computed(() => props.data as unknown as (ProductDetail | ProductBrowseHistory))
const skus = computed(() => (info.value?.skus || []) as SKU[])
const properties = computed(() => {
	const arr = skus.value.map(s => s.properties).flat()
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

const sku = ref<SKU | null>()
watch(skus, () => {
	skus.value?.forEach((s) => {
		s.propertyMap = s.properties.reduce((t, p) => {
			t[p.propertyId] = p.valueId
			return t
		}, {})
	})
	sku.value = skus.value?.[0]
}, { immediate: true })
const selected = ref<Record<string | number, any>>({})
watchEffect(() => {
	sku.value?.properties.forEach((p) => {
		selected.value[p.propertyId] = p.valueId
	})
})
watch(selected, (v) => {
	skus.value?.forEach((s) => {
		if (Object.entries(v).every(([k, v]) => s.propertyMap[k] === v)) {
			sku.value = s
		}
	})
}, { deep: true })

const count = ref(1)

function handleClick(pId: number, vId: number) {
	selected.value[pId] = vId
}
const cartStore = useCartStore()
const { t } = useI18n()
function handleBuy() {
	cartStore.addCart({
		id: info.value.spuId || info.value.id,
		name: info.value.spuName || info.value.name,
		picUrl: info.value.picUrl,
		categoryId: info.value.categoryId,
	}, sku.value!, count.value).then(() => {
		visible.value = false
		ElMessage.info(t('Add to cart'))
	})
}

watch(info, () => {
	console.log(info.value)
	if (skus.value.length === 0) {
		return
	}
	if (skus.value.length === 1) {
		sku.value = skus.value[0]
		return handleBuy()
	}
	visible.value = true
}, { immediate: true })
const appStore = useAppStore()
</script>

<template>
	<app-modal v-model="visible" class="sku-select" :style="appStore.isMobile ? 'min-height:85vh' : ''">
		<template v-if="info">
			<main v-if="appStore.isPC" class="product--pc" style="background:#fff">
				<div class="product__container site-container">
					<aside class="product__aside">
						<section class="product__image-wrapper">
							<div class="product__image">
								<app-image class="max-w-full shrink-0 product__image-content" :src="sku?.picUrl || info.picUrl" />
							</div>
						</section>
					</aside>
					<article class="product__article" style="margin-left: 0;">
						<section class="product__section product__section-spacer information-section">
							<h2 class="information-section__product-title">
								<span>{{ info.name || info.spuName }}</span>
							</h2>
							<div class="information-section__product-info">
								<div class="information-section__product-sku-info">
									{{ sku?.properties.map(p => p.valueName).join(' ') }}
								</div>
								<div class="information-section__product-price">
									<product-price :data="sku?.price ?? info.price" />
									<del v-if="sku">
										<product-price plain :data="sku.marketPrice" />
									</del>
								</div>
							</div>
						</section>
						<section class="product__section product__section--desktop sku-section-v4 sku-section-v4--desktop">
							<template v-for="p in properties" :key="p.id">
								<h3
									class="sku-section-v4__title product__section-title"
								>
									{{ p.name }}
								</h3>
								<ul class="sku-section-v4__list">
									<li
										v-for="v in p.values"
										:key="v.id"
										class="sku-section-v4__icon-item"
										@click.prevent="handleClick(p.id, v.id)"
									>
										<button
											class="sku-section-v4__button"
											:class="{
												'sku-section-v4__button--sold-out': selected[p.id] === v.id && !sku?.stock,
												'sku-section-v4__button--active': selected[p.id] === v.id,
											}"
										>
											{{ v.name }}
										</button>
									</li>
								</ul>
							</template>
						</section>
						<section
							class="product__section quantity-section"
						>
							<h3 class="product__section-title">
								{{ $t('Quantity') }}
							</h3>
							<div class="quantity-section__container">
								<div class="quantity-section-v4__content">
									<el-input-number
										v-model="count"
										:step="1"
										:min="1"
										:max="sku?.stock"
									/>
								</div>
							</div>
						</section>
						<section class="product__section add-cart-section">
							<div class="add-cart-section__wrap">
								<el-button
									type="info"
									class="add-cart-section__submit flex-1"
									:disabled="!sku?.stock"
									@click.prevent="handleBuy"
								>
									{{ $t('加入购物车') }}
								</el-button>
							</div>
						</section>
					</article>
				</div>
			</main>
			<main v-if="appStore.isMobile" class="product--mobile" style="background:#fff;overflow: visible;">
				<section class="product--mobile__section" style="display: block;">
					<app-image class="w-32 h-32" :src="sku?.picUrl || info.picUrl" />
				</section>
				<section class="product--mobile__section product-information">
					<div class="product-information__wrapper " style="padding-left: 0;padding-right: 0;">
						<div class="product-information__top">
							<div class="product-information__price">
								<ProductPrice :data="sku?.price || info.price" />
							</div>
						</div>
						<h1 class="product-information__title">
							{{ info.name }}
						</h1>
						<div class="information-section__product-sku-info">
							{{ sku?.properties.map(p => p.valueName).join(', ') }}
						</div>
					</div>
				</section>
				<section
					class="product--mobile__section"
				>
					<section
						class="product--mobile__section product--mobile__section--mobile sku-section-v4 sku-section-v4--mobile"
					>
						<section
							class="product--mobile__section product--mobile__section--mobile sku-section-v4 sku-section-v4--mobile"
						>
							<template v-for="p in properties" :key="p.id">
								<h3 class="sku-section-v4__title product--mobile__title">
									{{ p.name }}
								</h3>
								<ul class="sku-section-v4__list">
									<li
										v-for="v in p.values"
										:key="v.id"
										class="sku-section-v4__icon-item"
										@click.prevent="handleClick(p.id, v.id)"
									>
										<button
											class="sku-section-v4__button"
											:class="{
												'sku-section-v4__button--sold-out': selected[p.id] === v.id && !sku?.stock,
												'sku-section-v4__button--active': selected[p.id] === v.id,
											}"
										>
											<span>{{ v.name }}</span>
										</button>
									</li>
								</ul>
							</template>
						</section>
						<section
							class="quantity-section mb-4"
						>
							<h3 class="product--mobile__title">
								{{ $t('Quantity') }}
							</h3>
							<div class="quantity-section__container">
								<div class="quantity-section-v4__content">
									<el-input-number
										v-model="count"
										:min="1"
										:max=" sku?.stock"
									/>
								</div>
							</div>
						</section>
					</section>
				</section>
			</main>
		</template>
		<template #footer>
			<el-button
				v-if="info && appStore.isMobile"
				type="info"
				class="add-cart-section__submit flex-1 w-full"
				:disabled="!sku?.stock"
				@click.prevent="handleBuy"
			>
				{{ $t('加入购物车') }}
			</el-button>
		</template>
	</app-modal>
</template>

<style lang="scss">
.sku-select {
	@media screen and (min-width: 721px)and (max-width:1024px) {
		--mi-dialog-width:75vw !important;
	}

	@media screen and (min-width: 1025px)and (max-width:1440px) {
		--mi-dialog-width:80vw !important;
	}

	@media screen and (min-width: 1441px)and (max-width:1920px) {
		--mi-dialog-width:60vw !important;
	}

	@media screen and (min-width: 1921px) {
		--mi-dialog-width:60vw !important;
	}
}
</style>
