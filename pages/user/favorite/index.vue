<script setup lang="ts">
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'

definePageMeta({
	title: 'Favorites',
	showBread: true,
})
const appStore = useAppStore()
useHead({
	title: `${$t('Favorites')} ${$t('appTitle')}`,
})
</script>

<template>
	<div class="favorite-list" :class="[appStore.isMobile ? 'bg-white' : '']">
		<div class="product-list__container site-container-1400">
			<component
				:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.favorite-list {
	@media screen and (max-width: 720px) {
		--grid-columns: 1;
		--grid-gap: 16px;
		--category-filter-width: 100px;
		--filter-font-size: 12px;
		--filter-item-margin-right: 8px;
		--cat-padding-horizontal: 6px;
	}
	@media screen and (min-width: 721px) and (max-width: 1024px) {
		--grid-columns: 3;
		--grid-gap: 8px;
		--category-filter-width: 100px;
		--filter-font-size: 18px;
		--filter-item-margin-right: 24px;
		--cat-padding-horizontal: 8px;
	}
	@media screen and (min-width: 1025px) and (max-width: 1440px) {
		--grid-columns: 4;
		--grid-gap: 12px;
		--category-filter-width: 120px;
		--filter-font-size: 18px;
		--filter-item-margin-right: 24px;
		--cat-padding-horizontal: 8px;
	}
	@media screen and (min-width: 1441px) and (max-width: 1920px) {
		--grid-columns: 4;
		--grid-gap: 12px;
		--category-filter-width: 150px;
		--filter-font-size: 18px;
		--filter-item-margin-right: 24px;
		--cat-padding-horizontal: 10px;
	}
	@media screen and (min-width: 1921px) {
		--grid-columns: 4;
		--grid-gap: 16px;
		--category-filter-width: 180px;
		--filter-font-size: 18px;
		--filter-item-margin-right: 24px;
		--cat-padding-horizontal: 14px;
	}
	.product-list__container {
		margin: var(--grid-gap) auto;
		position: relative;
		@media screen and (max-width: 720px) {
			margin: 0 auto;
		}
	}
}
</style>
