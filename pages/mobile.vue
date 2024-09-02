<!--
 * @Author: Reg Zhang<rexag.zhang@gmail.com>
 * @Date: 2024-09-02 10:07:57
 * @Description: 手机页
-->

<script setup lang='ts'>
defineOptions({ name: 'Mobile' })

const { t } = useI18n()
useHead({
	title: `${t('mobile')} ${t('appTitle')}`,
	meta: [
		{ name: 'description', content: 'Mobile' },
	],
})
</script>

<template>
	<div>{{ $t('mobile') }}</div>
</template>

<style lang='scss' scoped></style>
