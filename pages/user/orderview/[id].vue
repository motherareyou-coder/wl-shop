<script setup>
import './index.scss'

const { t } = useI18n()

const route = useRoute()

const data = ref({
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
})
</script>

<template>
	<div class="order-view-main">
		<div class="user-layout__container miv4">
			<div class="mi-breadcrumbs user-layout__breadcrumbs"></div>
			<div class="user-main">
				<div class="order-view-main--title">
					{{ t('MY ORDER') }}
				</div>
				<div class="order-view-main--order-num-message order-message">
					<div class="order-message--order-id">
						{{ t('Order number') }} {{ data.order_id }}
					</div>
					<div class="order-message--button-groups">
						<section></section>
					</div>
				</div>
				<div class="placeholder-dom"></div>
				<section class="expressInfo">
					<h2
						class="deliver-status-title"
						:class="[`deliver-status-title--${data.order_status_info.info.toLowerCase()}`]"
					>
						{{ data.order_status_info.info }}
					</h2>
					<section class="showPayInfo">
						<div class="order-express__pay-countdown">
							<span>{{ t('Awaiting payment') }}</span>
						</div>
					</section>
					<section class="deliver-status-descp"></section>
				</section>
				<section class="package-detail">
					<ul class="package-detail__list">
						<li class="package-detail__item">
							<ul class="package-detail__product-list">
								<div
									v-for="g in data.product"
									:key="g.goods_id"
									class="product-item__wrapper"
								>
									<div
										class="product-main--item product-item"
									>
										<div class="product-item__wrap">
											<span
												class="product-item--image product-info-item"
											>
												<nuxt-link
													:to="`/product/${g.goods_id}`"
													target="blank"
												>
													<img
														:src="g.image_url"
														style="width: 100%"
													>
												</nuxt-link>
											</span>
											<div
												class="product-item--name product-info-item"
											>
												<div
													class="product-item--name__wrap"
												>
													<nuxt-link
														:to="`/product/${g.goods_id}`"
													>
														<span
															class="product-item__product-name"
														>
															{{ g.product_name }}
														</span>
													</nuxt-link>
												</div>
											</div>
											<span class="product-item--price">
												<ProductPrice
													:data="g.cart_price"
													class="price"
												/>
											</span>
										</div>
									</div>
								</div>
							</ul>
						</li>
					</ul>
				</section>
				<section class="message-info order-address">
					<h3 class="message-info__title">
						{{ t('Delivery address') }}
					</h3>
					<div class="address-info">
						<div class="message-info--name message-info__item">
							<span class="message-info__item-label">{{
								t('Name')
							}}</span>
							<span class="message-info__item-info">{{
								data.consignee
							}}</span>
						</div>
						<div class="message-info--address message-info__item">
							<span class="message-info__item-label">{{
								t('Address')
							}}</span>
							<span class="message-info__item-info">erger casdae 2654684</span>
						</div>
						<div class="message-info--address message-info__item">
							<span class="message-info__item-label">{{
								t('Phone')
							}}</span>
							<span class="message-info__item-info">465****419</span>
						</div>
					</div>
				</section>
				<section class="order-total-container">
					<ul class="order-price">
						<li>
							<span>£2,447.00</span>
							<span>Subtotal: </span>
						</li>
						<li>
							<span>Free Delivery</span>
							<span class="shipping-help">Shipping: </span>
						</li>
						<li>
							<span>-£64.90</span>
							<span>Promotion: </span>
						</li>
						<li>
							<span class="order-total-count">£2,382.10</span>
							<span class="total__label">Total: </span>
						</li>
					</ul>
				</section>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
