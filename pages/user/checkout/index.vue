<script setup lang="tsx">
import { pick } from 'lodash-es'
import { useCheckOut } from '../cart/utils'
import CouponDialog from '../cart/components/CouponDialog.vue'
import AddressList from './components/AddressList.vue'
import Address from './components/Address.vue'
import ProductInfoList from './components/ProductInfoList.vue'
import './index.scss'
import { useAppStore } from '@/stores/app'
import type { CartItem, Coupon, OrderSettlement } from '~/types'

const route = useRoute()
const orderId = route.query.orderId
const productList = ref<CartItem[]>([])
if (orderId) {
	$api('trade/order/get-detail?apifoxApiId=219799959', {
		params: { id: orderId },
	}).then((res) => {
		const { items = [], ...data } = res
		console.log(11, items, data)
		productList.value = items
		info.value = data
		// coupon.value = res.couponId
		// 	? { id: res.couponId, discountPrice: res.couponPrice }
		// 	: null
	})
}
else {
	$api('trade/cart/list?apifoxApiId=218994931', {}).then((res) => {
		productList.value = res.validList.filter((d: CartItem) => d.selected)
	})
}

const data = ref({
	deliveryType: 1,
	addressId: null,
	receiverName: '',
	receiverMobile: '',
	pointStatus: true,
	remark: '',
	payKey: 'cards',
	agreed: false,
})

function onSelectAddress(v) {
	data.value.addressId = v?.id
	data.value.receiverName = v?.name
	data.value.receiverMobile = v?.mobile
}

const shipOptions = ref([
	{
		name: $t('Standard delivery'),
		type: 1, // 快递发货
		expect_time: $t('Expected to be delivered within 2 ~ 5 working days'),
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
		title: `${$t('Credit')} / ${$t('Debit Card')}`,
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
		info: $t('Pay in 3 installments interest-free via Paypal'),
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

const { info, getInfo, items } = useCheckOut(productList, coupon, data)
if (!orderId) {
	watch(items, getInfo, { immediate: true, deep: true })
	watch(coupon, getInfo, { immediate: true, deep: true })
	watch(() => data.value.pointStatus, getInfo)
	watch(() => data.value.addressId, getInfo)
	getInfo()
}

const router = useRouter()
const loading = ref(false)
watch(
	() => route.fullPath,
	(v) => {
		if (route.query.orderId)
			router.push($path(`/user/card-payment?orderId=${info.value.id}`))
	},
)
const msg = $t('Please select a address.')
function handleSubmit() {
	const fn = () => {
		if (!info?.value?.payOrderId)
			return
		if (data.value.payKey === 'cards') {
			router.replace($path(`/user/checkout?orderId=${info.value.id}`))
		}
		// else {
		// 	router.push($path(`/user/review?orderId=${info.value.payOrderId}`))
		// }
	}
	if (!orderId) {
		if (!data.value.addressId)
			return ElMessage.info(msg)
		if (loading.value)
			return
		loading.value = true
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
		})
			.then((res) => {
				if (info?.value) {
					info.value.id = res.id
					info.value.payOrderId = res.payOrderId
				}
			})
			.then(fn)
			.finally(() => {
				// loading.value = false
			})
	}
	else {
		fn()
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

function clearCoupon() {
	coupon.value = null
}

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
								class="mx-2"
								target="_blank"
								href="//www.mi.com/uk/support/terms/terms-of-use"
							>
								Terms of Use
							</a>
							and
							<a
								class="mx-2"
								target="_blank"
								href="//www.mi.com/uk/support/policy/privacy"
							>
								Privacy Policy
							</a>
							. PayPal is unregulated credit. T&amp;Cs &amp; late
							fees apply. Visit www.paypal.com/uk/
						</p>
						<p class="checkout-terms__item">
							I have read and agreed
							<a
								class="mx-2"
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

const open1 = ref(false)

const payOpen = ref(true)
const shipOpen = ref(true)
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
						<div
							class="address-content"
							:class="{ 'hide-more': !!orderId || !showMore }"
						>
							<Address v-if="orderId" :data="info" />
							<template v-else>
								<AddressList
									class="show-address-content"
									:is-checkout="true"
									@select="onSelectAddress"
								/>
								<template v-if="appStore.isPC">
									<div
										v-if="showMore"
										class="show-more"
										role="button"
										@click="showMore = false"
									>
										{{ $t('Close') }}
										<el-icon class="micon micon-up">
											<ElIconArrowUp />
										</el-icon>
									</div>
									<div
										v-else
										class="show-more"
										role="button"
										@click="showMore = true"
									>
										{{ $t('More') }}
										<el-icon class="micon micon-down">
											<ElIconArrowDown />
										</el-icon>
									</div>
								</template>
							</template>
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
								:disabled="!!orderId"
							/>
						</div>
					</section>
					<section
						class="checkout-delivery checkout-module"
						:class="[`checkout-module--${deviceType}`]"
					>
						<div
							class="checkout-head"
							@click="shipOpen = !shipOpen"
						>
							<div
								class="checkout-head__box"
								:class="{
									'checkout-head__box--open': shipOpen,
								}"
							>
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">
										{{ $t('Shipping method') }}
									</span>
								</div>
								<el-icon v-if="appStore.isMobile" class="checkout-head__icon">
									<ElIconArrowRight />
								</el-icon>
							</div>
						</div>
						<el-radio-group
							v-model="data.deliveryType"
							class="checkout-delivery__content"
							style="display: block"
						>
							<template v-for="o in shipOptions" :key="o.type">
								<section
									v-if="appStore.isPC || shipOpen || data.deliveryType === o.type"
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
													data.deliveryType
													=== o.type,
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
														<div
															class="item-content"
														>
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
							</template>
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
						<div class="checkout-head" @click="payOpen = !payOpen">
							<div
								class="checkout-head__box"
								:class="{ 'checkout-head__box--open': payOpen }"
							>
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">
										{{ $t('Payment method') }}
									</span>
								</div>
								<el-icon v-if="appStore.isMobile" class="checkout-head__icon">
									<ElIconArrowRight />
								</el-icon>
							</div>
						</div>
						<div class="checkout-pay__body">
							<el-radio-group
								v-model="data.payKey"
								class="mi-radio__group"
								style="display: block"
							>
								<template v-for="p in payOptions" :key="p.key">
									<div
										v-if="appStore.isPC || payOpen || data.payKey === p.key"
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
													<div
														class="pay-item__title"
													>
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
								</template>
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
							<ProductPrice
								:data="
									info?.price?.totalPrice || info?.totalPrice
								"
							/>
						</div>
						<ul class="price-summary__list">
							<li class="price-summary__item">
								<span class="Subtotal">
									{{ $t('Subtotal') }}
								</span>
								<ProductPrice
									:data="
										info?.price?.payPrice || info?.payPrice
									"
								/>
							</li>
							<li
								class="price-summary__item price-summary__item--saved"
								:class="{ 'price-summary__item--open': open1 }"
							>
								<span>{{ $t('Discount') }}</span>
								<span>
									<ProductPrice
										:data="
											info?.price?.discountPrice
												|| info?.discountPrice
										"
									/>
									<button class="price-summary__item-more">
										<el-icon
											class="cursor-pointer price-summary__item-more-icon"
											@click="open1 = !open1"
										>
											<ElIconArrowDown />
										</el-icon>
									</button>
								</span>
								<div class="price-summary__box">
									<ul class="price-summary__detail">
										<li
											v-if="
												info?.price?.couponPrice
													|| info?.couponPrice
											"
											class="price-summary__item"
										>
											<span>{{ $t('Coupons') }}</span>
											<ProductPrice
												class="price-summary__item-fee"
												:data="
													info?.price?.couponPrice
														|| info?.couponPrice
												"
											/>
										</li>
										<li
											v-if="
												info?.price?.pointPrice
													|| info?.pointPrice
											"
											class="price-summary__item"
										>
											<span>{{ $t('Points') }}</span>
											<ProductPrice
												class="price-summary__item-fee"
												:data="
													info?.price?.pointPrice
														|| info?.pointPrice
												"
											/>
										</li>
									</ul>
								</div>
							</li>
							<li
								class="price-summary__item price-summary__shipment"
							>
								<span class="">{{ $t('Shipping fee') }}</span>
								<ProductPrice
									:data="
										info?.price?.deliveryPrice
											|| info?.deliveryPrice
											|| $t('Free')
									"
									class="price-summary__item-fee"
								/>
							</li>
							<li class="price-summary__item"></li>
						</ul>
					</section>
					<section v-if="!orderId" class="coupons-info">
						<div class="coupons-info__header">
							<h2 class="coupons-info__title">
								{{ $t('Coupons') }}
							</h2>
							<button
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
							v-if="coupons.length && !orderId"
							class="coupons-info__tip"
						>
							{{ coupons.length }}
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
										<li
											v-if="coupon.validStartTime"
											class="coupon-time card-item"
										>
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
							<span
								v-if="!orderId && !coupons.length"
								class="no-used-coupon"
							>{{ $t('No coupon used') }}</span>
						</div>
					</section>
					<section v-if="!orderId" class="points-info">
						<h2 class="points-info__title">
							{{ $t('Points') }}
						</h2>
						<div class="points-info__tip flex items-center">
							<el-checkbox v-model="data.pointStatus" />
							<span style="margin: 0 0.5rem">
								{{ $t('Points saved') }}
							</span>
							<ProductPrice
								:data="
									info?.price?.pointPrice || info?.pointPrice
								"
							/>
						</div>
					</section>
					<el-button
						v-if="appStore.isPC && data.payKey === 'cards'"
						type="info"
						class="checkout-footer__submit--pc checkout-footer"
						:disabled="
							loading
								|| !(info?.price?.totalPrice || info?.totalPrice)
						"
						@click.prevent="handleSubmit"
					>
						{{ $t('Pay Now') }}
					</el-button>
					<PayPalButton v-if="data.payKey === 'paypalnew'" />
					<!-- <CheckoutTerms v-if="appStore.isPC" /> -->
				</div>
				<CartService
					class="site-checkout__support-service"
					:class="{ 'site-checkout__card': appStore.isPC }"
				/>
			</aside>
			<!-- <CheckoutTerms v-if="appStore.isMobile" /> -->
			<div class="checkout-footer__submit--m checkout-footer">
				<div
					class="checkout-footer__submit--total checkout-footer__price notranslate"
				>
					<div class="checkout-footer__price-total">
						<div class="mi-price">
							<span>{{ $t('Total') }}: </span><ProductPrice
								:data="
									info?.price?.totalPrice || info?.totalPrice
								"
							/>
						</div>
					</div>
				</div>
				<el-button
					v-if="data.payKey === 'cards'"
					type="info"
					class="checkout-footer__submit--pay"
					:disabled="
						loading
							|| !(info?.price?.totalPrice || info?.totalPrice)
					"
					@click="handleSubmit"
				>
					{{ $t('Pay Now') }}
				</el-button>
				<PayPalButton
					v-if="data.payKey === 'paypalnew'"
					style="min-width: 150px"
				/>
			</div>
		</main>
	</div>
	<CouponDialog
		v-if="!orderId"
		v-model:visible="couponVisible"
		v-model="coupon"
		v-model:list="coupons"
	/>
</template>
