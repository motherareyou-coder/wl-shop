<script setup lang="ts">
import PC from './components/PC.vue'
import Mobile from './components/Mobile.vue'

const appStore = useAppStore()
</script>

<template>
	<div>
		<component :is="appStore.isPC ? PC : Mobile" />
	</div>
</template>
