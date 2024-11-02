<script setup lang="ts">
import { statusText } from '../../orderlist/utils'
import type { ExpressTrack, OrderDetail } from '~/types'
import './PC.scss'

const props = defineProps({
	data: { type: Object as () => OrderDetail, required: true },
	tracks: { type: Object as () => ExpressTrack[] },
})
const data = computed(() => props.data)
</script>

<template>
	<div class="order-view-main">
		<div class="user-layout__container miv4">
			<div class="mi-breadcrumbs user-layout__breadcrumbs"></div>
			<div class="user-main">
				<div class="order-view-main--title">
					{{ $t('MY ORDER') }}
				</div>
				<div class="order-view-main--order-num-message order-message">
					<div class="order-message--order-id">
						{{ $t('Order number') }} {{ data.no }}
					</div>
					<div class="order-message--button-groups">
						<section></section>
					</div>
				</div>
				<div class="placeholder-dom"></div>
				<section class="expressInfo">
					<h2
						class="deliver-status-title"
						:class="[`deliver-status-title--${data.status}`]"
					>
						{{ statusText[data.status] && $t(statusText[data.status]) }}
					</h2>
					<section v-if="data.status === 0" class="showPayInfo">
						<div class="order-express__pay-countdown">
							<span>{{ $t('Awaiting payment') }}</span>
						</div>
					</section>
					<section class="deliver-status-descp"></section>
				</section>
				<section v-if="props.tracks?.length">
					<el-timeline>
						<el-timeline-item
							v-for="(s, i) in props.tracks"
							:key="i" :timestamp="s.time"
						>
							{{ s.content }}
						</el-timeline-item>
					</el-timeline>
				</section>
				<section class="package-detail">
					<ul class="package-detail__list">
						<li class="package-detail__item">
							<ul class="package-detail__product-list">
								<div
									v-for="g in data.items"
									:key="g.id"
									class="product-item__wrapper"
								>
									<div
										class="product-main--item product-item"
									>
										<div class="product-item__wrap">
											<span
												class="product-item--image product-info-item"
											>
												<nuxt-link
													:to="
														$path(
															`/product/${g.id}`,
														)
													"
													target="blank"
												>
													<app-image
														:src="g.picUrl"
													/>
												</nuxt-link>
											</span>
											<div
												class="product-item--name product-info-item"
											>
												<div
													class="product-item--name__wrap"
												>
													<nuxt-link
														:to="
															$path(
																`/product/${g.id}`,
															)
														"
													>
														<span
															class="product-item__product-name"
														>
															{{ g.spuName }}
														</span>
													</nuxt-link>
												</div>
											</div>
											<span class="product-item--price">
												<ProductPrice
													:data="g.payPrice"
													class="price"
												/>
											</span>
										</div>
									</div>
								</div>
							</ul>
						</li>
					</ul>
				</section>
				<section class="message-info order-address">
					<h3 class="message-info__title">
						{{ $t('Delivery address') }}
					</h3>
					<div class="address-info">
						<div class="message-info--name message-info__item">
							<span class="message-info__item-label">
								{{ $t('ReceiverName') }}
							</span>
							<span class="message-info__item-info">
								{{ data.receiverName }}
							</span>
						</div>
						<div class="message-info--address message-info__item">
							<span class="message-info__item-label">
								{{ $t('Address') }}
							</span>
							<span class="message-info__item-info">{{ data.receiverAreaName }} {{ data.receiverDetailAddress }}</span>
						</div>
						<div class="message-info--address message-info__item">
							<span class="message-info__item-label">
								{{ $t('Phone') }}
							</span>
							<span class="message-info__item-info">{{ data.receiverMobile }}</span>
						</div>
					</div>
				</section>
				<section class="order-total-container">
					<ul class="order-price">
						<li>
							<span>
								<ProductPrice :data="data.totalPrice" />
							</span>
							<span>{{ $t('Subtotal') }}: </span>
						</li>
						<li>
							<span>
								<ProductPrice :data="data.deliveryPrice" />
							</span>
							<span class="shipping-help">{{ $t('Shipping') }}:
							</span>
						</li>
						<li>
							<span>
								-
								<ProductPrice :data="data.discountPrice" />
							</span>
							<span>{{ $t('Promotion') }}: </span>
						</li>
						<li>
							<span>
								<ProductPrice
									class="order-total-count"
									:data="data.payPrice"
								/>
							</span>
							<span class="total__label">{{ $t('Total') }}:
							</span>
						</li>
					</ul>
				</section>
			</div>
		</div>
	</div>
</template>
