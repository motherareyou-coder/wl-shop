<script setup lang="ts">
import type { Coupon } from '~/types'

const id = inject('id')

const { data, load, reset } = useInfiteLoad<Coupon>(params =>
	$api('promotion/coupon-template/list', {
		params: { ...params, spuId: id, count: 100 },
	}),
)

const isOpen = ref(false)
// 每次打开Modal时重置
watch(isOpen, v => v || reset())

function getCoupon(c: Coupon) {
	$api('promotion/coupon/take', {
		method: 'post',
		params: { templateId: c.id },
	}).then(() => {
		reset()
	})
}

const appStore = useAppStore()
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
				>
					<div class="coupon-list__item--left">
						<div class="coupon-list__item--tag">
							<strong>{{ c.name }}</strong>
						</div>
						<div class="coupon-list__item--desc">
							<h6 class="coupon-list__item--name">
								{{ c.name }}
							</h6>
							<p class="coupon-list__item--date">
								<app-time :data="c.validStartTime" />
								-
								<app-time :data="c.validEndTime" />
							</p>
							<p class="coupon-list__item--range">
								{{ c.description }}
							</p>
						</div>
					</div>
					<div class="coupon-list__item--right">
						<div
							class="coupon-list__item--collect"
							@click="getCoupon(c)"
						>
							{{ $t('Get Now') }}
						</div>
					</div>
				</li>
			</ul>
		</div>
	</app-modal>
</template>
