<script setup lang="ts">
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'

defineOptions({ name: 'AftersaleListCache' })
definePageMeta({
	name: 'AftersaleListCache',
	showBread: true,
	title: 'AfterSales',
})
useHead({
	title: `${$t('AfterSales')} ${$t('appTitle')}`,
})

const appStore = useAppStore()
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
	/>
</template>
