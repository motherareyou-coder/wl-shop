<script setup>
import AddressList from './checkout/components/AddressList.vue'
import { usePageSEO } from '~/composables/usePageSEO'

const { t } = useI18n()

definePageMeta({
	title: t('Delivery address'),
	showBread: true,
})

// 隐私页面，不允许搜索引擎抓取
usePageSEO({
	title: t('seo.deliveryAddress'),
	description: t('seo.desc.deliveryAddress'),
	noIndex: true, // 隐私页面不索引
})
</script>

<template>
	<section class="user-address--wrapper">
		<div class="user-address">
			<div class="page-headings">
				<h1 class="page-headings__title" fmp-c="1">
					{{ $t('Delivery address') }}
				</h1>
			</div>
			<div class="user-address__list-wrapper">
				<AddressList class="user-address__list" />
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@import url('./address.scss');
</style>
