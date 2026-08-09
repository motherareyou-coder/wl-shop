<script setup lang="ts">
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'

defineOptions({ name: 'MyTravelCache' })
const route = useRoute()
const { domain } = useRuntimeConfig().public
definePageMeta({
	name: 'MyTravelCache',
	title: 'My Travel Service',
	showBread: true,
})
useHead({
	link: [{ rel: 'canonical', href: `${domain}${route.path}` }],
	title: `${$t('My Travel Service')} ${$t('appTitle')}`,
})

const appStore = useAppStore()
</script>

<template>
	<component
		:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
	/>
</template>
