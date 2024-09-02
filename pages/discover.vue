<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-02 10:11:22
  * @Description: Support
-->
<script setup lang='ts'>
defineOptions({ name: 'Support' })

const { t } = useI18n()
useHead({
	title: `${t('support')} ${t('appTitle')}`,
	meta: [
		{ name: 'description', content: 'Support' },
	],
})
</script>

<template>
	<div>{{ $t('support') }}</div>
</template>

<style scoped lang='scss'></style>
