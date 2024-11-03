<script setup lang="ts">
import { statusText } from '../utils'
import type { OrderDetail } from '~/types'
import './Mobile.scss'

useHead({
	style: ['html{ font-size: 45.5px }'],
})
const statusOptions = [
	{ value: '', label: $t('All Order') },
	{ value: 0, label: $t('Awaiting payment') },
	{ value: 10, label: $t('Awaiting ship') },
	{ value: 20, label: $t('Shipping') },
	{ value: 30, label: $t('Awaiting review') },
]

const route = useRoute()
const status = ref(route.query.type || '')
const { data, load, reset } = useInfiteLoad<OrderDetail>(params =>
	$api('trade/order/page?apifoxApiId=219807468', {
		params: { ...params, status: status.value },
	}),
)
watch(status, reset)
</script>

<template>
	<div class="order-list-wrapper">
		<div class="order-list-header--mobile overflow-y-auto">
			<ul class="flex my-1 ">
				<li
					v-for="o in statusOptions"
					:key="o.value"
					class="mi-tabs__item whitespace-nowrap"
					:class="{ 'is-active': status === o.value }"
					@click="status = o.value"
				>
					{{ o.label }}
				</li>
			</ul>
		</div>
		<div
			v-infinite-scroll="load"
			class="infinite-scroll infinite-scroll--mobile order-list__wrapper miv4"
		>
			<ul class="order-list">
				<li
					v-for="order in data"
					:key="order.id"
					class="order-item--mobile"
				>
					<div class="order-item__header">
						<div class="order-item__header__left">
							<span class="order-item__time">
								{{ order.createTime }}
							</span>
						</div>
						<div class="order-item__header__right">
							<span class="order-item__status">
								{{
									statusText[order.status]
										&& $t(statusText[order.status])
								}}
							</span>
						</div>
					</div>
					<div class="order-item__content">
						<nuxt-link
							:to="$path(`/user/orderview/${order.id}`)"
						>
							<div
								v-for="item in order.items"
								:key="item.id"
								class="commodity-item"
							>
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
							<span class="order-item__totalprice">{{ $t('Total') }}
								<ProductPrice :data="order.payPrice" /></span>
						</div>
						<div class="order-item__footer__right">
							<nuxt-link
								:to="$path(`/user/orderview/${order.id}`)"
								class="goods-list-order-btn--white order-btn"
							>
								{{ $t('ORDER DETAILS') }}
							</nuxt-link>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss">
.order-list-header--mobile {
	position: sticky;
	top: var(--header-height);
	background: #fff;
	z-index: 20;
	margin-top: -2px;
	.mi-tabs__header {
		margin: 0;
		padding: 0 8px;
	}
	.mi-tabs__item {
		padding: 0 20px !important;
	}
}
</style>
