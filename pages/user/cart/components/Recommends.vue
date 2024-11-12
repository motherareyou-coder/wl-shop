<script setup lang="ts">
import type { Recommend } from '~/types'
import './Recommends.scss'

const emit = defineEmits(['add'])

const { data: recommends } = await useAsyncData<Recommend[]>(() =>
	$api('product/browse-history/page', {
		params: { pageNo: 1, pageSize: 12 },
	}).then(res => res.list),
)

function addToCart(r) {
	emit('add', r)
}
</script>

<template>
	<article class="site-cart__recommend cart-recommend">
		<h4 class="cart-recommend__title">
			{{ $t('You may also like') }}
		</h4>
		<ul class="cart-recommend__list">
			<li
				v-for="r in recommends"
				:key="r.id"
				class="cart-recommend__item"
			>
				<nuxt-link :to="$path(`/product/${r.id}`)">
					<app-image class="cart-recommend__image" :src="r.picUrl" />
				</nuxt-link>
				<div class="cart-recommend__product-info">
					<nuxt-link class="cart-recommend__product-name" :to="$path(`/product/${r.id}`)">
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
	</article>
</template>
