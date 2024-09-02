<!--
 * @Author: Reg Zhang<rexag.zhang@gmail.com>
 * @Date: 2024-09-02 10:07:31
 * @Description: 商品页
-->

<script setup lang='ts'>
defineOptions({ name: 'Store' })

const { t } = useI18n()
useHead({
	title: `${t('store')} ${t('appTitle')}`,
	meta: [
		{ name: 'description', content: 'Store' },
	],
})
</script>

<template>
	<div>{{ $t('store') }}</div>
</template>

<style lang='scss' scoped></style>
