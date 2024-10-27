<script setup lang="ts">
import { statusOptions, statusText } from '../utils'
import type { OrderDetail } from '~/types'
import './Mobile.scss'

useHead({
	style: ['html{ font-size: 45.5px }'],
})

const statusOptions = [
	{ value: '', label: 'All Order' },
	{ value: 0, label: 'Awaiting payment' },
	{ value: 10, label: 'Awaiting ship' },
	{ value: 20, label: 'Shipping' },
	{ value: 30, label: 'Awaiting review' },
]

const status = ref('')
const { data, load, reset } = useInfiteLoad<OrderDetail>(params =>
	$api('trade/order/page?apifoxApiId=219807468', {
		params: { ...params, status: status.value },
	}),
)
watch(status, reset)
</script>

<template>
	<el-tabs v-model="status" class="order-list-header--mobile" style="background-color: #fff;">
		<el-tab-pane v-for="o in statusOptions" :key="o.value" :label="$t(o.label)" :name="o.value" />
	</el-tabs>
	<div
		v-infinite-scroll="load"
		class="infinite-scroll infinite-scroll--mobile order-list__wrapper miv4"
	>
		<ul class="order-list">
			<li v-for="order in data" :key="order.id" class="order-item--mobile">
				<div class="order-item__header">
					<div class="order-item__header__left">
						<span class="order-item__time">
							{{ order.createTime }}
						</span>
					</div>
					<div class="order-item__header__right">
						<span class="order-item__status">
							{{ statusText[order.status] && $t(statusText[order.status]) }}
						</span>
					</div>
				</div>
				<div class="order-item__content">
					<nuxt-link :to="$path(`/user/orderview?orderId=${order.id}`)">
						<div v-for="item in order.items" :key="item.id" class="commodity-item">
							<div class="commodity-item__image">
								<app-image :src="item.picUrl" />
							</div>
							<div class="commodity-item__info">
								<p>{{ item.spuName }}</p>
							</div>
						</div>
					</nuxt-link>
				</div>
				<div class="order-item__footer">
					<div class="order-item__footer__left">
						<span class="order-item__totalprice">{{ $t('Total') }} <ProductPrice :data="order.payPrice" /></span>
					</div>
					<div class="order-item__footer__right">
						<button v-if="order.status === 0" class="order-item__button order-item__button--active">
							{{ $t('Pay Now') }}
						</button>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<style lang="scss">
.order-list-header--mobile{
	.mi-tabs__header{
		margin:0;
		padding: 0 8px;
	}
}
</style>
