<script setup lang="ts">
import type { Coupon } from '~/types'
import './index.scss'

definePageMeta({
	title: 'Coupons',
	showBread: true,
})
const route = useRoute()
const status = ref(0)
watchEffect(() => {
	const type = Number(route.query.type)
	status.value = Number.isNaN(type) ? 1 : type
})

const tags = ref([
	{ label: $t('unused'), value: 1 },
	{ label: $t('used'), value: 2 },
	{ label: $t('expired'), value: 3 },
])

const { data, load, reset, loading, total } = useInfiteLoad<Coupon>(params =>
	$api('promotion/coupon/page', {
		params: { ...params, status: status.value },
	}),
)
watch(status, reset)
</script>

<template>
	<section class="user-coupon">
		<div class="breadcrumbs-wrapper"></div>
		<div class="page-headings page-headings--has-children">
			<h1 class="page-headings__title">
				{{ $t('Coupons') }}
			</h1>
		</div>
		<div class="user-coupon__tabs--wrapper">
			<div class="mi-tabs">
				<ul class="mi-tabs__header">
					<li
						v-for="tag in tags"
						:key="tag.value"
						class="mi-tabs__item mi-tabs__item--separator"
						:class="{
							'mi-tabs__item--active': status === tag.value,
						}"
						@click="status = tag.value"
					>
						<div class="mi-tabs__item-content">
							{{ tag.label }}
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="user-coupon__list--content">
			<el-empty v-if="!loading && total === 0" :description="$t('No data')" />
			<ul v-else v-infinite-scroll="load" class="user-coupon__list">
				<li
					v-for="coupon in data"
					:key="coupon.id"
					class="user-coupon__item--wrapper"
					:class="{ disabled: coupon.status != 1 }"
				>
          <div class="user-coupon__item in">
            <p class="user-coupon__item--name">
              <!--{{ coupon.name }} | {{ coupon.description }}-->
              {{ coupon.name }}
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
            <p class="user-coupon__item--time">
              <!--格式化时间为年月日-->
              {{ $t('Expiry') }}：
              <app-time :data="coupon.validStartTime" format="YYYY-MM-DD"/>
              ~
              <app-time :data="coupon.validEndTime" format="YYYY-MM-DD"/>
            </p>
          </div>
					<div class="user-coupon__item--btn">
						<nuxt-link
							v-if="coupon.status === 1"
							:to="
								$path(
									`/product-list?productScope=${coupon.productScope}&productScopeValues=${coupon.productScopeValues}`,
								)
							"
							class="mi-btn mi-btn--primary mi-btn--normal mi-btn--light user-coupon__btn"
						>
							<span class="mi-btn__text">
								{{ $t('Use now') }}
							</span>
						</nuxt-link>
						<button
							v-if="coupon.status === 2"
              :aria-label="$t('used')"
							class="mi-btn mi-btn--primary mi-btn--normal mi-btn--light user-coupon__btn"
						>
							<span class="mi-btn__text">
								{{ $t('used') }}
							</span>
						</button>
						<button
							v-if="coupon.status === 3"
              :aria-label="$t('expired')"
							class="mi-btn mi-btn--primary mi-btn--normal mi-btn--light user-coupon__btn"
						>
							<span class="mi-btn__text">
								{{ $t('expired') }}
							</span>
						</button>
					</div>
				</li>
			</ul>
			<div v-loading="loading"></div>
		</div>
	</section>
</template>
