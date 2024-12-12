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
			<svg height="0" width="0" style="display:block">
				<defs>
					<path id="svgBasePath" d="M0.5,0 C0.33401568541666665,0 0.1981686275,0.010623529416666666 0.103860784375,0.104845098125 C0.0095745098125,0.19905294124999998 0,0.334686275 0,0.500486275 C0,0.6662843145833334 0.0095745098125,0.801986275 0.10389999999999999,0.8962098041666667 C0.19821176479166666,0.9904627458333333 0.3340294125,1 0.5,1 C0.6659666666666667,1 0.801786275,0.9904627458333333 0.8961,0.8962098041666667 C0.99040784375,0.8019588229166666 1,0.6662843145833334 1,0.500486275 C1,0.33447451041666665 0.9902980395833333,0.19868627458333332 0.8957725499999999,0.10447843145833334 C0.8014196083333333,0.0104960784375 0.6657705875000001,0 0.5,0 Z" />
					<clipPath id="svgClipPath" clipPathUnits="objectBoundingBox">
						<use xlink:href="#svgBasePath" />
					</clipPath>
				</defs>
			</svg>
			<el-config-provider :locale="{ en, zh }[locale]" namespace="mi">
				<NuxtLayout>
					<NuxtPage :keepalive="appStore.isMobile" />
				</NuxtLayout>
			</el-config-provider>
		</Body>
	</Html>
</template>
