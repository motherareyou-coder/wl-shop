<script setup lang="ts">
import type { ExpressTrack, OrderDetail } from '~/types'
import { statusText } from '../../orderlist/utils'

const props = defineProps({
	data: { type: Object as () => OrderDetail, required: true },
	tracks: { type: Object as () => ExpressTrack[] },
	loading: { type: Boolean },
})
const emit = defineEmits(['command'])
const data = computed(() => props.data)
</script>

<template>
	<div class="order-view--mobile">
		<section class="p-4 bg-white my-2">
			<div class="flex justify-between">
				<p>
					<span>{{ $t('Order ID') }}: </span>
					<span>
						{{ data.no }}
					</span>
				</p>
				<p class="whitespace-nowrap ml-1" style="color: var(--primary-base)">
					{{ statusText[data.status] && $t(statusText[data.status]) }}
				</p>
			</div>
			<div class="mt-1">
				<p style="color: var(--title-light)">
					<app-time :data="data.createTime" />
				</p>
			</div>
		</section>
		<section class="p-4 bg-white my-2">
			<div class="flex">
				<div class="mr-2 text-xl">
					<el-icon style="color: var(--title-light)">
						<ElIconLocation />
					</el-icon>
				</div>
				<div class="flex flex-col">
					<span>
						{{ `${data.receiverName} ${data.receiverMobile}` }}
					</span>
					<p class="mt-1" style="color: var(--title-light)">
						{{ data.receiverDetailAddress }}
					</p>
				</div>
			</div>
		</section>
		<section v-if="props.tracks?.length" class="p-4 bg-white my-2 p-2 pb-0">
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
		<section class="p-4 bg-white my-2">
			<div>
				<p>
					{{ $t('Order items') }}
				</p>
			</div>
			<div v-for="item in data.items" :key="item.id" class="flex my-4">
				<nuxt-link :to="$path(`/product/${item.id}`)" class="flex mr-2">
					<app-image class="h-20 w-20" :src="item.picUrl" />
				</nuxt-link>
				<div class="flex flex-col justify-between flex-1">
					<span style="color: #000">
						{{ item.spuName }}
					</span>
					<span class="text-xs" style="color: #b4b4be">
						{{ item.properties?.map(p => p.valueName).join(' ') }}
					</span>
					<span class="text-xs flex justify-between items-center">
						<span>
							<ProductPrice :data="item.payPrice" />
							<span style="color: #b4b4be">
								{{ ` x ${item.count}` }}
							</span>
						</span>
						<el-button
							v-if="item.afterSaleStatus === 20"
							style="padding: 6px; font-size: 12px"
							:disabled="props.loading"
							@click="emit('command', 'aftersale-view', item)"
						>
							{{ $t('Refund success') }}
						</el-button>
						<el-button
							v-else-if="item.afterSaleStatus === 10"
							style="padding: 6px; font-size: 12px"
							:disabled="props.loading"
							@click="emit('command', 'aftersale-view', item)"
						>
							{{ $t('Partial refund') }}
						</el-button>
						<el-button
							v-else-if="item.afterSaleStatus === 0 && data.status === 10 || data.status === 20"
							style="padding: 6px; font-size: 12px"
							:disabled="props.loading"
							@click="emit('command', 'aftersale', item)"
						>
							{{ $t('After Sale') }}
						</el-button>
					</span>
				</div>
			</div>
		</section>
		<section class="p-4 bg-white my-2">
			<ul>
				<li class="flex justify-between my-1">
					<span class="whitespace-nowrap">{{ $t('Subtotal') }}:</span>
					<ProductPrice :data="data.totalPrice" />
				</li>
				<li class="flex justify-between my-1">
					<span class="whitespace-nowrap">{{ $t('Shipping') }}:</span>
					<ProductPrice :data="data.deliveryPrice" />
				</li>
				<li class="flex justify-between my-1">
					<span class="whitespace-nowrap">{{ $t('Promotion') }}:</span>
					<span>
						-
						<ProductPrice :data="data.discountPrice" />
					</span>
				</li>
				<li class="flex justify-between my-1">
					<span class="whitespace-nowrap">{{ $t('Total') }}:</span>
					<ProductPrice class="order-total__amount" :data="data.payPrice" />
				</li>
			</ul>
		</section>
		<section class="order-action-container my-2 bg-white p-2 sticky bottom-0">
			<div class="flex justify-end">
				<el-button
					v-if="data.status === 0"
					type="info"
					:disabled="props.loading"
					@click="emit('command', 'cancel')"
				>
					{{ $t('CancelOrder') }}
				</el-button>
				<el-button
					v-if="data.status === 0"
					:disabled="props.loading"
					type="info"
					@click="emit('command', 'pay')"
				>
					{{ $t('Pay Now') }}
				</el-button>
				<el-button
					v-if="data.status === 40 || data.status === 30"
					:disabled="props.loading"
					type="info"
					@click="emit('command', 'delete')"
				>
					{{ $t('DeleteOrder') }}
				</el-button>
				<el-button
					v-if="data.status === 20"
					:disabled="props.loading"
					type="info"
					@click="emit('command', 'receive')"
				>
					{{ $t('ReceiveOrder') }}
				</el-button>
			</div>
		</section>
	</div>
</template>

<style lang="scss">
.order-action-container {
	box-shadow: 0 -2px 4px 0 rgba(25, 25, 25, 0.08);
}
</style>
