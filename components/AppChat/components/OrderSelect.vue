<script setup lang="ts">
import { getStatusText, statusClass } from '~/pages/user/orderlist/utils'
import type { OrderDetail } from '~/types'
import '~/pages/user/orderlist/components/Mobile.scss'

const emit = defineEmits(['send'])
const { data, load, loading } = useInfiteLoad<OrderDetail>(p =>
	$api('trade/order/page', { params: p }),
)
const appStore = useAppStore()
</script>

<template>
	<app-modal
		:model-value="true"
		:title="$t('选择订单')"
		:style="appStore.isMobile ? 'min-height: 100vh' : ''"
	>
		<div
			v-loading="loading"
			class="order-list-wrapper--mobile overflow-y-auto"
			:style="appStore.isMobile ? '' : 'height:40rem'"
		>
			<ul v-infinite-scroll="load" class="order-list">
				<li
					v-for="order in data"
					:key="order.id"
					class="order-item"
					:class="`order--${statusClass[order.status]?.toLowerCase()}`"
				>
					<div class="order-item__header">
						<div class="order-item__header__left">
							<div class="order-item__time">
								{{ `${order.no}` }}
							</div>
						</div>
						<div class="order-item__header__right">
							<span class="order-item__status">
								{{ $t(getStatusText(order)) }}
							</span>
						</div>
					</div>
					<div class="order-item__content">
						<div v-for="item in order.items" :key="item.id" class="commodity-item">
							<div class="commodity-item__image">
								<app-image class="mr-5 w-16 h-16" :src="item.picUrl" :alt="item.spuName"/>
							</div>
							<div class="commodity-item__info">
								<p>
									{{ item.spuName }} {{ item.properties?.length > 1 ? item.properties?.map(p =>
										p.valueName).join(' ') : '' }}
								</p>
							</div>
						</div>
					</div>
					<div class="order-item__footer">
						<div class="order-item__footer__left">
							<span class="order-item__totalprice">
								{{ $t('Total') }}
								<ProductPrice :data="order.payPrice" />
							</span>
						</div>
						<div class="order-item__footer__right">
							<el-button type="info" size="small" @click="emit('send', order.id)">
								{{ $t('发送') }}
							</el-button>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</app-modal>
</template>
