<script setup lang="ts">
import en from 'element-plus/es/locale/lang/en'
import zh from 'element-plus/es/locale/lang/zh-cn'

const route = useRoute()
const { t, locale } = useI18n()

const head = useLocaleHead({
	addDirAttribute: true,
	identifierAttribute: 'id',
	addSeoAttributes: true,
})

const title = computed(() =>
	route.meta.title
		? `${t(route.meta.title as string)} ${t('appTitle')}`
		: t('appTitle'),
)

useSeoMeta({
	title: title.value,
	ogTitle: title.value,
	description: 'This is my Shop site',
	ogDescription: 'This is my Shop site',
	//   ogImage: 'https://example.com/image.png',
	//   twitterCard: 'summary_large_image',
})

const appStore = useAppStore()
</script>

<template>
	<Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
		<Head>
			<Title>{{ title }}</Title>
			<template v-for="link in head.link" :key="link.id">
				<Link
					:id="link.id"
					:rel="link.rel"
					:href="link.href || '/'"
					:hreflang="link.hreflang"
				/>
			</template>
			<template v-for="meta in head.meta" :key="meta.id">
				<Meta
					:id="meta.id"
					:property="meta.property"
					:content="meta.content"
				/>
			</template>
		</Head>
		<Body>
			<el-config-provider :locale="{ en, zh }[locale]" namespace="mi">
				<NuxtLayout>
					<NuxtPage :keepalive="appStore.isMobile" />
				</NuxtLayout>
			</el-config-provider>
		</Body>
	</Html>
</template>
