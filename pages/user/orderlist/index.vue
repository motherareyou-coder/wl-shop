<script setup lang="ts">
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'

defineOptions({ name: 'OrderListCache' })
const route = useRoute()
const { shortDomain,domain } = useRuntimeConfig().public
definePageMeta({
	name: 'OrderListCache',
	title: 'OrderList',
	showBread: true,
})
useHead({
  link: [{ rel: 'canonical', href: `${domain} ${route.path}`}],
	title: `${$t('OrderList')} ${$t('appTitle')}`,
})

const appStore = useAppStore()
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
	/>
</template>
