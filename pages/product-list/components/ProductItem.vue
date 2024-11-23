<script setup lang="ts">
import type { Product } from '~/types'

const data = defineModel<Product>('data', { default: () => ({}) })

const router = useRouter()
function onClick() {
	router.push($path(`/product/${data.value.id}`))
}
const appStore = useAppStore()
const cartStore = useCartStore()

const { loading, wrapLoading } = useLoading()
function handleAdd(g: Product) {
	wrapLoading(
		// TODO: 商品数据缺少skuId
		cartStore.addCart(g, { id: g.skuId }, 1).then(() =>
			router.push($path('/user/cart')),
		),
	)
}
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
				<div class="item__info-section">
					<h3 class="item__title" @click="onClick">
						<bdi>
							{{ data.name }}
						</bdi>
					</h3>
				</div>
				<div class="item__info-section">
					<product-price
						class="mi-price item__price"
						:data="data.price"
					/>
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
	</li>
</template>
