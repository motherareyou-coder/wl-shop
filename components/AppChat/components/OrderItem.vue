<script setup lang="ts">
import { isObject } from 'lodash-es'
import { getStatusText } from '~/pages/user/orderlist/utils'
import type { OrderDetail } from '~/types'

const data = defineModel<OrderDetail>({ required: true })

if (!isObject(data.value)) {
  let orderId = JSON.parse(data.value)?.id
	data.value = await $api<OrderDetail>(
		'trade/order/get-detail',
		{ params: { id: orderId } },
	)
}
</script>

<template>
	<div v-if="data" class="order-item">
		<div class="order-item__header">
			<div class="order-item__header__left">
				<div class="order-item__time">
					{{ `${data.no}` }}
				</div>
			</div>
			<div class="order-item__header__right">
				<span class="order-item__status">
					{{ $t(getStatusText(data)) }}
				</span>
			</div>
		</div>
		<div class="order-item__content">
			<div v-for="item in data.items" :key="item.id" class="commodity-item">
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
					<ProductPrice :data="data.payPrice" />
				</span>
			</div>
		</div>
	</div>
</template>
