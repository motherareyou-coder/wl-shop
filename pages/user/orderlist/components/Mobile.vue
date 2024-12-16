<script setup lang="ts">
import type { OrderDetail } from '~/types'
import { statusText } from '../utils'
import './Mobile.scss'

const statusOptions = [
	{ value: '', label: $t('All Order') },
	{ value: 0, label: $t('Awaiting payment') },
	{ value: 10, label: $t('Awaiting ship') },
	{ value: 20, label: $t('Shipping') },
	{ value: 30, label: $t('Awaiting review') },
]
const statusClass = {
	0: 'paying',
	10: 'waiting',
	20: 'ship',
	30: 'delivered',
	40: 'close',
}

const route = useRoute()
const status = ref('')
watchEffect(() => {
	status.value = (route.query.type as string) || ''
})
const { data, load, reset } = useInfiteLoad<OrderDetail>((params) => {
	const p = {
		...params,
		status: status.value,
	}
	if (status.value === 30)
		p.commentStatus = false
	return $api('trade/order/page', {
		params: p,
	})
})
watch(status, reset)

const router = useRouter()
function goDetail({ id }: OrderDetail) {
	router.push($path(`/user/orderview/${id}`))
}
</script>

<template>
	<div class="order-list-wrapper--mobile">
		<div class="order-list-header--mobile overflow-y-auto">
			<ul class="flex my-1">
				<li
					v-for="option in statusOptions"
					:key="option.value"
					class="whitespace-nowrap"
					:class="{ 'is-active': `${status}` === `${option.value}` }"
					@click="status = option.value"
				>
					{{ option.label }}
				</li>
			</ul>
		</div>
		<div
			v-infinite-scroll="load"
			class="infinite-scroll infinite-scroll--mobile"
		>
			<ul class="order-list">
				<li
					v-for="order in data"
					:key="order.id"
					class="order-item"
					:class="[
						`order--${statusClass[order.status]?.toLowerCase()}`,
					]"
				>
					<div class="order-item__header">
						<div class="order-item__header__left">
							<div class="order-item__time">
								{{ `${order.no}` }}
							</div>
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
						<nuxt-link class="order-item__link" :to="$path(`/user/orderview/${order.id}`)">
							<div
								v-for="item in order.items"
								:key="item.id"
								class="commodity-item"
							>
								<div class="commodity-item__image">
									<app-image
										class="mr-5 w-16 h-16"
										:src="item.picUrl"
									/>
								</div>
								<div class="commodity-item__info">
									<p>{{ item.spuName }} {{ item.properties?.length > 1 ? item.properties?.map(p => p.valueName).join(' ') : '' }}</p>
								</div>
							</div>
						</nuxt-link>
					</div>
					<div class="order-item__footer">
						<div class="order-item__footer__left">
							<span class="order-item__totalprice">
								{{ $t('Total') }}
								<ProductPrice :data="order.payPrice" />
							</span>
						</div>
						<div class="order-item__footer__right">
							<nuxt-link
								v-if="order.status === 0"
								:to="
									$path(
										`/user/checkout?orderId=${order.id}`,
									)
								"
							>
								<el-button
									class="order-item__button order-item__button--active"
									size="small"
								>
									{{ $t('Pay Now') }}
								</el-button>
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
	li {
		margin: 10px 16px;
	}
	.is-active {
		color: var(--text-primary);
	}
}
.order-list-wrapper--mobile {
	.status {
		color: #616161;
	}
	.order--paying .status,
	.order--waiting .status {
		color: #ff6700;
	}

	.order--paid .status,
	.order--ship .status {
		color: #83c44e;
	}
}
</style>
