<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-02 10:11:22
  * @Description: Cart
-->
<script setup lang='ts'>
defineOptions({ name: 'Cart' })

const { t } = useI18n()
useHead({
	title: `${t('cart')} ${t('appTitle')}`,
	meta: [
		{ name: 'description', content: 'Cart' },
	],
})
</script>

<template>
	<div>{{ $t('cart') }}</div>
</template>

<style scoped lang='scss'></style>
