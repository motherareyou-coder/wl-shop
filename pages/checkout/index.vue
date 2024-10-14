<script setup>
import AddressList from './components/AddressList.vue'
import './index.scss'
import { useAppStore } from '@/stores/app'
import Coupon from '../cart/components/Coupon.vue'

definePageMeta({ layout: 'cart' })

const { t } = useI18n()
const data = ref({})

const shipOptions = ref([
	{
		name: 'Standard delivery',
		type: 'normal',
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
	{
		name: 'Standard delivery1',
		type: 'normal1',
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
])
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
	{
		title: 'PayPal Credit',
		subtitle: '',
		enable: true,
		infotitle: '',
		info: 'Enjoy 0% up to 24 monthly instalments',
		image: 'https://i02.appmifile.com/639_updatepdf_in/10/05/2022/047f28c0f62ee7866a1a060a1dc2c695.png',
		key: 'paylater',
		subOptions: null,
		upioptions: '',
		upitype: 0,
		gateway: 'uk_paylater',
		offer: '',
		ot_module_id: 413,
		option_tag: 1,
		i18n_payment: 0,
		codstatus: '',
		emi_list: null,
	},
])

const goods = ref([
	{
		goods_id: '4223704418',
		img: 'https://i05.appmifile.com/201_item_uk/07/06/2024/1423d383ef833aceb106de915a6b6514.png',
		name: 'Xiaomi 14 Black 12 GB + 256 GB',
		can_cod: '0',
		can_delivery: '1',
		limit: '',
		limit_cod: '0',
		dealer: '',
		citys: '',
		type: 'common',
		count: null,
		is_cos: false,
		isSubHomeSku: false,
		outOfStockMsg: '',
		num: 1,
		salePrice: '849',
		salePrice_txt: '849',
		subtotal: '849',
		subtotal_txt: '849',
		itemId: '4223704418_0_buy',
		standard_estimated_delivery: '',
	},
	{
		goods_id: '4223705788',
		img: 'https://i05.appmifile.com/133_item_uk/29/09/2024/a3332c8e8dbe8aa3554d55c6eec038c0.png',
		name: 'Redmi Watch 5 Lite Black',
		can_cod: '0',
		can_delivery: '1',
		limit: '',
		limit_cod: '0',
		dealer: '',
		citys: '',
		type: 'common',
		count: null,
		is_cos: false,
		isSubHomeSku: false,
		outOfStockMsg: '',
		num: 1,
		salePrice: '39.99',
		salePrice_txt: '39.99',
		subtotal: '39.99',
		subtotal_txt: '39.99',
		itemId: '4223705788_0_buy',
		standard_estimated_delivery: '',
	},
])

const appStore = useAppStore()
onMounted(() => appStore.listen())
const deviceType = computed(() => appStore.deviceType)
const couponVisible = ref(false)
</script>

<template>
	<div class="site-checkout">
		<main class="site-checkout__container">
			<article
				class="checkout-article"
				:class="[`checkout-article--${deviceType}`]"
			>
				<div class="checkout-article__main site-checkout__card">
					<section
						class="checkout-address checkout-module"
						:class="[`checkout-module--${deviceType}`]"
					>
						<div class="checkout-head">
							<div class="checkout-head__box">
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">
										{{ t('Delivery Adress') }}
									</span>
								</div>
							</div>
						</div>
						<div class="address-content">
							<AddressList
								v-model="data.address"
								class="show-address-content"
							/>
						</div>
					</section>
					<section class="checkout-remark checkout-module">
						<div class="checkout-head">
							<div class="checkout-head__box">
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">
										{{ t('Order remark') }}
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
					<section class="checkout-delivery checkout-module">
						<div class="checkout-head">
							<div class="checkout-head__box">
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">
										{{ t('Shipping method') }}
									</span>
								</div>
							</div>
						</div>
						<el-radio-group class="checkout-delivery__content">
							<section
								v-for="o in shipOptions"
								:key="o.type"
								class="checkout-delivery-item"
							>
								<div class="mi-radio__item">
									<div
										class="radio-wrapper mi-radio__item--card mi-radio__item--left item-box"
									>
										<el-radio style="margin-right: 0" />
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
													<span>{{ t('Free') }}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>
						</el-radio-group>
					</section>
					<section
						class="checkout-pay checkout-module checkout-module--widescreen"
					>
						<div class="checkout-head">
							<div class="checkout-head__box">
								<div class="checkout-head__title-box">
									<span class="checkout-head__title">{{
										t('Payment method')
									}}</span>
								</div>
							</div>
						</div>
						<el-radio-group class="checkout-pay__body">
							<div class="mi-radio__group">
								<div
									v-for="p in payOptions"
									:key="p.type"
									class="mi-radio__item"
								>
									<div
										class="radio-wrapper mi-radio__item--card mi-radio__item--left checkout-pay__item pay-item"
									>
										<el-radio style="margin-right: 0" />
										<div class="radio__content">
											<article class="pay-item__right">
												<div class="pay-item__logo">
													<img
														:src="p.image"
														alt=""
													>
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
								</div>
							</div>
						</el-radio-group>
					</section>
				</div>
			</article>
			<aside class="order-summary">
				<div class="order-summary__main site-checkout__card">
					<h2 class="order-summary__title">
						{{ t('Order summary') }}
					</h2>
					<section
						class="checkout-product-overview checkout-product-overview--summary"
					>
						<div class="product-overview__header">
							<h2 class="product-overview__title">
								{{ goods.length }}
								{{ goods.length > 1 ? t('items') : t('item') }}
							</h2>
						</div>
						<ul class="product-info__list">
							<li
								v-for="g in goods"
								:key="g.goods_id"
								class="product-info__item"
							>
								<div class="product-info__content">
									<img
										:src="g.img"
										alt="g.name"
										class="product-img"
									>
									<div class="product-other">
										<ul class="product-params">
											<li class="product-params__name">
												{{ g.name }}
											</li>
											<li class="product-params__count">
												{{ t('Quantity') }}:{{ g.num }}
											</li>
										</ul>
										<ul class="product-price">
											<div class="mi-price">
												<ProductPrice
													:data="g.salePrice"
												/>
											</div>
										</ul>
									</div>
								</div>
							</li>
						</ul>
					</section>
					<section class="price-summary">
						<div class="price-summary__total">
							<h3>{{ t('Total') }}</h3>
							<ProductPrice :data="1717.99" />
						</div>
						<ul class="price-summary__list">
							<li class="price-summary__item">
								<span class="Subtotal">{{
									t('Subtotal')
								}}</span>
								<ProductPrice :data="1717.99" />
							</li>
							<li
								class="price-summary__item price-summary__shipment"
							>
								<span class="">{{ t('Shipping fee') }}</span>
								<ProductPrice
									data="Free"
									class="price-summary__item-fee"
								/>
							</li>
							<li class="price-summary__item"></li>
						</ul>
					</section>
					<section class="coupons-info">
						<div class="coupons-info__header">
							<h2 class="coupons-info__title">
								{{ t('Coupons') }}
							</h2>
							<button
								class="el-button--text coupons-info__view"
								@click="couponVisible = true"
							>
								<u>
									{{ t('Apply coupons') }}
								</u>
								<el-icon
									class="micon micon-link-arrow coupons-info__view-icon"
								>
									<ElIconArrowRight />
								</el-icon>
							</button>
						</div>
						<span class="coupons-info__tip">1 coupons available</span>
						<div class="coupons-list">
							<div class="coupon-card coupons-list__item">
								<ul class="coupon-card__content">
									<li class="coupon-name card-item">
										￡250-￡20 | Smartphones
									</li>
									<li
										class="coupon-price card-item notranslate"
									>
										Value: ￡250-￡20
									</li>
									<li class="coupon-time card-item">
										Expiry: 10/10/2024 00:36 - 24/10/2024
										00:36
									</li>
								</ul>
								<el-icon
									class="micon micon-close coupon-card__clear"
								>
									<ElIconCircleCloseFilled />
								</el-icon>
							</div>
							<strong class="coupons-info__message">
								The best coupon has been selected.
							</strong>
							<span class="no-used-coupon">No coupon used</span>
						</div>
					</section>
					<section class="points-info">
						<h2 class="points-info__title">
							{{ t('Points') }}
						</h2>
						<div class="points-info__tip">
							<span>It does not meet the using condition</span>
							<el-icon
								class="micon micon-warning points-info__rules"
							>
								<ElIconWarning />
							</el-icon>
						</div>
					</section>
					<button
						class="app-button checkout-footer__submit--pc checkout-footer"
					>
						{{ t('Pay now') }}
					</button>
					<div class="checkout__terms">
						<div class="mi-checkbox__item">
							<div
								class="checkbox-wrapper mi-checkbox__item--default mi-checkbox__item--left mi-checkbox__item--highlight checkout-footer__agree checkout-footer--terms"
								style="display: flex"
							>
								<el-checkbox />
								<span class="checkbox__content">
									<p class="checkout-terms__item">
										By placing an order, you have read and
										agreed to Mi.com's
										<a
											target="_blank"
											href="//www.mi.com/uk/support/terms/terms-of-use"
										>Terms of Use</a>
										and
										<a
											target="_blank"
											href="//www.mi.com/uk/support/policy/privacy"
										>Privacy Policy</a>. PayPal is unregulated credit.
										T&amp;Cs &amp; late fees apply. Visit
										www.paypal.com/uk/
									</p>
									<p class="checkout-terms__item">
										I have read and agreed
										<a
											target="_blank"
											href="//www.mi.com/uk/service/warranty/?v=0#warrant"
										>Return Policy</a>.
									</p>
								</span>
							</div>
						</div>
					</div>
					<div class="checkout-footer__submit--m checkout-footer">
						<div
							class="checkout-footer__submit--total checkout-footer__price notranslate"
						>
							<div class="checkout-footer__price-total">
								<div class="mi-price">
									<span>Total: </span><strong class="notranslate"><small>£</small>1,717.99</strong>
								</div>
							</div>
						</div>
						<button class="app-button checkout-footer__submit--pay">
							Pay now
						</button>
					</div>
				</div>
				<CartService
					class="site-checkout__card site-checkout__support-service"
				/>
			</aside>
		</main>
	</div>
	<Coupon v-model="couponVisible" />
</template>
