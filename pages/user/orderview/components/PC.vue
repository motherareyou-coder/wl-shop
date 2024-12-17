<script setup lang="ts">
import type { OrderDetail } from '~/types'
import { getStatusText, statusClass } from '../../orderlist/utils'
import './PC.scss'

const props = defineProps({
	data: { type: Object as () => OrderDetail, required: true },
	loading: { type: Boolean },
})
const emit = defineEmits(['command'])
const data = computed(() => props.data)
</script>

<template>
	<div class="order-view-main mb-10">
		<div class="user-layout__container miv4">
			<div class="user-main">
				<div class="order-view-main--title">
					{{ $t('MY ORDER') }}
				</div>
				<div class="order-view-main--order-num-message order-message">
					<div class="order-message--order-id">
						{{ $t('Order number') }} {{ data.no }}
					</div>
					<div class="order-message--button-groups">
						<el-button
							v-if="data.status === 0"
							class="btn"
							:disabled="props.loading"
							type="primary"
							@click="emit('command', 'pay')"
						>
							{{ $t('Pay Now') }}
						</el-button>
						<el-button
							v-if="data.status === 0"
							class="btn"
							:disabled="props.loading"
							@click="emit('command', 'cancel')"
						>
							{{ $t('CancelOrder') }}
						</el-button>
						<el-button
							v-if="data.status === 40 || data.status === 30"
							class="btn"
							:disabled="props.loading"
							@click="emit('command', 'delete')"
						>
							{{ $t('DeleteOrder') }}
						</el-button>
						<el-button
							v-if="data.status === 20"
							class="btn"
							type="info"
							:disabled="props.loading"
							@click="emit('command', 'receive')"
						>
							{{ $t('ReceiveOrder') }}
						</el-button>
					</div>
				</div>
				<div class="placeholder-dom"></div>
				<section class="expressInfo">
					<h2
						class="deliver-status-title"
						:class="[`deliver-status-title--${statusClass[data.status]}`]"
					>
						{{ $t(getStatusText(data)) }}
					</h2>
					<section v-if="data.status === 0" class="deliver-status-descp">
						<div class="order-express__pay-countdown">
							<span class="color-mi" fmp-c="3">*</span>
							{{ $t('Please complete the payment within') }}
							<app-count-down :end-time="data.payExpireTime" class="inline-flex" />
							{{ $t('. Unpaid orders (except for COD ones) will be cancelled automatically afterwards.') }}
						</div>
					</section>
					<section v-if="false" class="order-express">
						<ul class="order-express__express-box">
							<li class="express-item" :class="[data.status >= 0 ? 'active' : 'noraml']">
								<div class="express-item__container" :class="[data.status >= 0 ? 'express-item__container--active active--last-child' : 'express-item__container--normal']">
									<p>{{ $t('Order placed') }}</p>
								</div>
								<div class="express-time">
									<app-time :data="data.createTime" />
								</div>
							</li>
							<li class="express-item" :class="[data.status >= 20 ? 'active' : 'noraml']">
								<div class="express-item__container" :class="[data.status >= 20 ? 'express-item__container--active active--last-child' : 'express-item__container--normal']">
									<p>{{ $t('Paid') }}</p>
								</div>
								<div class="express-time">
									<app-time :data="data.createTime" />
								</div>
							</li>
							<li class="express-item" :class="[data.status >= 30 ? 'active' : 'noraml']">
								<div class="express-item__container" :class="[data.status >= 30 ? 'express-item__container--active active--last-child' : 'express-item__container--normal']">
									<p>{{ $t('Processed') }}</p>
								</div>
								<div class="express-time">
									<app-time :data="data.createTime" />
								</div>
							</li>
							<li class="express-item" :class="[data.status >= 40 ? 'active' : 'noraml']">
								<div class="express-item__container" :class="[data.status >= 40 ? 'express-item__container--active active--last-child' : 'express-item__container--normal']">
									<p>{{ $t('Shipped') }}</p>
								</div>
								<div class="express-time">
									<app-time :data="data.createTime" />
								</div>
							</li>
							<li class="express-item" :class="[data.status === 10 ? 'active' : 'noraml']">
								<div class="express-item__container" :class="[data.status === 50 ? 'express-item__container--active active--last-child' : 'express-item__container--normal']">
									<p>{{ $t('Delivered') }}</p>
								</div>
								<div class="express-time">
									<app-time :data="data.createTime" />
								</div>
							</li>
						</ul>
					</section>
				</section>
				<section v-if="data.logisticsNo">
					<el-button type="info" @click="emit('command', 'track')">
						{{ $t('查看物流轨迹') }}
					</el-button>
				</section>
				<section class="package-detail">
					<div class="flex flex-col package-detail__item">
						<div
							v-for="item in data.items"
							:key="item.id"
							class="flex py-8"
						>
							<nuxt-link
								:to="$path(`/product/${item.spuId}`)"
								target="blank"
								class="flex mr-5"
							>
								<app-image
									class="h-20 w-20"
									:src="item.picUrl"
								/>
							</nuxt-link>
							<div class="flex flex-col justify-between flex-1">
								<div>
									<nuxt-link
										:to="$path(`/product/${item.spuId}`)"
									>
										{{ item.spuName }}
									</nuxt-link>
								</div>
								<div class="text-xs" style="color: #b4b4be">
									{{
										item.properties
											?.map((p) => p.valueName)
											.join(' ')
									}}
								</div>
								<div>
									<ProductPrice :data="item.payPrice" />
									<span style="color: #b4b4be">
										{{ ` x ${item.count}` }}
									</span>
								</div>
							</div>
							<div>
								<el-button
									v-if="item.afterSaleStatus === 20"
									style="padding: 6px;font-size: 12px;border-radius: 0;"
									:disabled="props.loading"
									@click="emit('command', 'aftersale-view', item)"
								>
									{{ $t('Refund success') }}
								</el-button>
								<el-button
									v-else-if="item.afterSaleStatus === 10"
									style="padding: 6px;font-size: 12px;border-radius: 0;"
									:disabled="props.loading"
									@click="emit('command', 'aftersale-view', item)"
								>
									{{ $t('Refunding') }}
								</el-button>
								<el-button
									v-else-if="item.afterSaleStatus === 0 && [10, 20, 30].includes(data.status)"
									style="padding: 6px;font-size: 12px;border-radius: 0;"
									:disabled="props.loading"
									@click="emit('command', 'aftersale', item)"
								>
									{{ $t('After Sale') }}
								</el-button>
								<el-button
									v-if="item.commentStatus === false && [30].includes(data.status)"
									style="padding: 6px;font-size: 12px;border-radius: 0;"
									:disabled="props.loading"
									@click="emit('command', 'review', item)"
								>
									{{ $t('评价') }}
								</el-button>
							</div>
						</div>
					</div>
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
							<span class="message-info__item-info">
								{{
									`${data.receiverAreaName} ${data.receiverDetailAddress} ${data.receiverDetailAddress2} ${data.receiverHouseNumber}`
								}}
							</span>
						</div>
						<div class="message-info--address message-info__item">
							<span class="message-info__item-label">
								{{ $t('Phone') }}
							</span>
							<span class="message-info__item-info">
								{{
									`${data.receiverCountryCode} ${data.receiverMobile}`
								}}
							</span>
						</div>
					</div>
				</section>
				<section class="order-total-container">
					<ul class="order-price">
						<table class="float-right text-right">
							<tr>
								<td><span>{{ $t('Total') }}: </span></td>
								<td><ProductPrice :data="data.totalPrice" /></td>
							</tr>
							<tr>
								<td><span>{{ $t('Discount') }}: </span></td>
								<td>-<ProductPrice :data="data.discountPrice" /></td>
							</tr>
							<tr>
								<td><span>{{ $t('VipDiscount') }}: </span></td>
								<td>-<ProductPrice :data="data.vipPrice" /></td>
							</tr>
							<tr>
								<td><span>{{ $t('PointDiscount') }}: </span></td>
								<td>-<ProductPrice :data="data.pointPrice" /></td>
							</tr>
							<tr>
								<td><span>{{ $t('Shipping fee') }}: </span></td>
								<td><ProductPrice :data="data.deliveryPrice" /></td>
							</tr>
							<tr>
								<td><span class="total__label">{{ $t('PayPrice') }}:</span></td>
								<td>
									<span class="order-total-count mx-0">
										<ProductPrice :data="data.payPrice" />
									</span>
								</td>
							</tr>
							<tr v-if="data.refundStatus !== 0 && (data.refundPrice && data.refundPrice > 0)">
								<td><span class="total__label">{{ $t('RefundPrice') }}:</span></td>
								<td>+<ProductPrice class="order-total-count" :data="data.refundPrice" /></td>
							</tr>
						</table>
						<!-- <li> -->
						<!--	<span> -->
						<!--		<ProductPrice :data="data.deliveryPrice" /> -->
						<!--	</span> -->
						<!--	<span class="shipping-help">{{ $t('Shipping') }}: -->
						<!--	</span> -->
						<!-- </li> -->
						<!-- <li> -->
						<!--	<span> -->
						<!--		- -->
						<!--		<ProductPrice :data="data.discountPrice" /> -->
						<!--	</span> -->
						<!--	<span>{{ $t('Promotion') }}: </span> -->
						<!-- </li> -->
					</ul>
				</section>
			</div>
		</div>
	</div>
</template>
