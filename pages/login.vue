<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-02 10:11:22
  * @Description: Login
-->
<script setup lang='ts'>
defineOptions({ name: 'Login' })

const { t } = useI18n()
useHead({
	title: `${t('login')} ${t('appTitle')}`,
	meta: [
		{ name: 'description', content: 'Login' },
	],
})
</script>

<template>
	<div>{{ $t('login') }}</div>
</template>

<style scoped lang='scss'></style>
