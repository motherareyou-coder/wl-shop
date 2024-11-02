<script setup lang="ts">
import Big from 'big.js'
import Coupon from './Coupon.vue'
import Review from './Review/index.vue'
import type { ProductDetail, Property, SKU } from '~/types'
import './PC.scss'

const props = defineProps({
	info: { type: Object as () => ProductDetail, required: true },
	star: { type: Boolean },
	sku: { type: Object },
	properties: { type: Array as () => ProductDetail['propertyList'] },
})
const emit = defineEmits(['star', 'submit'])
const count = defineModel('count')
const info = computed(() => props.info)
const sku = defineModel<SKU>('sku')
const selected = defineModel('selected')
const tab = ref(0)
const totalPrice = computed(() => {
	const price = new Big(sku.value?.price || info.value.price)
	return count.value ? price.times(new Big(count.value)).toFixed(2) : '0.00'
})
</script>

<template>
	<div class="xm-navbar">
		<div class="xm-navbar__container">
			<div class="xm-navbar__title">
				<h1 class="xm-text header">
					{{ info.name }}
				</h1>
			</div>
			<div class="xm-navbar__nav">
				<ul>
					<li
						class="xm-navbar__nav-item"
						:class="{
							'xm-navbar__nav-item--current': tab === 0,
						}"
						@click="tab = 0"
					>
						<a>{{ $t('Overview') }}</a>
					</li>
					<li
						class="xm-navbar__nav-item"
						:class="{
							'xm-navbar__nav-item--current': tab === 1,
						}"
						@click="tab = 1"
					>
						<a>{{ $t('Reviews') }}</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="buy-container">
		<main class="product--pc">
			<div class="product__container site-container">
				<aside class="product__aside">
					<section class="product__image-wrapper">
						<div class="product__image">
							<app-image
								class="product__image-content"
								:src="sku?.picUrl || info.picUrl"
							/>
						</div>
					</section>
				</aside>
				<article class="product__article">
					<section
						class="product__section product__section-spacer information-section"
					>
						<h2 class="information-section__product-title">
							<span>{{ info.name }}</span>
							<el-icon
								class="information-section__product-share"
								:class="{ active: props.star }"
								@click="emit('star')"
							>
								<ElIconStar class="micon" />
							</el-icon>
						</h2>
						<div class="information-section__product-info">
							<div class="information-section__product-sku-info">
								{{ info.description }}
							</div>
							<div class="information-section__product-price">
								<ProductPrice
									:data="sku?.price || info.price"
								/>
							</div>
						</div>
					</section>
					<section
						class="product__section product__section-spacer events-info"
					>
						<Coupon />
					</section>
					<section
						class="product__section product__section--desktop sku-section-v4 sku-section-v4--desktop"
					>
						<template v-for="p in props.properties" :key="p.id">
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
									@click="selected[p.id] = v.id"
								>
									<button
										class="sku-section-v4__button"
										:class="{
											'sku-section-v4__button--active':
												selected[p.id] === v.id,
										}"
									>
										<span>{{ v.name }}</span>
									</button>
								</li>
							</ul>
						</template>
					</section>
					<section class="product__section quantity-section">
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
					<section class="product__section order-list-section">
						<ul class="order-list-section__list">
							<li class="order-list-section__item">
								<span> {{ info.name }} * {{ count }} </span>
								<div
									class="order-list-section__item-spacer"
								></div>
								<ProductPrice :data="totalPrice" />
							</li>
							<li class="order-list-section__item">
								<span>{{ $t('Total') }}:</span>
								<div
									class="order-list-section__item-spacer"
								></div>
								<ProductPrice :data="totalPrice" />
							</li>
						</ul>
					</section>
					<section class="product__section add-cart-section">
						<div class="add-cart-section__wrap">
							<div class="add-cart-section__submit-group">
								<button
									class="add-cart-section__btn add-cart-section__submit add-cart-section__submit--main"
									@click="emit('submit')"
								>
									{{ $t('BUY NOW') }}
								</button>
							</div>
						</div>
					</section>
				</article>
			</div>
		</main>
		<keep-alive>
			<div v-if="tab === 0" class="site-container" style="margin: 0 auto">
				<app-image
					v-for="img in info.sliderPicUrls"
					:key="img"
					:src="img"
					style="width: 100%"
				/>
			</div>
			<Review v-else-if="tab === 1" />
		</keep-alive>
	</div>
</template>
