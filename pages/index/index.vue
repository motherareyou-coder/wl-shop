<script setup lang="ts">
import AppExclusive from './components/AppExclusive.vue'
import AppFeature from './components/AppFeature.vue'
import AppSpecial from './components/AppSpecial.vue'
import AppSwiper from './components/AppSwiper.vue'
import { usePageSEO } from '~/composables/usePageSEO'


defineOptions({ name: 'Home' })
const { shortDomain, domain } = useRuntimeConfig().public
const route = useRoute()
const { t } = useI18n()

// 使用统一的 SEO composable
usePageSEO({
	title: t('home'),
	description: 'Shop unique surprise gifts for your loved ones. Customizable presents with free worldwide shipping. Perfect for anniversaries, birthdays, and special occasions.',
	keywords: 'surprise gifts, love gifts, romantic presents, anniversary gifts, birthday gifts, custom gifts, relationship gifts',
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
		<AppSpecial />
		<section class="site-grid site-grid--vertical-100 site-grid--full">
			<AppExclusive />
		</section>
	</main>
</template>

<style lang="scss">
@import url('./index.scss');
</style>

<style scoped lang="scss">
.site-main {
  margin: 0 auto;
  max-width: 2560px;
  width: 100%;
}
</style>
