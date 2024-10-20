<script setup lang="ts">
import './index.scss'

defineOptions({ name: 'Home' })

const { t } = useI18n()
useHead({
	title: `${t('home')} ${t('appTitle')}`,
	meta: [{ name: 'description', content: 'shop home' }],
})
</script>

<template>
	<main class="site-main">
		<section class="site-grid site-grid--small-top site-grid--full">
			<AppSwiper />
		</section>
		<section class="site-grid site-grid--vertical-100 site-grid--full">
			<AppFeature />
		</section>
		<section class="site-grid site-grid--vertical-100 site-grid--full">
			<AppExclusive />
		</section>
	</main>
</template>

<style scoped lang="scss">
.site-main {
	margin: 0 auto;
	max-width: 2560px;
	width: 100%;
}
</style>
