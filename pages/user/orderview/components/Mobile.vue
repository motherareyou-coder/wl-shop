<script setup lang="ts">
import { statusText } from '../../orderlist/utils'
import type { ExpressTrack, OrderDetail } from '~/types'
import './Mobile.scss'

const props = defineProps({
	data: { type: Object as () => OrderDetail, required: true },
	tracks: { type: Object as () => ExpressTrack[] },
})
const data = computed(() => props.data)

useHead({
	style: ['html{ font-size: 45.5px }'],
})
</script>

<template>
	<div class="order-view-wrapper miv4">
		<div class="order-view">
			<section class="order-info">
				<div class="order-info__wrap">
					<p class="order-info__id">
						<span class="">{{ $t('Order ID') }}: </span>
						<span class="order-info__text">
							{{ data.no }}
						</span>
					</p>
					<p class="order-info__status whitesapce-nowrap">
						{{ statusText[data.status] && $t(statusText[data.status]) }}
					</p>
				</div>
				<div class="order-info__wrap">
					<p class="order-info__date">
						{{ data.createTime }}
					</p>
				</div>
			</section>
			<section class="order-address--mobile">
				<div class="container">
					<el-icon class="micon micon-location address-icon">
						<ElIconLocation />
					</el-icon>
					<div class="address-info">
						<span class="address-info__name">
							{{ data.receiverName }}
						</span>
						<span class="address-info__tel">
							{{ data.receiverMobile }}
						</span>
						<p class="address-info__detail">
							{{ data.receiverDetailAddress }}
						</p>
					</div>
				</div>
			</section>
			<section v-if="props.tracks?.length" class="order-express p-2 pb-0">
				<el-timeline>
					<el-timeline-item
						v-for="(s, i) in props.tracks"
						:key="i" :timestamp="s.time"
					>
						{{ s.content }}
					</el-timeline-item>
				</el-timeline>
			</section>
			<section class="orderview-product">
				<div class="product-info__titleWrap">
					<p class="product-info__title">
						{{ $t('Order items') }}
					</p>
				</div>
				<div
					v-for="item in data.items"
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
						<ProductPrice :data="data.totalPrice" />
					</li>
					<li>
						<span>{{ $t('Shipping') }}:</span>
						<ProductPrice :data="data.deliveryPrice" />
					</li>
					<li>
						<span>{{ $t('Promotion') }}:</span>
						<span>
							-
							<ProductPrice :data="data.discountPrice" />
						</span>
					</li>
					<li>
						<span>{{ $t('Total') }}:</span>
						<ProductPrice
							class="order-total__amount"
							:data="data.payPrice"
						/>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>
