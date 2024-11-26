<script setup lang="ts">
import type { ExpressTrack, OrderDetail } from '~/types'
import { statusText } from '../../orderlist/utils'
import './PC.scss'

const props = defineProps({
	data: { type: Object as () => OrderDetail, required: true },
	tracks: { type: Object as () => ExpressTrack[] },
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
							@click="emit('command', 'cancel')"
						>
							{{ $t('CancelOrder') }}
						</el-button>
						<el-button
							v-if="data.status === 0"
							class="btn"
							:disabled="props.loading"
							type="info"
							@click="emit('command', 'pay')"
						>
							{{ $t('Pay Now') }}
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
						:class="[`deliver-status-title--${data.status}`]"
					>
						{{
							statusText[data.status]
								&& $t(statusText[data.status])
						}}
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
							v-for="(track, i) in props.tracks"
							:key="i"
							:timestamp="track.time"
						>
							{{ track.content }}
						</el-timeline-item>
					</el-timeline>
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
									{{ $t('Partial refund') }}
								</el-button>
								<el-button
									v-else-if="item.afterSaleStatus === 0 && data.status === 10 || data.status === 20"
									style="padding: 6px;font-size: 12px;border-radius: 0;"
									:disabled="props.loading"
									@click="emit('command', 'aftersale', item)"
								>
									{{ $t('After Sale') }}
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
							<tr>
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
