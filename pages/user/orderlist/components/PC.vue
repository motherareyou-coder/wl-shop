<script setup lang="ts">
import type { OrderDetail } from '~/types'
import { statusOptions, statusText } from '../utils'
import './PC.scss'

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
const {
	data: orderList,
	pagination,
	resetData,
} = useTablePagination<OrderDetail>((p = {}) =>
	$api('trade/order/page', {
		params: { ...p, status: status.value },
	}),
)
watch(status, resetData)
</script>

<template>
	<div class="user-order-list miv4 mb-10">
		<div class="user-layout__container miv4">
			<div class="user-main">
				<section>
					<div class="user-order-list-container">
						<h1 class="user-order-list-container_title">
							{{ $t('My Orders') }}
						</h1>
						<div class="user-order-list miv4">
							<div class="tag-nav">
								<li class="active">
									{{ $t('My Orders') }}
								</li>
								<li>
									<nuxt-link :to="$path('/user/aftersale')">
										{{ $t('AfterSales') }}
									</nuxt-link>
								</li>
							</div>
						</div>
						<ul
							class="user-order-list-container_nav order-list__nav"
						>
							<li
								v-for="option in statusOptions"
								:key="option.value"
								class="order-list__nav__title title"
								@click="status = option.value"
							>
								<span
									:class="{
										'title-active':
											`${status}` === `${option.value}`,
									}"
								>
									{{ $t(option.label) }}
								</span>
							</li>
						</ul>
						<ul>
							<section v-for="order in orderList" :key="order.no">
								<li
									class="order-item"
									:class="[
										`order-item--${statusClass[
											order.status
										]?.toLowerCase()}`,
									]"
								>
									<div class="order-item-header">
										<p
											class="order-item-header--title show-tag"
										>
											{{
												statusText[order.status]
													&& $t(statusText[order.status])
											}}
										</p>
										<p class="info"></p>
									</div>
									<div class="order-item-info info">
										<ul class="info-left">
											<li class="info-left_time">
												<app-time :data="order.createTime" />
											</li>
											<!-- <li class="info-left-name">
												{{ o.receiverName }}
											</li> -->
											<li
												class="info-left-order-id order-id"
											>
												{{ $t('Order number') }}:
												{{ order.no }}
											</li>
										</ul>
										<div class="info-right">
											<div class="info__detail">
												<span
													class="info-right-total__title"
												>
													{{ $t('Total') }}:
												</span>
												<span
													class="info-right-total__num"
												>
													<ProductPrice
														:data="order.payPrice"
													/>
												</span>
											</div>
										</div>
									</div>
									<div
										class="order-item-goodslist goods-list"
									>
										<div class="goods-list-order-btn">
											<nuxt-link
												v-if="order.status === 0"
												:to="
													$path(
														`/user/checkout?orderId=${order.id}`,
													)
												"
												class="goods-list-order-btn--orange order-btn"
											>
												{{ $t('Pay Now') }}
											</nuxt-link>
											<nuxt-link
												:to="
													$path(
														`/user/orderview/${order.id}`,
													)
												"
												class="goods-list-order-btn--white order-btn"
											>
												{{ $t('ORDER DETAILS') }}
											</nuxt-link>
										</div>
										<div class="goods-list-gooods-info">
											<div
												v-for="item in order.items"
												:key="item.id"
												class="goods-list-gooods-info__container my-2"
											>
												<div
													class="goods-list-gooods-info__img"
												>
													<nuxt-link
														:to="
															$path(
																`/product/${item.id}`,
															)
														"
														target="blank"
													>
														<app-image
															:src="item.picUrl"
														/>
													</nuxt-link>
												</div>
												<div
													class="goods-list-gooods-info__wrap"
												>
													<div
														class="goods-list-gooods-info__information information"
													>
														<div>
															{{ item.spuName }}
														</div>
														<div>
															<ProductPrice
																:data="item.price"
															/>
															{{ `x ${item.count}` }}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</li>
							</section>
						</ul>
					</div>
					<div class="user-order-list__pagination">
						<el-pagination
							v-if="pagination.total"
							v-model:page-size="pagination.pageSize"
							v-model:current-page="pagination.currentPage"
							:total="pagination.total"
						/>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>
