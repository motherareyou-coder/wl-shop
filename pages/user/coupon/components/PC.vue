<script setup lang="ts">
import type { Coupon } from '~/types'

const route = useRoute()
const status = ref(1)
watchEffect(() => {
	const type = Number(route.query.type)
	status.value = Number.isNaN(type) ? 1 : type
})

// 状态筛选 tab，复用 orderlist 的 .order-list__nav .title 样式
const tags = [
	{ label: 'unused', value: 1 },
	{ label: 'used', value: 2 },
	{ label: 'expired', value: 3 },
] as const

const { data, load, reset, loading, total } = useInfiteLoad<Coupon>(params =>
	$api('promotion/coupon/page', {
		params: { ...params, status: status.value },
	}),
)
watch(status, reset)

// 初始加载
load({ pageNo: 1, pageSize: 10 })

function statusText(s: number) {
	return { 1: 'unused', 2: 'used', 3: 'expired' }[s] || 'unused'
}
</script>

<template>
	<div class="user-order-list miv4 mb-10">
		<div class="user-layout__container miv4">
			<div class="user-main">
				<section>
					<div class="user-order-list-container">
						<h1 class="user-order-list-container_title">
							{{ $t('Coupons') }}
						</h1>

						<!-- 顶部一级导航（与 orderlist 的 .tag-nav 一致） -->
						<div class="user-order-list miv4">
							<div class="tag-nav">
								<li class="active">
									{{ $t('Coupons') }}
								</li>
							</div>
						</div>

						<!-- 状态筛选 tab（复用 orderlist 的 .order-list__nav .title 样式） -->
						<ul class="order-list__nav">
							<li
								v-for="tag in tags"
								:key="tag.value"
								class="title"
								@click="status = tag.value"
							>
								<span :class="{ 'title-active': status === tag.value }">
									{{ $t(tag.label) }}
								</span>
							</li>
						</ul>

						<ul v-infinite-scroll="load">
							<el-empty
								v-if="!loading && total === 0"
								:description="$t('No data')"
							/>
							<section
								v-for="coupon in data"
								v-else
								:key="coupon.id"
							>
								<li
									class="order-item coupon-card"
									:class="{ 'coupon-card--disabled': coupon.status !== 1 }"
								>
									<!-- 左侧金额/折扣 -->
									<div class="coupon-card__amount">
										<p v-if="coupon.discountType === 1" class="coupon-card__value">
											<ProductPrice :data="coupon.discountPrice" />
										</p>
										<p v-if="coupon.discountType === 2" class="coupon-card__value">
											{{ coupon.discountPercent / 10 }}
											<small>{{ $t('Discount') }}</small>
										</p>
										<p class="coupon-card__threshold">
											{{ $t('Full') }}
											<ProductPrice :data="coupon.usePrice" unit="" />
											{{ $t('Available') }}
										</p>
									</div>
									<!-- 右侧信息 + 按钮 -->
									<div class="coupon-card__info">
										<div class="order-item-header">
											<p class="order-item-header--title show-tag">
												{{ coupon.name }}
											</p>
											<p class="info">
												{{ $t('Expiry') }}：
												<app-time :data="coupon.validStartTime" format="YYYY-MM-DD" />
												~
												<app-time :data="coupon.validEndTime" format="YYYY-MM-DD" />
											</p>
										</div>
										<div class="order-item-goodslist goods-list">
											<div class="goods-list-order-btn">
												<nuxt-link
													v-if="coupon.status === 1"
													:to="
														$path(
															`/product-list?productScope=${coupon.productScope}&productScopeValues=${coupon.productScopeValues}`,
														)
													"
													class="goods-list-order-btn--orange order-btn"
												>
													{{ $t('Use now') }}
												</nuxt-link>
												<button
													v-else
													type="button"
													disabled
													class="goods-list-order-btn--disabled order-btn"
												>
													{{ $t(statusText(coupon.status)) }}
												</button>
											</div>
										</div>
									</div>
								</li>
							</section>
						</ul>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import url('./PC.scss');
</style>
