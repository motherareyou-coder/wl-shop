<script setup lang="ts">
import type { Coupon } from '~/types'

const id = inject('id')

const { data, load, reset } = useInfiteLoad<Coupon>(params =>
	$api('promotion/coupon-template/list', {
		params: { ...params, spuId: id, count: 10, productScope: 2 },
	}),
)

const isOpen = ref(false)
const key = ref(1)
const { t } = useI18n()
const msg = $t('Please sign in first')
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 每次打开Modal时重置
watch(isOpen, v => v || reset())
function getCoupon(c: Coupon) {
	// 需要先登陆
	if (!userStore.nickname) {
		ElMessage.info(msg)
		router.push(`${$path(`/login`)}?redirect=${encodeURIComponent(route.fullPath)}`)
	}
	if (!c.canTake) {
		ElMessage.info(t('Received'))
		return
	}
	$api('promotion/coupon/take', {
		method: 'post',
		body: { templateId: c.id },
	}).then(() => {
		reset()
	})
}
</script>

<template>
	<div
		class="events-info__coupon-area"
		@click="appStore.isMobile && (isOpen = true)"
	>
		<div class="events-info__coupon-reward coupon-reward">
			<div class="get-coupon">
				<ul class="coupon-reward__list">
					<li
						v-if="appStore.isPC && data.length"
						class="coupon-reward__item get-coupon__item--label"
					>
						<span>
							<span>Coupon: {{ data[0].name }}</span>
						</span>
					</li>
					<li
						v-else
						class="get-coupon__entry coupon-reward__item"
						@click="isOpen = true"
					>
						<span>
							<span> {{ $t('Get Coupons') }}</span>
						</span>
					</li>
				</ul>
				<li
					v-if="appStore.isPC"
					class="get-coupon__entry"
					@click="isOpen = true"
				>
					<span>
						<span> {{ $t('Get Coupons') }} > </span>
					</span>
				</li>
			</div>
		</div>
		<button v-if="appStore.isMobile" class="events-info__more">
			<el-icon><el-icon-arrow-right /></el-icon>
		</button>
	</div>
	<app-modal
		v-model="isOpen"
		class="mi-modal-v4__content coupon-list-modal"
		:title="$t('Rewards')"
	>
		<div v-infinite-scroll="load" class="h-full coupon-list__wrapper">
			<div class="coupon-list__title">
				<div class="coupon-list__label">
					<span> {{ $t('Get Coupons') }}</span>
				</div>
			</div>
			<ul>
				<li
					v-for="c in data"
					:key="c.id"
					class="coupon-list__item coupon-list__item--get-coupon coupon-list--yellow"
					:class="{ disabled: !c.canTake }"
				>
					<div class="coupon-list__item--left">
						<div class="coupon-list__item--tag">
							<strong>{{ c.name }}</strong>
						</div>
						<div class="coupon-list__item--desc">
							<h6 v-if="c.discountType === 1" class="coupon-list__item--name">
								<!-- {{ c.name }} -->
								<ProductPrice :data="c.discountPrice" /> <span class="coupon-list__item--name-span">{{ $t('Full') }}
									<ProductPrice :data="c.usePrice" unit="" />{{ $t('Available') }}</span>
							</h6>
							<h6 v-if="c.discountType === 2" class="coupon-list__item--name">
								<!-- {{ c.name }} -->
								{{ c.discountPercent / 10.0 }} {{ $t('Discount') }}
								<span class="user-coupon__item--value-span">{{ $t('Full') }}
									<ProductPrice :data="c.usePrice" unit="" />{{ $t('Available') }}</span>
							</h6>
							<p v-if="c.validityType === 1" class="coupon-list__item--date">
								{{ $t('Expiry') }}：
								<app-time :data="c.validStartTime" format="YYYY-MM-DD" />
								-
								<app-time :data="c.validEndTime" format="YYYY-MM-DD" />
							</p>
							<p v-if="c.validityType === 2" class="coupon-list__item--date">
								<!-- 有效期：领取后x天内可用 -->
								{{ $t('Expiry') }}：{{ $t('Available within') }} {{ c.fixedEndTerm }} {{ $t('days of collection') }}
							</p>
							<p class="coupon-list__item--range">
								{{ c.description }}
							</p>
						</div>
					</div>
					<div class="coupon-list__item--right">
						<!-- coupon.canTake 为false时，按钮禁用 -->
						<el-button
							type="info"
							class="coupon-list__item--collect"
							:disabled="!c.canTake"
							@click="getCoupon(c)"
						>
							<!-- {{ $t('Get Now') }} -->
							<!-- 领取和已领取 -->
							{{ c.canTake ? $t('Get Now') : $t('Received') }}
						</el-button>
					</div>
				</li>
			</ul>
		</div>
	</app-modal>
</template>
