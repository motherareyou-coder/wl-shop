<script setup lang="ts">
import Big from 'big.js'
import type { BargainActivity, CombinationActivityDetail, ProductDetail, SeckillActivity, SKU } from '~/types'
import Activities from './Activities.vue'
import ActivityTips from './ActivityTips.vue'
import BargainHelpList from './BargainHelpList.vue'
import Buttons from './Buttons.vue'
import Countdown from './Countdown.vue'
import Coupon from './Coupon.vue'
import Review from './Review/index.vue'
import './PC.scss'

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
const price = computed(() => sku.value?.vipPrice || sku.value?.price || info.value.price || 0)
const totalPrice = computed(() => {
	const p = new Big(price.value)
	return count.value ? p.times(new Big(count.value)).toFixed(2) : '0.00'
})

const skuDisabled = inject('skuDisabled') as Ref<boolean>
const disabled = computed(() => !sku.value || skuDisabled.value)

const seckillActivity = inject('seckillActivity') as Ref<SeckillActivity>
const combinationActivity = inject('combinationActivity') as Ref<CombinationActivityDetail>
const bargainActivity = inject('bargainActivity') as Ref<BargainActivity>
const bargainRecord = inject('bargainRecord') as Ref<BargainActivity>
const isCurrentUser = inject('isCurrentUser') as Ref<boolean>

const isAcActivity = inject('isAcActivity') as Ref<boolean>
</script>

<template>
	<div class="xm-navbar">
		<div class="xm-navbar__container">
			<div class="xm-navbar__title">
				<h1 class="xm-text header">
					{{ info.name }}
				</h1>
			</div>
			<div class="xm-navbar__nav">
				<ul>
					<li
						class="xm-navbar__nav-item"
						:class="{
							'xm-navbar__nav-item--current': tab === 0,
						}"
						@click="tab = 0"
					>
						<a>{{ $t('Overview') }}</a>
					</li>
					<li
						class="xm-navbar__nav-item"
						:class="{
							'xm-navbar__nav-item--current': tab === 1,
						}"
						@click="tab = 1"
					>
						<a>{{ $t('Reviews') }}</a>
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
	<div class="buy-container">
		<main class="product--pc">
			<div class="product__container site-container">
				<aside class="product__aside">
					<section class="product__image-wrapper">
						<div class="product__image">
							<app-image
								class="product__image-content"
								:src="sku?.picUrl || info.picUrl"
							/>
						</div>
					</section>
				</aside>
				<article class="product__article">
					<section
						class="product__section product__section-spacer information-section"
					>
						<h2 class="information-section__product-title">
							<span>{{ info.name }}</span>
							<el-icon
								v-if="!isAcActivity"
								class="information-section__product-share"
								:class="{ active: props.star }"
								@click="emit('star')"
							>
								<ElIconStar />
							</el-icon>
						</h2>
						<div class="information-section__product-info">
							<div class="information-section__product-sku-info">
                {{ sku?.properties.map(p => p.valueName).join(', ') }}
							</div>
							<div class="information-section__product-sku-info">
								{{ info.introduction }}
							</div>
							<template v-if="seckillActivity">
								<Countdown />
								<ul class="event-description__tags">
									<li v-if="sku" class="event-description__tag">
										<span>{{ $t('节省') }}
											<product-price :data="sku.marketPrice - sku.price" />
										</span>
									</li>
								</ul>
								<div class="information-section__product-price">
									<strong>
										<!--{{ $t('秒杀价') }}-->
									</strong>
									<ProductPrice :data="sku?.seckillPrice" />
									<del>
										<!--{{ $t('市场价') }}-->
										<ProductPrice :data="sku?.marketPrice || info.marketPrice" plain />
									</del>
								</div>
							</template>
							<template v-else-if="combinationActivity">
								<Countdown />
								<div class="information-section__product-price">
									<ProductPrice v-if="skuDisabled" :data="sku?.price" />
									<template v-else>
										<strong>
											<!--{{ $t('拼团价') }}-->
										</strong>
										<ProductPrice :data="sku?.combinationPrice" />
									</template>
									<del>
										<!--{{ $t('市场价') }}-->
										<ProductPrice :data="sku?.marketPrice || info.marketPrice" plain />
									</del>
								</div>
							</template>
							<template v-else-if="bargainActivity">
								<Countdown />
								<div class="information-section__product-price">
									<ProductPrice v-if="skuDisabled" :data="sku?.marketPrice" />
									<template v-else>
										<strong>
											<!--{{ $t('当前价格') }}-->
										</strong>
										<!--<ProductPrice :data="bargainActivity.bargainFirstPrice" />-->
										<ProductPrice :data="bargainRecord?.bargainPrice || bargainActivity.bargainFirstPrice" />
									</template>
									<del>
										<!--{{ $t('最低价格') }}-->
										<ProductPrice :data="bargainActivity.bargainMinPrice" plain />
									</del>
								</div>
							</template>
							<div v-else class="information-section__product-price">
								<ProductPrice :data="price" />
								<del>
									<ProductPrice :data="sku?.marketPrice || info.marketPrice" plain />
								</del>
							</div>
						</div>
					</section>
					<ActivityTips v-if="isAcActivity" @click="emit('combination', $event)" />
					<template v-else>
						<Activities />
						<section
							class="product__section product__section-spacer events-info"
						>
							<Coupon />
						</section>
					</template>
					<section
						v-if="!bargainActivity"
						class="product__section product__section--desktop sku-section-v4 sku-section-v4--desktop"
					>
						<template v-for="p in props.properties" :key="p.id">
							<h3
								class="sku-section-v4__title product__section-title"
							>
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
										{{ v.name }}
									</button>
								</li>
							</ul>
						</template>
					</section>
					<section
						v-if="!bargainActivity"
						class="product__section quantity-section"
					>
						<h3 class="product__section-title">
							{{ $t('Quantity') }}
						</h3>
						<div class="quantity-section__container">
							<div class="quantity-section-v4__content">
								<el-input-number
									v-model="count"
									:step="1"
									:min="1"
									:max="seckillActivity?.singleLimitCount ?? combinationActivity?.singleLimitCount ?? sku?.stock"
								/>
							</div>
						</div>
					</section>
					<section
						v-if="!bargainActivity"
						class="product__section order-list-section"
					>
						<ul class="order-list-section__list">
							<li class="order-list-section__item">
								<span> {{ info.name }} * {{ count }} </span>
								<div class="order-list-section__item-spacer"></div>
								<ProductPrice :data="price" />
								<del>
									<ProductPrice :data="sku?.marketPrice || info.marketPrice" plain />
								</del>
							</li>
							<li class="order-list-section__item">
								<span>{{ $t('Total') }}:</span>
								<div class="order-list-section__item-spacer"></div>
								<ProductPrice :data="totalPrice" />
							</li>
						</ul>
					</section>
					<section class="product__section add-cart-section">
						<div class="add-cart-section__wrap">
							<Buttons class="add-cart-section__submit-group" @command="emit" />
						</div>
					</section>
				</article>
			</div>
		</main>
		<keep-alive>
			<div v-if="tab === 0" class="site-container" style="margin: 0 auto">
				<div v-html="info.description"></div>
			</div>
			<Review v-else-if="tab === 1" />
			<BargainHelpList v-else-if="tab === 2" />
		</keep-alive>
	</div>
</template>
