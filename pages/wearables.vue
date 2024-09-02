<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-02 10:10:13
  * @Description: Wearables
-->
<script setup lang='ts'>
defineOptions({ name: 'Wearables' })

const { t } = useI18n()
useHead({
	title: `${t('wearables')} ${t('appTitle')}`,
	meta: [
		{ name: 'description', content: 'Wearables' },
	],
})
</script>

<template>
	<div>{{ $t('wearables') }}</div>
</template>

<style scoped lang='scss'></style>
