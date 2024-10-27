<script setup lang="ts">
defineOptions({ name: 'Login' })

const { t } = useI18n()
useHead({
	title: `${t('login')} ${t('appTitle')}`,
	meta: [{ name: 'description', content: 'Login' }],
})
</script>

<template>
	<div>{{ $t('login') }}</div>
</template>

<style scoped lang="scss"></style>
