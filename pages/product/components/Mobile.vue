<script setup lang="ts">
import type { BargainActivity, CombinationActivityDetail, ProductDetail, SeckillActivity, SKU } from '~/types'
import Activities from './Activities.vue'
import ActivityTips from './ActivityTips.vue'
import BargainHelpList from './BargainHelpList.vue'
import Buttons from './Buttons.vue'
import Countdown from './Countdown.vue'
import Coupon from './Coupon.vue'
import Review from './Review/index.vue'

const props = defineProps({
	info: { type: Object as () => ProductDetail, required: true },
	star: { type: Boolean },
	sku: { type: Object },
	properties: { type: Array as () => ProductDetail['propertyList'] },
})
const emit0 = defineEmits(['command'])
const emit = (type: string, ...args: any[]) => emit0('command', type, ...args)
const count = defineModel<number>('count')
const info = computed(() => props.info)
const sku = defineModel<SKU>('sku')
const selected = defineModel('selected')
const tab = ref(0)

const navbarFixed = ref(false)

const elRef = ref<HTMLElement | null>(null)

document.body.onscroll = () => {
	if (elRef.value) {
		navbarFixed.value = elRef.value.getBoundingClientRect().y < 60
	}
}

const showActivities = ref(false)

const skuDisabled = inject('skuDisabled') as Ref<boolean>
const disabled = computed(() => !sku.value || skuDisabled.value)

const seckillActivity = inject('seckillActivity') as Ref<SeckillActivity>
const combinationActivity = inject('combinationActivity') as Ref<CombinationActivityDetail>
const bargainActivity = inject('bargainActivity') as Ref<BargainActivity>
const bargainRecord = inject('bargainRecord') as Ref<BargainActivity>
if (bargainRecord.value)
	tab.value = 2

const isAcActivity = inject('isAcActivity') as Ref<boolean>
</script>

<template>
	<div class="xm-navbar__box xm-navbar--fixed">
		<div class="xm-navbar__title-box flex px-5 justify-between bg-white">
			<div class="xm-navbar__title">
				<span class="xm-text header">{{ info.name }} </span>
			</div>
			<Buttons class="xm-navbar-buynow" aria-label="buyNow" @command="emit" />
		</div>
	</div>
	<main class="product--mobile">
		<section class="product--mobile__section gallery-slider">
			<app-image
				class="gallery-slider__image"
				:src="sku?.picUrl || info.picUrl"
				:alt="info.name"
			/>
		</section>
		<section class="product--mobile__section product-information">
			<Countdown v-if="isAcActivity" />
			<div class="product-information__wrapper">
				<div class="product-information__top">
					<div class="product-information__price">
						<ProductPrice :data="sku?.price || info.price" />
					</div>
					<el-icon
						v-if="!isAcActivity"
						class="product-information__share"
						:class="{ active: props.star }"
						@click="emit('star')"
					>
						<ElIconStar />
					</el-icon>
				</div>
				<h1 class="product-information__title">
					{{ info.name }}
				</h1>
				<div class="information-section__product-sku-info">
					{{ info.introduction }}
				</div>
				<div class="product-information__events-info">
					<section class="event-description">
						<ul class="event-description__tags">
							<li v-if="seckillActivity && sku" class="event-description__tag">
								<span>{{ $t('节省') }}
									<ProductPrice :data="sku.marketPrice - sku.price" />
								</span>
							</li>
						</ul>
					</section>
				</div>
			</div>
		</section>
		<section
			v-if="!isAcActivity"
			class="product--mobile__section product--mobile__section--card events-info"
		>
			<Activities collapse @click="showActivities = true" />
			<Coupon />
		</section>
		<section
			v-if="!bargainActivity"
			class="product--mobile__section product--mobile__section--card"
		>
			<section
				class="product--mobile__section product--mobile__section--mobile sku-section-v4 sku-section-v4--mobile"
			>
				<section
					class="product--mobile__section product--mobile__section--mobile sku-section-v4 sku-section-v4--mobile"
				>
					<template v-for="p in props.properties" :key="p.id">
						<h3 class="sku-section-v4__title product--mobile__title">
							{{ p.name }}
						</h3>
						<ul class="sku-section-v4__list">
							<li
								v-for="v in p.values"
								:key="v.id"
								class="sku-section-v4__icon-item"
								@click="selected[p.id] = v.id"
							>
								<button
									class="sku-section-v4__button"
									:class="{
										'sku-section-v4__button--sold-out': selected[p.id] === v.id && !sku?.stock,
										'sku-section-v4__button--disabled': selected[p.id] === v.id && skuDisabled,
										'sku-section-v4__button--active': selected[p.id] === v.id,
									}"
									:aria-label="v.name"
								>
									<span>{{ v.name }}</span>
								</button>
							</li>
						</ul>
					</template>
				</section>
				<section
					v-if="!bargainActivity"
					class="quantity-section"
				>
					<h3 class="product--mobile__title">
						{{ $t('Quantity') }}
					</h3>
					<div class="quantity-section__container">
						<div class="quantity-section-v4__content">
							<el-input-number
								v-model="count"
								:min="1"
								:max="seckillActivity?.singleLimitCount ?? combinationActivity?.singleLimitCount ?? sku?.stock"
							/>
						</div>
					</div>
				</section>
			</section>
		</section>
		<ActivityTips v-if="isAcActivity" @click="emit('combination', $event)" />
		<div
			class="xm-navbar xm-navbar--mobile-update"
			:class="{
				'xm-navbar-overview--fixed': navbarFixed,
			}"
		>
			<div class="xm-navbar__container">
				<div class="xm-navbar__nav">
					<ul style="justify-content: space-around">
						<li
							class="xm-navbar__nav-item"
							:class="{
								'xm-navbar__nav-item--current': tab === 0,
							}"
							@click="tab = 0"
						>
							<a href="javascript:void(0)">{{ $t('Overview') }} </a>
						</li>
						<li
							class="xm-navbar__nav-item"
							:class="{
								'xm-navbar__nav-item--current': tab === 1,
							}"
							@click="tab = 1"
						>
							<a href="javascript:void(0)">{{ $t('Reviews') }} </a>
						</li>
						<li
							v-if="bargainRecord"
							class="xm-navbar__nav-item"
							:class="{
								'xm-navbar__nav-item--current': tab === 2,
							}"
							@click="tab = 2"
						>
							<a>{{ $t('砍价列表') }}</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div ref="elRef">
			<keep-alive>
				<div
					v-if="tab === 0"
					class="site-container"
					style="margin: 0 auto"
				>
					<div v-html="info.description"></div>
				</div>
				<Review v-else-if="tab === 1" />
				<BargainHelpList v-else-if="tab === 2" />
			</keep-alive>
		</div>
		<el-drawer
			v-model="showActivities"
			:title="$t('Events')"
			direction="btt"
			style="min-height: 50vh"
		>
			<Activities />
		</el-drawer>
	</main>
</template>

<style lang="scss">
@import url('./Mobile.scss');
</style>
