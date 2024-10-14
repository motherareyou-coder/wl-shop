<script setup>
import './orderlist.scss'
import { cloneDeep } from 'lodash-es'

const { t } = useI18n()

const tags = ref([
	{ type: 'ALL' },
	{ type: 'Awaiting payment' },
	{ type: 'Shipping' },
	{ type: 'Closed' },
])

const orderList = ref([
	{
		order_id: '5241013667040953',
		order_status: '18',
		goods_amount: '2,382.10',
		add_time: '1728792087',
		order_status_info: {
			apply_refund_info: '',
			apply_refund_status: '',
			delivery_info: '',
			info: 'Closed',
			next: [],
			trace: null,
			payment_pending_info: '',
		},
		product: [
			{
				goods_id: '4223705672',
				product_id: '57298',
				image_url:
					'https://i05.appmifile.com/168_item_uk/24/09/2024/f959b1108cf76b25037b3a38cee95f30.png',
				product_name: 'Xiaomi 14T Pro Titan Black 12 GB + 256 GB',
				cart_price: '649.00',
				product_count: '1',
				price_txt: '649',
				subtotal_txt: '649',
				extentions: {
					goods_dealer: '',
					take_back: false,
				},
				list: null,
				commodity_id: '3223705928',
				jump_url: '',
				item_type: '0',
				insurance_info: null,
				insuranceList: null,
				isInsurance: false,
				productNameExt: {
					productName: '',
					imei: '',
					time: '0',
					isIMEI: true,
				},
				price: '649.00',
				uniquecode: '',
				can_buy_insurance: false,
				loyaltyMultiTimes: 0,
				mode: 0,
				finalPrice: '584.1',
				energy: [null],
				item_no: 1,
				item_extend_data: {
					copy_writing: '',
					start_time: '',
					end_time: '',
				},
				standard_estimated_delivery: '',
				spu_product_id: '',
				trade_in: null,
			},
			{
				goods_id: '4223703657',
				product_id: '53025',
				image_url:
					'https://i05.appmifile.com/899_item_uk/21/02/2024/71bd0315655e3a17edf454bfab4582fe.png',
				product_name: 'Xiaomi 14 Black 12 GB + 512 GB',
				cart_price: '899.00',
				product_count: '2',
				price_txt: '899',
				subtotal_txt: '1,798',
				extentions: {
					goods_dealer: '',
					take_back: false,
				},
				list: null,
				commodity_id: '3223703815',
				jump_url: '',
				item_type: '0',
				insurance_info: null,
				insuranceList: null,
				isInsurance: false,
				productNameExt: {
					productName: '',
					imei: '',
					time: '0',
					isIMEI: true,
				},
				price: '899.00',
				uniquecode: '',
				can_buy_insurance: false,
				loyaltyMultiTimes: 0,
				mode: 0,
				finalPrice: '899',
				energy: [null],
				item_no: 2,
				item_extend_data: {
					copy_writing: '',
					start_time: '',
					end_time: '',
				},
				standard_estimated_delivery: '',
				spu_product_id: '',
				trade_in: null,
			},
			{
				goods_id: '4223701932',
				product_id: '48478',
				image_url:
					'https://i05.appmifile.com/619_item_uk/29/06/2023/e2669e89800dbf21662350413b084cd8.png',
				product_name: 'Xiaomi Pad 6 Mist blue 6 GB + 128 GB',
				cart_price: '0.00',
				product_count: '1',
				price_txt: '0',
				subtotal_txt: '0',
				extentions: {
					goods_dealer: '',
					take_back: false,
				},
				list: null,
				commodity_id: '3223702025',
				jump_url: '',
				item_type: '0',
				insurance_info: null,
				insuranceList: null,
				isInsurance: false,
				productNameExt: {
					productName: '',
					imei: '',
					time: '0',
					isIMEI: true,
				},
				price: '0.00',
				uniquecode: '',
				can_buy_insurance: false,
				loyaltyMultiTimes: 0,
				mode: 23,
				finalPrice: '0',
				energy: [null],
				item_no: 3,
				item_extend_data: {
					copy_writing: '',
					start_time: '',
					end_time: '',
				},
				standard_estimated_delivery: '',
				spu_product_id: '',
				trade_in: null,
			},
			{
				goods_id: '4223705717',
				product_id: '49350',
				image_url:
					'https://i05.appmifile.com/527_item_uk/23/09/2024/8597664250dbbde980f4bfdb796de7d8.png',
				product_name: 'Xiaomi 50W Wireless Charging Stand Pro',
				cart_price: '0.00',
				product_count: '1',
				price_txt: '0',
				subtotal_txt: '0',
				extentions: {
					goods_dealer: '',
					take_back: false,
				},
				list: null,
				commodity_id: '3223705973',
				jump_url: '',
				item_type: '0',
				insurance_info: null,
				insuranceList: null,
				isInsurance: false,
				productNameExt: {
					productName: '',
					imei: '',
					time: '0',
					isIMEI: true,
				},
				price: '0.00',
				uniquecode: '',
				can_buy_insurance: false,
				loyaltyMultiTimes: 0,
				mode: 23,
				finalPrice: '0',
				energy: [null],
				item_no: 4,
				item_extend_data: {
					copy_writing: '',
					start_time: '',
					end_time: '',
				},
				standard_estimated_delivery: '',
				spu_product_id: '',
				trade_in: null,
			},
		],
		order_flow: '0',
		delivers: [],
		difference_amount: '',
		consignee: 'jie chen',
		add_time_fm: 'Sun, 13-Oct-2024 05:01:27 am',
		show_tag: '',
		show_tips: '',
		sales_type: '0',
		order_item_type: [],
		order_type: '0',
		gc_email: '',
		gc_delivery_time: '',
		gc_resend_num: 0,
		gc_second: 0,
		show_type: '',
		earnest_info: null,
		comment_info: null,
		refund_info: {
			need_bank_info: '0',
			refund_bank_info: null,
		},
		remaining_time: 0,
		laku6_exchange_info: {
			status: 0,
			model_id: 0,
			model: '',
			brand: '',
			storage: '',
			ram: '',
			grade: '',
			review_details: null,
			time_stamp: 0,
			unique_code: '',
			imei: '',
			price: 0,
		},
		comment_status: '-3',
		payment_approval_status: '',
		payment_approval_refused_reason: '',
		vatContent: '',
		order_from: '51',
		tax_rate_text: '',
		trade_in_weu_rebate: false,
		orderExtends: null,
	},
])

orderList.value[1] = cloneDeep(orderList.value[0])
orderList.value[1].order_status_info.info = 'paying'
orderList.value[2] = cloneDeep(orderList.value[0])
orderList.value[2].order_status_info.info = 'paid'
orderList.value[3] = cloneDeep(orderList.value[0])
orderList.value[3].order_status_info.info = 'ship'

const pagination = reactive({
	total: 2,
	page: 1,
	size: 10,
})
</script>

<template>
	<div class="user-order-list miv4">
		<div class="user-layout__container miv4">
			<div class="mi-breadcrumbs user-layout__breadcrumbs"></div>
			<div class="user-main">
				<section>
					<div class="user-order-list-container">
						<h1 class="user-order-list-container_title">
							{{ t('My Orders') }}
						</h1>
						<ul
							class="user-order-list-container_nav order-list__nav"
						>
							<li
								v-for="t in tags"
								:key="t.type"
								class="order-list__nav__title title"
							>
								{{ t.type }}
							</li>
						</ul>
						<ul class="order-list">
							<section>
								<li
									v-for="o in orderList"
									:key="o.order_id"
									class="order-item"
									:class="[
										`order-item--${o.order_status_info.info.toLowerCase()}`,
									]"
								>
									<div class="order-item-header">
										<p
											class="order-item-header--title show-tag"
										>
											{{ o.order_status_info.info }}
										</p>
										<p class="info">
											{{ o.info }}
										</p>
									</div>
									<div class="order-item-info info">
										<ul class="info-left">
											<li class="info-left_time">
												{{ o.add_time_fm }}
											</li>
											<li class="info-left-name">
												{{ o.consignee }}
											</li>
											<li
												class="info-left-order-id order-id"
											>
												{{ t('Order number') }}:
												{{ o.order_id }}
											</li>
										</ul>
										<div class="info-right">
											<div class="info__detail">
												<span
													class="info-right-total__title"
												>{{ t('Total') }}:
												</span>
												<span
													class="info-right-total__num"
												>
													<ProductPrice
														:data="o.goods_amount"
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
												:to="`/user/orderview/${o.order_id}`"
												class="goods-list-order-btn--white order-btn"
											>
												{{ t('ORDER DETAILS') }}
											</nuxt-link>
										</div>
										<div class="goods-list-gooods-info">
											<div
												v-for="g in o.product"
												:key="g.goods_id"
												class="goods-list-gooods-info__container"
											>
												<div
													class="goods-list-gooods-info__img"
												>
													<nuxt-link
														:to="`/product/${g.goods_id}`"
														target="blank"
													>
														<img
															:src="g.image_url"
														>
													</nuxt-link>
												</div>
												<div
													class="goods-list-gooods-info__wrap"
												>
													<div
														class="goods-list-gooods-info__information information"
													>
														<div>
															{{ g.product_name }}
														</div>
														<div>
															<ProductPrice
																:data="
																	g.cart_price
																"
															/>
															{{
																`x ${g.product_count}`
															}}
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
							v-model:page-size="pagination.size"
							v-model:current-page="pagination.page"
							:total="pagination.total"
						/>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
