<script setup lang="ts">
import CouponDialog from './components/CouponDialog.vue'
import QtyInput from './components/QtyInput.vue'
import Recommends from './components/Recommends.vue'
import { useCheckOut } from './utils'
import type { CartItem, Coupon } from '~/types'

import './index.scss'

defineOptions({ name: 'Cart' })
useHead({
	title: `${$t('cart')} ${$t('appTitle')}`,
})

const router = useRouter()
function handleSubmit() {
	router.push($path('/user/checkout'))
}
const paramsStore = useParamsStore()

const loading = ref(false)
provide('loading', loading)
function warpLoading(p) {
	if (p instanceof Promise) {
		loading.value = true
		p.finally(() => {
			loading.value = false
		})
	}
}

const validList = ref<CartItem[]>([])
const invalidList = ref<CartItem[]>([])
function getCartList() {
	warpLoading(
		$api('trade/cart/list?apifoxApiId=218994931').then((res) => {
			validList.value = res.validList as CartItem[]
			invalidList.value = res.invalidList as CartItem[]
			invalidList.value.forEach((d) => {
				d.disabled = true
				d.selected = false
			})
			updateCheckAll()
		}),
	)
}
getCartList()
watch(
	validList,
	(v) => {
		if (v)
			paramsStore.setCartCount(v.length)
	},
	{ immediate: true },
)

const finalList = computed(() => [...validList.value, ...invalidList.value])

const appStore = useAppStore()

const couponShow = ref(false)
const coupons = ref<Coupon[]>([])
const coupon = ref<Coupon>()

const productList = computed(
	() => validList.value?.filter(d => d.selected) || [],
)

const { info, getInfo, items } = useCheckOut(productList, coupon)
watch(items, getInfo, { immediate: true, deep: true })
watch(coupon, getInfo, { immediate: true, deep: true })

const open1 = ref(false)

function handleAdd(g: CartItem) {
	warpLoading(
		$api('trade/cart/add?apifoxApiId=218995477', {
			method: 'post',
			body: { id: g.id },
		}).then(getCartList),
	)
}

const delMsg = $t('Are you sure to remove this product from shopping cart?')
function delMsgBox() {
	return ElMessageBox.confirm(delMsg, {
		confirmButtonClass: 'mi-button--info',
	})
}
function handleDelete(g: CartItem) {
	delMsgBox().then(() =>
		warpLoading(
			$api('trade/cart/delete?apifoxApiId=218995484', {
				method: 'delete',
				body: { ids: [g.id] },
			}).then(() => {
				const index1 = validList.value.findIndex(d => d.id === g.id)
				if (index1 !== -1) {
					return validList.value.splice(
						validList.value.findIndex(d => d.id === g.id),
						1,
					)
				}
				const index2 = invalidList.value.findIndex(d => d.id === g.id)
				if (index2 !== -1) {
					invalidList.value.splice(
						invalidList.value.findIndex(d => d.id === g.id),
						1,
					)
				}
				updateCheckAll()
			}),
		),
	)
}

function handleDeleteAll() {
	delMsgBox().then(() =>
		warpLoading(
			$api('trade/cart/delete?apifoxApiId=218995484', {
				method: 'delete',
				body: {
					ids: finalList.value
						.filter(d => d.selected)
						.map(d => d.id),
				},
			}).then(() => {
				getCartList()
			}),
		),
	)
}

function updateCount(g: CartItem, count: number) {
	warpLoading(
		$api('trade/cart/update-count?apifoxApiId=218995472', {
			method: 'put',
			body: { id: g.id, count },
		}).then(() => {
			g.count = count
		}),
	)
}

const checkAll = ref(false)
function checkChange(g: CartItem, v: boolean) {
	warpLoading(
		$api('trade/cart/update-selected?apifoxApiId=218995467', {
			method: 'put',
			body: { ids: [g.id], selected: v },
		})
			.then(() => {
				g.selected = v
			})
			.catch(() => {
				g.selected = !v
			})
			.finally(updateCheckAll),
	)
}
function updateCheckAll() {
	checkAll.value
		= validList.value.length > 0 && validList.value.every(d => d.selected)
}
function checkAllChange(selected: any) {
	if (validList.value.length) {
		warpLoading(
			$api('trade/cart/update-selected?apifoxApiId=218995467', {
				method: 'put',
				body: {
					ids: validList.value.map(d => d.id),
					selected,
				},
			}).then(() => {
				validList.value.forEach((d) => {
					d.selected = selected
				})
			}),
		)
	}
}
</script>

<template>
	<el-form :disabled="loading">
		<main class="site-cart">
			<div class="site-cart__container">
				<article class="site-cart__detail">
					<header
						class="site-cart__card site-cart__header cart-header"
					>
						<el-checkbox
							v-model="checkAll"
							class="cart-header__checkbox"
							@change="checkAllChange"
						>
							{{ $t('All') }}
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
						v-for="g in finalList"
						:key="g.id"
						class="site-cart__card site-cart__group cart-group"
					>
						<article
							class="site-cart__item cart-group__item cart-item"
						>
							<section
								class="cart-item__grid cart-item__goods"
								:class="{
									'cart-item__goods--invalid': g.disabled,
								}"
							>
								<div class="cart-item__checkbox">
									<el-checkbox
										v-model="g.selected"
										@change="(v) => checkChange(g, v)"
									/>
								</div>
								<div class="cart-item__gap"></div>
								<div class="cart-item__image">
									<nuxt-link :to="$path(`/product/${g.id}`)">
										<app-image
											class="cart-item__image-content"
											:src="g.spu.picUrl"
										/>
									</nuxt-link>
								</div>
								<div class="cart-item__gap"></div>
								<div class="cart-item__detail">
									<div class="cart-item__product">
										<nuxt-link
											:to="$path(`/product/${g.id}`)"
										>
											<h3
												class="cart-item__product-title"
											>
												{{ g.spu.name }}
											</h3>
										</nuxt-link>
										<div
											v-if="appStore.isPC"
											class="cart-item__price"
										>
											<ProductPrice
												:data="g.sku.price"
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
												:data="g.sku.price"
												class="cart-item__price-expect"
											/>
										</div>
										<div class="quantity-section">
											<QtyInput
												v-model="g.count"
												:max="g.sku.stock"
												class="quantity-section__content"
												:disabled="g.disabled"
												@change="
													(v) => updateCount(g, v)
												"
											/>
										</div>
										<div class="action-section">
											<button
												class="mi-btn--icon"
												style="
													color: var(
														--brand-black-30
													);
												"
												@click.prevent="handleDelete(g)"
											>
												<el-icon>
													<ElIconDelete />
												</el-icon>
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
											>
												<ElIconArrowDown />
											</el-icon>
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
										<el-icon class="micon micon-link-arrow">
											<ElIconArrowRight />
										</el-icon>
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
				<Recommends
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
						<el-icon class="micon micon-link-arrow">
							<ElIconArrowRight />
						</el-icon>
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
						class="mi-btn mi-btn--primary cart-footer__submit"
						small
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
