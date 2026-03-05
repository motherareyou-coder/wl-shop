<script setup lang="ts">
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'
import { usePageSEO } from '~/composables/usePageSEO'

defineOptions({ name: 'OrderListCache' })
const route = useRoute()
const { shortDomain,domain } = useRuntimeConfig().public
const { t } = useI18n()

definePageMeta({
	name: 'OrderListCache',
	title: t('OrderList'),
	showBread: true,
})

// 使用统一的 SEO composable
usePageSEO({
	title: t('seo.orderList'),
	description: t('seo.desc.orderList'),
	keywords: 'order history, order tracking, my orders',
  noIndex: true, // 不需要被索引
})

const appStore = useAppStore()
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
	/>
</template>
