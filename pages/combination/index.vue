<script setup lang="ts">
import type { CombinationActivity } from '~/types'

useHead({
	title: `${$t('拼团活动')} ${$t('appTitle')}`,
})

const appStore = useAppStore()

function getData<CombinationActivity>(params: any) {
	return $api<CombinationActivity>('promotion/combination-activity/page', {
		params,
	})
}
</script>

<template>
	<div class="site-container-1400 w-full mx-auto">
		<app-list :method="getData" row-key="id" class="combination-list">
			<template #default="{ row }: { row: CombinationActivity }">
				<nuxt-link :to="$path(`/product/${row.spuId}?combinationActivityId=${row.id}`)">
					<div class="combination-item flex bg-white rounded" :class="[appStore.isPC ? '' : 'mx-2']">
						<app-image :src="row.picUrl" :class="[appStore.isPC ? 'w-60 h-60' : 'w-28 h-28']" />
						<div class="flex flex-col justify-around flex-1 pl-0" :class="[appStore.isPC ? 'p-5' : 'p-2']">
							<div class=" my-1">
								{{ row.name }}
							</div>
							<span>
								<product-price :data="row.combinationPrice" />
								<del>
									<product-price :data="row.marketPrice" plain />
								</del>
							</span>
							<div class="flex items-center justify-between">
								<div class="flex flex-col text-sm">
									<span>{{ $t('拼团人数') }} : {{ row.userSize }}</span>
								</div>
								<el-button type="primary">
									{{ $t('去拼团') }}
								</el-button>
							</div>
						</div>
					</div>
				</nuxt-link>
			</template>
		</app-list>
	</div>
</template>

<style scoped>
.combination-list:deep>div>ul {
	grid-gap: var(--grid-gap);
	display: grid;
	gap: var(--grid-gap);
	grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
	margin: 20px 0;
	--grid-columns: 2;
	--grid-gap: 26px;

	@media screen and (max-width: 720px) {
		--grid-columns: 1;
		--grid-gap: 16px;
	}

	@media screen and (max-width: 720px) {
		--price-gap: 5px;
		--font-size-large: 16px;
		--font-size-small: 10px;
	}

	@media screen and (min-width: 721px) and (max-width: 1024px) {
		--price-gap: 4px;
		--font-size-large: 18px;
		--font-size-small: 14px;
	}

	@media screen and (min-width: 1025px) and (max-width: 1440px) {
		--price-gap: 8px;
		--font-size-large: 16px;
		--font-size-small: 12px;
	}

	@media screen and (min-width: 1441px) and (max-width: 1920px) {
		--price-gap: 12px;
		--font-size-large: 22px;
		--font-size-small: 16px;
	}

	@media screen and (min-width: 1921px) {
		--price-gap: 16px;
		--font-size-large: 28px;
		--font-size-small: 20px;
	}

	del {
		-webkit-margin-start: var(--price-gap);
		color: #999;
		font-size: var(--font-size-small);
		margin-left: var(--price-gap)
	}
}
</style>
