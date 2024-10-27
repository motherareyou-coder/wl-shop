<script setup>
import './card-payment.scss'

const route = useRoute()
const orderId = route.query.orderId

const orderinfo = ref({
	orderId: '5241014713660078',
	order_status_info: {
		apply_refund_info: '',
		apply_refund_status: '',
		delivery_info: '',
		info: 'Awaiting payment',
		next: [
			'PAY_MONEY',
			'EDIT_ORDER_ADDRESS',
			'EDIT_ORDER_TIME',
			'CANCLE_ORDER',
			'CANCEL_ORDER',
		],
		trace: [
			{
				text: 'Order placed',
				time: '1728842463',
			},
			{
				text: 'Paid',
				time: '0',
			},
			{
				text: 'Processed',
				time: '0',
			},
			{
				text: 'Shipped',
				time: '0',
			},
			{
				text: 'Delivered',
				time: '0',
			},
		],
		payment_pending_info: '',
	},
	reduce_price: '20',
	reduce_price_txt: '20',
	shipment_expense_txt: '0',
	goods_amount_txt: '1,717.99',
	ttl: '1728849663',
	product: [
		{
			goods_id: '4223704418',
			product_id: '50532',
			image_url:
				'https://i05.appmifile.com/201_item_uk/07/06/2024/1423d383ef833aceb106de915a6b6514.png',
			product_name: 'Xiaomi 14 Black 12 GB + 256 GB',
			cart_price: '849.00',
			product_count: '2',
			price_txt: '849',
			subtotal_txt: '1,698',
			extentions: {
				goods_dealer: '',
				take_back: false,
			},
			list: null,
			commodity_id: '3223704619',
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
			price: '849.00',
			uniquecode: '',
			can_buy_insurance: false,
			loyaltyMultiTimes: 0,
			mode: 0,
			finalPrice: '839',
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
			goods_id: '4223705788',
			product_id: '57765',
			image_url:
				'https://i05.appmifile.com/133_item_uk/29/09/2024/a3332c8e8dbe8aa3554d55c6eec038c0.png',
			product_name: 'Redmi Watch 5 Lite Black',
			cart_price: '39.99',
			product_count: '1',
			price_txt: '39.99',
			subtotal_txt: '39.99',
			extentions: {
				goods_dealer: '',
				take_back: false,
			},
			list: null,
			commodity_id: '3223706047',
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
			price: '39.99',
			uniquecode: '',
			can_buy_insurance: false,
			loyaltyMultiTimes: 0,
			mode: 0,
			finalPrice: '39.99',
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
	],
	consignee: 'jie chen',
	tel: '465****419',
	province: {
		id: '850398216',
		name: 'England',
	},
	city: {
		id: '857741279',
		name: 'Greater Manchester',
	},
	distinct: {
		id: '857741317',
		name: 'Manchester',
	},
	address: 'erger casdae 2654684',
	zipcode: 'M25BQ',
	best_time: '不限送货时间',
	email: 'fl****@gmail.com',
	invoice_type: '1',
	invoice_title: 'Personal invoice',
	add_time_fm: 'Sun, 13-Oct-2024 07:01:03 pm',
	deliver_info: null,
	addr_india: {
		addr: '',
		landmark: '',
		city: '',
	},
	pay_id: '1',
	add_time: '1728842463',
	order_status: '3',
	isGetSelf: false,
	remaining_time: '7163',
	show_tag: '',
	show_tips: '',
	arrival_time: '',
	sales_type: '0',
	order_item_type: [],
	order_type: '0',
	gc_email: '',
	gc_delivery_time: '',
	gc_resend_num: 0,
	gc_second: 0,
	gc_amount: '0',
	is_pdf_invoice: 0,
	is_pdf_receipt: 0,
	order_flow: '0',
	shipment_expense: '0',
	sddnddData: null,
	shipementDetail: null,
	sddnddMention: '',
	earnest_info: null,
	showType: '',
	RelatedOrderId: '0',
	goods_amount: '1717.99',
	can_change_addr: 0,
	address_id: '',
	consignee_idx: 'bcc26e7627667f86',
	is_new_company_order: 1,
	order_insure_user_info: {
		first_name: '',
		last_name: '',
		birth_date: '',
		nifid: '',
		birth_date_txt: '',
	},
	redemption_price: '',
	is_pdfcn: 0,
	is_pdf_insure_invoice: 0,
	insure_invoice: null,
	comment_info: null,
	taxDetail: {
		tcsTax: '',
		tcsDesc: '',
		hasTcsTax: false,
		taxRate: '',
		taxAmount: 0,
	},
	take_back_info: null,
	exchange_gc_amount: '0',
	refund_info: {
		need_bank_info: '0',
		refund_bank_info: null,
	},
	over_sale: {
		start_time: 0,
		end_time: 0,
		info: '',
		update_time: 0,
		start_time_txt: '',
		end_time_txt: '',
	},
	shipping_message: null,
	area: {
		id: '857742083',
		name: 'M25BQ',
	},
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
	invoice_email: '',
	invoice_modify: 0,
	expect_deliver_time: '',
	coupons: [
		{
			id: '6580638524',
			type_id: '18148',
		},
	],
	business_reduce_price: '0',
	business_reduce_price_txt: '0',
	is_mi_business: false,
	payment_approval_status: '',
	payment_approval_refused_reason: '',
	vat_price: '',
	vat_price_txt: '',
	trade_in_weu: null,
	vatContent: '',
	order_from: '51',
	tax_rate_text: '',
	invoice_carrier: '',
	trade_in_weu_rebate: false,
	show_invoice_apply_type: 0,
})

const data = ref({})
</script>

<template>
	<div class="card-wrapper">
		<main class="card-container">
			<div class="card-order-detail">
				<h2 class="order-summary">
					{{ $t('Order summary') }}
				</h2>
				<table class="order-message">
					<tbody>
						<tr class="order-message__item">
							<td class="title">
								{{ $t('Reference') }}:
							</td>
							<td class="info">
								{{ orderinfo.orderId }}
							</td>
						</tr>
						<tr class="order-message__item">
							<td class="title">
								{{ $t('Description') }}:
							</td>
							<td class="info">
								Xiaomi(uk)LTD order#5241014713660078
							</td>
						</tr>
						<tr class="order-message__item">
							<td class="title">
								{{ $t('Amount(GBP)') }}:
							</td>
							<td class="info">
								{{ orderinfo.goods_amount_txt }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="card-payment-components">
				<div class="adyen-payment-wrapper">
					<el-form
						label-position="top"
						class="adyen-checkout__card__form"
					>
						<div
							class="adyen-checkout__field adyen-checkout__field--cardNumber"
						>
							<el-form-item prop="" label="Card number">
								<el-input
									v-model="data.cardNumber"
									placeholder="1234 5678 9012 3456"
								/>
							</el-form-item>
						</div>
						<div
							class="adyen-checkout__card__exp-cvc adyen-checkout__field-wrapper"
						>
							<el-form-item
								label="Expiry date"
								class="adyen-checkout__field adyen-checkout__field--50 adyen-checkout__field--expiryDate"
							>
								<el-input placeholder="MM/YY" />
							</el-form-item>
							<el-form-item
								label="CVC / CVV"
								class="adyen-checkout__field adyen-checkout__field--50 adyen-checkout__field__cvc adyen-checkout__field--securityCode"
							>
								<el-input placeholder="3 digits" />
							</el-form-item>
						</div>
					</el-form>
					<button class="app-button">
						<span class="flex items-center justify-center">
							<img
								src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/components/lock.svg"
							>
							<span class="ml-2">
								{{ $t('Pay') }}
							</span>
						</span>
					</button>
				</div>
			</div>
		</main>
	</div>
</template>

<style lang="scss" scoped>
.mi-form {
	:deep {
		.mi-form-item__content {
			width: 100%;
			> * {
				width: 100%;
			}
		}
	}
}
</style>
