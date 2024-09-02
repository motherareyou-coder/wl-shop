<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-02 10:10:52
  * @Description: SmartHome
-->
<script setup lang='ts'>
defineOptions({ name: 'SmartHome' })

const { t } = useI18n()
useHead({
	title: `${t('smarthome')} ${t('appTitle')}`,
	meta: [
		{ name: 'description', content: 'Smart Home' },
	],
})
</script>

<template>
	<div>{{ $t('smarthome') }}</div>
</template>

<style scoped lang='scss'></style>
