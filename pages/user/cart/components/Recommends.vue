<script setup lang="ts">
import SkuSelect from '~/pages/product-list/components/SkuSelect.vue'
import type { ProductBrowseHistory } from '~/types'
import './Recommends.scss'

const { data: recommends } = await useAsyncData<ProductBrowseHistory[]>(() =>
	$api('product/browse-history/page', {
		params: { pageNo: 1, pageSize: 12 },
	}).then(res => res.list),
)

const skuState = ref<ProductBrowseHistory | null>()
function addToCart(r: ProductBrowseHistory) {
	skuState.value = null
	nextTick(() => {
		skuState.value = r
	})
}
</script>

<template>
	<article class="site-cart__recommend cart-recommend">
		<h4 class="cart-recommend__title">
			{{ $t('View history') }}
		</h4>
		<ul class="cart-recommend__list">
			<li
				v-for="r in recommends"
				:key="r.id"
				class="cart-recommend__item"
			>
				<nuxt-link :to="$path(`/product/${r.spuId}`)">
					<app-image
						class="cart-recommend__image w-full"
						:src="r.picUrl"
					/>
				</nuxt-link>
				<div class="cart-recommend__product-info">
					<nuxt-link
						class="cart-recommend__product-name"
						:to="$path(`/product/${r.spuId}`)"
					>
						{{ r.spuName }}
					</nuxt-link>
				</div>
				<div class="cart-recommend__information">
					<div class="cart-recommend__price-wrapper">
						<div class="cart-recommend__price">
							<div class="mi-price">
								<ProductPrice :data="r.price" />
							</div>
						</div>
						<i class="cart-recommend__cart" @click="addToCart(r)">
							<Icon name="icon:cart" />
						</i>
					</div>
				</div>
			</li>
		</ul>
		<SkuSelect v-if="skuState" :data="skuState" />
	</article>
</template>
