<script setup lang="ts">
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'

defineOptions({ name: 'AftersaleListCache' })
const route = useRoute()
const { shortDomain,domain } = useRuntimeConfig().public
definePageMeta({
	name: 'AftersaleListCache',
	showBread: true,
	title: 'AfterSales',
})
useHead({
  link: [{ rel: 'canonical', href: `${domain} ${route.path}`}],
	title: `${$t('AfterSales')} ${$t('appTitle')}`,
})

const appStore = useAppStore()
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
	/>
</template>
