<script setup lang="ts">
import type { BargainActivity, CombinationActivityDetail, SeckillActivity } from '~/types'
import CombinationRecord from './CombinationRecord.vue'

const emit = defineEmits(['click'])
const seckillActivity = inject('seckillActivity') as Ref<SeckillActivity>
const combinationActivity = inject('combinationActivity') as Ref<CombinationActivityDetail>
const bargainActivity = inject('bargainActivity') as Ref<BargainActivity>

const appStore = useAppStore()
const classList = computed(() => appStore.isPC ? 'product__section product__section-spacer offers-section' : 'product__section product__section-spacer offers-section product--mobile__section product--mobile__section--card')
</script>

<template>
	<section v-if="seckillActivity" :class="classList">
		<ul class="offers-section__list">
			<li class="offers-section__item">
				<picture class="clip-image-v4 offers-section__item-dot"><img src="@/assets/icons/dot.svg"></picture>
				{{ $t('每次限购') }} {{ seckillActivity.singleLimitCount }}
			</li>
			<li class="offers-section__item">
				<picture class="clip-image-v4 offers-section__item-dot"><img src="@/assets/icons/dot.svg"></picture>
				{{ $t('限量') }} {{ seckillActivity.stock }}
			</li>
			<li class="offers-section__item">
				<picture class="clip-image-v4 offers-section__item-dot"><img src="@/assets/icons/dot.svg"></picture>
				{{ $t('剩余') }}
				<el-progress class="inline-block w-2/4 ml-2" :percentage="100 * (seckillActivity.stock / seckillActivity.totalStock)" :text-inside="true" :stroke-width="16">
					{{ seckillActivity.stock }}/{{ seckillActivity.totalStock }}
				</el-progress>
			</li>
		</ul>
	</section>
	<section v-if="combinationActivity" :class="classList">
		<ul class="offers-section__list">
			<li class="offers-section__item">
				<picture class="clip-image-v4 offers-section__item-dot"><img src="@/assets/icons/dot.svg"></picture>
				{{ $t('每次限购') }} {{ combinationActivity.singleLimitCount }}
			</li>
			<li class="offers-section__item">
				<picture class="clip-image-v4 offers-section__item-dot"><img src="@/assets/icons/dot.svg"></picture>
				{{ $t('限量') }} {{ combinationActivity.totalLimitCount }}
			</li>
			<li class="offers-section__item">
				<picture class="clip-image-v4 offers-section__item-dot"><img src="@/assets/icons/dot.svg"></picture>
				{{ $t('最少成团人数', { number: combinationActivity.userSize }) }}
			</li>
		</ul>
	</section>
	<CombinationRecord v-if="combinationActivity" :class="classList" @click="emit('click', $event)" />
	<section v-if="bargainActivity" :class="classList">
		<ul class="offers-section__list">
			<li class="offers-section__item">
				<picture class="clip-image-v4 offers-section__item-dot"><img src="@/assets/icons/dot.svg"></picture>
				{{ $t('剩余库存') }}: {{ bargainActivity.stock }}
			</li>
			<li class="offers-section__item">
				<picture class="clip-image-v4 offers-section__item-dot"><img src="@/assets/icons/dot.svg"></picture>
				{{ $t('最少成团人数', { number: bargainActivity.helpMaxCount }) }}
			</li>
		</ul>
	</section>
</template>

<style scoped>

</style>
