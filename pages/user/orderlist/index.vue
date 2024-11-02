<script setup lang="ts">
import PC from './components/PC.vue'
import Mobile from './components/Mobile.vue'

defineOptions({ name: 'OrderListCache' })
definePageMeta({
	keepalive: true,
	name: 'OrderListCache',
})

const appStore = useAppStore()
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
	/>
</template>
