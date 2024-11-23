<script setup lang="ts">
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'

definePageMeta({
	title: 'My wallet',
	showBread: true,
})
const appStore = useAppStore()
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
	/>
</template>
