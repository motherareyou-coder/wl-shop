<script setup lang="ts">
import type { ProductDetail, SKU } from '~/types'
import Activities from './Activities.vue'
import Coupon from './Coupon.vue'
import Review from './Review/index.vue'
import './Mobile.scss'

const props = defineProps({
	info: { type: Object as () => ProductDetail, required: true },
	star: { type: Boolean },
	sku: { type: Object },
	properties: { type: Array as () => ProductDetail['propertyList'] },
})
const emit = defineEmits(['star', 'submit', 'buy', 'combination'])
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

const pickData = inject('pickData')
const combinationActivityId = inject('combinationActivityId')
const skuDisabled = inject('skuDisabled')
const disabled = computed(() => !sku.value || skuDisabled.value)
</script>

<template>
	<div class="xm-navbar__box xm-navbar--fixed">
		<div class="xm-navbar__title-box flex px-5 justify-between bg-white">
			<div class="xm-navbar__title">
				<span class="xm-text header">{{ info.name }} </span>
			</div>
			<div class="xm-navbar-buynow">
				<el-button
					type="info"
					:disabled="!sku?.stock"
					@click.prevent="emit('submit')"
				>
					{{ (pickData || combinationActivityId) ? $t('原价购买') : $t('立即购买') }}
				</el-button>
				<el-button
					v-if="pickData" type="primary"
					:disabled="disabled"
					@click.prevent="emit('buy')"
				>
					{{ $t('立即购买') }}
				</el-button>
				<el-button
					v-if="combinationActivityId"
					type="primary"
					:disabled="disabled"
					@click.prevent="emit('combination')"
				>
					{{ $t('立即开团') }}
				</el-button>
			</div>
		</div>
	</div>
	<main class="product--mobile">
		<section class="product--mobile__section gallery-slider">
			<app-image
				class="gallery-slider__image"
				:src="sku?.picUrl || info.picUrl"
			/>
		</section>
		<section class="product--mobile__section product-information">
			<div v-if="pickData" class="product-information__events-header">
				<div class="bar-items bar-items--yellow bar-items--daily-pick">
					<h2 class="bar-items__title">
						{{ $t('DAILY PICKS') }}
					</h2>
					<div class="bar-items__countdown">
						<span class="bar-items__desc">{{ $t('Ends in') }}</span>
						<app-count-down class="bar-items__num" :end-time="pickData.endTime" />
					</div>
				</div>
			</div>
			<div class="product-information__wrapper">
				<div class="product-information__top">
					<div class="product-information__price">
						<ProductPrice :data="sku?.price || info.price" />
					</div>
					<el-icon
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
					{{ sku?.properties.map(p => p.valueName).join(', ') }}
				</div>
				<div class="product-information__events-info">
					<section class="event-description">
						<ul class="event-description__tags">
							<li v-if="pickData" class="event-description__tag">
								<span>{{ $t('Save up to') }}
									<ProductPrice :data="pickData.marketPrice - pickData.seckillPrice" />
								</span>
							</li>
						</ul>
					</section>
				</div>
			</div>
		</section>
		<section
			class="product--mobile__section product--mobile__section--card events-info"
		>
			<Activities collapse @click="showActivities = true" />
			<Coupon />
		</section>
		<section
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
								>
									<span>{{ v.name }}</span>
								</button>
							</li>
						</ul>
					</template>
				</section>
				<section class="quantity-section">
					<h3 class="product--mobile__title">
						{{ $t('Quantity') }}
					</h3>
					<div class="quantity-section__container">
						<div class="quantity-section-v4__content">
							<el-input-number
								v-model="count"
								:min="1"
								:max="sku?.stock"
							/>
						</div>
					</div>
				</section>
			</section>
		</section>
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
							<a>{{ $t('Overview') }} </a>
						</li>
						<li
							class="xm-navbar__nav-item"
							:class="{
								'xm-navbar__nav-item--current': tab === 1,
							}"
							@click="tab = 1"
						>
							<a>{{ $t('Reviews') }} </a>
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
					<app-image
						v-for="img in info.sliderPicUrls"
						:key="img"
						:src="img"
						style="width: 100%"
					/>
				</div>
				<Review v-else-if="tab === 1" />
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
