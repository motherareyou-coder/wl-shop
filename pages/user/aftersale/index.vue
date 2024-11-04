<script setup lang="ts">
import PC from './components/PC.vue'
import Mobile from './components/Mobile.vue'

defineOptions({ name: 'AftersaleListCache' })
definePageMeta({
	keepalive: true,
	name: 'AftersaleListCache',
})
useHead({
	title: `${$t('Aftersale')} ${$t('appTitle')}`,
})

const appStore = useAppStore()
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
	/>
</template>
