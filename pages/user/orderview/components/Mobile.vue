<script setup lang="ts">
import type { OrderDetail } from '~/types'
import './Mobile.scss'

const props = defineProps({
	data: { type: Object as () => OrderDetail, required: true },
	statusText: { type: String },
})

useHead({
	style: ['html{ font-size: 45.5px }'],
})

const info = computed(() => props.data)

const steps = [
	{ label: $t('Order placed'), value: 0 },
	{ label: $t('Paid'), value: 10 },
	{ label: $t('Processed'), value: 20 },
	{ label: $t('Shipped'), value: 30 },
	{ label: $t('Delivered'), value: 30 },
]

const index = computed(() =>
	steps.findIndex(s => s.value === info.value.status),
)
</script>

<template>
	<div class="order-view-wrapper miv4">
		<div class="order-view">
			<section class="order-info">
				<div class="order-info__wrap">
					<p class="order-info__id">
						<span class="">{{ $t('Order ID') }}: </span>
						<span class="order-info__text">
							{{ info.no }}
						</span>
					</p>
					<p class="order-info__status">
						{{ props.statusText }}
					</p>
				</div>
				<div class="order-info__wrap">
					<p class="order-info__date">
						{{ info.createTime }}
					</p>
				</div>
			</section>
			<section class="order-address--mobile">
				<div class="container">
					<i class="micon micon-location address-icon"> </i>
					<div class="address-info">
						<span class="address-info__name">{{
							info.receiverName
						}}</span>
						<span class="address-info__tel">{{
							info.receiverMobile
						}}</span>
						<p class="address-info__detail">
							{{ info.receiverDetailAddress }}
						</p>
					</div>
				</div>
			</section>
			<section class="order-express">
				<ul class="express-box">
					<li
						v-for="(s, i) in steps"
						:key="s.value"
						class="express-item"
						:class="[
							index >= i
								? 'express-item--active'
								: 'express-item--normal',
						]"
					>
						<div class="express-description">
							<span class="whitespace-nowrap">{{ s.label }}</span>
						</div>
						<div class="express-progress">
							<div class="express-progress__point-line">
								<p class="express-progress__line"></p>
								<p class="express-progress__point"></p>
							</div>
						</div>
						<div class="express-time">
							<span class="express-time__day">10/27</span>
							<span class="express-time__hour">17:02</span>
						</div>
					</li>
				</ul>
			</section>
			<section class="orderview-product">
				<div class="product-info__titleWrap">
					<p class="product-info__title">
						{{ $t('Order items') }}
					</p>
				</div>
				<div
					v-for="item in info.items"
					:key="item.id"
					class="product-info__item"
				>
					<nuxt-link
						class="product-info__view"
						:to="$path(`/product/${item.id}`)"
					>
						<app-image
							class="product-info__img"
							:src="item.picUrl"
						/>
					</nuxt-link>
					<div class="product-info__detail">
						<div class="product-info__box">
							<div class="product-info__namewrap">
								<nuxt-link
									class="product-info__name"
									:to="$path(`/product/${item.id}`)"
								>
									<span>{{ item.spuName }}</span>
								</nuxt-link>
							</div>
							<div class="product-info__numwrap">
								<ProductPrice
									class="product-info__price"
									:data="item.payPrice"
								/>
								<span class="product-info__num">
									x{{ item.count }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section class="order-total-container">
				<ul class="order-total">
					<li>
						<span>{{ $t('Subtotal') }}:</span>
						<ProductPrice :data="info.totalPrice" />
					</li>
					<li>
						<span>{{ $t('Shipping') }}:</span>
						<ProductPrice :data="info.deliveryPrice" />
					</li>
					<li>
						<span>{{ $t('Promotion') }}:</span>
						<span>
							-
							<ProductPrice :data="info.discountPrice" />
						</span>
					</li>
					<li>
						<span>{{ $t('Total') }}:</span>
						<ProductPrice
							class="order-total__amount"
							:data="info.payPrice"
						/>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>
