<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-02 10:11:22
  * @Description: Discover
-->
<script setup lang='ts'>
defineOptions({ name: 'Discover' })

const { t } = useI18n()
useHead({
	title: `${t('discover')} ${t('appTitle')}`,
	meta: [
		{ name: 'description', content: 'Discover' },
	],
})
</script>

<template>
	<div>{{ $t('discover') }}</div>
</template>

<style scoped lang='scss'></style>
