<script setup lang="ts">
import type { Coupon } from '~/types'

const route = useRoute()
const status = ref(1)
watchEffect(() => {
	const type = Number(route.query.type)
	status.value = Number.isNaN(type) ? 1 : type
})

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

load({ pageNo: 1, pageSize: 10 })

function statusText(s: number) {
	return { 1: 'unused', 2: 'used', 3: 'expired' }[s] || 'unused'
}
</script>

<template>
	<div class="order-list-wrapper--mobile">
		<!-- 顶部 sticky tab 导航，复用 orderlist 的 .order-list-header--mobile 样式 -->
		<div class="order-list-header--mobile overflow-y-auto">
			<ul class="flex my-1">
				<li
					v-for="tag in tags"
					:key="tag.value"
					class="whitespace-nowrap"
					:class="{ 'is-active': status === tag.value }"
					@click="status = tag.value"
				>
					{{ $t(tag.label) }}
				</li>
			</ul>
		</div>

		<div
			v-infinite-scroll="load"
			class="infinite-scroll infinite-scroll--mobile"
		>
			<el-empty
				v-if="!loading && total === 0"
				:description="$t('No data')"
			/>
			<ul v-else class="order-list">
				<li
					v-for="coupon in data"
					:key="coupon.id"
					class="order-item coupon-m-card"
					:class="{ 'coupon-m-card--disabled': coupon.status !== 1 }"
				>
					<!-- 左侧金额 -->
					<div class="coupon-m-card__amount">
						<p v-if="coupon.discountType === 1" class="coupon-m-card__value">
							<ProductPrice :data="coupon.discountPrice" />
						</p>
						<p v-if="coupon.discountType === 2" class="coupon-m-card__value">
							{{ coupon.discountPercent / 10 }}{{ $t('Discount') }}
						</p>
						<p class="coupon-m-card__threshold">
							{{ $t('Full') }}<ProductPrice :data="coupon.usePrice" unit="" />{{ $t('Available') }}
						</p>
					</div>
					<!-- 右侧信息 + 按钮 -->
					<div class="coupon-m-card__info">
						<div class="order-item__header">
							<div class="order-item__header__left">
								<p class="coupon-m-card__name">
									{{ coupon.name }}
								</p>
								<p class="coupon-m-card__time">
									{{ $t('Expiry') }}：
									<app-time :data="coupon.validStartTime" format="YYYY-MM-DD" />
									~
									<app-time :data="coupon.validEndTime" format="YYYY-MM-DD" />
								</p>
							</div>
						</div>
						<div class="order-item__footer">
							<div class="order-item__footer__left"></div>
							<div class="order-item__footer__right">
								<nuxt-link
									v-if="coupon.status === 1"
									:to="
										$path(
											`/product-list?productScope=${coupon.productScope}&productScopeValues=${coupon.productScopeValues}`,
										)
									"
								>
									<el-button
										class="order-item__button order-item__button--active"
										size="small"
									>
										{{ $t('Use now') }}
									</el-button>
								</nuxt-link>
								<el-button
									v-else
									class="order-item__button"
									size="small"
									disabled
								>
									{{ $t(statusText(coupon.status)) }}
								</el-button>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss">
@import url('./Mobile.scss');
.order-list-header--mobile {
	position: sticky;
	top: var(--header-height);
	background: #fff;
	z-index: 20;
	margin-top: -2px;
	li {
		margin: 10px 16px;
	}
	.is-active {
		color: var(--text-primary);
	}
}
</style>
