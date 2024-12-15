<script setup lang="ts">
import type { CouponTemplate } from '~/types'
import '~/pages/user/coupon/index.scss'

useHead({
	title: `${$t('Coupon')} ${$t('appTitle')}`,
})

const appStore = useAppStore()

function getData<CouponTemplate>(params: any) {
	return $api<CouponTemplate>('promotion/coupon-template/page', {
		params,
	})
}

const key = ref(1)
function getCoupon(c: CouponTemplate) {
	$api('promotion/coupon/take', {
		method: 'post',
		params: { templateId: c.id },
	}).then(() => {
		key.value++
	})
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
						<p class="user-coupon__item--value">
							<ProductPrice :data="coupon.discountPrice" />
						</p>
						<p class="user-coupon__item--time">
							<app-time :data="coupon.validStartTime" />
							-
							<app-time :data="coupon.validEndTime" />
						</p>
						<p class="user-coupon__item--desc">
							<span>{{ $t('Apply for') }} {{ coupon.productScope }}</span>
						</p>
					</div>
					<div class="user-coupon__item--btn">
						<button
							class="mi-btn mi-btn--primary mi-btn--normal mi-btn--light user-coupon__btn"
							@click="getCoupon(coupon)"
						>
							<span class="mi-btn__text">
								{{ $t('领取') }}
							</span>
						</button>
					</div>
				</li>
			</template>
		</app-list>
	</div>
</template>
