<script setup lang="tsx">
import { omit, pick } from 'lodash-es'
import { useCheckOut } from '../cart/utils'
import CouponDialog from '../cart/components/CouponDialog.vue'
import AddressList from './components/AddressList.vue'
import ProductInfoList from './components/ProductInfoList.vue'
import './index.scss'
import { useAppStore } from '@/stores/app'
import type { CartItem, Coupon, OrderSettlement } from '~/types'

definePageMeta({ layout: 'cart' })

const route = useRoute()
const orderId = route.query.orderId
const productList = ref<CartItem[]>([])
if (orderId) {
	// $api('trade/order/get-detail?apifoxApiId=219799959', {
	// 	params: { id: orderId },
	// }).then((res) => {
	// 	console.log(res)
	// 	productList.value = res.items
	// 	info.value = omit(res, ['items'])
	// 	coupon.value = res.couponId
	// 		? { id: res.couponId, discountPrice: res.couponPrice }
	// 		: null
	// })
}
else {
	$api('trade/cart/list?apifoxApiId=218994931', {}).then((res) => {
		productList.value = res.validList // .filter((d: CartItem) => d.selected)
	})
}

const data = ref({
	deliveryType: 1,
	addressId: null,
	receiverName: '',
	receiverMobile: '',
	pointStatus: false,
	remark: '这是一个测试备注',
	payKey: 'cards',
	agreed: false,
})

const address = ref()
const addressList = ref([])
watch(addressList, (v) => {
	console.log(v)
	if (v.length && !address.value) {
		address.value = v.find?.(d => d.defaultStatus)
	}
})
watch(address, (v) => {
	data.value.addressId = v?.id
})

const shipOptions = ref([
	{
		name: 'Standard delivery',
		type: 1, // 快递发货
		expect_time: 'Expected to be delivered within 2 ~ 5 working days',
		tips: 'In case of weather or holiday-related disruptions, delivery may be delayed',
		money: '4.9',
		self_lifting_list: null,
		slot_time_list: null,
		description: '',
		is_support: 1,
		not_support_reason: null,
		token: 'eyJkZWxpdmVyX2lkIjoiMCIsImRlbGl2ZXJ5X2xpbmUiOiI1OSIsImV4cGVjdF90aW1lIjoiRXhwZWN0ZWQgdG8gYmUgZGVsaXZlcmVkIHdpdGhpbiAyIH4gNSB3b3JraW5nIGRheXMiLCJleHRlbmQiOiIiLCJwcmljZSI6IjQuOSIsInNlcnZpY2VfbmFtZSI6IlN0YW5kYXJkIGRlbGl2ZXJ5Iiwic2lnbiI6ImQyYTM1NzFjNGU2OGM2ODJkODViNjFmYmNiZjFlNjc2IiwidGltZXN0YW1wIjoiMTcyODc5MjMwOSIsInR5cGUiOiJub3JtYWwifQ',
		delivery_line: '59',
	},
	// {
	// 	name: 'Standard delivery1',
	// 	type: 2, // 门店自提
	// 	expect_time: 'Expected to be delivered within 2 ~ 5 working days',
	// 	tips: 'In case of weather or holiday-related disruptions, delivery may be delayed',
	// 	money: '4.9',
	// 	self_lifting_list: null,
	// 	slot_time_list: null,
	// 	description: '',
	// 	is_support: 1,
	// 	not_support_reason: null,
	// 	token: 'eyJkZWxpdmVyX2lkIjoiMCIsImRlbGl2ZXJ5X2xpbmUiOiI1OSIsImV4cGVjdF90aW1lIjoiRXhwZWN0ZWQgdG8gYmUgZGVsaXZlcmVkIHdpdGhpbiAyIH4gNSB3b3JraW5nIGRheXMiLCJleHRlbmQiOiIiLCJwcmljZSI6IjQuOSIsInNlcnZpY2VfbmFtZSI6IlN0YW5kYXJkIGRlbGl2ZXJ5Iiwic2lnbiI6ImQyYTM1NzFjNGU2OGM2ODJkODViNjFmYmNiZjFlNjc2IiwidGltZXN0YW1wIjoiMTcyODc5MjMwOSIsInR5cGUiOiJub3JtYWwifQ',
	// 	delivery_line: '59',
	// },
])
// const { data: payOptions } = await useAPI<string[]>(
// 	'pay/channel/get-enable-code-list?apifoxApiId=219383090',
// 	{ params: { appId: 1 } },
// )
const payOptions = ref([
	{
		title: 'Credit / Debit Card',
		subtitle: '',
		enable: true,
		infotitle: '',
		info: 'test',
		image: 'https://i01.appmifile.com/webfile/globalimg/checkout/cards.png',
		key: 'cards',
		subOptions: null,
		upioptions: '',
		upitype: 0,
		gateway: 'uk_adyen',
		offer: '',
		ot_module_id: 30,
		option_tag: 0,
		i18n_payment: 0,
		codstatus: '',
		emi_list: null,
		cards: [
			{
				name: 'VISA',
				img: '//i01.appmifile.com/webfile/globalimg/sefrconfirm/visa1.png',
			},
			{
				name: 'MAST',
				img: '//i01.appmifile.com/webfile/globalimg/sefrconfirm/mastercard.png',
			},
			{
				name: 'AMEX',
				img: '//i01.appmifile.com/webfile/globalimg/sefrconfirm/amex.png',
			},
			{
				name: 'DINER',
				img: '//i01.appmifile.com/webfile/globalimg/checkout/diner.png',
			},
			{
				name: 'DISC',
				img: '//i01.appmifile.com/webfile/globalimg/sefrconfirm/discover.png',
			},
			{
				name: 'MAES',
				img: '//i01.appmifile.com/webfile/globalimg/sefrconfirm/maestro.png',
			},
		],
	},
	{
		title: 'PayPal',
		subtitle: '',
		enable: true,
		infotitle: '',
		info: 'Pay in 3 installments interest-free via Paypal',
		image: 'https://i02.appmifile.com/639_updatepdf_in/10/05/2022/047f28c0f62ee7866a1a060a1dc2c695.png',
		key: 'paypalnew',
		subOptions: null,
		upioptions: '',
		upitype: 0,
		gateway: 'uk_paypalnew',
		offer: '',
		ot_module_id: 410,
		option_tag: 1,
		i18n_payment: 0,
		codstatus: '',
		emi_list: null,
	},
	// {
	// 	title: 'PayPal Credit',
	// 	subtitle: '',
	// 	enable: true,
	// 	infotitle: '',
	// 	info: 'Enjoy 0% up to 24 monthly instalments',
	// 	image: 'https://i02.appmifile.com/639_updatepdf_in/10/05/2022/047f28c0f62ee7866a1a060a1dc2c695.png',
	// 	key: 'paylater',
	// 	subOptions: null,
	// 	upioptions: '',
	// 	upitype: 0,
	// 	gateway: 'uk_paylater',
	// 	offer: '',
	// 	ot_module_id: 413,
	// 	option_tag: 1,
	// 	i18n_payment: 0,
	// 	codstatus: '',
	// 	emi_list: null,
	// },
])

const appStore = useAppStore()
const deviceType = computed(() => appStore.deviceType)
const couponVisible = ref(false)
const coupon = ref<Coupon>()
const coupons = ref<Coupon[]>([])

const { info, getInfo, items } = useCheckOut(productList, coupon)

const localePath = useLocalePath()
const router = useRouter()
function handleSubmit() {
	if (!orderId) {
		$api('trade/order/create?apifoxApiId=219379935', {
			method: 'post',
			body: {
				items: items.value,
				...pick(data.value, [
					'deliveryType',
					'addressId',
					'receiverName',
					'receiverMobile',
					'pointStatus',
					'remark',
				]),
			},
		}).then((res) => {
			console.log(1111, res)
			if (data.value.payKey === 'cards')
				router.push(localePath(`/card-payment?orderId=${res.payOrderId}`))
			else
				router.push(localePath(`/review?orderId=${res.payOrderId}`))
		})
	}
}

function PayPalButton() {
	return (
		<div
			class="mi-paypal-button"
			style={{
				opacity: data.value.agreed ? 1 : 0.38,
			}}
			onClick={handleSubmit}
		>
			<div class="paypal-buttons paypal-buttons-context-iframe paypal-buttons-label-unknown paypal-buttons-layout-horizontal">
				<div
					class="paypal-button paypal-button-shape-rect"
					style="background: #ffc439;"
				>
					<div
						class="paypal-button-label-container flex items-center justify-center"
						class={[appStore.isPC ? 'h-11 py-2' : 'h-6 py-1']}
					>
						<img
							src={
								new URL(
									'@/assets/imgs/paypal.svg',
									import.meta.url,
								).href
							}
							class="h-full"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

watch(coupon, getInfo)
function clearCoupon() {
	coupon.value = null
}
watch(coupons, (v) => {
	console.log(v)
})

const showMore = ref(false)

function CheckoutTerms() {
	return (
		<div class="checkout__terms">
			<div class="mi-checkbox__item">
				<div
					class="checkbox-wrapper mi-checkbox__item--default mi-checkbox__item--left mi-checkbox__item--highlight checkout-footer__agree checkout-footer--terms"
					style="display: flex"
				>
					<el-checkbox v-model={data.value.agreed} />
					<span class="checkbox__content">
						<p class="checkout-terms__item">
							By placing an order, you have read and agreed to
							Mi.com's
							<a
								target="_blank"
								href="//www.mi.com/uk/support/terms/terms-of-use"
							>
								Terms of Use
							</a>
							and
							<a
								target="_blank"
								href="//www.mi.com/uk/support/policy/privacy"
							>
								Privacy Policy
							</a>
							. PayPal is unregulated credit. T&amp;Cs &amp;
							late fees apply. Visit www.paypal.com/uk/
						</p>
						<p class="checkout-terms__item">
							I have read and agreed
							<a
								target="_blank"
								href="//www.mi.com/uk/service/warranty/?v=0#warrant"
							>
								Return Policy
							</a>
							.
						</p>
					</span>
				</div>
			</div>
		</div>
	)
}
</script>

<template>
	<div class="site-checkout">
		<main class="site-checkout__container">
			<article
				class="checkout-article"
				:class="[`checkout-article--${deviceType}`]"
			>
				<div
					class="checkout-article__main"
					:class="{ 'site-checkout__card': appStore.isPC }"
				>
					<section
						class="checkout-address checkout-module"
						:class="[`checkout-module--${deviceType}`]"
					>
						<div v-if="appStore.isPC" class="checkout-head">
							<div class="checkout-head__box">
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">
										{{ $t('Delivery address') }}
									</span>
								</div>
							</div>
						</div>
						<div class="address-content" :class="{ 'hide-more': !showMore }">
							<AddressList
								v-model="address"
								v-model:list="addressList"
								class="show-address-content"
								:addable="!orderId"
							/>
							<div v-if="showMore" class="show-more" role="button" @click="showMore = false">
								Close <i class="show-more micon micon-up"></i>
							</div>
							<div v-else class="show-more" role="button" @click="showMore = true">
								More <i class="show-more micon micon-down"></i>
							</div>
						</div>
					</section>
					<section
						class="checkout-remark checkout-module"
						:class="[`checkout-module--${deviceType}`]"
					>
						<div class="checkout-head">
							<div class="checkout-head__box">
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">
										{{ $t('Order remark') }}
									</span>
								</div>
							</div>
						</div>
						<div class="checkout-remark__content">
							<el-input
								v-model="data.remark"
								rows="5"
								type="textarea"
							/>
						</div>
					</section>
					<section
						class="checkout-delivery checkout-module"
						:class="[`checkout-module--${deviceType}`]"
					>
						<div class="checkout-head">
							<div class="checkout-head__box">
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">
										{{ $t('Shipping method') }}
									</span>
								</div>
							</div>
						</div>
						<el-radio-group
							v-model="data.deliveryType"
							class="checkout-delivery__content"
							style="display: block"
						>
							<section
								v-for="o in shipOptions"
								:key="o.type"
								class="checkout-delivery-item"
							>
								<div
									class="mi-radio__item"
									@click="data.deliveryType = o.type"
								>
									<div
										class="radio-wrapper mi-radio__item--card mi-radio__item--left item-box"
										:class="{
											'is-checked':
												data.deliveryType === o.type,
										}"
									>
										<el-radio
											:value="o.type"
											style="margin-right: 0"
										/>
										<div class="radio__content">
											<div class="item-flex">
												<div class="item-context">
													<div class="item-title">
														{{ o.name }}
													</div>
													<div class="item-content">
														<span
															class="item-date"
														>{{
															o.expect_time
														}}</span>
													</div>
												</div>
												<div class="item-price">
													<span>
														{{ $t('Free') }}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>
						</el-radio-group>
					</section>
					<section
						class="checkout-product-overview checkout-product-overview--main checkout-module"
						:class="[`checkout-module--${deviceType}`]"
					>
						<ProductInfoList :data="productList" />
					</section>
					<section
						class="checkout-pay checkout-module checkout-module--widescreen"
						:class="[`checkout-module--${deviceType}`]"
					>
						<div class="checkout-head">
							<div class="checkout-head__box">
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">
										{{ $t('Payment method') }}
									</span>
								</div>
							</div>
						</div>
						<div class="checkout-pay__body">
							<el-radio-group
								v-model="data.payKey"
								class="mi-radio__group"
								style="display: block"
							>
								<div
									v-for="p in payOptions"
									:key="p.key"
									class="mi-radio__item radio-wrapper mi-radio__item--card mi-radio__item--left checkout-pay__item pay-item"
									:class="{
										'is-checked': data.payKey === p.key,
									}"
									@click="data.payKey = p.key"
								>
									<el-radio
										:value="p.key"
										style="margin-right: 0"
									/>
									<div class="radio__content">
										<article class="pay-item__right">
											<div class="pay-item__logo">
												<app-image :src="p.image" />
											</div>
											<div class="pay-item__content">
												<div class="pay-item__title">
													{{ p.title }}
												</div>

												<div
													v-if="p.cards?.length"
													class="cards__info pay-item__tips"
												>
													<img
														v-for="c in p.cards"
														:key="c.name"
														:src="c.img"
														:alt="c.name"
													>
												</div>
												<div
													v-else
													class="pay-pal__info pay-item__tips"
												>
													<p>
														{{ p.info }}
													</p>
												</div>
											</div>
										</article>
									</div>
								</div>
							</el-radio-group>
						</div>
					</section>
				</div>
			</article>
			<aside class="order-summary">
				<div
					class="order-summary__main"
					:class="{ 'site-checkout__card': appStore.isPC }"
				>
					<h2 class="order-summary__title">
						{{ $t('Order summary') }}
					</h2>
					<section
						class="checkout-product-overview checkout-product-overview--summary"
					>
						<ProductInfoList :data="productList" />
					</section>
					<section class="price-summary">
						<div class="price-summary__total">
							<h3>{{ $t('Total') }}</h3>
							<ProductPrice :data="info?.price.totalPrice" />
						</div>
						<ul class="price-summary__list">
							<li class="price-summary__item">
								<span class="Subtotal">
									{{ $t('Subtotal') }}
								</span>
								<ProductPrice
									:data="info?.price.discountPrice"
								/>
							</li>
							<li
								class="price-summary__item price-summary__shipment"
							>
								<span class="">{{ $t('Shipping fee') }}</span>
								<ProductPrice
									:data="
										info?.price.deliveryPrice || $t('Free')
									"
									class="price-summary__item-fee"
								/>
							</li>
							<li class="price-summary__item"></li>
						</ul>
					</section>
					<section class="coupons-info">
						<div class="coupons-info__header">
							<h2 class="coupons-info__title">
								{{ $t('Coupons') }}
							</h2>
							<button
								v-if="!orderId"
								class="mi-button--text coupons-info__view"
								@click="couponVisible = true"
							>
								<u>
									{{ $t('Apply coupons') }}
								</u>
								<el-icon
									class="micon micon-link-arrow coupons-info__view-icon"
								>
									<ElIconArrowRight />
								</el-icon>
							</button>
						</div>
						<span
							v-if="coupons && !orderId"
							class="coupons-info__tip"
						>{{ coupons.length }}
							{{ $t('coupons available') }}</span>
						<div class="coupons-list">
							<template v-if="coupon">
								<div class="coupon-card coupons-list__item">
									<ul class="coupon-card__content">
										<li class="coupon-name card-item">
											{{ coupon.name }}
										</li>
										<li
											class="coupon-price card-item notranslate"
										>
											{{ $t('Value') }}:
											<ProductPrice
												:data="coupon.discountPrice"
											/>
										</li>
										<li class="coupon-time card-item">
											{{ $t('Expiry') }}:
											{{ coupon.validStartTime }} -
											{{ coupon.validEndTime }}
										</li>
									</ul>
									<el-icon
										v-if="!orderId"
										class="micon micon-close coupon-card__clear"
										@click="clearCoupon"
									>
										<ElIconCircleCloseFilled />
									</el-icon>
								</div>
								<!-- <strong class="coupons-info__message">
									The best coupon has been selected.
								</strong> -->
							</template>
							<span v-else class="no-used-coupon">No coupon used</span>
						</div>
					</section>
					<section class="points-info">
						<h2 class="points-info__title">
							{{ $t('Points') }}
						</h2>
						<div class="points-info__tip flex items-center">
							<el-checkbox v-model="data.pointStatus" />
							<span style="margin: 0 0.5rem">
								{{ $t('Points saved') }}
							</span>
							<ProductPrice :data="info?.price.pointPrice" />
						</div>
					</section>
					<button
						v-if="appStore.isPC && data.payKey === 'cards'"
						class="app-button checkout-footer__submit--pc checkout-footer"
						:disbaled="!info?.price.totalPrice"
						@click="handleSubmit"
					>
						{{ $t('Pay now') }}
					</button>
					<PayPalButton v-if="data.payKey === 'paypalnew'" />
					<CheckoutTerms v-if="appStore.isPC" />
				</div>
				<CartService
					class="site-checkout__support-service"
					:class="{ 'site-checkout__card': appStore.isPC }"
				/>
			</aside>
			<CheckoutTerms v-if="appStore.isMobile" />
			<div class="checkout-footer__submit--m checkout-footer">
				<div
					class="checkout-footer__submit--total checkout-footer__price notranslate"
				>
					<div class="checkout-footer__price-total">
						<div class="mi-price">
							<span>{{ $t('Total') }}: </span><ProductPrice :data="info?.price.totalPrice" />
						</div>
					</div>
				</div>
				<button
					v-if="data.payKey === 'cards'"
					class="app-button checkout-footer__submit--pay"
					:disbaled="!info?.price.totalPrice"
					@click="handleSubmit"
				>
					{{ $t('Pay now') }}
				</button>
				<PayPalButton
					v-if="data.payKey === 'paypalnew'"
					style="min-width: 150px"
				/>
			</div>
		</main>
	</div>
	<CouponDialog
		v-model:visible="couponVisible"
		v-model="coupon"
		v-model:list="coupons"
	/>
</template>
