<script setup lang="tsx">
import paypalPic from '@/assets/imgs/paypal.png'
import cardsPic from '@/assets/imgs/cards.png'
import {useAppStore} from '@/stores/app'
import {pick} from 'lodash-es'
import type {CartItem, Coupon, OrderSettlement, PayOrderSubmit} from '~/types'
import CouponDialog from '../cart/components/CouponDialog.vue'
import {useCheckOut} from '../cart/utils'
import Address from './components/Address.vue'
import AddressList from './components/AddressList.vue'
import ProductInfoList from './components/ProductInfoList.vue'
import './index.scss'

useHead({
  title: `${$t('Checkout')} ${$t('appTitle')}`,
})

const router = useRouter()
const route = useRoute()
const orderId = route.query.orderId ? Number(route.query.orderId) : null
const bargainRecordId = route.query.bargainRecordId ? Number(route.query.bargainRecordId) : null
const seckillActivityId = route.query.seckillActivityId ? Number(route.query.seckillActivityId) : null
const combinationActivityId = route.query.combinationActivityId ? Number(route.query.combinationActivityId) : null
const combinationHeadId = route.query.combinationHeadId ? Number(route.query.combinationHeadId) : null
const productList = ref<CartItem[]>([])

const cantUseCoupon = !!(orderId || bargainRecordId || seckillActivityId || combinationActivityId)

const data = ref({
  deliveryType: 1,
  addressId: null,
  receiverName: '',
  receiverMobile: '',
  pointStatus: true,
  remark: '',
  payKey: '',
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
    expect_time: $t('Expected to be delivered within 5 ~ 14 working days'),
  },
])
const appStore = useAppStore()
const deviceType = computed(() => appStore.deviceType)
const couponVisible = ref(false)
const coupon = ref<Coupon | null>()
const coupons = ref<Coupon[]>([])
const unwatch = watch(coupons, () => {
  if (coupons.value.length && route.query.couponId && !coupon.value) {
    const match = coupons.value.find(c => c.id === Number(route.query.couponId))
    coupon.value = match
    match && unwatch()
  }
})

const {info, getInfo, items, additional} = useCheckOut(productList, coupon, data)
const {data: payOptions1, refresh} = await useAPI<string[]>(
    'pay/channel/get-enable-code-list',
    {params: {appId: info.value?.appId ?? 1}},
)
watch(() => info.value?.appId, () => refresh())
const Pays = [
  {
    // title: `${$t('Mock')} / ${$t('Debit Card')}`,
    title: `${$t('Mock Pay')}`,
    // image: 'https://i01.appmifile.com/webfile/globalimg/checkout/cards.png',
    image: cardsPic,
    key: 'mock',
  },
  {
    title: 'PayPal',
    image: paypalPic,
    key: 'paypal',
  },
  {
    title: 'Wallet',
    // image: 'https://i01.appmifile.com/webfile/globalimg/checkout/cards.png',
    image: cardsPic,
    key: 'wallet',
  },
]
const payOptions = computed(() => payOptions1.value?.length === 0 ? Pays : payOptions1.value?.map(k => Pays.find(p => p.key === k)))
watch(payOptions1, (v) => {
  data.value.payKey = v?.[0] || 'mock'
}, {immediate: true})

if (orderId) {
  $api('trade/order/get-detail', {
    params: {id: orderId},
  }).then((res) => {
    if (res.status !== 0)
      return router.push($path(`/user/review/${orderId}`))
    const {items = [], ...data} = res
    productList.value = items
    info.value = data
    coupons.value = data.coupons || []
    // coupon.value = res.couponId
    // 	? { id: res.couponId, discountPrice: res.couponPrice }
    // 	: null
  })
} else if (bargainRecordId) {
  const d = useLocalStorage(`bargainRecordId-${bargainRecordId}`, {})
  productList.value = [d.value]
  data.value.pointStatus = false
  additional.value = {bargainRecordId}
  watch(() => data.value.addressId, getInfo)
  watch(() => data.value.pointStatus, getInfo)
  // getInfo({ bargainRecordId })
} else if (seckillActivityId) {
  const d = useLocalStorage(`seckillActivityId-${seckillActivityId}`, {})
  productList.value = [d.value]
  data.value.pointStatus = false
  additional.value = {seckillActivityId}
  watch(() => data.value.addressId, getInfo)
  watch(() => data.value.pointStatus, getInfo)
  // getInfo({ seckillActivityId })
} else if (combinationActivityId) {
  const d = useLocalStorage(`combinationActivityId-${combinationActivityId}`, {})
  productList.value = [d.value]
  data.value.pointStatus = false
  additional.value = {combinationActivityId, combinationHeadId}
  watch(() => data.value.addressId, getInfo)
  watch(() => data.value.pointStatus, getInfo)
  // getInfo({ combinationActivityId, combinationHeadId })
} else {
  $api('trade/cart/list', {}).then((res) => {
    productList.value = res.validList.filter((d: CartItem) => d.selected)
    productList.value.forEach((d) => {
      d.price = d.price || d.sku.price
    })
    if (productList.value.length === 0)
      router.push($path(`/user/cart`))
  })
  watch(items, getInfo, {deep: true})
  watch(coupon, getInfo, {deep: true})
  watch(
      info,
      (v) => {
        if (v && v.coupons)
          coupons.value = v.coupons
      },
  )
  watch(() => data.value.pointStatus, getInfo)
  watch(() => data.value.addressId, getInfo)
  // getInfo()
}

const {loading, wrapLoading} = useLoading()
const msg = $t('Please select a address.')

function handleSubmit() {
  if (!orderId) {
    if (!data.value.addressId)
      return ElMessage.info(msg)
    const body: any = {
      items: items.value,
      ...pick(data.value, [
        'deliveryType',
        'addressId',
        'receiverName',
        'receiverMobile',
        'pointStatus',
        'remark',
      ]),
    }
    if (coupon.value)
      body.couponId = coupon.value.id
    if (bargainRecordId)
      body.bargainRecordId = bargainRecordId
    if (seckillActivityId)
      body.seckillActivityId = seckillActivityId
    if (combinationActivityId)
      body.combinationActivityId = combinationActivityId
    wrapLoading(
        $api<{ id: number, payOrderId: number }>('trade/order/create', {method: 'post', body})
            .then(res =>
                handlePay(res.id, res.payOrderId)),
    )
  } else if (info.value?.payOrderId) {
    handlePay(orderId, info.value.payOrderId)
  }
}

function handlePay(orderId: string | number, payOrderId: string | number) {
  return payOrderId && $api<PayOrderSubmit>('pay/order/submit', {
    method: 'post',
    body: {
      id: payOrderId,
      channelCode: data.value.payKey,
      channelExtras: {},
    },
  })
      .then(payDisplay)
      .finally(() => router.push($path(`/user/review/${orderId}?payOrderId=${payOrderId}`)))
}

function payDisplay({status, displayMode, displayContent}: PayOrderSubmit) {
  // 获取屏幕宽度和高度
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;

  var width = 800
  var height = 650
  // 计算新窗口的左边距和上边距，以便居中显示
  var left = (screenWidth - width) / 2;
  var top = (screenHeight - height) / 2;
  var newWindow
  if (displayMode === 'iframe') {
    newWindow = window.open(displayContent, '_blank', `width=${width},height=${height},top=${top},left=${left}`)
  } else if (displayMode === 'url') {
    newWindow = window.open(displayContent, '_blank', `width=${width},height=${height},top=${top},left=${left}`)
  }
  // 确保新窗口获得焦点（可选）
  if (newWindow) {
    newWindow.focus();
  }
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
            <el-checkbox v-model={data.value.agreed}/>
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
  <CartNav v-if="!cantUseCoupon" :value="2"/>
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
              <Address v-if="orderId" :data="info"/>
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
                    <i class="micon micon-up"></i>
                  </div>
                  <div
                      v-else
                      class="show-more"
                      role="button"
                      @click="showMore = true"
                  >
                    {{ $t('More') }}
                    <i class="micon micon-down"></i>
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
                <el-icon
                    v-if="appStore.isMobile"
                    class="checkout-head__icon"
                >
                  <ElIconArrowRight/>
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
                    v-if="
										appStore.isPC
											|| shipOpen
											|| data.deliveryType === o.type
									"
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
                              <ProductPrice
                                  :data="
                                  info?.price?.deliveryPrice
                                  || info?.deliveryPrice
                                  || $t('Free')
                                "
                                    class="price-summary__item-fee"
                                />
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
            <ProductInfoList :data="productList"/>
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
                <el-icon
                    v-if="appStore.isMobile"
                    class="checkout-head__icon"
                >
                  <ElIconArrowRight/>
                </el-icon>
              </div>
            </div>
            <div class="checkout-pay__body">
              <el-radio-group
                  v-model="data.payKey"
                  class="mi-radio__group"
                  style="display: block"
              >
                <template v-for="o in payOptions" :key="o.key">
                  <div
                      v-if="
											appStore.isPC
												|| payOpen
												|| data.payKey === o.key
										"
                      class="mi-radio__item radio-wrapper mi-radio__item--card mi-radio__item--left checkout-pay__item pay-item"
                      :class="{
											'is-checked': data.payKey === o.key,
										}"
                      @click="data.payKey = o.key"
                  >
                    <el-radio
                        :value="o.key"
                        style="margin-right: 0"
                    />
                    <div class="radio__content">
                      <article class="pay-item__right">
                        <div class="pay-item__logo">
                          <app-image :src="o.image"/>
                        </div>
                        <div class="pay-item__content">
                          <div
                              class="pay-item__title"
                          >
                            {{ o.title }}
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
            <ProductInfoList :data="productList"/>
          </section>
          <section class="price-summary">
            <div class="price-summary__total">
              <h3>{{ $t('Total') }}</h3>
              <ProductPrice
                  :data="info?.price?.payPrice || info?.payPrice"
              />
            </div>
            <ul class="price-summary__list">
              <li class="price-summary__item">
								<span class="Subtotal">
									{{ $t('Subtotal') }}
								</span>
                <ProductPrice
                    :data="info?.price?.totalPrice || info?.totalPrice"
                />
              </li>
              <li
                  v-if="info?.promotions"
                  class="price-summary__item price-summary__item--saved"
                  :class="{ 'price-summary__item--open': open1 }"
              >
                <span>{{ $t('优惠') }}</span>
                <span>
									<ProductPrice
                      class="price-summary__item-fee"
                      :data="info.promotions.reduce((t, c) => t - c.discountPrice, 0)"
                  />
									<button class="price-summary__item-more">
										<el-icon
                        class="cursor-pointer price-summary__item-more-icon"
                        @click="open1 = !open1"
                    >
											<ElIconArrowDown/>
										</el-icon>
									</button>
								</span>
                <div class="price-summary__box">
                  <ul class="price-summary__detail">
                    <li
                        v-for="(d, i) in info.promotions" :key="i"
                        class="price-summary__item"
                    >
                      <span>{{ d.description }}</span>
                      <ProductPrice
                          class="price-summary__item-fee"
                          :data="0 - d.discountPrice"
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
          <section v-if="!cantUseCoupon && !orderId" class="coupons-info">
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
                />
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
                      <app-time :data="coupon.validStartTime" format="YYYY-MM-DD"/>
                      -
                      <app-time :data="coupon.validEndTime" format="YYYY-MM-DD"/>
                    </li>
                  </ul>
                  <el-icon
                      v-if="!orderId"
                      class="micon micon-close coupon-card__clear"
                      @click="clearCoupon"
                  />
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
          <section v-if="!seckillActivityId && !combinationActivityId && !orderId" class="points-info">
            <h2 class="points-info__title">
              {{ $t('Points') }}
            </h2>
            <div class="points-info__tip flex items-center">
              <app-checkbox v-model="data.pointStatus"/>
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
              v-if="appStore.isPC"
              type="info"
              class="mi-btn mi-btn--primary checkout-footer__submit--pc checkout-footer"
              :disabled="
							loading
								|| !(info?.price?.totalPrice || info?.totalPrice)
						"
              @click.prevent="handleSubmit"
          >
            {{ $t('Pay Now') }}
          </el-button>
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
              <span>{{ $t('Total') }}: </span>
              <ProductPrice
                  :data="info?.price?.payPrice || info?.payPrice"
              />
            </div>
          </div>
        </div>
        <el-button
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
