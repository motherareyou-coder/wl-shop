<script setup lang="ts">
import type { BargainActivity } from '~/types'

const { shortDomain, domain } = useRuntimeConfig().public
const route = useRoute()
const { gtag } = useGtag()
// 砍价活动页面埋点
gtag('event', 'screen_view', {
	app_name: shortDomain,
	screen_name: 'bargin-list',
})

useHead({
	link: [{ rel: 'canonical', href: `${domain}${route.path}` }],
	title: `${$t('Bargin Event')} ${$t('appTitle')}`,
})
const appStore = useAppStore()

function getData<BargainActivity>(params: any) {
	return $api<BargainActivity>('promotion/bargain-activity/page', {
		params,
	})
}
</script>

<template>
	<section class="site-grid site-grid--none site-grid--full">
		<div
			class="site-banner site-banner--dark site-banner--right site-banner--full site-banner--links site-banner--links--undefined site-banner--links--style-1"
		>
			<img v-if="appStore.isPC" class="site-banner__image" alt="bargain" src="@/assets/imgs/daily-picks-banner.webp">
			<img
				v-else-if="appStore.isMobile" class="site-banner__image" alt="bargain"
				src="@/assets/imgs/daily-picks-banner--mobile.webp"
			>
		</div>
	</section>
	<div class="site-container-1400 w-full mx-auto">
		<app-list :method="getData" row-key="id" class="bargin-list">
			<template #default="{ row }: { row: BargainActivity }">
				<li>
					<nuxt-link :to="$path(`/product/${row.spuId}?bargainActivityId=${row.id}`)">
						<div class="bargin-item flex bg-white rounded" :class="[appStore.isPC ? '' : 'mx-2']">
							<app-image :src="row.picUrl" :class="[appStore.isPC ? 'w-60 h-60' : 'w-28 h-28']" :alt="row.name" />
							<div class="flex flex-col justify-around flex-1 pl-0" :class="[appStore.isPC ? 'p-5' : 'p-2']">
								<div class=" my-1">
									{{ row.name }}
								</div>
								<div>
									<div class="flex  my-2 text-sm " :class="appStore.isPC ? 'items-center' : 'flex-col '">
										<app-time :data="row.startTime" />
										<span v-if="appStore.isPC">-</span>
										<app-time :data="row.endTime" />
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm">
											{{ $t('最低价') }}:
											<product-price :data="row.bargainMinPrice" />
										</span>
										<el-button type="primary">
											{{ $t('参与砍价') }}
										</el-button>
									</div>
								</div>
							</div>
						</div>
					</nuxt-link>
				</li>
			</template>
		</app-list>
	</div>
</template>

<style>
.bargin-list {
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
}
</style>
