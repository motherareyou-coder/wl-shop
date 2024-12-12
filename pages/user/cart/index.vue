<script setup lang="ts">
import type { CartItem, Coupon, ProductBrowseHistory } from '~/types'
import CouponDialog from './components/CouponDialog.vue'
import QtyInput from './components/QtyInput.vue'
import Recommends from './components/Recommends.vue'
import { useCheckOut } from './utils'

import './index.scss'

defineOptions({ name: 'Cart' })
definePageMeta({
	needLogin: false,
})
useHead({
	title: `${$t('Cart')} ${$t('appTitle')}`,
})

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const cartStore = useCartStore()
const msg = $t('Please sign in first')
function handleSubmit() {
	if (

		userStore.nickname
	) {
		router.push($path('/user/checkout'))
	}
	else {
		ElMessage.info(msg)
		router.push(`${$path(`/login`)}?redirect=${encodeURIComponent(route.fullPath)}`)
	}
}

const { loading, wrapLoading } = useLoading(false)
provide('loading', loading)

const validList = computed(() => cartStore.validList)
const invalidList = computed(() => cartStore.invalidList)
function getCartList() {
	wrapLoading(cartStore.getCartList())
}
getCartList()

const finalList = computed(() => [...validList.value, ...invalidList.value])

const couponShow = ref(false)
const coupons = ref<Coupon[]>([])
const coupon = ref<Coupon>()

const productList = computed(
	() => validList.value?.filter(d => d.selected) || [],
)

const { info, getInfo, items } = useCheckOut(productList, coupon)
watch(items, getInfo, { deep: true })
watch(coupon, getInfo, { deep: true })
watch(info,	(v) => {
	if (v?.coupons)
		coupons.value = v.coupons
})
getInfo()

const open1 = ref(false)

function handleAdd(g: ProductBrowseHistory) {
	// TODO: 浏览记录数据缺少skuId
	wrapLoading(cartStore.addCart(g, { id: g.skuId }, 1))
}

const { t } = useI18n()
function delMsgBox() {
	return ElMessageBox.confirm(
		t('Are you sure to remove this product from shopping cart?'),
		{ confirmButtonClass: 'mi-button--info' },
	)
}

function handleDelete(g: CartItem) {
	delMsgBox().then(() => wrapLoading(cartStore.removeCart([g.id])))
}

function handleDeleteAll() {
	delMsgBox().then(() => {
		const ids = finalList.value.filter(d => d.selected).map(d => d.id)
		wrapLoading(cartStore.removeCart(ids))
	},
	)
}

function updateCount(g: CartItem, count: number) {
	wrapLoading(cartStore.updateCartCount({ id: g.id, count }))
}

const checkAll = ref(false)
watchEffect(() => {
	checkAll.value
		= validList.value.length > 0 && validList.value.every(d => d.selected)
})
function checkChange(g: CartItem, selected: boolean) {
	const body = {
		ids: [g.id],
		selected,
	}
	wrapLoading(cartStore.updateSelected(body))
}
function checkAllChange(selected: boolean) {
	if (validList.value.length) {
		const body = {
			ids: validList.value.map(d => d.id),
			selected,
		}
		wrapLoading(cartStore.updateSelected(body))
	}
}
</script>

<template>
	<CartNav :value="1" />
	<el-form :disabled="loading">
		<main class="site-cart" :class="{ 'site-cart--empty': finalList.length === 0 }">
			<div class="site-cart__container">
				<section v-if="finalList.length === 0" class="site-cart__empty cart-empty">
					<i class="micon micon-warning cart-empty__warning-icon"></i>
					<h3 class="cart-empty__title">
						{{ $t('Your shopping cart is empty.') }}
					</h3>
					<span v-if="!userStore.$state.nickname" class="cart-empty__subtitle">
						{{ $t('Login to view your shopping cart and have better experience.') }}
					</span>
					<div class="cart-empty__btn-group">
						<nuxt-link :to="$path(`/product-list`)" class="mi-btn cart-empty__btn" style="background-color: #fff;color: #000;">
							{{ $t('Shop now') }}
						</nuxt-link>
						<nuxt-link v-if="!userStore.$state.nickname" :to="`${$path(`/login`)}?redirect=${encodeURIComponent(route.fullPath)}`" class="mi-btn cart-empty__btn">
							{{ $t('Login / Sign up') }}
						</nuxt-link>
					</div>
				</section>
				<template v-else>
					<article class="site-cart__detail">
						<header
							class="site-cart__card site-cart__header cart-header"
						>
							<el-checkbox
								v-model="checkAll"
								class="cart-header__checkbox"
								@change="checkAllChange"
							>
								{{ $t('CheckAll') }}
							</el-checkbox>
							<button
								class="cursor-pointer cart-header__delete"
								@click.prevent="handleDeleteAll"
							>
								{{ $t('Delete') }}
							</button>
						</header>
						<aside v-if="appStore.isMobile" class="cart-delivery">
							<div class="cart-delivery__info">
							<!-- <i class="cart-delivery__cart-icon">
								<Icon />
							</i>
							<span class="cart-delivery__title">
								{{ $t('Free shipping') }}
							</span> -->
							</div>
							<div class="cart-delivery__spacer"></div>
							<button
								class="mi-btn--link cart-delivery__delete"
								@click.prevent="handleDeleteAll"
							>
								{{ $t('Delete') }}
							</button>
						</aside>
						<section
							v-for="item in finalList"
							:key="item.id"
							class="site-cart__card site-cart__group cart-group"
						>
							<article
								class="site-cart__item cart-group__item cart-item"
							>
								<section
									class="cart-item__grid cart-item__goods"
									:class="{
										'cart-item__goods--invalid': item.disabled,
									}"
								>
									<div class="cart-item__checkbox">
										<el-checkbox
											:model-value="item.selected"
											@change="(v) => checkChange(item, v)"
										/>
									</div>
									<div class="cart-item__gap"></div>
									<div class="cart-item__image">
										<nuxt-link
											:to="$path(`/product/${item.spu.id}`)"
										>
											<app-image
												class="cart-item__image-content"
												:src="item.spu?.picUrl"
											/>
										</nuxt-link>
									</div>
									<div class="cart-item__gap"></div>
									<div class="cart-item__detail">
										<div class="cart-item__product">
											<nuxt-link
												:to="$path(`/product/${item.spu.id}`)"
											>
												<h3
													class="cart-item__product-title"
												>
													{{ item.spu?.name }}
													{{ item.sku?.properties.map(p => p.valueName).join(' ') }}
												</h3>
											</nuxt-link>
											<div
												v-if="appStore.isPC"
												class="cart-item__price"
											>
												<ProductPrice
													:data="item.sku?.price"
													class="cart-item__price-expect"
												/>
											</div>
										</div>
										<div class="cart-item__action">
											<div
												v-if="appStore.isMobile"
												class="cart-item__price"
											>
												<ProductPrice
													:data="item.sku?.price"
													class="cart-item__price-expect"
												/>
											</div>
											<div class="quantity-section">
												<QtyInput
													v-model="item.count"
													:max="item.sku?.stock"
													class="quantity-section__content"
													:disabled="item.disabled"
													@change="(v) => updateCount(item, v)"
												/>
											</div>
											<div class="action-section">
												<button
													class="mi-btn mi-btn--icon"
													style="color: var(--brand-black-30);"
													@click.prevent="handleDelete(item)"
												>
													<i class="micon micon-delete"></i>
												</button>
											</div>
										</div>
									</div>
								</section>
							</article>
						</section>
					</article>
					<article class="site-cart__summary">
						<main class="site-cart__summary-area">
							<section
								class="site-cart__card site-cart__summary cart-summary"
							>
								<div class="cart-summary__total">
									<h3>{{ $t('Total') }}</h3>
									<ProductPrice
										class="orange"
										:data="info?.price.totalPrice"
									/>
								</div>
								<ul class="cart-summary__list">
									<li class="cart-summary__item">
										<span>{{ $t('Subtotal') }}</span>
										<ProductPrice
											:data="info?.price.totalPrice"
										/>
									</li>
									<li
										v-if="info?.price.couponPrice"
										class="cart-summary__item cart-summary__item--saved"
										:class="{
											'cart-summary__item--open': open1,
										}"
									>
										<span>{{ $t('Saved') }}</span>
										<span
											class="cart-summary__item-fee cart-summary__item-fee--highlight notranslate"
										>
											-<ProductPrice
												:data="info?.price.couponPrice"
											/>
											<div
												class="inline-block cursor-pointer cart-summary__item-more"
											>
												<el-icon
													class="micon micon-down cart-summary__item-more-icon"
													@click="open1 = !open1"
												/>
											</div>
										</span>
										<div class="cart-summary__box">
											<ul class="cart-summary__detail">
												<li class="cart-summary__item">
													<span>{{ $t('Coupons') }}</span>
													<span
														class="cart-summary__item-fee notranslate"
													>
														-<ProductPrice
															:data="
																info?.price
																	.couponPrice
															"
														/>
													</span>
												</li>
											</ul>
										</div>
									</li>
									<li
										class="cart-summary__item cart-summary__item--shipping"
									>
										<span class="cart-summary__item-title">
											{{ $t('Shipping fee') }}
										</span>
										<span class="cart-summary__item-fee">
											<ProductPrice
												:data="info?.price.deliveryPrice"
											/>
										</span>
									</li>
								<!-- <li class="cart-summary__item">
									<div class="paypal-message">
										<p
											class="paypal-message__paypal-credit paypal-message--left"
										>
											Pay £99.46/mo. for 24 months at 0.0%
											interest.
											<nuxt-link
												to="#paypalCreditModal"
												target="_blank"
												class="orange"
											>
												{{ $t('Learn more') }}
											</nuxt-link>
										</p>
									</div>
								</li> -->
								</ul>
								<footer class="site-cart__footer cart-footer">
									<section class="cart-footer__coupon-area">
										<div class="cart-coupons__left">
											<el-icon class="cart-coupons__icon">
												<Icon name="icon:coupon" />
											</el-icon>
											<span class="cart-coupons__title">
												{{ $t('Coupons') }}
											</span>
											<span
												v-if="coupon"
												class="cart-coupons__tip"
											>
												({{ $t('Selected') }})
											</span>
											<span
												v-else-if="coupons.length"
												class="cart-coupons__tip"
											>
												({{ $t('Save up to') }}
												<ProductPrice
													:data="
														Math.max(
															...coupons.map(
																(d) =>
																	d.discountPrice,
															),
														)
													"
												/>)
											</span>
										</div>
										<span
											class="cursor-pointer inline-block cart-coupons__btn cart-coupons__highlight"
											@click="couponShow = true"
										>
											{{ coupons.length }}
											{{ $t('optionals') }}
											<i class="micon micon-link-arrow"></i>
										</span>
									</section>
									<section class="cart-footer__submit-area">
										<el-button
											class="mi-btn mi-btn--primary cart-footer__submit"
											:disabled="!info?.price.totalPrice"
											@click="handleSubmit"
										>
											{{ $t('Checkout') }}
										</el-button>
									</section>
								</footer>
							</section>
							<CartService
								class="site-cart__card site-cart__support-service"
							/>
						</main>
					</article>
				</template>
				<Recommends
					v-if="userStore.$state.nickname"
					class="site-cart__recommend cart-recommend"
					@add="handleAdd"
				/>
			</div>
			<footer
				v-if="appStore.isMobile"
				class="site-cart__footer cart-footer cart-footer--page"
			>
				<section class="cart-footer__coupon-area">
					<div class="cart-coupons__left">
						<i class="cart-coupons__icon">
							<Icon name="icon:coupon" />
						</i>
						<span class="cart-coupons__title">
							{{ $t('Coupons') }}
						</span>
					</div>
					<div
						class="cart-coupons__btn flex align-center"
						@click="couponShow = true"
					>
						{{ $t('View more') }}
						<i class="micon micon-link-arrow"></i>
					</div>
				</section>
				<section class="cart-footer__submit-area">
					<div class="cart-footer__total">
						<el-checkbox
							v-model="checkAll"
							class="cart-footer__checkbox"
							@change="checkAllChange"
						/>
						<div class="cart-footer__price">
							<div class="cart-footer__price-total">
								<div class="mi-price">
									<span>{{ $t('Total') }}: </span>
									<ProductPrice
										:data="info?.price.totalPrice"
									/>
								</div>
							</div>
						</div>
					</div>
					<el-button
						type="info"
						class="cart-footer__submit"
						:disabled="!info?.price.totalPrice"
						@click="handleSubmit"
					>
						{{ $t('Checkout') }}
					</el-button>
				</section>
			</footer>
		</main>
		<CouponDialog
			v-model:visible="couponShow"
			v-model="coupon"
			v-model:list="coupons"
		/>
	</el-form>
</template>
