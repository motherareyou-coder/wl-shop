<!--
 * @Author: Reg Zhang<rexag.zhang@gmail.com>
 * @Date: 2024-09-02 10:07:03
 * @Description: 网站首页
-->

<script setup lang="ts">
defineOptions({
	name: 'Home',
})

const { t } = useI18n()
useHead({
	title: `${t('home')} ${t('appTitle')}`,
	meta: [
		{ name: 'description', content: 'shop home' },
	],
})
</script>

<template>
	<main class="home-container">
		{{ $t('home') }}
	</main>
</template>

<style scoped lang="scss">
.home-container {
	flex-grow: 1;
    flex-shrink: 0;
	margin: 0 auto;
    max-width: 2560px;
    width: 100%;
}
</style>
