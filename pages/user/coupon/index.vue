<script setup lang="ts">
import type { Coupon } from '~/types'
import './index.scss'

const route = useRoute()
const type = Number(route.query.type)

const status = ref(type || 0)

const tags = ref([
	{ label: $t('unused'), value: 0 },
	{ label: $t('used'), value: 1 },
	{ label: $t('expired'), value: 2 },
])

const { data, load, reset } = useInfiteLoad<Coupon>(params =>
	$api('promotion/coupon/page?apifoxApiId=221192399', {
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
						v-for="t in tags"
						:key="t.value"
						class="mi-tabs__item mi-tabs__item--separator"
						:class="{ 'mi-tabs__item--active': status === t.value }"
						@click="status = t.value"
					>
						<div class="mi-tabs__item-content">
							{{ t.label }}
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="user-coupon__list--content">
			<ul v-infinite-scroll="load" class="user-coupon__list">
				<li
					v-for="c in data"
					:key="c.id"
					class="user-coupon__item--wrapper"
				>
					<div class="user-coupon__item in">
						<p class="user-coupon__item--name">
							{{ c.name }} | {{ c.productScope }}
						</p>
						<p class="user-coupon__item--value">
							<ProductPrice :data="c.discountPrice" />
						</p>
						<p class="user-coupon__item--time">
							{{ [c.validStartTime, c.validEndTime].join('-') }}
						</p>
						<p class="user-coupon__item--desc">
							<span>{{ $t('Apply for') }} {{ c.productScope }}</span>
						</p>
					</div>
					<div class="user-coupon__item--btn">
						<nuxt-link :to="$path(`/product-list?productScope=${c.productScope}&productScopeValues=${c.productScopeValues}`)" class="mi-btn mi-btn--primary mi-btn--normal mi-btn--light user-coupon__btn">
							<span class="mi-btn__text">
								{{ $t('Use now') }}
							</span>
						</nuxt-link>
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>
