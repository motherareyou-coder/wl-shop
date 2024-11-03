<script setup lang="ts">
import { statusOptions, statusText } from '../utils'
import type { OrderDetail } from '~/types'
import './PC.scss'

const statusClass = {
	0: 'paying',
	10: 'waiting',
	20: 'ship',
	30: 'delivered',
	40: 'close',
}
const route = useRoute()
const status = ref(route.query.type || '')
const {
	data: orderList,
	pagination,
	resetData,
} = useTablePagination<OrderDetail>((p = {}) =>
	$api('trade/order/page?apifoxApiId=219807468', {
		params: { ...p, status: status.value },
	}).then((res) => {
		res.list.forEach((o) => {
			if (status.value === 0) {
				o.status = 0
			}
			else {
				o.status
					= status.value
					|| [0, 10, 20, 30, 40][Math.ceil(Math.random() * 5)]
			}
		})
		return res
	}),
)
watch(status, resetData)
</script>

<template>
	<div class="user-order-list miv4">
		<div class="user-layout__container miv4">
			<div class="mi-breadcrumbs user-layout__breadcrumbs"></div>
			<div class="user-main">
				<section>
					<div class="user-order-list-container">
						<h1 class="user-order-list-container_title">
							{{ $t('My Orders') }}
						</h1>
						<ul
							class="user-order-list-container_nav order-list__nav"
						>
							<li
								v-for="t in statusOptions"
								:key="t.value"
								class="order-list__nav__title title"
								@click="status = t.value"
							>
								<span
									:class="{
										'title-active': status === t.value,
									}"
								>
									{{ $t(t.label) }}
								</span>
							</li>
						</ul>
						<ul>
							<section v-for="o in orderList" :key="o.no">
								<li
									class="order-item"
									:class="[
										`order-item--${statusClass[
											o.status
										]?.toLowerCase()}`,
									]"
								>
									<div class="order-item-header">
										<p
											class="order-item-header--title show-tag"
										>
											{{
												statusText[o.status]
													&& $t(statusText[o.status])
											}}
										</p>
										<p class="info"></p>
									</div>
									<div class="order-item-info info">
										<ul class="info-left">
											<li class="info-left_time">
												{{ o.createTime }}
											</li>
											<!-- <li class="info-left-name">
												{{ o.receiverName }}
											</li> -->
											<li
												class="info-left-order-id order-id"
											>
												{{ $t('Order number') }}:
												{{ o.no }}
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
														:data="o.payPrice"
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
												v-if="o.status === 0"
												:to="
													$path(
														`/user/checkout?orderId=${o.id}`,
													)
												"
												class="goods-list-order-btn--orange order-btn"
											>
												{{ $t('Pay Now') }}
											</nuxt-link>
											<nuxt-link
												:to="
													$path(
														`/user/orderview/${o.id}`,
													)
												"
												class="goods-list-order-btn--white order-btn"
											>
												{{ $t('ORDER DETAILS') }}
											</nuxt-link>
										</div>
										<div class="goods-list-gooods-info">
											<div
												v-for="g in o.items"
												:key="g.id"
												class="goods-list-gooods-info__container"
											>
												<div
													class="goods-list-gooods-info__img"
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
												</div>
												<div
													class="goods-list-gooods-info__wrap"
												>
													<div
														class="goods-list-gooods-info__information information"
													>
														<div>
															{{ g.spuName }}
														</div>
														<div>
															<ProductPrice
																:data="g.price"
															/>
															{{ `x ${g.count}` }}
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
