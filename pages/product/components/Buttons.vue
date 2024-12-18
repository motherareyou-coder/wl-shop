<script setup lang="ts">
import type { BargainActivity, CombinationActivityDetail, ProductDetail, SeckillActivity, SKU } from '~/types'

const emit0 = defineEmits(['command'])
const emit = (type: string, ...args: any[]) => emit0('command', type, ...args)

const info = inject('info') as Ref<ProductDetail>
const curSku = inject('curSku') as Ref<SKU>
const skuDisabled = inject('skuDisabled') as Ref<boolean>
const seckillActivity = inject('seckillActivity') as Ref<SeckillActivity>
const combinationActivity = inject('combinationActivity') as Ref<CombinationActivityDetail>
const bargainActivity = inject('bargainActivity') as Ref<BargainActivity>
const bargainRecord = inject('bargainRecord') as Ref<BargainActivity>
const isCurrentUser = inject('isCurrentUser') as Ref<boolean>
const hasHelp = inject('hasHelp') as Ref<boolean>

const isAcActivity = inject('isAcActivity') as Ref<boolean>

const appStore = useAppStore()
</script>

<template>
	<div>
		<el-button
			v-if="isAcActivity"
			type="info"
			class="add-cart-section__submit flex-1"
			@click.prevent="emit('normal')"
		>
			<span v-if="appStore.isPC" class="whitespace-nowrap">
				<!--{{ $t('原价购买') }} <product-price :data="info.marketPrice" plain unit="" />-->
				{{ $t('原价购买') }} <product-price :data="info.price" plain unit="" />
			</span>
			<span v-if="appStore.isMobile" class="whitespace-nowrap">
				<!--<product-price :data="info.marketPrice" plain unit="" />-->
				<product-price :data="info.price" plain unit="" />
				<br>
				{{ $t('原价购买') }}
			</span>
		</el-button>
		<el-button
			v-else
			type="info"
			class="add-cart-section__submit flex-1"
			:disabled="!curSku?.stock"
			@click.prevent="emit('submit')"
		>
			{{ $t('立即购买') }}
		</el-button>
		<el-button
			v-if="seckillActivity"
			type="primary"
			class="add-cart-section__submit flex-1"
			:disabled="skuDisabled"
			@click.prevent="emit('seckill')"
		>
			<span v-if="appStore.isPC" class="whitespace-nowrap">
				{{ $t('立即购买') }} <product-price :data="curSku?.seckillPrice" plain unit="" />
			</span>
			<span v-if="appStore.isMobile" class="whitespace-nowrap">
				<product-price :data="curSku?.seckillPrice" plain unit="" />
				<br v-if="curSku?.seckillPrice">
				{{ $t('立即购买') }}
			</span>
		</el-button>
		<el-button
			v-if="combinationActivity"
			type="primary"
			class="add-cart-section__submit flex-1"
			:disabled="skuDisabled"
			@click.prevent="emit('combination')"
		>
			<span v-if="appStore.isPC" class="whitespace-nowrap">
				{{ $t('立即开团') }} <product-price :data="curSku?.combinationPrice" plain unit="" />
			</span>
			<span v-if="appStore.isMobile" class="whitespace-nowrap">
				<product-price :data="curSku?.combinationPrice" plain unit="" />
				<br v-if="curSku?.combinationPrice">
				<span class="whitespace-nowrap">
					{{ $t('立即开团') }}
				</span>
			</span>
		</el-button>
		<template v-if="bargainActivity">
			<template v-if="bargainRecord">
				<template v-if="isCurrentUser">
					<template v-if="bargainRecord.orderId">
						<el-button
							v-if="bargainRecord.payStatus == false"
							type="primary"
							class="add-cart-section__submit flex-1"
							@click.prevent="emit('bargin-pay')"
						>
							<span class="whitespace-nowrap">
								{{ $t('立即支付') }}
							</span>
						</el-button>
						<el-button
							v-else
							type="primary"
							class="add-cart-section__submit flex-1"
							@click.prevent="emit('bargin-order')"
						>
							<span class="whitespace-nowrap">
								{{ $t('查看订单') }}
							</span>
						</el-button>
					</template>
					<el-button
						v-else-if="bargainRecord.status === 2"
						type="primary"
						class="add-cart-section__submit flex-1"
						@click.prevent="emit('bargain-buy')"
					>
						<span class="whitespace-nowrap">
							{{ $t('立即购买') }}
						</span>
					</el-button>
					<el-button
						v-else-if="bargainRecord.status === 1"
						type="primary"
						class="add-cart-section__submit flex-1"
						@click.prevent="emit('invite')"
					>
						<span class="whitespace-nowrap">
							{{ appStore.isPC ? $t('立即邀请好友砍价') : $t('邀请好友砍价') }}
						</span>
					</el-button>
				</template>
				<template v-else>
					<el-button
						v-if="hasHelp"
						type="primary"
						class="add-cart-section__submit flex-1"
						@click.prevent="emit('bargain')"
					>
						<span v-if="appStore.isPC" class="whitespace-nowrap">
							{{ `${$t('已帮砍')}, ${$t('立即参与砍价')}` }}
						</span>
						<span v-if="appStore.isMobile" class="whitespace-nowrap">
							{{ $t('已帮砍') }}
							<br>
							{{ $t('立即参与砍价') }}
						</span>
					</el-button>
					<el-button
						v-else-if="bargainRecord.status === 1"
						type="primary"
						class="add-cart-section__submit flex-1"
						@click.prevent="emit('help')"
					>
						<span class="whitespace-nowrap">
							{{ appStore.isPC ? $t('立即帮好友砍价') : $t('立即帮砍') }}
						</span>
					</el-button>
				</template>
			</template>
			<el-button
				v-else
				type="primary"
				class="add-cart-section__submit flex-1"
				:disabled="skuDisabled"
				@click.prevent="emit('bargain')"
			>
				<span class="whitespace-nowrap">
					{{ $t('立即参与砍价') }}
				</span>
			</el-button>
		</template>
	</div>
</template>

<style scoped>

</style>
