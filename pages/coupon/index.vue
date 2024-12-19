<script setup lang="ts">
import type {CouponTemplate} from '~/types'
import '~/pages/user/coupon/index.scss'

useHead({
  title: `${$t('Coupon')} ${$t('appTitle')}`,
})

const appStore = useAppStore()
const route = useRoute()
const userStore = useUserStore()

function getData<CouponTemplate>(params: any) {
  return $api<CouponTemplate>('promotion/coupon-template/page', {
    params,
  })
}

const key = ref(1)
const { t } = useI18n()
const msg = $t('Please sign in first')
function getCoupon(c: CouponTemplate) {
  //需要先登陆
  if (!userStore.nickname) {
    ElMessage.info(msg)
    router.push(`${$path(`/login`)}?redirect=${encodeURIComponent(route.fullPath)}`)
  }
  // 以领取,去使用
  if (!c.canTake) {
    useNowCoupon(c);
  } else {
    //领取优惠卷
    $api('promotion/coupon/take', {
      method: 'post',
      body: {templateId: c.id},
    }).then(() => {
      key.value++
      //领取后给出提示,领取成功
      ElMessage.info(t('Get Coupons Success'))
    });
  }
}
const router = useRouter()
//去使用优惠卷
function useNowCoupon(c: CouponTemplate) {
  //全场通用,跳转分类页,不带条件 c.productScope === 1
  if (c.productScope === 1) {
    router.push($path("/product-list"));
  }else if (c.productScope === 2) {
    //指定商品可用,跳转分类,带上商品条件 c.productScope === 2
    router.push($path("/product-list?productScope="+c.productScope+"&productScopeValues="+c.productScopeValues));
  }else if (c.productScope === 3) {
    //指定分类可用,跳转分类,带上分类条件 c.productScope === 3
    router.push($path("/product-list?categoryId="+c.productScopeValues));
  }
}

</script>

<template>
  <section class="site-grid site-grid--none site-grid--full">
    <div
        class="site-banner site-banner--dark site-banner--right site-banner--full site-banner--links site-banner--links--undefined site-banner--links--style-1"
    >
      <img v-if="appStore.isPC" class="site-banner__image" src="@/assets/imgs/daily-picks-banner.webp">
      <img
          v-else-if="appStore.isMobile" class="site-banner__image"
          src="@/assets/imgs/daily-picks-banner--mobile.webp"
      >
    </div>
  </section>
  <div class="site-container-1400 w-full mx-auto user-coupon__list--content" style="background:transparent">
    <app-list :key="key" :method="getData" row-key="id" class="user-coupon__list">
      <template #default="{ row: coupon }: { row: CouponTemplate }">
        <li
            :key="coupon.id"
            class="user-coupon__item--wrapper"
        >
          <div class="user-coupon__item in">
            <p class="user-coupon__item--name">
              {{ coupon.name }} | {{ coupon.description }}
            </p>
            <p class="user-coupon__item--value" v-if="coupon.discountType === 1">
              <!--则扣价格-->
              <ProductPrice :data="coupon.discountPrice"/>
              <span class="user-coupon__item--value-span">{{ $t('Full') }}
                <ProductPrice :data="coupon.usePrice" unit=""/>{{ $t('Available') }}</span>
            </p>
            <p class="user-coupon__item--value" v-if="coupon.discountType === 2">
              <!--折扣价格-->
              <!--<ProductPrice :data="" />-->
              {{ coupon.discountPercent / 10.0 }} {{ $t('Discount') }}
              <span class="user-coupon__item--value-span">{{ $t('Full') }}
              <ProductPrice :data="coupon.usePrice" unit=""/>{{ $t('Available') }}</span>
            </p>
            <p class="user-coupon__item--time" v-if="coupon.validityType === 1">
              <!--格式化时间为年月日-->
              {{ $t('Expiry') }}：
              <app-time :data="coupon.validStartTime" format="YYYY-MM-DD"/>
              ~
              <app-time :data="coupon.validEndTime" format="YYYY-MM-DD"/>
            </p>
            <p class="user-coupon__item--time" v-if="coupon.validityType === 2">
              <!--有效期：领取后x天内可用-->
              {{ $t('Expiry') }}：{{ $t('Available within') }} {{ coupon.fixedEndTerm }} {{ $t('days of collection') }}
            </p>
            <!--<p class="user-coupon__item&#45;&#45;desc">-->
            <!--  <span>{{ $t('Apply for') }} {{ coupon.productScope }}</span>-->
            <!--</p>-->
          </div>
          <div class="user-coupon__item--btn">
            <button
                class="mi-btn mi-btn--primary mi-btn--normal mi-btn--light user-coupon__btn"
                @click="getCoupon(coupon)"
            >
							<span class="mi-btn__text">
								<!--领取和去使用-->
                {{ coupon.canTake ? $t('Get Now') : $t('Use now') }}
							</span>
            </button>
          </div>
        </li>
      </template>
    </app-list>
  </div>
</template>
