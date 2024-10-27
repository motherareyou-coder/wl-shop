<!--
  * @Author: Reg Zhang<rexag.zhang@gmail.com>
  * @Date: 2024-09-02 15:55:41
  * @Description: 请输入描述
-->
<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

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

const { locale } = useI18n()
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
			<NuxtLayout>
				<el-config-provider :locale="{ en, zh }[locale]" namespace="mi">
					<NuxtPage />
				</el-config-provider>
			</NuxtLayout>
		</Body>
	</Html>
</template>
