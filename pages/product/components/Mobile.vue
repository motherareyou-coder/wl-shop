<script setup lang="ts">
import Coupon from './Coupon.vue'
import './Mobile.scss'
import Review from './Review/index.vue'
import type { Product, ProductDetail } from '~/types'

const props = defineProps({
	info: { type: Object as () => ProductDetail, required: true },
	star: { type: Boolean },
	properties: { type: Array as () => ProductDetail['propertyList'] },
})
const emit = defineEmits(['star', 'submit'])
const data = defineModel<Record<string, any>>({
	default: () => ({}),
})
const info = computed(() => props.info)

const tab = ref(0)
const recommends = ref<ProductDetail[]>([props.info])
</script>

<template>
	<div class="xm-navbar__box xm-navbar--fixed fixed">
		<div class="xm-navbar__title-box flex px-5 justify-between bg-white">
			<div class="xm-navbar__title">
				<span class="xm-text header">{{ info.name }} </span>
			</div>
			<div class="xm-navbar-buynow">
				<button class="xm-navbar-btn" @click="emit('submit')">
					{{ $t('BUY NOW') }}
				</button>
			</div>
		</div>
	</div>
	<div class="buy-container">
		<main class="product--mobile">
			<section class="product--mobile__section gallery-slider">
				<app-image class="gallery-slider__image" :src="info.picUrl" />
			</section>
			<section class="product--mobile__section product-information">
				<div class="product-information__wrapper">
					<div class="product-information__top">
						<div class="product-information__price">
							<ProductPrice :data="info.price" />
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
						{{ data.sku }}
					</div>
				</div>
			</section>
			<section
				class="product--mobile__section product--mobile__section--card events-info"
			>
				<Coupon v-model="data.coupon" />
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
							<h3
								class="sku-section-v4__title product--mobile__title"
							>
								{{ p.name }}
							</h3>
							<ul class="sku-section-v4__list">
								<li
									v-for="v in p.values"
									:key="v.id"
									class="sku-section-v4__icon-item"
								>
									<button
										class="sku-section-v4__button sku-section-v4__button--active"
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
							<div
								class="quantity-section-v4__content quantity-section-v4__content--mobile"
							>
								<el-input-number v-model="data.count" />
							</div>
						</div>
					</section>
				</section>
			</section>
			<!-- <section
				class="product--mobile__section product--mobile__section--card product-recommend"
			>
				<p class="product-recommend__title">
					{{ $t('Related Recommendation') }}
				</p>
				<ul class="product-recommend__product-img">
					<li
						v-for="r in recommends"
						:key="r.id"
						class="product-recommend__product-item"
					>
						<app-image
							class="product-recommend__product-img-wrapper"
							:src="r.picUrl"
							style="background: rgb(248, 244, 243)"
						/>
					</li>
				</ul>
				<ul class="product-recommend__product-name">
					<li v-for="r in recommends" :key="r.id">
						<span>{{ r.name }} </span>
					</li>
				</ul>
				<ul class="product-recommend__product-price">
					<li v-for="r in recommends" :key="r.id">
						<ProductPrice :data="r.price" />
					</li>
				</ul>
			</section> -->
			<div class="xm-navbar xm-navbar--mobile-update">
				<div class="xm-navbar__container">
					<div class="xm-navbar__nav">
						<ul>
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
			<div v-if="tab === 0" class="site-container" style="margin: 0 auto">
				<app-image
					v-for="img in info.sliderPicUrls"
					:key="img"
					:src="img"
					style="width: 100%"
				/>
			</div>
			<Review v-if="tab === 1" />
		</main>
	</div>
</template>
