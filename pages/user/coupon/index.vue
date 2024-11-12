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
	status.value = Number.isNaN(type) ? 0 : type
})

const tags = ref([
	{ label: $t('unused'), value: 0 },
	{ label: $t('used'), value: 1 },
	{ label: $t('expired'), value: 2 },
])

const { data, load, reset, loading } = useInfiteLoad<Coupon>(params =>
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
						:class="{ 'mi-tabs__item--active': status === tag.value }"
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
			<ul v-infinite-scroll="load" class="user-coupon__list">
				<li
					v-for="coupon in data"
					:key="coupon.id"
					class="user-coupon__item--wrapper"
				>
					<div class="user-coupon__item in">
						<p class="user-coupon__item--name">
							{{ coupon.name }} | {{ coupon.productScope }}
						</p>
						<p class="user-coupon__item--value">
							<ProductPrice :data="coupon.discountPrice" />
						</p>
						<p class="user-coupon__item--time">
							{{ [coupon.validStartTime, coupon.validEndTime].join('-') }}
						</p>
						<p class="user-coupon__item--desc">
							<span>{{ $t('Apply for') }} {{ coupon.productScope }}</span>
						</p>
					</div>
					<div class="user-coupon__item--btn">
						<nuxt-link :to="$path(`/product-list?productScope=${coupon.productScope}&productScopeValues=${coupon.productScopeValues}`)" class="mi-btn mi-btn--primary mi-btn--normal mi-btn--light user-coupon__btn">
							<span class="mi-btn__text">
								{{ $t('Use now') }}
							</span>
						</nuxt-link>
					</div>
				</li>
			</ul>
			<div v-loading="loading"></div>
		</div>
	</section>
</template>
